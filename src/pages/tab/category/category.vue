<template>
  <view class="rf-category">
    <rf-navbar :border="false" nav-type="search" :status-bar="true" />
    <!--分类数据-->
    <view v-if="state.styleCateType === CateStyleEnum.ONE_COVER" class="rf-category__one-cover">
      <view
        v-for="tItem in state.categoryList"
        :key="tItem.id"
        class="rf-category__one-cover__wrap"
        @tap="navTo(mRouteConfig.productList, { cate_id: tItem.id })"
      >
        <rf-image width="100" height="100" border-radius="50%" :src="tItem.cover || errorImage" />
        <view class="font-sm-2 mt-sm font-color-base">
          {{ tItem.title }}
        </view>
      </view>
    </view>
    <view
      v-else-if="
        (state.styleCateType === CateStyleEnum.ONE_TWO_THREE_COVER ||
          state.styleCateType === CateStyleEnum.ONE_TWO_THREE_TEXT ||
          state.styleCateType === CateStyleEnum.ONE_TWO_TEXT ||
          state.styleCateType === CateStyleEnum.ONE_TWO_COVER ||
          state.styleCateType === CateStyleEnum.ONE_PRODUCT ||
          state.styleCateType === CateStyleEnum.ONE_TWO_PRODUCT) &&
          state.categoryList.length > 0
      "
      :style="{ height: `calc(100vh - ${customBarHeight}px - 188rpx)` }"
      class="rf-category__category-list"
    >
      <!-- 左侧分类导航 -->
      <scroll-view scroll-y="true" :style="{ height: `calc(100vh - ${customBarHeight}px - 168rpx)` }" class="left pb-safe">
        <view
          v-for="(fItem, fIndex) in state.categoryList"
          :key="fItem.id"
          class="row"
          :class="[fIndex === state.showCategoryIndex ? 'on' : '']"
          @tap="
            state.styleCateType === CateStyleEnum.ONE_PRODUCT || state.styleCateType === CateStyleEnum.ONE_TWO_PRODUCT
              ? showProduct(fItem, fIndex)
              : showCategory(fIndex)
          "
        >
          <view
            class="text font-base"
            :class="
              fIndex === state.showCategoryIndex ? 'font-weight font-lg text-' + themeColor.name : 'font-color-base'
            "
          >
            <view class="block" :class="'bg-' + themeColor.name" />
            {{ fItem.title }}
          </view>
        </view>
      </scroll-view>
      <!--右侧子导航-->
      <scroll-view
        v-if="
          state.styleCateType === CateStyleEnum.ONE_TWO_THREE_COVER ||
            state.styleCateType === CateStyleEnum.ONE_TWO_THREE_TEXT ||
            state.styleCateType === CateStyleEnum.ONE_TWO_TEXT ||
            state.styleCateType === CateStyleEnum.ONE_TWO_COVER
        "
        scroll-y="true"
        class="right pb-safe"
        :style="{ height: `calc(100vh - ${customBarHeight}px - 168rpx)` }"
      >
        <view>
          <view v-for="(fItem, fIndex) in state.categoryList" :key="fItem.id">
            <view v-if="fIndex === state.showCategoryIndex" class="category">
              <view v-if="state.cateTop?.cover" class="banner" @tap="indexTopToDetailPage(state.cateTop)">
                <rf-image width="140" border-radius="16" height="140" :src="state.cateTop?.cover" mode="aspectFill" />
              </view>
              <view
                v-if="
                  state.styleCateType === CateStyleEnum.ONE_TWO_THREE_COVER ||
                    state.styleCateType === CateStyleEnum.ONE_TWO_THREE_TEXT
                "
              >
                <view v-for="sItem in fItem.child" :key="sItem.id" class="box">
                  <view
                    class="flex-between flex-align-items pl-lg pr-lg pt-base"
                    @tap="navTo(mRouteConfig.productList, { cate_id: sItem.id })"
                  >
                    <view class="font-color-dark font-weight">
                      {{ sItem.title }}
                    </view>
                    <view class="font-color-light font-sm">
                      更多
                    </view>
                  </view>
                  <view
                    v-if="sItem.child && sItem.child.length > 0"
                    class="list"
                    :class="
                      state.styleCateType === CateStyleEnum.ONE_TWO_THREE_COVER ? 'pl-sm pr-sm' : 'pl-base pr-base'
                    "
                  >
                    <view
                      v-for="tItem in sItem.child"
                      :key="tItem.id"
                      class="box"
                      @tap="navTo(mRouteConfig.productList, { cate_id: tItem.id })"
                    >
                      <view v-if="state.styleCateType === CateStyleEnum.ONE_TWO_THREE_COVER">
                        <rf-image
                          width="140"
                          height="140"
                          border-radius="6"
                          :src="tItem.cover || errorImage"
                        />
                        <view class="font-sm-2 mt-sm text-center in1line font-color-base">
                          {{ tItem.title }}
                        </view>
                      </view>
                      <text
                        v-if="state.styleCateType === CateStyleEnum.ONE_TWO_THREE_TEXT"
                        class="category-tag in1line text-center font-color-base"
                      >
                        {{ tItem.title }}
                      </text>
                    </view>
                  </view>
                  <view v-else class="no-data">
                    <i class="iconfont icon404" />
                    暂无子分类
                  </view>
                </view>
              </view>
              <view
                v-if="
                  state.styleCateType === CateStyleEnum.ONE_TWO_COVER ||
                    state.styleCateType === CateStyleEnum.ONE_TWO_TEXT
                "
              >
                <view class="list pl-lg pr-lg">
                  <view
                    v-for="sItem in fItem.child"
                    :key="sItem.id"
                    class="box"
                    @tap="navTo(mRouteConfig.productList, { cate_id: sItem.id })"
                  >
                    <view v-if="state.styleCateType === CateStyleEnum.ONE_TWO_COVER">
                      <rf-image width="140" height="140" border-radius="6" :src="sItem.cover || errorImage" />
                      <view class="font-sm-2 font-color-base mt-sm text-center in1line">
                        {{ sItem.title }}
                      </view>
                    </view>
                    <view
                      v-if="state.styleCateType === CateStyleEnum.ONE_TWO_TEXT"
                      class="category-tag in1line text-center font-color-base"
                    >
                      {{ sItem.title }}
                    </view>
                  </view>
                </view>
              </view>
              <view v-if="fItem.child.length === 0" class="no-data">
                <rf-icon name="icon404" />
                暂无分类
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <!--右侧子导航-->
      <scroll-view
        v-if="
          state.styleCateType === CateStyleEnum.ONE_PRODUCT || state.styleCateType === CateStyleEnum.ONE_TWO_PRODUCT
        "
        scroll-y="true"
        class="right pb-safe"
        :style="{ height: `calc(100vh - ${customBarHeight}px - 168rpx)` }"
        @scrolltolower="getMoreProductList"
      >
        <scroll-view
          v-if="state.styleCateType === CateStyleEnum.ONE_TWO_PRODUCT"
          :scroll-x="true"
          class="second-category"
        >
          <view
            v-for="(sItem, sIndex) in state.currentSecondCategoryList"
            :key="sIndex"
            class="mr-base inline-block"
            @tap="handleCategoryInvertedChange(sItem, sIndex)"
          >
            <rf-tag
              :text="sItem.title"
              lr-padding="32rpx"
              tb-padding="8rpx"
              :font-weight="state.categoryInvertedIndex === sIndex ? '500' : 'normal'"
              :color="state.categoryInvertedIndex === sIndex ? themeColor.color : '#666'"
              :bg-color="state.categoryInvertedIndex === sIndex ? `rgba(${themeColor.rgb}, 0.12)` : '#f8f8f8'"
              :border-radius="24"
            />
          </view>
        </scroll-view>
        <view v-for="(fItem, fIndex) in state.categoryList" :key="fItem.id">
          <view v-if="fIndex === state.showCategoryIndex" class="category">
            <view class="order-by-wrapper flex-between pl-lg pr-lg pb-sm mb-lg pt-sm">
              <text class="font-sm-2 font-color-base">{{ state.categoryItem || '推荐' }}</text>
              <view class="flex-center">
                <view class="order-by-item font-color-base mr-base" @tap.stop="handleSalesOrderByChange">
                  <text class="font-sm-2">销量</text>
                  <view class="iconfont-group">
                    <view class="scale-8">
                      <rf-icon
                        size="20"
                        name="iconshangsanjiao"
                        padding-top="3"
                        :color="state.totalSales === 'asc' ? themeColor.color : '#666'"
                      />
                    </view>
                    <view class="scale-8">
                      <rf-icon
                        size="20"
                        name="iconxiasanjiao"
                        padding-top="3"
                        :color="state.totalSales === 'desc' ? themeColor.color : '#666'"
                      />
                    </view>
                  </view>
                </view>
                <view class="order-by-item font-color-base" @tap.stop="handlePriceOrderByChange">
                  <text class="font-sm-2">价格</text>
                  <view class="iconfont-group">
                    <view class="scale-8">
                      <rf-icon
                        size="20"
                        name="iconshangsanjiao"
                        padding-top="3"
                        :color="state.price === 'asc' ? themeColor.color : '#666'"
                      />
                    </view>
                    <view class="scale-8">
                      <rf-icon
                        size="20"
                        name="iconxiasanjiao"
                        padding-top="3"
                        :color="state.price === 'desc' ? themeColor.color : '#666'"
                      />
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view
              v-for="(item, index) in state.categoryProductList"
              :key="index"
              class="product-list w100 flex mb-item bg-whiteborder-radius-1 pr-lg"
              @tap.stop="navToDetail(item)"
            >
              <!--左侧图标-->
              <view class="product-list-picture mr-base flex-shrink">
                <rf-image :height="imageWidth" :src="item.picture" :width="imageWidth" border-radius="12" />
                <text v-if="item.sketch" class="sketch in1line">{{ item.sketch }}</text>
                <view v-if="Number(item.stock) === 0" class="no-sale-num font-sm-2">
                  已售罄
                </view>
              </view>
              <!--右侧商品信息-->
              <view class="product-list-info">
                <!--商品名-->
                <view class="font-sm-2 in2line line-height-2 font-weight-500">
                  {{ item.name }}
                </view>
                <!--标签-->
                <view v-if="item.tags?.length > 0 || item?.marketing_tags?.length > 0" class="line-height-1 product-list-info-tags pt-sm-half">
                  <view v-if="item?.marketing_tags?.length > 0" class="flex in1line">
                    <view v-for="tagItem in item?.marketing_tags" :key="tagItem" class="inline-block">
                      <rf-tag
                        :bg-color="`rgba(${themeColor.rgb}, 0.08)`"
                        :border-radius="6"
                        :color="themeColor.color"
                        :text="tagItem"
                        lr-padding="8rpx"
                        tb-padding="0"
                        scale="0.9"
                      />
                    </view>
                  </view>
                  <view v-else-if="item.tags?.length > 0" class="font-color-light font-xs in1line line-height-1">
                    {{ item.tags?.join(" | ") }}
                  </view>
                </view>
                <view v-else>
                  <view class="pt-sm" />
                </view>
                <!--价格-->
                <view class="product-list-info-bottom">
                  <view>
                    <view class="in1line">
                      <view
                        v-if="Number(item.is_member_discount)"
                        :class="'text-' + themeColor.name"
                        class="flex-align-items font-weight-500">
                        <text class="font-sm mt-sm-half">{{ moneySymbol }}</text>
                        <text class="font-lg">{{ item.member_discount_price }}</text>
                        <rf-image :src="vipPrice" height="30" width="30" />
                      </view>
                      <text
                        v-else-if="item.marketing_type === MarketingTypeEnum.POINT_EXCHANGE"
                        :class="'text-' + themeColor.name"
                        class="font-weight-500 mr-sm"
                      >
                        <text v-if="Number(item?.marketing?.marketing_price) > 0">
                          <text class="font-sm">{{ moneySymbol }}</text>
                          <text class="font-lg">{{ item?.marketing?.marketing_price }}+{{ item?.marketing?.point }}积分</text>
                        </text>
                      </text>
                      <text
                        v-else-if="item.marketing_type"
                        :class="'text-' + themeColor.name"
                        class="font-weight-500 mr-sm"
                      >
                        <text class="font-sm">{{ moneySymbol }}</text>
                        <text class="font-lg">{{ item?.marketing?.marketing_price }}</text>
                      </text>
                      <text v-else :class="'text-' + themeColor.name" class="font-weight-500 mr-sm">
                        <text class="font-sm">{{ moneySymbol }}</text>
                        <text class="font-lg">{{ item.price }}</text>
                      </text>
                      <text
                        v-if="item.market_price > item.price && !Number(item.is_member_discount) && item.marketing_type !== MarketingTypeEnum.POINT_EXCHANGE"
                        class="line-through font-color-light font-sm"
                      >{{ moneySymbol }}{{ item.market_price }}
                      </text>
                    </view>
                    <view>
                      <text
                        v-if="Number(item.is_member_discount) && Number(item.member_discount_price) < Number(item.price)"
                        :class="'text-' + themeColor.name"
                        class="font-color-light"
                      >
                        <text class="font-xs">{{ moneySymbol }}</text>
                        <text>{{ item.price }}</text>
                      </text>
                      <text v-else-if="Number(item.is_sales_visible) !== 0" class="font-color-light font-xs ml-sm">
                        {{ filterTotalSales(item.total_sales || "0") }}人付款
                      </text>
                    </view>
                  </view>
                  <view @tap.stop="toggleSpec(item)">
                    <rf-icon
                      size="50"
                      class="mt-sm-half"
                      name="iconyijiagou"
                      :color="themeColor.color"
                    />
                  </view>
                </view>
              </view>
            </view>
            <rf-load-more
              v-if="state.categoryProductList.length > 0"
              width="550rpx"
              :status="state.loadingType"
            />
            <view v-if="state.categoryProductList.length === 0 && !state.productLoading" class="no-data">
              <rf-empty info="暂无商品" :is-recommend-show="false" :padding-top="0" />
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <!--分类数据-->
    <rf-empty v-if="state.categoryList.length === 0 && !state.loading" :bottom="bottom" info="暂无产品分类~" />
    <!--加载动画-->
    <rf-loading :is-full-screen="mHelper.isBottomNav('category')" :active="state.loading" />
    <!-- 规格-模态层弹窗 -->
    <rf-attr-content
      v-if="state.isAtteContentShow"
      :bottom="bottom ? `${bottom}rpx` : '0'"
      :product="state.productDetail"
      :show-buy-btn="true"
      @toggle="toggleSpec"
      @close="state.isAtteContentShow = false"
    />
  </view>
