# nuxt-custom-usefetch

## Setup

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm run start-mock-server # mock server default using local port 39000
pnpm dev
```

## Usage

### Crate a request instance

```javascript
export const requestPublic = createFetch({
  requestOptions: {
    urlPrefix: '/api/public',
  },
});
```

### GET

```javascript
requestPublic.get({
  url: '/weather-forecast',
});
```

```javascript
requestPublic.get({
  url: '/weather-forecast',
  params: {
    id: 1,
  },
});
```

### POST

```javascript
requestPublic.post({
  url: '/weather-forecast',
  data: {
    summary: 'Cloudy',
  },
});
```

### DELETE

```javascript
requestPublic.post({
  url: '/weather-forecast',
  params: {
    id: 1,
  },
});
```

## Notice

### Concurrency usage

#### DO NOT USE (nuxt fatal)

```javascript
await requestPublic.get(); // url1
await requestPublic.get(); // url2
```

#### Please use allSettled

```javascript
const results = await Promise.allSettled([
  requestPublic.get(); // url1
  requestPublic.get(); // url2
);
const fulfilledResults = results.filter(
  (result) => result.status === 'fulfilled'
) as PromiseFulfilledResult<any>[];
```

## Params

### `CreateFetchOptions`

CreateFetchOptions will affect all operation under an instance.

| conf | type | default | desc |
| --- | --- | --- | --- |
| `baseURL` | `string` | base host url, prefer runtimeConfigKey. |  |
| `runtimeConfigKey` | `string` | - | load host url in runtimeConfig.public<'key'>, default value is VITE_REQUEST_URL, can be overrided. |
| `authenticationScheme` | `string` | `''` | e.g. authenticationScheme: 'Bearer' |
| `headers` | `Record<string, string>` | `{}` | custom http headers. |
| `transform` | `FetchTransform` | `defaultTransform` | set transform and interceptor |
| `arrayFormatFormData` | `'brackets' \| 'comma' \| 'indices' \| 'repeat' \| undefined` | `'brackets'` | format formData using qs.stringify |
| `arrayFormatParamsStringify` | `'brackets' \| 'comma' \| 'indices' \| 'repeat' \| undefined` | `'brackets'` | format params using qs.stringify |
| `requestOptions` | `RequestOptions` | `RequestOptions` | Check "RequestOptions" section below. |

---

### `RequestOptions`

RequestOptions will affect all operation under an instance as default. Can be overrided at each operation.

| conf | type | default | desc |
| --- | --- | --- | --- |
| `headers` | `Record<string, string>` | `{}` | custom http headers. prority higher than CreateFetchOptions.headers. |
| `params` | `Record<string, any>` | `{}` | http params. |
| `data` | `any` | - | http body data. |
| `apiUrl` | `string` | `''` | api path. if using absolute url(startswith https), will ignore baseURL. |
| `isJoinPrefix` | `boolean` | `true` | join urlPrefix after apiUrl. |
| `urlPrefix` | `string` | `''` | ${baseURL}${apiUrl}${urlPrefix}${url} |
| `isTransformResponse` | `boolean` | `true` | extract data from response. |
| `joinParamsToUrl` | `boolean` | `false` | join params and data to url path. |
| `formatDate` | `boolean` | `true` | formate moment.js to string, trim value. |
| `joinTime` | `boolean` | `true` | append timestamp to final req url, will NOT affect cache key of useAsyncData |
| `withToken` | `boolean` | `true` | append token to headers. |
| `retry` | `{ count: number; delay: number } \| false` | `{ count: 3, delay: 1000 }` | retry options. |
| `timeout` | `number` | `5000` | timeout in miliseconds. |
| `alwaysUseFetch` | `boolean` | `false` | using $fetch(ofetch) outside ssr hydrating |
| `hashParamsToCache` | `boolean` | `true` | when enabled, request with same params will use cache. when disabled, all requests with same url even different params still use same cache. |
| `useNuxtData` | `boolean` | `true` | default value is true to suppress unnecessary requests. if useNuxtDataAllMethod, set this to false when modifying remote data. (prefer set at each request call passthrough, otherwise may causes hydration mismatch) |
| `useNuxtDataAllMethod` | `boolean` | `false` | default only using cache when GET. warning: may cause fatal result if operation not idempotence. |

## Summary

本仓库使用 [Nuxt 3](https://nuxt.com/docs/getting-started/introduction) (Vue 3) 和 [TDesign Vue Next](https://tdesign.tencent.com/vue-next) 组件库。

除此之外，还使用了以下依赖：

- [Tailwind CSS](https://tailwindcss.com/)
- [Nuxt Color Mode](https://color-mode.nuxtjs.org/): 深色/浅色模式
- ESLint + Prettier: 代码风格检查 + 美化
- [unplugin-auto-import 和 unplugin-vue-components](https://unplugin.unjs.io): 自动导入 TDesign Vue Next 的组件以实现 [tree shaking](https://en.wikipedia.org/wiki/Tree_shaking)
- pnpm v9
- [nuxt-svgo](https://github.com/cpsoinos/nuxt-svgo)：快速将svg直接导入为可定制的组件

## 目录结构

```plaintext
.
├── app             # 前端相关
│   ├── components  # 全局组件
│   ├── hooks       # 自定义 hooks
│   ├── layouts     # Nuxt 布局
│   ├── pages       # 页面，每个 SFC 代表一个页面，可用文件夹嵌套
│   └── types       # TypeScript 类型定义，目前包含了 unplugin 自动生成的类型
├── node_modules
├── public          # 静态资源
│   └── styles
└── server          # 后端相关
```

## 自定义主题

TDesign 支持 [自定义主题](https://tdesign.tencent.com/vue-next/custom-theme)。按照以下步骤修改主题：

1. 在文档页面，点击页面底部的刷子图标，进入主题编辑器。调整完想要的效果后，点击下载按钮，保存 CSS 文件到本地。
2. 将 CSS 文件移动到 `public/styles` 文件夹下，并命名为 `tdesign-theme-{name}.css`，其中 `name` 是你给主题取的名字。
3. 在 `hooks/useTheme.ts` 中，修改:

```ts
type Theme = 'default' | 'test'; // 添加/修改成你自己的主题名
```

如有需要，可以配置 defineStore 部分中的 `theme` 变量为你想要的初始主题，默认为 `default`。

然后就可以在代码中调用了：

```ts
const theme = useThemeStore();

theme.setTheme('default');
```
