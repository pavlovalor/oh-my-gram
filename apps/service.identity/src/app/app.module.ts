import { Module } from '@nestjs/common'
import { ApplicationController } from './app.controller'
import { ApplicationService } from './app.service'
import { EnvironmentModule, EnvironmentService } from '@omg/environment-module'
import { IdentityDatabaseClientInjectionToken } from './app.constants'
import { EnvironmentSchema } from './app.env-schema'
import { PostgresModule } from '@omg/postgres-module'
import { Schema } from '@omg/identity-postgres-schema'


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
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
