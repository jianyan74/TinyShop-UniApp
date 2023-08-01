<template>
  <view class="rf-cart pb-safe" :style="{ paddingTop: customBarHeight + 'px' }">
    <rf-custom :is-back="false">
      <template #content>
        <view class="font-weight font-color-dark font-base-2">
          购物车
        </view>
      </template>
      <template v-if="mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMINI" #left>
        <view v-if="state.selectedNum > 0" class="header">
          <view class="header__btn" @tap="state.manage = !state.manage">
            {{ state.manage ? '完成' : '管理' }}
          </view>
        </view>
      </template>
      <template v-else #right>
        <view v-if="state.selectedNum > 0" class="header">
          <view class="header__btn" @tap="state.manage = !state.manage">
            {{ state.manage ? '完成' : '管理' }}
          </view>
        </view>
      </template>
    </rf-custom>
    <view v-if="!state.loading" class="rf-cart__content">
      <!--空空如也-->
      <view
        v-if="
          !state.cartList.carts || (state.cartList.carts?.length === 0 && state.cartList.lose_efficacy?.length === 0)
        "
        class="rf-cart__empty"
      >
        <rf-icon :color="themeColor.color" name="icongouwuche5" size="108" />
        <view class="flex-align-items mt-lg font-color-base">
          空空如也
          <view v-if="hasLogin" :class="'text-' + themeColor.name" class="ml-sm" @tap="navTo(mRouteConfig.productList)">
            随便逛逛 >
          </view>
          <view v-else :class="'text-' + themeColor.name" class="ml-sm" @tap="navTo(mRouteConfig.login)">
            登录/注册 >
          </view>
        </view>
      </view>
      <!--购物车商品-->
      <view
        v-if="state.cartList.carts?.length > 0"
        class="rf-cart__product"
      >
        <view v-for="(fItem, fIndex) in state.cartList.carts" :key="fIndex" class="rf-cart__product__item">
          <!--   商户信息start       -->
          <view class="merchant-info" @tap="navTo(mRouteConfig.merchant, { id: fItem.merchant?.id })">
            <view class="flex-align-items">
              <view class="mr-base" @tap.stop="selectedMerchant(fIndex)">
                <rf-icon
                  :color="fItem.selected ? themeColor.color : '#B3B3B3'"
                  :name="fItem.selected ? 'iconxuanze' : 'iconxuanzekuangmoren'"
                  size="42"
                />
              </view>
              <rf-image
                :preview="false"
                :src="fItem.merchant?.cover || globalConfig.app_logo"
                border-radius="50%"
                height="42"
                width="42"
              />
              <text class="ml-sm mr-sm font-base-2 font-weight-500">{{
                fItem.merchant?.title || globalConfig.app_name
              }}
              </text>
              <view v-if="fItem.merchant?.id" class="font-color-light pt-sm-half">
                <rf-icon name="iconyou" size="28" />
              </view>
            </view>
            <!--     领券start       -->
            <view
              :class="'text-' + themeColor.name"
              @tap.stop="
                navTo(mRouteConfig.couponList, {
                  merchant_id: fItem.merchant?.id
                })
              "
            >
              领券
            </view>
            <!--     领券end       -->
          </view>
          <!--   商户信息end   -->
          <!--     换购商品start       -->
          <view v-for="xItem in fItem.plusBuyList" :key="xItem.id" class="plus-buy">
            <view class="flex-align-items plus-buy-title mb-sm">
              <rf-tag
                :bg-color="themeColor.color"
                :border-radius="6"
                :text="xItem.title"
                color="#fff"
                scale="0.82"
              />
              <text class="font-sm font-color-dark">
                {{ `已选择 ${xItem.select_num}/${xItem.num} 件` }}
              </text>
            </view>
            <scroll-view class="plus-buy-list" scroll-x="true" @touchmove.stop>
              <view v-for="plusItem in xItem.productBuy" :key="plusItem.id" class="plus-buy-list__item">
                <rf-image :src="plusItem.picture" border-radius="12" width="136" height="136" />
                <view class="flex-1 ml-sm plus-buy-list__item-content">
                  <view class="in1line font-color-dark plus-buy-list__item-content-title">
                    {{ plusItem.name }}
                  </view>
                  <view class="flex-justify-end mt-sm">
                    <view class="flex-1">
                      <view :class="'text-' + themeColor.name">
                        <text class="font-sm-2 font-weight">{{ moneySymbol }}{{ plusItem.plus_buy_discount }}</text>
                        <text class="font-sm pl-sm">换购价</text>
                      </view>
                      <view v-if="plusItem.price" class="line-through font-sm font-color-light">
                        <text class="font-sm">{{ moneySymbol }}{{ plusItem.price }}</text>
                      </view>
                    </view>
                    <rf-icon
                      :color="themeColor.color"
                      class="font-weight-500"
                      name="icongouwuche3"
                      size="36"
                      @rfComponentClick="toggleSpec(plusItem, xItem.id)"
                    />
                  </view>
                </view>
              </view>
            </scroll-view>
          </view>
          <!--     换购商品end       -->
          <!--    商户商品信息start      -->
          <view
            v-for="(sItem, sIndex) in fItem.items"
            :key="sIndex"
            :class="sIndex < fItem.items.length - 1 ? 'b-b-base' : ''"
          >
            <!--     加购start       -->
            <view v-if="sItem?.marketing?.marketing_type" class="marketing-info mt-base flex-between">
              <view class="flex-align-items">
                <rf-tag
                  :bg-color="themeColor.color"
                  :border-radius="6"
                  :text="sItem?.marketing_tag"
                  color="#fff"
                  scale="0.82"
                />
                <text class="font-sm font-color-dark">{{ sItem?.marketing_explain }}</text>
              </view>
              <view
                :class="'text-' + themeColor.name"
                class="flex-align-items"
                @tap="
                  navTo(mRouteConfig.cartShop, {
                    tip: sItem?.marketing_explain,
                    marketingType: sItem?.marketing?.marketing_type,
                    marketingId: sItem?.marketing?.marketing_id
                  })
                "
              >
                <view class="font-sm">
                  凑单
                </view>
                <rf-icon name="iconyou" size="24" />
              </view>
            </view>
            <!--     加购end         -->
            <!--     购物车商品start       -->
            <view v-for="(tItem, tIndex) in sItem.products" :key="tIndex" class="rf-carrier">
              <!-- 删除按钮 -->
              <view
                :class="'bg-' + themeColor.name"
                class="rf-carrier__menu"
                @tap.stop="deleteCartItem(tItem.id, 'one')"
              >
                <rf-icon name="iconiconfontshanchu1" size="60" />
              </view>
              <!-- 商品 -->
              <view
                :class="[
                  state.theIndex === tIndex && state.theMidIndex === sIndex && state.theParentIndex === fIndex
                    ? 'open'
                    : state.oldIndex === tIndex && state.oldParentIndex === fIndex
                      ? 'close'
                      : ''
                ]"
                class="rf-carrier__item flex p-base pr-base"
                @touchend="state.isStop = false"
                @touchmove="touchMove(tIndex, $event)"
                @touchstart="touchStart(fIndex, sIndex, tIndex, $event)"
              >
                <!-- checkbox -->
                <view
                  :class="{ hide: tItem.marketing_id > 0 }"
                  class="mr-base flex-center"
                  @tap="selected(tItem, fIndex, sIndex, tIndex)"
                >
                  <rf-icon
                    :color="tItem.selected ? themeColor.color : '#B3B3B3'"
                    :name="tItem.selected ? 'iconxuanze' : 'iconxuanzekuangmoren'"
                    size="42"
                  />
                </view>
                <!-- 商品信息 -->
                <view class="flex-1 flex">
                  <view class="flex-center mr-base">
                    <rf-image :src="tItem.product_picture" border-radius="12" height="180" width="180" />
                  </view>
                  <view class="product-info">
                    <view
                      class="title in2line"
                      @tap="
                        navToProduct(tItem.product_id, sItem?.marketing.marketing_type, sItem?.marketing.marketing_id)
                      "
                    >
                      <rf-tag
                        v-if="tItem.marketing_id > 0 && tItem.marketing_type === MarketingTypeEnum.PLUS_BUY"
                        scale="0.82"
                        :color="themeColor.color"
                        :bg-color="`rgba(${themeColor.rgb}, 0.08)`"
                        :border-radius="6"
                        text="换购"
                      />{{ tItem.product_name }}
                    </view>
                    <!--    规格选择下拉框                -->
                    <view class="state-wrapper">
                      <view
                        v-if="tItem.sku_name"
                        class="flex-align-items spec font-color-light"
                        style="background-color: #ededed"
                        @tap.stop="toggleSpec(tItem)"
                      >
                        <view class="mr-sm font-sm font-color-base">
                          {{ tItem.sku_name }}
                        </view>
                        <view class="font-color-base arrow-bottom">
                          <rf-icon name="iconxia" size="26" />
                        </view>
                      </view>
                      <view v-if="parseInt(tItem.status, 10) === 0" class="state">
                        已失效
                      </view>
                    </view>
                    <!--     数量选择               -->
                    <view class="price-number">
                      <view v-if="parseInt(tItem.status, 10) === 1" :class="'text-' + themeColor.name" class="font-lg">
                        <text class="font-lg font-weight"><text class="font-sm">{{ moneySymbol }}</text>{{ tItem.price }}</text>
                      </view>
                      <view class="font-color-base font-sm">
                        {{ tItem.remark }}
                      </view>
                      <view v-if="parseInt(tItem.status, 10) === 1" class="number">
                        <view v-if="tItem.marketing_id > 0 && tItem.marketing_type === MarketingTypeEnum.PLUS_BUY" class="text-right font-color-base">
                          x{{ tItem.number }}
                        </view>
                        <template v-else>
                          <view
                            class="sub"
                            @tap.stop="numberChange(tItem.id, Number(tItem.number) - 1, fIndex, sIndex, tIndex)"
                          >
                            <rf-icon
                              class="font-color-light font-weight"
                              :class="Number(tItem.number) <= 1 ? 'font-color-disabled' : 'font-color-base'"
                              name="icon-jianhao"
                              size="26" />
                          </view>
                          <view class="input" @tap.stop="discard">
                            <input
                              v-model="tItem.number"
                              :style="{backgroundColor: '#f2f2f2'}"
                              min="1"
                              type="number"
                              @input="numberChange(tItem.id, $event, fIndex, sIndex, tIndex)"
                            >
                          </view>
                          <view
                            class="add"
                            @tap.stop="numberChange(tItem.id, Number(tItem.number) + 1, fIndex, sIndex, tIndex)"
                          >
                            <rf-icon class="font-color-base font-weight" name="iconjia1" size="26" />
                          </view>
                        </template>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <!--     购物车商品end         -->
          </view>
          <!--    商户商品信息end      -->
        </view>
      </view>
      <!--失效商品-->
      <view v-if="state.cartList.lose_efficacy && state.cartList.lose_efficacy.length > 0" class="expire">
        <view :class="'text-' + themeColor.name" class="flex-between p-base expire-title">
          <view class="font-color-dark font-base">
            失效宝贝{{ state.cartList.lose_efficacy.length || 0 }}件
          </view>
          <view class="btn font-sm-2" @tap="clearCart({ lose_status: 1 })">
            清空失效宝贝
          </view>
        </view>
        <view v-for="(tItem, tIndex) in state.cartList.lose_efficacy" :key="tIndex" class="rf-carrier">
          <!-- 删除按钮 -->
          <view :class="'bg-' + themeColor.name" class="rf-carrier__menu" @tap.stop="deleteCartItem(tItem.id, 'one')">
            <rf-icon name="iconiconfontshanchu1" size="60" />
          </view>
          <!-- 商品 -->
          <view
            :class="[
              state.theIndex === ('lose' + tIndex)
                ? 'open'
                : state.oldIndex === ('lose' + tIndex) ? 'close' : ''
            ]"
            class="rf-carrier__item flex p-base pr-base"
            @touchend="state.isStop = false"
            @touchmove="touchMove('lose' + tIndex, $event)"
            @touchstart="touchStartLose('lose' + tIndex, $event)"
          >
            <view class="mr-sm flex-center expire-txt">
              <text class="font-color-base font-sm">失效</text>
            </view>
            <!-- 商品信息 -->
            <view class="flex-1 flex">
              <view class="flex-shrink mr-base">
                <rf-image :src="tItem.product_picture" border-radius="12" height="180" width="180" />
              </view>
              <view class="product-info">
                <view class="title in2line font-color-light font-base">
                  {{ tItem.product_name }}
                </view>
                <view class="state-wrapper">
                  <view v-if="tItem.sku_name" class="flex-align-items spec font-color-base" style="background-color: #ededed">
                    <view class="mr-sm font-sm">
                      {{ tItem.sku_name }}
                    </view>
                  </view>
                </view>
                <view class="mt-sm line-height-1">
                  <view class="font-color-dark font-base">
                    {{ tItem.remark }}
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 脚部菜单 -->
    <view v-if="state.selectedNum > 0 && hasLogin" class="rf-cart__footer">
      <view class="mr-base" @tap="allSelect">
        <rf-icon
          :color="state.isAllSelected ? themeColor.color : '#B3B3B3'"
          :name="state.isAllSelected ? 'iconxuanze' : 'iconxuanzekuangmoren'"
          size="42"
        />
      </view>
      <view v-if="state.manage" :class="'text-' + themeColor.name" class="del-btn font-sm-2" @tap="deleteCartItem">
        删除
      </view>
      <view v-else class="flex-align-items">
        <view class="in1line mr-base">
          合计:
          <text :class="'text-' + themeColor.name" class="font-lg">
            <text class="font-base">{{ moneySymbol }}</text>{{ priceFilter(state.sumPrice) }}
          </text>
        </view>
        <button :class="'bg-gradual-' + themeColor.name" class="rf-short-btn no-border" @tap="createOrder">
          结算({{ state.selectedNum }})
        </button>
      </view>
    </view>
    <!--推荐商品-->
    <rf-recommend
      v-if="hasLogin && !state.loading && !(state.cartList?.carts?.length === 0 && state.cartList.lose_efficacy?.length === 0)"
      :bottom="bottom ? bottom : 0"
      @cart="initData"
    />
    <!-- 规格-模态层弹窗 -->
    <rf-attr-content
      v-if="state.isAtteContentShow"
      :bottom="bottom ? `${bottom}rpx` : '0'"
      :is-create-order-btn-show="false"
      :product="state.productDetail"
      :show-buy-btn="true"
      @close="state.isAtteContentShow = false"
      @toggle="toggleSpec"
    />
    <!--页面加载动画-->
    <rf-loading :active="state.loading" :is-full-screen="isFullScreen" />
  </view>
