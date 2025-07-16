import { Controller } from '@nestjs/common'
import { ApplicationService } from './app.service'
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices'

import {
  SignInWithCredentialsCommand,
  SignUpWithCredentialsCommand,
  RefreshSessionCommand,
} from '@omg/message-registry'
import {
  SignUpByCredentialsWorkflow,
  SignInByCredentialsWorkflow,
  RefreshSessionWorkflow,
} from '~/workflows'


@Controller()
export class ApplicationController {
  constructor(
    private readonly signUpWithCredentialsWorkflow: SignUpByCredentialsWorkflow,
    private readonly signInWithCredentialsWorkflow: SignInByCredentialsWorkflow,
    private readonly refreshSessionWorkflow: RefreshSessionWorkflow,
  ) {}

  @MessagePattern(SignInWithCredentialsCommand.matcher)
  async signInWithCredentials(@Payload() command: SignInWithCredentialsCommand) {
    return this.signInWithCredentialsWorkflow.execute(command)
  }


  @MessagePattern(SignUpWithCredentialsCommand.matcher)
  async signUpWithCredentials(@Payload() command: SignUpWithCredentialsCommand) {
    return this.signUpWithCredentialsWorkflow.execute(command)
  }


  @MessagePattern(RefreshSessionCommand.matcher)
  async refreshSession(@Payload() command: RefreshSessionCommand) {
    return this.refreshSessionWorkflow.execute(command)
  }
}
