// Global
import { EnvironmentModule, EnvironmentService } from '@omg/environment-module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PostgresModule } from '@omg/postgres-module'
import { RedisModule } from '@liaoliaots/nestjs-redis'
import { AuthzModule } from '@omg/authz-module'
import { Schema } from '@omg/identity-postgres-schema'
import { Module } from '@nestjs/common'

// Local
import { IdentityDatabaseClientInjectionToken, NatsClientInjectionToken } from './app.constants'
import { ApplicationController } from './app.controller'
import { EnvironmentSchema } from './app.env-schema'
import { ApplicationService } from './app.service'

// Workflows
import { SignInByCredentialsWorkflow } from '~/workflows/sign-in-by-credentials.workflow'
import { RefreshSessionWorkflow } from '~/workflows/refresh-session.workflow'


@Module({
  imports: [
    EnvironmentModule.forRoot({
      schema: EnvironmentSchema,
      cache: true,
    }),

    RedisModule.forRootAsync({
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: (envService: EnvironmentService<typeof EnvironmentSchema>) => ({
        config: { url: envService.get('REDIS_URL') },
        readyLog: true,
      })
    }),

    PostgresModule.registerAsync({
      name: IdentityDatabaseClientInjectionToken,
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: (envService: EnvironmentService<typeof EnvironmentSchema>) => ({
        databaseUrl: envService.get('POSTGRES_URL'),
        databaseSsl: envService.get('POSTGRES_SSL'),
        schema: Schema,
      }),
    }),

    ClientsModule.registerAsync([{
      name: NatsClientInjectionToken,
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: (envService: EnvironmentService<typeof EnvironmentSchema>) => ({
        transport: Transport.NATS,
        options: {
          servers: [envService.get('NATS_URL')],
        }
      })
    }]),

    AuthzModule.registerAsync({
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: (envService: EnvironmentService<typeof EnvironmentSchema>) => ({
        pepper: envService.get('PEPPER'),
      })
    }),
  ],
  controllers: [ApplicationController],
  providers: [
    ApplicationService,
    SignInByCredentialsWorkflow,
    RefreshSessionWorkflow,
  ],
})
export class ApplicationModule {}
