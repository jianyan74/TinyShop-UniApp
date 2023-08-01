<template>
  <view class="rf-login-type">
    <rf-navbar :border="false" :status-bar="true" />
    <!--logo-->
    <view class="rf-login-type__logo">
      <rf-image
        border-radius="12"
        width="180"
        height="180"
        :src="globalConfig.app_logo" />
    </view>
    <!--注册表单-->
    <view class="rf-login-type-form-wrap">
      <view class="rf-login-type-form-tab">
        <view class="rf-login-type-form-tab__item" :class="state.isLoginByPass ? 'active text-' + themeColor.name:''" @tap="state.isLoginByPass = true">
          手机号登陆
        </view>
        <view class="rf-login-type-form-tab__item" :class="!state.isLoginByPass ? 'active text-' + themeColor.name:''" @tap="state.isLoginByPass = false">
          验证码登陆
        </view>
      </view>
      <view class="rf-login-type-form">
        <view class="rf-login-type-form__item">
          <input v-model="state.loginParams.mobile" type="number" maxlength="11" placeholder="请输入手机号码">
        </view>
        <view v-if="state.isLoginByPass" class="rf-login-type-form__item">
          <input v-model="state.loginParams.password" type="password" placeholder="请输入密码" password>
          <view class="link" @tap="navTo(mRouteConfig.password)">
            忘记密码
          </view>
        </view>
        <view v-else class="rf-login-type-form__item">
          <input v-model="state.loginParams.code" maxlength="4" type="number" placeholder="请输入验证码">
          <button
            class="rf-login-type-form__btn bg-white"
            :disabled="state.smsCodeBtnDisabled"
            @tap.stop="getSmsCode()"
          >
            <text v-if="!state.smsCodeBtnDisabled" class="font-sm">获取验证码</text>
            <text v-else class="font-sm font-color-light">{{
              `重新发送 (${state.codeSeconds})`
            }}</text>
          </button>
        </view>
      </view>
      <button
        class="rf-confirm-btn"
        :disabled="state.btnLoading"
        :loading="state.btnLoading"
        :class="'bg-gradual-' + themeColor.name"
        @tap="toLogin"
      >
        登录
      </button>
      <button
        class="rf-confirm-btn bg-white"
        :disabled="state.btnLoading"
        :class="'text-' + themeColor.name"
        @tap="navTo(mRouteConfig.register)"
      >
        注册
      </button>
    </view>
    <!--协议popup-->
    <rf-protocol-popup
      v-if="state.isRfProtocolPopupShow"
      protocol-path="/pages/set/about/detail?field=register&title=注册协议"
      policy-path="/pages/set/about/detail?field=privacy&title=隐私协议"
      @popupState="popupState"
    />
    <!-- 底部协议 -->
    <view class="flex-center">
      <rf-icon
        size="44"
        class="mr-sm"
        :color="themeColor.color"
        :name="state.appAgreementDefaultSelect ? 'icondanxuan' : 'icondanxuan1'"
        @rfComponentClick="handleRfProtocolPopupShow"
      />
      <text>登录表示同意</text>
      <!-- 协议地址 -->
      <text :class="'text-' + themeColor.name" @tap="handleRfProtocolPopupShow">《{{ globalConfig.app_name }}协议》</text>
      <view class="ml-base" @tap="navTo(mRouteConfig.index)">
        返回首页
      </view>
    </view>
    <!-- 第三方登录 -->
    <view v-if="!globalConfig.close_third_party_login && (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMP || mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMINI || mHelper.platformGroupFilter('app') === PlatformGroupEnum.TINYSHOPAPP)" class="rf-login-type__footer pt-lg">
      <view class="d-header">
        <text>其他登录方式</text>
      </view>
      <view class="rf-login-type-authorize">
        <button
          :disabled="state.btnLoading"
          class="rf-login-type-authorize__btn border-color-none no-border-btn"
          open-type="getUserInfo"
          @tap="toAuthLogin">
          <rf-image width="64" height="64" :src="state.wechat" />
        </button>
        <button
          v-if="mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPBYTEDANCEMINI"
          :disabled="state.btnLoading"
          class="rf-login-type-authorize__btn border-color-none no-border-btn"
          open-type="getUserInfo"
          @tap="toAuthLogin">
          <rf-image width="64" height="64" :src="state.byteDance" />
        </button>
        <button
          v-if="mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPIOS"
          :disabled="state.btnLoading"
          class="rf-login-type-authorize__btn"
          @tap="toIosAuthLogin">
          <rf-image width="64" height="64" :src="state.apple" />
        </button>
      </view>
    </view>
    <!--绑定手机号码-->
    <rf-base-popup v-if="state.bindPhoneShow" @close="hideBindPhonePopup">
      <template #content>
        <view class="rf-bind-phone">
          <text>点击按钮进行手机号码绑定</text>
          <button :class="'bg-gradual-' + themeColor.name" class="btn border-color-none font-base" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber($event)">
            绑定手机号码
          </button>
        </view>
      </template>
    </rf-base-popup>
    <!--加载页-->
    <rf-loading :active="state.loading" />
  </view>
