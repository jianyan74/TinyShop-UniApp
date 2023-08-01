<template>
  <view class="rf-load-more" :style="{ width }">
    <view v-if="status === 'more'" :style="{ color: fontColor }">
      加载中...
    </view>
    <view v-else class="flex-align-items" :style="{ color: fontColor }">
      <view class="line" />
      没有更多了
      <view class="line" />
    </view>
  </view>
</template>
<script lang="ts">
export default { name: "RfLoadMore", };
</script>
<script lang="ts" setup>
defineProps({
  status: {
    // 上拉的状态：more-loading前；loading-loading中；noMore-没有更多了
    type: String,
    default: "more",
  },
  fontColor: {
    type: String,
    default: "#999",
  },
  width: {
    // 上拉的状态：more-loading前；loading-loading中；noMore-没有更多了
    type: String,
    default: "100vw",
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  color: {
    type: String,
    default: "#999",
  },
});
</script>

<style lang="scss" scoped>
.rf-load-more {
  display: flex;
  height: 80rpx;
  align-items: center;
  justify-content: center;
  .line {
    width: 90rpx;
    height: 2rpx;
    margin: 0 20rpx;
    background: $border-color-base;
  }
}
</style>
