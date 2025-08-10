// Global
import { DropProfileCommand, GetProfileByIdQuery, InitializeProfileCommand, UpdateProfilePropertiesCommand } from '@omg/message-registry'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Controller } from '@nestjs/common'

// Local
import { GetProfileByIdWorkflow } from '~/workflows/get-profile-by-id.workflow'
import { InitializeProfileWorkflow } from '~/workflows/initialize-profile.workflow'
import { UpdateProfilePropertiesWorkflow } from '~/workflows/update-profile-properties.workflow'
import { DropProfileWorkflow } from '~/workflows/drop-profile.workflow'


@Controller()
export class ApplicationController {
  constructor(
    private readonly getProfileByIdWorkflow: GetProfileByIdWorkflow,
    private readonly initializeProfileWorkflow: InitializeProfileWorkflow,
    private readonly updateProfilePropertiesWorkflow: UpdateProfilePropertiesWorkflow,
    private readonly dropProfileWorkflow: DropProfileWorkflow,
  ) {}

  @MessagePattern(GetProfileByIdQuery.matcher)
  public async signUpWithCredentials(@Payload() query: GetProfileByIdQuery) {
    return this.getProfileByIdWorkflow.execute(query)
  }

  @MessagePattern(InitializeProfileCommand.matcher)
  public async initializeProfile(@Payload() command: InitializeProfileCommand) {
    return this.initializeProfileWorkflow.execute(command)
  }

  @MessagePattern(UpdateProfilePropertiesCommand.matcher)
  public async updateProfileProperties(@Payload() command: UpdateProfilePropertiesCommand) {
    return this.updateProfilePropertiesWorkflow.execute(command)
  }

  @MessagePattern(DropProfileCommand.matcher)
  public async dropProfile(@Payload() command: DropProfileCommand) {
    return this.dropProfileWorkflow.execute(command)
  }
}
