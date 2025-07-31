import { WorkflowException, type WorkflowExceptionPredicates } from '../base/workflow-exception.class'


export class EmailTakenException extends WorkflowException {
  static readonly predicates = {
    message: 'Email registration failed',
    reason: 'Identity with such email already exists',
    code: 100001,
  } satisfies WorkflowExceptionPredicates
}


export class PhoneNumberTakenException extends WorkflowException {
  static readonly predicates = {
    message: 'Phone number registration failed',
    reason: 'Identity with such phone number already exists',
    code: 100002,
  } satisfies WorkflowExceptionPredicates
}


export class CredentialsDoNotMatchException extends WorkflowException {
  static readonly predicates = {
    message: 'Unable to find identity',
    reason: 'Credentials combination was not found',
    code: 100101,
  } satisfies WorkflowExceptionPredicates
}

export class NoSessionFoundException extends WorkflowException {
  static readonly predicates = {
    message: 'Such session does not exist',
    reason: 'Potential mismatch of parameters',
    code: 100102,
  } satisfies WorkflowExceptionPredicates
}
