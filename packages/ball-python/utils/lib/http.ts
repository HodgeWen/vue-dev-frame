import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export interface ErrorData {
  code: number;
  msg: string;
  data: any;
}

export type ErrorCode =
  | 101
  | 102
  | 210
  | 211
  | 212
  | 213
  | 215
  | 217
  | 218
  | 219
  | 220
  | 400
  | 401
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 418
  | 500
  | 504
  | 506



interface AxiosInstance {
  <T = any>(config: AxiosRequestConfig): Promise<Response<T>>
  <T = any>(url: string, config?: AxiosRequestConfig): Promise<Response<T>>
  defaults: AxiosRequestConfig
  getUri(config?: AxiosRequestConfig): string
  request<T = any>(config: AxiosRequestConfig): Promise<Response<T>>
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<Response<T>>
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<Response<T>>
  head<T = any>(url: string, config?: AxiosRequestConfig): Promise<Response<T>>
  options<T = any>(url: string, config?: AxiosRequestConfig): Promise<Response<T>>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Response<T>>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Response<T>>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Response<T>>
}

export interface Response<T = any> {
  /** 状态码 */
  code: ErrorCode | 200
  /** 请求成功的返回值 */
  data: T
  /** 请求失败的失败信息 */
  message: string
  /** 响应头 */
  headers: Record<string, string>
}

interface Interceptors {
  before?: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>
  success?: (res: AxiosResponse<Response<any>>) => Response<any> | Promise<Response<any>>
  error?: (err: AxiosError) => Response<any>
}

interface ReqFactory {
  interceptors: Interceptors
  defaultInterceptors: Interceptors
  /** 创建一个axios实例 */
  create(options?: AxiosRequestConfig): AxiosInstance
  /**
   * 添加请求拦截器
   * @param callback 拦截器钩子
   */
  before(
    callback?: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>
  ): ReqFactory
  /**
   * 添加响应成功拦截器
   * @param callback
   */
  success(
    callback?: (res: AxiosResponse<Response<any>>) => Response<any> | Promise<Response<any>>
  ): ReqFactory
  /**
   * 添加请求失败拦截器
   * @param callback
   */
  error(callback?: (err: AxiosError) => Response<any>): ReqFactory

  // 正在请求token
  requetTokens: []
}

export const request: ReqFactory = {
  create(options?: AxiosRequestConfig): AxiosInstance {
    const instance: any = axios.create({
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      timeout: 18000,
      withCredentials: false,
      ...options
    })

    const { before, success, error } = this.interceptors
    // 发送请求前
    instance.interceptors.request.use(
      before !== undefined ? before : this.defaultInterceptors.before
    )
    // 请求相应或报错后
    instance.interceptors.response.use(
      (success !== undefined ? success : this.defaultInterceptors.success) as any,
      error !== undefined ? error : this.defaultInterceptors.error
    )

    this.interceptors = {}
    return instance as AxiosInstance
  },

  interceptors: {},

  defaultInterceptors: {
    before: (config) => {
      return config
    }
  },

  before(callback) {
    this.interceptors.before = callback
    return this
  },

  error(callback) {
    if (!(callback instanceof Function)) return this
    this.interceptors.error = callback
    return this
  },

  success(callback) {
    this.interceptors.success = callback
    return this
  },

  requetTokens: []
}
