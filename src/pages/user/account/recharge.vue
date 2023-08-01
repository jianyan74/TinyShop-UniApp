<template>
  <view class="rf-recharge">
    <!-- 我的余额   -->
    <view class="mb-lg pl-lg pr-lg">
      <view class="font-lg">
        我的余额：
        <text :class="'text-' + themeColor.name" class="font-lg-4">{{
          state.userInfo?.member?.account?.user_money || "0"
        }}
        </text>
        元
      </view>
    </view>
    <!--  充值金额  -->
    <view class="rf-recharge__money">
      <view class="font-lg mb-base"> 充值金额</view>
      <!--  列表    -->
      <view class="amount-list mb-base">
        <view
          v-for="(item, index) in state.amountList"
          :key="index"
          :class="
            Number(item.price) === Number(state.inputAmount)
              ? 'bg-' + themeColor.name
              : 'on'
          "
          class="amount-item border-radius-12"
          @tap="select(item)"
        >
          <view class="font-lg-4">{{ item.price }}元</view>
          <text class="font-base">赠送 {{ item.give_price }}元</text>
        </view>
      </view>
      <view class="flex-justify-end mb-lg">
        <view> 自定义充值金额</view>
        <view class="input">
          <input
            v-model="state.inputAmount"
            :class="'text-' + themeColor.name"
            type="number"
            @input="handleInputAmountChange"
          >
        </view>
        <text
          v-if="state.inputAmountGive > 0"
          :class="'text-' + themeColor.name"
          class="font-sm"
        >赠送 {{ state.inputAmountGive }}元
        </text
        >
      </view>
    </view>
    <!--  支付方式  -->
    <view class="rf-recharge__pay_type">
      <view class="pl-lg pr-lg font-lg">选择支付方式</view>
      <view class="rf-pay-type-list">
        <view
          v-if="globalConfig.order_wechat_pay && (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMINI || mHelper.platformGroupFilter('h5') === PlatformGroupEnum.TINYSHOP || mHelper.platformGroupFilter('app') === PlatformGroupEnum.TINYSHOPAPP)"
          :class="state.payType === PayTypeEnum.WECHAT ? 'type-item-active text-' + themeColor.name : ''"
          class="type-item"
          @tap="changePayType(PayTypeEnum.WECHAT)"
        >
          <rf-icon :color="state.payType === PayTypeEnum.WECHAT ? '#36cb59' : ''" name="iconweixinzhifu" />
          <view class="flex-1 font-color-light">
            <text :class="state.payType === PayTypeEnum.WECHAT ? 'text-' + themeColor.name : ''" class="mr-sm">
              微信支付
            </text>
            <text>推荐使用微信支付</text>
          </view>
          <label class="scale-8">
            <radio :checked="state.payType === PayTypeEnum.WECHAT" :color="themeColor.color" size="12" value="" />
          </label>
        </view>
        <view
          v-if="globalConfig.order_ali_pay && (mHelper.platformGroupFilter('app') === PlatformGroupEnum.TINYSHOPAPP || mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPH5 || mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPALIMINI)"
          :class="state.payType === PayTypeEnum.ALIPAY ? 'type-item-active text-' + themeColor.name : ''"
          class="type-item"
          @tap="changePayType(PayTypeEnum.ALIPAY)"
        >
          <rf-icon :color="state.payType === PayTypeEnum.ALIPAY ? '#01aaef' : ''" name="iconalipay" />
          <view class="flex-1 font-color-light">
            <text :class="state.payType === PayTypeEnum.ALIPAY ? 'text-' + themeColor.name : ''" class="mr-sm">
              支付宝支付
            </text>
            <text>推荐使用支付宝支付</text>
          </view>
          <label class="scale-8">
            <radio :checked="state.payType === PayTypeEnum.ALIPAY" :color="themeColor.color" value="" />
          </label>
        </view>
        <view
          v-if="globalConfig.order_bytedance_pay && mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPBYTEDANCEMINI"
          :class="state.payType === PayTypeEnum.BYTEDANCE ? 'type-item-active text-' + themeColor.name : ''"
          class="type-item"
          @tap="changePayType(PayTypeEnum.BYTEDANCE)"
        >
          <rf-icon :style="{color: state.payType === PayTypeEnum.BYTEDANCE ? '#01aaef' : ''}" name="iconbytedance" />
          <view class="flex-1 font-color-light">
            <text :class="state.payType === PayTypeEnum.BYTEDANCE ? 'text-' + themeColor.name : ''" class="mr-sm">
              微信/支付宝收银台
            </text>
            <text>推荐使用收银台</text>
          </view>
          <label class="scale-8">
            <radio :checked="state.payType === PayTypeEnum.BYTEDANCE" :color="themeColor.color" value="" />
          </label>
        </view>
      </view>
    </view>
    <!--  按钮&协议  -->
    <view class="rf-recharge__pay-btn mt-lg">
      <button :class="'bg-' + themeColor.name" class="btn font-base" @tap="pay">
        立即充值
      </button>
      <view class="flex-align-items mt-base font-sm font-color-light">
        点击立即充值，即代表您同意
        <view
          :class="'text-' + themeColor.name"
          @tap="
            navTo(mRouteConfig.aboutDetail, {
              field: 'protocol_recharge',
              title: '充值协议',
            })
          "
        >
          《充值协议》
        </view>
      </view>
    </view>
    <!--加载动画-->
    <rf-loading :active="state.loading" />
  </view>
