<template>
  <view class="rf-profile">
    <!--头部-->
    <view
      :class="'bg-gradual-' + themeColor.name"
      :style="{ paddingTop: safeTop + 45 + 'px', height: 260 + safeTop + 'px' }"
      class="user-section"
    >
      <view class="user-section__bg">
        <rf-image :height="510 + safeTop" :src="userBg" width="750" />
      </view>
      <!--用户信息-->
      <view class="user-info-box">
        <view class="portrait-box" @tap="navTo(mRouteConfig.userinfo)">
          <view class="portrait">
            <rf-image
              :src="state.userInfo?.member?.head_portrait || headImg"
              border-radius="50%"
              height="88"
              width="88"
            />
          </view>
          <view class="username in1line font-weight-500">
            {{ state.userInfo?.member?.nickname || state.userInfo?.member?.realname || '登录/注册' }}
          </view>
        </view>
        <view
          v-if="hasLogin && state.userInfo?.signOpen"
          class="mr-sm flex-align-items flex-shrink"
          @tap="navTo(mRouteConfig.signIn)"
        >
          <rf-icon name="icongerenzhongxin_qiandaoicon" size="36" />
          <view class="ml-sm">
            签到
          </view>
        </view>
      </view>
      <!--账户信息-->
      <view class="account-info mt-sm">
        <view
          v-for="(item, index) in amountList"
          :key="item.title"
          class="tj-item"
          @tap="navTo(mRouteConfig[item.url], item.query)"
        >
          <text :style="{ fontSize: index === 4 ? '32rpx' : '' }" class="font-weight-500 font-lg-4">
            {{ item.value }}
          </text>
          <text class="font-sm font-weight-light">{{ item.title }}</text>
        </view>
      </view>
      <!--vip信息-->
      <view class="vip-card-box" @tap="navTo(mRouteConfig.accountCenter)">
        <rf-image :src="profileVipCardBg" border-radius="12" class="vip-card-bg" height="100%" width="100%" />
        <view class="vip-card-info">
          <view class="tit">
            <view class="tit-wrap">
              <view class="font-weight font-lg-2">
                {{ globalConfig.app_name || mConstData.appName }}尊享
              </view>
              <view v-if="state.userInfo?.memberCard?.status === 1">
                <view
                  v-if="state.userInfo?.member?.memberLevel"
                  class="detail scale-9"
                  @tap.stop="navTo(mRouteConfig.accountCenter)"
                >
                  查看详情
                  <rf-icon name="iconyou" size="24" />
                </view>
                <view v-else class="detail scale-9" @tap.stop="navTo(mRouteConfig.accountCenter)">
                  立即开通
                  <rf-icon name="iconyou" size="24" />
                </view>
              </view>
            </view>
            <view class="b-btn">
              {{ filterMemberLevel(state.userInfo?.member?.memberLevel) }}
            </view>
          </view>
          <text class="font-sm mt-sm">超惠专属精致礼包，尊享会员权益</text>
        </view>
      </view>
    </view>
    <!-- 个人中心 内容区-->
    <view class="cover-container">
      <!-- 我的订单 -->
      <view class="promotion-center">
        <view class="header flex-align-items" @tap="navTo(mRouteConfig.order, { state: -1 })">
          <view class="font-color-dark font-weight pt-sm">
            订单中心
          </view>
          <view class="font-sm font-color-light mr">
            查看全部
            <rf-icon name="iconyou" size="28" />
          </view>
        </view>
        <view class="order-section">
          <view
            v-for="item in orderSectionList"
            :key="item.title"
            class="order-item"
            @tap="navTo(mRouteConfig[item.url], item.query)"
          >
            <rf-icon :name="item.icon" size="56" />
            <view class="mt-base font-color-base font-sm">
              {{ item.title }}
            </view>
            <view class="badge">
              <rf-badge v-if="item.num" :text="orderNumFilter(item.num)" type="error" />
            </view>
          </view>
        </view>
      </view>
      <!--推广申请入口-->
      <!--      <view class="mb-base" v-if="!state.userInfo?.promoter">-->
      <!--        <rf-image-->
      <!--          @tap="navTo(mRouteConfig.distributeApply)"-->
      <!--          width="690"-->
      <!--          height="170"-->
      <!--          border-radius="12"-->
      <!--          :src="distributeBanner"-->
      <!--        ></rf-image>-->
      <!--      </view>-->
      <!--推广中心-->
      <view v-if="state.userInfo?.promoter" class="promotion-center">
        <view class="header flex-align-items header-b" @tap="navTo(mRouteConfig.distribute)">
          <view class="font-color-dark font-weight pt-sm">
            推广中心
          </view>
          <view class="font-sm font-color-light mr">
            <rf-icon name="iconyou" size="28" />
          </view>
        </view>
        <view class="tj-sction">
          <view
            v-for="item in promotionList"
            :key="item.title"
            class="tj-item"
            @tap="navTo(mRouteConfig[item.url], item.query)"
          >
            <view :class="'text-' + themeColor.name" class="num in1line font-weight font-lg-4 mb-sm">
              {{ item.value }}
            </view>
            <text class="font-color-light font-sm scale-9">{{ item.title }}</text>
          </view>
        </view>
      </view>
      <!--我的服务-->
      <view v-if="memberCenterNav?.config?.style === 'grid'" class="promotion-center">
        <view class="header header-b">
          <view class="font-color-dark font-weight pt-sm">
            我的服务
          </view>
        </view>
        <view class="tj-sction">
          <!-- 分类列表 -->
          <view class="category-list">
            <view v-for="(item, index) in memberCenterNav?.items" :key="index" class="category">
              <button
                :open-type="item.title === '分享' ? 'share' : globalConfig.app_service_type === 20 ? 'contact' : ''"
                class="category-btn border-color-none bg-white"
                @tap.stop="normalNavTo(item?.link, item.title)"
              >
                <view class="category-image">
                  <rf-image
                    v-if="item.iconType === 'image'"
                    :src="item.icon"
                    border-radius="6"
                    class="image"
                    height="64"
                    width="64"
                  />
                  <rf-icon v-else :color="themeColor.color" :name="item.icon" size="64" />
                </view>
                <view class="in1line block mt-base font-color-light font-sm">
                  {{ item.title }}
                </view>
              </button>
            </view>
          </view>
        </view>
      </view>
      <!--我的服务-->
      <view v-if="memberCenterNav?.config?.style === 'list'" class="promotion-center">
        <view class="header header-b">
          <view class="font-color-dark font-weight pt-sm">
            我的服务
          </view>
        </view>
        <view class="pt-sm pb-sm">
          <view v-for="(item, index) in memberCenterNav?.items" :key="index" class="category-list-1">
            <button
              :open-type="item.title === '分享' ? 'share' : (globalConfig.app_service_type === 20 ? 'contact' : '')"
              class="category border-color-none bg-white"
              @tap="normalNavTo(item?.link, item.title)"
            >
              <view class="img">
                <rf-image
                  v-if="item.iconType === 'image'"
                  :src="item.icon"
                  border-radius="6"
                  height="56"
                  width="56"
                />
                <rf-icon
                  v-else
                  :color="themeColor.color"
                  :name="item.icon"
                  size="50"
                />
                <text class="ml-base font-color-dark">{{ item.title }}</text>
              </view>
              <view class="font-color-light font-base">
                <rf-icon name="iconyou" />
              </view>
            </button>
          </view>
        </view>
      </view>
    </view>
    <!--页面加载动画-->
    <rf-loading :active="state.loading" :is-full-screen="mHelper.isBottomNav('profile')" />
    <!--自定义tabBar-->
    <rf-base-popup v-if="state.serviceShow" @close="state.serviceShow = false">
      <template #content>
        <rf-image :src="globalConfig.app_service_qr" border-radius="12rpx" height="360" width="360" />
      </template>
    </rf-base-popup>
  </view>
