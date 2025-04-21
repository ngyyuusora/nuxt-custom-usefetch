<template>
  <div>
    <t-button @click="handleClick">点击</t-button>
  </div>
</template>
<script setup lang="ts">
  import { getWeatherForecast } from '~/api/weatherForecast';

  const { data } = await getWeatherForecast();
  console.log(data.value);
  const handleClick = () => {
    console.log('click');
  };
</script>
