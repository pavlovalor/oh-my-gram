import { Inject, Injectable } from '@nestjs/common'
import { PostgresClient } from '@omg/postgres-module'
import { type ICase } from '@omg/utils-module'
import { IdentityDatabaseClientInjectionToken } from '~/app/app.constants'
import { Schema } from '@omg/identity-postgres-schema'
import { RefreshSessionCommand } from '@omg/message-registry'

@Injectable()
export class RefreshSessionWorkflow implements ICase {
  constructor(
    @Inject(IdentityDatabaseClientInjectionToken)
    private readonly postgresClient: PostgresClient<typeof Schema>
  ) {}

  async execute({ payload, meta }: RefreshSessionCommand) {
    console.log(payload, meta)
  }
}