</template>
<script lang="ts" setup>
import mRouteConfig from '@/config/routes';
import {computed, reactive} from 'vue';
import mSiteConfig from '@/config/site';
import mConstData from '@/config/constData';
import mAssetsPath from '@/config/assets';
import mRouter from '@/utils/routerUtil';
import mHelper from '@/utils/helper';
import {onShow} from '@dcloudio/uni-app';
import store from '@/store';
import {Route} from '@/response/route';
import memberApi from '@/api/tinyShop/member';
import {PlatformGroupEnum} from '@/enum/loginEnum';
import {MemberLevel, Profile} from '@/response/profile';

const themeColor = computed(() => {
  return store.getters['theme/getThemeColor'];
});
const globalConfig = computed(() => {
  return store.getters['user/getGlobalConfig'];
});
// 是否登录
let hasLogin = computed(() => {
  return store.getters['user/hasLogin'];
});

const profileVipCardBg = mAssetsPath.profileVipCardBg;
const orderSectionList = mConstData.orderSectionList;
const amountList = mConstData.amountList;
const promotionList = mConstData.promotionList;
const headImg = mAssetsPath.headImg;
const userBg = mAssetsPath.userBg;

let state = reactive({
  moving: false,
  serviceShow: false,
  userInfo: {} as Profile,
  loading: true
});

