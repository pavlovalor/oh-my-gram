import { Queue } from '../queues'
import { Command } from '../base/command.class'


interface Token {
  value: string,
  ttl: number,
}

export class SignUpWithCredentialsCommand extends Command.create(
  'auth.sign-up.with-credentials',
  Queue.IdentityService,
)<{
  login: string,
  password: string,
}, {
  identityId: string,
}> {}


export class SignInWithCredentialsCommand extends Command.create(
  'auth.sign-in.with-credentials',
  Queue.AuthService,
)<{
  login: string,
  password: string,
}, {
  accessToken: Token,
  refreshToken: Token,
}> {}


export class RefreshSessionCommand extends Command.create(
  'auth.refresh-session',
  Queue.AuthService,
)<{
  refreshToken: string
}, {
  accessToken: Token,
  refreshToken: Token,
}> {}

SignInWithCredentialsCommand.pattern === 'command.auth.sign-in.with-credentials'
SignUpWithCredentialsCommand.pattern === 'command.auth.sign-up.with-credentials'
