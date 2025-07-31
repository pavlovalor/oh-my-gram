
// Global
import { Module, Provider, type ClassProvider, type DynamicModule, type FactoryProvider, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { APP_GUARD, Reflector } from '@nestjs/core'
import { RedisModule } from '@liaoliaots/nestjs-redis'

// Local
import { AuthzModuleConfigInjectionToken } from './authz.constants'
import { AuthzModuleAsyncOptions } from './authz.types'
import { JwtRedisRepository } from './repositories/jwt.repository'
import { JwkRedisRepository } from './repositories/jwk.repository'
import { AuthzMiddleware } from './authz.middleware'
import { AuthzService } from './authz.service'
import { AuthzGuard } from './authz.guard'


@Module({})
export class AuthzModule implements NestModule {

  static async registerAsync(
    options: AuthzModuleAsyncOptions,
  ): Promise<DynamicModule> {
    const AuthzModuleConfigInjection: FactoryProvider = {
      provide: AuthzModuleConfigInjectionToken,
      useFactory: options.useFactory,
      inject: options.inject || []
    }

    const AuthzGuardInjection: ClassProvider<AuthzGuard> = {
      useClass: AuthzGuard,
      provide: APP_GUARD,
    }

    return {
      module: AuthzModule,
      providers: [
        Reflector,
        AuthzService,
        JwtRedisRepository,
        JwkRedisRepository,
        AuthzModuleConfigInjection,
        options.interceptHttp && AuthzGuardInjection,
      ].filter(p => p) as Provider[],
      exports: [
        AuthzService,
      ],
      imports: [
        RedisModule,
      ]
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthzMiddleware).forRoutes('*')
  }
}