//
const memberCenterNav = {
  "items": [
    {
      "icon": "icongonggao_yangshi02                ",
      "link": {
        "type": "",
        "route": "notice",
        "title": "公告",
        "mpPath": "",
        "innerLink": "",
        "fItemIndex": "1",
        "activeIndex": "1-2",
        "externalLink": ""
      },
      "type": "text",
      "title": "公告",
      "iconType": "iconfont"
    },
    {
      "icon": "icongerenzhongxin_youhuiquan                ",
      "link": {
        "type": "",
        "route": "couponList",
        "title": "领券中心",
        "mpPath": "",
        "innerLink": "",
        "fItemIndex": "1",
        "activeIndex": "1-2",
        "externalLink": ""
      },
      "type": "text",
      "title": "领券中心",
      "iconType": "iconfont"
    },
    {
      "icon": "iconsousuolan_dingwei                ",
      "link": {
        "type": "",
        "route": "address",
        "title": "收货地址",
        "mpPath": "",
        "innerLink": "",
        "fItemIndex": "1",
        "activeIndex": "1-2",
        "externalLink": ""
      },
      "type": "text",
      "title": "收货地址",
      "iconType": "iconfont"
    },
    {
      "icon": "iconshoucang6                ",
      "link": {
        "type": "",
        "route": "collection",
        "title": "我的收藏",
        "mpPath": "",
        "innerLink": "",
        "fItemIndex": "1",
        "activeIndex": "1-2",
        "externalLink": ""
      },
      "type": "text",
      "title": "我的收藏",
      "iconType": "iconfont"
    },
    {
      "icon": "iconzuji                ",
      "link": {
        "type": "",
        "route": "footprint",
        "title": "我的足迹",
        "mpPath": "",
        "innerLink": "",
        "fItemIndex": "1",
        "activeIndex": "1-2",
        "externalLink": ""
      },
      "type": "text",
      "title": "我的足迹",
      "iconType": "iconfont"
    },
    {
      "icon": "iconzhibo51                ",
      "link": {
        "type": "",
        "route": "liveList",
        "title": "直播",
        "mpPath": "",
        "innerLink": "",
        "fItemIndex": "1",
        "activeIndex": "1-2",
        "externalLink": ""
      },
      "type": "text",
      "title": "直播",
      "iconType": "iconfont"
    },

    {
      "icon": "iconshezhi2                ",
      "link": {
        "type": "",
        "route": "set",
        "title": "设置",
        "mpPath": "",
        "innerLink": "",
        "fItemIndex": "1",
        "activeIndex": "1-2",
        "externalLink": ""
      },
      "type": "text",
      "title": "设置",
      "iconType": "iconfont"
    }
  ],
  "config": {
    "style": "grid"
  }
}

onShow(async () => {
  // 初始化数据
  await initData();
});

