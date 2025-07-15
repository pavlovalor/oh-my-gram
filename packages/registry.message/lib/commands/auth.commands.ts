import { Command } from '../base'


interface Token {
  value: string,
  ttl: number,
}

export class SignUpWithCredentialsCommand extends Command.create('auth.sign-up.with-credentials')<{
  login: string,
  password: string,
}, {
  accessToken: Token,
  refreshToken: Token,
}> {}


export class SignInWithCredentialsCommand extends Command.create('auth.sign-in.with-credentials')<{
  login: string,
  password: string,
}, {
  accessToken: Token,
  refreshToken: Token,
}> {}


export class RefreshSessionCommand extends Command.create('auth.sign-in.with-credentials')<{
  refreshToken: string
}, {
  accessToken: Token,
  refreshToken: Token,
}> {}

