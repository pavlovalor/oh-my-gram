import { object, string, coerce, type infer as Infer } from "zod";

export const EnvironmentSchema = object({
  PATH_PREFIX: string().optional(),
  PORT: coerce.number().optional().default(8080),
  NATS_URL: string(),
});

export type EnvType = Infer<typeof EnvironmentSchema>;
