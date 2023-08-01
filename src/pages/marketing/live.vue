<template>
  <view class="rf-live-list">
    <!--顶部账单类型 全部/充值/消费-->
    <view class="navbar">
      <view
        v-for="(item, index) in liveTypeList"
        :key="index"
        :class="state.tabCurrentIndex === index ? 'current text-' + themeColor.name : ''"
        class="nav-item"
        @tap="tabClick(index, item.state)"
      >
        {{ item.text }}
      </view>
    </view>
    <!--提现明细列表-->
    <view v-if="state.liveList.length > 0" class="rf-list">
      <view
        v-for="(item, index) of state.liveList"
        :key="index"
        class="rf-list-item"
        @tap="navToLive(item)"
      >
        <rf-image
          :src="item.cover_img || defaultImg"
          height="150"
          width="170"
        />
        <view class="flex-1 ml-base">
          <text class="font-weight-500 line-height-2 in2line">{{ item.name }}</text>
          <text class="in1line">主播：{{ item.anchor_name || '暂未填写' }}</text>
          <text v-if="item.live_status === '101'" class="font-color-light font-sm">直播开始于 {{
            time(item.start_time)
          }}
          </text>
          <text v-if="item.live_status === '102'" class="font-color-light font-sm">直播于 {{ time(item.start_time) }}
            开始
          </text>
          <text v-if="item.live_status === '103'" class="font-color-light font-sm">直播: {{ time(item.start_time) }} -
            {{ time(item.end_time) }}
          </text>
        </view>
        <view>
          <rf-tag
            :bg-color="`rgba(${themeColor.rgb}, 0.12)`"
            :border-radius="6"
            :color="themeColor.color"
            :text="filterStateText(state.status)"
            :type="filterStateTag(state.status)"
            class="tag"
          />
        </view>
      </view>
      <rf-load-more
        v-if="state.liveList.length > 0"
        :status="state.loadingType"
        class="load-more"
      />
    </view>
    <rf-empty
      v-if="state.liveList.length === 0 && !state.loading"
      info="暂无直播记录"
    />
    <!--加载动画-->
    <rf-loading :active="state.loading" />
  </view>
</template>
<script lang="ts" setup>
import {formatToDateTime,} from "@/utils/dateUtil";
import {onLoad, onPullDownRefresh, onReachBottom,} from "@dcloudio/uni-app";
import {reactive,} from "vue";
import mHelper from "@/utils/helper";
import {PlatformGroupEnum,} from "@/enum/loginEnum";
import mConstData from "@/config/constData";
import wechatMiniApi from "@/api/wehchatMini/wechat";
import mAssetsPath from "@/config/assets";
import {LiveItem,} from "@/response/live";
import mSiteConfig from "@/config/site";

// 变量
let state = reactive({
  loading: true,
  status: 1,
  page: 1,
  loadingType: "more",
  tabCurrentIndex: 0,
  liveList: [] as LiveItem[],
});

// 常量
const liveTypeList = mConstData.liveTypeList;
const themeColor = mHelper.getThemeColor(); // 主题颜色
const defaultImg = mAssetsPath.defaultImg;

const time = (val: string) => {
  return formatToDateTime(parseInt(val) * 1000, "MM/DD HH:mm");
};

const filterStateText = (val: number) => {
  switch (Number(val)) {
    case 101:
      return "直播中";
    case 102:
      return "未开始";
    case 103:
      return "已结束";
  }
};
const filterStateTag = (val: number) => {
  switch (Number(val)) {
    case 101:
      return "success";
    case 102:
      return "warning";
    case 103:
      return "error";
  }
};

// 下拉刷新
onPullDownRefresh(() => {
  state.page = 1;
  state.loading = true;
  state.liveList = [];
  getLiveList("refresh");
});
// 加载更多
onReachBottom(() => {
  if (state.loadingType === "noMore") return;
  state.page++;
  getLiveList();
});

onLoad((options) => {
  initData(options);
});

// 顶部tab点击
const tabClick = (index: number, flag: number) => {
  state.page = 1;
  state.liveList.length = 0;
  state.loading = true;
  state.tabCurrentIndex = index;
  state.status = flag;
  getLiveList();
};
// 数据初始化
const initData = (options) => {
  state.status = Number(options.state) || 101;
  if (state.toString() === "2") {
    state.tabCurrentIndex = 1;
  } else if (state.toString() === "3") {
    state.tabCurrentIndex = 2;
  }
  getLiveList();
};
// 获取直播记录
const getLiveList = async (type = "") => {
  try {
    const data = await wechatMiniApi.getWechatMiniLiveList({
      page: state.page,
      live_status: state.status,
    }) as unknown as LiveItem[];
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
    state.loadingType = data.length < 10 ? "noMore" : "more";
    state.liveList = [
      ...state.liveList,
      ...data,
    ];
  } catch (e) {
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
  }
};
const navToLive = (item) => {
  const roomId = item.room_id;
  if (!roomId || state.status !== 101) return;
  if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMINI) {
    uni.navigateTo({url: `plugin-private://${mSiteConfig.mpLiveAppId}/pages/live-player-plugin?room_id=${[roomId,]}`,});
  } else {
    mHelper.toast("请从微信小程序进入带货直播间");

  }
};

</script>
<style lang="scss" scoped>
.rf-live-list {
  background-color: $page-color-base;
  min-height: calc(100vh - var(--status-bar-height) - 86rpx);
}
</style>