</template>
<script setup lang="ts">
import {computed, reactive,} from "vue";
import {onLoad, onShow,} from "@dcloudio/uni-app";

import store from "@/store";
import mSiteConfig from "@/config/site";
import mConstData from "@/config/constData";
import mRouteConfig from "@/config/routes";
import mFormRule from "@/config/formRule";
import mAssetsPath from "@/config/assets";
import mRouter from "@/utils/routerUtil";
import mHelper from "@/utils/helper";
import mChecker from "@/utils/checker";
import {currentTimestamp,} from "@/utils/dateUtil";

import memberApi from "@/api/tinyShop/member";
import siteApi from "@/api/tinyShop/site";
import thirdPartyApi from "@/api/tinyShop/thirdParty";

import {PlatformGroupEnum, SmsUsageEnum,} from "@/enum/loginEnum";
import {Route,} from "@/response/route";
const globalConfig = mHelper.getGlobalConfig(); // 全局配置
const themeColor = mHelper.getThemeColor(); // 主题颜色
const hasLogin = computed(() => store.getters["user/hasLogin"]); // 是否登录

// 本页数据变量
let state = reactive({
  codeSeconds: 0,
  smsCodeBtnDisabled: true,
  bindPhoneShow: false,
  isLoginByPass: true,
  btnLoading: false,
  loading: false,
  code: "",
  appAgreementDefaultSelect: globalConfig.member_agreement_default_select === 1,
  isRfProtocolPopupShow: false,
  wechat: mAssetsPath.wechat,
  byteDance: mAssetsPath.byteDance,
  apple: mAssetsPath.apple,
  loginParams: {
    mobile: "",
    code: "",
    password: "",
    group: "",
    promoter_code: "",
  },
});

