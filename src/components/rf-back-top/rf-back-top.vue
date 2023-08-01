<template>
	<view
		v-if="scrollTop > 400"
		class="backTop"
		:class="{ 'mescroll-fade-in': isShowToTop }"
		@click="toTopClick"
	>
		<text class="iconfont icondingbu"></text>
	</view>
</template>
<script lang="ts">
export default {name: "rf-back-home",};
</script>
<script lang="ts" setup>

import {ref,} from "vue";

const isShowToTop = ref(true);
const emit = defineEmits(["setScrollTop",]);

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  scrollTop: {
    type: Number,
    default: 0,
  },
  tab: {
    type: Boolean,
    default: false,
  },
});

const toTopClick = () => {
  isShowToTop.value = false; // 回到顶部按钮需要先隐藏,再执行回到顶部,避免闪动
  if (props.tab) {
    emit("setScrollTop");
  } else {
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
  }
};
</script>
<style lang="scss">
.mescroll-lazy-in,
.mescroll-fade-in {
	-webkit-animation: mescrollFadeIn 0.3s linear forwards;
	animation: mescrollFadeIn 0.3s linear forwards;
}

.backTop {
	z-index: 10;
	position: fixed;
	right: 40rpx;
	bottom: 160rpx;
  margin-bottom: calc(env(safe-area-inset-bottom) / 2);
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	transform: translateZ(0);
	background-color: rgba(0,0,0,.4);
	display: flex;
	justify-content: center;
	align-items: center;
	.iconfont {
		font-size: 50rpx;
		color: $color-white;
		font-weight: 500;
		z-index: 10;
	}
}
</style>
