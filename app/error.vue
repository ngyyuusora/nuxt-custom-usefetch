<template>
  <result :title="title" :type="errTyp" :tip="errMsg">
    <client-only>
      <t-button @click="() => $router.push('/')">{{ '返回' }}</t-button>
    </client-only>
  </result>
</template>
<script setup lang="ts">
  import type { NuxtError } from '#app';
  interface NuxtErrorExt extends NuxtError {
    url?: string;
  }
  const props = defineProps({
    error: {
      type: Object as PropType<NuxtErrorExt>,
      default: () => ({}),
    },
  });
  const errMsg = computed(() => {
    if (props.error.statusCode === 404 && props.error.url) {
      return `地址不存在：${props.error.url}`;
    }
    return props.error.message;
  });
  const errTyp = computed(() => {
    switch (props.error.statusCode) {
      case 400:
        return 'ie';
      case 401:
      case 403:
        return '403';
      case 404:
        return '404';
      case 500:
        return '500';
      case 502:
        return 'wifi';
      case 503:
        return 'maintenance';
      default:
        return 'maintenance';
    }
  });
  const title = computed(() => {
    switch (errTyp.value) {
      case '403':
        return '无权限访问';
      case '404':
        return '页面未找到';
      case '500':
        return '服务器错误';
      case 'ie':
        return '浏览器不兼容';
      case 'wifi':
        return '网络错误';
      case 'maintenance':
        return '系统维护中';
      default:
        return '未知错误';
    }
  });
  console.log(props.error);

  const colorMode = useColorMode();
  const theme = useThemeStore();
  onMounted(() => {
    watchEffect(() => {
      if (colorMode.value === 'dark') {
        document.documentElement.setAttribute('theme-mode', 'dark');
      } else {
        document.documentElement.removeAttribute('theme-mode');
      }
    });
    theme.setTheme('default');
  });
</script>
