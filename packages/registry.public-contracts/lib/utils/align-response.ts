import type { AxiosResponse } from 'axios'

export function alignResponse<$Data, $Status extends number = number>(
  response: AxiosResponse<$Data, $Status>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): { response: $Data; status: number; headers: any; config: any } {
  return {
    response: response.data,
    status: response.status,
    headers: response.headers,
    config: response.config,
  }
}
