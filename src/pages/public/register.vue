<template>
  <rf-navbar :border="false" :status-bar="true" />
  <view class="rf-register">
    <!-- 注册表单 -->
    <view class="rf-register__form">
      <view
        v-if="mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMINI"
        class="input-item input-item-sms-code">
        <view class="rf-input-sms-code">
          <view class="rf-input-sms-code__input flex-1">
            <input
              v-model="state.registerParams.mobile"
              maxlength="11"
              name="mobile"
              placeholder="请输入手机号码"
              type="number"
            >
          </view>
          <button
            :disabled="!!state.registerParams.mobile"
            class="sms-code-btn"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber($event)"
          >
            获取手机号
          </button>
        </view>
      </view>
      <view v-else class="input-item">
        <input
          v-model="state.registerParams.mobile"
          maxlength="11"
          name="mobile"
          placeholder="请输入手机号码"
          type="number"
        >
      </view>
      <view class="input-item">
        <view class="rf-input-sms-code">
          <view class="rf-input-sms-code__input flex-1">
            <input
              v-model="state.registerParams.code"
              data-key="mobile"
              maxlength="4"
              placeholder="请输入验证码"
              type="number"
            >
          </view>
          <button
            :disabled="state.smsCodeBtnDisabled"
            class="sms-code-btn"
            @tap.stop="getSmsCode()"
          >
            <text v-if="!state.smsCodeBtnDisabled" class="font-sm">获取验证码</text>
            <text v-else class="font-color-light font-sm">
              {{ `重新发送 (${state.codeSeconds})` }}
            </text>
          </button>
        </view>
      </view>
      <view class="input-item">
        <input
          v-model="state.registerParams.password"
          maxlength="18"
          placeholder="请输入密码"
          type="password"
          password
        >
      </view>
      <view class="input-item">
        <input
          v-model="state.registerParams.password_repetition"
          maxlength="18"
          placeholder="请输入确认密码"
          type="password"
          password
        >
      </view>
      <view class="input-item">
        <input
          v-model="state.registerParams.nickname"
          maxlength="12"
          placeholder="请输入您的昵称"
          type="text"
        >
      </view>
      <view v-if="globalConfig.member_register_promoter_code !== 0" class="input-item">
        <input
          v-model="state.registerParams.promoter_code"
          placeholder="请输入您的邀请码"
          type="text"
        >
      </view>
      <button
        :class="'bg-gradual-' + themeColor.name"
        :disabled="state.btnLoading"
        :loading="state.btnLoading"
        class="rf-confirm-btn"
        @tap="toRegister"
      >
        注册
      </button>
    </view>
    <!-- 功能跳转 -->
    <view class="rf-register__section">
      已经注册过了?
      <text :class="'text-' + themeColor.name" @tap="navTo(mRouteConfig.login)">马上登录</text>
    </view>
    <!-- 底部协议 -->
    <view class="rf-register__protocol">
      <rf-icon
        :class="'text-' + themeColor.name"
        :name="state.appAgreementDefaultSelect ? 'icondanxuan' : 'icondanxuan1'"
        @tap="handleAppAgreementDefaultSelectChange"
      />
      <text class="content">同意</text>
      <!-- 协议地址 -->
      <text
        :class="'text-' + themeColor.name"
        @tap="navTo(mRouteConfig.aboutDetail, {field: 'protocol_register', title: '注册协议'})">
        《注册协议》
      </text>
    </view>
  </view>
</template>
<script lang="ts" setup>
import {computed, reactive,} from "vue";
import {onLoad, onShow,} from "@dcloudio/uni-app";
import {currentTimestamp,} from "@/utils/dateUtil";
import store from "@/store";

import mFormRule from "@/config/formRule";
import mChecker from "@/utils/checker";
import mRouter from "@/utils/routerUtil";
import mHelper from "@/utils/helper";
import mConstData from "@/config/constData";
import mRouteConfig from "@/config/routes";

import siteApi from "@/api/tinyShop/site";

import {Route,} from "@/response/route";
import {PlatformGroupEnum, SmsUsageEnum,} from "@/enum/loginEnum";
import thirdPartyApi from "@/api/tinyShop/thirdParty";

const globalConfig = mHelper.getGlobalConfig(); // 全局配置
const themeColor = mHelper.getThemeColor(); // 主题颜色
const hasLogin = computed(() => store.getters["user/hasLogin"]); // 是否登录
// 本页数据变量
let state = reactive({
  registerParams: {
    mobile: "",
    nickname: "",
    code: "",
    password: "",
    password_repetition: "",
    group: "",
    promoter_code: "",
  },
  btnLoading: false,
  codeSeconds: 0,
  smsCodeBtnDisabled: true,
  appAgreementDefaultSelect: !!globalConfig.app_agreement_default_select,
});

