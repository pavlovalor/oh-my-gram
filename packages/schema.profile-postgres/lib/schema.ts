import { varchar, timestamp, uuid, foreignKey, integer, pgSchema, text, uniqueIndex } from 'drizzle-orm/pg-core'


export const coreSchema = pgSchema('core')
export const relationsSchema = pgSchema('relations')


/** Profile categories */
export const profileType = coreSchema.enum('type', [
  'regular',
  'business',
])

export const profileGender = coreSchema.enum('gender', [
  'male',
  'female',
  'confused',
])

export const profileTable = coreSchema.table('profile', {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp(),
  identityId: uuid().notNull(),
  username: varchar({ length: 16 }).notNull().unique(),
  displayName: varchar({ length: 64 }).notNull(),
  type: profileType().notNull().default('regular'),
  photoUri: varchar({ length: 128 }),
  gender: profileGender(),
  externalUrl: text(),
  bio: text(),
  /** Memoized values */
  __followers: integer().notNull().default(0),
  __followings: integer().notNull().default(0),
  __posts: integer().notNull().default(0),
})


export const profileMentions = coreSchema.table('mentions', {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp().defaultNow(),
  postId: uuid().notNull(),
})


export const restrictions = coreSchema.table('restrictions', {
  id: uuid().primaryKey().defaultRandom(),
  profileId: uuid().notNull(),
  createdAt: timestamp().defaultNow(),
  expiresAt: timestamp().notNull(),
  features: varchar({ length: 64 }).array().notNull(),
}, currentTable => ({
  profileReference: foreignKey({
    columns: [currentTable.profileId],
    foreignColumns: [profileTable.id],
  }),
}))


export const blacklist = relationsSchema.table('blacklist', {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp().defaultNow(),
  issuerId: uuid().notNull(),
  targetId: uuid().notNull(),
}, currentTable => ({
  issuerReference: foreignKey({
    columns: [currentTable.issuerId],
    foreignColumns: [profileTable.id],
  }),
  targetReference: foreignKey({
    columns: [currentTable.targetId],
    foreignColumns: [profileTable.id],
  }),
}))

export const followings = relationsSchema.table('followings', {
  id: uuid().primaryKey().defaultRandom(),
  issuerId: uuid().notNull(),
  targetId: uuid().notNull(),
  createdAt: timestamp().defaultNow(),
  reverseFollowingId: uuid(),
}, currentTable => ({
  compositeUniqueKey: uniqueIndex('branch_direction').on(currentTable.issuerId, currentTable.targetId),
  reverseFollowingReference: foreignKey({
    columns: [currentTable.reverseFollowingId],
    foreignColumns: [currentTable.id]
  }),
}))
