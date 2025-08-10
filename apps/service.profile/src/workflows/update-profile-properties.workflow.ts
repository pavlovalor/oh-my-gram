import { type WorkflowHandler, UpdateProfilePropertiesCommand, MessageResponse } from '@omg/message-registry'
import { IdentityDatabaseClientInjectionToken } from '~/app/app.constants'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { PostgresClient } from '@omg/postgres-module'
import { Schema } from '@omg/profile-postgres-schema'
import { eq } from 'drizzle-orm'


@Injectable()
export class UpdateProfilePropertiesWorkflow implements WorkflowHandler<UpdateProfilePropertiesCommand> {
  private readonly logger = new Logger(UpdateProfilePropertiesWorkflow.name)

  constructor(
    @Inject(IdentityDatabaseClientInjectionToken)
    private readonly postgresClient: PostgresClient<typeof Schema>,
  ) {}


  public async execute({ payload }: UpdateProfilePropertiesCommand) {
    this.logger.verbose('Received a command')

    const [profile] = await this.postgresClient
      .update(Schema.profileTable)
      .set({ ...payload })
      .where(eq(Schema.profileTable.id, payload.id))
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
    } satisfies MessageResponse<UpdateProfilePropertiesCommand>
  }
}
