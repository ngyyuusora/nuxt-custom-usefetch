<template>
  <div class="result-container">
    <client-only>
      <div class="result-bg-img">
        <component
          :is="dynamicComponent"
          filled
          :font-controlled="false"
        ></component>
      </div>
    </client-only>

    <div class="result-title">{{ title }}</div>
    <div class="result-tip">{{ tip }}</div>
    <slot />
  </div>
</template>
<script setup lang="ts">
  import {
    SvgoAssetsResult500,
    SvgoAssetsResult404,
    SvgoAssetsResult403,
    SvgoAssetsResultIe,
    SvgoAssetsResultWifi,
    SvgoAssetsResultMaintenance,
  } from '#components';

  const props = defineProps({
    bgUrl: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '结果页',
    },
    tip: {
      type: String,
      default: '结果页默认提示',
    },
    type: {
      type: String,
      default: 'maintenance',
    },
  });

  const dynamicComponent = computed(() => {
    switch (props.type) {
      case '401':
      case '403':
        return SvgoAssetsResult403;
      case '404':
        return SvgoAssetsResult404;
      case '500':
        return SvgoAssetsResult500;
      case 'ie':
        return SvgoAssetsResultIe;
      case 'wifi':
        return SvgoAssetsResultWifi;
      case 'maintenance':
        return SvgoAssetsResultMaintenance;
      default:
        return SvgoAssetsResultMaintenance;
    }
  });
</script>
<style lang="less" scoped>
  .result {
    &-link {
      color: var(--td-brand-color);
      text-decoration: none;
      cursor: pointer;

      &:hover {
        color: var(--td-brand-color);
      }

      &:active {
        color: var(--td-brand-color);
      }

      &--active {
        color: var(--td-brand-color);
      }

      &:focus {
        text-decoration: none;
      }
    }

    &-container {
      min-height: 400px;
      height: 75vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    &-bg-img {
      width: 200px;
      color: var(--td-brand-color);
    }

    &-title {
      font: var(--td-font-title-large);
      font-style: normal;
      margin-top: var(--td-comp-margin-l);
      color: var(--td-text-color-primary);
    }

    &-tip {
      margin: var(--td-comp-margin-s) 0 var(--td-comp-margin-xxxl);
      font: var(--td-font-body-medium);
      color: var(--td-text-color-secondary);
    }
  }
</style>
