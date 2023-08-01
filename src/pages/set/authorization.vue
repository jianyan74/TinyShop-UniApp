<template>
  <view class="rf-authorization-list">
    <view v-if="state.thirdPartyAuthList.length > 0" class="m-base">
      <view
        v-for="(item, index) in state.thirdPartyAuthList"
        :key="index"
        :class="{ unbind: !item.id }"
        class="flex-align-items bg-white mb-base p-lg"
      >
        <rf-image
          :src="item.head_portrait || headImg"
          border-radius="50%"
          class="head_portrait"
          height="72"
          width="72"
        />
        <view class="flex-1 ml-base">
          <view>{{ oauthClientFilter(item.oauth_client) }}</view>
          <view v-if="item.updated_at" class="font-sm font-color-light">
            授权时间: {{ time(item.updated_at) }}
          </view>
        </view>
        <button
          v-if="item.id"
          :class="'bg-gradual-' + themeColor.name"
          class="font-sm border-radius-6"
          @tap.stop="unBind(item.id)"
        >
          解除绑定
        </button
        >
        <button
          v-else
          :class="'bg-gradual-' + themeColor.name"
          :open-type="item.oauth_client === 'wechatMini' ? 'getUserInfo' : ''"
          class="font-sm border-radius-6"
          @tap.stop="authorize(item.oauth_client)"
        >
          发起授权
        </button
        >
      </view>
    </view>
    <rf-load-more
      v-if="state.thirdPartyAuthList.length > 0"
      :status="state.loadingType"
    />
    <rf-empty
      v-if="state.thirdPartyAuthList.length === 0 && !state.loading"
      info="您暂未授权第三方平台~"
    />
    <!--加载动画-->
    <rf-loading :active="state.loading" />
  </view>
</template>
<script lang="ts" setup>
import {reactive,} from "vue";
import {onLoad, onPullDownRefresh, onReachBottom,} from "@dcloudio/uni-app";
import {formatToDateTime,} from "@/utils/dateUtil";
import mAssetsPath from "@/config/assets";
import mHelper from "@/utils/helper";
import memberApi from "@/api/tinyShop/member";
import thirdPartyApi from "@/api/tinyShop/thirdParty";
import {PlatformGroupEnum,} from "@/enum/loginEnum";
import mSiteConfig from "@/config/site";

const themeColor = mHelper.getThemeColor(); // 主题颜色
const allList = [
  {
    oauth_client: "wechatMp",
    head_portrait: mAssetsPath.wechat,
  },
  {
    oauth_client: "wechatMini",
    head_portrait: mAssetsPath.wechat,
  },
  {
    oauth_client: "wechat",
    head_portrait: mAssetsPath.wechat,
  },
  {
    oauth_client: "apple",
    head_portrait: mAssetsPath.apple,
  },
  {
    oauth_client: "bytedanceMini",
    head_portrait: mAssetsPath.byteDance,
  },
];
const headImg = mAssetsPath.headImg;

let state = reactive({
  page: 1,
  loadingType: "more",
  thirdPartyAuthList: [] as AnyObject[],
  loading: true,
  btnLoading: false,
  isIosAuthLoginShow: false,
  code: ''
});

