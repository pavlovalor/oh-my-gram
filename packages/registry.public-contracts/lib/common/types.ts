import * as Schemas from './schemas'
import { infer as Infer } from 'zod'


export type IssueResponse = Infer<typeof Schemas.IssueSchema>
// TODO: continue
