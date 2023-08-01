<template>
  <view class="rf-no-data">
    <rf-image width="400" height="280" :src="networkType === 'none' ? noNetWorkImg : notFoundImg" />
    <!-- 网络连接失败默认显示内容 -->
    <view class="content">
      <text class="title">{{ networkType === 'none' ? state.mainText : '' }}</text>
      <text class="desc">{{ networkType === 'none' ? state.viceText : errorText }}</text>
      <button class="btn" @tap="setting()">
        刷新试试
      </button>
    </view>
    <view class="back">
      <text class="spec-color" @tap="navTo(mRouteConfig.index)">返回主页</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import {computed, reactive,} from "vue";
import mAssetsPath from "@/config/assets";
import {Route,} from "@/response/route";
import mRouter from "@/utils/routerUtil";
import mRouteConfig from "@/config/routes";

defineProps({
  errorText: {
    type: String,
    default: "暂无数据",
  },
});
let state = reactive({
  type: "",
  mainText: "网络居然崩溃了",
  viceText: "别紧张,去检测一下网络设置",
});

const notFoundImg = mAssetsPath.notFoundImg;
const noNetWorkImg = mAssetsPath.noNetWorkImg;

// 获取网络状态
const networkType = computed(() => {
  let status = "unknown";
  uni.getNetworkType({
    success: function (res) {
      status = res.networkType;
    },
  });
  return status;
});

const emit = defineEmits(["refresh",]);
const setting = () => {
  emit("refresh");
};
// 通用跳转
const navTo = (route:Route, query = {}) => {
  mRouter.push({ route, query, });
};
</script>

<style lang="scss" scoped>
.rf-no-data {
	width: 100%;
	height: calc(100vh - 150rpx);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	.content {
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		letter-spacing: 1rpx;
		.title {
			font-size: $font-lg;
			color: $font-color-dark;
		}
		.desc {
			font-size: 28rpx;
			margin-top: 6rpx;
		}
		.btn {
			width: 160rpx;
			height: 65rpx;
			color: #868d91;
			font-size: 24rpx;
			margin-top: 34rpx;
			border-radius: 36rpx;
			border: 1rpx solid #d4d4d4;
		}
		.btn::after {
			border: none;
		}
	}
	.back {
		margin: 300rpx 0 40rpx;
	}
}
</style>
