import { RefreshSessionCommand, WorkflowHandler, NoSessionFoundException, SessionRefreshedEvent } from '@omg/message-registry'
import { IdentityDatabaseClientInjectionToken, NatsClientInjectionToken } from '~/app/app.constants'
import { AccessTokenLifetime, RefreshTokenLifetime } from './constants'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ApplicationService } from '~/app/app.service'
import { PostgresClient } from '@omg/postgres-module'
import { AuthzService } from '@omg/authz-module'
import { ClientProxy } from '@nestjs/microservices'
import { Schema } from '@omg/identity-postgres-schema'
import { and, eq } from 'drizzle-orm'
import * as dayjs from 'dayjs'
import * as color from 'cli-color'


@Injectable()
export class RefreshSessionWorkflow implements WorkflowHandler<RefreshSessionCommand> {
  private readonly logger = new Logger(RefreshSessionWorkflow.name)

  constructor(
    @Inject(NatsClientInjectionToken)
    private readonly natsClient: ClientProxy,
    @Inject(IdentityDatabaseClientInjectionToken)
    private readonly postgresClient: PostgresClient<typeof Schema>,
    private readonly applicationService: ApplicationService,
    private readonly authzService: AuthzService,
  ) {}


  async execute({ payload, meta }: RefreshSessionCommand) {
    this.logger.verbose('Received a command')

    if (payload.profileId) {
      this.logger.verbose('Checking provided "profileId"')
      // TODO: query profile from profile service; check if "identityId" matches
    }

    const session = await this.postgresClient.transaction(async transactionClient => {
      this.logger.verbose('Updating session')

      const [session] = await transactionClient
        .update(Schema.sessionTable)
        .set({
          refreshToken: this.applicationService.generateRefreshToken(32), // TODO: use 64, 128
          expiresAt: dayjs().add(RefreshTokenLifetime).toDate(),
          updatedAt: dayjs().toDate(),
        })
        .where(and(
          eq(Schema.sessionTable.identityId, meta.identityId ?? ''),
          eq(Schema.sessionTable.refreshToken, payload.refreshToken),
        ))
        .returning()

      if (payload.profileId) {
        this.logger.verbose('Updating identity\'s "lastUsedProfileId"')
        await transactionClient
          .update(Schema.identityTable)
          .set({ lastUsedProfileId: meta.profileId })
          .where(eq(Schema.identityTable.id, meta.identityId!))
      }

      return session
    })

    if (!session) {
      this.logger.error(`No session found`)
      throw new NoSessionFoundException({
        identityId: meta.identityId,
        refreshToken: payload.refreshToken,
      })
    }

    void await new SessionRefreshedEvent({
      sessionId: session.id
    }, {
      identityId: meta.identityId,
      causationId: meta.id!,
      correlationId: meta.correlationId!,
    }).passVia(this.natsClient)

    this.logger.verbose('Checking challenges and restrictions')

    const identity = await this.postgresClient.query.identityTable.findFirst({
      where: fields => eq(fields.id, meta.identityId!),
      with: {
        challenges: true,
        // restrictions: true,
      }
    })

    this.logger.debug(`Challenges found: ${color.yellow(identity!.challenges.length)}`)
    // TODO this.logger.debug(`Restrictions found: ${color.yellow(identity!.restrictions.length)}`)
    this.logger.verbose('Constructing response token pair')

    return {
      accessToken: {
        ttl: AccessTokenLifetime.asSeconds(),
        value: await this.authzService.encodeJWT({
          sessionCreatedAt: dayjs(session.createdAt),
          tokenCreatedAt: dayjs(session.updatedAt ?? session.createdAt),
          sessionId: session.id,
          timeToLive: AccessTokenLifetime.asSeconds(),
        }, {
          roles: identity!.roles,
          identityId: session.identityId,
          profileId: undefined, // TODO
          challenges: identity!.challenges,
        })
      },
      refreshToken: {
        ttl: RefreshTokenLifetime.asSeconds(),
        value: session.refreshToken,
      },
    }
  }
}
