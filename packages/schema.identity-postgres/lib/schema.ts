/**
 * Database schema definitions for the Core and Auth sub-schemas using Drizzle ORM (PostgreSQL).
 *
 * This file declares enums and tables, each annotated with descriptive JSDoc blocks.
 * The `coreSchema` and `authSchema` namespaces partition tables into logical groups.
 *
 * Enums:
 * - certificateType: Supported certificate key-wrapping algorithms for JSON Web Encryption (JWE).
 * - applicationType: Client application categories (web, mobile, desktop).
 *
 * Tables:
 * - identityTable
 * - emailTable
 * - phoneNumberTable
 * - passwordHashTable
 * - deviceTable
 * - sessionTable
 * - applicationTable
 * - certificateTable
 *
 * Relationships and computed columns are defined elsewhere via Drizzle’s helpers.
 * This file focuses solely on enum and table declarations.
 *
 * @module drizzleSchema
 */
import { varchar, timestamp, uuid, boolean, date, foreignKey, pgSchema, inet } from 'drizzle-orm/pg-core'
import { sql, relations } from 'drizzle-orm'


export const coreSchema = pgSchema('core')
export const authSchema = pgSchema('auth')


/** Client application categories */
export const applicationType = authSchema.enum('application_type', [
  'web',
  'mobile',
  'desktop',
])


/**
 * Stores user identities linking to email,
 * phone, and password hash records.
 */
export const identityTable = coreSchema.table('identity', {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp(),
  removedAt: timestamp(),
})

export const identityRelations = relations(identityTable, connect => ({
  recentEmails: connect.many(emailTable),
  recentPasswordHashes: connect.many(passwordHashTable),
  recentPhoneNumbers: connect.many(phoneNumberTable),
  sessions: connect.many(sessionTable),
}))


/**
 * Stores email addresses for identities,
 * with verification timestamp.
 */
export const emailTable = coreSchema.table('email', {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp().defaultNow(),
  verifiedAt: timestamp(),
  identityId: uuid().notNull(),
  value: varchar({ length: 128 }).unique().notNull(),
}, currentTable => ({
  identityReference: foreignKey({
    columns: [currentTable.identityId],
    foreignColumns: [identityTable.id],
  }),
}))

export const emailRelations = relations(emailTable, connect => ({
  identity: connect.one(identityTable, {
    fields: [emailTable.identityId],
    references: [identityTable.id],
  }),
}))


/**
 * Stores phone numbers for identities,
 * with verification flag.
 */
export const phoneNumberTable = coreSchema.table('phone_number', {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp().defaultNow(),
  isVerified: boolean().default(false).notNull(),
  identityId: uuid().notNull(),
  value: varchar({ length: 15 }).notNull(),
}, currentTable => ({
  identityReference: foreignKey({
    columns: [currentTable.identityId],
    foreignColumns: [identityTable.id],
  }),
}))

export const phoneNumberRelations = relations(phoneNumberTable, connect => ({
  identity: connect.one(identityTable, {
    fields: [phoneNumberTable.identityId],
    references: [identityTable.id],
  }),
}))


/**
 * Stores history of password hash entries
 * including expiration for identities.
 */
export const passwordHashTable = coreSchema.table('password', {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp().defaultNow(),
  expiresAt: date(),
  identityId: uuid().notNull(),
  value: varchar({ length: 128 }).notNull(),
}, currentTable => ({
  identityReference: foreignKey({
    columns: [currentTable.identityId],
    foreignColumns: [identityTable.id],
  }),
}))

export const passwordHashRelations = relations(passwordHashTable, connect => ({
  identity: connect.one(identityTable, {
    fields: [passwordHashTable.identityId],
    references: [identityTable.id],
  }),
}))


/**
 * Tracks registered devices, metadata,
 * and push notification tokens.
 */
export const deviceTable = authSchema.table('device', {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp().defaultNow(),
  model: varchar({ length: 64 }),
  locale: varchar({ length: 64 }), // TODO: replace with ISO country code enum
  operationSystem: varchar({ length: 64 }),
  operationSystemVersion: varchar({ length: 12 }),
  fingerprint: varchar({ length: 256 }).notNull(),
  lastSeenAt: timestamp().defaultNow(),
  lastIp: inet().notNull(),
  pushToken: varchar({ length: 256 }),
})

/**
 * Manages user sessions and refresh tokens,
 * with computed "isActive" status.
 */
export const sessionTable = authSchema.table('session', {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
  revokedAt: timestamp(),
  expiresAt: timestamp().notNull(),
  refreshToken: varchar({ length: 32 }).unique().notNull(),
  identityId: uuid().notNull(),
  deviceId: uuid(),
}, currentTable => ({
  identityReference: foreignKey({
    columns: [currentTable.identityId],
    foreignColumns: [identityTable.id],
  }),
  deviceReference: foreignKey({
    columns: [currentTable.deviceId],
    foreignColumns: [deviceTable.id],
  }),
}))

export const sessionRelations = relations(sessionTable, connect => ({
  identity: connect.one(identityTable, {
    fields: [sessionTable.identityId],
    references: [identityTable.id],
  }),
  device: connect.one(deviceTable, {
    fields: [sessionTable.deviceId],
    references: [deviceTable.id],
  }),
}))


/**
 * Authorized client applications
 * used with version metadata.
 */
export const applicationTable = authSchema.table('application', {
  id: uuid().primaryKey().defaultRandom(),
  os: varchar({ length: 64 }),
  type: applicationType().notNull(),
  version: varchar({ length: 16 }),
  // TODO: add specific permissions/feature-toggles here
})


/**
 * Assembled credentials for the ease
 * of authorization purposes
 */
export const identityCredentialsView = coreSchema.view('identity_credentials', {
  id: uuid().primaryKey(),
  passwordHash: varchar({ length: 128 }).notNull(),
  phoneNumber: varchar({ length: 15 }).notNull(),
  email: varchar({ length: 128 }).notNull(),
}).as(sql`
  SELECT
    ${identityTable.id},
    "lastPassword"."value" AS "passwordHash",
    "lastPhoneNumber"."value" AS "phoneNumber",
    "lastEmail"."value" AS "email"
  FROM "core"."identity"
  
  LEFT JOIN LATERAL (
    SELECT "value", "identityId" FROM ${passwordHashTable}
    WHERE ${passwordHashTable.identityId} = ${identityTable.id}
    ORDER BY ${passwordHashTable.createdAt} DESC LIMIT 1
  ) "lastPassword" ON "lastPassword"."identityId" = ${identityTable.id}

  LEFT JOIN LATERAL (
    SELECT "value", "identityId" FROM ${phoneNumberTable}
    WHERE ${phoneNumberTable.identityId} = ${identityTable.id}
    ORDER BY ${phoneNumberTable.createdAt} DESC LIMIT 1
  ) "lastPhoneNumber" ON "lastPhoneNumber"."identityId" = ${identityTable.id}

  LEFT JOIN LATERAL (
    SELECT "value", "identityId" FROM ${emailTable}
    WHERE ${emailTable.identityId} = ${identityTable.id}
    ORDER BY ${emailTable.createdAt} DESC LIMIT 1
  ) "lastEmail" ON "lastEmail"."identityId" = ${identityTable.id}

  WHERE ${identityTable.removedAt} IS NULL
`)
