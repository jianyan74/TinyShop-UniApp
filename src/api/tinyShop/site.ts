import {
  http
} from "@/utils/luch-request/service";

enum Api {
  // 密码注册
  registerByPass = "/tiny-shop/v1/site/register",

  // 密码登录
  loginByPass = "/tiny-shop/v1/site/login",

  // 密码重置
  updatePassword = "/tiny-shop/v1/site/up-pwd",

  // 手机号登录
  loginBySmsCode = "/tiny-shop/v1/site/mobile-login",

  // 获取手机验证码
  smsCode = "/tiny-shop/v1/site/sms-code",

  // 退出登录
  logout = "/tiny-shop/v1/site/logout",

  // 刷新token
  refreshToken = "/tiny-shop/v1/site/refresh",

  // 登录令牌有效性检测
  verifyAccessToken = "/tiny-shop/v1/site/verify-access-token",
}

/**
 * @description: site api
 */
const siteApi = {
  refreshToken: Api.refreshToken,
  // 用户登录
  login(params = {}, isLoginByPass: boolean) {
    return http.post(isLoginByPass ? Api.loginByPass : Api.loginBySmsCode, params);
  },
  //更新用户信息
  register(params = {}) {
    return http.post(Api.registerByPass, params);
  },
  //更新用户信息
  handleVerifyAccessToken(params = {}) {
    return http.post(Api.verifyAccessToken, params);
  },
  //更新用户信息
  handleUpdatePassword(params = {}) {
    return http.post(Api.updatePassword, params);
  },
  //更新用户信息
  logout(params = {}) {
    return http.post(Api.logout, params);
  },
  // 获取手机验证码
  getSmsCode(params = {}) {
    return http.post(Api.smsCode, params);
  }
};


export default siteApi;