</template>
<script lang="ts" setup>
import {onLoad,} from "@dcloudio/uni-app";
import mHelper from "@/utils/helper";
import mSiteConfig from "@/config/site";
import mRouteConfig from "@/config/routes"; // 路由管理
import mRouter from "@/utils/routerUtil";
import mPayment from "@/utils/payment";
import marketingApi from "@/api/tinyShop/marketing";
import memberApi from "@/api/tinyShop/member";
import {Route,} from "@/response/route";
import {Profile,} from "@/response/profile";
import {PlatformGroupEnum,} from "@/enum/loginEnum";
import {paymentConfig, RechargeConfigItem,} from "@/response/payment";
import {OrderGroupEnum, PayTypeEnum,} from "@/enum/paymentEnum";
import {reactive} from "vue";

// 常量
const themeColor = mHelper.getThemeColor();
const globalConfig = mHelper.getGlobalConfig(); // 通用配置

// 变量
let state = reactive({
  userInfo: {} as Profile,
  code: "",
  payType: PayTypeEnum.WECHAT,
  loading: true,
  amountList: [] as RechargeConfigItem[],
  inputAmount: 0,
  inputAmountGive: 0
});

onLoad((options: any) => {
  if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMP) {
    state.code =
      (options.code &&
        options.code.split(",")[options.code.split(",").length - 1]) ||
      "";
    if (!state.code) {
      uni.setStorageSync("params", options);
      const href = window.location.href;
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${mSiteConfig.wxAppId}&redirect_uri=${href}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    }
  }
  options = {...uni.getStorageSync("params"), ...options,};
  initData(options);
});

// 计算充值送的钱 后台配置
const handleInputAmountChange = (e) => {
  state.inputAmount = Number(e.detail.value);
  if (state.inputAmount < Number(state.amountList[0].price)) {
    state.inputAmountGive = 0;
    return;
  }
  if (
    state.inputAmount >=
    Number(state.amountList[state.amountList.length - 1].price)
  ) {
    state.inputAmountGive = Number(
      state.amountList[state.amountList.length - 1].give_price
    );
    return;
  }
  for (let i = 0; i < state.amountList.length; i++) {
    if (
      state.inputAmount >= Number(state.amountList[i].price) &&
      state.inputAmount < Number(state.amountList[i + 1].price)
    ) {
      state.inputAmountGive = Number(state.amountList[i].give_price);
    }
  }
};
const pay = async () => {
  if (!globalConfig.order_ali_pay && !globalConfig.order_wechat_pay) return;
  let config = {} as paymentConfig;
  config.pay_type = state.payType;
  config.data = JSON.stringify({money: state.inputAmount,});
  config.order_group = OrderGroupEnum.RECHARGE;
  config.route = mRouteConfig.account;
  config.code = state.code;
  await mPayment.commonPay(config);
};
const navTo = (route: Route, query = {}) => {
  mRouter.push({route, query,});
};
// 初始化数据
const initData = async (options) => {
  if (
    mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMP &&
    uni.getSystemInfoSync().platform === "android"
  ) {
    await mPayment.wxConfigH5(window.location.href);
  }
  state.code = options.code;
  try {
    await getMemberInfo();
    state.amountList =
      (await marketingApi.getRechargeConfigIndex()) as unknown as RechargeConfigItem[];
    state.loading = false;
    state.inputAmount = Number(state.amountList[0].price) || 0.01;
    state.inputAmountGive = Number(state.amountList[0].give_price) || 0;
  } catch (e) {
    //
    state.loading = false;
  }
};

// 获取用户信息
const getMemberInfo = async () => {
  try {
    state.userInfo = (await memberApi.getMemberInfo()) as unknown as Profile;
  } catch (e) {
    //
  }
};
const select = (item) => {
  state.inputAmount = item.price;
  state.inputAmountGive = item.give_price;
};

// 选择支付方式
const changePayType = (type: PayTypeEnum) => {
  state.payType = type;
};
</script>
<style lang="scss">
.rf-recharge {
  background-color: $color-white;
  padding: $spacing-lg 0;

  &__money {
    padding: 0 $spacing-base;

    .amount-list {
      display: flex;
      justify-content: space-between;
      align-content: space-around;
      align-items: center;
      flex-wrap: wrap;

      &::after {
        content: '';
        width: 220rpx;
        height: 145rpx;
        margin-bottom: $spacing-base;
      }

      .amount-item {
        width: 220rpx;
        height: 145rpx;
        margin-bottom: $spacing-base;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0rpx 5rpx 20rpx rgba(0, 0, 0, 0.05);

        &.on {
          background-color: #e1e1e1;
          color: #666;
        }
      }
    }

    .input {
      width: 28.2vw;
      border-bottom: solid 2rpx;
      justify-content: flex-end;
      align-items: center;

      input {
        margin: 0 20rpx;
        height: 60rpx;
        font-size: 30rpx;
        justify-content: flex-end;
        align-items: center;
      }
    }

    .num {
      margin-top: 10rpx;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .text {
        padding-right: 10rpx;
        font-size: 30rpx;
      }

      .give {
        font-size: $font-sm;
      }
    }
  }

  &__pay-btn {
    padding: 0 $spacing-lg;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    .btn {
      width: 650rpx;
      height: 80rpx;
      border-radius: 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0rpx 5rpx 10rpx rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
