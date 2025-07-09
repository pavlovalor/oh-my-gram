import { type DynamicModule, Module, Provider } from '@nestjs/common'
import { type PostgresModuleAsyncOptions, PostgresModuleOptions } from 'postgres.types'
import { PostgresModuleConfigInjectionToken } from 'postgres.constants'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'


@Module({})
export class PostgresModule {
  static async registerAsync<$Injection extends any[]>(
    options: PostgresModuleAsyncOptions<$Injection>
  ): Promise<DynamicModule> {
    const config: Provider = {
      provide: PostgresModuleConfigInjectionToken,
      useFactory: options.useFactory,
      inject: options.inject || []
    }
    const client: Provider = {
      provide: options.name,
      inject: [PostgresModuleConfigInjectionToken],
      useFactory: (config: PostgresModuleOptions) => {
        const sqlClient = postgres(config.databaseUrl, {
          ssl: config.databaseSsl ? {
            // IMPORTANT: this is temporary measure. REMOVE IT right after the AWS setup is secure
            rejectUnauthorized: false,
          } : false,
          transform: {
            // TODO: figure out how to transform Date to DaysJS
            undefined: null,
          },
        })

        return drizzle(sqlClient, { schema: config.schema })
      }
    }

    return {
      module: PostgresModule,
      providers: [
        config,
        client,
      ],
      exports: [
        PostgresModuleConfigInjectionToken,
      ]
    }
  }
}
