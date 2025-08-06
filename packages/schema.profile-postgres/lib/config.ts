/**
 * Drizzle Kit configuration for database migrations.
 *
 * Loads environment variables from .env files, validates required environment
 * schema variables, adjusts the Postgres URL for SSL if needed, and exports
 * the migration settings.
 */
import { resolve } from 'node:path'
import { defineConfig } from 'drizzle-kit'
import { injectValuesFromFileIfExist, provideEnvironmentValidation } from '@omg/environment-module'
import { object, coerce, string } from 'zod'
import { Logger } from '@nestjs/common'
import * as color from 'cli-color'


injectValuesFromFileIfExist()
const logger = new Logger('OrmConfigurator')
const env = provideEnvironmentValidation(process.env, object({
  POSTGRES_URL: string().min(1),
  POSTGRES_SSL: coerce.boolean().default(false),
}))

if (!env) process.exit(1) // Terminate if environment validation failed
if (env.POSTGRES_SSL && !env.POSTGRES_URL!.includes('sslmode'))
  env.POSTGRES_URL += '?sslmode=require' // Apply SSH param if required

logger.log(`Targeting ${color.blue(env.POSTGRES_URL)}`)
logger.log(`SSL setting ${color.yellow(env.POSTGRES_SSL ? 'Enabled' : 'Disabled')}`)

/**
 * The Drizzle Kit export configuration.
 * @type {import('drizzle-kit').Config}
 */
export default defineConfig({
  schema: resolve(__dirname, './schema.ts'),
  out: resolve(__dirname, './migrations'),
  dialect: 'postgresql',
  dbCredentials: {
    url: env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  },
})
