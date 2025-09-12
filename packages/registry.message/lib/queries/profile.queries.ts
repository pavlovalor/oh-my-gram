import { QueryFactory } from '../base/query.factory'
import { Queue } from '../queues'


export class GetProfileByIdQuery extends QueryFactory.create(
  'profile.get-by-id',
  Queue.IdentityService,
)<{
  profileId: string,
}, {
  id: string,
  createdAt: string,
  updatedAt?: string,
  identityId: string,
  username: string,
  displayName: string,
  type: 'regular' | 'business',
  photoUri?: string,
  gender?: 'male' | 'female' | 'confused',
  externalUrl?: string,
  bio?: string,
  counters: {
    followers: number,
    followings: number,
    posts: number,
  },
}> {}