</template>
<script lang="ts" setup>
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app';
import mRouteConfig from '@/config/routes';
import { computed, reactive } from 'vue';
import mHelper from '@/utils/helper';
import mConstData from '@/config/constData';
import mRouter from '@/utils/routerUtil';
import memberApi from '@/api/tinyShop/member';
import productApi from '@/api/tinyShop/product';
import marketingApi from '@/api/tinyShop/marketing';
import store from '@/store';
import { PlatformGroupEnum } from '@/enum/loginEnum';
import { MarketingTypeEnum } from '@/enum/marketingEnum';
import { Cart, Products } from '@/response/cart';
import { Product } from '@/response/product';
import { Route } from '@/response/route';

const globalConfig = computed(() => store.getters['user/getGlobalConfig']); // 通用配置
console.log('global', globalConfig.value)
const themeColor = mHelper.getThemeColor();
let hasLogin = computed(() => {
  return store.getters['user/hasLogin'];
});

const isFullScreen = computed(() => {
  return mHelper.isBottomNav('index');
});

onShow(() => {
  // 隐藏原生导航栏 使用自定义底部导航
  state.manage = false;
  initData();
});
onPullDownRefresh(() => {
  state.selectedNum = 0;
  state.isAllSelected = false;
  state.sumPrice = 0;
  getCartItemList('refresh');
});
// 格式化商品总价
const priceFilter = (val) => {
  const price = parseFloat(val);
  let sumPrice = val;
  if (price > 10000 && price < 100000000) {
    sumPrice = `${(price / 10000).toFixed(2)}万`;
  } else if (price > 100000000 && price < 1000000000000) {
    sumPrice = `${(price / 100000000).toFixed(2)}亿`;
  } else if (price > 1000000000000) {
    sumPrice = `${(price / 1000000000000).toFixed(2)}万亿`;
  }
  return sumPrice;
};

