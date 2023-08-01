<template>
  <view class="rf-collection" :style="{paddingTop: collectionTypeList.length > 0 ? '75rpx' : '10rpx'}">
    <!--导航栏-->
    <view v-if="collectionTypeList.length > 0" class="navbar top-nav">
      <view
        v-for="(item, index) in collectionTypeList"
        :key="index"
        :class="
          state.tabCurrentIndex === index + 1
            ? 'current text-' + themeColor.name
            : ''
        "
        class="nav-item"
        @tap="tabClick(index, item.state)"
      >
        {{ item.text }}
      </view>
    </view>
    <!-- 内容   -->
    <view
      v-for="(item, index) in state.tabCurrentIndex === 1
        ? state.collectionList
        : state.merchantList"
      :key="index"
      :style="{ height: state.tabCurrentIndex === 1 ? '200rpx' : '460rpx' }"
      class="rf-collection__product"
    >
      <!-- 删除按钮 -->
      <view
        :class="'bg-' + themeColor.name"
        :style="{ height: state.tabCurrentIndex === 1 ? '200rpx' : '460rpx' }"
        class="menu flex-center"
        @tap.stop="handleDeleteCollection(item.id)"
      >
        <rf-icon name="iconiconfontshanchu1" size="72" />
      </view>
      <!-- 单个内容 -->
      <view
        :class="[
          state.theIndex === index
            ? 'open'
            : state.oldIndex === index
              ? 'close'
              : '',
        ]"
        class="carrier"
        @touchend="state.isStop = false"
        @touchmove="touchMove(index, $event)"
        @touchstart="touchStart(index, $event)"
      >
        <!--   商品     -->
        <template v-if="state.tabCurrentIndex === 1">
          <rf-image
            :src="item.picture"
            border-radius="6"
            height="200"
            width="200"
          />
          <view
            class="flex-1 ml-base"
            @tap.stop="navToProduct(item.id, item.marketing_type, item.marketing_id)"
          >
            <view class="in1line font-base-2 font-color-dark mb-base font-weight">
              {{ item.name }}
            </view>
            <view class="font-sm mt-sm in1line h-base font-color-light">
              {{ item.sketch }}
            </view>
            <view class="flex-between mt-sm">
              <view class="flex-1">
                <view class="price-wrap">
                  <text :class="'text-' + themeColor.name" class="mr-sm font-weight">
                    <text class="font-sm">{{ moneySymbol }}</text>
                    <text class="font-lg">{{ item.price }}</text>
                  </text>
                  <text
                    v-if="item.market_price > item.price"
                    class="line-through font-color-light"
                  >
                    <text class="font-sm">{{ moneySymbol }}{{ item.market_price }}</text>
                  </text>
                </view>
                <view
                  v-if="item.baseMerchant?.id"
                  class="font-sm font-color-light mt-sm flex-align-items"
                  @tap.stop="
                    navTo(mRouteConfig.merchant, { id: item.baseMerchant?.id })
                  "
                >
                  <rf-icon name="icondianpu2" size="24" />
                  <view class="font-color-light ml-sm mr-sm-half font-sm">
                    {{
                      item.baseMerchant?.title
                    }}
                  </view>
                  <rf-icon name="iconyou" size="24" />
                </view>
              </view>
            </view>
          </view>
        </template>
        <!--    店铺    -->
        <template v-if="state.tabCurrentIndex === 2">
          <view :style="{height: '100%'}" class="w100 p-base">
            <view class="flex-align-items">
              <rf-image
                :src="item.merchant?.cover"
                border-radius="50%"
                height="90"
                width="90"
              />
              <view class="ml-base flex-1 mr-base">
                <view class="in1line font-weight font-base-2 mb-sm-half">
                  {{ item.merchant?.title }}
                </view>
                <view class="font-color-light font-xs">
                  在售商品{{ item.productTotal }}件
                </view>
              </view>
              <button
                :class="'bg-gradual-' + themeColor.name"
                class="rf-short-btn rf-short-btn-merchant"
                @tap="navTo(mRouteConfig.merchant, { id: item.merchant?.id })"
              >
                进店
              </button>
            </view>
            <view class="rf-collection__merchant mt-base">
              <block v-if="item.products.length > 0">
                <view
                  v-for="(imgItem, imgIndex) in item.products"
                  :key="imgIndex"
                  class="rf-collection__merchant__item inline-block"
                  @tap="navTo(mRouteConfig.product, { id: imgItem.id })"
                >
                  <rf-image
                    :src="imgItem.picture"
                    border-radius="6"
                    height="209"
                    width="209"
                  />
                  <view :class="'text-' + themeColor.name" class="font-base font-weight in1line">
                    <text class="font-sm">{{ moneySymbol }}</text>
                    {{ imgItem.price }}
                  </view>
                  <view class="in2line font-color-dark font-sm prod-name">
                    {{ imgItem.name }}
                  </view>
                </view>
              </block>
              <view v-else class="w100">
                <rf-empty :is-recommend-show="false" info="该店铺暂未上架商品" padding-bottom="0" padding-top="30" />
              </view>
            </view>
          </view>
        </template>
      </view>
    </view>
    <rf-load-more
      v-if="
        state.tabCurrentIndex === 1
          ? state.collectionList.length > 0
          : state.merchantList.length > 0
      "
      :status="state.loadingType"
    />
    <rf-empty
      v-if="
        (state.tabCurrentIndex === 1
          ? state.collectionList.length === 0
          : state.merchantList.length === 0) && !state.loading
      "
      :info="state.tabCurrentIndex === 1 ? '快去收藏一些商品吧~' : '快去收藏一些店铺吧~'"
    />
    <!--加载动画-->
    <rf-loading :active="state.loading" />
  </view>
