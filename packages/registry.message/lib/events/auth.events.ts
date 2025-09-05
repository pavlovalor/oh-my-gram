import { Event } from '../base/event.class'


export class IdentityCreatedEvent
  extends Event.create('auth.identity.created')<{
  }> {}

export class SessionCreatedEvent
  extends Event.create('auth.session.created')<{
    sessionId: string,
  }> {}

export class SessionRefreshedEvent
  extends Event.create('auth.session.refreshed')<{
    sessionId: string,
  }> {}

export class SessionTerminatedEvent
  extends Event.create('auth.session.terminated')<{
    sessionId: string,
  }> {}