// 变量
let state = reactive({
  currentCartId: '',
  isAtteContentShow: false,
  sumPrice: 0,
  initXY: [] as number[],
  selectedNum: 0,
  isAllSelected: false,
  theIndex: -1,
  oldIndex: -1,
  theParentIndex: -1,
  theMidIndex: -1,
  oldParentIndex: -1,
  isStop: false,
  cartList: {} as Cart,
  footerBottom: 0,
  productDetail: {} as Product,
  currentSkuId: '',
  loading: true,
  manage: false
});
// 常量
const customBarHeight = mHelper.getCustomBarHeight();
const moneySymbol = mConstData.moneySymbol;

// 规格弹窗开关
const toggleSpec = (row, pluBuyId = '') => {
  if (parseInt(row.status, 10) === 0) return;
  if (state.isAtteContentShow) {
    if (!hasLogin.value) {
      state.isAtteContentShow = false;
      mHelper.toast('请先登录！');
      return;
    }

    console.log(pluBuyId)

    if (row.type.toString() === '1') {
      // 加入购物车
      handleCartItemCreate(row.skuId, row.cartCount, pluBuyId);
    } else {
      handleCartItemUpdateSku(row.skuId);
    }
  } else if (!state.isAtteContentShow) {
    if (row) getProductBaseDetail(row, pluBuyId);
  }
};
// 添加商品至购物车
const handleCartItemCreate = async (skuId: string, cartCount: number, pluBuyId: string) => {
  try {
    await memberApi.handleCartItemCreate({
      sku_id: skuId,
      number: cartCount,
      marketing_id: Number(pluBuyId),
      marketing_type: Number(pluBuyId) > 0 ? MarketingTypeEnum.PLUS_BUY : ''
    })
    await initCartNum();
    await getCartItemList();
    mHelper.toast('添加购物车成功');
    state.isAtteContentShow = false;
  } catch (e) {
    //
  }
};
// 获取产品详情
const getProductBaseDetail = async (row, pluBuyId: string) => {
  state.currentCartId = row.id;
  const { product_id, sku_name, sku_id, id } = row;
  state.currentSkuId = sku_id;
  try {
    state.productDetail = (await productApi.getProductBaseDetail({
      id: product_id || id
    })) as unknown as Product;
    state.productDetail.sku_name = sku_name;
    if (row.plus_buy_discount) {
      state.productDetail.plus_buy_discount = row.plus_buy_discount;
      state.productDetail.marketing_id = pluBuyId;
    }
    state.isAtteContentShow = true;
  } catch (e) {
    //
  }
};
// 删除选中购物车商品
const deleteCartItem = async (id: AnyObject, type = '') => {
  try {
    let skuIds: AnyObject = [];
    if (type === 'one') {
      skuIds.push(id);
    } else if (type === 'plus_buy') {
      if (id.length === 0) return;
      skuIds = id;
    } else {
      state.cartList.carts.forEach((fItem) => {
        fItem.items.forEach((sItem) => {
          sItem.products.forEach((tItem) => {
            skuIds.push(tItem.id);
          });
        });
      });
    }
    await memberApi.handleCartItemDel({
      ids: JSON.stringify(skuIds || id)
    });
    initData();
  } catch (e) {
    //
  }
};
// 修改购物车商品sku
const handleCartItemUpdateSku = async (skuId: string) => {
  try {
    await memberApi.handleCartItemUpdateSku({
      id: state.currentCartId,
      sku_id: skuId
    });
    state.selectedNum = 0;
    state.isAllSelected = false;
    state.sumPrice = 0;
    state.isAtteContentShow = false;
    await getCartItemList();
  } catch (e) {
    //
  }
};
// 数据初始化
const initData = () => {
  if (hasLogin.value) {
    state.theIndex = -1;
    state.oldIndex = -1;
    state.selectedNum = 0;
    state.isAllSelected = false;
    state.sumPrice = 0;
    getCartItemList();
  } else {
    state.cartList = {} as Cart;
    state.selectedNum = 0;
    state.loading = false;
  }
};
// 跳转对应商品页
const navToProduct = (id, marketingType = '', marketingId = '') => {
  mHelper.navToProduct(id, marketingType, marketingId);
};
// 通用跳转
const navTo = (route: Route, query = {}) => {
  if (!hasLogin.value) {
    mHelper.backToLogin();
  } else {
    mRouter.push({ route, query });
  }
};
// 获取购物车列表
const getCartItemList = async (type = '') => {
  try {
    state.cartList = (await memberApi.getCartItemList()) as unknown as Cart;
    state.loading = false;
    if (type === 'refresh') uni.stopPullDownRefresh();
    const cartsList = store.getters['cart/getCartList'];
    // console.log(cartsList);
    // console.log(state.cartList);

    // 缓存购物车
    let selectedIds = [];
    for (let i = 0; i < cartsList.carts.length; i++) {
      // 营销组别
      for (let j = 0; j < cartsList.carts[i].items.length; j++) {
        // 商品列表
        for (let k = 0; k < cartsList.carts[i].items[j].products.length; k++) {
          if (cartsList.carts[i].items[j].products[k].selected) {
            selectedIds.push((cartsList.carts[i].items[j].products[k].id) as never);
          }
        }
      }
    }

    // 购物车
    let allSelected = true;
    for (let i = 0; i < state.cartList.carts.length; i++) {
      let merchantAllSelected = true;
      // 营销组别
      for (let j = 0; j < state.cartList.carts[i].items.length; j++) {
        // 商品列表
        for (let k = 0; k < state.cartList.carts[i].items[j].products.length; k++) {
          // 换购商品
          if (parseInt(state.cartList.carts[i].items[j]?.products[k].marketing_id) > 0) {
            state.cartList.carts[i].items[j].products[k].selected = true;
          }
          // 判断本地缓存
          if (selectedIds.indexOf((state.cartList.carts[i].items[j].products[k].id) as never) != -1) {
            state.cartList.carts[i].items[j].products[k].selected = true;
          } else {
            merchantAllSelected = false;
            allSelected = false;
          }
        }
      }

      // 商家全选
      if (merchantAllSelected) {
        state.cartList.carts[i].selected = true;
      }
    }

    // 判断全选
    state.isAllSelected = allSelected;

    await initCartNum();
    await sum();
  } catch (e) {
    state.loading = false;
    if (type === 'refresh') {
      uni.stopPullDownRefresh();
    }
  }
};
const initCartNum = async () => {
  try {
    const cartNum = (await memberApi.getCartItemCount()) as AnyObject;
    store.commit('notify/setCartNum', { cartNum });
  } catch (e) {
    //
  }
};
// 获取可换购列表
const getPlusBuyList = async (plusBuyArr) => {
  try {
    for (const item of plusBuyArr) {
      if (item.merchant_id && item.cartIds.length > 0) {
        state.cartList.carts[item.merchantIndex].plusBuyList = (await marketingApi.getPlusBuyIndex({
          cart_ids: item.cartIds.join(),
          merchant_id: item.merchant_id
        })) as unknown as [];
      } else {
        state.cartList.carts[item.merchantIndex].plusBuyList = [];
      }
    }
  } catch (e) {
    //
  }
};
// 清空购物车
const clearCart = (params) => {
  const content = params ? '清空失效商品？' : '清空购物车？';
  uni.showModal({
    content,
    success: async (e) => {
      if (e.confirm) {
        try {
          await memberApi.handleCartItemClear(params);
          await initData();
        } catch (e) {
          //
        }
      }
    }
  });
};
// 控制左滑删除效果
const touchStart = (fIndex: number, sIndex: number, tIndex: number, event) => {
  state.oldParentIndex = -1;
  // 多点触控不触发
  if (event.touches.length > 1) {
    state.isStop = true;
    return;
  }
  state.theParentIndex = fIndex;
  state.oldIndex = state.theIndex;
  state.theMidIndex = sIndex;
  state.theIndex = -1;
  // 初始坐标
  state.initXY = [event.touches[0].pageX, event.touches[0].pageY];
};
const touchStartLose = (fIndex: number, event) => {
  state.oldParentIndex = -1;
  // 多点触控不触发
  if (event.touches.length > 1) {
    state.isStop = true;
    return;
  }

  state.oldIndex = state.theIndex;
  state.theIndex = -1;
  // 初始坐标
  state.initXY = [event.touches[0].pageX, event.touches[0].pageY];
};
const touchMove = (index: number, event) => {
  // 多点触控不触发
  if (event.touches.length > 1) {
    state.isStop = true;
    return;
  }
  let moveX = event.touches[0].pageX - state.initXY[0];
  let moveY = event.touches[0].pageY - state.initXY[1];

  if (state.isStop || Math.abs(moveX) < 5) {
    return;
  }
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
// 选中商品
const selected = (tItem: Products, fIndex: number, sIndex: number, tIndex: number) => {
  state.cartList.carts[fIndex].items[sIndex].products[tIndex].selected =
    !state.cartList.carts[fIndex].items[sIndex].products[tIndex].selected;
  let merchantSelected = true;
  let allSelected = true;
  state.cartList.carts[fIndex].items.forEach((sItem) => {
    sItem.products.forEach((tItem) => {
      if (!tItem.selected) merchantSelected = false;
    });
  });
  state.cartList.carts[fIndex].selected = merchantSelected;
  state.cartList.carts.forEach((fItem) => {
    if (!fItem.selected) allSelected = false;
  });
  state.isAllSelected = allSelected;

  sum();
};
// 选中商户
const selectedMerchant = (fIndex) => {
  state.cartList.carts[fIndex].selected = !state.cartList.carts[fIndex].selected;
  state.cartList.carts[fIndex].items.forEach((sItem) => {
    sItem.products.forEach((tItem) => {
      tItem.selected = state.cartList.carts[fIndex].selected;
    });
  });
  let allSelected = true;
  state.cartList.carts.forEach((fItem) => {
    if (!fItem.selected) allSelected = false;
  });
  state.isAllSelected = allSelected;
  // 统计
  sum();
};
// 全选商品
const allSelect = () => {
  state.isAllSelected = !state.isAllSelected;
  state.cartList.carts.forEach((fItem) => {
    fItem.selected = state.isAllSelected;
    fItem.items.forEach((sItem) => {
      sItem.products.forEach((tItem) => {
        tItem.selected = state.isAllSelected;
      });
    });
  });
  sum();
};
// 控制可输入购物车商品数量
const discard = () => {
  //
};

// 监听购物车商品数量改变
const numberChange = async (id, number, fIndex: number, sIndex: number, tIndex: number) => {
  if (isNaN(number)) number = number.detail.value;
  if (!number) number = 1;
  try {
    await memberApi.handleCartItemUpdateNum({
      id,
      number
    });
    state.cartList.carts[fIndex].items[sIndex].products[tIndex].number = number;
    await sum();
  } catch (e) {
    //
  }
};
// 创建订单
const createOrder = async () => {
  if (state.selectedNum === 0) return;
  const param: AnyObject = [];
  const item: AnyObject = { item: {} };
  let arr: AnyObject = [];
  state.cartList.carts.forEach((fItem) => {
    item['merchant_id'] = fItem.merchant.id;
    item['item']['type'] = 'cart';
    fItem.items.forEach((sItem) => {
      sItem.products.forEach((tItem) => {
        if (tItem.selected) arr.push(tItem.id);
      });
    });
    item['item']['data'] = arr;
    if (item['item']['data'].length > 0) {
      param.push(JSON.stringify(item));
    }
    arr = [];
  });
  for (let i = 0; i < param.length; i++) {
    param[i] = JSON.parse(param[i]);
  }
  state.selectedNum = 0;
  state.isAllSelected = false;
  state.sumPrice = 0;
  navTo(mRouteConfig.createOrder, { data: JSON.stringify(param) });
};
// 合计
const sum = async () => {
  let plusBuyArr: AnyObject[] = [];
  state.sumPrice = 0;
  state.selectedNum = 0;
  state.cartList.carts.forEach((fItem, fIndex) => {
    let plusBuyItem: AnyObject = { merchant_id: '', cartIds: [] };
    fItem.items.forEach((sItem) => {
      sItem.products.forEach((tItem) => {
        if (tItem.selected) {
          // 已加入购物车的超值换购不判断
          if (tItem.marketing_type !== MarketingTypeEnum.PLUS_BUY) {
            plusBuyItem.merchant_id = tItem.merchant_id;
            plusBuyItem.cartIds.push(tItem.id);
          }

          state.sumPrice += Number(tItem.price) * Number(tItem.number);
          state.sumPrice = Number(state.sumPrice.toFixed(2));
          state.selectedNum++;
        }
      });
    });
    plusBuyItem.merchantIndex = fIndex;
    plusBuyArr.push(plusBuyItem);
  });
  await getPlusBuyList(plusBuyArr);
  if (isNaN(state.sumPrice)) state.sumPrice = 0;
  state.sumPrice = Number(state.sumPrice.toFixed(2));
  store.commit('cart/setCartList', { cartList: state.cartList });
  // 判断是否删除超值换购商品
  deletePlusBuy();
};

// 删除不符合要求的超值换购商品
const deletePlusBuy = async () => {
  let skuIdArr: AnyObject = [];
  state.cartList.carts.forEach((fItem) => {
    // 换购商品枚举
    const plusBuyArr: AnyObject = [];
    if (fItem?.plusBuyList?.length > 0) {
      fItem.plusBuyList.forEach((item) => {
        item.productBuy.forEach((pItem) => {
          plusBuyArr.push(`${item.id}-${pItem.id}`);
        });
      });
    }

    fItem.items.forEach((sItem) => {
      sItem.products.forEach((tItem) => {
        let productBuyKey = `${tItem.marketing_id}-${tItem.product_id}`;
        if (
            Number(tItem.marketing_id) > 0 &&
            tItem.marketing_type === MarketingTypeEnum.PLUS_BUY &&
            plusBuyArr.indexOf(productBuyKey) === -1
        ) {
          skuIdArr.push(tItem.id);
        }
      });
    });
  });

  deleteCartItem(skuIdArr, 'plus_buy');
};

const bottom = computed(() => {
  let sysInfo: AnyObject = uni.getSystemInfoSync();
  return (sysInfo?.safeAreaInsets?.bottom / 2 || 0) + 90;
});
</script>
<style lang="scss">
.rf-cart {
  background-color: $page-color-base;
  min-height: 100vh;

  .expire {
    width: 94%;
    margin: 0 auto;
    background-color: #FFFFFF;
    border-radius: 8rpx;
    &-title {
      width: 100%;
      text-align: left;
    }
    &-txt {
    }
  }

  .header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10rpx 32rpx;

    &__btn {
      font-size: 28rpx;
    }
  }

  &__empty {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: calc(100vh - 100rpx);
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  &__product {
    width: 100%;
    padding-bottom: 16rpx;

    &__item {
      background-color: $color-white;
      margin: 0 $spacing-base $spacing-base;
      border-radius: 10rpx;

      .plus-buy {
        padding-left: 10rpx;

        .plus-buy-title {
          padding-left: 65rpx;
        }

        .plus-buy-list {
          padding-left: 52rpx;
          padding-right: 20rpx;
          width: 100%;
          white-space: nowrap;
          height: 170rpx;
          background-color: #fff;
          border-bottom: 1rpx solid #eee;

          &__item {
            margin-top: 5rpx;
            width: 400rpx;
            height: 136rpx;
            margin-right: $spacing-base;
            border-radius: 12rpx;
            display: inline-flex;
            box-shadow: 0 5rpx 10rpx rgba(0, 0, 0, 0.1);
            margin-left: 20rpx;
          }
          &__item-content {
            padding: $spacing-sm $spacing-base $spacing-sm 5rpx;
            box-sizing: border-box;
          }
          &__item-content-title {
            width: 230rpx;
          }
        }
      }

      .merchant-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $spacing-base 20rpx;
        margin-top: 20rpx;
      }

      .marketing-info {
        margin-left: 62rpx;
        padding: 6rpx 12rpx;
      }
    }
  }

  &__footer {
    width: 100%;
    background-color: $color-white;
    padding: 0 $spacing-base;
    height: 110rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    position: fixed;
    bottom: 90rpx;
    z-index: 5;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    margin-bottom: calc(env(safe-area-inset-bottom) / 2);

    .del-btn {
      border: solid 1rpx;
      padding: 0 32rpx;
      height: 50rpx;
      line-height: 50rpx;
      border-radius: 24rpx;
    }

    .rf-short-btn {
      border-radius: 50rpx;
      padding: 0 40rpx;
      font-size: $font-base;
    }
  }

  .rf-carrier {
    border-bottom: none;
    height: 228rpx;

    .product-info {
      width: 100%;
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      position: relative;

      .title {
        width: 100%;
        font-size: $font-base;
        line-height: 36rpx;
        height: 72rpx;
      }

      .price-number {
        width: 100%;
        bottom: 0rpx;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        font-size: 28rpx;

        .number {
          display: flex;
          justify-content: center;
          border-radius: 24rpx;
          height: 48rpx;

          &.noborder {
            border: none;
          }

          .input {
            width: 72rpx;
            box-sizing: content-box;

            input {
              width: 100%;
              height: 48rpx;
              display: flex;
              justify-content: center;
              align-items: center;
              text-align: center;
              font-size: $font-lg;
              color: $font-color-dark;
              font-weight: 500;
              border-radius: 4rpx;
            }
          }

          .sub,
          .add {
            width: 54rpx;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }

      .state-wrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .arrow-bottom {
          padding-top: 6rpx
        }

        .state {
          background-color: $font-color-light;
          color: $color-white;
          padding: 6rpx 24rpx;
          font-size: $font-sm;
          border-radius: 6rpx;
        }

        .spec {
          background-color: $page-color-light;
          height: 40rpx;
          font-size: $font-sm;
          padding: 0 12rpx;
          border-radius: 6rpx;
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
