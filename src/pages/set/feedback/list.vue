<template>
  <view class="rf-feedback-list">
    <view v-if="state.feedbackList.length > 0" class="rf-base-list">
      <view
        v-for="(item, index) in state.feedbackList"
        :key="index"
        class="rf-base-list__item"
        @tap="navTo(mRouteConfig.feedbackDetail, { id: item.id })"
      >
        <view class="flex-align-items">
          <rf-tag
            :text="feedbackFilter(item.type)"
            :color="themeColor.color"
            :bg-color="`rgba(${themeColor.rgb}, 0.12)`"
            :border-radius="6"
          />
          <text class="ml-sm in1line">{{ item.content }}</text>
        </view>
        <view class="mt-base">
          <text class="mr-base">{{ item.reply || "管理员未回复" }}</text>
          <text class="font-color-light"
          >联系方式：{{ item.contact_way || "暂无" }}</text
          >
        </view>
      </view>
      <rf-load-more
        v-if="state.feedbackList.length > 0 && !state.loading"
        :status="state.loadingType"
      />
    </view>
    <view class="rf-bottom-btn btn-safe-area-bottom">
      <button
        class="rf-bottom-btn__btn"
        :class="'bg-gradual-' + themeColor.name"
        @tap="navTo(mRouteConfig.feedback)"
      >
        意见反馈
      </button>
    </view>
    <rf-empty
      v-if="state.feedbackList.length === 0 && !state.loading"
      info="您还没有反馈意见"
    />
    <rf-loading :active="state.loading" />
  </view>
</template>
<script setup lang="ts">
import { reactive, } from "vue";
import {onPullDownRefresh, onReachBottom, onShow,} from "@dcloudio/uni-app";
import mRouter from "@/utils/routerUtil";
import mRouteConfig from "@/config/routes"; // 路由管理
import { Route, } from "@/response/route";
import mHelper from "@/utils/helper";
import memberApi from "@/api/tinyShop/member";
import { Feedback, } from "@/response/feedback";

let state = reactive({
  page: 1,
  feedbackList: [] as Feedback[],
  loadingType: "more",
  loading: true,
});

const themeColor = mHelper.getThemeColor(); // 主题颜色

// 下拉刷新
onPullDownRefresh(() => {
  state.loading = true;
  state.page = 1;
  state.feedbackList.length = 0;
  getFeedbackList("refresh");
});
// 加载更多
onReachBottom(() => {
  if (state.loadingType === "noMore") return;
  state.page++;
  getFeedbackList();
});
onShow(() => {
  initData();
});

const feedbackFilter = (type = "") => {
  const feedbackType = ["", "功能建议", "BUG反馈", "业务咨询",];
  return feedbackType[parseInt(type, 10)];
};
// 数据初始化
const initData = () => {
  state.page = 1;
  state.feedbackList.length = 0;
  getFeedbackList();
};
// 获取意见反馈列表
const getFeedbackList = async (type = "") => {
  try {
    const data = (await memberApi.getOpinionList({
      page: state.page,
    })) as unknown as Feedback[];
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
    state.loadingType = data.length < 10 ? "noMore" : "more";
    state.feedbackList = [...state.feedbackList, ...data,];
  } catch (e) {
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
  }
};
const navTo = (route: Route, query = {}) => {
  mRouter.push({ route, query, });
};
</script>
<style lang="scss">
page {
  background-color: $page-color-base;
}
.rf-feedback-list {
  background-color: $page-color-base;
  padding-bottom: 110rpx;
}
</style>