</template>
<script lang="ts" setup>
import mConstData from "@/config/constData";
import {computed, reactive,} from "vue";
import {onLoad, onPullDownRefresh, onReachBottom, onShow,} from "@dcloudio/uni-app";
import mRouter from "@/utils/routerUtil";
import mRouteConfig from "@/config/routes"; // 路由管理
import mHelper from "@/utils/helper";
import {Route,} from "@/response/route";
import memberApi from "@/api/tinyShop/member";
import commonApi from "@/api/tinyShop/common";
import {ProductListItem,} from "@/response/product";
import {MerchantItem,} from "@/response/merchant";
import RfIcon from "@/components/rf-icon/rf-icon.vue";
import RfImage from "@/components/rf-image/rf-image.vue";
import mAssetsPath from "@/config/assets";
import mSiteConfig from "@/config/site";

// 常量
const themeColor = mHelper.getThemeColor();
const notDataImg = mAssetsPath.notDataImg;

const collectionTypeList = computed(() => {
  switch (mSiteConfig.devPattern) {
    case "b2b2c":
      return [
        {
          state: 1,
          text: "商品",
        },
        {
          state: 2,
          text: "店铺",
        },
      ];
    default :
      return []
  }
})

const moneySymbol = mConstData.moneySymbol;

// 变量
let state = reactive({
  collectionList: [] as ProductListItem[],
  merchantList: [] as MerchantItem[],
  tabCurrentIndex: 1,
  page: 1,
  loadingType: "more",
  isStop: false,
  startTime: 0 as number,
  endTime: 0 as number,
  loading: true,
  theIndex: -1,
  oldIndex: -1,
  initXY: [] as number[],
});

onLoad((options: any) => {
  if (options.state === "2") {
    state.tabCurrentIndex = 2;
  }
});
onShow(() => {
  initData();
});
// 下拉刷新
onPullDownRefresh(() => {
  state.page = 1;
  state.collectionList = [];
  state.loading = true;
  getCollectionList("refresh");
});
// 加载更多
onReachBottom(() => {
  if (state.loadingType === "noMore") return;
  state.page++;
  getCollectionList();
});

