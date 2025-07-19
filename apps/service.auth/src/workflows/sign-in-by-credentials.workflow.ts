import { Inject, Injectable } from '@nestjs/common'
import { PostgresClient } from '@omg/postgres-module'
import { IdentityDatabaseClientInjectionToken } from '~/app/app.constants'
import { Schema } from '@omg/identity-postgres-schema'
import { CredentialsDoNotMatchException, SignInWithCredentialsCommand, type WorkflowHandler } from '@omg/message-registry'
import { ApplicationService } from '~/app/app.service'
import { and, eq } from 'drizzle-orm'


@Injectable()
export class SignInByCredentialsWorkflow implements WorkflowHandler<SignInWithCredentialsCommand> {
  constructor(
    @Inject(IdentityDatabaseClientInjectionToken)
    private readonly postgresClient: PostgresClient<typeof Schema>,
    private readonly applicationService: ApplicationService,
  ) {}


  async execute({ payload, meta }: SignInWithCredentialsCommand) {
    // TODO: Send event, checkup device fingerprint, include profile ids inside token payload
    const passwordHashValue = this.applicationService.generatePasswordHash(payload.password)
    const isEmail = payload.login.includes('@')

    const [session] = await this.postgresClient.transaction(async transactionClient => {
      const [identity] = await transactionClient
        .select()
        .from(Schema.identityCredentialsView)
        .where(and(
          eq(Schema.identityCredentialsView.passwordHash, passwordHashValue),
          eq(isEmail ? Schema.identityCredentialsView.email : Schema.identityCredentialsView.phoneNumber, payload.login),
        ))

      if (!identity) throw new CredentialsDoNotMatchException()

      return await transactionClient
        .insert(Schema.sessionTable)
        .values({
          identityId: identity.id,
          refreshToken: this.applicationService.generateRefreshToken(32),
          expiresAt: new Date(),
        })
        .returning()
    })

    return {
      accessToken: {
        ttl: 42,
        value: '234'
      },
      refreshToken: {
        ttl: 42,
        value: session.refreshToken,
      },
    }
  }
}
