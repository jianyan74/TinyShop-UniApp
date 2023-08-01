import { http } from "@/utils/luch-request/service";

enum Api {
  // 组合套餐详情
  combinationView = "/tiny-shop/v1/marketing/combination/view",

  // 拼团
  // 拼团产品
  wholesaleProductIndex = "/tiny-shop/v1/marketing/wholesale-product/index",
  // 开团列表
  wholesaleIndex = "/tiny-shop/v1/marketing/wholesale/index",
  // 开团详情
  wholesaleView = "/tiny-shop/v1/marketing/wholesale-record/view",
  // 开团详情
  wholesaleGroupState = "/tiny-shop/v1/marketing/wholesale-record/group-state",

  // 限时折扣
  // 限时折扣列表
  discountProductIndex = "/tiny-shop/v1/marketing/discount-product/index",

  // 团购
  // 团购商品列表
  groupBuyIndex = "/tiny-shop/v1/marketing/group-buy/index",

  // 砍价
  // 砍价商品列表
  bargainProductIndex = "/tiny-shop/v1/marketing/bargain-product/index",
  // 创建砍价
  bargainLaunchCreate = "/tiny-shop/v1/marketing/bargain-launch/create",
  // 砍价详情
  bargainLaunchView = "/tiny-shop/v1/marketing/bargain-launch/view",
  // 帮好友砍价
  bargainPartakeCreate = "/tiny-shop/v1/marketing/bargain-partake/create",
  // 我的砍价列表
  bargainLaunchIndex = "/tiny-shop/v1/marketing/bargain-launch/index",

  // 可换购列表
  plusBuyIndex = "/tiny-shop/v1/marketing/plus-buy/index",

  // 好友代付详情
  peerPayDetail = "/tiny-shop/v1/marketing/peer-pay/detail",
  // 更新留言
  peerPayUpdate = "/tiny-shop/v1/marketing/peer-pay/update",
  // 定时秒杀
  secKillProduct = "/tiny-shop/v1/marketing/sec-kill-product/index",

  // 获取优惠券列表
  couponList = "/tiny-shop/v1/marketing/coupon-type/index",
  // 优惠券详情
  couponDetail = "/tiny-shop/v1/marketing/coupon-type/view",
  // 领取优惠券
  couponReceive = "/tiny-shop/v1/marketing/coupon-type/create",
  // 兑换码兑换
  couponConversion = "/tiny-shop/v1/marketing/coupon/conversion",
  // 代付订单详情
  peerPayOrderDetail = "/tiny-shop/v1/marketing/peer-pay/order-view",

  // 会员卡
  // 会员卡信息
  memberCardNewest = "/tiny-shop/v1/marketing/member-card/newest",
  // 会员卡详情
  memberCardView = "/tiny-shop/v1/marketing/member-card/view",
  // 兑换码兑换
  refillCardConversion = "/tiny-shop/v1/marketing/refill-card/conversion",

  // 充值配置
  rechargeConfigIndex = "/tiny-shop/v1/marketing/recharge-config/index",
  // 营销商品列表
  productSkuList = "/tiny-shop/v1/marketing/product-sku/index",
}

/**
 * @description: user login api
 */
const marketingApi = {
  getCombinationView(params = {}) {
    return http.get(Api.combinationView, { params });
  },
  getPlusBuyIndex(params = {}) {
    return http.get(Api.plusBuyIndex, { params });
  },
  getWholesaleProductIndex(params = {}) {
    return http.get(Api.wholesaleProductIndex, { params });
  },
  getWholesaleIndex(params = {}) {
    return http.get(Api.wholesaleIndex, { params });
  },
  getWholesaleView(params = {}) {
    return http.get(Api.wholesaleView, { params });
  },
  getGroupBuyIndex(params = {}) {
    return http.get(Api.groupBuyIndex, { params });
  },
  getDiscountProductIndex(params = {}) {
    return http.get(Api.discountProductIndex, { params });
  },
  getWholesaleGroupState(params = {}) {
    return http.get(Api.wholesaleGroupState, { params });
  },
  getBargainProductIndex(params = {}) {
    return http.get(Api.bargainProductIndex, { params });
  },
  getBargainLaunchView(params = {}) {
    return http.get(Api.bargainLaunchView, { params });
  },
  getBargainLaunchIndex(params = {}) {
    return http.get(Api.bargainLaunchIndex, { params });
  },
  handleBargainLaunchCreate(params = {}) {
    return http.post(Api.bargainLaunchCreate, params);
  },
  handleBargainPartakeCreate(params = {}) {
    return http.post(Api.bargainPartakeCreate, params);
  },
  getPeerPayDetail(params = {}) {
    return http.get(Api.peerPayDetail, { params });
  },
  getSecKillProduct(params = {}) {
    return http.get(Api.secKillProduct, { params });
  },
  handlePeerPayUpdate(params = {}, str = "") {
    return http.put(Api.peerPayUpdate + str, params);
  },
  // 获取消息
  getPeerPayOrderDetail(params = {}) {
    return http.get(Api.peerPayOrderDetail, { params });
  },
  // 获取消息
  handleRefillCardConversion(params = {}) {
    return http.post(Api.refillCardConversion, params);
  },
  // 获取消息
  getMemberCardNewest(params = {}) {
    return http.get(Api.memberCardNewest, { params });
  },
  // 获取消息
  getCouponList(params = {}) {
    return http.get(Api.couponList, { params });
  },
  // 获取消息
  getCouponDetail(params = {}) {
    return http.get(Api.couponDetail, { params });
  },
  // 获取消息
  handleCouponConversion(params = {}) {
    return http.post(Api.couponConversion, params);
  },
  // 获取消息
  handleCouponReceive(params = {}) {
    return http.post(Api.couponReceive, params);
  },
  // 获取消息
  getRechargeConfigIndex(params = {}) {
    return http.get(Api.rechargeConfigIndex, { params });
  },
  // 营销商品列表
  getProductSkuList(params = {}) {
    return http.get(Api.productSkuList, { params });
  },
};
export default marketingApi;
