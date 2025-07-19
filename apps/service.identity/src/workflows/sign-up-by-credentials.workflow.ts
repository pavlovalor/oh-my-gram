import { type WorkflowHandler, EmailTakenException, PhoneNumberTakenException, SignUpWithCredentialsCommand } from '@omg/message-registry'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { IdentityDatabaseClientInjectionToken } from '~/app/app.constants'
import { PostgresClient } from '@omg/postgres-module'
import { Schema } from '@omg/identity-postgres-schema'
import { ApplicationService } from '~/app/app.service'
import * as color from 'cli-color'


@Injectable()
export class SignUpByCredentialsWorkflow implements WorkflowHandler<SignUpWithCredentialsCommand> {
  private readonly logger = new Logger(SignUpByCredentialsWorkflow.name)

  constructor(
    @Inject(IdentityDatabaseClientInjectionToken)
    private readonly postgresClient: PostgresClient<typeof Schema>,
    private readonly applicationService: ApplicationService,
  ) {}


  async execute({ payload }: SignUpWithCredentialsCommand) {
    this.logger.verbose('Received a command')

    const passwordHashValue = this.applicationService.generatePasswordHash(payload.password)
    const isEmail = payload.login.includes('@')

    this.logger.debug(`Generated hash: ${color.yellow(`${payload.password} --> ${passwordHashValue}`)}`)
    this.logger.debug(`Login method: ${color.yellow(isEmail ? 'email' : 'phone number') + `[${payload.login}]`}`)
    this.logger.verbose('Initiating a transaction')

    return await this.postgresClient.transaction(async transactionClient => {
      const [identity] = await transactionClient
        .insert(Schema.identityTable)
        .values({})
        .returning()

      this.logger.debug(`Created identity with id: ${color.yellow(identity.id)}`)

      await Promise.all([
        transactionClient
          .insert(Schema.passwordHashTable)
          .values({ identityId: identity.id, value: passwordHashValue })
          .returning(),
        transactionClient
          .insert(isEmail ? Schema.emailTable : Schema.phoneNumberTable)
          .values({ identityId: identity.id, value: payload.login })
      ])

      this.logger.verbose('Login method saved')
      this.logger.verbose('Transaction complete')

      return { identityId: identity.id }
    }).catch(exception => {
      this.logger.error('Rolling back changes')
      this.logger.error(exception)

      if (exception?.cause?.['constraint_name'] === 'email_value_unique')
        throw new EmailTakenException()

      if (exception?.cause?.['constraint_name'] === 'phone_number_value_unique')
        throw new PhoneNumberTakenException()

      throw exception
    })
  }
}
