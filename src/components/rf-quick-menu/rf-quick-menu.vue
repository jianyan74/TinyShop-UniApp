<template>
  <view class="rf-quick-menu">
    <view
      class="homeCon"
      :class="!state.homeActive ? 'on' : ''"
      :style="{ height: `${homeFloatNav.length * 90}rpx` }"
    >
      <button
        v-for="(item, index) in homeFloatNav"
        :key="index"
        class="wrapper"
        @tap="navTo(item?.link?.route)"
      >
        <rf-icon
          v-if="item.picture_type === 'iconfont'"
          size="36"
          :name="item.picture"
        />
        <rf-image
          v-else
          border-radius="6"
          width="40"
          height="40"
          :src="item.picture"
        />
      </button>
    </view>
    <view class="menu" :class="'bg-' + themeColor.name" @tap.stop="open">
      <rf-icon size="40" name="iconkuaijiecaidan" />
    </view>
    <rf-base-popup v-if="state.serviceShow" @close="state.serviceShow = false">
      <template #content>
        <rf-image
          width="360"
          height="360"
          border-radius="12rpx"
          :src="globalConfig.app_service_qr"
        />
      </template>
    </rf-base-popup>
  </view>
</template>
<script setup lang="ts">
import mHelper from "@/utils/helper";
import { computed, reactive, } from "vue";
import store from "@/store";
import mRouteConfig from "@/config/routes";
import mRouter from "@/utils/routerUtil";

const themeColor = mHelper.getThemeColor(); // 主题颜色

const homeFloatNav = computed(() => {
  return store.getters["user/getHomeFloatNav"];
});

const globalConfig = computed(() => {
  return store.getters["user/getGlobalConfig"];
});

let state = reactive({
  serviceShow: false,
  homeActive: true,
});

const open = () => {
  state.homeActive = !state.homeActive;
};

const navTo = (route: string) => {
  if (route === "service" || route === "serviceCenter") {
    if (!globalConfig.value.app_service_type) {
      mHelper.toast("暂不提供客服功能");
      return;
    }
    state.homeActive = true;
    if (globalConfig.value.app_service_type === 1) {
      if (!globalConfig.value.app_service_qr) {
        mHelper.toast("暂未配置客服二维码");
      }
      state.serviceShow = true;
      return;
    } else if (globalConfig.value.app_service_type === 2) {
      mRouter.push({ route: mRouteConfig.serviceCenter, });
      return;
    } else if (globalConfig.value.app_service_type === 3) {
      return;
    }
  }
  state.homeActive = true;
  mRouter.push({route: mRouteConfig[route],});
};
</script>
<style scoped lang="scss">
.rf-quick-menu {
  position: fixed;
  right: 40rpx;
  bottom: 260rpx;
  margin-bottom: env(safe-area-inset-bottom);
  text-align: center;
  z-index: 100;
  .homeCon {
    overflow: hidden;
    width: 0.86rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease-in-out 0s;
    opacity: 0;
    transform: scale(0);
    height: 0;
    .wrapper {
      width: 72rpx;
      height: 72rpx;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
      line-height: 1 !important;
      padding: 0;
      margin-bottom: $spacing-base;
      .iconfont {
        font-size: 45rpx;
        opacity: 1;
        color: $color-white;
        z-index: 92;
      }
    }
  }

  .on {
    opacity: 1;
    transform: scale(1);
    width: 72rpx;
    margin-bottom: 20rpx;
  }
  .menu {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont {
      color: $color-white;
      z-index: 92;
    }
  }
}
</style>