// 格式化订单角标
const orderNumFilter = (num) => {
  return num > 99 ? '99+' : num;
};
// 分享
const share = () => {
  const url = `${mSiteConfig.hostURL}/pages/index/index?promoter_code=${state.userInfo?.member.promoter_code}`;
  if (mHelper.platformGroupFilter('h5') === PlatformGroupEnum.TINYSHOP) {
    mHelper.h5Copy(url);
  } else if (mHelper.platformGroupFilter('app') === PlatformGroupEnum.TINYSHOPAPP) {
    const shareImg = `${globalConfig.value.app_logo}`;
    mHelper.handleAppShare(url, globalConfig.value.app_name, `欢迎来到${globalConfig.value.app_name}`, shareImg);
  }
};
// 数据初始化
const initData = async () => {
  if (hasLogin.value) {
    await getMemberInfo();
  } else {
    state.loading = false;
    resetSectionData();
  }
};
// 获取用户信息
const getMemberInfo = async () => {
  try {
    state.userInfo = (await memberApi.getMemberInfo()) as unknown as Profile;
    state.loading = false;
    await setSectionData();
    store.commit('notify/setCartNum', {cartNum: state.userInfo?.cartNum});
    store.commit('notify/setNotifyNum', {
      notifyNum: state.userInfo?.notifyNum.count
    });
  } catch (e) {
    //
    resetSectionData();
    state.loading = false;
  }
};
// 清空个人中心的各模块状态
const resetSectionData = () => {
  store.commit('notify/setNotifyNum', {notifyNum: 0});
  store.commit('notify/setCartNum', {cartNum: 0});
  amountList.forEach((item, index) => {
    amountList[index].value = '0';
  });
  promotionList.forEach((item, index) => {
    promotionList[index].value = 0;
  });
  orderSectionList.forEach((item, index) => {
    orderSectionList[index].num = 0;
  });
};
// 给个人中心的各模块赋值
const setSectionData = () => {
  orderSectionList[0].num = state.userInfo?.orderNum.notPay;
  orderSectionList[1].num = state.userInfo?.orderNum.pay;
  orderSectionList[2].num = state.userInfo?.orderNum.shipments;
  orderSectionList[3].num = state.userInfo?.orderNum.remainToBeEvaluated;
  orderSectionList[4].num = state.userInfo?.orderNum.afterSale;
  amountList[3].value = state.userInfo?.member.account?.user_growth || '0';
  amountList[2].value = state.userInfo?.member.account?.user_integral || '0';
  amountList[1].value = state.userInfo?.couponNum || '0';
  amountList[0].value = state.userInfo?.member.account?.user_money || '0';
  promotionList[0].value = Number(state.userInfo?.promoterAccount?.accumulate_brokerage) || 0;
  promotionList[1].value = Number(state.userInfo?.promoterAccount?.user_brokerage) || 0;
  promotionList[2].value = Number(state.userInfo?.promoterAccount?.amount_drawn_brokerage) || 0;
  // 更新userInfo缓存
  store.commit('user/setUserInfo', {userInfo: state.userInfo});
};
// 统一跳转接口,拦截未登录路由
const navTo = (route: Route, query = {}) => {
  if (!route) return;
  if (!state.userInfo?.memberCard?.status && route === mRouteConfig.accountCenter) return;
  !hasLogin.value ? mHelper.backToLogin() : mRouter.push({route, query});
};
// 自定义链接跳转
const normalNavTo = (link: AnyObject, title: string) => {
  if (!hasLogin.value) {
    mHelper.backToLogin();
    return;
  }
  if (link.route === 'serviceCenter') {
    navTo(mRouteConfig.serviceCenter);
    return;
  }
  if (link.route === 'service') {
    if (globalConfig.value.app_service_type === 0) {
      mHelper.toast('暂不提供客服功能');
      return;
    }
    toService(link);
    return;
  }
  if (title === '分享') {
    if (mHelper.platformGroupFilter() !== PlatformGroupEnum.TINYSHOPWECHATMINI) {
      share();
    }
    return;
  }
  mHelper.handleBasicNavTo(link);
};
// 客服跳转 0-不显示 10-rf客服 20-微信小程序客服 30-企业微信客服 40-二维码客服
const toService = (link: AnyObject, query = {}) => {
  switch (globalConfig.value.app_service_type) {
    case 0 | 20:
      break;
    case 10:
      mHelper.handleBasicNavTo(link);
      break;
    case 30: //判断是H5还是小程序 跳转方式不同 app_service_corp_id  app_service_wechat_work_url
      // #ifdef H5
      query = {url: globalConfig.value.app_service_wechat_work_url}
      mRouter.push({route: mRouteConfig['url'], query});
      // #endif
      // #ifdef MP-WEIXIN
      wx.openCustomerServiceChat({
        extInfo: {
          url: globalConfig.value.app_service_wechat_work_url //客服地址链接
        },
        corpId: globalConfig.value.app_service_corp_id, //必须和你小程序上的一致
        success(res) {
          console.log(res, 1)
        },
        fail(res) {
          console.log(res, 2)
        },
      })
      // #endif
      break;
    case 40: //调起二维码弹窗 app_service_qr
      if (!globalConfig.value.app_service_qr) {
        mHelper.toast('暂未配置客服二维码');
      }
      state.serviceShow = true;
      return;
    default:
      return;
  }
};
// 会员等级显示
const filterMemberLevel = (val: MemberLevel) => {
  return val ? val.name : '普通用户';
};

