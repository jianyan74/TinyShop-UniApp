import {
  http
} from "@/utils/luch-request/service";

enum Api {

  // 充值配置
  wechatConfig = "/tiny-shop/v1/third-party/wechat-mp-js-sdk",

  // 微信授权登录
  wechatH5Login = "/tiny-shop/v1/third-party/wechat-mp",
  // 微信小程序获取手机号码
  mpWechatLoginMobile = "/tiny-shop/v1/third-party/wechat-mini-mobile",

  // 微信小程序授权登录
  mpWechatLogin = "/tiny-shop/v1/third-party/wechat-mini",

  // 抖音小程序授权登录
  mpBytedanceLogin = "/tiny-shop/v1/third-party/byte-dance-mini",

  // App微信授权登录
  thirdPartyWechat = "/tiny-shop/v1/third-party/wechat",

  // Ios苹果扥估
  thirdPartyApple = "/tiny-shop/v1/third-party/apple",

  // 第三方二维码
  thirdPartyWechatMiniQrCode = "/tiny-shop/v1/third-party/wechat-mini-qr-code",

}

/**
 * @description: user login api
 */
const thirdPartyApi = {
  //更新用户信息
  handleWechatConfig(params = {}) {
    return http.post(Api.wechatConfig, params);
  },
  //更新用户信息
  handleThirdPartyWechatOpenPlatform(params = {}, str = "") {
    return http.post(Api.thirdPartyWechat + str, params);
  },
  //更新用户信息
  handleThirdPartyApple(params = {}) {
    return http.post(Api.thirdPartyApple, params);
  },
  //更新用户信息
  handleMpWechatLoginMobile(params = {}) {
    return http.post(Api.mpWechatLoginMobile, params);
  },
  //小程序授权登录
  handleMpWechatLogin(params={}){
    return http.post(Api.mpWechatLogin, params)
  },
  getThirdPartyQrCode(params = {}) {
    return http.get(Api.thirdPartyWechatMiniQrCode, {params});
  },
  getWechatH5Login(params = {}) {
    return http.get(Api.wechatH5Login, {params});
  }
};
export default thirdPartyApi;
