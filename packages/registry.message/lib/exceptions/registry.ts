import * as Auth from './auth.exceptions'
import * as Profile from './profile.exceptions'


export const ExceptionRegistry = {
  /** Identity slice */
  [Auth.EmailTakenException.predicates.code]: Auth.EmailTakenException,
  [Auth.PhoneNumberTakenException.predicates.code]: Auth.PhoneNumberTakenException,
  [Auth.CredentialsDoNotMatchException.predicates.code]: Auth.CredentialsDoNotMatchException,
  [Auth.NoSessionFoundException.predicates.code]: Auth.NoSessionFoundException,

  /* Profile slice */
  [Profile.ProfileDoesNotExist.predicates.code]: Profile.ProfileDoesNotExist,
} as const
