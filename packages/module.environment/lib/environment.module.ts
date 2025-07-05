/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigService, ConfigModule } from '@nestjs/config'
import { type EnvironmentModuleOptions } from './environment.types'
import { Global, Logger, Module, type DynamicModule } from '@nestjs/common'
import { EnvironmentService } from './environment.service'
import { injectValuesFromFileIfExist, provideEnvironmentValidation, } from './environment.helpers'


/**
 * A type-safe wrapper around NestJS's `EnvironmentModule`, enhanced to support Zod-based
 * environment validation without needing to manually define a validate function.
 *
 * @example
 * ```ts
 * const schema = z.object({
 *   PORT: z.coerce.number().default(3000),
 *   NODE_ENV: z.enum(['development', 'production', 'test']),
 * });
 *
 * @Module({
 *   imports: [
 *     EnvironmentModule.forRoot({
 *       schema,
 *       isGlobal: true,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Global()
@Module({})
export class EnvironmentModule extends ConfigModule {
  /**
   * Registers the EnvironmentModule with the provided Zod schema.
   *
   * @template ValidationOptions - Type representing the shape of validated environment variables
   * @param options - The module options, including the Zod schema and standard EnvironmentModule settings
   * @returns A dynamic module with validated configuration
   */
  static async forRoot<ValidationOptions extends Record<string, any>>(
    { schema, ...rest }: EnvironmentModuleOptions<ValidationOptions>,
  ): Promise<DynamicModule> {
    return {
      module: EnvironmentModule,
      providers: [ConfigService, EnvironmentService],
      imports: [
        ConfigModule.forRoot({
          validate() {
            injectValuesFromFileIfExist()
            const validEnv = provideEnvironmentValidation(process.env, schema)
            if (!validEnv) {
              Logger.error('Failed to validate env. Terminating process')
              process.exit(1)
            }

            return validEnv!
          },
          isGlobal: true,
          ...rest,
        }),
      ],
      exports: [ConfigModule, ConfigService, EnvironmentService],
    }
  }
}
