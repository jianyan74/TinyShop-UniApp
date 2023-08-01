<template>
  <view class="rf-login-type">
    <view class="rf-login-type__content">
      <view class="rf-login-type__logo">
        <rf-image
          :src="globalConfig.app_logo"
          border-radius="50%"
          class="inline-block"
          height="320"
          width="320"
        />
      </view>
      <button
        :class="'text-' + themeColor.name"
        :disabled="state.btnLoading"
        class="rf-login-type__content__btn flex-align-items"
        @tap="toAuthLogin"
      >
        <rf-icon class="mr-base" name="iconweixin" size="44" />
        微信授权登录
      </button>
      <view class="text-center mt-50" @tap="navTo(mRouteConfig.login)"
      >
        手机号验证登录
      </view
      >
      <view
        class="text-center font-color-light mt-lg"
        @tap="navTo(mRouteConfig.index)"
      >
        暂不登录
      </view
      >
      <!-- 底部协议 -->
      <view class="flex-center mt-50">
        <rf-icon
          :color="themeColor.color"
          :name="
            state.appAgreementDefaultSelect ? 'icondanxuan' : 'icondanxuan1'
          "
          class="mr-sm"
          size="44"
          @tap="handleRfProtocolPopupShow"
        />
        <text>登录表示同意</text>
        <!-- 协议地址 -->
        <text
          :class="'text-' + themeColor.name"
          @tap="handleRfProtocolPopupShow"
        >《{{ globalConfig?.app_name }}协议》
        </text>
      </view>
      <view
        v-if="state.isAuthLoginShow && !globalConfig.close_third_party_login"
        class="rf-login-type__footer"
      >
        <view class="d-header">
          <text>其他登录方式</text>
        </view>
        <view class="flex-center">
          <button
            :disabled="state.btnLoading"
            :open-type="
              mHelper.platformGroupFilter() ===
                PlatformGroupEnum.TINYSHOPWECHATMINI
                ? 'getUserInfo'
                : ''
            "
            class="no-border-btn btn border-color-none"
            @tap="toAuthLogin"
          >
            <rf-image
              :src="wechat"
              class="image"
              height="64"
              width="64"
            />
          </button>
          <button
            v-if="state.isIosAuthLoginShow"
            :disabled="state.btnLoading"
            class="no-border-btn btn border-color-none"
            open-type="getUserInfo"
            @tap="toIosAuthLogin"
          >
            <rf-image
              :src="apple"
              class="image"
              height="64"
              width="64"
            />
          </button>
        </view>
      </view>
    </view>
    <!--绑定手机号码-->
    <rf-base-popup v-if="state.bindPhoneShow" @close="hideBindPhonePopup">
      <template #content>
        <view class="rf-bind-phone">
          <text>点击按钮进行手机号码绑定</text>
          <button
            :class="'bg-gradual-' + themeColor.name" class="btn border-color-none font-base"
            open-type="getPhoneNumber" @getphonenumber="getPhoneNumber($event)">
            绑定手机号码
          </button>
        </view>
      </template>
    </rf-base-popup>
    <!--协议popup-->
    <rf-protocol-popup
      v-if="state.isRfProtocolPopupShow"
      policy-path="/pages/set/about/detail?field=privacy&title=隐私协议"
      protocol-path="/pages/set/about/detail?field=register&title=注册协议"
      @popupState="popupState"
    />
    <rf-loading :active="state.loading" />
  </view>
</template>
<script lang="ts" setup>
import {computed, reactive,} from "vue";
import {onLoad, onShow,} from "@dcloudio/uni-app";
import mAssetsPath from "@/config/assets";
import mHelper from "@/utils/helper";
import store, {useStore,} from "@/store";
import mRouter from "@/utils/routerUtil";
import {Route,} from "@/response/route";
import mRouteConfig from "@/config/routes";
import {PlatformGroupEnum,} from "@/enum/loginEnum";
import thirdPartyApi from "@/api/tinyShop/thirdParty";
import mSiteConfig from "@/config/site";
import {GlobalConfig} from "@/response/config";

const wechat = mAssetsPath.wechat;
const apple = mAssetsPath.apple;
const themeColor = mHelper.getThemeColor();
const globalConfig = computed(() => {
  const st = useStore();
  return st.getters["user/getGlobalConfig"] as GlobalConfig;
});

