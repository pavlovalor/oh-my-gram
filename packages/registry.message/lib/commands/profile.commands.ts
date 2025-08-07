import { Queue } from '../queues'
import { Command } from '../base/command.class'


export class InitializeProfileCommand extends Command.create(
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


export class UpdateProfilePropertiesCommand extends Command.create(
  'profile.update-properties',
  Queue.ProfileService,
)<{
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


export class ChangeProfileTypeCommand extends Command.create(
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


export class DropProfileCommand extends Command.create(
  'profile.drop',
  Queue.ProfileService,
)<{
  profileId: string
}, {}> {}