// 头部安全距离
const safeTop = computed(() => {
  let sysInfo: AnyObject = uni.getSystemInfoSync();
  return sysInfo?.safeAreaInsets?.top || 0;
});
</script>
<style lang="scss" scoped>
.rf-profile {
  background-color: $page-color-base;
  min-height: 100vh;

  .user-section {
    padding: 90rpx 30rpx 0;
    position: relative;
    height: 510rpx;

    &__bg {
      position: absolute;
      left: 0;
      bottom: 0;
      opacity: 0.84;
      z-index: 2;
    }

    .user-info-box {
      margin-top: 40rpx;
      height: 120rpx;
      display: flex;
      align-items: center;
      position: relative;
      z-index: 9;
      justify-content: space-between;

      .portrait-box {
        display: flex;
        align-items: center;

        .portrait {
          flex-shrink: 0;
          border-radius: 50%;
          border: 2rpx solid #fff;
        }

        .username {
          font-size: $font-lg + 6rpx;
          color: $color-white;
          margin-left: 20rpx;
        }

        button {
          background-color: transparent;
          font-size: $font-lg + 6rpx;
          color: $font-color-dark;
          border: none;
        }

        button::after {
          border: none;
        }
      }
    }

    .account-info {
      display: flex;
      position: relative;
      z-index: 999;

      .tj-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
        margin: 30rpx 0;
        font-size: $font-sm;
        color: $color-white;
      }
    }

    .vip-card-box {
      width: calc(100% - 60rpx);
      margin: $spacing-sm $spacing-lg 0;
      height: 160rpx;
      background-size: 100% 100%;
      z-index: 5;
      position: absolute;
      bottom: -70rpx;
      left: 0;
      color: #c85e00;

      .vip-card-bg {
        position: absolute;
        width: 100%;
        height: 96%;
      }

      .vip-card-info {
        right: 24rpx;
        top: 32rpx;
        width: 580rpx;
        position: absolute;
        display: flex;
        flex-direction: column;
        border-radius: 12rpx;

        .tit {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .tit-wrap {
            line-height: 1.5;
            font-size: $font-lg + 2rpx;
            display: flex;
            align-items: center;

            .detail {
              font-size: $font-sm;
              height: 48rpx;
              padding: 2rpx 24rpx 0;
              line-height: 48rpx;
              background-color: #f8ce93;
              border-radius: 30rpx;
            }
          }

          .b-btn {
            width: 140rpx;
            height: 42rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: $font-sm;
            border-radius: 21rpx;
            border: 1rpx solid #c85e00;
          }
        }

        .e-m {
          font-size: $font-base - 2rpx;
        }
      }
    }
  }

  .cover-container {
    margin-top: 90rpx;
    margin-bottom: 30rpx;
    padding: 0 30rpx;

    .promotion-center {
      background: #fff;
      margin-bottom: 20rpx;
      border-radius: 10rpx;

      .header {
        display: flex;
        justify-content: space-between;
        padding: $spacing-base $spacing-sm $spacing-base $spacing-lg;
      }

      .header-b {
        border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
      }

      /*分类列表*/
      .category-list {
        width: 100%;
        padding: 0 0 30rpx 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;

        .category {
          width: 25%;
          margin-top: 50rpx;

          .category-image {
            width: 160rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 68rpx;
          }

          .category-btn {
            line-height: 1.2 !important;
            width: 100%;
            height: auto;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            border: 0;
          }

          .category-btn:after {
            border: none;
            background: none;
          }
        }
      }
    }

    .tj-sction {
      justify-content: space-around;
      display: flex;
      align-content: center;
      background: #fff;
      border-radius: 10rpx;

      .tj-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
        margin: 30rpx 0;
        font-size: $font-sm;
        /*border-right: 2rpx solid rgba(0, 0, 0, 0.2);*/
      }

      .tj-item:last-child {
        border-right: none;
      }

      .num {
        line-height: 1;
        height: 40rpx;
      }

      .red {
        color: $base-color;
      }
    }

    .order-section {
      justify-content: space-around;
      display: flex;
      align-content: center;
      background: #fff;
      border-radius: 10rpx;
      padding: 20rpx 0;

      .order-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 120rpx;
        height: 120rpx;
        border-radius: 10rpx;
        font-size: $font-sm;
        color: $font-color-dark;
        position: relative;
      }

      .badge {
        position: absolute;
        top: -12rpx;
        right: 4rpx;
      }

      .iconfont {
        font-size: 48rpx;
      }
    }

    .category-list-1 {
      .category {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 26rpx 32rpx;
        line-height: 1.2 !important;

        .img {
          display: flex;
          align-items: center;
        }
      }

      .category:after {
        border: none;
        background: none;
      }
    }
  }
}
</style>
