<template>
  <view class="rf-coupon-center">
    <view class="coupon-conversion">
      <input v-model="state.couponCode" class="flex-1 pl-base pr-base" type="text" placeholder="请输入兑换码">
      <text
        class="font-weight ml-base font-base-2 mr-base"
        :class="'text-' + themeColor.name"
        @tap="handleCouponConversion()"
      >
        兑换
      </text>
    </view>
    <view>
      <!-- 优惠券列表 -->
      <view v-for="(item, index) in state.couponList" :key="index">
        <rf-coupon :coupon-info="item" @tap="getCoupon(item)" />
      </view>
      <rf-load-more v-if="state.couponList.length > 0" :status="state.loadingType" />
    </view>
    <rf-empty v-if="state.couponList.length === 0 && !state.loading" :info="state.errorInfo || '暂无优惠券'" />
  </view>
</template>
<script setup lang="ts">
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { reactive } from 'vue';
import mHelper from '@/utils/helper';
import marketingApi from '@/api/tinyShop/marketing';
import mRouter from '@/utils/routerUtil';
import { CouponItem } from '@/response/coupon';
const themeColor = mHelper.getThemeColor(); // 主题颜色

let state = reactive({
  source: '',
  merchantId: '',
  couponCode: '',
  btnLoading: false,
  loading: true,
  page: 1,
  loadingType: 'more',
  type: '',
  errorInfo: '',
  couponList: [] as CouponItem[]
});

onLoad((options: any) => {
  state.type = options.type || '';
  state.source = options.source || '';
  state.merchantId = options.merchant_id || '';
  initData();
});
// 下拉刷新
onPullDownRefresh(() => {
  state.page = 1;
  state.couponList.length = 0;
  getCouponList('refresh');
});
// 加载更多
onReachBottom(() => {
  if (state.loadingType === 'noMore') return;
  state.page++;
  getCouponList();
});

// 数据初始化
const initData = () => {
  state.page = 1;
  state.couponList = [];
  getCouponList();
};
// 输入兑换码获取优惠券
const handleCouponConversion = async () => {
  if (!state.couponCode) return;
  state.btnLoading = true;
  try {
    await marketingApi.handleCouponConversion({ code: state.couponCode });
    state.btnLoading = false;
    mHelper.toast('领取成功');
    initData();
  } catch (e) {
    //
    state.btnLoading = false;
  }
};
// 获取收货地址列表
const getCouponList = async (type = '') => {
  state.loading = true;
  try {
    const data = (await marketingApi.getCouponList({
      page: state.page,
      merchant_id: state.merchantId
    })) as unknown as CouponItem[];
    state.loading = false;
    if (type === 'refresh') {
      uni.stopPullDownRefresh();
    }
    state.loadingType = data.length < 10 ? 'noMore' : 'more';
    state.couponList = [...state.couponList, ...data];
  } catch (e) {
    //
    state.couponList.length = 0;
    state.errorInfo = JSON.stringify(e);
    state.loading = false;
    if (type === 'refresh') {
      uni.stopPullDownRefresh();
    }
  }
};
// 获取优惠券
const getCoupon = async (item) => {
  if (state.source === 'service') {
    mHelper.prePage().couponId = item.id;
    mRouter.back();
  } else {
    if (state.type) return;
    // 优惠券是否可领取 is_get 0 不可领取
    if (item.is_get === 0) {
      mHelper.toast('该优惠券不可领取');
      return;
    }
    await marketingApi.handleCouponReceive({ id: item.id }).then(() => {
      mHelper.toast('领取成功');
    }).catch(() => {
      mHelper.toast('领取失败');
    })
  }
};
</script>
<style lang="scss">
.rf-coupon-center {
  background-color: $page-color-base;
  position: absolute;
  width: 100%;
  height: 100%;
  padding-top: $spacing-base;
  .coupon-conversion {
    width: 92%;
    margin: 20rpx auto 0;
    display: flex;
    align-items: center;
    border-radius: 12rpx;
    background-color: $color-white;
    padding: 20rpx;
  }
}
</style>
