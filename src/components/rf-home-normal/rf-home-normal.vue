<template>
  <view class="rf-home-normal">
    <rf-search-bar
      :category-list="categoryList"
      :placeholder="hotSearchDefault"
      class="header-search-bar"
      icon="iconsaomiao"
      title="扫一扫"
      @search="navTo(mRouteConfig.productSearch, { data: JSON.stringify(search) })"
      @tab="tabClick"
    />
    <view
      :style="{
        paddingTop: paddingTop + 'rpx'
      }"
    >
      <view v-if="currentCate === 0">
        <!-- 轮播图1 -->
        <view class="swiper-normal">
          <view class="swiper-box">
            <rf-swipe-dot :current="current" :info="carouselList.index_top" field="title" mode="nav">
              <swiper autoplay="true" @change="handleDotChange">
                <swiper-item
                  v-for="(item, index) in carouselList.index_top"
                  :key="index"
                  @tap="indexTopToDetailPage(item)"
                >
                  <view class="swiper-item">
                    <image :src="item.cover" mode="aspectFill" />
                  </view>
                </swiper-item>
              </swiper>
            </rf-swipe-dot>
          </view>
        </view>
        <!-- 分类列表 -->
        <view class="pl-base pr-base">
          <rf-normal-swiper-category
            :list="productCateList || []"
            class="spacing-row spacing-sm"
          />
        </view>
        <!--新闻通知-->
        <view class="pl-base pr-base">
          <rf-swiper-slide
            v-if="announceList.length > 0"
            :list="announceList"
            class="rf-skeleton"
            @navTo="navTo(mRouteConfig.notice)"
          >
            <template #header>
              <view class="swiper-slide-header">
                <text :class="'text-' + themeColor.name" class="iconfont icongonggao" />
              </view>
            </template>
          </rf-swiper-slide>
        </view>
        <!-- 爆款推荐 -->
        <view class="hot-recommend">
          <view class="left">
            <image
              :src="hotRecommendList[0].icon"
              class="hot-recommend-image"
              @tap="navTo(mRouteConfig.marketingProductList, { marketingType: MarketingTypeEnum.BARGAIN })"
            />
          </view>
          <view class="right">
            <image
              :src="hotRecommendList[1].icon"
              class="hot-recommend-image"
              @tap="navTo(mRouteConfig.marketingProductList, { marketingType: MarketingTypeEnum.GROUP_BUY })"
            />
            <image
              :src="hotRecommendList[2].icon"
              class="hot-recommend-image"
              @tap="navTo(mRouteConfig.marketingProductList, { marketingType: MarketingTypeEnum.DISCOUNT })"
            />
          </view>
        </view>
        <!--爆款拼团-->
        <view v-if="wholesaleProductList.length > 0" class="wrapper">
          <rf-list-cell
            :icon-color="themeColor.color"
            icon="icontaobaoketuiguang"
            title="爆款拼团"
            @eventClick="navTo(mRouteConfig.wholesaleList)"
          />
          <scroll-view :class="wholesaleProductList.length === 0 ? 'rf-box-shadow' : ''" class="h-list" scroll-x>
            <view
              v-for="item in wholesaleProductList"
              :key="item.product.id"
              class="h-item"
              @tap.stop="navTo(mRouteConfig.wholesaleProduct, { id: item.product?.id })"
            >
              <image :src="item.product.picture" class="h-item-img" mode="aspectFit" />
              <view class="title in2line">
                {{ item.product.name }}
              </view>
              <view class="last-line">
                <view :class="'text-' + themeColor.name" class="price in1line">
                  <text class="font-sm">{{ moneySymbol }}</text>
                  {{ item.product.wholesale_price }}
                  <text v-if="item.product.market_price > item.product.wholesale_price" class="m-price">
                    <text class="font-sm">{{ moneySymbol }}</text>
                    {{ item.product.market_price }}
                  </text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <!--预售-->
        <view v-if="presellList && presellList.length > 0" class="seckill">
          <view class="seckill-matter row-sb">
            <view :class="'text-' + themeColor.name" class="matter">
              预售
              <text>商品</text>
            </view>
            <view class="matter-info" @tap="navTo(mRouteConfig.presellList)">
              预付定金优惠多多 了解更多
              <text class="iconfont icon-xiangyou" />
            </view>
          </view>
          <view class="seckill-scroll">
            <view class="seckill-item">
              <scroll-view class="seckill-scroll-x" scroll-with-animation="true" scroll-x="true">
                <view
                  v-for="(item, index) in presellList"
                  :key="index"
                  class="seckill-list"
                  @tap.stop="navTo(mRouteConfig.product, { id: item.id })"
                >
                  <view class="seckill-img">
                    <image :src="item && item.picture" mode="" />
                    <view :class="'bg-' + themeColor.name" class="discount row">
                      {{ ((item && item.price / item && item.market_price * 10) || 1).toFixed(1) }}折
                    </view>
                  </view>
                  <view class="limit row">
                    仅剩{{ item.stock }}件
                  </view>
                  <view :class="'text-' + themeColor.name" class="price row">
                    <text class="font-sm">{{ moneySymbol }}</text>
                    {{ item.presell_price }}
                  </view>
                </view>
              </scroll-view>
            </view>
          </view>
        </view>
        <!--新品上市-->
        <rf-product-home-item
          :banner="carouselList.index_new && carouselList.index_new[0]"
          :header="{ title: '新品上市', desc: 'New Products Listed' }"
          :list="newProductList"
          icon="iconxinpin2"
          @banner="indexTopToDetailPage"
          @list="
            navTo(mRouteConfig.productList, {
              param: JSON.stringify({ is_new: 1 })
            })
          "
        />
        <!--推荐商品-->
        <rf-product-home-item
          :banner="carouselList.index_recommend && carouselList.index_recommend[0]"
          :header="{ title: '推荐商品', desc: 'Recommend Product' }"
          :list="recommendProductList"
          icon="icontuijian21"
          @banner="indexTopToDetailPage"
          @list="
            navTo(mRouteConfig.productList, {
              param: JSON.stringify({ is_recommend: 1 })
            })
          "
        />
        <!--热门商品-->
        <rf-product-home-item
          :banner="carouselList.index_hot && carouselList.index_hot[0]"
          :header="{ title: '热门商品', desc: 'Hot Product' }"
          :list="hotProductList"
          icon="iconremen2"
          @banner="indexTopToDetailPage"
          @list="
            navTo(mRouteConfig.productList, {
              param: JSON.stringify({ is_hot: 1 })
            })
          "
        />
        <!--猜您喜欢-->
        <rf-product-home-item
          v-if="guessYouLikeProductList.length > 0"
          :banner-show="false"
          :header="{ title: '猜您喜欢', desc: 'Guess You Like It' }"
          :is-link="false"
          :list="guessYouLikeProductList"
          icon="iconcainixihuan2"
        />
      </view>
      <view v-else class="index-cate-product-list">
        <view class="pl-base pr-base">
          <rf-home-product-list
            :bottom="bottom"
            :content-value="contentValue"
            :info="{ productBgColor: '#fff', cartBtnShow: 'icon', cartIcon: 'iconyijiagou', cartIconSize: 26 }"
            :list="categoryProductList"
            :radius="5"
            show-type="twoLine"
            type="product"
          />
        </view>
        <rf-load-more v-if="categoryProductList.length > 0" :status="loadingType" />
        <rf-empty
          v-if="categoryProductList.length === 0 && !productLoading"
          :bottom="bottom"
          :style="{ marginTop: '100rpx' }"
          info="暂无该分类产品~"
        />
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue';
import mHelper from '@/utils/helper';
import mSiteConfig from '@/config/site';
import mRouteConfig from '@/config/routes';
import mRouter from '@/utils/routerUtil';
import {Route} from '@/response/route';
import mConstData from '@/config/constData';
import indexApi from '@/api/tinyShop';
import productApi from '@/api/tinyShop/product';
import {PlatformGroupEnum} from '@/enum/loginEnum';
import {MarketingTypeEnum} from '@/enum/marketingEnum'; // 路由管理

