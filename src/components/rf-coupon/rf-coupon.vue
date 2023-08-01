<template>
  <view
    :style="{
      opacity: type === 'myCoupon' && (couponType === '2' || couponType === '3') ? '0.5' : '1'
    }"
    class="rf-coupon-item"
    @tap="onClick"
  >
    <view
      :class="couponInfo.is_get === 0 ? 'rf-opacity' : ''"
      :style="{ borderColor: `rgba(${themeColor.rgb}, 0.28)` }"
      class="rf-coupon-item__wrap"
    >
      <!--      <view-->
      <!--        class="rf-coupon-item__merchant"-->
      <!--        v-if="couponInfo?.baseMerchant"-->
      <!--        :class="'bg-gradual-' + themeColor.name"-->
      <!--        @tap.stop="-->
      <!--          navTo(mRouteConfig.merchant, { id: couponInfo?.baseMerchant.id })-->
      <!--        "-->
      <!--      >-->
      <!--        {{ couponInfo?.baseMerchant?.title }}-->
      <!--      </view>-->
      <view :class="'bg-opacity-' + themeColor.name" class="rf-coupon-item__price">
        <view class="rf-coupon-item__price__wrap">
          <view v-if="couponInfo.discount_type === '1'" :class="'text-' + themeColor.name">
            <text class="font-base font-weight-700">{{ moneySymbol }}</text>
            <text class="font-weight-700 price">{{ String(couponInfo.discount).split('.')[0] }}</text>
            <text v-if="String(couponInfo.discount).split('.')[1]" class="font-weight-700 font-lg-4 mr-4">
              {{ '.' + String(couponInfo.discount).split('.')[1] }}
            </text>
          </view>
          <view v-else-if="couponInfo.discount_type === '2'" :class="'text-' + themeColor.name">
            <text class="font-weight-700 price">{{ String(couponInfo.discount).split('.')[0] }}</text>
            <text v-if="String(couponInfo.discount).split('.')[1]" class="font-weight-700 font-lg-4 mr-4">
              {{ '.' + String(couponInfo.discount).split('.')[1] }}
            </text>
            <text class="font-base font-weight-700"> 折</text>
          </view>
          <view :class="'text-' + themeColor.name" class="font-sm pt-sm font-weight-500">
            {{ couponInfo.at_least > 0 ? `满${couponInfo.at_least}元可用` : '无门槛优惠券' }}
          </view>
        </view>
      </view>
      <view class="rf-coupon-item__info">
        <view class="rf-coupon-item__info__wrap">
          <view>
            <view class="font-lg-2 font-weight-500 mb-sm in1line">{{ couponInfo.title }}</view>
            <view class="font-color-base font-sm">
              {{ couponInfo.baseMerchant?.id ? `限商家[${couponInfo.baseMerchant?.title}]使用` : '不限制商家使用' }}
            </view>
            <view class="font-color-light in1line">
              <text v-if="couponInfo.term_of_validity_type === '1'" class="font-sm">
                领取之日起{{ couponInfo.fixed_term }}天内有效
              </text>
              <text v-else-if="couponInfo.start_time === couponInfo.end_time" class="font-sm">
                限{{ time(couponInfo.start_time) }}当日使用
              </text>
              <text v-else class="font-sm">
                {{ timeDayFormat(couponInfo.start_time) }}至{{ timeDayFormat(couponInfo.end_time) }}可用
              </text>
            </view>
          </view>
          <view v-if="type === 'myCoupon'" class="flex-shrink" @tap="navTo(mRouteConfig.productList)">
            <view v-if="couponType === '1'" :class="'bg-gradual-' + themeColor.name" class="to-use mr-base font-sm">
              去使用
            </view>
            <rf-image v-if="couponType === '2'" :src="usedCoupon" class="mr-base" height="98" width="98" />
            <rf-image v-if="couponType === '3'" :src="invalidCoupon" class="mr-base" height="98" width="98" />
          </view>
        </view>
        <view class="rf-coupon-item__info__more pt-sm pr-base mt-sm" @tap.stop="showMore">
          <view class="more font-sm font-color-light">详细信息</view>
          <rf-icon :name="moreIcon" class="font-color-dark font-weight-700 scale-8" size="24" />
        </view>
      </view>
    </view>
    <view v-if="isMoreShow" class="rf-coupon-item__more">
      <view v-if="type === 'myCoupon'" class="font-sm font-color-base mb-sm">
        于{{ time(couponInfo.fetch_time) }}获取
      </view>
      <view v-else-if="couponInfo.get_end_time" class="font-sm font-color-base mb-sm">
        {{ time(couponInfo.get_end_time) }}截止领取
      </view>
      <view class="font-color-light font-sm flex-align-items">
        {{ couponTypeFilter(couponInfo.range_type) }}
        <text
          v-if="
            couponInfo.range_type === CouponStatusEnum.ASSIGN_PRODUCT || couponInfo.range_type === CouponStatusEnum.ALL
          "
          :class="'text-' + themeColor.name"
          class="font-sm ml-sm"
          @tap.stop="navTo(mRouteConfig.productList, { param: JSON.stringify({ coupon_type_id: couponInfo.id }) })"
        >
          查看
        </text>
      </view>
      <view v-if="type !== 'myCoupon' && couponInfo.max_fetch > 0" class="font-color-light font-sm">
        {{ Number(couponInfo.max_fetch) === 0 ? '' : `每人限领${couponInfo.max_fetch}` }}
        <text v-if="couponInfo.percentage" class="font-sm">剩余{{ couponInfo.percentage }}%</text>
      </view>
    </view>
    <view :style="{ borderColor: `rgba(${themeColor.rgb}, 0.28)` }" class="rf-coupon-item__left-tag" />
    <view :style="{ borderColor: `rgba(${themeColor.rgb}, 0.28)` }" class="rf-coupon-item__right-tag" />
  </view>
