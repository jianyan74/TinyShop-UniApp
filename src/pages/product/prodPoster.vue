<template>
  <view class="prod-poster">
    <!--海报分享-->
    <rf-poster :poster="state.posterImg" :show="state.posterShow" @hidePoster="hidePoster" />
    <canvas class="hide-canvas" />
    <canvas
      :style="{
        height: state.bgObj.height + 'px',
        width: state.bgObj.width + 'px'
      }"
      canvas-id="product_poster"
      class="hide-canvas"
    />
  </view>
</template>
<script lang="ts" setup>
import {computed, reactive} from "vue";
import thirdPartyApi from "@/api/tinyShop/thirdParty";
import mHelper from "@/utils/helper";
import mPosterUtil from "@/utils/posterUtil";
import {onLoad} from "@dcloudio/uni-app";
import {MarketingTypeEnum} from "@/enum/marketingEnum";
import mConstData from "@/config/constData";
import QSCanvas from "qs-canvas";
import {Product} from "@/response/product";
import {Profile} from "@/response/profile";
import store from "@/store";
import mRouter from "@/utils/routerUtil";

const state = reactive({
  bgObj: {
    height: 500,
    width: 400
  },
  posterImg: '',
  posterShow: false,

  marketingType: '',
  marketingId: '',
  marketingProductId: '',
  url: '',
  currentProductPrice: '',
  productDetail: {} as Product,

  userInfo: {} as Profile,
  thirdPartyWechatMiniQrCodeImg: '', //小程序码图片链接
})

const globalConfig = mHelper.getGlobalConfig(); // 通用配置
const moneySymbol = mConstData.moneySymbol;
const themeColor = mHelper.getThemeColor(); // 主题颜色
const typeName = computed(() => {
  let typeName;
  switch (state.productDetail.marketing_type) {
    case "discount":
      typeName = "秒杀商品";
      break;
    case "bargain":
      typeName = "砍价商品";
      break;
    case "group_buy":
      typeName = "团购商品";
      break;
    case "wholesale":
      typeName = "拼团商品";
      break;
  }
  if (state.marketingType === MarketingTypeEnum.BUY_NOW) typeName = "普通商品";
  return typeName;
});

onLoad(() => {
  state.userInfo = store.getters['user/getUserInfo'];
  const prodPosterParams = uni.getStorageSync('prodPosterParams');
  state.marketingType = prodPosterParams.marketingType;
  state.marketingId = prodPosterParams.marketingId;
  state.marketingProductId = prodPosterParams.marketingProductId;
  state.url = prodPosterParams.url;
  state.currentProductPrice = prodPosterParams.currentProductPrice;
  state.productDetail = prodPosterParams.productDetail;

  canvasImg();
})

// 海报弹窗开关
const canvasImg = async () => {
  await uni.showLoading({
    title: '海报绘制中...'
  })
  let qsc = new QSCanvas(
      {
        canvasId: "product_poster",
        setCanvasWH: (bg) => {
          state.bgObj = bg;
        },
      },
  );
  try {
    //二维码类型为小程序码
    if (state.productDetail.id && globalConfig.product_poster_qr_type === "mini_program_qr") {
      try {
        const data = (await thirdPartyApi.getThirdPartyQrCode({
          id: state.productDetail.id,
          marketing_type: state.marketingType,
          marketing_id: state.marketingId,
          marketing_product_id: state.marketingProductId,
        })) as any;
        state.thirdPartyWechatMiniQrCodeImg = data.url;
      } catch (e) {
        //
      }
    }
    let params = {
      avatar: Object.keys(state.userInfo).length > 0 ? state.userInfo?.member?.head_portrait : globalConfig.app_logo,
      nickname: Object.keys(state.userInfo).length > 0 ? state.userInfo?.member?.nickname : globalConfig.app_name,
      typeName: typeName.value,
      productPosterTitle: globalConfig.product_poster_title || "好物分享",
      productPosterCoverType: globalConfig.product_poster_cover_type,
      cover: state.productDetail?.covers[0],
      price: `${moneySymbol}${state.currentProductPrice}`,
      productTitle: mHelper.trim(state.productDetail.name),
      themeColor: themeColor.color,
      thirdPartyWechatMiniQrCodeImg: state.thirdPartyWechatMiniQrCodeImg,
      currentUrl: state.url
    };
    console.log('params', params)
    state.posterImg = await mPosterUtil.productPoster(qsc, params)
    uni.hideLoading()
    state.posterShow = true;
  } catch (e) {
    uni.hideLoading()
    console.log("绘制异常", e);
    await uni.showModal({
      content: JSON.stringify(e)
    });
  }
};

const hidePoster = () => {
  mRouter.back();
  state.posterShow = false;
};

</script>
<style lang="scss" scoped>
.prod-poster {

}
</style>
