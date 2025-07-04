import { object, string, coerce, type infer as Infer } from 'zod'
import * as path from 'node:path'
import * as fs from 'node:fs'


export const EnvironmentSchema = object({
  ROUTES_PREFIX: string()
    .optional()
    .describe('Global app api endpoints prefix. Forcibly set to `api` if public folder present'),

  PORT: coerce.number()
    .default(8080)
    .describe('Application port'),

  HOST: string()
    .optional()
    .default('localhost'),

  SSL: coerce.boolean()
    .optional()
    .default(false),

  DOCS_DIR: string()
    .default('documentation')
    .describe('Directory name for the documentation endpoints'),

  NATS_URL: string()
    .describe('NATS communication URL'),

  BASE_URL: string()
    .optional()
    .describe('Contains app base URL'),

  DOCS_PATH: string()
    .optional()
    .describe('Contains full URL of the Open API UI location'),

  PUBLIC_DIR: string()
    .optional()
    .describe('Points at public folder. Indicates if the app serves frontend bundle'),
}).refine(data => {
  const publicDirectory = path.resolve(__dirname, '../public')
  const servesFrontendBundle = fs.existsSync(path.resolve(publicDirectory, './index.html'))
  const protocol = data.HOST === 'localhost' ? 'http' : data.SSL ? 'https' : 'http'

  data.BASE_URL ??= `${protocol}://${data.HOST}:${data.PORT}`
  data.DOCS_PATH ??= `${data.BASE_URL}/${data.DOCS_DIR}`
  data.ROUTES_PREFIX ??= servesFrontendBundle ? 'api' : undefined
  data.PUBLIC_DIR = servesFrontendBundle ? publicDirectory : undefined
  return true
})

export type EnvType = Infer<typeof EnvironmentSchema>;
