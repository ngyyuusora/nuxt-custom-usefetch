<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
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
