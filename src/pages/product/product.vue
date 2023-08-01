<template>
  <view class="rf-product">
    <rf-navbar :border="false" :fixed="true" :status-bar="true" background-color="rgba(255,255,255,0)" color="#ffffff" />
    <rf-product-detail
      :marketing-id="state.marketingId"
      :marketing-product-id="state.marketingProductId"
      :marketing-type="state.marketingType"
      :product="state.productDetail"
      :url="state.currentUrl"
      :user-info="state.userInfo"
      :wholesale="state.wholesaleInfo"
      @product="getProductDetail"
    />
    <!-- 404页面 -->
    <rf-no-data
      v-if="!state.productDetail.name && !state.loading"
      :error-text="state.errorInfo"
      @refresh="getProductDetail"
    />
    <!--回到顶部-->
    <rf-back-top :scroll-top="state.scrollTop" />
    <canvas class="hide-canvas" />
    <canvas
      :style="{
        height: state.bgObj.height + 'px',
        width: state.bgObj.width + 'px'
      }"
      canvas-id="productPoster1"
      class="hide-canvas"
    />
    <!--页面加载动画-->
    <rf-loading :active="state.loading" />
  </view>
</template>
<script lang="ts" setup>
import {reactive} from "vue";
import {onLoad, onNavigationBarButtonTap, onPageScroll, onShareAppMessage, onShareTimeline} from '@dcloudio/uni-app';
import mHelper from '@/utils/helper';
import mSiteConfig from '@/config/site';
import productApi from '@/api/tinyShop/product';
import {Profile} from '@/response/profile';
import {Product} from '@/response/product';
import store from '@/store';
import commonApi from '@/api/tinyShop/common';

import {PlatformGroupEnum} from '@/enum/loginEnum';
import {MarketingTypeEnum} from '@/enum/marketingEnum';
import marketingApi from "@/api/tinyShop/marketing";

let qsc;

const globalConfig = mHelper.getGlobalConfig();

let state = reactive({
  sharePath: '',
  bgObj: {
    height: 500,
    width: 400
  },
  canvasShow: false,
  productId: '',
  marketingId: '',
  marketingType: '',
  marketingProductId: '',
  productDetail: {} as Product,
  wholesaleInfo: [],
  sharePoster: '',
  loading: true,
  errorInfo: '',
  poster: {},
  userInfo: {} as Profile,
  scrollTop: 0,
  currentUrl: '',
  navDetailShow: false,
});


onNavigationBarButtonTap((e) => {
  const index = e.index;
  if (index === 0) {
    if (mHelper.platformGroupFilter('app') === PlatformGroupEnum.TINYSHOPAPP) {
      !state.productDetail.video_url
          ? mHelper.toast('当轮播图有视频时不支持打开快捷导航')
          : (state.navDetailShow = true);
    } else {
      state.navDetailShow = true;
    }
  }
});
//右上角分享
onShareTimeline(() => {
  commonApi.handleTransmitCreate({topic_type: 'product', topic_id: state.productId});
  return {
    title: state.productDetail.name,
    path: state.sharePath
  };
});
//按钮自定义分享
onShareAppMessage(() => {
  return {
    title: state.productDetail.name,
    path: state.sharePath
  };
});
onPageScroll((e) => {
  state.scrollTop = e.scrollTop;
});
onLoad(async (options: any) => {
  state.marketingType = options.marketingType || MarketingTypeEnum.BUY_NOW;
  state.marketingProductId = options.marketingProductId || '';
  state.productId = options.id || '';
  state.marketingId = options.marketingId || '';
  state.userInfo = store.getters['user/getUserInfo'];
  //如果是分享的页面 参数会带上分享人的邀请码
  if (options.promoter_code) {
    uni.setStorageSync('promoterCode', options.promoter_code);
  }
  await initData();
});

// 数据初始化
const initData = async () => {
  //如果登录了分享链接附带邀请码
  if (state.userInfo) {
    state.sharePath = `/pages/product/product?id=${state.productId}&marketingId=${state.marketingId}&marketingType=${state.marketingType}&marketingProductId=${state.marketingProductId}&promoter_code=${state.userInfo?.member?.promoter_code}`;
  } else {
    state.sharePath = `/pages/product/product?id=${state.productId}&marketingId=${state.marketingId}&marketingType=${state.marketingType}&marketingProductId=${state.marketingProductId}`;
  }
  state.currentUrl = `${mSiteConfig.hostURL}${state.sharePath}`
  await getProductDetail();
};
// 获取产品详情
const getProductDetail = async () => {
  try {
    const data = (await productApi.getProductDetail({
      id: state.productId,
      marketing_id: state.marketingId,
      marketing_type: state.marketingId ? state.marketingType : '',
      marketing_product_id: state.marketingId ? state.marketingProductId : ''
    })) as unknown as Product;
    state.loading = false;
    state.productDetail = data;
    uni.setNavigationBarTitle({title: data.name});
    await mHelper.handleWxH5Share(globalConfig.app_name, data.name, state.currentUrl, data.picture);
    // 拼团
    if (state.marketingType === MarketingTypeEnum.WHOLESALE) {
      await getWholesaleGroupState(state.productId);
    }
  } catch (e) {
    state.loading = false;
    state.errorInfo = String(e);
  }
};
// 获取拼团列表
const getWholesaleGroupState = async (id) => {
  try {
    state.wholesaleInfo = await marketingApi.getWholesaleGroupState({
      product_id: id,
      state: "1,2,3",
    }) as unknown as [];
  } catch (e) {
    //
  }
};
</script>
<style lang="scss" scoped>
.rf-product {
  background: $page-color-dark;
  min-height: 100vh;
}
</style>
