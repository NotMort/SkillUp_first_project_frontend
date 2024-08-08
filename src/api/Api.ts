import Axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'
export async function apiRequest<D = Record<string, unknown>, R = unknown>(
  method: 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch',
  path: string,
  input?: D,
  options?: {
    headers?: AxiosRequestHeaders
  } & AxiosRequestConfig,
) {
  try {
    const response = await Axios.request<R>({
      baseURL: process.env.REACT_APP_API_URL,
      url: path,
      method: method,
      data: input,
      headers: options?.headers,
      withCredentials: true,
    })
    console.log(
      `apiRequest: ${method.toUpperCase()} ${path} response:`,
      response,
    )
    return response
  } catch (error: any) {
    console.error(
      `apiRequest: ${method.toUpperCase()} ${path} error:`,
      error.response,
    )
    return error.response
  }
}
export * from './User'
export * from './Auction'

export * from './Bid'

export * from './Role'
