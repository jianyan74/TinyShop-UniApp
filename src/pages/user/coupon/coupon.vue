<template>
  <view class="rf-my-coupon">
    <!--顶部导航栏-->
    <view class="rf-header-tab">
      <view
        class="rf-header-tab__item" :class="state.couponType === '1' ? 'on text-' + themeColor.name : ''"
        @tap="switchType('1')"
      >
        可用
        <text>({{ state.groupCount.get }})</text>
      </view>
      <view
        class="rf-header-tab__item" :class="state.couponType === '2' ? 'on text-' + themeColor.name : ''"
        @tap="switchType('2')"
      >
        已使用
        <text>({{ state.groupCount.un_sed }})</text>
      </view>
      <view
        class="rf-header-tab__item"
        :class="state.couponType === '3' ? 'on text-' + themeColor.name : ''"
        @tap="switchType('3')"
      >
        已失效
        <text>({{ state.groupCount.past_due }})</text>
      </view>
      <view class="rf-header-tab__border" :class="['bg-' + themeColor.name, state.couponType === '2' ? 'used' : (state.couponType === '3' ? 'invalid' : '')]" />
    </view>
    <view class="coupon-conversion">
      <input
        v-model="state.couponCode"
        class="flex-1 pl-base pr-base"
        type="text"
        placeholder="请输入兑换码"
        placeholder-style="color:#999;"
      >
      <text
        class="font-weight ml-base font-base-2 mr-base"
        :class="'text-' + themeColor.name"
        @tap="handleCouponConversion()">兑换</text>
    </view>
    <!--优惠券列表-->
    <view class="coupon-list">
      <view
        v-if="state.couponType === '3' && state.couponList.length > 0 && !state.loading"
        class="text-right mb-sm mt-sm mr-lg"
        :class="'text-' + themeColor.name"
        @tap="emptyInvalidCoupon"
      >
        清空失效优惠券
      </view>
      <!-- 优惠券列表 -->
      <view v-for="(item, index) in state.couponList" :key="index">
        <rf-coupon type="myCoupon" :coupon-type="state.couponType" :coupon-info="item" />
      </view>
      <rf-empty
        v-if="state.couponList.length === 0 && !state.loading"
        info="暂无优惠券"
      />
      <rf-load-more
        v-if="state.couponList.length > 0"
        :status="state.loadingType"
      />
    </view>
    <rf-loading :active="state.loading" />
  </view>
</template>
<script setup lang="ts">
import {reactive,} from "vue";
import {onLoad, onPullDownRefresh, onReachBottom,} from "@dcloudio/uni-app";
import mHelper from "@/utils/helper";
import memberApi from "@/api/tinyShop/member";
import {CouponItem, GroupCount,} from "@/response/coupon";
import marketingApi from "@/api/tinyShop/marketing";
const themeColor = mHelper.getThemeColor(); // 主题颜色

let state = reactive({
  page: 1,
  loading: true,
  btnLoading: false,
  couponCode: "",
  loadingType: "more",
  couponType: "1",
  groupCount: {} as GroupCount,
  couponList: [] as CouponItem[],
});

onLoad(() => {
  // 数据初始化
  initData();
});

// 下拉刷新
onPullDownRefresh(() => {
  initData("refresh");
});
// 加载更多
onReachBottom(() => {
  if (state.loadingType === "noMore") return;
  state.page++;
  getMyCouponList();
});
// 切换顶部优惠券类型
const switchType = (flag:string) => {
  state.couponCode = "";
  state.couponType = flag;
  state.page = 1;
  state.couponList = [];
  state.loading = true;
  getMyCouponList();
};
// 清空失效优惠券
const emptyInvalidCoupon = async () => {
  try {
    await memberApi.handleCouponClear();
    mHelper.toast("清空成功");
    initData();
  } catch (e) {
    //
  }
};
// 初始化数据
const initData = (type = "") => {
  state.page = 1;
  state.loading = true;
  state.couponList = [];
  getMyCouponList(type);
};
// 获取我的优惠券列表
const getMyCouponList = async (type = "") => {
  try {
    const data:AnyObject = await memberApi.getMyCouponList({
      page: state.page,
      state: state.couponType,
    });
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
    state.groupCount = data.groupCount;
    state.loadingType = data.list.length < 10 ? "noMore" : "more";
    state.couponList = [...state.couponList, ...data.list,];
  } catch (e) {
    //
    state.loading = false;
    if (type) {
      uni.stopPullDownRefresh();
    }
  }
};
// 输入兑换码获取优惠券
const handleCouponConversion = async () => {
  if (!state.couponCode || state.btnLoading) return;
  state.btnLoading = true;
  try {
    await marketingApi.handleCouponConversion({code: state.couponCode,});
    state.btnLoading = false;
    mHelper.toast("领取成功");
    initData();
  } catch (e) {
    //
    state.btnLoading = false;
  }
};
</script>
<style lang="scss">
.rf-my-coupon {
  background-color: $page-color-base;
  position: absolute;
  width: 100%;
  height: 100%;
	.rf-header-tab {
		background-color: $color-white;
		width: 100%;
		height: 95rpx;
		padding: 0 3%;
		border-bottom: solid 1rpx #dedede;
		z-index: 10;
		display: flex;
		flex-wrap: wrap;
		&__item, &__border {
			display: flex;
			flex-wrap: wrap;
			width: 33.3%;
			height: 90rpx;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
		}
		&__border {
			height: 4rpx;
			&.used {
				transform: translate3d(100%, 0, 0);
			}
			&.invalid {
				transform: translate3d(200%, 0, 0);
			}
		}
	}
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
