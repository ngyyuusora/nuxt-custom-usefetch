<template>
  <div class="cache-usage-container">
    <div class="cache-usage-content">
      <div class="cache-usage-container">
        <div class="cache-usage">
          <ul class="user-list">
            <li v-for="(item, index) in users" :key="index" class="user-item">
              <p>{{ item.id }}</p>
              <p>{{ item.name }}</p>
              <p>{{ item.address }}</p>
              <p>{{ item.email }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="cache-usage-config">
      <div class="cache-usage-config-content">
        <div class="cache-usage-config-content-list">
          <t-card
            v-for="(item, index) in forecasts"
            :key="index"
            :bordered="false"
            :title="item.summary"
            :subtitle="item.date"
            size="small"
          >
            <template #avatar>
              <t-icon :name="item.icon" style="font-size: 48px" />
            </template>
            <t-tag shape="round" variant="outline">
              {{ item.temperatureC }}℃
            </t-tag>
            <t-tag shape="round" variant="outline">
              {{ item.temperatureF }}℉
            </t-tag>
          </t-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { apiGetUserList } from '~/api/users';
  import { apiGetWeatherForecast } from '~/api/weatherForecast';
  import type { WeatherForecast } from '~/types/api/weatherForecast';

  // const nuxtApp = useNuxtApp();
  // const { getWeatherForecast } = useFetch(nuxtApp);

  const forecasts = ref<WeatherForecast[]>([]);
  const users = ref<any[]>([]);

  const fetchData = async () => {
    const results = await Promise.allSettled([
      apiGetUserList(),
      apiGetWeatherForecast(),
    ]);
    const fulfilledResults = results.filter(
      (result) => result.status === 'fulfilled',
    ) as PromiseFulfilledResult<any>[];

    const resUserList = unref(fulfilledResults[0]!.value.data);
    const resWeatherForecasts = unref(fulfilledResults[1]!.value.data);
    if (resUserList && Array.isArray(resUserList)) {
      users.value = resUserList;
    }
    if (resWeatherForecasts && Array.isArray(resWeatherForecasts)) {
      forecasts.value = resWeatherForecasts;
    }
    const rejectedResults = results.filter(
      (result) => result.status === 'rejected',
    ) as PromiseRejectedResult[];
    rejectedResults.forEach((error, index) => {
      console.error(`Request ${index + 1} failed:`, error.reason);
    });
  };

  await fetchData();
</script>
<style lang="less" scoped>
  .cache-usage-container {
    border-radius: 6px;
    // border: 1px solid var(--td-component-border);
    overflow: hidden;
    height: 480px;
    background: var(--td-bg-color-container);
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--td-comp-margin-xxl);
    .cache-usage-content {
      display: flex;
      flex: 1 1 0%;
      flex-direction: column;
      justify-content: space-between;
      max-width: calc(100% - 240px);
      .cache-usage-container {
        overflow: auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        padding: 16px;
        gap: 8px;
        height: 100%;
      }
    }
    .cache-usage-config {
      width: 240px;
      box-sizing: border-box;
      flex-shrink: 0;
      border-left: 1px solid var(--td-component-stroke);
      overflow-y: auto;
      .cache-usage-config-title {
        display: flex;
        height: 48px;
        gap: 4px;
        align-items: center;
        padding: 12px 16px;
        box-sizing: border-box;
        border-bottom: 1px solid var(--td-component-stroke);
      }
      .cache-usage-config-content {
        padding: 16px;
        overflow: hidden auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: 480px;
        box-sizing: border-box;
        // .cache-usage-config-content-list {
        //   display: flex;
        //   flex-direction: column;
        //   gap: 4px;
        //   list-style: none;
        //   margin: 0px;
        //   padding: 0px;
        // }
        .cache-usage-config-content-divider {
          width: 100%;
          border-bottom: 1px solid var(--td-component-stroke);
        }
      }
    }
  }
  .cache-usage {
    width: 800px;
    height: auto;
    // display: flex;
    // align-items: center;
    // justify-content: center;
  }
  .user-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .user-item {
    display: grid;
    grid-template-columns: 2fr 1fr 3fr 2fr;
    gap: 8px;
    padding: 4px;
    border: 1px solid var(--td-component-border);
    border-radius: 4px;
    background-color: var(--td-bg-color-container);
  }
</style>
