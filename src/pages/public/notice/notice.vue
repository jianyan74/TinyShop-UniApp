<template>
  <view class="rf-notice">
    <view v-for="item in state.announceList" :key="item.id" class="rf-notice__item">
      <text class="mb-base font-color-light mt-base">{{ time(item.created_at) }}</text>
      <view
        class="content"
        @tap="navTo(mRouteConfig.noticeDetail, {id: item.id})"
      >
        <view class="flex-align-items pt-lg pb-sm">
          {{ item.title }}
        </view>
        <rf-image v-if="item.cover" width="100%" height="260" :src="item.cover" />
        <text v-if="item.synopsis" class="introduce">{{ item.synopsis }}</text>
        <view class="flex-between pt-base pb-base font-sm font-color-light b-t">
          查看详情<rf-icon size="24" name="iconyou" />
        </view>
      </view>
    </view>
    <rf-load-more
      v-if="state.announceList.length > 0"
      class="load-more"
      :status="state.loadingType"
    />
    <rf-empty
      v-if="state.announceList.length === 0 && !state.loading"
      info="暂无商城公告"
    />
    <!--加载动画-->
    <rf-loading :active="state.loading" />
  </view>
</template>
<script setup lang="ts">
import {reactive,} from "vue";
import {onLoad, onPullDownRefresh, onReachBottom,} from "@dcloudio/uni-app";
import {formatToDateTime,} from "@/utils/dateUtil";
import {Route,} from "@/response/route";
import mRouter from "@/utils/routerUtil";
import mRouteConfig from "@/config/routes";
import commonApi from "@/api/tinyShop/common";
import {Notice,} from "@/response"; // 路由管理

// 变量
let state = reactive({
  announceList: [] as Notice[],
  loadingType: "more",
  merchantId: "",
  loading: true,
  page: 1,
});

// 下拉刷新
onPullDownRefresh(() => {
  state.page = 1;
  state.announceList.length = 0;
  getNotifyAnnounceIndex("refresh");
});
// 加载更多
onReachBottom(() => {
  if (state.loadingType === "noMore") return;
  state.page++;
  getNotifyAnnounceIndex();
});
onLoad((options) => {
  state.merchantId = options.merchant_id || "";
  initData();
});

// 格式化时间
const time = (val:number) => {
  return formatToDateTime(val * 1000);
};
// 通用跳转
const navTo = (route:Route, query = {}) => {
  mRouter.push({ route, query, });
};
// 数据初始化
const initData = () => {
  getNotifyAnnounceIndex();
};
// 获取通知列表
const getNotifyAnnounceIndex = async (type = "") => {
  const params:AnyObject = {};
  if (state.merchantId) params.merchant_id = state.merchantId;
  params.page = state.page;
  try {
    const data = await commonApi.getNotifyAnnounceIndex(params) as unknown as Notice[];
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
    state.loadingType = data.length < 10 ? "noMore" : "more";
    state.announceList = [...state.announceList, ...data,];
  } catch (e) {
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
    state.loading = false;
  }
};
</script>
<style lang="scss">
.rf-notice {
  background-color: $page-color-base;
  position: absolute;
  width: 100%;
  height: 100%;
  .rf-notice__item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .content {
    width: 710rpx;
    padding: 0 $spacing-lg;
    background-color: $color-white;
    border-radius: 4rpx;
  }
  .introduce {
    display: inline-block;
    padding: 16rpx 0;
    font-size: 28rpx;
    color: #606266;
    line-height: 38rpx;
  }
  .b-t {
    border-top: 1rpx solid rgba(0,0,0,0.15);
  }
}

</style>
