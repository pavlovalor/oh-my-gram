import { sortDirectionExtended, sortDirectionSimplified } from './constants'
import * as zod from 'zod'


export const BooleanFlagSchema = zod.preprocess(
  value => ['', 'true'].includes(value as string),
  zod.boolean(),
)

export const PaginationSchema = zod.object({
  number: zod.coerce
    .number()
    .int()
    .positive()
    .default(1),

  size: zod.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(50),
}).partial()

export const IssueSchema = zod.object({
  code: zod.string(),
  message: zod.string(),
  reason: zod.string().optional(),
  meta: zod.object({}).optional(),
})


export const IdentifierSchema = zod.string().uuid()

export const FieldSortSimplifiedSchema = zod.enum(sortDirectionSimplified)
export const FieldSortExtendedSchema = zod.enum(sortDirectionExtended)

export const FieldNumberConditionSchema = zod.object({
  eq: zod.coerce.number(),
  gt: zod.coerce.number(),
  lt: zod.coerce.number(),
  gte: zod.coerce.number(),
  lte: zod.coerce.number(),
}).partial()

export const FieldDateConditionSchema = zod.object({
  gt: zod.string().date(),
  lt: zod.string().date(),
  gte: zod.string().date(),
  lte: zod.string().date(),
}).partial()


export const FieldStringConditionSchema = zod.object({
  eq: zod.string(),
  sw: zod.string(),
  ew: zod.string(),
  has: zod.string(),
}).partial()

export const FieldTimestampConditionSchema = zod.object({
  eq: zod.coerce.number().transform(v => new Date(v)),
  gt: zod.coerce.number().transform(v => new Date(v)),
  lt: zod.coerce.number().transform(v => new Date(v)),
  gte: zod.coerce.number().transform(v => new Date(v)),
  lte: zod.coerce.number().transform(v => new Date(v)),
}).partial()