</template>
<script lang="ts" setup>
import {computed, reactive, ref} from 'vue';
import { onLoad } from '@dcloudio/uni-app';

import mAssetsPath from '@/config/assets';
import mConstData from '@/config/constData';
import mRouter from '@/utils/routerUtil';
import mHelper from '@/utils/helper';
import mRouteConfig from '@/config/routes';
import memberApi from '@/api/tinyShop/member';
import marketingApi from '@/api/tinyShop/marketing';
import productApi from '@/api/tinyShop/product';
import commonApi from '@/api/tinyShop/common';

import { CategoryItem, CateItem, CustomCategory } from '@/response/category';
import { Product } from '@/response/product';
import { Route } from '@/response/route';
import { CateStyleEnum } from '@/enum/categoryEnum';
import store from '@/store';
import { MarketingTypeEnum } from '@/enum/marketingEnum';
import RfEmpty from "@/components/rf-empty/rf-empty.vue";

const customBarHeight = mHelper.getCustomBarHeight();
const imageWidth = ref(160);
const moneySymbol = mConstData.moneySymbol;
const themeColor = mHelper.getThemeColor(); // 主题色
const vipPrice = mAssetsPath.vipIcon;

onLoad(() => {
  initData();
});

// 购买栏底部距离
const bottom = computed(() => {
  let sysInfo: AnyObject = uni.getSystemInfoSync();
  return (sysInfo?.safeAreaInsets?.bottom / 2 || 0) + 90;
});

