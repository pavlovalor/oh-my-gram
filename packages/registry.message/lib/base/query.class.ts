import { ClientProxy, NatsRecordBuilder } from '@nestjs/microservices'
import { catchError, firstValueFrom } from 'rxjs'
import { generateNamespacedUuid } from '@omg/utils-module'
import { MessageMetadata } from '../types'
import { Logger } from '@nestjs/common'
import { Queue } from '../queues'
import * as nats from 'nats'
import color from 'cli-color'

/**
 * Base abstract class for a NATS-backed query message.
 *
 * @abstract
 * @template $$RequestPayload  - Shape of the query payload.
 * @template $$ResponsePayload - Expected shape of the response.
 */
export abstract class Query<$$RequestPayload extends object, $$ResponsePayload extends object> {
  private readonly logger: Logger


  constructor(
    public readonly payload: NoInfer<$$RequestPayload>,
    public readonly meta: MessageMetadata,
  ) {
    this.logger = new Logger(this.constructor.name)

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
  static create<$Signature extends string>(signature: $Signature, queue: Queue) {
    const pattern = `query.${signature}` as const
    const wrapper = class QueryWrapper<$$Res extends object, $$Req extends object> extends Query<$$Res, $$Req> {}
    return Object.assign(wrapper, { pattern, matcher: { pattern, queue } })
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
    const { matcher, pattern } = Object.getPrototypeOf(this).constructor
    const headers = nats.headers()

    /**
     * Other relevant headers
     * @see https://docs.nats.io/nats-concepts/jetstream/headers
     */
    headers.set('Nats-Msg-Id', this.meta.id!)

    const record = new NatsRecordBuilder({
      payload: this.payload,
      meta: this.meta,
    })
      .setHeaders(headers)
      .build()

    this.logger.verbose(`Initiating execution of ${color.yellow(this.meta.id)}`)
    this.logger.verbose(`Path ${color.yellow(`${pattern} --> ${queue ?? '[*]'}`)}`)
    this.logger.debug(record.data)

    const stream = client
      .send({ pattern: matcher.pattern, queue: queue ?? matcher.queue }, record)
      .pipe(catchError((error: Error) => { throw error }))

    this.logger.verbose(`Awaiting response...`)

    const response = await firstValueFrom(stream)

    this.logger.verbose(`Success`)
    this.logger.debug(response)

    return response
  }
}
