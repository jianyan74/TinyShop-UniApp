import { http } from "@/utils/luch-request/service";
import mHelper from "@/utils/helper";

enum Api {
  // 个人信息
  memberInfo = "/tiny-shop/v1/member/member/index",
  // 个人信息修改
  memberUpdate = "/tiny-shop/v1/member/member/update",

  // 收货地址列表
  addressList = "/tiny-shop/v1/member/address/index",
  // 默认收货地址
  addressDefault = "/tiny-shop/v1/member/address/default",
  // 收货地址详情
  addressDetail = "/tiny-shop/v1/member/address/view",
  // 创建收货地址
  addressCreate = "/tiny-shop/v1/member/address/create",
  // 修改收货地址
  addressUpdate = "/tiny-shop/v1/member/address/update",
  // 删除收货地址
  addressDelete = "/tiny-shop/v1/member/address/delete",

  // 我的优惠券列表
  myCouponList = "/tiny-shop/v1/member/coupon/index",
  // 清理过期优惠券
  couponClear = "/tiny-shop/v1/member/coupon/clear",

  // 获取我的订单
  orderList = "/tiny-shop/v1/member/order/index",
  // 订单确认收货
  orderTakeDelivery = "/tiny-shop/v1/member/order/take-delivery",
  // 订单确认收货(换货)
  orderAfterSaleTakeDelivery = "/tiny-shop/v1/member/order-after-sale/take-delivery\n",
  // 退货/退款申请
  orderRefundApply = "/tiny-shop/v1/member/order-product/refund-apply",
  // 售后
  orderAfterSaleApply = "/tiny-shop/v1/member/order-after-sale/apply",
  // 产品退货提交物流
  orderProductSalesReturn = "/tiny-shop/v1/member/order-product/refund-sales-return",
  // 关闭退货/退款申请
  closeOrderRefundApply = "/tiny-shop/v1/member/order-product/refund-close",
  // 获取订单详情
  orderDetail = "/tiny-shop/v1/member/order/view",
  // 删除已关闭订单
  orderDelete = "/tiny-shop/v1/member/order/delete",

  // 获取我的足迹
  footPrintList = "/tiny-shop/v1/member/footprint/index",
  // 删除我的足迹
  footPrintDel = "/tiny-shop/v1/member/footprint/delete",

  // 商品收藏列表
  collectList = "/tiny-shop/v1/member/collect/index",
  // 店铺收藏列表
  merchantCollectList = "/tiny-shop/v1/member/collect/merchant",

  // 积分余额日志
  creditsLogList = "/tiny-shop/v1/member/credits-log/index",

  // 创建订单评价
  evaluateCreate = "/tiny-shop/v1/member/evaluate/create",
  // 追加评价
  evaluateAgain = "/tiny-shop/v1/member/evaluate/again",
  // 订单商品
  orderProductIndex = "/tiny-shop/v1/member/order-product/index",

  // 发票列表
  invoiceList = "/tiny-shop/v1/member/invoice/index",
  // 发票列表
  invoiceCreate = "/tiny-shop/v1/member/invoice/create",
  // 发票编辑
  invoiceUpdate = "/tiny-shop/v1/member/invoice/update",
  // 发票详情
  invoiceDetail = "/tiny-shop/v1/member/invoice/view",
  // 默认发票
  invoiceDefault = "/tiny-shop/v1/member/invoice/default",
  // 删除发票
  invoiceDel = "/tiny-shop/v1/member/invoice/delete",
  // 开票列表
  orderInvoiceList = "/tiny-shop/v1/member/order-invoice/index",
  // 发票补领
  orderInvoiceCreate = "/tiny-shop/v1/member/order-invoice/create",

  // 意见反馈列表
  opinionList = "/tiny-shop/v1/member/opinion/index",
  // 意见反馈创建
  opinionCreate = "/tiny-shop/v1/member/opinion/create",
  // 意见反馈详情
  opinionDetail = "/tiny-shop/v1/member/opinion/view",

  // 第三方授权列表
  thirdPartyAuthList = "/tiny-shop/v1/member/auth/index",
  // 解除第三方授权列表
  thirdPartyAuthDelete = "/tiny-shop/v1/member/auth/delete",

  // 订单售后
  // 申请退款且退货
  orderCustomerRefundApply = "/tiny-shop/v1/member/order-customer/apply",
  // 退货提交物流
  orderCustomerSalesReturn = "/tiny-shop/v1/member/order-customer/sales-return",
  // 退货提交物流
  orderAfterSaleSalesReturn = "/tiny-shop/v1/member/order-after-sale/sales-return",
  // 退款且退货关闭申请
  orderCustomerRefundClose = "/tiny-shop/v1/member/order-customer/close",
  // 退款且退货关闭申请
  orderAfterSaleClose = "/tiny-shop/v1/member/order-after-sale/close",

