import { EventFactory } from '../base/event.factory'


export class IdentityCreatedEvent
  extends EventFactory.create('auth.identity.created')<{
  }> {}

export class SessionCreatedEvent
  extends EventFactory.create('auth.session.created')<{
    sessionId: string,
  }> {}

export class SessionRefreshedEvent
  extends EventFactory.create('auth.session.refreshed')<{
    sessionId: string,
  }> {}

export class SessionTerminatedEvent
  extends EventFactory.create('auth.session.terminated')<{
    sessionId: string,
  }> {}
