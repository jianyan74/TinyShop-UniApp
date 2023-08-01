<template>
  <view class="rf-floor-index">
    <!--广告图-->
    <view
      v-if="bannerShow"
      class="banner"
      @tap="toBanner(banner)"
    >
      <image v-if="banner.cover" :src="banner.cover" mode="aspectFill" />
    </view>
    <!--列表-->
    <view class="f-header" @tap="toList">
      <text :class="[icon, 'text-'+themeColor.name]" class="iconfont" />
      <view class="tit-box">
        <text class="tit">{{ header.title }}</text>
        <text class="tit2">{{ header.desc }}</text>
      </view>
      <text v-if="isLink" class="iconfont iconyou" />
    </view>
    <view class="pl-base pr-base">
      <rf-home-product-list
        :content-value="contentValue"
        :info="{ productBgColor: '#fff', cartBtnShow: 'icon', cartIcon: 'iconyijiagou', cartIconSize: 26 }"
        :bottom="bottom"
        :radius="5"
        :list="list.length > 0 ? list : [0, 0]"
        show-type="twoLine"
        type="product"
      />
    </view>
  </view>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import mHelper from "@/utils/helper";
import {PlatformGroupEnum} from "@/enum/loginEnum";

const themeColor = mHelper.getThemeColor(); // 主题颜色
const contentValue = ['title', "sub", 'marketPrice', 'sales'];

defineProps({
  // 列表
  list: {
    type: Array,
    default() {
      return [];
    }
  },
  // 广告图
  banner: {
    type: Object,
    default() {
      return {};
    }
  },
  // 标题 例: 新品上市
  header: {
    type: Object,
    default() {
      return {};
    }
  },
  // 是否显示banner图
  bannerShow: {
    type: Boolean,
    default: true
  },
  // 是否可点击
  isLink: {
    type: Boolean,
    default: true
  },
  // icon
  icon: {
    type: String,
    default: ""
  }
});
const emit = defineEmits(["list", "banner"]);
const bottom = computed(() => {
  let sysInfo: AnyObject = uni.getSystemInfoSync();
  return (sysInfo?.safeAreaInsets?.bottom / 2 || 0) + 90;
});
// banner 跳转页
const toBanner = (item: any) => {
  emit("banner", item);
};
// 列表 跳转页
const toList = () => {
  emit("list");
};
</script>
<style lang="scss" scoped>
.rf-floor-index {
  .banner {
    width: 92%;
    margin: 20rpx 4% 0;

    image {
      width: 100%;
      height: 25vw;
      border-radius: 20rpx;
      box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.05);
    }
  }

  .f-header {
    display: flex;
    align-items: center;
    height: 120rpx;
    padding: 6rpx 20rpx;
    margin: 0 0 20rpx;
    background: #fff;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);

    .iconfont {
      font-size: $font-lg + 24rpx;
      margin-right: 20rpx;
    }

    .tit-box {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .tit {
      font-size: $font-lg + 2rpx;
      color: #font-color-dark;
      line-height: 1.3;
    }

    .tit2 {
      font-size: $font-sm;
      color: $font-color-light;
    }

    .iconyou {
      font-size: $font-lg + 4rpx;
      color: $font-color-light;
    }
  }
}
</style>
