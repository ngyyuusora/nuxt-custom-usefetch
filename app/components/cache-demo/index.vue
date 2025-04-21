<template>
  <div class="cache-usage-container">
    <div class="cache-usage-content">
      <div class="cache-usage-container">
        <div class="cache-usage">
          <TButton @click="onClickFetchBtn">fetch</TButton>
          <TButton @click="onClickPostBtn">post</TButton>
          <t-tag v-if="showTime" variant="outline">{{ time }}ms</t-tag>
          <t-tag>'0ms/1ms' indicate using cache</t-tag>
          <t-list style="height: 300px">
            <t-list-item v-for="(item, index) in data" :key="index">
              <p>{{ item.timestamp }}</p>
              <p>{{ item.id }}</p>
            </t-list-item>
          </t-list>
        </div>
      </div>
    </div>
    <div class="cache-usage-config">
      <div class="cache-usage-config-title">
        <p>RequestOptions</p>
      </div>
      <div class="cache-usage-config-content">
        <div class="cache-usage-config-content-list">
          <t-form layout="vertical" label-align="top">
            <t-form-item
              v-for="(item, index) in reqConfigControl"
              :key="index"
              :label="item"
            >
              <t-switch v-model="reqConfig[item]" />
            </t-form-item>
          </t-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { apiGetPseudoItem } from '~/api/pseudo';
  import type { PseudoItem } from '~/types/api/pseudo';
  import type { RequestOptions } from '~/utils/request/types';

  // const nuxtApp = useNuxtApp();
  // const { getWeatherForecast } = useFetch(nuxtApp);

  const data = ref<PseudoItem[]>([]);
  const time = ref<number>();
  const showTime = ref<boolean>(false);
  const reqConfig = ref<RequestOptions>({
    alwaysUseFetch: true,
    hashParamsToCache: false,
    useNuxtData: true,
    useNuxtDataAllMethod: false,
  });
  const reqConfigControl = ref<Array<keyof RequestOptions>>(
    Object.keys(reqConfig.value) as Array<keyof RequestOptions>,
  );
  const fetchData = async () => {
    const startTime = new Date().getTime();
    const res = await apiGetPseudoItem({ t: Date.now() }, reqConfig.value);
    time.value = new Date().getTime() - startTime;
    data.value.push(unref(res.data) as PseudoItem);
  };

  const onClickFetchBtn = () => {
    showTime.value = true;
    fetchData();
  };

  const onClickPostBtn = async () => {
    showTime.value = true;
    const startTime = new Date().getTime();
    await requestPublic.post(
      {
        url: '/pseudo',
        data: {
          t: Date.now(),
        },
      },
      reqConfig.value,
    );
    time.value = new Date().getTime() - startTime;
  };

  await fetchData();
</script>
<style lang="less" scoped>
  .cache-usage-container {
    border-radius: 6px;
    border: 1px solid var(--td-component-border);
    overflow: auto;
    height: 480px;
    background: var(--td-bg-color-container);
    display: flex;
    justify-content: space-between;
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
        .cache-usage-config-content-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          list-style: none;
          margin: 0px;
          padding: 0px;
        }
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
</style>
