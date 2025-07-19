import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { SignUpWithCredentialsCommand } from '@omg/message-registry'
import { SignUpByCredentialsWorkflow } from '~/workflows/sign-up-by-credentials.workflow'


@Controller()
export class ApplicationController {
  constructor(
    private readonly signUpWithCredentialsWorkflow: SignUpByCredentialsWorkflow,
  ) {}

  @MessagePattern(SignUpWithCredentialsCommand.matcher)
  async signUpWithCredentials(@Payload() command: SignUpWithCredentialsCommand) {
    return this.signUpWithCredentialsWorkflow.execute(command)
  }
}
