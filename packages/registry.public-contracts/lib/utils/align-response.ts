import { AxiosError, type AxiosResponse } from 'axios'
import { type OmgResponse } from './types'
import { IssueSchema } from '../common'


function alignResolvedResponse<$Data, $Status extends number = number>(
  response: AxiosResponse<$Data, $Status>
): OmgResponse<$Data> {
  return {
    isResolved: true,
    payload: response.data,
    meta: {
      status: response.status,
      headers: response.headers,
      config: response.config,
    },
  }
}


function alignRejectedResponse<$Data>(
  error: AxiosResponse<$Data>
): OmgResponse<$Data> {
  if (!(error instanceof AxiosError) || !error.response?.data) throw error

  try {
    const omgIssue = IssueSchema.parse(error?.response?.data)

    return {
      isResolved: false,
      payload: omgIssue,
      meta: {
        status: error.response.status,
        headers: error.response.headers,
        config: error.response.config,
      }
    }
  } catch (_exception) {
    throw error
  }
}


export const alignResponse = [
  alignResolvedResponse,
  alignRejectedResponse,
]
