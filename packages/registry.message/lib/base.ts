
import { ClientProxy, NatsRecordBuilder } from '@nestjs/microservices'
import { type UUID } from 'node:crypto'
import { firstValueFrom, catchError } from 'rxjs'
import { generateNamespacedUuid, type NamespacedUuid } from '@omg/utils-module'
import * as nats from 'nats'


/** Metadata that accompanies every message sent over NATS */
export interface MessageMetadata {
  /** Who issued the message */
  issuerId: UUID,
  /** ID used to correlate this message with others in a workflow */
  correlationId: NamespacedUuid<'flow'>;
  /** ID of the message or operation that caused this one */
  causationId: NamespacedUuid<'message'>;
  /** When the message was created (set automatically if missing) */
  timestamp: Date;
  /** Unique message ID (set automatically if missing) */
  id: NamespacedUuid<'message'>;
}


/**
 * Base abstract class for a NATS-backed command message.
 *
 * @abstract
 * @template $$RequestPayload  - Shape of the command payload.
 * @template $$ResponsePayload - Expected shape of the response.
 */
export abstract class Command<$$RequestPayload extends object, $$ResponsePayload extends object> {
  constructor(
    public readonly payload: NoInfer<$$RequestPayload>,
    public readonly meta: Partial<MessageMetadata> = {},
  ) {
    meta.id ??= generateNamespacedUuid('message')
    meta.correlationId ??= generateNamespacedUuid('flow')
    meta.causationId ??= meta.id
    meta.timestamp ??= new Date()
  }

  /**
   * Define the NATS subject pattern for this command.
   *
   * @template $Signature - Unique identifier string for the command.
   * @param signature - The command’s signature (e.g. `"auth.create-user"`).
   * @returns A subclass of `Command` whose `pattern` static property is set.
   *
   * @example
   * ```ts
   * class CreateUserCommand extends Command.create('auth.create-user')<{
   *   // request payload shape
   *   username: string
   * }, {
   *   // response payload shape
   *   userId: string
   * }> {}
   *
   * CreateUserCommand.pattern //-> type: "command.auth.create-user"
   * ```
   */
  public static create<$Signature extends string>(signature: $Signature) {
    const pattern = `command.${signature}` as const
    return Object.assign(Command, { pattern, matcher: { pattern } })
  }

  /**
   * Publish this command over NATS and await its response.
   *
   * @param client - The NestJS NATS client.
   * @param queue  - The JetStream consumer (or queue group) name.
   * @returns Resolves with the deserialized response payload.
   * @throws If the remote handler returns an error.
   */
  public async executeVia(client: ClientProxy, queue?: string): Promise<$$ResponsePayload> {
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

    const stream = client
      .send({ pattern }, record)
      .pipe(catchError((error: Error) => { throw error }))

    return firstValueFrom(stream)
  }
}


/**
 * Base abstract class for a NATS-backed query message.
 *
 * @abstract
 * @template $$RequestPayload  - Shape of the query payload.
 * @template $$ResponsePayload - Expected shape of the response.
 */
export abstract class Query<$$RequestPayload extends object, $$ResponsePayload extends object> {
  constructor(
    public readonly payload: NoInfer<$$RequestPayload>,
    public readonly meta: MessageMetadata,
  ) {
    meta.id ??= generateNamespacedUuid('message')
    meta.correlationId ??= generateNamespacedUuid('flow')
    meta.causationId ??= meta.id
    meta.timestamp ??= new Date()
  }

  /**
   * Define the NATS subject pattern for this query.
   *
   * @template $Signature - Unique identifier string for the query.
   * @param signature - The query’s signature (e.g. `"user.get-profile"`).
   * @returns A subclass of `Query` whose `pattern` static property is set.
   */
  static create<$Signature extends string>(signature: $Signature) {
    const pattern = `query.${signature}` as const
    return Object.assign(Command, { pattern, matcher: { pattern } })
  }

  /**
   * Publish this query over NATS and await its response.
   *
   * @param client - The NestJS NATS client.
   * @param queue  - The JetStream consumer (or queue group) name.
   * @returns Resolves with the deserialized response payload.
   * @throws If the remote handler returns an error.
   */
  public async passVia(client: ClientProxy, queue?: string): Promise<$$ResponsePayload> {
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

    const stream = client
      .send({ pattern }, record)
      .pipe(catchError((error: Error) => { throw error }))

    return firstValueFrom(stream)
  }
}


/**
 * Base abstract class for a NATS-backed event message.
 *
 * @abstract
 * @template $$Payload  - Shape of the event payload.
 */
export abstract class Event<$$Payload extends object> {
  constructor(
    public readonly payload: NoInfer<$$Payload>,
    public readonly meta: MessageMetadata,
  ) {
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
    return Object.assign(Command, { pattern, matcher: { pattern } })
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
  public async passVia(client: ClientProxy, queue?: string): Promise<void> {
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