let state = reactive({
  hotSearchDefault: '请输入关键字',
  hot_search_default: '',
  search: { hot_search_default: '' },
  isAtteContentShow: false,
  loadingType: 'more',
  productLoading: true,
  totalSales: '',
  price: '',
  currentCateId: '',
  loading: true,
  cateTop: {} as CateItem,
  page: 1,
  showCategoryIndex: 0,
  categoryItem: '',
  productDetail: {} as Product,
  categoryProductList: {} as Product[],
  categoryList: [] as CategoryItem[],
  currentSecondCategoryList: [] as CategoryItem[],
  categoryInvertedIndex: 0,
  styleCateType: 'one_two_three_cover'
});

const errorImage = mAssetsPath.errorImage; // 加载失败图片

// 监听二级分类变化
const handleCategoryInvertedChange = (item: CategoryItem, index: number) => {
  state.categoryInvertedIndex = index;
  state.categoryItem = item.title;
  state.currentCateId = item.id;
  state.price = '';
  state.totalSales = '';
  state.page = 1;
  state.categoryProductList = [];
  getProductList();
};
// 格式化销量显示
const filterTotalSales = (val: string) => {
  if (parseInt(val) > 10000) {
    val = `${(parseInt(val) / 10000).toFixed(2)}w`;
  }
  return val;
};
// 跳转详情
const navToDetail = (item) => {
  mHelper.navToProduct(item.id, item.marketing_type, item.marketing_id, item?.marketing?.marketing_product_id);
};
// 规格弹窗开关
const toggleSpec = async (row) => {
  if (parseInt(row.status, 10) === 0) return;
  if (state.isAtteContentShow) {
    state.isAtteContentShow = false;
    if (row.stock === 0) {
      mHelper.toast('库存不足');
      return;
    }
    if (row.type === 1) {
      // 加入购物车
      await handleCartItemCreate(row.skuId, row.cartCount);
    } else if (row.type === 2) {
      if (row.marketing_type === MarketingTypeEnum.PRE_SELL) {
        const data: AnyObject[] = [];
        const params: AnyObject = { item: {} };
        params['merchant_id'] = row.merchant_id;
        params['item']['type'] = MarketingTypeEnum.PRE_SELL;
        params['item']['data'] = JSON.stringify({
          num: row.cartCount,
          sku_id: row.skuId,
          marketing_id: row.marketing_id
        });
        data.push(params);
        navTo(mRouteConfig.createOrder, {
          data: JSON.stringify(data)
        });
      } else if (row.marketing_type === MarketingTypeEnum.BARGAIN) {
        const params: AnyObject = {};
        params.sku_id = row.skuId;
        params.bargain_id = row.marketing_id;
        try {
          const data = (await marketingApi.handleBargainLaunchCreate(params)) as any;
          navTo(mRouteConfig.bargainDetail, { id: data.id });
        } catch (e) {
          //
        }
      } else {
        // 立即购买
        const data: AnyArray = [];
        const params: AnyObject = { item: {} };
        params['merchant_id'] = state.productDetail.merchant.id;
        params['item']['data'] = {
          sku_id: row.skuId,
          num: row.cartCount,
          marketing_id: state.productDetail.marketing_id
        };
        params['item']['type'] = state.productDetail.marketing_type || 'buy_now';
        data.push(params);
        navTo(mRouteConfig.createOrder, { data: JSON.stringify(data) });
      }
    }
    setTimeout(() => {
      state.isAtteContentShow = false;
    }, 250);
  } else if (!state.isAtteContentShow) {
    await getProductBaseDetail(row);
  }
};
// 添加商品至购物车
const handleCartItemCreate = async (skuId: string, cartCount: number) => {
  try {
    await memberApi.handleCartItemCreate({
      sku_id: skuId,
      number: cartCount
    });
    const cartNum = await memberApi.getCartItemCount();
    store.commit('notify/setCartNum', { cartNum });
    mHelper.toast('添加购物车成功');
    state.isAtteContentShow = false;
  } catch (e) {
    //
  }
};
// 获取产品详情
const getProductBaseDetail = async (row) => {
  try {
    const data = await productApi.getProductBaseDetail({
      id: row.id,
      marketing_id: row?.marketing_id,
      marketing_type: row?.marketing_type,
      marketing_product_id: row?.marketing?.marketing_product_id
    });
    state.productDetail = data as unknown as Product;
    state.isAtteContentShow = true;
  } catch (e) {
    //
  }
};
// 数据初始化
const initData = async () => {
  state.search = uni.getStorageSync('search') || {};
  state.hotSearchDefault = state.search?.hot_search_default || '请输入关键字';
  state.categoryList = [];
  state.categoryProductList = [];
  await getProductCate();
};
// 获取商品分类列表
const getProductCate = async (type = '') => {
  try {
    const data = (await productApi.getProductCate()) as unknown as CustomCategory;
    if (type === 'refresh') {
      uni.stopPullDownRefresh();
    }
    state.loading = false;
    state.styleCateType = CateStyleEnum.ONE_PRODUCT;
    state.categoryList = data?.list;
    let cateId = uni.getStorageSync('indexToCateId');
    if (cateId) {
      state.categoryList.length > 0 &&
        state.categoryList.forEach((item, index) => {
          if (cateId === item.id) {
            state.showCategoryIndex = index;
          }
        });
    } else {
      if (state.styleCateType === CateStyleEnum.ONE_TWO_PRODUCT && state.categoryList[0].child.length > 0) {
        state.currentCateId = state.categoryList[0].child[0].id;
        state.categoryItem = state.categoryList[0].child[0].title;
      } else {
        state.showCategoryIndex = 0;
        state.currentCateId = state.categoryList[0].id;
        state.categoryItem = state.categoryList[0].title;
      }
    }
    if (state.categoryList.length > 0) {
      state.currentSecondCategoryList = state.categoryList[0].child;
    }
    state.page = 1;
    state.categoryProductList = [];
    await getProductList();
    // 获取分类广告图 注：广告图不是一级分类图
    // await getAdvList();
  } catch (e) {
    //
    if (type === 'refresh') {
      uni.stopPullDownRefresh();
    }
    state.loading = false;
  }
};
// 获取广告列表
const getAdvList = async () => {
  try {
    const data = (await commonApi.getAdvList({
      location: 'cate_top'
    })) as AnyObject;
    state.cateTop = data.cate_top[0];
  } catch (e) {
    //
  }
};
// 分类切换显示
const showCategory = (index: number) => {
  state.showCategoryIndex = index;
};
const showProduct = (item: CategoryItem, index: number) => {
  state.categoryInvertedIndex = 0;
  state.currentSecondCategoryList = item.child;
  state.showCategoryIndex = index;
  if (state.styleCateType === CateStyleEnum.ONE_TWO_PRODUCT && item.child.length > 0) {
    state.currentCateId = item.child[0].id;
    state.categoryItem = item.child[0].title;
  } else {
    state.currentCateId = item.id;
    state.categoryItem = item.title;
  }
  state.price = '';
  state.totalSales = '';
  state.page = 1;
  state.categoryProductList = [];
  getProductList();
};
const handleSalesOrderByChange = () => {
  if (state.categoryProductList.length === 0) return;
  state.price = '';
  state.totalSales = state.totalSales === 'asc' ? 'desc' : 'asc';
  state.page = 1;
  state.categoryProductList = [];
  getProductList();
};
const handlePriceOrderByChange = () => {
  if (state.categoryProductList.length === 0) return;
  state.totalSales = '';
  state.price = state.price === 'asc' ? 'desc' : 'asc';
  state.page = 1;
  state.categoryProductList = [];
  getProductList();
};
// 获取产品列表
const getProductList = async () => {
  state.productLoading = true;
  const params: AnyObject = {};
  if (state.totalSales) {
    params.total_sales = state.totalSales;
  }
  if (state.price) {
    params.price = state.price;
  }
  params.page = state.page;
  params.cate_id = state.currentCateId;
  try {
    const data = (await productApi.getProductList(params)) as unknown as Product[];
    state.productLoading = false;
    state.loadingType = data.length < 10 ? 'noMore' : 'more';
    state.categoryProductList = [...state.categoryProductList, ...data];
    uni.removeStorageSync('indexToCateId');
  } catch (e) {
    //
  }
};
// 跳至广告图指定页面
const indexTopToDetailPage = (item) => {
  mHelper.handleBasicNavTo(JSON.parse(item.extend_link || '{}'));
};
const getMoreProductList = () => {
  if (state.loadingType === 'noMore') return;
  state.page++;
  getProductList();
};
// 通用跳转
const navTo = (route: Route, query = {}) => {
  mRouter.push({ route, query });
};
</script>
<style lang="scss">
.rf-category {
  background-color: $color-white;
  .border-bottom {
    border-bottom: 1rpx solid #ededed;
  }

  &__input {
    height: 60rpx;
    display: flex;
    align-items: center;
    margin: 0 $spacing-base $spacing-base;
    position: relative;
    z-index: 0;
    &__search {
      z-index: 998;
      position: absolute;
      left: 20rpx;
      top: 11rpx;
      width: 60rpx;
      height: 60rpx;
      font-size: 28rpx;
      color: $font-color-base;
    }
    &__input {
      flex: 1;
      height: 60rpx;
      background-color: #f5f5f5;
      padding-left: 68rpx;
      border-radius: 30rpx;
      color: #aaa;
      font-size: 28rpx;
    }
  }
  &__one-cover {
    margin: $spacing-lg 0;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    &__wrap {
      width: calc(71.44vw / 3);
      margin-bottom: $spacing-lg;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
    }
  }
  &__category-list {
    width: 100%;
    background-color: $color-white;
    display: flex;
    border-top: 1rpx solid $border-color-base;
    .left {
      width: 200rpx;
      height: 100%;
      left: 0;
      padding-top: $spacing-sm;
      border-right: 1rpx solid $border-color-base;
      .row {
        width: 100%;
        height: 100rpx;
        display: flex;
        align-items: center;
        .text {
          width: 100%;
          position: relative;
          display: flex;
          justify-content: center;
          .block {
            position: absolute;
            width: 0;
            left: 0;
          }
        }
        &.on {
          .text {
            .block {
              border-radius: 2rpx;
              margin-top: 2rpx;
              width: 6rpx;
              height: 80%;
              left: 10rpx;
            }
          }
        }
      }
    }
    .right {
      width: 550rpx;
      left: 200rpx;
      background-color: #fff;
      .second-category {
        z-index: 10;
        white-space: nowrap;
        width: 100%;
        padding: $spacing-base $spacing-lg;
      }
      .category {
        width: 100%;
        .banner {
          width: 96%;
          margin: 10rpx auto 30rpx;
          height: 24.262vw;
          border-radius: 10rpx;
          overflow: hidden;
          box-shadow: 0rpx 5rpx 20rpx rgba(0, 0, 0, 0.05);
        }
        .list {
          margin-top: $spacing-base;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          .box {
            width: 33.333%;
            margin-bottom: $spacing-lg;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            .category-tag {
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 0 $spacing-sm;
              font-size: $font-sm + 2rpx;
              line-height: 56rpx;
              margin: 0 $spacing-sm;
              color: $font-color-dark;
              background-color: $page-color-base;
              border-radius: 6rpx;
            }
          }
        }
        .no-data {
          height: calc(100vh - 500rpx);
          color: $font-color-light;
          display: flex;
          justify-content: center;
          align-items: center;
          .iconfont {
            margin-right: 20rpx;
            font-size: $font-lg + 16rpx;
          }
        }
        .order-by-wrapper {
          width: 100%;
          background-color: $page-color-base;
          .order-by-item {
            display: flex;
            justify-content: center;
            align-items: center;
            .iconfont-group {
              margin-top: -2rpx;
            }
            .iconfont {
              height: 12rpx;
              line-height: 12rpx;
              display: block;
              margin-left: 4rpx;
            }
          }
        }
      }
      .one-cover-category {
        margin-top: $spacing-base;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .box {
          width: calc(71.44vw / 3);
          margin-bottom: $spacing-lg;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          image {
            width: 64%;
            height: calc(71.44vw / 3 * 0.64);
          }
          .text {
            margin-top: 8rpx;
            width: 100%;
            display: flex;
            justify-content: center;
            font-size: 26rpx;
          }
          .category-tag {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: $spacing-sm;
            font-size: $font-sm + 2rpx;
            margin-right: $spacing-base;
            color: $font-color-dark;
            background-color: $page-color-base;
            border-radius: 6rpx;
          }
        }
      }
      .product-image {
        position: relative;
        .no-sale-num {
          width: 100%;
          height: 100%;
          padding: 0 28rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: $color-white;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.36);
          border-radius: 12rpx;
        }
      }
    }
  }

	.product-list {
		border-bottom: 1rpx solid #eee;
		padding-bottom: 20rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: self-start;
		justify-content: space-between;
		&-picture {
			position: relative;
			margin-left: 10rpx;
			.sketch {
        width: 100%;
        background-color: rgba(0, 0, 0, 0.36);
        position: absolute;
        bottom: 0;
        padding: 0 12rpx;
        left: 0;
        color: #fff;
        font-size: $font-sm;
        height: 40rpx;
        line-height: 40rpx;
        border-radius: 0 0 12rpx 12rpx;
			}
      .no-sale-num {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $color-white;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.36);
        border-radius: 12rpx;
      }
		}
		&-info {
			width: 100%;
			&-tags {
				margin-bottom: 4rpx;
			}
			&-bottom {
        margin-top: 15rpx;
        height: 64rpx;
        line-height: 32rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
	}

}
</style>
