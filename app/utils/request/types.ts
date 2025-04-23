import type { NuxtApp, UseFetchOptions } from 'nuxt/app';
// #region ContentTypeEnum
export enum ContentTypeEnum {
  JSON = 'application/json',
  FormData = 'multipart/form-data',
  FormURLEncoded = 'application/x-www-form-urlencoded',
}
// #endregion ContentTypeEnum
// #region RequestOptions configuring request instance
export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  withToken?: boolean;
  joinTime?: boolean;
  urlPrefix?: string;
  isJoinPrefix?: boolean;
  apiUrl?: string;
  // isReturnNativeResponse?: boolean;
  isTransformResponse?: boolean;
  joinParamsToUrl?: boolean;
  formatDate?: boolean;
  ignoreCancelToken?: boolean;
  authenticationScheme?: string;
  retry?: { count: number; delay: number } | false;
  timeout?: number;
  alwaysUseFetch?: boolean;
  hashParamsToCache?: boolean;
  useNuxtData?: boolean;
  useNuxtDataAfterMounted?: boolean;
  useNuxtDataAllMethod?: boolean;
  clearNuxtData?: boolean;
}
// #endregion RequestOptions
// #region ApiResponse Custom response result
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
// #endregion ApiResponse
// #region CreateFetchOptions configuring useFetch options
export interface CreateFetchOptions {
  baseURL?: string;
  runtimeConfigKey?: string;
  authenticationScheme?: string;
  transform?: FetchTransform;
  requestOptions?: RequestOptions;
  headers?: Record<string, string>;
  arrayFormatFormData?: 'brackets' | 'comma' | 'indices' | 'repeat' | undefined;
  arrayFormatParamsStringify?:
    | 'brackets'
    | 'comma'
    | 'indices'
    | 'repeat'
    | undefined;
}
// #endregion CreateFetchOptions
// #region FetchTransform useFetch's transform
export abstract class FetchTransform {
  beforeRequestHook?: (
    options: UseFetchOptions<any>,
    requestOptions: RequestOptions,
  ) => UseFetchOptions<any>;
  transformResponseHook?: <T = any>(
    response: any,
    requestOptions: RequestOptions,
    nuxtApp: NuxtApp,
  ) => T | Promise<T>;
  requestCatchHook?: (
    error: any,
    requestOptions: RequestOptions,
    nuxtApp: NuxtApp,
  ) => Promise<any>;
  responseInterceptors?: (response: any) => any;
  responseInterceptorsCatch?: (error: any) => void;
}
// #endregion FetchTransform