</template>
<script lang="ts" setup>
import mHelper from '@/utils/helper';
import {formatToDateTime} from '@/utils/dateUtil';
import {Route} from '@/response/route';
import mRouter from '@/utils/routerUtil';
import mRouteConfig from '@/config/routes';
import mConstData from '@/config/constData';
import {ref} from 'vue';
import mAssetsPath from '@/config/assets';
import {CouponStatusEnum} from '@/enum/couponEnum'; // 路由管理
const themeColor = mHelper.getThemeColor();

const moneySymbol = mConstData.moneySymbol;
const invalidCoupon = mAssetsPath.invalidCoupon;
const usedCoupon = mAssetsPath.usedCoupon;

defineProps({
  couponInfo: {
    type: Object,
    default: () => {
      return {};
    }
  },
  type: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    default: ''
  },
  couponType: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['tap']);

const isMoreShow = ref(false);
const moreIcon = ref('iconxia');

const showMore = () => {
  isMoreShow.value = !isMoreShow.value;
  moreIcon.value = moreIcon.value === 'iconxia' ? 'iconshang' : 'iconxia';
};
const couponTypeFilter = (status) => {
  let text;
  switch (status) {
    case CouponStatusEnum.ALL:
      text = '全部商品可使用';
      break;
    case CouponStatusEnum.ASSIGN_PRODUCT:
      text = '部分商品可使用';
      break;
    case CouponStatusEnum.NOT_ASSIGN_PRODUCT:
      text = '部分商品不能使用';
      break;
    case CouponStatusEnum.ASSIGN_CATE:
      text = '部分分类可使用';
      break;
    case CouponStatusEnum.NOT_ASSIGN_CATE:
      text = '部分分类不能使用';
      break;
    default:
      text = '全部商品可使用';
      break;
  }
  return text;
};
// 时间格式化
const time = (val: string) => {
  return formatToDateTime(parseInt(val) * 1000, 'YYYY/MM/DD HH:mm');
};
// 时间格式化
const timeDayFormat = (val: string) => {
  let toYear = new Date().getFullYear();
  let fmt = String(toYear) === formatToDateTime(parseInt(val) * 1000, 'YYYY') ? 'MM/DD' : 'YYYY/MM/DD';
  return formatToDateTime(parseInt(val) * 1000, fmt);
};
// 点击事件
const onClick = () => {
  emit('tap');
};
// 通用跳转
const navTo = (route: Route, query = {}) => {
  mRouter.push({route, query});
};
</script>
<style lang="scss" scoped>
.rf-coupon-item {
  width: 92%;
  margin: 20rpx auto 10rpx;
  align-items: center;
  z-index: 4;
  position: relative;
  border-radius: 12rpx;

  &__wrap {
    position: relative;
    border-radius: 12rpx;
    background-color: $color-white;
    z-index: 3;
    display: flex;
    justify-content: space-between;
    border: 1rpx solid;
  }

  &__merchant {
    border-bottom-left-radius: 6rpx;
    border-top-right-radius: 6rpx;
    position: absolute;
    top: 0;
    right: 0;
    padding: 2rpx $spacing-lg;
    font-size: $font-sm;
  }

  &__price {
    width: 208rpx;
    height: 216rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 12rpx;
    border-bottom-left-radius: 12rpx;

    &__wrap {
      text-align: center;

      .price {
        font-size: 52rpx;
      }

      .mr-4 {
        margin-right: 4rpx;
      }
    }
  }

  &__info {
    flex: 1;
    padding: $spacing-sm 0;

    &__wrap {
      padding-left: $spacing-base;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .to-use {
        padding: 10rpx 24rpx;
        border-radius: 32rpx;
      }
    }

    &__more {
      padding-left: $spacing-base;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 2rpx dashed rgba(0, 0, 0, 0.06);
    }
  }

  &__more {
    padding: $spacing-base;
    border-radius: 12rpx;
    background-color: $color-white;
  }

  &__left-tag {
    border-radius: 0 18rpx 18rpx 0;
    width: 16rpx;
    height: 36rpx;
    background-color: $page-color-base;
    position: absolute;
    top: 88rpx;
    left: 0;
    z-index: 5;
    border-right: 1rpx solid;
    border-top: 1rpx solid;
    border-bottom: 1rpx solid;
  }

  &__right-tag {
    border-radius: 18rpx 0 0 18rpx;
    width: 16rpx;
    height: 36rpx;
    background-color: $page-color-base;
    position: absolute;
    top: 88rpx;
    border-left: 1rpx solid;
    border-top: 1rpx solid;
    border-bottom: 1rpx solid;
    color: $page-color-base;
    right: 0;
    z-index: 5;
  }
}
</style>
