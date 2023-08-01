<template>
  <view class="rf-mobile">
    <view
      v-if="state.mobileChangeParams.old_mobile"
      class="rf-mobile-form-wrap"
    >
      <view class="rf-mobile-form">
        <view class="rf-mobile-form__item">
          <input
            class="input"
            type="number"
            :disabled="true"
            maxlength="11"
            v-model="state.mobileChangeParams.old_mobile"
            placeholder="请输入原手机号码"
          />
        </view>
        <view class="rf-mobile-form__item">
          <input
            class="input"
            maxlength="4"
            type="number"
            v-model="state.mobileChangeParams.old_mobile_code"
            placeholder="请输入验证码"
          />
          <button
            class="rf-mobile-form__btn bg-white"
            :disabled="state.smsCodeBtnDisabled"
            @tap.stop="getSmsCode('reset-mobile', 'old_mobile')"
          >
            <text v-if="!state.smsCodeBtnDisabled">获取验证码</text>
            <text v-else class="sms-code-resend">{{
              `重新发送 (${state.codeSeconds})`
            }}</text>
          </button>
        </view>
      </view>
      <view class="pl-lg pr-lg">
        <button
          class="rf-confirm-btn"
          :class="'bg-gradual-' + themeColor.name"
          :disabled="state.btnLoading"
          :loading="state.btnLoading"
          @tap="handleMobileReset"
        >
          下一步
        </button>
      </view>
    </view>
    <view v-else class="rf-mobile-form-wrap">
      <view class="rf-mobile-form">
        <view class="rf-mobile-form__item">
          <input
            type="number"
            maxlength="11"
            v-model="state.mobileChangeParams.new_mobile"
            placeholder="请输入新手机号码"
          />
        </view>
        <view class="rf-mobile-form__item">
          <input
            class="flex-1"
            maxlength="4"
            type="number"
            v-model="state.mobileChangeParams.new_mobile_code"
            placeholder="请输入验证码"
          />
          <button
            class="rf-mobile-form__btn bg-white"
            :disabled="state.smsCodeBtnDisabled"
            @tap.stop="getSmsCode('binding-mobile', 'new_mobile')"
          >
            <text v-if="!state.smsCodeBtnDisabled">获取验证码</text>
            <text v-else class="sms-code-resend">{{
              `重新发送 (${state.codeSeconds})`
            }}</text>
          </button>
        </view>
      </view>
      <view class="pl-lg pr-lg">
        <button
          class="rf-confirm-btn"
          :class="'bg-gradual-' + themeColor.name"
          :disabled="state.btnLoading"
          :loading="state.btnLoading"
          @tap="handleMobileBinding"
        >
          修改手机号
        </button>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { reactive, } from "vue";
import { onLoad, } from "@dcloudio/uni-app";
import { currentTimestamp, } from "@/utils/dateUtil";

import mRouter from "@/utils/routerUtil";
import mRouteConfig from "@/config/routes";
import mHelper from "@/utils/helper";
import mConstData from "@/config/constData";
import mChecker from "@/utils/checker";
import mFormRule from "@/config/formRule";
import memberApi from "@/api/tinyShop/member";
import siteApi from "@/api/tinyShop/site";

import { Route, } from "@/response/route";
import store from "@/store";

const themeColor = mHelper.getThemeColor(); // 主题颜色

// 变量
let state = reactive({
  timer: null as unknown as NodeJS.Timer,
  smsCodeBtnDisabled: true,
  btnLoading: false,
  codeSeconds: 0,
  mobileChangeParams: {
    old_mobile: "",
    old_mobile_code: "",
    mobile_reset_token: "",
    new_mobile: "",
    new_mobile_code: "",
  },
});

onLoad((options) => {
  initData(options);
});