let state = reactive({
  code: "",
  loginAuthorizedShow: false,
  bindPhoneShow: false,
  loading: false,
  btnLoading: false,
  appAgreementDefaultSelect: globalConfig.value.member_agreement_default_select === 1,
  isRfProtocolPopupShow: false, // 控制协议popup显示
  isAuthLoginShow: false,
  isIosAuthLoginShow: false,
  promoCodeParams: {
    promoter_code: "",
  },
  loginAuthorizedList: [{text: "微信", icon: "iconweixin",},],
});

onShow(() => {
  state.btnLoading = false;
  if (mHelper.hasLogin()) navTo(mRouteConfig.index);
});
onLoad(async (options: any) => {
  store.commit("user/logout");
  //h5页面 微信登陆图标
  state.isAuthLoginShow = mHelper.platformGroupFilter() !== PlatformGroupEnum.TINYSHOPH5;
  //ios apple登陆图标
  if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPIOS) {
    state.isIosAuthLoginShow = true;
  }
  //返回页路由
  const backUrl = store.getters["user/getBackToPage"];
  if (backUrl.indexOf("promoter_code") !== -1) {
    state.promoCodeParams.promoter_code = backUrl
      .split("promoter_code=")[1]
      .split("&")[0];
  } else if (options.promoter_code) {
    store.commit("user/setPromoterCode", options.promoter_code);
    state.promoCodeParams.promoter_code = options.promoter_code;
  }
  // 用户多次点击授权登录会生成多个code 去最后一个code
  state.code =
    (options.code &&
      options.code.split(",")[options.code.split(",").length - 1]) ||
    "";
  //页面存在code
  if (state.code) {
    state.btnLoading = true;
    state.loading = true;
    try {
      const data: AnyObject = await thirdPartyApi.getWechatH5Login({
        code: state.code,
        promoter_code: state.promoCodeParams.promoter_code,
      });
      if (!data.login) {
        state.loading = false;
        state.btnLoading = false;
        const user_info = data.user_info;
        uni.showModal({
          content: "您尚未绑定账号，是否跳转登录页面？",
          success: (confirmRes) => {
            if (confirmRes.confirm) {
              uni.setStorageSync("wechatUserInfo", JSON.stringify(user_info));
              navTo(mRouteConfig.login);
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
          navTo({name: '', path:backToPage});
        } else {
          navTo(mRouteConfig.profile);
        }
      }
    }
    catch (e) {
      state.loading = false;
      state.btnLoading = false;
    }
  }
  //如果时小程序平台 onload直接获取code
  if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMINI) {
    wx.login({
      success: function (loginRes) {
        state.code = loginRes.code;
      },
      fail: function () {
        mHelper.log("暂不支持小程序登录");
      },
    });
  }
});
// 隐藏绑定手机号码modal
const hideBindPhonePopup = () => {
  store.commit("user/logout");
  //如果时小程序平台 重新获取code
  if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMINI) {
    wx.login({
      success: function (loginRes) {
        state.code = loginRes.code;
      },
      fail: function () {
        mHelper.log("暂不支持小程序登录");
      },
    });
  }
  state.bindPhoneShow = false;
};
// 通用跳转
const navTo = (route: Route, query = {}) => {
  mRouter.push({route, query,});
};
// 显示协议popup
const handleRfProtocolPopupShow = () => {
  state.isRfProtocolPopupShow = true;
};
// 监听是否同意协议
const popupState = (e: boolean) => {
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
  if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPH5) { //h5
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
          promoter_code: state.promoCodeParams.promoter_code,
        };
        thirdPartyAuthLogin("mpWechatLogin", params);
      },
      fail: function () {
        state.loading = false;
        state.btnLoading = false;
      },
    });
  }
  //字节小程序
  else if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPBYTEDANCEMINI) { //字节小程序
    uni.login({
      // provider: 'toutiao',
      provider: "qq",
      success: function (loginRes) {
        uni.getUserInfo({
          provider: "qq",
          withCredentials: true,
          success: function (infoRes) {
            console.log(infoRes);
            let params = {
              ...infoRes,
              code: loginRes.code,
              promoter_code: state.promoCodeParams.promoter_code,
            };
            thirdPartyAuthLogin("mpBytedanceLogin", params);
          },
          fail: function () {
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
      fail: function () {
        state.btnLoading = false;
        mHelper.log("暂不支持小程序登录");
      },
    });
  }
  //app
  else if (mHelper.platformGroupFilter("app") === PlatformGroupEnum.TINYSHOPAPP) {
    // eslint-disable-next-line no-undef
    plus.oauth.getServices(function (services) {
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
          thirdPartyAuthLogin("thirdPartyWechat", {}, `?code=${e.code || ""}&group=${group}&promoter_code=${state.promoCodeParams.promoter_code || ""}`);
        }, function (err) {
          // 授权失败 error
          state.loading = false;
          state.btnLoading = false;
          mHelper.toast(err.message.split(",")[0]);
        });
      }
    }, function () {
      // 获取 services 失败
      state.loading = false;
      state.btnLoading = false;
    });
  }
};
// 授权绑定
const thirdPartyAuthLogin = async (authApi, params = {}, urlStr = "") => {
  try {
    const data: AnyObject = authApi === "mpWechatLogin" ? await thirdPartyApi.handleMpWechatLogin(params) : (authApi === "thirdPartyWechat" ? await thirdPartyApi.handleThirdPartyWechatOpenPlatform({}, urlStr) : await thirdPartyApi.handleMpWechatLoginMobile());
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
            navTo(mRouteConfig.login);
          } else {
            state.btnLoading = false;
            state.loading = false;
          }
        },
      });
    } else {
      await store.commit("user/login", data.user_info);
      // #ifdef MP-WEIXIN
      if (!(data.user_info.member && data.user_info.member.mobile) && globalConfig.value.member_mini_program_register_get_mobile) {
        state.bindPhoneShow = true;
        state.loading = false;
        state.btnLoading = false;
        return;
      }
      // #endif
      mHelper.toast("已为您授权登录");
      const backToPage = store.getters["user/getBackToPage"];
      if (backToPage) {
        navTo({name: '', path:backToPage});
        store.commit("user/setBackToPage", {backToPage: "",});
        uni.removeStorageSync("wechatUserInfo");
      } else {
        navTo(mRouteConfig.profile);
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
  // eslint-disable-next-line no-undef
  plus.oauth.getServices(function (services) {
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
          const data: AnyObject = await thirdPartyApi.handleThirdPartyApple({
            promoter_code: state.promoCodeParams.promoter_code,
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
                  navTo(mRouteConfig.login);
                  uni.setStorageSync("oauthClient", "iOS");
                }
              },
            });
          }
        } catch (e) {
          state.loading = false;
          state.btnLoading = false;
        }
      }, function () {
        // 获取 services 失败
        state.loading = false;
        state.btnLoading = false;
      });
    }
  }, function () {
    // 获取 services 失败
    state.loading = false;
    state.btnLoading = false;
  });
};
// 获取手机号码(仅限微信小程序)
const getPhoneNumber = (e) => {
  console.log('getPhoneNumber', e.detail.errMsg.includes('fail user deny'));
  //根据errMsg判断用户是点确认还是拒绝
  if (e.detail.errMsg.includes('fail user deny')) {
    hideBindPhonePopup();
    return;
  }
  state.btnLoading = true;
  uni.login({
    provider: "weixin",
    success: async function (loginRes) {
      console.log('loginRes', loginRes)
      try {
        await thirdPartyApi.handleMpWechatLoginMobile({
          code: loginRes.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        });
        const backToPage = store.getters["user/getBackToPage"];
        if (backToPage) {
          navTo({name: '', path:backToPage});
        } else {
          navTo(mRouteConfig.profile);
        }
      } catch (e) {
        state.btnLoading = false;
      }
    },
    fail: function () {
      state.btnLoading = false;
      mHelper.log("暂不支持小程序登录");
    },
  });
};

</script>
<style lang="scss">
.rf-login-type {
  background-color: $color-white;
  position: absolute;
  width: 100%;
  height: 100%;
  padding-top: 80rpx;

  &__footer {
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 40rpx;
    font-size: $font-sm + 2rpx;

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
        content: "";
        border-bottom: 1px solid #ccc;
      }
    }

    .btn {
      margin: 0;
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

  &__logo {
    margin: 90rpx auto 80rpx;
    width: 320rpx;
    height: 320rpx;
  }

  &__content {
    width: 100%;

    &__btn {
      width: 500rpx;
      color: $color-white;
      background-color: #36cb59;
      height: 86rpx;
    }
  }
}
</style>
