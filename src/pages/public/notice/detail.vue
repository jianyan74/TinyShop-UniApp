<template>
	<view class="rf-notice-detail">
		<view v-if="state.announceDetail.cover">
			<rf-image width="100%" height="320" :src="state.announceDetail.cover"></rf-image>
			<view class="font-lg p-lg">{{ state.announceDetail.title }}</view>
		</view>
		<view class="font-lg p-lg" v-if="!state.announceDetail.cover">{{
        state.announceDetail.title
		}}</view>
		<view class="pl-lg pr-lg pb-lg" v-if="state.announceDetail.created_at">
			<text v-if="state.announceDetail.author_name" :class="'text-' + themeColor.name" class="mr-sm">{{ state.announceDetail.author_name }}</text>
			<text>发布于</text>
			<text class="ml-sm font-color-light">{{ time(state.announceDetail.created_at) }}</text>
		</view>
		<view class="rf-notice-detail__content pl-lg pr-lg">
      <rf-parser :content="state.announceDetail.content || ''" lazy-load></rf-parser>
		</view>
		<rf-empty
			info="暂无商城公告详情"
			v-if="!state.announceDetail && !state.loading"
		></rf-empty>
		<!--加载动画-->
		<rf-loading :active="state.loading"></rf-loading>
	</view>
</template>
<script setup lang="ts">
import {reactive,} from "vue";
import {onLoad, onShareAppMessage, onShareTimeline,} from "@dcloudio/uni-app";
import {formatToDateTime,} from "@/utils/dateUtil";
import commonApi from "@/api/tinyShop/common";
import {Notice,} from "@/response";
import mHelper from "@/utils/helper";
import RfParser from "@/components/rf-parser/rf-parser.vue";  // 通用方法

const themeColor = mHelper.getThemeColor(); // 主题颜色

// 变量
let state = reactive({
  announceDetail: {} as Notice,
  loading: true,
  noticeId: "",
});

onLoad((options) => {
  state.noticeId = options.id || "";
  getNotifyAnnounceView(state.noticeId);
});
// 分享朋友圈
onShareTimeline(() => {
  return {
    title: state.announceDetail.title,
    path: `/pages/public/notice/detail?id=${state.noticeId}`,
  };
});
// 分享微信好友
onShareAppMessage(() => {
  return {
    title: state.announceDetail.title,
    path: `/pages/public/notice/detail?id=${state.noticeId}`,
  };
});

// 格式化时间
const time = (val:number) => {
  return formatToDateTime(val * 1000);
};
// 获取通知列表
const getNotifyAnnounceView = async (id:string) => {
  try {
    state.announceDetail = await commonApi.getNotifyAnnounceView({id,}) as unknown as Notice;
    state.loading = false;
    uni.setNavigationBarTitle({ title: state.announceDetail.title, });
  } catch (e) {
    state.loading = false;
  }
};
</script>
<style lang="scss">
.rf-notice-detail {
  background-color: $page-color-base;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
