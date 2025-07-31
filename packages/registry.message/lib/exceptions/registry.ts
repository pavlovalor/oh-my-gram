import * as Auth from './auth.exceptions'


export const ExceptionRegistry = {
  [Auth.EmailTakenException.predicates.code]: Auth.EmailTakenException,
  [Auth.PhoneNumberTakenException.predicates.code]: Auth.PhoneNumberTakenException,
  [Auth.CredentialsDoNotMatchException.predicates.code]: Auth.CredentialsDoNotMatchException,
  [Auth.NoSessionFoundException.predicates.code]: Auth.NoSessionFoundException,
} as const
