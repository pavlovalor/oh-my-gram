import { AccessTokenLifetime, RefreshTokenLifetime } from './constants'
import { RefreshSessionCommand, WorkflowHandler, NoSessionFoundException, SessionRefreshedEvent } from '@omg/message-registry'
import { IdentityDatabaseClientInjectionToken, NatsClientInjectionToken } from '~/app/app.constants'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ApplicationService } from '~/app/app.service'
import { PostgresClient } from '@omg/postgres-module'
import { AuthzService } from '@omg/authz-module'
import { ClientProxy } from '@nestjs/microservices'
import { Schema } from '@omg/identity-postgres-schema'
import { and, eq } from 'drizzle-orm'
import * as dayjs from 'dayjs'


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

    const [session] = await this.postgresClient
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

    return {
      accessToken: {
        ttl: AccessTokenLifetime.asSeconds(),
        value: await this.authzService.encodeJWT({
          ttl: AccessTokenLifetime.asSeconds(),
          iat: session.updatedAt ?? session.createdAt,
          sat: session.createdAt,
          uid: session.identityId,
          sid: session.id,
          rlm: 'public' // TODO
        })
      },
      refreshToken: {
        ttl: RefreshTokenLifetime.asSeconds(),
        value: session.refreshToken,
      },
    }
  }
}
