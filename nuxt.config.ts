import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/robots',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/sitemap',
    '@nuxt/eslint',
    '@tdesign-vue-next/nuxt',
    'nuxt-svgo',
  ],

  build: {
    transpile: ['tdesign-vue-next'],
  },

  plugins: [],

  tailwindcss: {
    configPath: './app/tailwind.config.js',
    exposeConfig: true,
    viewer: true,
  },

  colorMode: {
    preference: 'system',
    dataValue: 'theme',
    classSuffix: '',
  },

  // Sitemap module configuration: https://nuxtseo.com/site-config/getting-started/how-it-works
  site: {
    url: 'https://tdesign-vue-nuxt-starter.ataw.top', // FIXME: Your website URL
  },

  nitro: {
    compressPublicAssets: { brotli: true, gzip: true },
    // affect both csr&ssr, DO NOT USE IN PRODUCTION
    routeRules: {
      // '/proxy/example': { proxy: 'http://39.98.58.238:8594' },
      '/proxy/api/**': { proxy: `${process.env.VITE_API_URL}/**` },
    },
    // affect only csr
    // devProxy: {
    //   '/proxy/api': {
    //     target: process.env.VITE_API_URL,
    //   },
    // },
  },

  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
    plugins: [
      Components({
        dts: 'types/components.d.ts',
        resolvers: [],
      }),
      AutoImport({
        imports: ['pinia'],
        dts: 'types/auto-imports.d.ts',
        dirs: ['hooks/**', 'stores', 'constants', 'utils/**', 'layouts'],
        vueTemplate: true,
        resolvers: [],
      }),
    ],
  },
  runtimeConfig: {
    public: {
      VITE_API_URL: process.env.VITE_API_URL,
      VITE_REQUEST_URL: process.env.VITE_REQUEST_URL,
    },
  },
  future: {
    // 启用 Nuxt 4 功能前瞻
    compatibilityVersion: 4,
  },

  compatibilityDate: '2024-07-19',
});
