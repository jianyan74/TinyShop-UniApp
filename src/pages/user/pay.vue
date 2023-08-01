<template>
  <view class="rf-pay">
    <rf-custom :is-back="true" color="#fff" :bg-color="'rgb(85 0 0 / 0%)'">
      <template #content>
        <view class="font-weight font-color-dark text-white">
          支付中
        </view>
      </template>
    </rf-custom>
    <view
      class="rf-pay__section text-white"
      :class="'bg-gradual-tb-' + themeColor.name"
      :style="{ paddingTop: customBarHeight / 2 + 'px' }"
    >
      <image class="bg" :src="moneyBg" />
      <view class="text-center mt-lg">
        <text class="font-lg">支付金额</text>
        <view class="mt-sm">
          <text class="font-lg">{{ moneySymbol }}</text>
          <text class="font-lg-32">{{ state.money }}</text>
        </view>
      </view>
    </view>
    <view class="rf-pay-type-list">
      <view class="flex-between mb-lg">
        <text class="font-lg">混合支付</text>
        <switch
          class="scale-9"
          :checked="!!state.isOrderUnite"
          :color="themeColor.color"
          :disabled="!isOpenOrderUnite"
          @tap="handleOrderUniteClick"
          @change="handleOrderUniteChange"
        />
      </view>
      <view
        v-if="
          globalConfig.order_wechat_pay &&
            (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMINI ||
              mHelper.platformGroupFilter('h5') === PlatformGroupEnum.TINYSHOP ||
              mHelper.platformGroupFilter('app') === PlatformGroupEnum.TINYSHOPAPP)
        "
        class="type-item"
        :class="state.payType === PayTypeEnum.WECHAT ? 'type-item-active text-' + themeColor.name : ''"
        @tap="changePayType(PayTypeEnum.WECHAT)"
      >
        <rf-icon name="iconweixinzhifu" :color="state.payType === PayTypeEnum.WECHAT ? '#36cb59' : ''" />
        <view class="flex-1 font-color-light">
          <text class="mr-sm" :class="state.payType === PayTypeEnum.WECHAT ? 'text-' + themeColor.name : ''">
            微信支付
          </text>
          <text>推荐使用微信支付</text>
        </view>
        <label class="scale-8">
          <radio size="12" value="" :color="themeColor.color" :checked="state.payType === PayTypeEnum.WECHAT" />
        </label>
      </view>
      <view
        v-if="
          globalConfig.order_ali_pay &&
            (mHelper.platformGroupFilter('app') === PlatformGroupEnum.TINYSHOPAPP ||
              mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPH5 ||
              mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPALIMINI)
        "
        class="type-item"
        :class="state.payType === PayTypeEnum.ALIPAY ? 'type-item-active text-' + themeColor.name : ''"
        @tap="changePayType(PayTypeEnum.ALIPAY)"
      >
        <rf-icon name="iconalipay" :color="state.payType === PayTypeEnum.ALIPAY ? '#01aaef' : ''" />
        <view class="flex-1 font-color-light">
          <text class="mr-sm" :class="state.payType === PayTypeEnum.ALIPAY ? 'text-' + themeColor.name : ''">
            支付宝支付
          </text>
          <text>推荐使用支付宝支付</text>
        </view>
        <label class="scale-8">
          <radio value="" :color="themeColor.color" :checked="state.payType === PayTypeEnum.ALIPAY" />
        </label>
      </view>
      <view
        v-if="
          globalConfig.order_bytedance_pay && mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPBYTEDANCEMINI
        "
        class="type-item"
        :class="state.payType === PayTypeEnum.BYTEDANCE ? 'type-item-active text-' + themeColor.name : ''"
        @tap="changePayType(PayTypeEnum.BYTEDANCE)"
      >
        <rf-icon
          name="iconbytedance"
          :style="{ color: state.payType === PayTypeEnum.BYTEDANCE ? '#01aaef' : '' }"
        />
        <view class="flex-1 font-color-light">
          <text class="mr-sm" :class="state.payType === PayTypeEnum.BYTEDANCE ? 'text-' + themeColor.name : ''">
            微信/支付宝收银台
          </text>
          <text>推荐使用收银台</text>
        </view>
        <label class="scale-8">
          <radio value="" :color="themeColor.color" :checked="state.payType === PayTypeEnum.BYTEDANCE" />
        </label>
      </view>
      <view
        v-if="globalConfig.order_balance_pay"
        class="type-item"
        :class="state.payType === PayTypeEnum.BALANCE ? 'type-item-active text-' + themeColor.name : ''"
        @tap="changePayType(PayTypeEnum.BALANCE)"
      >
        <rf-icon
          v-if="state.isOrderUnite"
          name="iconerjiye-yucunkuan"
          :color="state.isOrderUnite ? '#fe8e2e' : ''"
        />
        <rf-icon
          v-else
          name="iconerjiye-yucunkuan"
          :color="state.payType === PayTypeEnum.BALANCE ? '#fe8e2e' : ''"
        />
        <view class="flex-1 font-color-light">
          <text class="mr-sm" :class="state.payType === PayTypeEnum.BALANCE ? 'text-' + themeColor.name : ''">
            预存款支付
          </text>
          <text>
            可用余额
            <text class="font-sm">{{ moneySymbol }}</text>
            <text>{{ state.userInfo?.member?.account?.user_money }}</text>
          </text>
        </view>
        <label class="scale-8">
          <radio v-if="state.isOrderUnite" disabled :color="themeColor.color" :checked="state.isOrderUnite" />
          <radio v-else :color="themeColor.color" :checked="state.payType === PayTypeEnum.BALANCE" />
        </label>
      </view>
      <view class="font-sm ml-base font-color-light">
        注：当可用余额大于支付金额或者余额为0时，不可开启混合支付
      </view>
    </view>
    <view class="pl-lg pr-lg">
      <button
        class="rf-confirm-btn"
        :class="'bg-gradual-' + themeColor.name"
        :disabled="state.btnLoading"
        :loading="state.btnLoading"
        @tap="confirm"
      >
        确认支付
      </button>
    </view>
    <!--页面加载动画-->
    <rf-loading :active="state.loading" />
  </view>
