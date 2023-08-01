<template>
  <view class="rf-popup" @touchmove.stop.prevent="clear">
    <view class="popup_mask" @touchmove.stop.prevent="clear" />
    <view class="popup_content-wrap">
      <view class="popup_content">
        <view v-if="title" class="title">
          {{ title }}
        </view>
        <scroll-view :scroll-y="true" class="explain_text">
          <rich-text :nodes="content" />
        </scroll-view>
        <view v-if="btnShow" class="button">
          <view class="back" @tap="back">
            暂不使用
          </view>
          <view class="consent" @tap="consent">
            同意
          </view>
        </view>
      </view>
      <rf-icon v-if="isCloseShow" class="close-btn" size="72" name="iconxiaoxi_guanbizhankai" @tap.stop="hidePopup" />
    </view>
  </view>
</template>
<script setup lang="ts">

defineProps({
  title: {
    type: String,
    default: "",
  },
  isCloseShow: {
    type: Boolean,
    default: false,
  },
  btnShow: {
    type: Boolean,
    default: true,
  },
  content: {
    type: String,
  },
});

const emit = defineEmits(["popupState", "hide",]);
// 禁止滚动
const clear = () => {
  //
};
const back = () => {
  emit("popupState", false);
};
const hidePopup = () => {
  emit("hide");
};
// 关闭弹框
const consent = () => {
  emit("popupState", true);
};

</script>
<style lang="scss">
.rf-popup {
  .popup_mask {
    position: fixed;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
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
      position: absolute;
      color: $color-white;
      left: 50%;
      bottom: -160rpx;
      transform: translate(-50%, -50%);
    }
  }

  .popup_content {
    overflow: hidden;
    box-sizing: border-box;
    padding: 40rpx 20rpx 0 20rpx;
    border-radius: 8px;
    right: 0;
    background: #ffffff;
    width: 80%;
    margin: 0 auto;

    .title {
      text-align: center;
      font-size: 34rpx;
      padding: 10rpx 0 0 0;
    }

    .explain_text {
      padding: 30rpx;
      max-height: 60vh;
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
}
</style>