// 生命周期
onShow( () => {
  if (hasLogin.value) {
    navTo(mRouteConfig.index);
  } else {
    store.commit("user/logout");
  }
});
onLoad( async (options: any) => {
  const time = currentTimestamp() - uni.getStorageSync("loginSmsCodeTime");
  state.loginParams.mobile = uni.getStorageSync("loginMobile") || "";
  state.loginParams.password = uni.getStorageSync("loginPassword") || "";
  if (time < 60) {
    state.codeSeconds = mConstData.sendCodeTime - parseInt(String(time));
    handleSmsCodeTime(state.codeSeconds);
  } else {
    state.codeSeconds = mConstData.sendCodeTime;
    state.smsCodeBtnDisabled = false;
    uni.removeStorageSync("loginSmsCodeTime");
  }
  const backUrl = store.getters["user/getBackToPage"];
  if (backUrl.indexOf("promoter_code") !== -1) {
    state.loginParams.promoter_code = backUrl.split("promoter_code=")[1].split("&")[0];
  } else if (options.promoter_code) {
    store.commit("user/setPromoterCode", options.promoter_code);
    state.loginParams.promoter_code = options.promoter_code;
  }
  // 用户多次点击授权登录会生成多个code 去最后一个code
  state.code = options.code && options.code.split(",")[options.code.split(",").length - 1] || "";
  if (state.code) {
    state.btnLoading = true;
    state.loading = true;
    try {
      const data:AnyObject = await thirdPartyApi.getWechatH5Login({
        code: state.code,
        promoter_code: state.loginParams.promoter_code,
      });
      if (!data.login) {
        state.loading = false;
        state.btnLoading = false;
        const user_info = data.user_info;
        uni.showModal({
          content: "您尚未绑定账号，是否跳转登录页面？",
          success: confirmRes => {
            if (confirmRes.confirm) {
              uni.setStorageSync(
                "wechatUserInfo",
                JSON.stringify(user_info)
              );
              state.btnLoading = false;
              state.loading = false;
            } else {
              state.btnLoading = false;
              state.loading = false;
            }
          },
        });
      } else {
        await store.commit("user/login", data.user_info);
        const backToPage = store.getters["user/getBackToPage"];
        if (backToPage) {
          redirectTo(backToPage);
        } else {
          reLaunch(mRouteConfig.profile);
        }
      }
    } catch (e) {
      state.loading = false;
      state.btnLoading = false;
    }
  }
  if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMINI) {
    uni.login({
      success: function(loginRes) {
        state.code = loginRes.code;
      },
      fail: function() {
        mHelper.log("暂不支持小程序登录");
      },
    });
  }
});

