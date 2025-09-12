import { Queue } from '../queues'
import { CommandFactory } from '../base/command.factory'


export class InitializeProfileCommand extends CommandFactory.create(
  'profile.init',
  Queue.AuthService,
)<{
  identityId: string,
  username: string,
  displayName: string,
  type: 'regular' | 'business',
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


export class UpdateProfilePropertiesCommand extends CommandFactory.create(
  'profile.update-properties',
  Queue.ProfileService,
)<{
  id: string,
  displayName?: string,
  photoUri?: string,
  gender?: 'male' | 'female' | 'confused',
  externalUrl?: string,
  bio?: string,
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


export class ChangeProfileTypeCommand extends CommandFactory.create(
  'profile.change-type',
  Queue.ProfileService,
)<{
  type: 'regular' | 'business',
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


export class DropProfileCommand extends CommandFactory.create(
  'profile.drop',
  Queue.ProfileService,
)<{
  id: string
}, {}> {}

