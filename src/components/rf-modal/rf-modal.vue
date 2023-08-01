<template name="popup">
  <view @touchmove.stop.prevent="() => {}">
    <view class="popup_mask" @tap.stop="() => {}" />
    <view class="popup_content-wrap">
      <view :style="{background}" class="popup_content">
        <view v-if="title" class="title">
          {{ title }}
        </view>
        <scroll-view :scroll-y="true" class="explain_text">
          <slot name="content" />
        </scroll-view>
      </view>
      <view class="close-btn">
        <rf-icon
          v-if="isCloseShow"
          name="iconxiaoxi_guanbizhankai"
          size="72"
          @tap="hidePopup" />
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>

defineProps({
  title: {
    type: String,
    default: "",
  },
  background: {
    type: String,
    default: "#fff",
  },
  cover: {
    type: String,
    default: "",
  },
  isCloseShow: {
    type: Boolean,
    default: false,
  },
  content: {
    type: String,
  },
});

const emit = defineEmits(["hide",]);
const hidePopup = () => {
  emit("hide");
};

</script>
<style lang="scss">
.popup_mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  transition-property: opacity;
  transition-duration: 0.3s;
  opacity: 0;
  z-index: 98;
}

.popup_mask {
  opacity: 1;
}

.popup_content-wrap {
  position: fixed;
  z-index: 99;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;

  .close-btn {
    width: 100%;
    height: 150rpx;
    color: $color-white;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.popup-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  border-radius: 8px;
}

.popup_content {
  overflow: hidden;
  box-sizing: border-box;
  padding: 40rpx 20rpx 0 20rpx;
  border-radius: 8px;
  right: 0;
  min-height: 400rpx;
  width: 80%;
  margin: 0 auto;
  background-size: 600rpx 600px !important;

  .title {
    text-align: center;
    font-size: 34rpx;
    padding: 10rpx 0 0 0;
  }

  .explain_text {
    margin: 10rpx 0;
    padding: 0 30rpx;
    min-height: 320rpx;
    max-height: 64vh;
    z-index: 100;
  }

  .button {
    display: flex;
    padding: 20rpx;
    align-items: center;
    font-size: 34rpx;
    justify-content: space-around;
    border-top: 1rpx solid #f2f2f2;

    view {
      text-align: center;
    }
  }
}
</style>
