import { type ClientProxy, NatsRecordBuilder, RpcException } from '@nestjs/microservices'
import { generateNamespacedUuid } from '@omg/utils-module'
import { ExceptionRegistry } from '../exceptions/registry'
import { catchError, firstValueFrom } from 'rxjs'
import { type MessageMetadata } from '../types'
import { Logger } from '@nestjs/common'
import { Queue } from '../queues'
import * as nats from 'nats'
import color from 'cli-color'


/**
 * Base abstract class for a NATS-backed command message.
 *
 * @abstract
 * @template $$RequestPayload  - Shape of the command payload.
 * @template $$ResponsePayload - Expected shape of the response.
 */
export abstract class CommandFactory<$$RequestPayload extends object, $$ResponsePayload extends object> {
  private readonly logger: Logger


  constructor(
    public readonly payload: NoInfer<$$RequestPayload>,
    public readonly meta: Partial<MessageMetadata> = {},
  ) {
    this.logger = new Logger(this.constructor.name)

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
  public static create<$Signature extends string>(signature: $Signature, queue: Queue) {
    const pattern = `command.${signature}` as const
    const wrapper = class CommandWrapper<$$Res extends object, $$Req extends object> extends CommandFactory<$$Res, $$Req> {}
    return Object.assign(wrapper, { pattern, matcher: { pattern, queue } })
  }


  /**
   * Publish this command over NATS and await its response.
   * @param client - The NestJS NATS client.
   * @param queue  - The JetStream consumer (or queue group) name.
   * @returns Resolves with the deserialized response payload.
   * @throws If the remote handler returns an error.
   */
  public async executeVia(client: ClientProxy, overrideQueue?: string): Promise<$$ResponsePayload> {
    const { matcher, pattern } = Object.getPrototypeOf(this).constructor
    const queue = overrideQueue ?? matcher.queue
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
      .pipe(catchError(error => { // Exception deserialization process
        const ExceptionConstructor: any = 'code' in error
          ? ExceptionRegistry[error.code]
          : null

        this.logger.error('Execution failed!')
        if (ExceptionConstructor) {
          this.logger.verbose(`Detecting serialized ${color.yellow(ExceptionConstructor.name)}`)
          throw new ExceptionConstructor(error.meta)
        } else throw new RpcException(error)
      }))

    this.logger.verbose(`Awaiting response...`)

    const response = await firstValueFrom(stream)

    this.logger.verbose(`Success`)
    this.logger.debug(response)

    return response
  }
}
