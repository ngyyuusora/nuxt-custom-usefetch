/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NuxtApp, UseFetchOptions } from 'nuxt/app';
import merge from 'lodash/merge';
import { VUseFetch } from './VUseFetch';
import type { FetchTransform } from './types';

// Custom interceptors apply to useFetch
export const interceptors = {
  onRequest: async ({
    request,
    options,
  }: {
    request: string;
    options: UseFetchOptions<any>;
  }) => {
    // console.log('[onRequest]', request, options);
  },
  onRequestError: async ({
    request,
    options,
    error,
  }: {
    request: string;
    options: UseFetchOptions<any>;
    error: any;
  }) => {
    console.error('[onRequestError]', request, error);
  },
  onResponse: async ({
    request,
    response,
    options,
  }: {
    request: string;
    response: any;
    options: UseFetchOptions<any>;
  }) => {
    // console.log('[onResponse]', request, response.status, response._data);
    return response.data;
  },
  onResponseError: async ({
    request,
    response,
    options,
  }: {
    request: string;
    response: any;
    options: UseFetchOptions<any>;
  }) => {
    console.error(
      '[onResponseError]',
      request,
      response.status,
      response._data,
    );
  },
};
// #region default transforms
const defaultTransform: FetchTransform = {
  transformResponseHook: <T = any>(
    response: T | ApiResponse<T>,
    options: RequestOptions,
    nuxtApp: NuxtApp,
  ): T | Promise<T> => {
    // console.log('[transformResponseHook]', 'req');
    if (!options.isTransformResponse) return response as T;
    // Custom response result, see ApiResponse<T>.
    const { code, data, message } = response as ApiResponse<T>;
    // Custom success condition
    const hasSuccess = data && code === 200;
    if (hasSuccess) {
      return data;
    } else {
      nuxtApp.runWithContext(() => {
        throw createError({
          statusCode: 500,
          statusMessage: message,
        });
      });
      return Promise.reject(new Error(message));
    }
  },
  beforeRequestHook: (
    options: UseFetchOptions<any>,
    requestOptions: RequestOptions,
  ) => {
    options.headers = options.headers || {};
    if (requestOptions.headers) {
      options.headers = { ...options.headers, ...requestOptions.headers };
    }
    // fixme usertoken
    const token = null;
    if (token && requestOptions.withToken !== false) {
      options.headers = {
        ...options.headers,
        Authorization: requestOptions.authenticationScheme
          ? `${requestOptions.authenticationScheme} ${token}`
          : token,
      };
    }
    return options;
  },
  requestCatchHook: (error: any, options: RequestOptions, nuxtApp: NuxtApp) => {
    nuxtApp.runWithContext(() => {
      throw createError(error);
    });
    throw error;
  },
};
// #endregion default transforms
// #region default createFetch options
export function createFetch(opt?: Partial<CreateFetchOptions>): VUseFetch {
  const defaultOptions: CreateFetchOptions = {
    // load runtimeConfig.public.VITE_REQUEST_URL as default, can be overrided.
    baseURL: '',
    // e.g. authenticationScheme: 'Bearer',
    authenticationScheme: '',
    // passing transforms to useFetch
    transform: defaultTransform,
    // format formData using qs.stringify
    arrayFormatFormData: 'brackets',
    // format params using qs.stringify
    arrayFormatParamsStringify: 'brackets',
    // can be overrided each req call
    requestOptions: {
      apiUrl: '',
      isJoinPrefix: true,
      urlPrefix: '',
      // useFetch does not have structures like AxiosError/AxiosResponse
      // isReturnNativeResponse: false,
      isTransformResponse: true,
      joinParamsToUrl: false,
      formatDate: true,
      // append timestamp to final req url, will NOT affect cache key of useAsyncData
      joinTime: true,
      ignoreCancelToken: true,
      withToken: true,
      retry: {
        count: 3,
        delay: 1000,
      },
      timeout: 5000,
      // using $fetch(ofetch) outside ssr hydrating
      alwaysUseFetch: true,
      // default value is false to suppress unnecessary requests. If not alwaysUseFetch, set this to true when modifying remote data.
      // (prefer set at each request call passthrough, otherwise may causes hydration mismatch)
      hashParamsToCache: false,
    },
    headers: {
      'Content-Type': ContentTypeEnum.JSON,
    },
  };

  const mergedOptions: CreateFetchOptions = merge({}, defaultOptions, opt);
  return new VUseFetch(mergedOptions);
}
// #endregion default createFetch options
// #region instances of request
export const requestPublic = createFetch({
  requestOptions: {
    isTransformResponse: false,
    urlPrefix: '/public/v1',
  },
});
// #endregion instances of request
