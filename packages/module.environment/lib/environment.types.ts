import { type ConfigModuleOptions } from '@nestjs/config';
import { type ZodObject, type ZodRawShape } from 'zod';


export type AnyEnvironmentSchema = ZodObject<ZodRawShape>

export type EnvironmentModuleOptions<$EnvironmentModuleOptions extends ConfigModuleOptions> 
  = Pick<$EnvironmentModuleOptions, 'cache'> 
  & { 
    schema: ZodObject<ZodRawShape> ,
    envFileDirectory?: string,
  }