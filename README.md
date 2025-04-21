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
