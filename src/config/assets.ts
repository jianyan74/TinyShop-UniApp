import siteConfig from "./site";
const PATH = siteConfig.assetsPath;
/*
 * 图片静态资源表，所有图片资源路径在这统一管理，不应该写死在页面中，该数据挂载到Vue原型中。
 * 页面使用：this.$mAssetsPath.grid_1
 * CSS背景：应尽量使用:style="" 行内样式设置背景图
 * PATH说明：本地路径或者服务器路径
 *
 * 举例：<image :src="grid_1">  需要在data中映射 grid_1: this.$mAssetsPath.grid_1
 *
 * 特别注意：经测试小程序中不支持 <image :src="$mAssetsPath.grid_1"> 该用法
 */

const mAssetsPath = {
  // 公共
  shareBg: `${PATH}/common/share-bg.png`, // 分享引导背景
  noNetWorkImg: `${PATH}/common/no-net-work.png`, // 500
  notFoundImg: `${PATH}/common/not-found.png`, // 404
  notDataImg: `${PATH}/common/not-data.png`, // 找不到数据
  vipBg: `${PATH}/common/vip-bg.png`, // 会员卡背景
  vipMemberBg: `${PATH}/common/vip_member_bg.png`, // 会员卡背景
  upgradeTop: `${PATH}/common/upgrade-top.png`, // 升级图标
  openSiteBg: `${PATH}/common/open-site-bg.png`, // 开放站点
  vipPrice: `${PATH}/common/vip-price.png`, // vip价格
  moneyBg: `${PATH}/common/money-bg.png`, // 微信授权登录
  wechat: `${PATH}/common/wechat.png`, // 微信
  byteDance: `${PATH}/common/byte-dance.png`, // 抖音授权登录
  apple: `${PATH}/common/apple.png`, // 微信授权登录
  qq: `${PATH}/common/qq.png`, // QQ授权登录
  weibo: `${PATH}/common/weibo.png`, // 新浪授权登录
  headImg: `${PATH}/common/missing-face.png`, // 默认头像
  errorImage: `${PATH}/common/errorImage.jpg`, // 出错填充图片
  logo: `${PATH}/common/logo.png`, // 品牌logo
  defaultImg: `${PATH}/common/default-img.png`, // 默认图片

  // 我的
  userBg: `${PATH}/profile/user-bg.png`,
  profileVipCardBg: `${PATH}/profile/vip-card-bg.png`,
  distributeBanner: `${PATH}/profile/distribute-banner.png`,
  usedCoupon: `${PATH}/profile/used-coupon.png`,
  invalidCoupon: `${PATH}/profile/invalid-coupon.png`,
  toVipBg: `${PATH}/profile/to-vip-bg.png`,

  // 分销
  distributeApply: `${PATH}/distribute/distribute-apply.png`,
  distributeTag: `${PATH}/distribute/distribute-tag.png`,
  distributeIndexBg: `${PATH}/distribute/distribute-index-bg.png`,
  distributeRankBg: `${PATH}/distribute/distribute-rank-bg.png`,
  distributeBg: `${PATH}/distribute/distribute-bg.png`,
  firstTag: `${PATH}/distribute/first.png`,
  secondTag: `${PATH}/distribute/second.png`,
  thirdTag: `${PATH}/distribute/third.png`,

  // 活动
  signInBg: `${PATH}/sign/sign-in-bg.png`,
  signInChecked: `${PATH}/sign/sign-in-checked.png`,
  signInPoint: `${PATH}/sign/sign-in-point.png`,
  signInCoupon: `${PATH}/sign/sign-in-coupon.png`,
  signInGrowth: `${PATH}/sign/sign-in-growth.png`,
  signInMore: `${PATH}/sign/sign-in-more.png`,
  signInRankBg: `${PATH}/sign/sign-in-rank-bg.png`,
  signInSuccess: `${PATH}/sign/sign-in-success.png`,
  // luckyWheelBg: `${PATH}/big-wheel/lucky-wheel-bg.png`,
  // luckyWheelTitle: `${PATH}/big-wheel/lucky-wheel-title.png`,
  // luckyWheelTit: `${PATH}/big-wheel/lucky-wheel-tit.png`,
  // thanks: `${PATH}/big-wheel/thanks.png`, // 谢谢惠顾

  // 营销
  bargainBg: `${PATH}/marketing/bargain-bg.png`,
  bargainBanner: `${PATH}/marketing/bargain-banner.png`,
  defaultPrize: `${PATH}/marketing/default-prize.png`, // 默认奖品
  wholesaleTagBg: `${PATH}/marketing/wholesale-tag-bg.png`, // 拼团营销背景图
  bargainTagBg: `${PATH}/marketing/bargain-tag-bg.png`, // 砍价营销背景图
  groupBuyTagBg: `${PATH}/marketing/group-buy-tag-bg.png`, // 团购营销背景图
  presellTagBg: `${PATH}/marketing/presell-tag-bg.png`, // 预售营销背景图
  discountTagBg: `${PATH}/marketing/discount-tag-bg.png`, // 限时折扣营销背景图
  secKillTagBg: `${PATH}/marketing/sec-kill-tag-bg.png`, // 秒杀背景图
  pointTagBg: `${PATH}/marketing/point-tag-bg.png`, // 积分兑换背景图
  vipBtnBg: `${PATH}/marketing/vip-btn-bg.png`, // 会员卡按钮
  vipIcon: `${PATH}/marketing/vip-icon.png`, // 会员卡图标
  productCodeScan: `${PATH}/marketing/product-code-scan.png`, // 核销码扫码
  productCodeInput: `${PATH}/marketing/product-code-input.png`, // 核销码输入

  // 装修decorate
  textTag0: `${PATH}/decorate/text-tag-0.png`, // 标题图标
  textTag1: `${PATH}/decorate/text-tag-1.png`, // 标题图标
  textTag2: `${PATH}/decorate/text-tag-2.png`, // 标题图标
  textTag3: `${PATH}/decorate/text-tag-3.png`, // 标题图标
  textTag4: `${PATH}/decorate/text-tag-4.png`, // 标题图标
  textTag5: `${PATH}/decorate/text-tag-5.png`, // 标题图标
  textTag6: `${PATH}/decorate/text-tag-6.png`, // 标题图标
};

export default mAssetsPath;
