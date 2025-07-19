import { Inject, Injectable } from '@nestjs/common'
import { PostgresClient } from '@omg/postgres-module'
import { IdentityDatabaseClientInjectionToken } from '~/app/app.constants'
import { Schema } from '@omg/identity-postgres-schema'
import { RefreshSessionCommand, WorkflowHandler } from '@omg/message-registry'
import { ApplicationService } from '~/app/app.service'


@Injectable()
export class RefreshSessionWorkflow implements WorkflowHandler<RefreshSessionCommand> {
  constructor(
    @Inject(IdentityDatabaseClientInjectionToken)
    private readonly postgresClient: PostgresClient<typeof Schema>,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute({ payload, meta }: RefreshSessionCommand) {


    return {
      accessToken: {
        ttl: 42,
        value: '234'
      },
      refreshToken: {
        ttl: 42,
        value: '...',
      },
    }
  }
}
