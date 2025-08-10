import { type WorkflowHandler, InitializeProfileCommand, MessageResponse } from '@omg/message-registry'
import { IdentityDatabaseClientInjectionToken } from '~/app/app.constants'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { PostgresClient } from '@omg/postgres-module'
import { Schema } from '@omg/profile-postgres-schema'


@Injectable()
export class InitializeProfileWorkflow implements WorkflowHandler<InitializeProfileCommand> {
  private readonly logger = new Logger(InitializeProfileWorkflow.name)

  constructor(
    @Inject(IdentityDatabaseClientInjectionToken)
    private readonly postgresClient: PostgresClient<typeof Schema>,
  ) {}


  public async execute({ payload }: InitializeProfileCommand) {
    this.logger.verbose('Received a command')

    const [profile] = await this.postgresClient
      .insert(Schema.profileTable)
      .values({ ...payload })
      .returning()

    // TODO: error mapping


    return {
      id: profile.id,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt?.toISOString(),
      username: profile.username,
      displayName: profile.displayName,
      externalUrl: profile.externalUrl || undefined,
      gender: profile.gender || undefined,
      identityId: profile.identityId,
      type: profile.type,
      photoUri: profile.photoUri || undefined,
      bio: profile.bio || undefined,
      counters: {
        followers: profile.__followers,
        followings: profile.__followings,
        posts: profile.__posts,
      }
    } satisfies MessageResponse<InitializeProfileCommand>
  }
}
