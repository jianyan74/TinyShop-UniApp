<template>
  <view class="rf-base-product-item" @tap="navToProduct(props.productDetail.product_id, props.productDetail.marketing_Type, props.productDetail.marketing_id)">
      <rf-image
          width="180"
          height="180"
          border-radius="12"
          :src="props.productDetail.product_picture"
      ></rf-image>
      <view class="flex-1 ml-base">
        <view class="rf-base-product-item__title in2line font-lg">{{
            props.productDetail.product_name
          }}</view>
        <view class="rf-base-product-item__sku font-weight-light font-sm">
          {{ props.productDetail.sku_name }}
        </view>
        <view
            class="rf-base-product-item__price"
            :class="'text-' + themeColor.name"
        >
          <text class="font-sm">{{ moneySymbol }}</text
          >{{ props.productDetail.product_money }} *
          {{ props.productDetail.num }}
        </view>
      </view>
  </view>
</template>

<script setup lang="ts">

import mHelper from "@/utils/helper";
import mConstData from "@/config/constData";

const themeColor = mHelper.getThemeColor();
const moneySymbol = mConstData.moneySymbol;
const props = defineProps({
  productDetail: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

// 跳转对应商品页
const navToProduct = (id, marketingType = "", marketingId = "") => {
  mHelper.navToProduct(id, marketingType, marketingId);
};
</script>
<style lang="scss" scoped>
  .rf-base-product-item {
    box-shadow: 0rpx 5rpx 20rpx rgba(0, 0, 0, 0.1);
    padding: $spacing-sm;
    display: flex;
    &__title {
      height: 84rpx;
    }
    &__sku {
      height: 44rpx;
    }
  }
</style>
