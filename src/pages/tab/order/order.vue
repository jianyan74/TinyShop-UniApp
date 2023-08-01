<template>
  <view class="rf-order">
    <view class="rf-order__header">
      <rf-navbar :border="false" :status-bar="true" nav-type="search" search-type="current" search-placeholder="请输入订单号" @to-search="searchByKeyWords" />
      <!--导航栏-->
      <view class="navbar">
        <view
          v-for="(item, index) in navList"
          :key="index"
          class="nav-item"
          :class="
            state.tabCurrentIndex === index
              ? 'current text-' + themeColor.name
              : ''
          "
          @tap="tabClick(index)"
        >
          {{ item.text }}
        </view>
      </view>
    </view>
    <!--订单列表-->
    <swiper
      v-if="state.orderList.length > 0"
      class="rf-order__swiper"
      @change="changeTab"
    >
      <swiper-item
        v-for="tabItem in navList"
        :key="tabItem.text"
        class="tab-content"
      >
        <scroll-view
          class="list-scroll-content"
          scroll-y
          @scrolltolower="getMoreOrderList"
        >
          <view
            v-for="(item, index) in state.orderList"
            :key="index"
            class="rf-order-item"
          >
            <view class="i-top">
              <view
                v-if="item.merchant"
                class="merchant"
                @tap.stop="
                  navTo(mRouteConfig.merchant, { id: item.merchant?.id })
                "
              >
                <rf-image
                  border-radius="50%"
                  height="42"
                  width="42"
                  class="merchant-logo"
                  :src="item.merchant?.cover"
                />
                <text class="title">{{ item.merchant?.title }}</text>
                <rf-icon name="iconyou" size="28" padding-top="3" />
              </view>
              <text v-else class="in1line">订单号：{{ item.order_sn }}</text>
              <text
                v-if="Number(item.order_status) !== 0"
                class="state"
                :class="'text-' + themeColor.name"
              >{{ orderStatusFilter(item.order_status) }}</text
              >
              <view v-else class="example-body">
                <rf-count-down
                  lr-padding="8rpx"
                  :show-day="false"
                  :second="second(item.close_time)"
                  color="#FFFFFF"
                  :background-color="themeColor.color"
                  :border-color="themeColor.color"
                  @timeup="timeUp(item.id)"
                />
              </view>
            </view>
            <view
              v-for="(goodsItem, goodsIndex) in item.product"
              :key="goodsIndex"
              class="goods-box-single"
              @tap.stop="navTo(mRouteConfig.orderDetail, { id: item.id })"
            >
              <rf-image
                width="180"
                height="180"
                border-radius="12"
                class="goods-img"
                :src="goodsItem.product_picture"
              />
              <view class="info">
                <view class="detail">
                  <view class="mid">
                    <text class="title in2line">{{
                      goodsItem.product_name
                    }}</text>
                    <view v-if="goodsItem.sku_name" class="mt-sm">
                      <text class="font-color-light font-sm-2">{{
                        goodsItem.sku_name
                      }}</text>
                    </view>
                  </view>
                  <view class="right">
                    <view class="price">
                      <text v-if="goodsItem.point_exchange_type === '2'">
                        <text class="point"
                        >{{ goodsItem.product_money }} + {{ item.point }}积分
                        </text>
                      </text>
                      <text v-else-if="goodsItem.point_exchange_type === '4'">
                        <text class="point">{{ item.point }}积分 </text>
                      </text>
                      <text v-else class="price">
                        <text>
                          <text class="font-sm">{{ moneySymbol }}</text>{{ goodsItem.price }}
                        </text>
                      </text>
                    </view>
                    <view class="num">
                      x{{ goodsItem.num }}
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="price-box">
              <view v-if="Number(item.final_money) > 0" class="total">
                待付尾款
                <text class="price"><text class="font-sm">{{ moneySymbol }}</text>{{ item.final_money }}</text>
              </view>
              <view v-else class="total">
                总价
                <text class="price"><text class="font-sm">{{ moneySymbol }}</text>{{ item.product_original_money }}</text>
              </view>
              <view class="amount">
                <text
                  class="price font-weight-500"
                  :class="'text-' + themeColor.name"
                ><text class="font-sm">{{ moneySymbol }}</text>{{ item.pay_money }}
                  <text v-if="Number(item.point) > 0">+ {{ item.point }}积分</text>
                </text
                >
              </view>
            </view>
            <view class="action-box">
              <button
                v-if="item.order_status === OrderStatusEnum.PENDING_PAYMENT"
                class="action-btn bg-white no-border"
                :class="'text-' + themeColor.name"
                @tap="handleOrderOperation(item.id, 'close')"
              >
                取消订单
              </button>
              <button
                v-if="
                  (item.order_status === OrderStatusEnum.SENT ||
                    item.order_status === OrderStatusEnum.RECEIVED ||
                    item.order_status === OrderStatusEnum.COMPLETED) &&
                    !mHelper.isVirtualProduct(item.product_type)
                "
                class="action-btn bg-white no-border"
                :class="'text-' + themeColor.name"
                @tap="handleOrderOperation(item.id, 'shipping')"
              >
                查看物流
              </button>
              <button
                v-if="item.order_status === OrderStatusEnum.CLOSE"
                class="action-btn bg-white no-border"
                :class="'text-' + themeColor.name"
                @tap="handleOrderOperation(item.id, 'delete')"
              >
                删除订单
              </button>
              <button
                v-if="item.order_status !== OrderStatusEnum.PENDING_PAYMENT && item.order_type === '1'"
                class="action-btn no-border"
                :class="'bg-gradual-' + themeColor.name"
                @tap="handleCreateOrderAgain(item.id, item.merchant_id)"
              >
                再次购买
              </button>
              <button
                class="action-btn no-border"
                :class="'bg-gradual-' + themeColor.name"
                @tap="handleOrderOperation(item.id, 'detail')"
              >
                订单详情
              </button>
              <!--              <button-->
              <!--                class="action-btn no-border"-->
              <!--                :class="'bg-gradual-' + themeColor.name"-->
              <!--                v-if="-->
              <!--                  item.order_status === OrderStatusEnum.PENDING_PAYMENT ||-->
              <!--                  item.order_status === OrderStatusEnum.BALANCE_TO_BE_PAID-->
              <!--                "-->
              <!--                @tap="navTo(mRouteConfig.friendPay, { id: item.id })"-->
              <!--              >-->
              <!--                好友代付-->
              <!--              </button>-->
              <button
                v-if="item.order_status === OrderStatusEnum.PENDING_PAYMENT"
                class="action-btn no-border"
                :class="'bg-gradual-' + themeColor.name"
                @tap="navTo(mRouteConfig.pay, { order_id: item.id, type: 'order' })"
              >
                立即支付
              </button>
              <button
                v-if="item.order_status === OrderStatusEnum.BALANCE_TO_BE_PAID"
                class="action-btn no-border"
                :class="'bg-gradual-' + themeColor.name"
                @tap="
                  navTo(mRouteConfig.pay, {
                    order_id: item.id,
                    pay_status: 'presell',
                  })
                "
              >
                支付尾款
              </button>
              <button
                v-if="
                  (item.order_status === OrderStatusEnum.RECEIVED ||
                    item.order_status === OrderStatusEnum.COMPLETED) &&
                    !Number(item.is_evaluate)
                "
                class="action-btn no-border"
                :class="'bg-gradual-' + themeColor.name"
                @tap="handleOrderOperation(item.id, 'evaluation')"
              >
                评价一下
              </button>
              <button
                v-if="item.order_status === OrderStatusEnum.SENT"
                class="action-btn no-border"
                :class="'bg-gradual-' + themeColor.name"
                @tap="handleOrderOperation(item.id, 'delivery')"
              >
                确认收货
              </button>
            </view>
          </view>
          <rf-load-more
            v-if="state.orderList.length > 0"
            :status="state.loadingType"
          />
        </scroll-view>
      </swiper-item>
    </swiper>
    <view
      v-if="state.orderList.length === 0 && !state.loading"
      class="rf-order__empty"
    >
      <rf-empty info="暂无订单" />
    </view>
    <rf-loading :is-full-screen="mHelper.isBottomNav('order')" :active="state.loading" />
  </view>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, } from "vue";
