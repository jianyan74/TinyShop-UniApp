<template>
	<view class="rf-url">
		<web-view :src="url"></web-view>
	</view>
</template>
<script setup lang="ts">
import {ref,} from "vue";
import {onLoad, onShareAppMessage, onShareTimeline,} from "@dcloudio/uni-app";
import mHelper from "@/utils/helper";
import mRouteConfig from "@/config/routes";

const globalConfig = mHelper.getGlobalConfig(); // 通用配置
const url = ref(""); // 外部url地址

// 微信小程序分享参数
const shareConfig = {title: globalConfig.app_name, path: `${mRouteConfig.url}?url=${url.value}`,};

onLoad((options) => {
  url.value = options.url || "";
});

// 微信小程序分享至朋友圈
onShareTimeline(() => {
  return shareConfig;
});
// 微信小程序分享给朋友
onShareAppMessage(() => {
  return shareConfig;
});
</script>
