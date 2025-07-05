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
import { EnvironmentSchema } from '../../app/app.env-schema'


injectValuesFromFileIfExist()
const env = provideEnvironmentValidation(process.env, EnvironmentSchema.pick({
  POSTGRES_URL: true,
  POSTGRES_SSL: true,
}))

if (!env) process.exit(1) // Terminate if environment validation failed
if (env.POSTGRES_SSL && !env.POSTGRES_URL!.includes('sslmode'))
  env.POSTGRES_URL += '?sslmode=require' // Apply SSH param if required

/**
 * The Drizzle Kit export configuration.
 * @type {import('drizzle-kit').Config}
 */
export default defineConfig({
  schema: resolve(__dirname, './postgres.schema.ts'),
  out: resolve(__dirname, './migrations'),
  dialect: 'postgresql',
  dbCredentials: {
    url: env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  },
})
