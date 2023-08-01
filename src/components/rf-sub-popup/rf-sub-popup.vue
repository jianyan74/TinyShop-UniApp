<script setup lang="ts">
import {subMessage} from "@/utils/wxMpSub/subscribeMessage";

const props = defineProps({
  subType: {
    type: String,
    default: ""
  },
  show: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['close']);
//关闭弹窗
const closePop = () => {
  emit('close');
}
//发起授权
const subscribe = () => {
  console.log('to subscribe')
  subMessage()
}

</script>

<template>
  <view class="rf-sub-popup">
    <view class="mask" @touchmove.stop.prevent="closePop" />
    <view class="content">
      <view></view>
      <button @click="subscribe">
        取消
      </button>
      <button @click="subscribe">
        授权
      </button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.rf-sub-popup {
  .mask {
    position: fixed;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
    transition-property: opacity;
    transition-duration: 0.3s;
    opacity: 1;
    z-index: 9998;
  }

  @keyframes show-content {
    0% {transform: translateY(100%)}
    100% {transform: translateY(0%)}
  }
  .content {
    animation: show-content 300ms 1;
    position: fixed;
    z-index: 9999;
    left:0;
    bottom: 0;
    height: 400rpx;
    width: 100%;
    background-color: #FFFFFF;
  }
}
</style>