const handleDeleteCollection = async (id: string) => {
  try {
    await commonApi.handleCollectDel({}, {id,});
    state.loading = true;
    await initData();
  } catch (e) {
    //
  }
};
// 顶部tab点击
const tabClick = (index: number, tabIndex: number) => {
  state.page = 1;
  state.loading = true;
  state.tabCurrentIndex = tabIndex;
  if (tabIndex === 1) {
    state.collectionList.length = 0;
    getCollectionList();
    state.oldIndex = -1;
    state.theIndex = -1;
  } else if (tabIndex === 2) {
    state.merchantList.length = 0;
    getMerchantCollectionList();
  }
};
// 数据初始化
const initData = () => {
  state.loading = true;
  state.page = 1;
  state.oldIndex = -1;
  state.theIndex = -1;
  if (state.tabCurrentIndex === 1) {
    state.collectionList.length = 0;
    getCollectionList();
  } else if (state.tabCurrentIndex === 2) {
    state.merchantList.length = 0;
    getMerchantCollectionList();
  }
};
// 控制左滑删除效果
const touchStart = (index: number, event) => {
  // 多点触控不触发
  if (event.touches.length > 1) {
    state.isStop = true;
    return;
  }
  state.oldIndex = state.theIndex;
  state.theIndex = -1;
  // 初始坐标
  state.initXY = [event.touches[0].pageX, event.touches[0].pageY,];
};
const touchMove = (index: number, event) => {
  // 多点触控不触发
  if (event.touches.length > 1) {
    state.isStop = true;
    return;
  }
  let moveX = event.touches[0].pageX - state.initXY[0];
  let moveY = event.touches[0].pageY - state.initXY[1];

  if (state.isStop || Math.abs(moveX) < 5) return;
  if (Math.abs(moveY) > Math.abs(moveX)) {
    // 竖向滑动-不触发左滑效果
    state.isStop = true;
    return;
  }

  if (moveX < 0) {
    state.theIndex = index;
    state.isStop = true;
  } else if (moveX > 0) {
    if (state.theIndex !== -1 && state.oldIndex === state.theIndex) {
      state.oldIndex = index;
      state.theIndex = -1;
      state.isStop = true;
      setTimeout(() => {
        state.oldIndex = -1;
      }, 150);
    }
  }
};
// 获取收藏列表
const getCollectionList = async (type = "") => {
  try {
    const data = (await memberApi.getCollectList({
      page: state.page,
    })) as unknown as ProductListItem[];
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
    state.loadingType = data.length < 10 ? "noMore" : "more";
    state.collectionList = [...state.collectionList, ...data,];
  } catch (e) {
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
  }
};
const getMerchantCollectionList = async (type = "") => {
  try {
    const data = (await memberApi.getMerchantCollectList({
      page: state.page,
    })) as unknown as MerchantItem[];
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
    state.loadingType = data.length < 10 ? "noMore" : "more";
    state.merchantList = [...state.merchantList, ...data,];
  } catch (e) {
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
  }
};
// 通用跳转
const navTo = (route: Route, query = {}) => {
  mRouter.push({route, query,});
};
// 跳转至商品详情
const navToProduct = (id: string, marketingType: string, marketingId) => {
  mHelper.navToProduct(id, marketingType, marketingId);
};
</script>
<style lang="scss">
.rf-collection {
  background-color: $page-color-base;
  // #ifndef MP-WEIXIN
  min-height: calc(100vh - 85rpx);
  // #endif
  // #ifdef MP-WEIXIN
  min-height: calc(100vh - 5rpx);
  // #endif

  .top-nav {
    height: 70rpx;
    width: 100%;
    position: fixed;
    // #ifndef MP-WEIXIN
    top: 85rpx;
    // #endif
    // #ifdef MP-WEIXIN
    top: 0;
    // #endif
  }

  &__product {
    width: 94%;
    margin: $spacing-base auto;
    border-radius: 6rpx;
    box-shadow: 0rpx 5rpx 12rpx rgba(0, 0, 0, 0.02);
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;

    .menu {
      position: absolute;
      width: 200rpx;
      right: 0;
      z-index: 2;
      border-radius: 0 8rpx 8rpx 0;
    }

    .carrier {
      &.open {
        animation: showMenu 0.25s linear both;
      }

      &.close {
        animation: closeMenu 0.15s linear both;
      }

      background-color: $color-white;
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 3;
      display: flex;
      align-items: center;
    }
  }

  .rf-short-btn-merchant {
    height: 56rpx;
    width: 110rpx;
    border-radius: 28rpx;
    line-height: 56rpx;
  }

  &__merchant {
    overflow: hidden;
    display: flex;

    &__item {
      margin-right: $spacing-base;
      width: 33%;

      .prod-name {
        width: 209rpx;
      }
    }
  }
}
</style>