  // 消息通知
  // 消息列表
  notifyIndex = "/tiny-shop/v1/member/notify/index",
  // 消息详情
  notifyView = "/tiny-shop/v1/member/notify/view",
  // 单个消息阅读
  notifyRead = "/tiny-shop/v1/member/notify/read",
  // 全部已读
  notifyReadAll = "/tiny-shop/v1/member/notify/read-all",
  // 删除一条或者多条
  notifyClear = "/tiny-shop/v1/member/notify/clear",
  // 清空消息记录
  notifyClearAll = "/tiny-shop/v1/member/notify/clear-all",
  // 未读消息个数
  notifyUnReadCount = "/tiny-shop/v1/member/notify/un-read-count",
  // 最新一条消息
  notifyNewest = "/tiny-shop/v1/member/notify/newest",
  // 消息提醒配置
  notifySubscriptionConfigIndex = "/tiny-shop/v1/member/notify-subscription-config/index",
  // 修改消息提醒配置
  notifySubscriptionConfigUpConfig = "/tiny-shop/v1/member/notify-subscription-config/up-config",

  // 核销码列表
  orderProductVirtualIndex = "/tiny-shop/v1/member/order-product-code/index",
  // 核销码详情
  orderProductVirtualView = "/tiny-shop/v1/member/order-product-code/view",

  // 会员等级
  memberLevelIndex = "/tiny-shop/v1/member/member-level/index",

  // 手机号码重置
  mobileReset = "/tiny-shop/v1/member/member/mobile-reset",
  // 手机号码绑定
  mobileBinding = "/tiny-shop/v1/member/member/mobile-binding",

  // 添加购物车
  cartItemCreate = "/tiny-shop/v1/member/cart-item/create",
  // 购物车列表
  cartItemList = "/tiny-shop/v1/member/cart-item/index",
  // 购物车数
  cartItemCount = "/tiny-shop/v1/member/cart-item/count",
  // 购物车数
  cartItemIndexByMerchant = "/tiny-shop/v1/member/cart-item/index-by-merchant",
  // 删除购物车商品
  cartItemDel = "/tiny-shop/v1/member/cart-item/delete-ids",
  // cartItemDel = '/tiny-shop/v1/member/cart-item/delete-ids',
  // 清空购物车
  cartItemClear = "/tiny-shop/v1/member/cart-item/clear",
  // 修改购物车商品数量
  cartItemUpdateNum = "/tiny-shop/v1/member/cart-item/update-number",
  // 修改购物车商品sku
  cartItemUpdateSku = "/tiny-shop/v1/member/cart-item/update-sku",

  // 取消未支付订单
  orderClose = "/tiny-shop/v1/member/order/close",

  // 商品评价列表
  orderProductExpressDetails = "/tiny-shop/v1/member/order-product-express/details",

  // 开团列表
  wholesaleIndex = "/tiny-shop/v1/marketing/wholesale-record/index",
  // 我的砍价列表
  myBargainIndex = "/tiny-shop/v1/member/bargain-launch/index",
  // 我的拼团记录
  myWholesaleRecord = "/tiny-shop/v1/member/wholesale-record/index",

  // 第三方绑定
  authLogin = "/tiny-shop/v1/member/auth/create",

  //  第三方绑定 微信小程序授权绑定
  wechatMiniCreate = "/tiny-shop/v1/member/auth/wechat-mini",
  // 第三方绑定 微信公众号H5授权绑定
  wechatH5Create = "/tiny-shop/v1/member/auth/wechat-mp",

  // 查询绑定状态
  isBindingCheck = "/tiny-shop/v1/member/auth/is-binding",
  // 注销账号
  memberCancel = "/tiny-shop/v1/member/member/cancel",
}

/**
 * @description: member api
 */
