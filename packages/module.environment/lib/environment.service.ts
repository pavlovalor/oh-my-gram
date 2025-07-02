import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { type infer as Infer } from 'zod';
import { type AnyEnvironmentSchema } from './environment.types';


/**
 * A type-safe extension of NestJS ConfigService that integrates Zod validation schema.
 * 
 * This class provides enhanced `get()` functionality with better type inference,
 * preserving the original types from the Zod schema and automatically handling 
 * optional values and default fallbacks.
 *
 * @template $$Schema - The Zod object schema passed at instantiation
 * @template $$SchemaType - The inferred TypeScript type from the schema
 */
@Injectable()
export class EnvironmentService<
  $$Schema extends AnyEnvironmentSchema,
  $$SchemaType = Infer<$$Schema>,
> extends ConfigService {
  /**
   * Retrieves a configuration value by its key, with optional default value and full type inference.
   * 
   * If the property is optional in the schema and no default is provided, the return type will include `undefined`.
   * If a default value is provided, the return type will exclude `undefined`.
   *
   * @template $PropertyPath - A valid key from the schema
   * @template $DefaultValue - The type of the optional default value
   * @template $ReturnType - The inferred return type based on whether a default is supplied
   *
   * @param { $PropertyPath } propertyPath - The key of the configuration property to retrieve
   * @param { $DefaultValue } [defaultValue] - A fallback value to use if the config value is `undefined`
   * 
   * @returns { $ReturnType } The resolved config value with correct type
   * 
   * @example
   * const port = config.get('PORT');                     // number | undefined (if optional in schema)
   * const env = config.get('NODE_ENV', 'development');   // string (default provided)
   */
  public get<
    $PropertyPath extends keyof $$SchemaType,
    $DefaultValue = undefined,
    $ReturnType = undefined extends $DefaultValue
      ? $$SchemaType[$PropertyPath]
      : Exclude<$$SchemaType[$PropertyPath], undefined> | $DefaultValue
  >(
    propertyPath: $PropertyPath,
    defaultValue?: $DefaultValue,
  ): $ReturnType {
    return (
      super.get(propertyPath as any) ?? defaultValue
    ) as $ReturnType;
  }
}