import { useFetch } from 'nuxt/app';
import merge from 'lodash/merge';
import type { NuxtApp, UseFetchOptions } from 'nuxt/app';
import isString from 'lodash/isString';
import { hash } from 'ohash';
import { formatRequestDate, setObjToUrlParams } from './util';
import type { FetchTransform } from './types';
import isFunction from 'lodash/isFunction';
import { stringify } from 'qs';
import { interceptors } from './index';
import type { ComponentInternalInstance } from 'vue';

interface RequestConfig {
  method?:
    | 'get'
    | 'GET'
    | 'delete'
    | 'DELETE'
    | 'head'
    | 'HEAD'
    | 'options'
    | 'OPTIONS'
    | 'post'
    | 'POST'
    | 'put'
    | 'PUT'
    | 'patch'
    | 'PATCH';
  url: string;
  headers?: Recordable;
  params?: Nullable<Recordable>;
  data?: Nullable<Recordable>;
}

export class VUseFetch {
  private readonly options: CreateFetchOptions;

  constructor(options: CreateFetchOptions) {
    this.options = options;
  }

  private getTransform(): FetchTransform | undefined {
    return this.options.transform;
  }

  request<T = any>(config: RequestConfig, options?: RequestOptions) {
    // Get runtimeConfig (can't use useRuntimeConfig outside of setup)
    const nuxtApp = useNuxtApp();
    const runtimeConfig = nuxtApp.$config;
    const transform = this.getTransform();
    const requestOptions: RequestOptions = merge(
      {},
      this.options.requestOptions,
      options,
    );

    // Assemble url with runtimeConfig
    let url = config.url;
    let baseURL = this.options.baseURL || '';
    if (!baseURL && this.options.runtimeConfigKey) {
      if (
        typeof runtimeConfig.public[this.options.runtimeConfigKey] !== 'string'
      )
        throw new Error(
          `Runtime config key "${this.options.runtimeConfigKey}" not valid.`,
        );
      baseURL = runtimeConfig.public[this.options.runtimeConfigKey] as string;
    }
    if (!baseURL) {
      baseURL = runtimeConfig.public.VITE_REQUEST_URL || '';
    }
    // let fetchOptions: UseFetchOptions<T> = merge<UseFetchOptions<T>, UseFetchOptions<T>>({
    //   baseURL,
    //   method: 'GET',
    //   headers: this.options.headers,
    // }, config);

    // Support FormData
    config = this.supportFormData(config) as RequestConfig;

    let fetchOptions: UseFetchOptions<T> = {
      baseURL,
      headers: config.headers,
    };
    // Apply transforms
    if (
      transform?.beforeRequestHook &&
      isFunction(transform.beforeRequestHook)
    ) {
      fetchOptions =
        transform.beforeRequestHook(
          fetchOptions as UseFetchOptions<any>,
          requestOptions,
        ) || fetchOptions;
    }
    if (
      transform?.transformResponseHook &&
      isFunction(transform.transformResponseHook)
    ) {
      fetchOptions.transform = (res) =>
        transform.transformResponseHook!(res, requestOptions, nuxtApp);
    }

    const {
      apiUrl,
      isJoinPrefix,
      urlPrefix,
      joinParamsToUrl,
      formatDate,
      joinTime = true,
      retry,
      timeout,
    } = requestOptions;
    let finalJoinTimeFlag = false;
    // Assemble req url with prefix
    if (isJoinPrefix && urlPrefix && isString(urlPrefix)) {
      url = `${urlPrefix}${url}`;
    }
    // Assemble req url with apiUrl
    if (apiUrl && isString(apiUrl)) {
      url = `${apiUrl}${url}`;
    }
    // Assemble req url with baseUrl(host)
    const isAbsoluteUrl = /^https?:\/\//.test(url);
    if (!isAbsoluteUrl && baseURL) {
      url = `${baseURL}${url}`;
    }

    const originUrl = url;
    const params: Nullable<Recordable> = config.params || {};
    const data = config.data || false;

    if (formatDate && data && !isString(data)) {
      formatRequestDate(data);
    }

    if (config.method?.toUpperCase() === 'GET') {
      if (!isString(params)) {
        // Add timestamp to GET request(refresh cache)
        // config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
        if (joinTime) finalJoinTimeFlag = true;
      } else {
        // Fallback to restful
        // url = `${url + params}${joinTimestamp(joinTime, true)}`;
        url = `${url + params}`;
        if (joinTime) finalJoinTimeFlag = true;
        config.params = null;
      }
    } else if (!isString(params)) {
      if (formatDate) {
        formatRequestDate(params);
      }
      if (
        Reflect.has(config, 'data') &&
        config.data &&
        (Object.keys(config.data).length > 0 || data instanceof FormData)
      ) {
        config.data = data as Recordable;
        config.params = params;
      } else {
        // Using params as data when no data in non-GET request
        config.data = params;
        config.params = undefined;
      }
      if (joinParamsToUrl) {
        url = setObjToUrlParams(url as string, {
          ...config.params,
          ...config.data,
        });
      }
    } else {
      // Fallback to restful
      url += params;
      config.params = undefined;
    }

    fetchOptions.method = config.method || undefined;
    fetchOptions.body = data || undefined;

    // Support params stringify
    const stringifiedParams = this.supportParamsStringify(config);
    if (stringifiedParams) {
      url = this.appendStringQueryParams(url, stringifiedParams);
    }

    fetchOptions = {
      ...fetchOptions,
      ...interceptors,
      retry: typeof retry === 'boolean' ? retry : retry?.count || 1,
      retryDelay: typeof retry === 'boolean' ? retry : retry?.delay || 0,
      timeout: timeout || 0,
    };

    // hashParamsToCache ? with stringified params
    fetchOptions.key = hash([
      'request',
      requestOptions.hashParamsToCache ? url : originUrl,
      JSON.stringify(requestOptions),
    ]);

    // hash before joinTime(_t there using for avoid gateway cache)
    if (finalJoinTimeFlag) {
      url = this.appendQueryParams(url, {
        _t: Date.now().toString(),
      });
    }

    const instance = getCurrentInstance();
    // if (import.meta.dev) {
    //   console.warn('isHydrating', nuxtApp.isHydrating);
    //   console.warn('instance status', instance?.uid, instance?.type.__name, instance?.data, instance?.props, instance?.isMounted);
    // }
    if (requestOptions?.alwaysUseFetch) {
      return useFetch<T>(url, fetchOptions as any);
    }
    return this.executeFetch<T>(url, fetchOptions, nuxtApp, instance);
  }

