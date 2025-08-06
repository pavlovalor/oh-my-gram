import { type WorkflowHandler, type MessageResponse, ProfileDoesNotExist, GetProfileByIdQuery } from '@omg/message-registry'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { IdentityDatabaseClientInjectionToken } from '~/app/app.constants'
import { PostgresClient } from '@omg/postgres-module'
import { Schema } from '@omg/profile-postgres-schema'
import { and, eq } from 'drizzle-orm'


@Injectable()
export class GetProfileByIdWorkflow implements WorkflowHandler<GetProfileByIdQuery> {
  private readonly logger = new Logger(GetProfileByIdWorkflow.name)

  constructor(
    @Inject(IdentityDatabaseClientInjectionToken)
    private readonly postgresClient: PostgresClient<typeof Schema>,
  ) {}

  // TODO: add caching check

  async execute({ payload, meta }: GetProfileByIdQuery) {
    this.logger.verbose('Received a command')
    this.logger.verbose('Initiating a transaction')

    const profileRecord = await this.postgresClient.transaction(async transactionClient => {
      const [blackListRecord] = await transactionClient
        .select()
        .from(Schema.blacklistTable)
        .where(and(
          eq(Schema.blacklistTable.issuerId, payload.profileId),
          meta.profileId
            ? eq(Schema.blacklistTable.targetId, meta.profileId)
            : undefined,
        ))
        .limit(1)

      if (blackListRecord) {
        this.logger.warn('Unable to return profile due to the blacklist constraint')
        throw new ProfileDoesNotExist({
          cause: 'blacklisted',
          since: blackListRecord.createdAt,
        })
      }

      const [profileRecord] = await transactionClient
        .select()
        .from(Schema.profileTable)
        .where(eq(Schema.profileTable.id, payload.profileId))

      return profileRecord
    })

    // TODO: Set caching

    return {
      id: profileRecord.id,
      createdAt: profileRecord.createdAt.toISOString(),
      updatedAt: profileRecord.updatedAt?.toISOString(),
      identityId: profileRecord.identityId,
      username: profileRecord.username,
      displayName: profileRecord.displayName,
      type: profileRecord.type,
      photoUri: profileRecord.photoUri ?? undefined,
      gender: profileRecord.gender ?? undefined,
      externalUrl: profileRecord.externalUrl ?? undefined,
      bio: profileRecord.bio ?? undefined,
      counters: {
        followers: profileRecord.__followers,
        followings: profileRecord.__followings,
        posts: profileRecord.__posts,
      },
    } satisfies MessageResponse<GetProfileByIdQuery>
  }
}
