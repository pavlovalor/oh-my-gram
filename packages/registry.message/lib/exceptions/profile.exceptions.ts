import { WorkflowException, type WorkflowExceptionPredicates } from '../base/workflow-exception.class'


export class ProfileDoesNotExist extends WorkflowException {
  static readonly predicates = {
    message: 'Resource could not be found',
    reason: 'A profile either does not exist or beyond access',
    code: 200001,
  } satisfies WorkflowExceptionPredicates
}
