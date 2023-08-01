<template>
  <view
    v-if="globalConfig.app_name && parseInt(globalConfig.site_status) === 0" class="versionUpgrade"
    @touchmove.stop.prevent="() => {}">
    <view class="upgrade-wrapper">
      <view :class="'bg-' + themeColor.name" class="rf-version-upgrade" @tap.stop="() => {}">
        <image :src="openSiteBg" />
        <view class="upgrade-top-content">
          <view>系统维护中</view>
          <view class="upgrade-time" :style="{textAlign: 'justify'}">
            {{ globalConfig.site_close_explain }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>

import {computed,} from "vue";
import mAssetsPath from "@/config/assets";
import mHelper from "@/utils/helper";
import store from "@/store";

const themeColor = mHelper.getThemeColor(); // 主题颜色

const globalConfig = computed(() => {
  return store.getters["user/getGlobalConfig"];
});

const openSiteBg = mAssetsPath.openSiteBg;
</script>
<style lang="scss" scoped>
.versionUpgrade {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999999;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.upgrade-wrapper {
  width: 500rpx;
  height: 600rpx;
}

.rf-version-upgrade {
  z-index: 9999999;
  margin-top: -60rpx;
  width: 100%;
  height: 600rpx;
  border-radius: 12rpx;
  display: flex;
  justify-content: center;
  position: relative;

  image {
    position: absolute;
    top: -150rpx;
    width: 100%;
    height: 800rpx;
    border-radius: 12rpx;
  }

  .upgrade-top-content {
    font-weight: 500;
    margin-top: 280rpx;
    text-align: center;
    color: $font-color-dark;
    z-index: 100;
    font-size: $font-lg + 2rpx;

    .upgrade-time {
      margin-top: $spacing-lg;
      padding: 0 $spacing-base;
      font-size: $font-base;
      color: $font-color-light;
    }
  }
}
</style>