import {
  onHide,
  onLoad,
  onPullDownRefresh,
  onReachBottom,
} from "@dcloudio/uni-app";
import mConstData from "@/config/constData";
import mHelper from "@/utils/helper";
import mRouter from "@/utils/routerUtil";
import mRouteConfig from "@/config/routes";
import store from "@/store";
import memberApi from "@/api/tinyShop/member";

import { Route, } from "@/response/route";
import { PlatformGroupEnum, } from "@/enum/loginEnum";
import { OrderStatusEnum, } from "@/enum/orderEnum";
import { OrderList, } from "@/response/order";

// 常量
const themeColor = mHelper.getThemeColor(); // 主题颜色
const navList = mConstData.orderNavList;
const moneySymbol = mConstData.moneySymbol;

// 变量
let state = reactive({
  keyword: "",
  tabCurrentIndex: -1,
  loadingType: "more",
  merchantId: "",
  page: 1,
  width: 0,
  orderList: [] as OrderList[],
  loading: true,
  isRefreshing: true,
  source: "",
});
onMounted(() => {
  let obj: AnyObject = {};
  if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMINI)
    obj = wx.getMenuButtonBoundingClientRect();
  uni.getSystemInfo({
    success: (res) => {
      state.width = obj.left || res.windowWidth;
    },
  });
});

