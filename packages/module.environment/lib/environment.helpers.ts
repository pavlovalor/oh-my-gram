import { Logger } from '@nestjs/common'
import { envFileNames } from './environment.constants'
import { type AnyEnvironmentSchema } from './environment.types'
import { type infer as Infer } from 'zod'
import * as path from 'node:path'
import * as fs from 'node:fs/promises'
import color from 'cli-color'


export interface ValidationOptions {
  /**
   * When `true`, the helper should terminate the Node.js process on failure.<br>
   * When `false` or omitted, the caller decides how to proceed.
   */
  terminateProcess?: boolean;
}

/**
 * Validate an arbitrary object (typically `process.env`) against a supplied
 * Zod schema and log a friendly report.
 *
 * @typeParam $Schema - A Zod object schema describing the expected shape of
 *                      the environment variables.
 *
 * @param envVariables - The raw variables to validate.  In practice use
 *                       `process.env`, but any `unknown` payload is accepted
 *                       for unit-testing.
 * @param schema       - The Zod schema that `envVariables` must satisfy.
 *
 * @returns A **strongly-typed object** that matches `schema` when validation
 *          succeeds.  If validation fails the function logs every issue and
 *          returns `never` (throws implicitly by falling through); callers
 *          can enforce their own failure strategy.
 *
 * @example
 * ```ts
 * const schema = z.object({
 *   PORT: z.coerce.number().int().positive(),
 *   NODE_ENV: z.enum(['development', 'production', 'test']),
 * });
 *
 * const env = provideEnvironmentValidation(process.env, schema);
 * // env is now typed as { PORT: number; NODE_ENV: 'development' | 'production' | 'test' }
 * ```
 */
export function provideEnvironmentValidation<$Schema extends AnyEnvironmentSchema>(envVariables: unknown, schema: $Schema) {
  const logger = new Logger('EnvironmentValidation')

  logger.verbose('Processing...')

  const result = schema.safeParse(envVariables)

  if (result.success) {
    logger.log('Env variables match the schema')
    return result.data as Infer<$Schema>  // Cast is safe because success === true
  }

  logger.error('Provided variables do not match required schema:')

  for (const error of result.error.errors) {
    const expected = 'expected' in error && error.expected as string
    const received = 'received' in error && error.received as string
    const message = error.message
    const path = error.path.join('.')

    const header = `${path}: ${message}`
    const explanation = expected && received  // Pretty “expected vs received” tail, if available
        && `. Expected ${color.yellow(expected)}${color.red(', got')} ${color.yellow(received)}`
    logger.error([header, explanation || ''].join(''))
  }
}


export async function provideEnvFilePaths(): Promise<string[]> {
  const accumulator = new Array<string>()

  for (const fileName of envFileNames) try {
    const absolutePath = path.join(process.cwd(), fileName)
    await fs.access(absolutePath, fs.constants.F_OK)
    accumulator.push(absolutePath)
  } catch (_exception: unknown) {}
  return accumulator
}
