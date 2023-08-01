<template>
  <view class="rf-coupon-detail">
    <rf-custom :bg-color="themeColor.firstGradientColor" color="#fff" position="relative">
      <template v-slot:content>
        <view class="font-weight text-white font-lg">优惠券详情</view>
      </template>
    </rf-custom>
    <view class="rf-coupon-detail__header-bg" :class="'bg-gradual-tb-' + themeColor.name"></view>
    <block v-if="state.couponDetail.id">
      <!--顶部返回按钮-->
      <view class="text-center rf-coupon-detail__header">
        <view v-if="state.couponDetail.discount_type === '1'" class="text-white">可抵扣金额</view>
        <text
          v-if="state.couponDetail.discount_type === '1'"
          :class="'text-' + themeColor.name"
          class="font-lg-32 text-white"
        >
          <text class="font-lg">{{ moneySymbol }}</text>
          {{ state.couponDetail.discount }}
        </text>
        <text v-else class="font-lg-32 text-white" :class="'text-' + themeColor.name">
          {{ `${state.couponDetail.discount}折` }}
        </text>
      </view>
      <!--插画-->
      <view class="rf-coupon-detail__content">
        <view class="cell">
          <text class="tit">名称</text>
          <text class="des">{{ state.couponDetail.title }}</text>
        </view>
        <view class="cell">
          <text class="tit">使用限制</text>
          <text class="des">
            {{ parseInt(state.couponDetail.range_type, 10) === 2 ? '部分商品' : '全部商品' }}
          </text>
          <text
            v-if="
              state.couponDetail.range_type === CouponStatusEnum.ASSIGN_PRODUCT ||
              state.couponDetail.range_type === CouponStatusEnum.ALL
            "
            @tap.stop="
              navTo(mRouteConfig.productList, { param: JSON.stringify({ coupon_type_id: state.couponDetail.id }) })
            "
            class="font-sm ml-sm"
            :class="'text-' + themeColor.name"
          >
            查看
          </text>
        </view>
        <view class="cell">
          <text class="tit">使用条件</text>
          <text class="des">满 {{ state.couponDetail.at_least }} 使用</text>
        </view>
        <view class="cell">
          <text class="tit">领取限制</text>
          <text class="des">
            {{
              parseInt(state.couponDetail.max_fetch, 10) === 0
                ? '无特殊限制'
                : `每人限领 ${state.couponDetail.max_fetch}`
            }}
          </text>
        </view>
        <view class="cell">
          <text class="tit">已被领取</text>
          <text class="des">{{ state.couponDetail.get_count }} 张</text>
        </view>
        <view class="cell">
          <text class="tit">剩余</text>
          <text class="des">{{ state.couponDetail.percentage }} 张</text>
        </view>
        <view class="cell">
          <text class="tit">使用时间</text>
          <text class="des">{{ time(state.couponDetail.start_time) }} ~ {{ time(state.couponDetail.end_time) }}</text>
        </view>
      </view>
      <view class="pl-lg pr-lg">
        <button
          class="rf-confirm-btn"
          :class="'bg-gradual-' + themeColor.name"
          :disabled="state.btnLoading"
          :loading="state.btnLoading"
          @tap="getCoupon(state.couponDetail)"
        >
          领取
        </button>
      </view>
    </block>
    <rf-empty info="暂无优惠券" v-if="!state.couponDetail.id && !state.loading"></rf-empty>
    <!--加载动画-->
    <rf-loading :active="state.loading"></rf-loading>
  </view>
</template>
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { reactive } from 'vue';
import { formatToDateTime } from '@/utils/dateUtil';
import mHelper from '@/utils/helper';
import mConstData from '@/config/constData';
import marketingApi from '@/api/tinyShop/marketing';
import { CouponDetail } from '@/response/coupon';
import { CouponStatusEnum } from '@/enum/couponEnum'; // 路由管理
import mRouteConfig from '@/config/routes';
import { Route } from '@/response/route';
import mRouter from '@/utils/routerUtil';

const hasLogin = mHelper.hasLogin();
const themeColor = mHelper.getThemeColor();
const moneySymbol = mConstData.moneySymbol;

let state = reactive({
  showRight: false,
  loading: true,
  btnLoading: false,
  currentCoupon: {},
  couponDetail: {} as CouponDetail
});

onLoad((options) => {
  initData(options);
});

const navTo = (route: Route, query = {}) => {
  mRouter.push({ route, query });
};

// 格式化时间
const time = (val: string) => {
  return formatToDateTime(parseInt(val) * 1000, 'YYYY-MM-DD');
};
// const show = (item) => {
//   if (item.usableProduct.length === 0) return;
//   state.currentCoupon = item;
//   state.showRight = true;
// };
// 初始化数据
const initData = (options) => {
  if (!options.id) return;
  getMyCouponDetail(options.id);
};
// 获取优惠券
const getCoupon = async (item) => {
  if (!hasLogin) {
    await mHelper.backToLogin();
    return;
  }
  if (parseInt(item.is_get, 10) === 0) {
    mHelper.toast('该优惠券暂不可领取！');
    return;
  }
  state.btnLoading = true;
  try {
    await marketingApi.handleCouponReceive({ id: item.id });
    state.btnLoading = false;
    mHelper.toast('领取成功');
    setTimeout(() => {
      getMyCouponDetail(item.id);
    }, 0.5 * 1000);
  } catch (e) {
    //
    state.btnLoading = false;
  }
};
// 获取我的收货地址列表
const getMyCouponDetail = async (id: string) => {
  state.loading = true;
  try {
    state.couponDetail = (await marketingApi.getCouponDetail({ id })) as unknown as CouponDetail;
    state.loading = false;
  } catch (e) {
    state.loading = false;
  }
};
</script>
<style lang="scss">
.rf-coupon-detail {
  width: 100%;
  overflow: hidden;
  &__header-bg {
    width: 140%;
    height: 450rpx;
    z-index: -1;
    margin-left: -20%;
    border-radius: 0 0 50% 50%;
  }
  &__header {
    margin-top: -400rpx;
  }
  &__content {
    z-index: 100;
    margin: 80rpx $spacing-lg $spacing-lg;
    padding: $spacing-lg;
    border-radius: 18rpx;
    background-color: $color-white;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.06);
    .title {
      font-size: $font-lg;
      margin-bottom: $spacing-lg;
      color: $font-color-dark;
    }
    .cell {
      padding: $spacing-base 0;
      border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
      .tit {
        display: inline-block;
        width: 160rpx;
      }
      .des {
        color: $font-color-light;
      }
      .label-bt {
        padding-left: 30rpx;
      }
    }
    .cell:last-child {
      border-bottom: none;
      padding-bottom: $spacing-sm;
    }
  }
}
</style>
