<template>
  <view class="rf-account-bill">
    <!--顶部账单类型 全部/充值/消费-->
    <view class="navbar">
      <view
        v-for="(item, index) in billTypeList"
        :key="index"
        :class="state.tabCurrentIndex === index ? 'current text-' + themeColor.name : ''"
        class="nav-item"
        @tap="tabClick(index)"
      >
        {{ item.text }}
      </view>
    </view>
    <!--账单明细列表-->
    <view v-if="state.integralList.length > 0" class="rf-bill-list">
      <view
        v-for="(item, index) in state.integralList"
        :key="index"
        class="rf-list-item flex-between"
      >
        <view class="flex-1">
          <view class="font-base-2 mb-sm">
            {{ item.remark }}
          </view>
          <view class="font-color-light font-sm-2">
            {{ time(item.updated_at) }}
          </view>
        </view>
        <view
          :class="
            item.num >= 0 ? 'color-success' : 'color-primary'
          "
          class="font-lg-4"
        >{{ numFilter(item.num) }}
        </view>
      </view>
      <rf-load-more
        v-if="state.integralList.length > 0"
        :status="state.loadingType"
        class="load-more"
      />
    </view>
    <rf-empty
      v-if="state.integralList.length === 0 && !state.loading"
      info="暂无账单记录"
    />
    <!--加载动画-->
    <rf-loading :active="state.loading" />
  </view>
</template>
<script lang="ts" setup>
import {onLoad, onPullDownRefresh, onReachBottom,} from "@dcloudio/uni-app";
import {formatToDateTime,} from "@/utils/dateUtil";
import {reactive,} from "vue";
import mHelper from "@/utils/helper";
import memberApi from "@/api/tinyShop/member";
import {CreditsLog,} from "@/response/profile";

const themeColor = mHelper.getThemeColor();
const billTypeList = [
  {
    state: 1,
    text: "全部",
  },
  {
    state: 2,
    text: "收入",
  },
  {
    state: 3,
    text: "支出",
  },
];

let state = reactive({
  page: 1,
  loadingType: "more",
  integralList: [] as CreditsLog[],
  tabCurrentIndex: 0,
  loading: true,
});

// 下拉刷新
onPullDownRefresh(() => {
  state.loading = true;
  state.page = 1;
  state.integralList = [];
  getIntegralListList("refresh");
});
// 加载更多
onReachBottom(() => {
  if (state.loadingType === "noMore") return;
  state.page++;
  getIntegralListList();
});
onLoad((options) => {
  initData(options);
});

const time = (val: string) => {
  return formatToDateTime(Number(val) * 1000, "YYYY-MM-DD HH:mm:ss");
};
const numFilter = (val: string) => {
  return parseInt(val) >= 0 ? `+${val}` : val;
};
// 顶部tab点击
const tabClick = (index: number) => {
  state.page = 1;
  state.integralList.length = 0;
  state.loading = true;
  state.tabCurrentIndex = index;
  getIntegralListList();
};
// 数据初始化
const initData = (options) => {
  state.tabCurrentIndex = Number(options.state) || 0;
  tabClick(state.tabCurrentIndex);
};
// 获取积分
const getIntegralListList = async (type = "") => {
  const params: AnyObject = {};
  params.type = 1;
  if (state.tabCurrentIndex) params.num_type = state.tabCurrentIndex;
  params.page = state.page;
  try {
    const data = await memberApi.getCreditsLogList(params) as unknown as CreditsLog[];
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
    state.loadingType = data.length < 10 ? "noMore" : "more";
    state.integralList = [...state.integralList, ...data,];
  } catch (e) {
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
  }
};
</script>
<style lang="scss" scoped>
.rf-account-bill {
  background-color: $page-color-base;
  position: absolute;
  width: 100%;
  height: 100%;

  .rf-bill-list {
    .rf-list-item {
      background-color: $color-white;
      padding: $spacing-lg;
      border: 1rpx solid rgba(0, 0, 0, .06);
    }

    .rf-list-item:last-child {
      border: none;
    }
  }
}
</style>
