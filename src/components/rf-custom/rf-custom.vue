<template>
  <view class="rf-custom" :style="{ height: state.customBar + 'px', position }">
    <view class="cu-bar" :style="style" :class="[props.bgImage !== '' ? 'none-bg text-white bg-img' : '']">
      <view v-if="props.isBack" class="left" @tap="backPage">
        <rf-icon :color="color" size="40" class="font-weight-500 font-color-dark" name="iconzuo" />
        <slot name="backText" />
      </view>
      <view v-else class="left">
        <slot name="left" />
      </view>
      <view class="flex-1 text-center" :style="[{ top: props.statusBar + 'px' }]">
        <slot name="content" />
      </view>
      <view class="right">
        <slot name="right" />
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import mHelper from '@/utils/helper';
import mRouter from "@/utils/routerUtil";

let state = reactive({
  statusBar: 0,
  customBar: 0
});

onMounted(() => {
  uni.getSystemInfo({
    success: function (e) {
      // #ifndef MP
      state.statusBar = Number(e.statusBarHeight);
      if (e.platform == 'android') {
        state.customBar = Number(e.statusBarHeight) + 50;
      } else {
        state.customBar = Number(e.statusBarHeight) + 45;
      }
      // #endif
      // #ifdef MP-WEIXIN
      state.statusBar = Number(e.statusBarHeight);
      let custom = wx.getMenuButtonBoundingClientRect();
      state.customBar = custom.bottom + custom.top - Number(e.statusBarHeight);
      // #endif
      // #ifdef MP-ALIPAY
      state.statusBar = Number(e.statusBarHeight);
      state.customBar = Number(e.statusBarHeight) + Number(e.titleBarHeight);
      // #endif
    }
  });
});

const props = defineProps({
  bgColor: {
    type: String,
    default: '#fff'
  },
  position: {
    type: String,
    default: 'fixed'
  },
  color: {
    type: String,
    default: '#333'
  },
  isBack: {
    type: [Boolean, String],
    default: true
  },
  bgImage: {
    type: String,
    default: ''
  }
});

const style = computed(() => {
  let style = `height:${state.customBar}px;padding-top:${state.statusBar}px;`;
  if (props.bgColor) {
    style = `${style}background-color:${props.bgColor};`;
  }
  if (props.bgImage) {
    style = `${style}background-image:url(${props.bgImage});`;
  }
  return style;
});

const backPage = () => {
  //判断是否有上一页 外部进入没有上一页 直接回到首页
  // eslint-disable-next-line no-undef
  const pages = getCurrentPages();
  if (pages.length <= 1) {
    mHelper.toast('单页面栈'+ pages.length)
    uni.switchTab({
      url: '/pages/index/index'
    })
  } else {
    mRouter.back();
  }
};
</script>
<style lang="scss" scoped>
.rf-custom {
  width: 100%;
  top: 0;
  z-index: 999;
}
.rf-custom .cu-bar .content {
  width: calc(100% - 440rpx);
}
.rf-custom .cu-bar {
  min-height: 0;
  box-shadow: 0rpx 0rpx 0rpx;
  z-index: 9999;
  display: flex;
  align-items: center;
  .left {
    position: absolute;
    left: 20rpx;
  }
  .right {
    position: absolute;
    right: 20rpx;
  }
}
</style>