  private appendStringQueryParams(url: string, params: string) {
    const hasQuery = url.includes('?');
    return `${url}${hasQuery ? '&' : '?'}${params}`;
  }

  private appendQueryParams(
    url: string,
    params: Record<string, string> | string[],
  ): string {
    const queryString = Array.isArray(params)
      ? params.join('&')
      : Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');
    return this.appendStringQueryParams(url, queryString);
  }

  private wrapFetchResponse<T>(response: T, nuxtApp: NuxtApp) {
    return {
      data: shallowRef(
        this.options.transform?.transformResponseHook
          ? this.options.transform.transformResponseHook(
              response,
              this.options.requestOptions ?? {},
              nuxtApp,
            )
          : response,
      ),
      pending: shallowRef(false),
      error: shallowRef(null),
      status: shallowRef('success'),
    };
  }
  private async executeFetch<T>(
    url: string,
    fetchOptions: UseFetchOptions<T>,
    nuxtApp: NuxtApp,
    instance: ComponentInternalInstance | null,
  ) {
    if (
      import.meta.client &&
      !nuxtApp.isHydrating &&
      (!instance || instance?.isMounted)
    ) {
      try {
        const response = await $fetch<T>(url, fetchOptions as any);
        return this.wrapFetchResponse(response, nuxtApp);
      } catch (error) {
        return {
          data: shallowRef(null),
          pending: shallowRef(false),
          error: shallowRef(error),
          status: shallowRef('error'),
        };
      }
    } else {
      return useFetch<T>(url, fetchOptions as any);
    }
  }

  get<T = any>(config: RequestConfig, options?: RequestOptions) {
    return this.request<T>({ ...config, method: 'GET' }, options);
  }

  post<T = any>(config: RequestConfig, options?: RequestOptions) {
    return this.request<T>({ ...config, method: 'POST' }, options);
  }

  put<T = any>(config: RequestConfig, options?: RequestOptions) {
    return this.request<T>({ ...config, method: 'PUT' }, options);
  }

  delete<T = any>(config: RequestConfig, options?: RequestOptions) {
    return this.request<T>({ ...config, method: 'DELETE' }, options);
  }

  patch<T = any>(config: RequestConfig, options?: RequestOptions) {
    return this.request<T>({ ...config, method: 'PATCH' }, options);
  }

  upload<T = any>(
    config: RequestConfig,
    key: string,
    file: File,
    options?: RequestOptions,
  ) {
    const formData = new FormData();
    formData.append(key, file);
    if (config.data) {
      for (const dataKey in config.data) {
        if (Object.prototype.hasOwnProperty.call(config.data, dataKey)) {
          formData.append(dataKey, config.data[dataKey]);
        }
      }
    }
    // Custom default upload http method, default PoST
    const method = config.method?.toUpperCase() || 'POST';
    return this.request<T>(
      { ...config, method: method as RequestConfig['method'], data: formData },
      options,
    );
  }

  /**
   * 支持 FormData 请求格式
   * @param config
   */
  supportFormData(config: RequestConfig) {
    const headers = config.headers || this.options.headers;
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];

    if (
      contentType !== ContentTypeEnum.FormURLEncoded ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === 'GET'
    ) {
      return config;
    }

    return {
      ...config,
      data: stringify(config.data, {
        arrayFormat: this.options.arrayFormatFormData ?? 'brackets',
      }),
    };
  }

  /**
   * 支持 params 序列化
   * @param config
   */
  supportParamsStringify(config: RequestConfig): string {
    const headers = config.headers || this.options.headers;
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];

    if (
      contentType === ContentTypeEnum.FormURLEncoded ||
      !Reflect.has(config, 'params')
    ) {
      return '';
    }

    return stringify(config.params, {
      arrayFormat: this.options.arrayFormatParamsStringify ?? 'brackets',
    });
  }
}
