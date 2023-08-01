<template>
  <view class="rf-footprint">
    <!--日历控件-->
    <rf-calendar
      :today-is-sign="true"
      :sign-data="{
        start: '2018-01-01',
        isMake: false,
        type: 'month',
      }"
      :sign-list="state.signList"
      @callback-sign="handleDateChange"
    />
    <!--足迹列表-->
    <view
      v-for="(item, index) in state.footPrintList"
      :key="index"
      class="rf-footprint__product"
    >
      <!-- 删除按钮 -->
      <view
        class="menu flex-center"
        :class="'bg-' + themeColor.name"
        @tap.stop="handleDeleteFootPrint(item.id)"
      >
        <rf-icon size="72" name="iconiconfontshanchu1" />
      </view>
      <!-- 商品 -->
      <view
        class="carrier p-base"
        :class="[
          state.theIndex === index
            ? 'open'
            : state.oldIndex === index
              ? 'close'
              : '',
        ]"
        @touchstart="touchStart(index, $event)"
        @touchmove="touchMove(index, $event)"
        @touchend="state.isStop = false"
      >
        <rf-image
          width="200"
          height="200"
          border-radius="6"
          :src="item.picture"
        />
        <view
          class="flex-1 ml-base"
          @tap.stop="navToProduct(item.id, item.marketing_type, item.marketing_id)"
        >
          <view class="in1line font-base-2 font-color-dark mb-base font-weight">
            {{ item.name }}
          </view>
          <view class="font-sm mt-sm in1line h-base font-color-light">
            {{ item.sketch }}
          </view>
          <view class="flex-between mt-base">
            <view class="flex-1">
              <view class="price-wrap">
                <text class="mr-sm font-weight" :class="'text-' + themeColor.name">
                  <text class="font-sm">{{ moneySymbol }}</text
                  ><text class="font-lg">{{ item.price }}</text>
                </text>
                <text
                  v-if="item.market_price > item.price"
                  class="line-through font-color-light"
                ><text class="font-sm">{{ moneySymbol }}{{ item.market_price }}</text
                ></text
                >
              </view>
              <view
                v-if="item.baseMerchant?.id"
                class="font-sm font-color-light mt-sm flex-align-items"
                @tap.stop="
                  navTo(mRouteConfig.merchant, { id: item.baseMerchant?.id })
                "
              >
                <rf-icon size="24" name="icondianpu2" />
                <view class="font-color-light ml-sm mr-sm-half font-sm">
                  {{
                    item.baseMerchant?.title
                  }}
                </view>
                <rf-icon size="24" name="iconyou" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <rf-load-more
      v-if="state.footPrintList.length > 0"
      :status="state.loadingType"
    />
    <!--足迹列表为0-->
    <rf-empty
      v-if="state.footPrintList.length === 0 && !state.loading"
      info="暂无足迹列表"
    />
    <!--加载动画-->
    <rf-loading :active="state.loading" />
  </view>
</template>
<script lang="ts" setup>
import { reactive, } from "vue";
import { currentTimestamp, } from "@/utils/dateUtil";
import { onLoad, onReachBottom, } from "@dcloudio/uni-app";

import mHelper from "@/utils/helper";
import memberApi from "@/api/tinyShop/member";
import mConstData from "@/config/constData";

import { Route, } from "@/response/route";
import mRouter from "@/utils/routerUtil";
import { ProductListItem, } from "@/response/product";
import mRouteConfig from "@/config/routes";

// 常量
const themeColor = mHelper.getThemeColor();
const moneySymbol = mConstData.moneySymbol;

// 变量
let state = reactive({
  footPrintList: [] as ProductListItem[],
  page: 1,
  loadingType: "more",
  isStop: false,
  startTime: 0 as number,
  endTime: 0 as number,
  loading: true,
  theIndex: -1,
  oldIndex: -1,
  initXY: [] as number[],
});

// 加载更多
onReachBottom(() => {
  if (state.loadingType === "noMore") return;
  state.page++;
  getFootPrintList();
});
onLoad(() => {
  initData();
});

// 监听日期变化
const handleDateChange = async (e) => {
  state.oldIndex = -1;
  state.theIndex = -1;
  state.page = 1;
  state.footPrintList = [];
  state.startTime = currentTimestamp(
    `${Number(e.date)} 000000`,
    "YYYYMMDD HHmmss"
  );
  state.endTime = currentTimestamp(`${Number(e.date) + 1} 000000`);
  state.loading = true;
  await getFootPrintList();
};

// 删除足迹
const handleDeleteFootPrint = async (id: string) => {
  try {
    await memberApi.handleFootPrintDel({}, { id, });
    mHelper.toast("删除足迹成功");
    initData();
  } catch (e) {
    //
  }
};
// 数据初始化
const initData = () => {
  state.page = 1;
  state.footPrintList = [];
  state.oldIndex = -1;
  state.theIndex = -1;
  getFootPrintList();
};
// 获取我的足迹列表
const getFootPrintList = async () => {
  const params: AnyObject = {};
  params.page = state.page;
  // 起始时间和结束时间
  if (state.startTime && state.endTime) {
    params.start_time = state.startTime;
    params.end_time = state.endTime;
  }
  try {
    const data = (await memberApi.getFootPrintList(
      params
    )) as unknown as ProductListItem[];
    state.loading = false;
    state.loadingType = data.length < 10 ? "noMore" : "more";
    state.footPrintList = [...state.footPrintList, ...data,];
  } catch (e) {
    state.loading = false;
  }
};
// 控制左滑删除效果
const touchStart = (index: number, event) => {
  // 多点触控不触发
  if (event.touches.length > 1) {
    state.isStop = true;
    return;
  }
  state.oldIndex = state.theIndex;
  state.theIndex = -1;
  // 初始坐标
  state.initXY = [event.touches[0].pageX, event.touches[0].pageY,];
};
const touchMove = (index: number, event) => {
  // 多点触控不触发
  if (event.touches.length > 1) {
    state.isStop = true;
    return;
  }
  let moveX = event.touches[0].pageX - state.initXY[0];
  let moveY = event.touches[0].pageY - state.initXY[1];

  if (state.isStop || Math.abs(moveX) < 5) return;
  if (Math.abs(moveY) > Math.abs(moveX)) {
    // 竖向滑动-不触发左滑效果
    state.isStop = true;
    return;
  }

  if (moveX < 0) {
    state.theIndex = index;
    state.isStop = true;
  } else if (moveX > 0) {
    if (state.theIndex !== -1 && state.oldIndex === state.theIndex) {
      state.oldIndex = index;
      state.theIndex = -1;
      state.isStop = true;
      setTimeout(() => {
        state.oldIndex = -1;
      }, 150);
    }
  }
};
// 通用跳转
const navTo = (route: Route, query = {}) => {
  mRouter.push({ route, query, });
};
// 跳转至商品详情
const navToProduct = (id: string, marketingType: string, marketingId) => {
  mHelper.navToProduct(id, marketingType, marketingId);
};
</script>
<style lang="scss" scoped>
.rf-footprint {
  &__product {
    height: 200rpx;
    margin: $spacing-base auto;
    border-radius: 6rpx;
    box-shadow: 0rpx 5rpx 12rpx rgba(0, 0, 0, 0.02);
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    .menu {
      position: absolute;
      width: 200rpx;
      height: 200rpx;
      right: 0;
      z-index: 2;
    }
    .carrier {
      &.open {
        animation: showMenu 0.25s linear both;
      }
      &.close {
        animation: closeMenu 0.15s linear both;
      }
      background-color: $color-white;
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 3;
      display: flex;
      align-items: center;
    }
  }
}
</style>
