import * as Schemas from './schemas'
import { type infer as Infer } from 'zod'


export type IssueResponse = Infer<typeof Schemas.IssueSchema>
// TODO: continue
