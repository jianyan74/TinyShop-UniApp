<template>
  <view class="rf-pay-success">
    <rf-custom :is-back="true" color="#fff" :bg-color="'rgb(85 0 0 / 0%)'">
      <template #content><view class="font-weight font-color-dark text-white">支付成功</view></template>
    </rf-custom>
    <view
      :style="{ paddingTop: customBarHeight / 2 + 'px' }"
      class="rf-pay-success__section text-white"
      :class="'bg-gradual-tb-' + themeColor.name"
    >
      <image class="bg" :src="moneyBg"></image>
      <view class="flex-center rf-pay-success__section__content">
        <rf-icon size="100" name="iconxuanzhong2"></rf-icon>
        <view class="ml-base">
          <text class="font-lg-4">支付成功！</text>
          <view class="font-base">感谢您的购买</view>
        </view>
      </view>
    </view>
    <view class="rf-pay-success__pay-card">
      <view v-if="state.orderDetail?.pre_sell?.pre_sell_status === 2" class="text-center pt-lg pb-lg font-lg-8">
        <text class="font-lg">{{ moneySymbol }}</text>
        {{ state.orderDetail?.pre_sell?.final_money }}
      </view>
      <view v-else class="text-center pt-lg pb-lg font-lg-8">
        <text class="font-lg" v-if="state.orderDetail?.pay_money > 0">{{ moneySymbol }}</text>{{ state.orderDetail?.pay_money }}
      </view>
      <view v-if="state.orderDetail?.pay_time" class="ml-lg pl-base">
        下单时间：
        <text class="font-color-light">{{ time(state.orderDetail.pay_time) }}</text>
      </view>
    </view>
    <view class="p-lg mt-50">
      <button
        v-if="state.type === 'wholesale'"
        class="rf-confirm-btn"
        :class="'bg-gradual-' + themeColor.name"
        @tap="navTo(mRouteConfig.wholesaleMy)"
      >
        查看我的拼团
      </button>
      <button
        class="rf-confirm-btn"
        :class="'bg-gradual-' + themeColor.name"
        @tap="navTo(mRouteConfig.order, { state: -1 })"
      >
        查看订单
      </button>
      <button class="rf-confirm-btn bg-white" :class="'text-' + themeColor.name" @tap="navTo(mRouteConfig.index)">
        返回首页
      </button>
    </view>
    <!--页面加载动画-->
    <rf-loading :active="state.loading"></rf-loading>
  </view>
</template>
<script setup lang="ts">
import { Route } from '@/response/route';
import mRouter from '@/utils/routerUtil';
import { formatToDateTime } from '@/utils/dateUtil';
import mRouteConfig from '@/config/routes';
import { onLoad } from '@dcloudio/uni-app';
import mHelper from '@/utils/helper';
import { reactive } from 'vue';
import mConstData from '@/config/constData';
import mAssetsPath from '@/config/assets';
import memberApi from '@/api/tinyShop/member';
import orderApi from '@/api/tinyShop/order';
interface OrderDetail {
  pay_money: string;
  pay_time: number;
}

let state = reactive({
  loading: true,
  type: '',
  id: '',
  orderId: '',
  outTradeNo: '',
  orderDetail: {} as OrderDetail
});

const themeColor = mHelper.getThemeColor(); // 主题颜色
const moneySymbol = mConstData.moneySymbol;
const customBarHeight = mHelper.getCustomBarHeight();
const moneyBg = mAssetsPath.moneyBg;

onLoad((options) => {
  state.type = options.type || '';
  state.orderId = options.order_id || '';
  state.outTradeNo = options.unite_no || '';
  if (state.orderId && state.orderId !== 'undefined') {
    getOrderDetail();
  } else if (state.outTradeNo && state.outTradeNo !== 'undefined') {
    getOrderPayMapDetail();
  }
});
// 获取订单详情
const getOrderDetail = async () => {
  try {
    state.orderDetail = (await memberApi.getOrderDetail({
      id: state.orderId, // 订单id
      simplify: 1
    })) as unknown as OrderDetail;
    state.loading = false;
  } catch (e) {
    state.loading = false;
  }
};
// 获取批量支付详情
const getOrderPayMapDetail = async () => {
  try {
    state.orderDetail = (await orderApi.getOrderPayMapDetail({
      unite_no: state.outTradeNo
    })) as unknown as OrderDetail;
    state.loading = false;
  } catch (e) {
    state.loading = false;
  }
};
// 时间格式化
const time = (val: number) => {
  return formatToDateTime(val * 1000);
};
// 通用跳转
const navTo = (route: Route, query = {}) => {
  mRouter.push({ route, query });
};
</script>
<style lang="scss">
.rf-pay-success {
  background-color: $page-color-base;
  min-height: 100vh;
  &__section {
    width: 100%;
    height: 500rpx;
    overflow: hidden;
    display: flex;
    align-items: center;
    position: relative;
    justify-content: center;
    .bg {
      position: absolute;
    }
  }
  &__pay-card {
    position: relative;
    width: 690rpx;
    background-color: $color-white;
    border-radius: 12rpx;
    margin: -80rpx auto 0;
    padding-bottom: 48rpx;
    box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.05);
  }
  .rf-confirm-btn {
    margin-top: 36rpx;
  }
}
</style>