// 登录状态
let hasLogin = computed(() => {
  return store.getters["user/hasLogin"];
});
// 计算倒计时时间
const second = computed(() => {
  return function (val) {
    const date = new Date();
    return Math.floor(val - Number(date) / 1000);
  };
});
// 状态显示格式化
const orderStatusFilter = (status: string) => {
  let statusText;
  switch (status) {
    case OrderStatusEnum.PENDING_PAYMENT:
      statusText = "待付款";
      break;
    case OrderStatusEnum.DELIVERED:
      statusText = "待发货";
      break;
    case OrderStatusEnum.SENT:
      statusText = "已发货";
      break;
    case OrderStatusEnum.RECEIVED:
      statusText = "已收货";
      break;
    case OrderStatusEnum.COMPLETED:
      statusText = "已完成";
      break;
    case OrderStatusEnum.RETURN_APPLY:
      statusText = "退货申请";
      break;
    case OrderStatusEnum.REFUNDING:
      statusText = "退款中";
      break;
    case OrderStatusEnum.REFUND_COMPLETE:
      statusText = "退款完成";
      break;
    case OrderStatusEnum.CLOSE:
      statusText = "已关闭";
      break;
    case OrderStatusEnum.APPLICATION_CANCELED:
      statusText = "撤销申请";
      break;
    case OrderStatusEnum.FORMED:
      statusText = "待成团";
      break;
    case OrderStatusEnum.IN_STOCK:
      statusText = "备货中";
      break;
    case OrderStatusEnum.BALANCE_TO_BE_PAID:
      statusText = "待付尾款";
      break;
    case OrderStatusEnum.TAKE_ORDER:
      statusText = "待骑手接单";
      break;
    case OrderStatusEnum.PENDING_DELIVERY:
      statusText = "待配送";
      break;
    default:
      statusText = "已完成";
  }
  return statusText;
};
onLoad((options: any) => {
  state.merchantId = options.merchant_id || "";
  state.source = options.source || "";
  state.tabCurrentIndex = Number(options.state || "-1") + 1;
  initData();
});
// 下拉刷新
onPullDownRefresh(() => {
  initData("refresh");
});
// 加载更多
onReachBottom(() => {
  if (state.loadingType === "noMore" || state.orderList.length === 0) return;
  state.page++;
  getOrderList();
});
// 返回上一页
const navBack = () => {
  mHelper.back();
};
// 倒计时关闭订单
const timeUp = (id: string) => {
  if (state.isRefreshing) {
    state.isRefreshing = false;
    handleOrderClose(id);
  }
};
// 通用跳转
const navTo = (route: Route, query: AnyObject = {}) => {
  if (state.source === "service" && route === mRouteConfig.orderDetail) {
    mHelper.prePage().orderId = query.id;
    mRouter.back();
  } else {
    mRouter.push({ route, query, });
  }
};
// 订单操作
const handleOrderOperation = (id: string, type: string) => {
  switch (type) {
    case "detail": // 订单详情
      navTo(mRouteConfig.orderDetail, { id, });
      break;
    case "evaluation": // 我要评价
      navTo(mRouteConfig.evaluation, { order_id: id, });
      break;
    case "close": // 取消订单
      handleOrderClose(id);
      break;
    case "delete": // 删除订单
      handleOrderDelete(id);
      break;
    case "shipping": // 查看物流
      navTo(mRouteConfig.shipping, { id, });
      break;
    case "delivery": // 确认收货
      handleOrderTakeDelivery(id);
      break;
  }
};
// 再次购买
const handleCreateOrderAgain = (buy_again_id: string, merchant_id: string) => {
  const param = [
    {
      item: {
        type: "buy_again",
        data: { buy_again_id, },
      },
      merchant_id,
    },
  ];
  navTo(mRouteConfig.createOrder, { data: JSON.stringify(param), });
};
// 关闭订单
const handleOrderClose = async (id: string) => {
  try {
    await memberApi.handleOrderClose({ id, });
    state.isRefreshing = true;
    mHelper.toast("订单取消成功");
    setTimeout(() => {
      initData();
    }, 500);
  } catch (e) {
    //
  }
};
// 删除已关闭订单
const handleOrderDelete = async (id: string) => {
  try {
    await memberApi.handleOrderDelete({}, `?id=${id}`);
    mHelper.toast("订单删除成功");
    setTimeout(() => {
      initData();
    }, 500);
  } catch (e) {
    //
  }
};
// 确认收货
const handleOrderTakeDelivery = async (id: string) => {
  try {
    await memberApi.getOrderTakeDelivery({ id, });
    uni.showModal({
      content: "确认收货成功, 是否立即去评价?",
      success: (confirmRes) => {
        initData();
        if (confirmRes.confirm) {
          navTo(mRouteConfig.evaluation, { order_id: id, });
        }
      },
    });
  } catch (e) {
    //
  }
};

