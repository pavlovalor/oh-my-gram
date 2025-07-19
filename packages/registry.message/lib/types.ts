/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Command } from './base/command.class'
import { type Query } from './base/query.class'
import { type UUID as Uuid } from 'node:crypto'
import { type NamespacedUuid } from '@omg/utils-module'


/** Metadata that accompanies every message sent over NATS */
export interface MessageMetadata {
  /** Who issued the message */
  issuerId: Uuid,
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
 * Extracts the response‐payload type (`$$ResponsePayload`) from either
 * a `Command<$Req, $Res>` or a `Query<$Req, $Res>` subclass.
 * @example
 * ```ts
 * class FooCmd extends Command.create('...')<{a:number},{b:string}> {}
 * class BarQry extends Query.create('...')<{x:boolean},{y:number}> {}
 *
 * type R1 = MessageResponse<FooCmd> // { b: string }
 * type R2 = MessageResponse<BarQry>  // { y: number }
 * ```
 */
export type MessageResponse<$MessageConstructor> =
  $MessageConstructor extends Command<any, infer $ResponseType> ? $ResponseType :
  $MessageConstructor extends Query<any, infer $ResponseType> ? $ResponseType :
  void


/**
 * A handler workflow for a message class $MessageConstructor, exposing a single
 * `execute` method that takes C and returns its response payload.
 *
 * @template $MessageConstructor  The message class (instance type) to handle.
 */
export interface WorkflowHandler<$MessageConstructor, $ResponseType = MessageResponse<$MessageConstructor>> {
  /**
   * Execute the handler logic for this message.
   * @param payload  An instance of $MessageConstructor
   * @returns        The response payload type for $MessageConstructor
   */
  execute(payload: NoInfer<$MessageConstructor>)
    : Promise<$ResponseType>
    | $ResponseType
}

