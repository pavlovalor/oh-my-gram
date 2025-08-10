import { type WorkflowHandler, DropProfileCommand, MessageResponse } from '@omg/message-registry'
import { IdentityDatabaseClientInjectionToken } from '~/app/app.constants'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { PostgresClient } from '@omg/postgres-module'
import { Schema } from '@omg/profile-postgres-schema'
import { eq } from 'drizzle-orm'


@Injectable()
export class DropProfileWorkflow implements WorkflowHandler<DropProfileCommand> {
  private readonly logger = new Logger(DropProfileWorkflow.name)

  constructor(
    @Inject(IdentityDatabaseClientInjectionToken)
    private readonly postgresClient: PostgresClient<typeof Schema>,
  ) {}


  public async execute({ payload }: DropProfileCommand) {
    this.logger.verbose('Received a command')

    await this.postgresClient
      .delete(Schema.profileTable)
      .where(eq(Schema.profileTable.id, payload.id))

    // TODO: error mapping


    return {} satisfies MessageResponse<DropProfileCommand>
  }
}
