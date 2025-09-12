// Core
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

// Local
import { SignInWithCredentialsCommand, RefreshSessionCommand } from '@omg/message-registry'
import { SignInByCredentialsWorkflow } from '~/workflows/sign-in-by-credentials.workflow'
import { RefreshSessionWorkflow } from '~/workflows/refresh-session.workflow'


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
