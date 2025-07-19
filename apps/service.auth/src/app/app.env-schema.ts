import { object, string, coerce, type infer as Infer } from 'zod'

export const EnvironmentSchema = object({
  NATS_URL: string(),
  POSTGRES_URL: string().url(),
  POSTGRES_SSL: coerce.boolean().default(false),
  PATH_PREFIX: string().optional(),
  PORT: coerce.number().optional().default(8080),
  PEPPER: string(),
})

export type EnvType = Infer<typeof EnvironmentSchema>;
