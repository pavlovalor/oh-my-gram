import { Inject, Injectable } from '@nestjs/common'
import { PostgresClient } from '@omg/postgres-module'
import { type ICase } from '@omg/utils-module'
import { IdentityDatabaseClientInjectionToken } from '~/app/app.constants'
import { Schema } from '@omg/identity-postgres-schema'
import { SignInWithCredentialsCommand } from '@omg/message-registry'

@Injectable()
export class SignInByCredentialsWorkflow implements ICase {
  constructor(
    @Inject(IdentityDatabaseClientInjectionToken)
    private readonly postgresClient: PostgresClient<typeof Schema>
  ) {}

  async execute({ payload, meta }: SignInWithCredentialsCommand) {
    console.log(payload, meta)
  }
}
