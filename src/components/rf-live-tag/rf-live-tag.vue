<template>
  <view class="rf-live" v-show="liveShow">
		<view class="wrapper">
			<text class="iconfont" :class="icon"></text>
			<view class="content">直播中</view>
			<view class="btn" @tap="navToLive">去围观</view>
		</view>
  </view>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import mRouter from "@/utils/routerUtil";
import mHelper from "@/utils/helper";
import marketingApi from "@/api/tinyShop/marketing";

const icon = ref("iconzhibo11");
const index = ref(1);
const liveShow = ref(false);
const roomId = ref("");
const timer = ref("" as any);


onMounted(() => {
  // getLiveList();
});
// 销毁定时器

// 获取直播记录
const getLiveList = async () => {
  try {
    const data = await marketingApi.getMiniProgramLiveIndex({live_status: 101}) as any;
    if (data.length === 0) return;
    liveShow.value = true;
    roomId.value = data[0].room_id;
    timer.value = setInterval(() => {
      if (index.value > 3) index.value = 1;
      icon.value = `iconzhibo${index.value}1`;
      index.value += 1;
    }, 0.15 * 1000);
  } catch (e) {
    //
  }
};
const navToLive = () => {
  // #ifdef MP-WEIXIN
  if (!roomId.value) return;
  mRouter.push({ route: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${[roomId]}` });
  // #endif
  // #ifndef MP-WEIXIN
  mHelper.toast("请从微信小程序进入带货直播间");
  // #endif
};
</script>
<style scoped lang="scss">
	.rf-live {
		width: 100%;
		.wrapper {
			padding: $spacing-base $spacing-sm $spacing-sm;
			background-color: rgba(0 ,0, 0, 0.6);
			border-radius: 12rpx;
			position: fixed;
			text-align: center;
			right: 40rpx;
			top: 40%;
			z-index: 98;
			color: $color-white;
			.iconfont {
				font-size: $font-lg;
				opacity: 1;
				z-index: 92;
			}
			.content {
				font-size: $font-sm;
				margin: $spacing-sm 0;
			}
			.btn {
				margin-top: $spacing-lg;
				font-size: $font-sm;
				background-color: $base-color;
				opacity: 1;
				width: 100rpx;
				height: 42rpx;
				line-height: 42rpx;
				border-radius: 18rpx;
			}
		}
	}
</style>
