<template>
  <view v-if="show" class="rf-popup-ad" @touchmove.stop.prevent="() => {}" @tap="show = false">
    <view v-if="adCoupons && adCoupons.total > 0" :class="'bg-' + themeColor.name" class="upgrade-wrapper-coupon">
      <view class="title">
        恭喜您获得{{ adCoupons.total }}个优惠券
      </view>
      <view class="tip-1">
        可至"我的优惠券"查看
      </view>
      <scroll-view class="rf-coupon" scroll-x>
        <block v-for="(item, index) in adCoupons.list" :key="index">
          <view class="rf-coupon-item-tb">
            <view class="top">
              <view>
                <view class="money" :class="'text-' + themeColor.name">
                  <text v-if="item.discount_type === '1'">
                    <text class="symbol">{{ moneySymbol }} </text>
                    <text class="font-weight-700 font-lg-4">{{ String(item.discount).split('.')[0] }}</text>
                    <text v-if="String(item.discount).split('.')[1]" class="font-weight-700 mr-4">
                      {{ '.' + String(item.discount).split('.')[1] }}
                    </text>
                  </text>
                  <text v-else>
                    <text class="font-weight-700 font-lg-4">{{ String(item.discount).split('.')[0] }}</text>
                    <text v-if="String(item.discount).split('.')[1]" class="font-weight-700 mr-4">
                      {{ '.' + String(item.discount).split('.')[1] }}
                    </text>
                    <text class="font-base font-weight-700"> 折</text>
                  </text>
                </view>
                <view class="tip" :class="'text-' + themeColor.name">
                  满{{ item.at_least }}可用
                </view>
              </view>
            </view>
            <view :class="'bg-' + themeColor.name" class="btn" @tap.stop="navTo('/pages/product/list')">
              去使用
            </view>
          </view>
        </block>
      </scroll-view>
      <view class="tip-1" @tap.stop="navTo('/pages/user/coupon/coupon?type=1')">
        查看我的优惠券
        <text class="iconfont iconyou" />
      </view>
    </view>
    <block v-else>
      <view v-if="adInfo && adInfo.cover" class="upgrade-wrapper" @tap.stop="indexTopToDetailPage(adInfo)">
        <image mode="aspectFill" class="image" :src="adInfo.cover" />
        <view class="close-upgrade" @tap.stop="() => {}">
          <view class="line">
            <view class="close-upgrade-line" />
          </view>
          <text class="iconfont iconguanbi1" @tap.stop="close" />
        </view>
      </view>
    </block>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import mRouter from '@/utils/routerUtil';
import { Route } from '@/response/route';
import mHelper from '@/utils/helper';
import mConstData from "@/config/constData";

const themeColor = mHelper.getThemeColor(); // 主题颜色
const moneySymbol = mConstData.moneySymbol;
const show = ref(true);
defineProps({
  adInfo: {
    type: Object,
    default: () => {
      return {};
    }
  },
  adCoupons: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

/* 关闭广告 */
const close = () => {
  show.value = false;
};
const navTo = (path, query = {}) => {
  const route: Route = {name:'', path: path}
  mRouter.push({ route, query });
};
// 跳至广告图指定页面
const indexTopToDetailPage = (item) => {
  mHelper.handleBasicNavTo(item.extend_link);
};
</script>
<style lang="scss" scoped>
.rf-popup-ad {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999999;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.upgrade-wrapper {
  margin-top: -100px;
  width: 72vw;
  height: 90vw;
  line-height: 1;
  .image {
    border-radius: 10rpx;
    width: 72vw;
    height: 90vw;
  }
}
.upgrade-wrapper-coupon {
  width: 84vw;
  line-height: 1;
  border: 120rpx;
  padding: 40rpx 0 20rpx;
  border-radius: 12rpx;
  color: $color-white;
  text-align: center;
  .title {
    color: $color-white;
    font-weight: 500;
    font-size: $font-lg;
    letter-spacing: 3rpx;
  }
  .tip-1 {
    padding: 28rpx 0;
  }
}
.close-upgrade {
  width: 100%;
  text-align: center;
  color: $color-white;
  line-height: 1;
  .line {
    display: flex;
    justify-content: center;
    text-align: center;
    .close-upgrade-line {
      height: 120rpx;
    }
  }
  .iconfont {
    font-size: $font-lg + 24rpx;
    font-weight: 500;
    color: $color-white;
    display: inline-block;
  }
}
.rf-coupon {
  white-space: nowrap;
  width: calc(100% - 60rpx);
  margin: 0 30rpx;
  .rf-coupon-item-tb {
    display: inline-block;
    width: 208rpx;
    background: linear-gradient(#ebbdaa 0%, #f1e0cb 100%);
    border-radius: 8rpx;
    margin-right: $spacing-base;
    padding: $spacing-sm $spacing-sm * 1.2 $spacing-sm * 1.5;
    .top {
      width: 183rpx;
      height: 148rpx;
      background: linear-gradient(#fff2ec 0%, #fff4e6 100%);
      box-shadow: 0rpx 2rpx 9rpx 0rpx rgba(4, 0, 0, 0.05);
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      border-radius: 6rpx;
      .money {
        width: 100%;
        font-size: 50rpx;
        font-weight: 600;
        line-height: 1.4;
        .symbol {
          font-size: 24rpx;
        }
      }
      .tip {
        text-align: center;
        font-size: $font-sm;
      }
    }
    .btn {
      width: 182rpx;
      height: 60rpx;
      border-radius: 30rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: $spacing-sm * 1.5;
    }
  }
  .rf-coupon-item-lr {
    display: inline-block;
    border-radius: 8rpx;
    .wrapper {
      border-radius: 8rpx;
      display: flex;
      width: 300rpx;
      margin-right: $spacing-sm;
      .left {
        flex: 1;
        height: 120rpx;
        margin: $spacing-sm;
        background: linear-gradient(#fff2ec 0%, #fff4e6 100%);
        box-shadow: 0rpx 2rpx 9rpx 0rpx rgba(4, 0, 0, 0.05);
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        border-radius: 6rpx;
        .money {
          width: 100%;
          font-size: 50rpx;
          font-weight: 600;
          line-height: 1.4;
          .symbol {
            font-size: 24rpx;
          }
        }
      }
      .btn-wrapper {
        display: flex;
        justify-content: center;
        padding-right: $spacing-sm;
        align-items: center;
        .btn {
          width: 60rpx;
          white-space: normal;
          word-break: break-all;
          word-wrap: break-word;
          line-height: 1.3;
        }
      }
    }
  }
}
</style>