// 通用跳转封装
const navTo = (route: Route, query = {}) => {
  mRouter.push({ route, query, });
};
// 数据初始化
const initData = (options) => {
  let userInfo = store.getters["user/getUserInfo"];
  state.mobileChangeParams.old_mobile = options.mobile || userInfo.member.mobile;
  const time = currentTimestamp() - uni.getStorageSync("mobileSmsCodeTime");
  if (time < 60) {
    state.codeSeconds = mConstData.sendCodeTime - parseInt(String(time), 10);
    handleSmsCodeTime(state.codeSeconds);
  } else {
    state.codeSeconds = mConstData.sendCodeTime;
    state.smsCodeBtnDisabled = false;
    uni.removeStorageSync("mobileSmsCodeTime");
  }
};
// 获取手机验证码
const getSmsCode = async (usage: string, type: string) => {
  let checkSendCode = mChecker.check(
    { mobile: state.mobileChangeParams[type], },
    mFormRule.sendCodeRule
  );
  if (!checkSendCode) {
    mHelper.toast(mChecker.error);
    return;
  }
  try {
    const data = await siteApi.getSmsCode({
      mobile: state.mobileChangeParams[type],
      usage,
    });
    mHelper.toast(data ? `验证码发送成功, 验证码是${data}` : "验证码已发送.");
    state.smsCodeBtnDisabled = true;
    uni.setStorageSync("loginSmsCodeTime", currentTimestamp());
    handleSmsCodeTime(59);
  } catch (e) {
    // 捕获异常
  }
};
// 计算验证码倒计时
const handleSmsCodeTime = (time: number) => {
  state.timer = setInterval(() => {
    if (time === 0) {
      clearInterval(state.timer);
      state.smsCodeBtnDisabled = false;
    } else {
      state.codeSeconds = time;
      state.smsCodeBtnDisabled = true;
      time--;
    }
  }, 1000);
};
// 手机号码充值
const handleMobileReset = async () => {
  state.btnLoading = true;
  try {
    const data = (await memberApi.handleMobileReset({
      mobile: state.mobileChangeParams.old_mobile,
      code: state.mobileChangeParams.old_mobile_code,
    })) as AnyObject;
    clearInterval(state.timer);
    state.codeSeconds = mConstData.sendCodeTime;
    state.smsCodeBtnDisabled = false;
    uni.removeStorageSync("mobileSmsCodeTime");
    state.btnLoading = false;
    state.mobileChangeParams["old_mobile"] = "";
    state.mobileChangeParams["mobile_reset_token"] = data.mobile_reset_token;
  } catch (e) {
    state.btnLoading = false;
  }
};
// 手机号码绑定
const handleMobileBinding = async () => {
  state.btnLoading = true;
  try {
    await memberApi.handleMobileBinding({
      mobile: state.mobileChangeParams.new_mobile,
      code: state.mobileChangeParams.new_mobile_code,
      mobile_reset_token: state.mobileChangeParams.mobile_reset_token,
    });
    state.btnLoading = false;
    store.commit("user/logout");
    mHelper.toast("修改手机号码成功");
    navTo(mRouteConfig.login);
  } catch (e) {
    state.btnLoading = false;
  }
};
</script>
<style lang="scss" scoped>
.rf-mobile {
  background-color: $color-white;
  .rf-mobile-form-wrap {
    padding-top: 120rpx;
    margin-bottom: 36rpx;
    .rf-mobile-form {
      width: 84%;
      margin: 0 auto 80rpx;
      &__item {
        padding-bottom: 16rpx;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        display: flex;
        align-items: center;
        &:not(:last-child) {
          margin-bottom: 56rpx;
        }
        .input {
          flex: 1;
          font-size: 28rpx;
          height: 56rpx;
        }
      }
      &__btn {
        font-size: 24rpx;
        line-height: 56rpx;
        height: 56rpx;
        padding: 0 16rpx;
        color: $font-color-base;
      }
    }
  }
  .rf-confirm-btn {
    margin-top: 100rpx;
  }
}
</style>
