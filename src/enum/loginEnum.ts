// 平台判断
export enum PlatformGroupEnum {
  // H5
  TINYSHOP = "tinyShop",
  // 微信H5
  TINYSHOPWECHATMP = "tinyShopWechatMp",
  // 非微信H5
  TINYSHOPH5 = "tinyShopH5",
  // QQ小程序
  TINYSHOPQQMINI = "tinyShopQqMini",
  // 微信小程序
  TINYSHOPWECHATMINI = "tinyShopWechatMini",
  // 支付宝小程序
  TINYSHOPALIMINI = "tinyShopAliMini",
  // 百度小程序
  TINYSHOPBAIDUMINI = "tinyShopBaiduMini",
  // 字节跳动小程序
  TINYSHOPBYTEDANCEMINI = "tinyShopByteDanceMini",
  // App
  TINYSHOPAPP = "tinyShopApp",
  // Android App
  TINYSHOPANDROID = "tinyShopAndroid",
  // Ios App
  TINYSHOPIOS = "tinyShopIos",
}

// 验证码用途
export enum SmsUsageEnum {
  // 登陆
  LOGIN = "login",
  // 注册
  REGISTER = "register",
  // 修改密码
  UPPWD = "up-pwd",
}
