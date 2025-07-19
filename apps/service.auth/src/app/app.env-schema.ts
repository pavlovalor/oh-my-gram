import { object, string, coerce, type infer as Infer } from 'zod'

export const EnvironmentSchema = object({
  NATS_URL: string()
    .describe('NATS communication URL'),

  REDIS_URL: string()
    .describe('Redis communication URL'),

  POSTGRES_URL: string().url(),

  POSTGRES_SSL: coerce.boolean().default(false),

  PATH_PREFIX: string().optional(),

  PORT: coerce.number().optional().default(8080),

  PEPPER: string()
    .describe('Used for encryption related operations ensures cohesiveness'),
})

export type EnvType = Infer<typeof EnvironmentSchema>;
