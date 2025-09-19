
import { CredentialsDoNotMatchException, SessionCreatedEvent, SignInWithCredentialsCommand, type WorkflowHandler } from '@omg/message-registry'
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
export class SignInByCredentialsWorkflow implements WorkflowHandler<SignInWithCredentialsCommand> {
  private readonly logger = new Logger(SignInByCredentialsWorkflow.name)

  constructor(
    @Inject(NatsClientInjectionToken)
    private readonly natsClient: ClientProxy,
    @Inject(IdentityDatabaseClientInjectionToken)
    private readonly postgresClient: PostgresClient<typeof Schema>,
    private readonly applicationService: ApplicationService,
    private readonly authzService: AuthzService,
  ) {}


  async execute({ payload, meta }: SignInWithCredentialsCommand) {
    this.logger.verbose('Received a command')

    // TODO: Send event, checkup device fingerprint, include profile ids inside token payload
    const passwordHashValue = this.applicationService.generatePasswordHash(payload.password)
    const isEmail = payload.login.includes('@')

    this.logger.debug(`Generated hash: ${color.yellow(`${payload.password} --> ${passwordHashValue}`)}`)
    this.logger.debug(`Login method: ${color.yellow(isEmail ? 'email' : 'phone number') + `[${payload.login}]`}`)
    this.logger.verbose('Initiating a transaction')

    const [session, identityId] = await this.postgresClient.transaction(async transactionClient => {
      const [identity] = await transactionClient
        .select()
        .from(Schema.identityCredentialsView)
        .where(and(
          eq(Schema.identityCredentialsView.passwordHash, passwordHashValue),
          eq(isEmail ? Schema.identityCredentialsView.email : Schema.identityCredentialsView.phoneNumber, payload.login),
        ))

      if (!identity) {
        this.logger.error('No records match specified credentials')
        throw new CredentialsDoNotMatchException({
          loginType: isEmail ? 'email' : 'phone-number',
        })
      }

      this.logger.verbose('Establishing a transaction')

      const [session] = await transactionClient
        .insert(Schema.sessionTable)
        .values({
          identityId: identity.id,
          refreshToken: this.applicationService.generateRefreshToken(32), // TODO: use 64, 128
          expiresAt: dayjs().add(RefreshTokenLifetime).toDate(),
        })
        .returning()

      return [session, identity.id] as const
    })

    void await new SessionCreatedEvent({
      sessionId: session.id
    }, {
      identityId: meta.identityId,
      causationId: meta.id!,
      correlationId: meta.correlationId!,
    }).passVia(this.natsClient)

    this.logger.verbose('Checking challenges and restrictions')

    const identity = await this.postgresClient.query.identityTable.findFirst({
      where: fields => eq(fields.id, identityId),
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
          timeToLive: AccessTokenLifetime.asSeconds(),
          tokenCreatedAt: dayjs(session.updatedAt ?? session.createdAt),
          sessionCreatedAt: dayjs(session.createdAt),
          sessionId: session.id,
        }, {
          roles: identity!.roles,
          challenges: identity!.challenges,
          identityId: identity!.id,
        })
      },
      refreshToken: {
        ttl: RefreshTokenLifetime.asSeconds(),
        value: session.refreshToken,
      },
    }
  }
}
