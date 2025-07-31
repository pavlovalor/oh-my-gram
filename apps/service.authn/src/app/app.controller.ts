import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

import {
  SignInWithCredentialsCommand,
  RefreshSessionCommand,
} from '@omg/message-registry'
import {
  SignInByCredentialsWorkflow,
  RefreshSessionWorkflow,
} from '~/workflows'


@Controller()
export class ApplicationController {
  constructor(
    private readonly signInWithCredentialsWorkflow: SignInByCredentialsWorkflow,
    private readonly refreshSessionWorkflow: RefreshSessionWorkflow,
  ) {}


  @MessagePattern(SignInWithCredentialsCommand.matcher)
  async signInWithCredentials(@Payload() command: SignInWithCredentialsCommand) {
    return this.signInWithCredentialsWorkflow.execute(command)
  }


  @MessagePattern(RefreshSessionCommand.matcher)
  async refreshSession(@Payload() command: RefreshSessionCommand) {
    return this.refreshSessionWorkflow.execute(command)
  }
}
