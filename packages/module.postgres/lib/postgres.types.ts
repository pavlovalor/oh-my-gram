/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ModuleMetadata } from '@nestjs/common'
import { drizzle } from 'drizzle-orm/postgres-js'
// import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
// import { type ExtractTablesWithRelations, type Table } from 'drizzle-orm'

export type SchemaTemplate = Record<string, unknown>

export interface PostgresModuleOptions<$Schema extends SchemaTemplate = SchemaTemplate> {
  schema: $Schema,
  logging?: boolean,
  databaseUrl: string,
  databaseSsl?: boolean,
}

export interface PostgresModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject: any[],
  name: string | symbol,
  useFactory: (...args: any[]) => PostgresModuleOptions | Promise<PostgresModuleOptions>,
}

export type PostgresClient<$Schema extends Record<string, unknown>> = ReturnType<typeof drizzle<$Schema>>
// export type Schema = typeof schema
// export type Structure = ExtractTablesWithRelations<Schema>
// export type DrizzleClient = PostgresJsDatabase<typeof schema>
// export type TransactionHandler = Parameters<DrizzleClient['transaction']>[0]
// export type Transaction = Parameters<TransactionHandler>[0]
// export type AnyTable = Table


// export interface RecordTransformOptions {
//   /** Defines if service should return raw database output or group it by function */
//   raw?: boolean;

//   // actions, relations, ...
// }

// export interface FetchIndividualOptions {
//   // TODO
//   throwIfNotFound?: boolean;
// }
