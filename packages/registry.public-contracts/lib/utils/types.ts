/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodSchema } from 'zod'

export type UnionToTuple<$Union> = UnionToTupleHelper<$Union, []>;
type UnionToTupleHelper<$Union, $Rest extends any[]> = {
  1: $Rest;
  0: UnionToTupleHelper<Exclude<$Union, $Rest[number]>, [$Union, ...$Rest]>;
}[[$Union] extends [never] ? 1 : 0];

export type ValueOf<$Input> = $Input[keyof $Input];
export type AnyFunction = (...args: any[]) => any
export type ClassConstructor<$Entity> = new (...args: any[]) => $Entity;

export interface HistoryRecord {
  id: string;
  issuedAt: string;
  issuedBy: string;
}

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
