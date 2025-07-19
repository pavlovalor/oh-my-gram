import { type ClientProxy, NatsRecordBuilder } from '@nestjs/microservices'
import { generateNamespacedUuid } from '@omg/utils-module'
import { catchError } from 'rxjs'
import { type MessageMetadata } from '../types'
import { Logger } from '@nestjs/common'
import * as nats from 'nats'
// import color from 'cli-color'


/**
 * Base abstract class for a NATS-backed event message.
 *
 * @abstract
 * @template $$Payload  - Shape of the event payload.
 */
export abstract class Event<$$Payload extends object> {
  private readonly logger: Logger


  constructor(
    public readonly payload: NoInfer<$$Payload>,
    public readonly meta: MessageMetadata,
  ) {
    this.logger = new Logger(this.constructor.name)

    meta.id ??= generateNamespacedUuid('message')
    meta.correlationId ??= generateNamespacedUuid('flow')
    meta.causationId ??= meta.id
    meta.timestamp ??= new Date()
  }

  /**
   * Define the NATS subject pattern for this event.
   *
   * @template $Signature - Unique identifier string for the event.
   * @param signature - The event’s signature (e.g. `"user.created"`).
   * @returns A subclass of `Event` whose `pattern` static property is set.
   */
  static create<$Signature extends string>(signature: $Signature) {
    const pattern = `event.${signature}` as const
    const wrapper = class EventWrapper<$$Res extends object> extends Event<$$Res> {}
    return Object.assign(wrapper, { pattern, matcher: { pattern } })
  }

  public static get matcher() {
    return { pattern: Object.getPrototypeOf(this).constructor.pattern }
  }

  /**
   * Publish this event over NATS without awaiting a response.
   *
   * @param client - The NestJS NATS client.
   * @param queue  - The JetStream consumer (or queue group) name.
   */
  public async passVia(client: ClientProxy): Promise<void> {
    const pattern = Object.getPrototypeOf(this).constructor.pattern
    const headers = nats.headers()

    /**
     * Other relevant headers
     * @see https://docs.nats.io/nats-concepts/jetstream/headers
     */
    headers.set('Nats-Msg-Id', this.meta.id!)

    const record = new NatsRecordBuilder(this.payload)
      .setHeaders(headers)
      .build()

    client
      .send({ pattern }, record)
      .pipe(catchError((error: Error) => { throw error }))
  }
}
