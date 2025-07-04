import { type ConfigModuleOptions } from '@nestjs/config'
import { type ZodEffects, type ZodObject, type ZodRawShape } from 'zod'


export type AnyEnvironmentSchema = ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>

export type EnvironmentModuleOptions<$EnvironmentModuleOptions extends ConfigModuleOptions>
  = Pick<$EnvironmentModuleOptions, 'cache'>
  & { schema: AnyEnvironmentSchema }
