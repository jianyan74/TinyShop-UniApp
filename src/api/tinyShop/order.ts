import { http } from "@/utils/luch-request/service";

enum Api {
  // 订单创建
  orderCreate = "/tiny-shop/v1/order/order/create",
  // 多商户订单创建
  orderItemsCreate = "/tiny-shop/v1/order/order/items-create",
  // 订单预览
  orderPreview = "/tiny-shop/v1/order/order/preview",
  // 营销计算
  orderMarketing = "/tiny-shop/v1/order/order/marketing",

  orderItemsPreview = "/tiny-shop/v1/order/order/items-preview",

  // 选择快递运费计算
  orderFreightFee = "/tiny-shop/v1/order/order/freight-fee",

  // 订单支付
  orderPay = "/tiny-shop/v1/common/pay/create",

  // 批量支付详情
  orderPayMapDetail = "/tiny-shop/v1/order/order/pay-info",
}

/**
 * @description: user login api
 */
const orderApi = {
  getOrderItemsPreview(params = {}) {
    return http.get(Api.orderItemsPreview, { params });
  },
  getOrderMarketingFee(params = {}) {
    return http.get(Api.orderMarketing, { params });
  },
  getOrderPayMapDetail(params = {}) {
    return http.get(Api.orderPayMapDetail, { params });
  },
  getOrderFreightFee(params = {}) {
    return http.get(Api.orderFreightFee, { params });
  },
  handleOrderItemsCreate(params = {}) {
    return http.post(Api.orderItemsCreate, params);
  },
  handleOrderPay(params = {}) {
    return http.post(Api.orderPay, params);
  },
};
export default orderApi;