</template>
<script setup lang="ts">
import mRouteConfig from '@/config/routes'; // 路由管理
import { computed, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import mConstData from '@/config/constData';
import mHelper from '@/utils/helper';
import mSiteConfig from '@/config/site';
import mPayment from '@/utils/payment';
import memberApi from '@/api/tinyShop/member';
import marketingApi from '@/api/tinyShop/marketing';
import store from '@/store';

import { paymentConfig } from '@/response/payment';
import { OrderGroupEnum, PayTypeEnum } from '@/enum/paymentEnum';
import { Profile } from '@/response/profile';
import { PlatformGroupEnum } from '@/enum/loginEnum';
import mAssetsPath from '@/config/assets';

const themeColor = mHelper.getThemeColor(); // 主题颜色
const moneySymbol = mConstData.moneySymbol;
const moneyBg = mAssetsPath.moneyBg;

const globalConfig = computed(() => store.getters['user/getGlobalConfig']);
const customBarHeight = mHelper.getCustomBarHeight();

let state = reactive({
  payType: PayTypeEnum.BALANCE,
  money: 0,
  loading: true,
  userInfo: {} as Profile,
  orderInfo: {} as AnyObject,
  btnLoading: false,
  code: '',
  type: '',
  orderId: '',
  marketingId: '',
  isPeerPay: false,
  payStatus: '',
  isOrderUnite: false
});

onLoad(async (options: any) => {
  if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPBYTEDANCEMINI) state.payType = PayTypeEnum.BYTEDANCE;
  if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMP) {
    state.code = String(options.code && options.code.split(',')[options.code.split(',').length - 1]);
    options = { ...uni.getStorageSync('params'), ...options };
    if (!state.code) {
      uni.setStorageSync('params', options);
      try {
        const data = (await memberApi.getIsBindingCheck({ oauth_client: 'wechat' })) as AnyObject;
        if (!data.openid) {
          const href = window.location.href;
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${mSiteConfig.wxAppId}&redirect_uri=${href}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
        }
      } catch (e) {
        //
      }
    }
  }
  await initData(options);
});
// 监听混合支付的切换
const handleOrderUniteChange = () => {
  state.isOrderUnite = !state.isOrderUnite;
};
// 点击混合支付
const handleOrderUniteClick = () => {
  if (!isOpenOrderUnite.value) {
    mHelper.toast('不满足混合支付的条件');
    return;
  }
};
// 数据初始化
const initData = async (options) => {
  await setCartItemCount();
  state.payStatus = options.pay_status;
  state.orderId = options.order_id;
  state.isPeerPay = options.is_peer_pay;
  if (options.money) {
    uni.setStorageSync('money', options.money);
  }
  if (options.type) {
    uni.setStorageSync('type', options.type);
  }
  if (options.isFullPayment) {
    state.orderInfo['is_full_payment'] = options.isFullPayment;
  }
  if (options.unite_no) state.orderInfo['unite_no'] = options.unite_no;
  if (state.orderId) {
    await getOrderDetail(state.orderId);
    state.orderInfo['order_id'] = state.orderId;
  } else {
    state.money = options.money || uni.getStorageSync('money');
  }
  state.type = options.type || uni.getStorageSync('type');
  await getMemberInfo();
  if (
    uni.getSystemInfoSync().platform === 'android' &&
    mHelper.platformGroupFilter('h5') === PlatformGroupEnum.TINYSHOP
  ) {
    await mPayment.wxConfigH5(window.location.href);
  }
};
// 设置购物车数量角标
const setCartItemCount = async () => {
  try {
    const cartNum = await memberApi.getCartItemCount();
    store.commit('notify/setCartNum', { cartNum });
  } catch (e) {
    //
  }
};
// 获取用户信息
const getMemberInfo = async () => {
  try {
    state.userInfo = (await memberApi.getMemberInfo()) as unknown as Profile;
    state.loading = false;
  } catch (e) {
    state.loading = false;
  }
};
// 选择支付方式
const changePayType = (type: PayTypeEnum) => {
  state.payType = type;
};
// 获取订单费用
const getOrderDetail = async (id: string) => {
  try {
    const data = state.isPeerPay
      ? await marketingApi.getPeerPayOrderDetail({
          id, // 订单id
          order_id: id, // 订单id
          simplify: 1
        })
      : ((await memberApi.getOrderDetail({
          id, // 订单id
          order_id: id, // 订单id
          simplify: 1
        })) as AnyObject);
    state.marketingId = data.wholesale_id;
    // 尾款支付优先显示
    if (state.isPeerPay) {
      state.orderInfo = {};
      state.orderInfo['peer_pay_id'] = data.peer_pay_id;
    }
    state.money = data.final_money > 0 ? data.final_money : data.pay_money;
  } catch (e) {
    state.loading = false;
  }
};
// 确认支付
const confirm = async () => {
  uni.removeStorageSync('type');
  uni.removeStorageSync('money');
  if (state.isOrderUnite && parseInt(String(state.payType), 10) === 5) {
    mHelper.toast('请选择第三方支付！');
    return;
  }
  state.btnLoading = true;
  setTimeout(() => {
    state.btnLoading = false;
  }, 0.5 * 1000);
  let orderGroup = state.isOrderUnite
    ? OrderGroupEnum.ORDERUNITEBATCH
    : state.type === 'order'
    ? OrderGroupEnum.ORDER
    : OrderGroupEnum.ORDERBATCH;
  if (state.isPeerPay) orderGroup = OrderGroupEnum.ORDERPEER;
  if (state.payStatus === 'presell')
    orderGroup = state.isOrderUnite ? OrderGroupEnum.ORDERUNITEFINAL : OrderGroupEnum.ORDERFINAL;
  let config = {} as paymentConfig;
  config.pay_type = state.payType;
  config.data = JSON.stringify(state.orderInfo);
  config.order_group = orderGroup;
  config.route = mRouteConfig.paySuccess;
  config.code = state.code || '';
  config.query = {
    type: state.type,
    id: state.marketingId,
    order_id: state.orderId,
    unite_no: state.orderInfo.unite_no
  };
  await mPayment.commonPay(config);
};

const isOpenOrderUnite = computed(() => {
  return (
    parseFloat(String(state.money)) > parseFloat(state.userInfo?.member?.account?.user_money) &&
    state.userInfo?.member?.account?.user_money !== '0'
  );
});
</script>
<style lang="scss">
.rf-pay {
  background-color: $color-white;
  &__section {
    height: 500rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .bg {
      position: absolute;
    }
  }
}
</style>