const themeColor = mHelper.getThemeColor(); // 主题颜色
const configList = mHelper.getGlobalConfig(); // 通用配置
const newProductList = ref([] as any);
const recommendProductList = ref([] as any);
const guessYouLikeProductList = ref([] as any);
const hotProductList = ref([] as any);
const wholesaleProductList = ref([] as any);
const announceList = ref([] as any);
const popupAdv = ref([] as any);
const carouselList = ref([] as any);
const presellList = ref([] as any);
const productCateList = ref([] as any);
const categoryList = ref([] as any);
const hotSearchDefault = ref('');
const search = ref({} as any);
const config = ref({} as any);
const current = ref(0); // 轮播图index
const moneySymbol = mConstData.moneySymbol;
const hotRecommendList = mConstData.hotRecommendList;
const headerHeight = ref(0 as any);
const currentCate = ref(0);
const contentValue = ['title', "sub", 'marketPrice', 'sales'];
const emit = defineEmits(['loading', 'refreshEnd']);

const props = defineProps({
  refresh: {
    type: Boolean,
    default: false
  },
  paddingTop: {
    type: Number,
    default: 0
  },
});

const bottom = computed(() => {
  let bottom = 0;
	/*  #ifdef H5  */
  bottom = 90;
	/*  #endif */
  return bottom;
});

