import { AccessTokenLifetime, RefreshTokenLifetime } from './constants'
import { RefreshSessionCommand, WorkflowHandler } from '@omg/message-registry'
import { IdentityDatabaseClientInjectionToken } from '~/app/app.constants'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ApplicationService } from '~/app/app.service'
import { PostgresClient } from '@omg/postgres-module'
import { Schema } from '@omg/identity-postgres-schema'

@Injectable()
export class RefreshSessionWorkflow implements WorkflowHandler<RefreshSessionCommand> {
  private readonly logger = new Logger(RefreshSessionWorkflow.name)

  constructor(
    @Inject(IdentityDatabaseClientInjectionToken)
    private readonly postgresClient: PostgresClient<typeof Schema>,
    private readonly applicationService: ApplicationService,
  ) {}


  async execute({ payload, meta }: RefreshSessionCommand) {
    this.logger.verbose('Received a command')

    return {
      refreshToken: {
        value: '',
        ttl: 0,
      },
      accessToken: {
        value: '',
        ttl: 0
      }
    }

    // const [session] = await transactionClient
    //   .insert(Schema.sessionTable)
    //   .values({
    //     identityId: identity.id,
    //     refreshToken: this.applicationService.generateRefreshToken(32), // TODO: use 64, 128
    //     expiresAt: dayjs().add(RefreshTokenLifetime).toDate(),
    //   })
    //   .returning()

    // return {
    //   accessToken: {
    //     ttl: AccessTokenLifetime.asSeconds(),
    //     value: await this.authzService.encodeJWT({
    //       ttl: AccessTokenLifetime.asSeconds(),
    //       iat: session.updatedAt ?? session.createdAt,
    //       sat: session.createdAt,
    //       uid: session.identityId,
    //       sid: session.id,
    //       rlm: 'public' // TODO
    //     })
    //   },
    //   refreshToken: {
    //     ttl: RefreshTokenLifetime.asSeconds(),
    //     value: session.refreshToken,
    //   },
    // }
  }
}
