<template>
  <view class="timelineItem">
    <view class="timeItem">
      <view v-if="leftTime" class="leftTime">
        {{ leftTime }}
      </view>
      <view :style="{height: isEnd ? 0 : ''}" class="line">
        <view :style="{background: color}" class="out">
          <view :style="{background: innerColor}" class="inner" />
        </view>
      </view>
      <view class="rightContent">
        <slot />
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    leftTime: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#eee",
    },
    innerColor: {
      type: String,
      default: "#fff",
    },
    isEnd: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.timelineItem {
  .timeItem {
    display: flex;

    .leftTime {
      width: 135rpx;
      padding: 0 10rpx;
      font-size: 22rpx;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      margin-right: 10rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .line {
      width: 1rpx;
      background: rgba(204, 204, 204, 1);
      position: relative;

      .out {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 14rpx;
        height: 14rpx;
        background: rgba(236, 104, 23, 0.6);
        border-radius: 50%;

        .inner {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 8rpx;
          height: 8rpx;
          border-radius: 50%;
          z-index: 10;
        }
      }
    }

    .rightContent {
      flex: 1;
      padding: 0 10rpx 16rpx;
      margin-left: 20rpx;
      margin-top: -12rpx;
      min-height: 50rpx;
    }
  }
}
</style>