watch(
  () => props.refresh,
  (val: boolean) => {
    if (val) getIndexList();
  }
);

onMounted(() => {
  // H5平台下 用class="header-search-bar"时 无法获取到 节点class默认为子组件名 class="rf-search-bar"
  let classStr: string;
  // #ifndef H5
  classStr = '.header-search-bar';
  // #endif
  // #ifdef H5
  classStr = '.rf-search-bar';
  //#endif
  setTimeout(() => {
    getIndexList();
    const query = uni.createSelectorQuery().in(this);
    query
      .select(classStr)
      .boundingClientRect((data: any) => {
        console.log('boundClient', data)
        headerHeight.value = data.height;
      })
      .exec();
  }, 500);
});

// 获取主页数据
const getIndexList = async () => {
  try {
    const data = await indexApi.getIndexData();
    emit('loading');
    emit('refreshEnd');
    // 首页参数赋值
    initIndexData(data);
  } catch (e) {
    emit('loading');
  }
};
// 首页参数赋值
const initIndexData = (data) => {
  mHelper.handleWxH5Share(
    data?.share.share_title || configList.app_name,
    data?.share.share_desc || `欢迎来到${configList.app_name}商城`,
    data?.share.share_link || mSiteConfig.hostURL,
    data?.share.share_cover || configList.app_logo
  );
  productCateList.value = data.cate || [];
  if (configList.index_cate && productCateList.value.length > 0) {
    categoryList.value = [{id: 0, title: '首页'}, ...productCateList.value];
  }
  wholesaleProductList.value = data.product_wholesale || [];
  announceList.value = data.announce || [];
  presellList.value = data.product_presell || [];
  carouselList.value = data.adv || [];
  popupAdv.value = data.coupons.total > 0 ? data.coupons : data.popup_adv || [];
  search.value = data.search;
  uni.setStorageSync('search', search);
  hotSearchDefault.value = data.search.hot_search_default || '请输入关键字';
  uni.setStorage({
    key: 'hotSearchDefault',
    data: data.search.hot_search_default
  });
  hotProductList.value = data.product_hot || [];
  recommendProductList.value = data.product_recommend || [];
  guessYouLikeProductList.value = data.guess_you_like || [];
  newProductList.value = data.product_new || [];
  config.value = data.config || {};
};
// 监听轮播图切换
const handleDotChange = (e) => {
  current.value = e.detail.current;
};
// 跳至广告图指定页面
const indexTopToDetailPage = (item) => {
  mHelper.handleBasicNavTo(JSON.parse(item.extend_link || '{}'));
};

const navTo = (route: Route, query = {}) => {
  mRouter.push({route, query});
};

const page = ref(0);
const productLoading = ref(false);
const categoryProductList = ref([] as any);
const loadingType = ref('');
// 顶部tab点击
const tabClick = (id: string) => {
  currentCate.value = Number(id);
  if (Number(id) === 0) return;
  page.value = 1;
  productLoading.value = true;
  categoryProductList.value = [];
  getProductList(id);
};