// 通用跳转
const navTo = (route:Route, query = {}) => {
  mRouter.push({ route, query, });
};
// 通用跳转redirectTo
const redirectTo = (url:string) => {
  uni.reLaunch({url,});
};
const reLaunch = (route:Route, query = {}) => {
  mRouter.reLaunch({ route, query, });
};
// 隐藏绑定手机号码modal
const hideBindPhonePopup = () => {
  store.commit("user/logout");
  state.bindPhoneShow = false;
};
// 显示协议popup
const handleRfProtocolPopupShow = () => {
  state.isRfProtocolPopupShow = true;
};
// 监听是否同意协议
const popupState = (e:boolean) => {
  state.isRfProtocolPopupShow = false;
  state.appAgreementDefaultSelect = e;
};
// 授权登录
const toAuthLogin = () => {
  state.btnLoading = true;
  state.loading = true;
  if (!state.appAgreementDefaultSelect) {
    mHelper.toast("请阅读并同意协议");
    state.btnLoading = false;
    state.loading = false;
    return;
  }
  // 平台判断
  if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPH5) {
    mHelper.toast("当前平台不支持微信授权登录");
    state.btnLoading = false;
    state.loading = false;
    return;
  }
  //微信浏览器
  else if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMP) {
    const href = window.location.href;
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${mSiteConfig.wxAppId}&redirect_uri=${href}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
  }
  //微信小程序
  else if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMINI) {
    wx.getUserProfile({
      desc: "用于完善用户资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (infoRes) => {
        let params = {
          ...infoRes,
          code: state.code,
          promoter_code: state.loginParams.promoter_code,
        };
        thirdPartyAuthLogin("mpWechatLogin", params);
      },
      fail: function() {
        state.loading = false;
        state.btnLoading = false;
      },
    });
  }
  //字节小程序
  else if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPBYTEDANCEMINI) {
    uni.login({
      // provider: 'toutiao',
      provider: "qq",
      success: function(loginRes) {
        uni.getUserInfo({
          provider: "qq",
          withCredentials: true,
          success: function(infoRes) {
            console.log(infoRes);
            let params = {
              ...infoRes,
              code: loginRes.code,
              promoter_code: state.loginParams.promoter_code,
            };
            thirdPartyAuthLogin("mpBytedanceLogin", params);
          },
          fail: function() {
            state.btnLoading = false;
            uni.getSetting({
              success(res) {
                if (!res.authSetting["scope.userInfo"]) {
                  uni.showModal({
                    title: "提示",
                    content: "开启用户信息授权",
                    success: function (res) {
                      if (res.confirm) {
                        uni.openSetting({
                          success() {
                            //
                          },
                          fail() {
                            //
                          },
                        });
                      } else if (res.cancel) {
                        //
                      }
                    },
                  });
                } else {
                  mHelper.log("暂不支持小程序登录");
                }
              },
            });
          },
        });
      },
      fail: function() {
        state.btnLoading = false;
        mHelper.log("暂不支持小程序登录");
      },
    });
  }
  //app
  else if (mHelper.platformGroupFilter("app") === PlatformGroupEnum.TINYSHOPAPP) {
    // eslint-disable-next-line no-undef
    plus.oauth.getServices(function(services) {
      let weixinService;
      if (services && services.length) {
        for (let i = 0, len = services.length; i < len; i++) {
          if (services[i].id === "weixin") {
            weixinService = services[i];
            break;
          }
        }
        if (!weixinService) {
          mHelper.toast("没有微信登录授权服务");
          return;
        }
        let group = "tinyShopIos";
        if (uni.getSystemInfoSync().platform === "android") {
          group = "tinyShopAndroid";
        }
        weixinService.authorize(e => {
          thirdPartyAuthLogin("thirdPartyWechat", {}, `?code=${e.code || ""}&group=${group}&promoter_code=${state.loginParams.promoter_code || ""}`);
        }, function(err) {
          // 授权失败 error
          state.loading = false;
          state.btnLoading = false;
          mHelper.toast(err.message.split(",")[0]);
        });
      }
    }, function() {
      // 获取 services 失败
      state.loading = false;
      state.btnLoading = false;
    });
  }
};
// 授权绑定
const thirdPartyAuthLogin = async (authApi, params = {}, urlStr = "") => {
  try {
    const data:AnyObject = authApi === "mpWechatLogin" ? await thirdPartyApi.handleMpWechatLogin(params): (authApi === "thirdPartyWechat" ? await thirdPartyApi.handleThirdPartyWechatOpenPlatform({}, urlStr) : await thirdPartyApi.handleMpWechatLoginMobile()) ;
    if (!data.login) {
      state.loading = false;
      state.btnLoading = false;
      const userInfo = data.user_info;
      uni.showModal({
        content: "您尚未绑定账号，是否跳转登录页面？",
        success: confirmRes => {
          if (confirmRes.confirm) {
            uni.setStorageSync(
              "wechatUserInfo",
              JSON.stringify(userInfo)
            );
            state.btnLoading = false;
            state.loading = false;
          } else {
            state.btnLoading = false;
            state.loading = false;
          }
        },
      });
    } else {
      await store.commit("user/login", data.user_info);
      // #ifdef MP-WEIXIN
      //判断是否强制绑定手机号
      if (!(data.user_info.member && data.user_info.member.mobile) && globalConfig.member_mini_program_register_get_mobile) {
        state.bindPhoneShow = true;
        state.loading = false;
        state.btnLoading = false;
        return;
      }
      // #endif
      mHelper.toast("已为您授权登录");
      const backToPage = store.getters["user/getBackToPage"];
      if (backToPage) {
        redirectTo(backToPage);
        store.commit("user/setBackToPage", {backToPage: "",});
        uni.removeStorageSync("wechatUserInfo");
      } else {
        reLaunch(mRouteConfig.profile);
      }
    }
  } catch (e) {
    //
  }
};
// 苹果授权登录
const toIosAuthLogin = () => {
  state.loading = true;
  state.btnLoading = true;
  if (!state.appAgreementDefaultSelect) {
    mHelper.toast("请阅读并同意协议");
    state.loading = false;
    state.btnLoading = false;
    return;
  }
  plus.oauth.getServices(function(services) {
    let appleService;
    if (services && services.length) {
      for (let i = 0, len = services.length; i < len; i++) {
        if (services[i].id === "apple") {
          appleService = services[i];
          break;
        }
      }
      if (!appleService) {
        state.loading = false;
        state.btnLoading = false;
        mHelper.toast("没有苹果登录授权服务");
        return;
      }
      appleService.login(async e => {
        try {
          const data:AnyObject = await thirdPartyApi.handleThirdPartyApple({
            promoter_code: state.loginParams.promoter_code,
            ...e.target.appleInfo,
          });
          if (!data.login) {
            state.loading = false;
            state.btnLoading = false;
            const userInfo = data.user_info;
            uni.showModal({
              content: "您尚未绑定账号，是否跳转登录页面？",
              success: confirmRes => {
                state.btnLoading = false;
                state.loading = false;
                if (confirmRes.confirm) {
                  uni.setStorageSync(
                    "wechatUserInfo",
                    JSON.stringify(userInfo)
                  );
                  uni.setStorageSync("oauthClient", "iOS");
                }
              },
            });
          }
        } catch (e) {
          state.loading = false;
          state.btnLoading = false;
        }
      }, function() {
        // 获取 services 失败
        state.loading = false;
        state.btnLoading = false;
      });
    }
  }, function() {
    // 获取 services 失败
    state.loading = false;
    state.btnLoading = false;
  });
};
// 获取手机号码(仅限微信小程序)
const getPhoneNumber = (e) => {
  state.btnLoading = true;
  uni.login({
    provider: "weixin",
    success: async function (loginRes) {
      try {
        await thirdPartyApi.handleMpWechatLoginMobile({
          code: loginRes.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        });
        mWebsocket.socketTask != null && mWebsocket.closeWebSocket()
        const backToPage = store.getters["user/getBackToPage"];
        if (backToPage) {
          redirectTo(backToPage);
        } else {
          reLaunch(mRouteConfig.profile);
        }
      } catch (e) {
        state.btnLoading = false;
      }
    },
    fail: function() {
      state.btnLoading = false;
      mHelper.log("暂不支持小程序登录");
    },
  });
};
// 发送验证码并进入倒计时
const getSmsCode = async () => {
  let checkSendCode = mChecker.check(
    state.loginParams,
    mFormRule.sendCodeRule
  );
  if (!checkSendCode) {
    mHelper.toast(mChecker.error);
    return;
  }
  try {
    const data = await siteApi.getSmsCode({
      mobile: state.loginParams["mobile"],
      usage: SmsUsageEnum.LOGIN,
    });
    if (data) {
      mHelper.toast(`验证码发送成功, 验证码是${data}`);
    } else {
      mHelper.toast("验证码已发送.");
    }
    state.smsCodeBtnDisabled = true;
    uni.setStorageSync("loginSmsCodeTime", currentTimestamp());
    handleSmsCodeTime(59);
  } catch (e) {
    // 捕获异常
  }
};
// 计算验证码倒计时
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
// 提交登录表单
const toLogin = async () => {
  if (!state.appAgreementDefaultSelect) {
    mHelper.toast("请先阅读协议并同意协议");
    return;
  }
  if (globalConfig.close_login) {
    mHelper.toast("暂未开放登录，敬请期待～");
    return;
  }
  uni.removeStorageSync("loginMobile");
  uni.removeStorageSync("loginPassword");
  let cheRes;
  if (state.isLoginByPass) {
    cheRes = mChecker.check(
      state.loginParams,
      mFormRule.loginByPassRule
    );
  } else {
    cheRes = mChecker.check(
      state.loginParams,
      mFormRule.loginByCodeRule
    );
  }
  if (!cheRes) {
    mHelper.toast(mChecker.error);
    return;
  }
  state.loginParams["group"] = mHelper.platformGroupFilter();
  await handleLogin(state.loginParams, state.isLoginByPass);
};
// 登录
const handleLogin = async (params, isLoginByPass:boolean) => {
  state.btnLoading = true;
  try {
    let data = await siteApi.login(params, isLoginByPass);
    mHelper.toast("恭喜您，登录成功！");
    await store.commit("user/login", data);
    const wechatUserInfo = uni.getStorageSync("wechatUserInfo");
    if (wechatUserInfo) {
      state.btnLoading = false;
      let oauth_client = "";
      if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMP) {
        oauth_client = "wechatMp";
      } else if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMINI) {
        oauth_client = "wechatMini";
      } else if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPBYTEDANCEMINI) {
        oauth_client = "bytedanceMini";
      } else if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPANDROID) {
        oauth_client = "wechat";
      } else if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPIOS) {
        oauth_client = "apple";
      }
      const userInfo = JSON.parse(wechatUserInfo);
      try {
        await memberApi.handleAuthLogin({
          ...userInfo,
          oauth_client,
        });
      }
      catch (e) {
        //
      }
    }
    uni.removeStorageSync("oauthClient");
    uni.removeStorageSync("wechatUserInfo");
    const backToPage = store.getters["user/getBackToPage"];
    if (backToPage) {
      redirectTo(backToPage);
      store.commit("user/setBackToPage", {backToPage: "",});
      uni.removeStorageSync("wechatUserInfo");
    } else {
      reLaunch(mRouteConfig.profile);
    }
  } catch (e) {
    // 捕获异常
    state.btnLoading = false;
  }
};
</script>
<style lang="scss">
.rf-login-type {
  background-color: $color-white;
  height: 100%;
  &__logo {
    margin-bottom: 80rpx;
    display: flex;
    justify-content: center;
  }
  .rf-login-type-form-wrap {
    margin-bottom: 36rpx;
    .rf-login-type-form-tab {
      width: 84%;
      margin: 0 auto 120rpx;
      display: flex;
      justify-content: space-around;
      color: #4F4F4F;
      &__item {
        font-size: 28rpx;
        line-height: 2.4;
        position: relative;
        &.active{
          &::after{
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            border-bottom: 2px solid;
            border-radius: 2px;
            box-sizing: border-box;
          }
        }
      }
    }
    .rf-login-type-form {
      width: 84%;
      margin: 0 auto 80rpx;
      &__item {
        padding-bottom: 16rpx;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        display: flex;
        align-items: center;
        &:not(:last-child){
          margin-bottom: 56rpx;
        }
        input{
          flex: 1;
          font-size: 28rpx;
          height: 56rpx;
        }
        .link{
          font-size: 28rpx;
          line-height: 2;
          color: #333;
        }
      }
      &__btn {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 56rpx;
        padding: 0 16rpx;
        color: $font-color-base;
        border-radius: 12rpx;
        border: 1rpx solid $font-color-light;
      }
    }
  }
  .rf-confirm-btn {
    width: 650rpx;
    margin-top: 42rpx;
    border-radius: 36rpx;
  }
  &__footer {
    width: 100%;
    text-align: center;
    padding-bottom: 40rpx;
    margin-top: auto;
    font-size: $font-sm + 2rpx;
    .protocol {
      color: $base-color;
      margin: 0 10rpx;
    }
    .d-header {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80rpx;
      margin-bottom: $spacing-base;
      font-size: $font-base + 2rpx;
      color: $font-color-base;
      position: relative;
      text {
        padding: 0 $spacing-lg;
        background: #fff;
        position: relative;
        z-index: 1;
      }
      &:after {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%);
        width: 300rpx;
        height: 0;
        content: '';
        border-bottom: 1px solid #ccc;
      }
    }
    .rf-login-type-authorize {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      &__btn {
        border: none;
        background: none;
        padding: 0 20rpx;
        margin: 0;
        &:after {
          border: none;
        }
      }
      .iconfont {
        font-size: 50rpx;
        color: $font-color-base;
      }
    }
  }
  .rf-bind-phone {
    opacity: 1;
    width: 480rpx;
    height: 340rpx;
    border-radius: 12rpx;
    background-color: $color-white;
    top: 24%;
    text-align: center;
    padding: 100rpx 24rpx;
    .tip {
      display: inline-block;
      color: $color-black;
      margin-bottom: 36rpx;
    }
    .btn {
      width: 80%;
      height: 72rpx;
      line-height: 72rpx;
      margin-top: 50rpx;
    }
  }
}
</style>
