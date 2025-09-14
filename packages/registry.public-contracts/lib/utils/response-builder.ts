import { object, array, number, type ZodSchema } from 'zod'
import { IssueSchema } from '../common/schemas'


export function createResponseSchema<$Record extends ZodSchema>(record: $Record) {
  return object({
    warnings: array(IssueSchema),
    data: record,
  })
}

export function createListResponseSchema<$Record extends ZodSchema>(record: $Record) {
  return object({
    warnings: array(IssueSchema),
    data: array(record),
    total: number(),
  })
}
