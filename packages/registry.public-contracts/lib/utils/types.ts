/* eslint-disable @typescript-eslint/no-explicit-any */
import { type AxiosRequestConfig } from 'axios'
import { type IssueResponse } from '../common'

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

export interface OmgResponseMeta {
  meta: {
    status: number,
    headers: object,
    config: AxiosRequestConfig,
  }
}

export interface OmgResolvedPayload<$Data> {
  isResolved: true,
  payload: $Data,
}

export interface OmgRejectedPayload {
  isResolved: false,
  payload: IssueResponse,
}

export type OmgResponse<$Data> = OmgResponseMeta
  & (OmgRejectedPayload | OmgResolvedPayload<$Data>)
