<template>
  <view class="rf-item-popup">
    <view class="c-row" @tap.stop="show">
      <view class="left">
        <text class="tit font-color-light font-base">{{ title }}</text>
      </view>
      <view class="mid">
        <slot v-if="!isEmpty" name="content" />
        <view v-else class="empty">
          {{ empty }}
        </view>
      </view>
      <slot class="right" name="right" />
    </view>
    <!--规格-模态层弹窗-->
    <view v-if="specClass === 'show'" class="rf-item-popup__popup" @touchmove.stop.prevent="stopPrevent">
      <!-- 遮罩层 -->
      <view class="mask" @tap="hide" />
      <!--内容层-->
      <view class="layer">
        <slot name="popup" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
  empty: {
    type: String,
    default: "",
  },
  specClass: {
    type: String,
    default: "none",
  },
  isEmpty: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["show", "hide",]);

const show = () => {
  emit("show");
};
const hide = () => {
  emit("hide");
};
const stopPrevent = () => {};
</script>

<style lang="scss">
.rf-item-popup {
	font-size: $font-sm + 2rpx;
	color: $font-color-base;
	.c-row {
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
		position: relative;
		.left {
			width: 140rpx;
		}
		.mid {
			flex: 1;
		}
		.right {
		}
		.empty {
			font-size: $font-base;
		}
	}
	&__popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			border-radius: 10rpx 10rpx 0 0;
			background-color: #fff;
		}
	}
}
</style>
