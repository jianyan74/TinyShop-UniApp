<template>
  <view class="rf-password">
    <view class="rf-password__form">
      <view class="rf-password__form__item">
        <input
          class="login-type-input"
          type="number"
          name="mobile"
          v-model="state.resetPasswordParams.mobile"
          placeholder="请输入手机号码"
          maxlength="11"
        />
      </view>
      <view class="rf-password__form__item input-item-sms-code">
        <view class="rf-input-sms-code">
          <view class="rf-input-sms-code__input flex-1">
            <input
              type="number"
              v-model="state.resetPasswordParams.code"
              placeholder="请输入验证码"
              maxlength="4"
            />
          </view>
          <button
            class="sms-code-btn"
            :disabled="state.smsCodeBtnDisabled"
            @tap.stop="getSmsCode()"
          >
            <text v-if="!state.smsCodeBtnDisabled">获取验证码</text>
            <text v-else class="font-color-light">{{
              `重新发送 (${state.codeSeconds})`
            }}</text>
          </button>
        </view>
      </view>
      <view class="rf-password__form__item">
        <input
          type="password"
          v-model="state.resetPasswordParams.password"
          placeholder="请输入密码"
          maxlength="20"
        />
      </view>
      <view class="rf-password__form__item">
        <input
          type="password"
          v-model="state.resetPasswordParams.password_repetition"
          placeholder="请输入确认密码"
          maxlength="20"
        />
      </view>
    </view>
    <button
      class="rf-confirm-btn"
      :class="'bg-gradual-' + themeColor.name"
      :disabled="state.btnLoading"
      :loading="state.btnLoading"
      @tap="toUpdatePassword"
    >
      {{ state.type === "1" ? "修改密码" : "找回密码" }}
    </button>
    <view class="text-center mt-lg">
      又想起密码了？
      <text
        @tap="navTo(mRouteConfig.login)"
        class="mr-sm"
        :class="'text-' + themeColor.name"
      >
        马上登陆
      </text>
      或者
      <text @tap="navTo(mRouteConfig.index)" :class="'text-' + themeColor.name"
        >返回主页</text
      >
    </view>
  </view>
</template>
<script lang="ts" setup>
import mChecker from "@/utils/checker";
import { reactive, } from "vue";
import { onLoad, } from "@dcloudio/uni-app";
import { currentTimestamp, } from "@/utils/dateUtil";
import mConstData from "@/config/constData";
import mFormRule from "@/config/formRule";
import mRouter from "@/utils/routerUtil"; // 路由方法
import mHelper from "@/utils/helper";
import siteApi from "@/api/tinyShop/site";
import store from "@/store";
import mRouteConfig from "@/config/routes";
import { Route, } from "@/response/route";
import { SmsUsageEnum, } from "@/enum/loginEnum"; // 通用方法

// 常量
const themeColor = mHelper.getThemeColor(); // 主题颜色
// 变量
let state = reactive({
  resetPasswordParams: {
    mobile: "",
    password: "",
    password_repetition: "",
    code: "",
  },
  btnLoading: false,
  type: "",
  smsCodeBtnDisabled: true,
  reqBody: {} as AnyObject,
  codeSeconds: 0, // 验证码发送时间间隔
});

onLoad((options) => {
  let userInfo = store.getters["user/getUserInfo"];
  state.resetPasswordParams.mobile = userInfo.member?.mobile || "";
  const time = currentTimestamp() - uni.getStorageSync("pwdSmsCodeTime");
  if (time < 60) {
    state.codeSeconds = mConstData.sendCodeTime - parseInt(String(time));
    handleSmsCodeTime(state.codeSeconds);
  } else {
    state.codeSeconds = mConstData.sendCodeTime;
    state.smsCodeBtnDisabled = false;
    uni.removeStorageSync("pwdSmsCodeTime");
  }
  state.type = options.type || "";
  uni.setNavigationBarTitle({
    title: state.type === "1" ? "修改密码" : "找回密码",
  });
});
// 获取手机验证码
const getSmsCode = async () => {
  state.reqBody["mobile"] = state.resetPasswordParams["mobile"];
  let checkSendCode = mChecker.check(state.reqBody, mFormRule.sendCodeRule);
  if (!checkSendCode) {
    mHelper.toast(mChecker.error);
    return;
  }

  try {
    const data = await siteApi.getSmsCode({
      mobile: state.resetPasswordParams["mobile"],
      usage: SmsUsageEnum.UPPWD,
    });
    mHelper.toast(data ? `验证码发送成功, 验证码是${data}` : "验证码已发送.");
    state.smsCodeBtnDisabled = true;
    uni.setStorageSync("pwdSmsCodeTime", currentTimestamp());
    handleSmsCodeTime(59);
  } catch (e) {
    // 捕获异常
  }
};
const handleSmsCodeTime = (time) => {
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
// 更新密码
const toUpdatePassword = async () => {
  state.reqBody["mobile"] = state.resetPasswordParams["mobile"];
  state.reqBody["password"] = state.resetPasswordParams["password"];
  state.reqBody["code"] = state.resetPasswordParams["code"];
  const cheRes = mChecker.check(state.reqBody, mFormRule.resetPasswordRule);
  if (!cheRes) {
    mHelper.toast(mChecker.error);
    return;
  }
  if (
    state.resetPasswordParams["password"] !==
    state.resetPasswordParams["password_repetition"]
  ) {
    mHelper.toast("两次输入的密码不一致");
    return;
  }
  state.reqBody["password_repetition"] =
    state.resetPasswordParams["password_repetition"];
  state.reqBody.group = mHelper.platformGroupFilter();
  state.btnLoading = true;
  try {
    await siteApi.handleUpdatePassword(state.reqBody);
    state.btnLoading = false;
    store.commit("user/logout");
    mHelper.toast("密码重置成功");
    uni.setStorageSync("loginMobile", state.reqBody["mobile"]);
    uni.setStorageSync("loginPassword", state.reqBody["password"]);
    navTo(mRouteConfig.login);
  } catch (e) {
    //
    state.btnLoading = false;
  }
};
// 通用跳转
const navTo = (route: Route, query = {}) => {
  mRouter.push({ route, query, });
};
</script>
<style lang="scss">
.rf-password {
  background-color: $page-color-base;
  position: absolute;
  width: 100%;
  height: 100%;
  padding-top: 80rpx;
  &__form {
    padding: 0 60rpx;
    &__item {
      position: relative;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      padding: 48rpx 0 20rpx;
    }
  }
  .rf-confirm-btn {
    width: 650rpx;
  }
}
</style>
