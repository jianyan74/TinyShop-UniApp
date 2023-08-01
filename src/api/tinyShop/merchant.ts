import { http } from "@/utils/luch-request/service";

enum Api {
  // 商户主页
  merchantCenter = "/tiny-shop/v1/merchant/index/index",
  // 商户详情
  merchantDetail = "/tiny-shop/v1/merchant/merchant/view",
  // 商户列表
  merchantIndex = "/tiny-shop/v1/merchant/merchant/index",

  // 核销列表
  productCodeVerifyList = "/tiny-shop/v1/merchant/product-code-verify/index",
  // 核销信息
  productCodeVerifyCheck = "/tiny-shop/v1/merchant/product-code-verify/check",
  // 核销
  productCodeVerifyVerify = "/tiny-shop/v1/merchant/product-code-verify/verify",
}

/**
 * @description: merchant api
 */
const merchantApi = {
  // 商户主页
  getMerchantIndex(params = {}) {
    return http.get(Api.merchantIndex, { params });
  },
  // 商户详情
  getMerchantDetail(params = {}) {
    return http.get(Api.merchantDetail, { params });
  },
  // 商户列表
  getMerchantCenter(params = {}) {
    return http.get(Api.merchantCenter, { params });
  },
  // 核销信息
  handleProductCodeVerifyCheck(params = {}) {
    return http.post(Api.productCodeVerifyCheck, params);
  },
  // 核销列表
  getProductCodeVerifyList(params = {}) {
    return http.get(Api.productCodeVerifyList, { params });
  },
  // 核销
  handleProductCodeVerifyVerify(params = {}) {
    return http.post(Api.productCodeVerifyVerify, params);
  },
};
export default merchantApi;