// 页面生命周期
onShow(() => {
  if (hasLogin.value) {
    navTo(mRouteConfig.index);
  } else {
    store.commit("user/logout");
  }
});
onLoad((options: any) => {
  if (!store.getters["user/getIsFirstTimeLogin"]) state.appAgreementDefaultSelect = true;
  const time = currentTimestamp() - uni.getStorageSync("registerSmsCodeTime");
  if (time < 60) {
    state.codeSeconds = mConstData.sendCodeTime - parseInt(String(time));
    handleSmsCodeTime(state.codeSeconds);
  } else {
    state.codeSeconds = mConstData.sendCodeTime;
    state.smsCodeBtnDisabled = false;
    uni.removeStorageSync("registerSmsCodeTime");
  }
  //上一页参数中是否带有邀请码
  const backUrl = store.getters["user/getBackToPage"];
  if (backUrl.indexOf("promoter_code") !== -1) {
    state.registerParams.promoter_code = backUrl.split("promoter_code=")[1].split("&")[0];
  } else {
    //页面参数中的邀请码 如果没有 则去取由分享页链接进入后保存在本地的
    state.registerParams.promoter_code = options.promoter_code || uni.getStorageSync('promoterCode');
  }

  // 空字符串判断
  if (state.registerParams.promoter_code === 'undefined') {
    state.registerParams.promoter_code = '';
  }

  console.log('promoter_code', state.registerParams.promoter_code)
  console.log('promoter_code', uni.getStorageSync('promoterCode'))
});

// 通用跳转
const navTo = (route: Route, query = {}) => {
  mRouter.push({route, query,});
};
// 是否同意协议
const handleAppAgreementDefaultSelectChange = () => {
  state.appAgreementDefaultSelect = !state.appAgreementDefaultSelect;
};
// 获取手机验证码
const getSmsCode = async () => {
  let checkSendCode = mChecker.check(
      state.registerParams,
      mFormRule.sendCodeRule
  );
  if (!checkSendCode) {
    mHelper.toast(mChecker.error);
    return;
  }
  try {
    const data = await siteApi.getSmsCode({
      mobile: state.registerParams["mobile"],
      usage: SmsUsageEnum.REGISTER,
    });
    mHelper.toast(data ? `验证码发送成功, 验证码是${data}` : "验证码已发送.");
    state.smsCodeBtnDisabled = true;
    uni.setStorageSync("registerSmsCodeTime", currentTimestamp());
    handleSmsCodeTime(59);
  } catch (e) {
    // 捕获异常
  }
};
// 倒计时验证码发送时间
const handleSmsCodeTime = (time: number) => {
  let timer = setInterval(() => {
    if (time === 0) {
      clearInterval(timer);
      state.smsCodeBtnDisabled = false;
    } else {
      state.codeSeconds = time;
      state.smsCodeBtnDisabled = true;
      time--;
    }
  }, 1000);
};
// 获取手机号码
const getPhoneNumber = (e) => {
  uni.login({
    provider: "weixin",
    success: async loginRes => {
      try {
        const data: AnyObject = await thirdPartyApi.handleMpWechatLoginMobile({
          code: loginRes.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        });
        state.registerParams.mobile = data.phoneNumber;
      } catch (e) {
        //
      }
    },
    fail: () => {
      mHelper.log("获取手机号码失败");
    },
  });
};
// 注册账号
const toRegister = async () => {
  if (globalConfig.close_register) {
    mHelper.toast("暂未开放注册，敬请期待～");
    return;
  }
  if (!state.appAgreementDefaultSelect) {
    mHelper.toast("请勾选同意注册协议，即可注册哦");
    return;
  }
  const cheRes = mChecker.check(
      state.registerParams,
      mFormRule.registerRule
  );
  if (!cheRes) {
    mHelper.toast(mChecker.error);
    return;
  }
  if (state.registerParams["password"] !== state.registerParams["password_repetition"]) {
    mHelper.toast("两次输入的密码不一致");
    return;
  }
  state.btnLoading = true;
  state.registerParams["group"] = mHelper.platformGroupFilter();
  try {
    await siteApi.register(state.registerParams);
    state.btnLoading = false;
    mHelper.toast("恭喜您注册成功");
    uni.setStorageSync("loginMobile", state.registerParams["mobile"]);
    uni.setStorageSync("loginPassword", state.registerParams["password"]);
    uni.removeStorageSync('promoterCode')
    navTo(mRouteConfig.login);
  } catch (e) {
    // 捕获异常
    state.btnLoading = false;
  }
};
</script>
<style lang="scss">
.rf-register {
  background: $color-white;
  position: relative;
  width: 100vw;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;

  &__form {
    position: relative;
    width: 100vw;
    z-index: 90;
    background: #fff;
    padding: 0 60rpx;

    .input-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      padding: 40rpx 0 16rpx;
      border-radius: 4px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);

      input {
        height: 56rpx;
        font-size: 28rpx;
        color: $font-color-dark;
        width: 100%;
      }
    }
  }

  &__section {
    padding: 0 60rpx;
    margin: 32rpx 0 50rpx;
    width: 100%;
    font-size: 28rpx;
    color: $font-color-base;

    text {
      margin-left: 10rpx;
    }
  }

  &__protocol {
    display: flex;
    justify-content: center;
    align-items: center;

    .iconfont {
      margin-right: $spacing-sm;
      font-size: 44rpx;
    }
  }
}
</style>
