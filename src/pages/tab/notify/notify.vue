<template>
  <view class="rf-notify pb-safe">
    <rf-custom :is-back="false">
      <template #content>
        <view class="font-weight font-color-dark font-base-2">
          消息
        </view>
      </template>
    </rf-custom>
    <view
      v-if="
        state.notifyList.length > 0 || (bubbleList.length > 0 && hasLogin) || state.notifyNewest?.newest?.notify?.title
      "
      class="rf-notify__list"
      :style="{ paddingTop: customBarHeight + 10 + 'px' }"
    >
      <!-- 服务通知 -->
      <view
        v-for="(item, index) in state.notifyList"
        :key="index"
        class="row b-b-light"
        @tap="
          navToNormal(
            item?.notify?.target_id,
            item?.notify?.target_type,
            item?.notify?.id,
            item?.is_read,
          )
        "
      >
        <!-- 删除按钮 -->
        <view
          class="menu"
          :class="'bg-' + themeColor.name"
          @tap.stop="handleClearNotify(item.notify_id, item.merchant_id)"
        >
          <rf-icon size="60" name="iconiconfontshanchu1" />
        </view>
        <!-- 消息 -->
        <view
          class="carrier"
          :class="[state.theIndex === index ? 'open' : state.oldIndex === index ? 'close' : '']"
          @touchstart="touchStart(index, $event)"
          @touchmove="touchMove(index, $event)"
          @touchend="touchEnd()"
        >
          <view class="notify-wrapper">
            <view v-if="state.currentNotifyTabIndex === 0" class="mr-base">
              <rf-image
                width="80"
                height="80"
                border-radius="50%"
                :src="logo"
              />
            </view>
            <view v-else class="icon-wrap mr-base flex-center" :class="'bg-' + themeColor.name">
              <rf-icon size="43" name="iconxiaoxi9" />
            </view>
            <view class="info">
              <view class="title">
                <view class="title-text flex-align-items">
                  {{ item.notify?.title }}
                  <view v-if="!item.merchant_id && state.currentNotifyTabIndex === 0" class="scale-8 ml-sm">
                    <rf-tag
                      color="#fff"
                      :bg-color="`rgba(${themeColor.rgb}, 0.9)`"
                      :border-radius="6"
                      text="官方"
                    />
                  </view>
                </view>
                <view class="time">
                  {{ timeFormat(item.created_at) }}
                </view>
              </view>
              <view class="content in1line font-color-light">
                {{item.notify?.content }}
              </view>
              <view
                v-if="state.currentNotifyTabIndex === 0 && item.receiver_num > 0"
                class="un-read-num un-read-num-notify"
                :class="'bg-' + themeColor.name"
              >
                {{ item.receiver_num }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <rf-load-more
        v-if="state.currentNotifyTabIndex === 0 ? bubbleList.length > 0 : state.notifyList.length > 0"
        :status="state.loadingType"
      />
    </view>
    <!-- 悬浮按钮   -->
    <view v-if="hasLogin" class="rf-notify__clear-all bg-white">
      <rf-icon class="clear-icon" size="44" color="#b3b3b3" name="iconxiaoxi_qingkong" @rfComponentClick="handleClearAll" />
    </view>
    <view v-if="hasLogin" class="rf-notify__read-all bg-white">
      <rf-icon class="clear-icon" size="44" color="#b3b3b3" name="iconxiaoxi_quanbuyidu" @rfComponentClick="handleReadAll" />
    </view>
    <!--消息为空-->
    <view class="rf-notify__not-data">
      <rf-empty
        v-if="
          state.notifyList.length === 0 &&
            !state.loading &&
            hasLogin &&
            !state.notifyNewest?.newest?.notify?.title
        "
        :bottom="bottom"
        :info="`您还没有服务通知`"
      />
    </view>
    <view v-if="!hasLogin" class="rf-notify__empty">
      <rf-icon class="mb-base" name="iconxiaoxi-" size="120" :color="themeColor.color" />
      <view class="empty-tips">
        <text class="font-color-base">暂未登录</text>
        <view class="navigator" :class="'text-' + themeColor.name" @tap="navTo(mRouteConfig.login)">
          登录/注册 >
        </view>
      </view>
    </view>
    <!--页面加载动画-->
    <rf-loading :is-full-screen="mHelper.isBottomNav('notify')" :active="state.loading" />
  </view>
</template>
<script lang="ts" setup>
import { formatToDateTime } from '@/utils/dateUtil';
import { onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app';
import { computed, reactive } from 'vue';
import mHelper from '@/utils/helper';
import mRouteConfig from '@/config/routes'; // 路由管理
import mRouter from '@/utils/routerUtil';
import memberApi from '@/api/tinyShop/member';
import store from '@/store';
import mAssetsPath from '@/config/assets';

import { NotifyData, NotifyItem, NotifyNewest, ReadCount } from '@/response/notify';
import { Route } from '@/response/route';
import { PlatformGroupEnum } from '@/enum/loginEnum';
import { ServiceSendTypeEnum } from '@/enum/serviceEnum';
import commonApi from '@/api/tinyShop/common';

// 变量
let state = reactive({
  loading: true,
  unReadCount: {} as ReadCount,
  notifyList: [] as NotifyItem[],
  notifyData: {} as NotifyData,
  notifyNewest: {} as NotifyNewest,
  loadingType: 'more',
  page: 1,
  theIndex: -1,
  oldIndex: -1,
  isStop: false,
  initXY: [] as number[],
  currentNotifyTabIndex: 0
});

// 常量
const themeColor = mHelper.getThemeColor();
const logo = mAssetsPath.logo;
const globalConfig = commonApi.getGlobalConfig();
const customBarHeight = mHelper.getCustomBarHeight();

// 购买栏底部距离
const bottom = computed(() => {
  return mHelper.platformGroupFilter('h5') === PlatformGroupEnum.TINYSHOP ? 90 : 0;
});
// 聊天消息
let bubbleList = computed(() => store.getters['im/getBubbleList']);

onShow(async () => {
  if (!hasLogin.value) {
    state.loading = false;
    return;
  }
  // 初始化数据
  await initData();
});
// 下拉刷新
onPullDownRefresh(() => {
  state.page = 1;
  state.notifyList = [];
  state.loading = true;
  getNotifyList('refresh');
});
// 加载更多
onReachBottom(() => {
  if (state.loadingType === 'noMore') return;
  state.page++;
  getNotifyList();
});

// 是否登录
let hasLogin = computed(() => {
  return store.getters['user/hasLogin'];
});

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
const touchEnd = () => {
  // 结束禁止触发效果
  state.isStop = false;
};
// 数据初始化
const initData = async () => {
  state.page = 1;
  state.loading = true;
  state.notifyList = [];
  state.oldIndex = -1;
  state.theIndex = -1;
  await getNotifyList().then(() => {
    initNotifyNum();
    getNotifyNewest();
  });
};
// 获取消息列表
const getNotifyList = async (type = '') => {
  if (!hasLogin.value) {
    state.loading = false;
    if (type === 'refresh') uni.stopPullDownRefresh();
    return;
  }
  try {
    const data = (await memberApi.getNotifyList({
      page: state.page
    })) as unknown as NotifyData;
    state.notifyData = data;
    state.loading = false;
    if (type === 'refresh') {
      uni.stopPullDownRefresh();
    }
    state.loadingType = data.list.length < 10 ? 'noMore' : 'more';
    state.notifyList = [...state.notifyList, ...data.list];
  } catch (e) {
    if (type === 'refresh') {
      uni.stopPullDownRefresh();
    }
    state.loading = false;
  }
};
// 时间格式化
const timeFormat = (time: string) => {
  const fmt =
      String(new Date().getFullYear()) === formatToDateTime(parseInt(time) * 1000, 'YYYY')
          ? 'MM/DD HH:mm:ss'
          : 'YYYY/MM/DD HH:mm:ss';
  return formatToDateTime(parseInt(time) * 1000, fmt);
};

// 删除清空消息
const handleClearAll = async () => {
  uni.showModal({
    content: '是否清空消息列表，清空将无法找回',
    success: async (e) => {
      if (e.confirm) {
        try {
          await memberApi.getNotifyClearAll();
          if (mHelper.platformGroupFilter('app') === PlatformGroupEnum.TINYSHOPAPP) clearBadge();
          await initData();
        } catch (e) {
          //
          console.log('handleClearAll: err', e)
        }
      }
    }
  });
};

// 已读消息
const handleReadAll = () => {
  uni.showModal({
    content: '是否一键已读全部消息？',
    success: async (e) => {
      if (e.confirm) {
        try {
          //判断是不是首页 如果是首页 调用ws已读 不是首页调用接口已读
          await memberApi.getNotifyReadAll();
          //如果是app 清除角标
          if (mHelper.platformGroupFilter('app') === PlatformGroupEnum.TINYSHOPAPP) clearBadge();
          // 初始化页面数据
          await initData();
        } catch (e) {
          //
          console.log('handleReadAll: err', e)
        }
      }
    }
  })
};
// 设置未读消息个数
const initNotifyNum = async () => {
  try {
    state.unReadCount = (await memberApi.getNotifyUnReadCount()) as unknown as ReadCount;
    store.commit('notify/setNotifyNum', { notifyNum: state.unReadCount.count });
    if (mHelper.platformGroupFilter('app') === PlatformGroupEnum.TINYSHOPAPP && state.unReadCount.count === 0)
      clearBadge();
  } catch (e) {
    //
  }
};
// 最新一条未读消息
const getNotifyNewest = async () => {
  try {
    state.notifyNewest = (await memberApi.getNotifyNewest()) as unknown as NotifyNewest;
    state.loading = false;
  } catch (e) {
    //
  }
};
// app清除消息角标
const clearBadge = () => {
  if (mHelper.platformGroupFilter() === 'tinyShopIos') {
    // 设置应用图标的数量
    plus.runtime.setBadgeNumber(0);
    // 导入个推原生类
    const GeTuiSdk = plus.ios.importClass('GeTuiSdk');
    GeTuiSdk.setBadge(0);
  }
};
// 通用跳转
const navToNormal = async (
    id: string,
    type: string,
    notifyId: string,
    isRead: string,
) => {
    let route;
    if (!Number(isRead)) {
      try {
        await memberApi.getNotifyRead({ notify_id: notifyId });
        await initData();
      } catch (e) {
        //
      }
    }
    let query = {};
    switch (type) {
      case 'order_consign':
      case 'order_stock_up_accomplish':
      case 'order_return_money':
      case 'order_bargain_accomplish':
        route = mRouteConfig.orderDetail;
        query = { id };
        break;
      case 'order_wholesale_open':
      case 'order_wholesale_join':
      case 'order_wholesale_accomplish':
      case 'order_wholesale_close':
        route = mRouteConfig.wholesaleDetail;
        query = { id };
        break;
      case 'order_bargain_close':
      case 'order_bargain_friend_join':
        route = mRouteConfig.bargainDetail;
        query = { id };
        break;
      case 'coupon_give':
        route = mRouteConfig.coupon;
        query = { type: '1' };
        break;
      case 'order_virtual':
      case 'order_virtual_card':
      case 'order_virtual_network_disk':
      case 'order_virtual_download':
        route = mRouteConfig.virtualDetail;
        query = { id };
        break;
      default:
        route = mRouteConfig.index;
        break;
    }
    if (route) navTo(route, query);
};
// 通用跳转
const navTo = (route: Route, query = {}) => {
  if (!hasLogin.value) {
    mHelper.backToLogin();
  } else {
    mRouter.push({ route, query });
  }
};
const handleClearNotify = async (id: string) => {
  try {
    await memberApi.getNotifyClear({ notify_ids: id });
    await initData();
  } catch (e) {
    //
  }
};
</script>
<style lang="scss">
page {
  background-color: $page-color-base;
}
.rf-notify {
  background-color: $page-color-base;
  min-height: 100vh;

  &__tab {
    display: flex;
    background-color: $color-white;
    margin: $spacing-base;
    padding: $spacing-lg;
    .tab-item {
      text-align: center;
      width: 316rpx;
      .iconfont {
        width: 80rpx;
        height: 80rpx;
        font-size: 40rpx;
        display: inline-block;
        line-height: 80rpx;
        text-align: center;
        border-radius: 50%;
      }
      .normal {
        opacity: 0.5;
      }
      .tit {
        margin-top: $spacing-sm;
        font-size: $font-base;
      }
    }
  }
  &__list {
    .row {
      height: 158rpx;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      z-index: 4;
      .menu {
        position: absolute;
        width: 29%;
        height: 100%;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        z-index: 2;
      }
      .carrier {
        @keyframes showMenu {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-30%);
          }
        }
        @keyframes closeMenu {
          0% {
            transform: translateX(-30%);
          }
          100% {
            transform: translateX(0);
          }
        }
        &.open {
          animation: showMenu 0.25s linear both;
        }
        &.close {
          animation: closeMenu 0.15s linear both;
        }
        background-color: #fff;
        position: absolute;
        width: 100%;
        padding: 0 0;
        height: 100%;
        z-index: 3;
        display: flex;
        align-items: center;
      }
    }
    .notify-wrapper {
      background-color: $color-white;
      width: 100%;
      height: 100%;
      padding: 28rpx 32rpx;
      position: relative;
      display: flex;
      .icon-wrap {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
      }
      .info {
        flex: 1;
      }
      .title {
        display: flex;
        align-items: center;
        margin: 0 0 8rpx;
        .title-text {
          font-size: $font-lg;
          color: $font-color-dark;
          flex: 1;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .time {
          font-size: $font-sm;
          color: $font-color-light;
          white-space: nowrap;
        }
      }
      .content {
        font-size: 28rpx;
        width: 496rpx;
      }
      .type {
        position: absolute;
        top: 26rpx;
        left: -10rpx;
        border: none;
        font-size: $font-sm;
        opacity: 0.8;
      }
      .un-read {
        display: inline-block;
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        position: absolute;
        bottom: 68rpx;
        right: 32rpx;
        transform: translateY(50%);
      }
      .un-read-num {
        border-radius: 32rpx;
        padding: 4rpx 18rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: 44rpx;
        right: 20rpx;
        color: $color-white;
        transform: scale(0.7);
      }
      .un-read-num-notify {
        bottom: 22rpx !important;
      }
    }
  }
  &__not-data {
    padding-top: 200rpx;
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
    .empty-tips {
      display: flex;
      font-size: $font-sm + 2rpx;
      color: $font-color-disabled;

      .navigator {
        margin-left: 16rpx;
      }
    }
  }
  &__clear-all {
    z-index: 102;
    position: fixed;
    bottom: 120rpx;
    right: 40rpx;
    width: 88rpx;
    height: 88rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.15);
    margin-bottom: env(safe-area-inset-bottom);
  }
  &__read-all {
    z-index: 102;
    position: fixed;
    bottom: 240rpx;
    right: 40rpx;
    width: 88rpx;
    height: 88rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.15);
    margin-bottom: env(safe-area-inset-bottom);
  }
}
</style>
