import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { GetProfileByIdQuery } from '@omg/message-registry'
import { GetProfileByIdWorkflow } from '~/workflows/get-profile-by-id.workflow'


@Controller()
export class ApplicationController {
  constructor(
    private readonly getProfileByIdWorkflow: GetProfileByIdWorkflow,
  ) {}

  @MessagePattern(GetProfileByIdQuery.matcher)
  async signUpWithCredentials(@Payload() query: GetProfileByIdQuery) {
    return this.getProfileByIdWorkflow.execute(query)
  }
}
