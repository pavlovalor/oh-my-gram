// Global
import { ClientsModule, Transport } from '@nestjs/microservices'
import { RedisModule } from '@liaoliaots/nestjs-redis'
import { Module } from '@nestjs/common'

// Local
import { EnvironmentModule, EnvironmentService } from '@omg/environment-module'
import { NatsClientInjectionToken } from './app.constants'
import { ApplicationController } from './app.controller'
import { ApplicationService } from './app.service'
import { EnvironmentSchema } from './app.env-schema'
import { ZodTransformPipe } from '@omg/utils-module'
import { AuthController } from '~/controllers/auth.controller'
import { AuthzModule } from '@omg/authz-module'


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
      }),
    }]),

    AuthzModule.registerAsync({
      interceptHttp: true,
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: (envService: EnvironmentService<typeof EnvironmentSchema>) => ({
        pepper: envService.get('PEPPER'),
      })
    })
  ],
  controllers: [
    ApplicationController,
    AuthController,
  ],
  providers: [
    ApplicationService,
    ZodTransformPipe.asProvider(),
  ],
})
export class ApplicationModule {}
