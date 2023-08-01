<template>
  <view class="rf-order-refund">
    <!-- 订单列表 -->
    <view
      v-for="(fItem, fIndex) in state.orderList"
      :key="fIndex"
      class="pl-lg pr-lg rf-order-refund__order"
    >
      <!--商户信息-->
      <view class="flex-align-items mb-lg pt-lg">
        <view
          class="flex-1 flex-align-items"
          @tap.stop="
            navTo(mRouteConfig.merchant, {
              id: fItem.merchant_id,
            })
          "
        >
          <rf-image
            width="48"
            height="48"
            border-radius="50%"
            :src="
              fItem.merchant_cover || globalConfig.app_logo
            "
          />
          <text class="ml-sm mr-sm font-base-2 font-weight-500">{{
            state.merchant_title || globalConfig.app_name
          }}</text>
          <rf-icon
            size="26"
            class="font-color-light"
            name="iconyou"
          />
        </view>
      </view>
      <view class="flex-between mb-base">
        <text class="in1line">订单号：{{ fItem.order_sn }}</text>
        <text class="font-sm-2" :class="'text-' + themeColor.name" @tap="copy(fItem.order_sn)">复制</text>
      </view>
      <view
        v-for="(sItem, sIndex) in fItem.product"
        :key="sIndex"
        class="mb-base"
      >
        <!-- 商品列表 -->
        <view
          class="flex mb-base"
          @tap="navTo(mRouteConfig.orderDetail, { id: fItem.id })"
        >
          <rf-image
            border-radius="12"
            width="160"
            height="160"
            :src="sItem.product_picture"
          />
          <view class="ml-base mr-base flex-1">
            <view class="mb-base font-base-2 in2line">
              {{
                sItem.product_name
              }}
            </view>
            <view
              v-if="sItem.sku_name"
              class="font-color-light font-sm-2"
            >
              {{ sItem.sku_name }}
            </view
            >
          </view>
          <view class="text-right">
            <view class="font-lg font-weight-500 mb-sm"
            >
              <text class="font-sm">{{ moneySymbol }}</text
              >{{ sItem.product_original_money }}
            </view>
            <view class="font-base font-color-light font-weight-normal">
              x{{ sItem.num }}
            </view
            >
          </view>
        </view>
      </view>
      <view class="flex-between">
        <view class="total">
          总价
          <text class="font-lg font-color-dark"><text class="font-sm">{{ moneySymbol }}</text>{{ fItem.pay_money }}</text>
        </view>
        <view class="amount">
          实付款
          <text class="font-lg font-color-dark"><text class="font-sm">{{ moneySymbol }}</text>{{ fItem.pay_money }}</text>
        </view>
      </view>
      <view class="flex-justify-end mt-lg pb-lg">
        <button
          class="rf-short-btn"
          :class="'bg-gradual-' + themeColor.name"
          @tap="navTo(mRouteConfig.orderDetail, { id: fItem.id })"
        >
          订单详情
        </button>
      </view>
    </view>
    <rf-load-more
      v-if="state.orderList.length > 0"
      :status="state.loadingType"
    />
    <rf-empty
      v-if="state.orderList.length === 0 && !state.loading"
      info="快去商城逛逛吧"
    />
    <!--加载动画-->
    <rf-loading :active="state.loading" />
  </view>
</template>
<script lang="ts" setup>
import mConstData from "@/config/constData";
import { reactive, } from "vue";
import { onPullDownRefresh, onReachBottom, onShow, } from "@dcloudio/uni-app";
import mRouter from "@/utils/routerUtil";
import { Route, } from "@/response/route";
import mHelper from "@/utils/helper";
import mRouteConfig from "@/config/routes";
import memberApi from "@/api/tinyShop/member";
import { OrderStatusEnum, } from "@/enum/orderEnum";
import { OrderList, } from "@/response/order";
import {PlatformGroupEnum,} from "@/enum/loginEnum"; // 路由管理

const globalConfig = mHelper.getGlobalConfig(); // 通用配置
const themeColor = mHelper.getThemeColor(); // 主题颜色

let state = reactive({
  loadingType: "more",
  orderList: [] as OrderList[],
  page: 1,
  loading: true,
});
const moneySymbol = mConstData.moneySymbol;

onShow(() => {
  initData();
});
// 下拉刷新
onPullDownRefresh(() => {
  state.page = 1;
  state.orderList.length = 0;
  getOrderList("refresh");
});
// 加载更多
onReachBottom(() => {
  if (state.loadingType === "noMore") return;
  state.page++;
  getOrderList();
});
// 跳转页面
const navTo = (route: Route, query = {}) => {
  mRouter.push({ route, query, });
};
// 订单号复制
const copy = (content: string) => {
  mHelper.copy(content);
};
// 数据初始化
const initData = () => {
  state.loading = true;
  state.page = 1;
  state.orderList.length = 0;
  state.page = 1;
  getOrderList();
};
// 获取订单列表
const getOrderList = async (type = "") => {
  const params: AnyObject = {};
  params.page = state.page;
  params.synthesize_status = OrderStatusEnum.RETURN_APPLY;
  try {
    const data = (await memberApi.getOrderList(
      params
    )) as unknown as OrderList[];
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
    state.loadingType = data.length < 10 ? "noMore" : "more";
    state.orderList = [...state.orderList, ...data,];
    state.loading = false;
  } catch (e) {
    //
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
  }
};
</script>
<style lang="scss">
.rf-order-refund {
  background-color: $page-color-base;
  min-height: calc(100vh - var(--status-bar-height) - 86rpx);
  padding-top: $spacing-lg;
  padding-bottom: $spacing-lg;
  &__order {
    background-color: $color-white;
    margin: 0 $page-base-spacing $spacing-lg;
  }
}
</style>
