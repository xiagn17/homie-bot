import axios, { Method } from 'axios';
import { stringify } from 'qs';

export type ParamValueType = string | string[] | number | boolean | undefined | null;
export async function request<D, R>(
  endpoint: string,
  baseUrl: string,
  method: Method = 'GET',
  params: Record<string, ParamValueType> = {},
  additionalHeaders: Record<string, string> = {},
  data?: D,
): Promise<R> {
  const response = await axios.request<R>({
    url: endpoint,
    baseURL: baseUrl,
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...additionalHeaders,
    },
    params,
    data: ['POST', 'PATCH', 'PUT'].includes(method) ? data : null,
    paramsSerializer: (p): string => stringify(p, { arrayFormat: 'comma' }),
  });

  return response.data;
}