// 获取产品列表
const getProductList = async (id: string) => {
  try {
    const data = (await productApi.getProductList({
      cate_id: id,
      page: page.value
    })) as any;
    productLoading.value = false;
    loadingType.value = data.length < 10 ? 'noMore' : 'more';
    categoryProductList.value = [...categoryProductList.value, ...data];
  } catch (e) {
    //
    productLoading.value = false;
  }
};
</script>
<style lang="scss">
.rf-home-normal {
  /*爆款拼团*/
  .wrapper {
    border-radius: 10rpx;

    .h-list {
      background-color: $page-color-base;
      white-space: nowrap;
      padding: 0 $spacing-sm;

      .h-item {
        margin: $spacing-sm $spacing-sm $spacing-sm 0;
        display: inline-block;
        background-color: $color-white;
        font-size: $font-sm;
        width: 280rpx;
        border-radius: 6rpx;

        .h-item-img {
          display: inline-block;
          width: 280rpx;
          height: 300rpx;
          border-top-left-radius: 12rpx;
          border-top-right-radius: 12rpx;
          border-bottom: 1rpx solid rgba(0, 0, 0, 0.01);
        }

        .title {
          width: 280rpx;
          white-space: normal;
          height: 60rpx;
          line-height: 30rpx;
          font-size: $font-sm;
          padding: 0 $spacing-sm;
          margin: $spacing-sm 0;
        }

        .last-line {
          padding: 0 $spacing-sm $spacing-base;
          margin-bottom: 5rpx;
          display: flex;
          justify-content: space-between;
          align-items: center; /* 垂直居中 */
          .red {
            font-size: $font-sm;
            margin-right: 4rpx;
          }
        }

        .price {
          font-size: $font-base - 2rpx;
          line-height: 1;

          .m-price {
            margin-left: 8rpx;
            color: $font-color-light;
            font-size: $font-sm;
            text-decoration: line-through;
          }
        }
      }
    }
  }

  /*轮播图*/
  .swiper-normal {
    width: 100%;
    margin-bottom: 20rpx;
    display: flex;
    justify-content: center;

    .swiper-box {
      width: 92%;
      height: 40vw;
      overflow: hidden;
      border-radius: 15rpx;
      box-shadow: 0rpx 8rpx 25rpx rgba(0, 0, 0, 0.2);
      //兼容ios，微信小程序
      position: relative;
      z-index: 1;

      swiper {
        width: 100%;
        height: 40vw;

        swiper-item {
          image {
            width: 100%;
            height: 40vw;
          }
        }
      }
    }
  }

  /* 爆款推荐 */
  .hot-recommend {
    display: flex;
    padding: $spacing-base $spacing-lg 0;

    .hot-recommend-image {
      width: 100%;
      height: 100%;
    }

    .left {
      flex: 3;
      height: 350rpx;
      margin-right: 15rpx;
    }

    .right {
      flex: 4;

      .hot-recommend-image {
        height: 170rpx;
      }
    }
  }

  /*轮播图2*/
  .swiper-item-text {
    position: absolute;
    bottom: 16rpx;
    left: 30rpx;
    height: 48rpx;
    line-height: 48rpx;
    background: rgba(0, 0, 0, 0.2);
    width: 90%;
    color: $color-white;
    border-bottom-left-radius: 12rpx;
    padding-left: 20rpx;
  }

  /*预售订单*/
  .seckill {
    width: 704rpx;
    height: 292rpx;
    margin: 20rpx 10rpx;
    background: #ffffff;
    border-radius: 25rpx;

    .seckill-matter {
      width: 704rpx;
      height: 70rpx;
      display: flex;
      justify-content: space-between;

      .matter {
        margin-left: 28rpx;
        font-size: 33rpx;
        font-weight: bold;

        text {
          color: #1c1c1c;
        }
      }

      .matter-info {
        color: #929292;

        .iconfont {
          font-size: 25rpx;
        }
      }
    }

    .seckill-scroll {
      width: 704rpx;
      height: 250rpx;

      .seckill-item {
        width: 669rpx;

        .seckill-scroll-x {
          white-space: nowrap;
          width: 100%;
          margin-left: 15rpx;

          .seckill-list {
            width: 152rpx;
            height: 212rpx;
            margin-right: 18rpx;
            display: inline-block;

            .seckill-img {
              width: 152rpx;
              height: 152rpx;

              image {
                width: 152rpx;
                height: 152rpx;
                border-radius: 10rpx;
              }

              .discount {
                text-align: center;
                width: 90rpx;
                height: 38rpx;
                margin-top: -165rpx;
                position: relative;
                border-radius: 0 17rpx 17rpx 22rpx;
                border: 3rpx #ffffff solid;
                font-size: 22rpx;
              }
            }

            .limit {
              width: 152rpx;
              height: 35rpx;
              margin-top: -35rpx;
              position: relative;
              background: rgba(254, 204, 204, 0.7);
              border-radius: 0 0 10rpx 10rpx;
              color: #ffffff;
              font-size: 24rpx;
            }

            .price {
              width: 152rpx;
              height: 50rpx;
              margin-top: 10rpx;
              font-size: 34rpx;
              font-weight: bold;
            }
          }
        }
      }
    }
  }

  /*新闻通知*/
  .swiper-slide-header {
    .iconfont {
      font-size: $font-lg + 8rpx;
    }
  }

  /*分类列表*/
  .category-list-wrapper {
    .category-list {
      width: 100%;
      padding: $spacing-base;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .category {
        margin-top: 10rpx;
        width: calc(20% - 20rpx);
        height: 132rpx;
        display: flex;
        text-align: center;
        flex-wrap: wrap;

        .img {
          width: 100%;
          display: flex;
          justify-content: center;

          image {
            width: 12vw;
            height: 12vw;
            border-radius: 50%;
          }
        }

        .text {
          margin-top: 16rpx;
          width: 100%;
          display: flex;
          justify-content: center;
          font-size: 24rpx;
          color: #3c3c3c;
        }
      }
    }
  }

  /*版权显示*/
  .copyright {
    margin: 10rpx 0;
    width: 100%;
    text-align: center;
    color: #666;

    a {
      display: block;
      color: #666;
      text-decoration: none;
    }
  }

  /*限时折扣*/
  .order-item {
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 0 30rpx;
    margin-bottom: 20rpx;

    .goods-box-single {
      display: flex;
      padding: 40rpx 10rpx 10rpx;
      height: 330rpx;
      border-radius: 12rpx;
      margin-top: 20rpx;
      box-shadow: 2px 2px 10px rgba(66, 135, 193, 0.2); // 阴影
      border-bottom: 1px solid rgba(0, 0, 0, 0.05); // 边框
      position: relative;

      .goods-img {
        display: block;
        border-radius: 12rpx;
        width: 190rpx;
        height: 200rpx;
      }

      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0 30rpx 0 24rpx;
        overflow: hidden;

        .title {
          font-weight: bold;
          line-height: 1.2;
          margin: 10rpx 0;
        }

        .attr-box {
          line-height: 1.2;
          margin-bottom: 8rpx;
          margin-left: 10rpx;
        }

        .last-line {
          margin-top: 3rpx;
          display: flex;
          justify-content: space-between;
          align-items: center; /* 垂直居中 */
          .red {
            margin-right: 4rpx;
          }
        }

        .price {
          font-size: $font-lg;
          line-height: 1;

          .m-price {
            margin-left: 8rpx;
            color: $font-color-light;
            font-size: $font-sm;
            text-decoration: line-through;
          }
        }

        .triangle-wrapper {
          position: absolute;
          overflow: hidden;
          top: 0;
          right: 0;
          border-radius: 12rpx;

          .triangle {
            color: #5eba8f;
            width: 0;
            height: 0;
            border-top: 120rpx solid;
            opacity: 0.8;
            border-left: 120rpx solid transparent;
          }

          .triangle-content {
            position: absolute;
            top: 28rpx;
            right: 0;
            transform: rotate(45deg);
            font-size: $font-sm - 2rpx;
            color: #fff;
          }
        }
      }
    }

    .action-box {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 90rpx;
      position: relative;

      .discount-time {
        font-size: $font-sm;
        color: $uni-color-success;
        margin-right: 20rpx;
      }
    }
  }

  .index-cate-product-list {
    padding-top: $spacing-sm;
    background-color: $page-color-base;

    .no-data {
      margin: 48rpx 0;
      color: $font-color-light;
      display: flex;
      justify-content: center;
      align-items: center;

      .iconfont {
        margin-right: 20rpx;
        font-size: $font-lg + 16rpx;
      }
    }
  }

  .index-top-bg-wrapper {
    position: absolute;
    width: 100vw;
    top: -25vw;
    overflow: hidden;

    .index-top-bg {
      width: 150vw;
      height: 90vw;
      margin-left: -25vw;
      border-radius: 0 0 50% 50%;
    }
  }
}
</style>