onLoad(async (options: any) => {
  // 判断是否是微信公众号H5发起授权回调后跳转页面
  if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMP) {
    // 用户多次点击授权登录会生成多个code 去最后一个code
    const code =
        (options.code &&
            options.code.split(",")[options.code.split(",").length - 1]) ||
        "";
    // 存在code 绑定授权
    if (code) {
      memberApi.handleAuthWechatMp({code: code}).then(() => {
        mHelper.toast('绑定成功')
      }).catch(() => {
        mHelper.toast('绑定失败')
      })
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
  initData();
});
//发起授权
const authorize = async (type: string) => {
  // 字节小程序
  if (type === "bytedanceMini" && mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPBYTEDANCEMINI) {
    uni.getUserInfo({
      success: async (infoRes) => {
        let userInfo = infoRes.userInfo as AnyObject;
        try {
          await memberApi.handleAuthLogin({
            ...userInfo,
            oauth_client: type,
            gender: userInfo.sex || userInfo.gender,
            oauth_client_user_id:
                userInfo.user || userInfo.openid || userInfo.openId,
            head_portrait: userInfo.headimgurl || userInfo.avatarUrl,
          });
          mHelper.toast('绑定成功')
          initData();
        } catch (e) {
          //
        }
      },
    });
  }
  // 微信小程序
  else if (type === "wechatMini") {
    if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMINI) {
      console.log('code', state.code)
      wx.getUserProfile({
        desc: "用于完善用户资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: async function (infoRes) {
          console.log('getUserProfile', infoRes)
          await memberApi.handleAuthWechatMini({
            signature: infoRes.signature,
            encryptedData: infoRes.encryptedData,
            rawData: infoRes.rawData,
            iv: infoRes.iv,
            code: state.code
          }).then(() => {
            state.code = '';
            mHelper.toast('绑定成功')
            initData();
          }).catch(() => {
            mHelper.toast('绑定失败')
          })
        },
        fail: function (e) {
          console.error('getUserProfile', e)
        }
      });
    } else {
      mHelper.toast("请使用微信小程序登录");
    }
  }
  // 微信公众号 h5
  else if (type === "wechatMp") { // 微信公众号 h5
    if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMP) {
      const href = window.location.href;
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${mSiteConfig.wxAppId}&redirect_uri=${href}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    } else {
      mHelper.toast("请使用微信H5登录");
    }
  }
  //apple 授权
  else if (type === "apple" && mHelper.platformGroupFilter("app") === PlatformGroupEnum.TINYSHOPAPP) {
    if (!state.isIosAuthLoginShow) {
      mHelper.toast("请在苹果手机上进行操作");
      return;
    }
    // eslint-disable-next-line no-undef
    plus.oauth.getServices(
        function (services) {
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
            appleService.login(
                async (e) => {
                  await thirdPartyApi.handleThirdPartyApple({
                    ...e.target.appleInfo,
                    // ...promoterCodeParams
                  }).then(() => {
                    state.code = '';
                    mHelper.toast('绑定成功')
                    initData();
                  }).catch(() => {
                    mHelper.toast('绑定失败')
                  })
                },
                function () {
                  // 获取 services 失败
                  state.loading = false;
                  state.btnLoading = false;
                }
            );
          }
        },
        function () {
          // 获取 services 失败
          state.loading = false;
          state.btnLoading = false;
        }
    );
  }
  // 微信开放平台  app使用
  else if (type === "wechat") {
    if (mHelper.platformGroupFilter("app") === PlatformGroupEnum.TINYSHOPAPP) {
      // eslint-disable-next-line no-undef
      plus.oauth.getServices(
          function (services) {
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
              console.log("authorize");
              weixinService.authorize(
                  async (e) => {
                    await thirdPartyApi.handleThirdPartyWechatOpenPlatform(
                        {},
                        `?code=${e.code || ""}&group=${group}&promoter_code=$ ""}`
                    ).then(() => {
                      state.code = '';
                      mHelper.toast('微信授权成功')
                      initData();
                    }).catch(() => {
                      mHelper.toast('绑定失败')
                    })
                  },
                  function (err) {
                    mHelper.toast(err.message);
                    // 授权失败 error
                  }
              );
            }
          },
          function (err) {
            console.log("err", err);
            // 获取 services 失败
          }
      );
    } else {
      mHelper.toast("请使用微信开放平台登录");
    }
  }
};
// 下拉刷新
onPullDownRefresh(() => {
  state.page = 1;
  state.thirdPartyAuthList.length = 0;
  state.loading = true;
  getThirdPartyAuthList("refresh");
});
// 加载更多
onReachBottom(() => {
  if (state.loadingType === "noMore") return;
  if (state.loadingType === "noMore") return;
  state.page++;
  getThirdPartyAuthList();
});

// 格式化时间
const time = (val: string) => {
  return formatToDateTime(parseInt(val) * 1000);
};
// 授权字段
const oauthClientFilter = (val: string) => {
  switch (val) {
    case "wechatMp":
      return "微信公众号";
    case "wechatMini":
      return "微信小程序";
    case "qq":
      return "QQ小程序";
    case "sina":
      return "新浪";
    case "wechat":
      return "微信开放平台";
    case "apple":
      return "apple苹果";
    case "bytedanceMini":
      return "字节跳动小程序";
  }
};
// 数据初始化
const initData = () => {
  if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPIOS) {
    state.isIosAuthLoginShow = true;
  }
  state.page = 1;
  state.thirdPartyAuthList.length = 0;
  getThirdPartyAuthList();
};
// 获取列表
const getThirdPartyAuthList = async (type = "") => {
  try {
    const data =
        (await memberApi.getThirdPartyAuthList()) as unknown as AnyObject[];
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
    state.loadingType = data.length < 10 ? "noMore" : "more";
    state.thirdPartyAuthList = [...state.thirdPartyAuthList, ...data,];
    allList.forEach((fItem) => {
      let existence = false;
      state.thirdPartyAuthList.forEach((sItem: AnyObject) => {
        if (fItem.oauth_client === sItem.oauth_client) existence = true;
      });
      if (!existence) {
        state.thirdPartyAuthList.push(fItem);
      }
    });
  } catch (e) {
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
  }
};
// 解绑第三方授权登录
const unBind = async (id: string) => {
  memberApi.handleThirdPartyAuthDelete({}, `?id=${id}`).then(() => {
    mHelper.toast('解绑成功')
    initData();
  }).catch(() => {
    mHelper.toast('解绑失败')
  })
};
</script>
<style lang="scss">
.rf-authorization-list {
  background-color: $page-color-base;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
