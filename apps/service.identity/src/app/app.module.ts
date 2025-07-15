// Global
import { EnvironmentModule, EnvironmentService } from '@omg/environment-module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PostgresModule } from '@omg/postgres-module'
import { Schema } from '@omg/identity-postgres-schema'
import { Module } from '@nestjs/common'

// Local
import { IdentityDatabaseClientInjectionToken, NatsClientInjectionToken } from './app.constants'
import { ApplicationController } from './app.controller'
import { ApplicationService } from './app.service'
import { EnvironmentSchema } from './app.env-schema'
import packageJson from '../../package.json'


@Module({
  imports: [
    EnvironmentModule.forRoot({
      schema: EnvironmentSchema,
      cache: true,
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
          queue: packageJson.name,
        }
      })
    }])
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
