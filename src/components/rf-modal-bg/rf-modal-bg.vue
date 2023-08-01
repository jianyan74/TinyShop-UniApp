<template name="popup">
	<view @touchmove.stop.prevent="clear">
		<view class="popup_mask" @touchmove.stop.prevent="clear"></view>
		<view class="popup_content-wrap">
      <view class="popup-bg" v-if="cover">
        <rf-image width="600" height="600" :src="cover"></rf-image>
      </view>
      <view class="popup_content" :style="{background: !cover ? background : ''}">
        <view class="title" v-if="title">{{ title }}</view>
        <scroll-view :scroll-y="true" class="explain_text">
          <slot name="content"></slot>
        </scroll-view>
      </view>
      <rf-icon v-if="isCloseShow" @tap.stop="hidePopup" class="close-btn" size="72" name="iconxiaoxi_guanbizhankai"></rf-icon>
    </view>
  </view>
</template>
<script setup lang="ts">

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
// 禁止滚动
const clear = () => {
  //
};
const hidePopup = () => {
  emit("hide");
};

</script>
<style lang="scss">
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
		padding: 30rpx;
    height: 600rpx;
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
