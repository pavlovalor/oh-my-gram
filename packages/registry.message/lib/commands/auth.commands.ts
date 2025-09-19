import { Queue } from '../queues'
import { CommandFactory } from '../base/command.factory'
import { Role } from '@omg/public-contracts-registry'


interface Token {
  value: string,
  ttl: number,
}

export class SignUpWithCredentialsCommand extends CommandFactory.create(
  'auth.sign-up.with-credentials',
  Queue.IdentityService,
)<{
  login: string,
  password: string,
  roles: Role[],
}, {
  identityId: string,
}> {}


export class SignInWithCredentialsCommand extends CommandFactory.create(
  'auth.sign-in.with-credentials',
  Queue.AuthService,
)<{
  login: string,
  password: string,
}, {
  accessToken: Token,
  refreshToken: Token,
}> {}


export class RefreshSessionCommand extends CommandFactory.create(
  'auth.refresh-session',
  Queue.AuthService,
)<{
  refreshToken: string,
  profileId?: string,
}, {
  accessToken: Token,
  refreshToken: Token,
}> {}
