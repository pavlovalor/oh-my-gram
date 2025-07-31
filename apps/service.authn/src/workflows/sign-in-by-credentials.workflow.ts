
import { Inject, Injectable, Logger } from '@nestjs/common'
import { PostgresClient } from '@omg/postgres-module'
import { IdentityDatabaseClientInjectionToken } from '~/app/app.constants'
import { Schema } from '@omg/identity-postgres-schema'
import { CredentialsDoNotMatchException, SignInWithCredentialsCommand, type WorkflowHandler } from '@omg/message-registry'
import { AccessTokenLifetime, RefreshTokenLifetime } from './constants'
import { ApplicationService } from '~/app/app.service'
import { AuthzService } from '@omg/authz-module'
import { and, eq } from 'drizzle-orm'
import * as dayjs from 'dayjs'
import * as color from 'cli-color'


@Injectable()
export class SignInByCredentialsWorkflow implements WorkflowHandler<SignInWithCredentialsCommand> {
  private readonly logger = new Logger(SignInByCredentialsWorkflow.name)

  constructor(
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

    const [session] = await this.postgresClient.transaction(async transactionClient => {
      const [identity] = await transactionClient
        .select()
        .from(Schema.identityCredentialsView)
        .where(and(
          eq(Schema.identityCredentialsView.passwordHash, passwordHashValue),
          eq(isEmail ? Schema.identityCredentialsView.email : Schema.identityCredentialsView.phoneNumber, payload.login),
        ))

      if (!identity) {
        this.logger.error('No records match specified credentials')
        throw new CredentialsDoNotMatchException()
      }

      this.logger.log('Establishing a transaction')

      return await transactionClient
        .insert(Schema.sessionTable)
        .values({
          identityId: identity.id,
          refreshToken: this.applicationService.generateRefreshToken(32), // TODO: use 64, 128
          expiresAt: dayjs().add(RefreshTokenLifetime).toDate(),
        })
        .returning()
    })

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