//搜索
const searchByKeyWords = (e:any) => {
  state.keyword = e.value;
  initData();
}

// 数据初始化
const initData = async (type = "") => {
  if (hasLogin.value) {
    state.loading = true;
    state.page = 1;
    state.orderList.length = 0;
    await getOrderList(type);
  } else {
    state.loading = false;
    uni.showModal({
      content: "目前暂未登录，是否跳转登录页面？",
      success: (confirmRes) => {
        if (confirmRes.confirm) {
          mHelper.backToLogin();
        }
      },
    });
  }
};
// 获取订单列表
const getOrderList = async (type = "") => {
  let navItem = navList[state.tabCurrentIndex];
  const params: AnyObject = {};
  if (navItem?.state !== undefined) params.synthesize_status = navItem.state;
  if (state.keyword) params.keyword = state.keyword;
  if (state.merchantId) params.merchant_id = state.merchantId;
  params.page = state.page;
  try {
    const data = (await memberApi.getOrderList(
      params
    )) as unknown as OrderList[];
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
    state.loadingType = data.length < 10 ? "noMore" : "more";
    state.orderList = [...state.orderList, ...data,];
    state.loading = false;
  } catch (e) {
    //
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
  }
};
// 监听swiper切换
const changeTab = (e) => {
  state.tabCurrentIndex = Number(e.detail.current);
  initData();
};
// 顶部tab点击
const tabClick = (index: number) => {
  state.tabCurrentIndex = index;
  initData();
};
// 顶部tab点击
const getMoreOrderList = () => {
  if (state.loadingType === "noMore" || state.orderList.length === 0) return;
  state.page++;
  getOrderList();
};
</script>
<style lang="scss">
.rf-order {
  height: 100%;
  background: $page-color-base;
  position: absolute;
  width: 100%;
  margin-bottom: 48rpx;
  &__header {
    //padding-top: calc(var(--status-bar-height) + 20rpx);
    width: 100%;
    position: fixed;
    top: 0;
    background: $color-white;
    z-index: 100;
  }
  &__input-box {
    background-color: $color-white;
    position: relative;
    display: flex;
    align-items: center;
    padding: 20rpx 20rpx 0;
    margin-bottom: $spacing-sm;
    .back {
      font-size: 40rpx;
      margin-right: $spacing-sm;
      font-weight: 500;
    }
    .search-icon {
      z-index: 999;
      position: absolute;
      top: 32rpx;
      right: 40rpx;
      color: #c0c0c0;
    }
    .input {
      width: 100%;
      height: 60rpx;
      background-color: #f5f5f5;
      padding-left: 20rpx;
      border-radius: 30rpx;
      font-size: 28rpx;
    }
  }
  &__swiper {
    height: calc(100vh - var(--status-bar-height) - 20rpx);
    margin-top: calc(var(--status-bar-height) + 188rpx);
    .list-scroll-content {
      height: 100%;
    }
  }
  &__empty {
    margin-top: calc(var(--status-bar-height) + 188rpx);
  }
}
</style>
