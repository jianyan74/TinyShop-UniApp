import {
  http
} from "@/utils/luch-request/service";

enum Api {
  // 产品分类列表
  productCate = "/tiny-shop/v1/product/cate/index",
  // 首页推荐分类
  productCateList = "/tiny-shop/v1/product/cate/list",
  // 产品列表
  productList = "/tiny-shop/v1/product/product/index",
  // 产品详情
  productDetail = "/tiny-shop/v1/product/product/view",
  // 产品基础详情
  productBaseDetail = "/tiny-shop/v1/product/product/view-by-base",
  // 猜您喜欢
  guessYouLikeList = "/tiny-shop/v1/product/product/guess-you-like",

  // 品牌列表
  brandIndex = "/tiny-shop/v1/product/brand/index",

  // 商品评价列表
  evaluateList = "/tiny-shop/v1/product/evaluate/index",
  // 精选列表
  productExcellentList = "/tiny-shop/v1/product/product/excellent",

}

/**
 * @description: product api
 */
const productApi = {
  getGuessYouLikeList(params = {}) {
    return http.get(Api.guessYouLikeList, {params});
  },
  getProductDetail(params = {}) {
    return http.get(Api.productDetail, {params});
  },
  getProductBaseDetail(params = {}) {
    return http.get(Api.productBaseDetail, {params});
  },
  getProductList(params = {}) {
    return http.get(Api.productList, {params});
  },
  getProductCate(params = {}) {
    return http.get(Api.productCate, {params});
  },
  getEvaluateList(params = {}) {
    return http.get(Api.evaluateList, {params});
  },
  getBrandIndex(params = {}) {
    return http.get(Api.brandIndex, {params});
  },
  getProductExcellentList(params = {}) {
    return http.get(Api.productExcellentList, {params});
  }
};
export default productApi;
