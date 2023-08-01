<template>
  <view
    class="rf-base-popup"
    @touchmove.stop.prevent="() => {}"
  >
    <view class="mask" @tap="close" />
    <view class="content">
      <slot name="content" />
    </view>
    <slot name="position" />
  </view>
</template>
<script lang="ts" setup>
const emit = defineEmits(["close",]);
// 关闭弹框
const close = () => {
  emit("close", true);
};

</script>
<style lang="scss">
.rf-base-popup {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 101;

  .mask {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .content {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 101;
    transform: translate(-50%, -50%);
    margin-top: -10%;
  }

  .layer-service {
    min-height: 600rpx;

    .btn {
      width: calc(100% - 60rpx);
      position: absolute;
      bottom: 0;
    }
  }

  &.service {
    min-height: 600rpx;

    .row {
      margin: 30rpx;

      .title {
        font-size: 30rpx;
        margin: 10rpx 0;
      }

      .description {
        font-size: 28rpx;
        color: #999;
      }
    }
  }
}
</style>
