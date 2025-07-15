import { Controller } from '@nestjs/common'
import { ApplicationService } from './app.service'
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices'

import {
  SignInWithCredentialsCommand,
  SignUpWithCredentialsCommand,
  RefreshSessionCommand,
} from '@omg/message-registry'


@Controller()
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  @MessagePattern(SignInWithCredentialsCommand.pattern)
  async signInWithCredentials(@Payload() _command: SignInWithCredentialsCommand) {
    throw new RpcException('Not implemented')
  }


  @MessagePattern(SignUpWithCredentialsCommand.pattern)
  async signUpWithCredentials(@Payload() _command: SignUpWithCredentialsCommand) {
    throw new RpcException('Not implemented')
  }


  @MessagePattern(RefreshSessionCommand.pattern)
  async refreshSession(@Payload() _command: RefreshSessionCommand) {
    throw new RpcException('Not implemented')
  }
}