const memberApi = {
  // 个人信息
  getMemberInfo(params = {}) {
    return http.get(Api.memberInfo, { params });
  },
  // 获取消息
  getNotifyList(params = {}) {
    return http.get(Api.notifyIndex, { params });
  },
  // 获取消息
  getNotifyView(params = {}) {
    return http.get(Api.notifyView, { params });
  },
  // 获取消息
  handleMobileBinding(params = {}) {
    return http.post(Api.mobileBinding, params);
  },
  // 获取消息
  handleMobileReset(params = {}) {
    return http.post(Api.mobileReset, params);
  },
  // 获取消息
  getNotifyRead(params = {}) {
    return http.get(Api.notifyRead, { params });
  },
  // 获取消息
  getNotifyReadAll(params = {}) {
    return http.get(Api.notifyReadAll, { params });
  },
  // 获取消息
  getNotifyClear(params = {}) {
    return http.post(Api.notifyClear, params);
  },
  // 获取消息
  getNotifyClearAll(params = {}) {
    return http.post(Api.notifyClearAll, params);
  },
  // 获取消息
  getNotifyUnReadCount(params = {}) {
    return http.get(Api.notifyUnReadCount, { params });
  },
  // 获取消息
  getNotifyNewest(params = {}) {
    return http.get(Api.notifyNewest, { params });
  },
  // 个人信息修改
  handleMemberUpdate(params = {}, query = {}) {
    return http.put(
      Api.memberUpdate + mHelper.objParseUrlAndParam("", query),
      params
    );
  },
  // 获取消息
  getCreditsLogList(params = {}) {
    return http.get(Api.creditsLogList, { params });
  },
  // 获取消息
  getMemberLevelIndex(params = {}) {
    return http.get(Api.memberLevelIndex, { params });
  },
  // 收货地址列表
  getAddressList(params = {}) {
    return http.get(Api.addressList, { params });
  },
  // 默认收货地址
  getAddressDefault(params = {}) {
    return http.get(Api.addressDefault, { params });
  },
  // 收货地址详情
  getAddressDetail(params = {}) {
    return http.get(Api.addressDetail, { params });
  },
  // 创建收货地址
  handleAddressCreate(params = {}) {
    return http.post(Api.addressCreate, params);
  },
  // 修改收货地址
  handleAddressUpdate(params = {}, query = {}) {
    return http.put(
      Api.addressUpdate + mHelper.objParseUrlAndParam("", query),
      params
    );
  },
  // 删除收货地址
  handleAddressDelete(params = {}, query = {}) {
    return http.delete(
      Api.addressDelete + mHelper.objParseUrlAndParam("", query),
      params
    );
  },
  // 获取消息
  getCollectList(params = {}) {
    return http.get(Api.collectList, { params });
  },
  // 获取消息
  getMerchantCollectList(params = {}) {
    return http.get(Api.merchantCollectList, { params });
  },
  // 获取消息
  getFootPrintList(params = {}) {
    return http.get(Api.footPrintList, { params });
  },
  // 获取消息
  handleFootPrintDel(params = {}, query = {}) {
    return http.delete(
      Api.footPrintDel + mHelper.objParseUrlAndParam("", query),
      params
    );
  },
  // 获取消息
  getOrderProductVirtualIndex(params = {}) {
    return http.get(Api.orderProductVirtualIndex, { params });
  },
  // 获取消息
  getOrderProductVirtualView(params = {}) {
    return http.get(Api.orderProductVirtualView, { params });
  },
  // 获取消息
  getOrderDetail(params = {}) {
    return http.get(Api.orderDetail, { params });
  },
  // 获取我的订单
  getOrderList(params = {}) {
    return http.get(Api.orderList, { params });
  },
  // 订单确认收货
  getOrderTakeDelivery(params = {}) {
    return http.get(Api.orderTakeDelivery, { params });
  },
  // 订单确认收货(换货)
  handleOrderAfterSaleTakeDelivery(params = {}) {
    return http.post(Api.orderAfterSaleTakeDelivery, params);
  },
  // 产品退货提交物流
  handleOrderProductSalesReturn(params = {}) {
    return http.post(Api.orderProductSalesReturn, params);
  },
  // 退货/退款申请
  handleOrderRefundApply(params = {}) {
    return http.post(Api.orderRefundApply, params);
  },
  // 售后
  handleOrderAfterSaleApply(params = {}) {
    return http.post(Api.orderAfterSaleApply, params);
  },
  // 关闭退货/退款申请
  handleCloseOrderRefundApply(params = {}) {
    return http.post(Api.closeOrderRefundApply, params);
  },
  // 获取消息
  handleOrderCustomerRefundApply(params = {}) {
    return http.post(Api.orderCustomerRefundApply, params);
  },
  // 获取消息
  handleOrderCustomerRefundClose(params = {}) {
    return http.post(Api.orderCustomerRefundClose, params);
  },
  // 获取消息
  handleOrderAfterSaleClose(params = {}) {
    return http.post(Api.orderAfterSaleClose, params);
  },
  // 获取消息
  handleOrderCustomerSalesReturn(params = {}) {
    return http.post(Api.orderCustomerSalesReturn, params);
  },
  // 获取消息
  handleOrderAfterSaleSalesReturn(params = {}) {
    return http.post(Api.orderAfterSaleSalesReturn, params);
  },
  // 获取消息
  handleOrderDelete(params = {}, str = "") {
    return http.delete(Api.orderDelete + str, params);
  },
  // 清理过期优惠券
  handleCouponClear(params = {}) {
    return http.get(Api.couponClear, { params });
  },
  // 我的优惠券列表
  getMyCouponList(params = {}) {
    return http.get(Api.myCouponList, { params });
  },
  // 获取消息
  getNotifySubscriptionConfigIndex(params = {}) {
    return http.get(Api.notifySubscriptionConfigIndex, { params });
  },
  // 获取消息
  handleNotifySubscriptionConfigUpConfig(params = {}) {
    return http.post(Api.notifySubscriptionConfigUpConfig, params);
  },
  // 获取第三方授权登录列表
  getThirdPartyAuthList(params = {}) {
    return http.get(Api.thirdPartyAuthList, { params });
  },
  // 获取消息
  handleThirdPartyAuthDelete(params = {}, str = "") {
    return http.delete(Api.thirdPartyAuthDelete + str, params);
  },
  // 获取消息
  getInvoiceList(params = {}) {
    return http.get(Api.invoiceList, { params });
  },
  // 获取消息
  handleInvoiceCreate(params = {}) {
    return http.post(Api.invoiceCreate, params);
  },
  // 获取消息
  handleOrderInvoiceCreate(params = {}) {
    return http.post(Api.orderInvoiceCreate, params);
  },
  // 获取消息
  handleInvoiceUpdate(params = {}, str = "") {
    return http.put(Api.invoiceUpdate + str, params);
  },
  // 获取消息
  getInvoiceDetail(params = {}) {
    return http.get(Api.invoiceDetail, { params });
  },
  // 获取消息
  getOrderInvoiceList(params = {}) {
    return http.get(Api.orderInvoiceList, { params });
  },
  // 获取消息
  getInvoiceDefault(params = {}) {
    return http.get(Api.invoiceDefault, { params });
  },
  // 获取消息
  handleInvoiceDel(params = {}, str = "") {
    return http.delete(Api.invoiceDel + str, params);
  },
  // 获取消息
  getOpinionList(params = {}) {
    return http.get(Api.opinionList, { params });
  },
  // 获取消息
  getOpinionDetail(params = {}) {
    return http.get(Api.opinionDetail, { params });
  },
  // 获取消息
  handleOpinionCreate(params = {}) {
    return http.post(Api.opinionCreate, params);
  },
  // 获取消息
  getOrderProductIndex(params = {}) {
    return http.get(Api.orderProductIndex, { params });
  },
  // 获取消息
  handleEvaluateAgain(params = {}, str = "") {
    return http.post(Api.evaluateAgain + str, params);
  },
  // 获取消息
  handleEvaluateCreate(params = {}) {
    return http.post(Api.evaluateCreate, params);
  },

  getCartItemIndexByMerchant(params = {}) {
    return http.get(Api.cartItemIndexByMerchant, { params });
  },
  getCartItemList(params = {}) {
    return http.get(Api.cartItemList, { params });
  },
  handleCartItemDel(params = {}, str = "") {
    return http.post(Api.cartItemDel + str, params);
  },
  handleCartItemClear(params = {}) {
    return http.post(Api.cartItemClear, params);
  },
  handleCartItemUpdateNum(params = {}) {
    return http.post(Api.cartItemUpdateNum, params);
  },
  handleCartItemUpdateSku(params = {}) {
    return http.post(Api.cartItemUpdateSku, params);
  },
  handleOrderClose(params = {}) {
    return http.get(Api.orderClose, { params });
  },
  getWholesaleIndex(params = {}) {
    return http.get(Api.wholesaleIndex, { params });
  },
  handleCartItemCreate(params = {}) {
    return http.post(Api.cartItemCreate, params);
  },
  getCartItemCount(params = {}) {
    return http.get(Api.cartItemCount, { params });
  },
  getOrderProductExpressDetails(params = {}) {
    return http.get(Api.orderProductExpressDetails, { params });
  },
  // 第三方绑定
  handleAuthLogin(params = {}) {
    return http.post(Api.authLogin, params);
  },
  // 第三方绑定 微信小程序发起授权绑定
  handleAuthWechatMini(params={}) {
    return http.post(Api.wechatMiniCreate, params);
  },
  // 第三方绑定 微信公众号H5发起授权绑定
  handleAuthWechatMp(params={}){
    return http.post(Api.wechatH5Create, params);
  },

  // 第三方绑定
  handleMemberCancel(params = {}) {
    return http.post(Api.memberCancel, params);
  },
  // 获取手机验证码
  getIsBindingCheck(params = {}) {
    return http.post(Api.isBindingCheck, params);
  },
  // 我的砍价
  getMyBargainIndex(params = {}) {
    return http.get(Api.myBargainIndex, { params });
  },
  // 我的拼团记录
  getMyWholesaleRecord(params = {}) {
    return http.get(Api.myWholesaleRecord, { params });
  },
};
export default memberApi;
