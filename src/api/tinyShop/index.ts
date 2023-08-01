import { http } from "@/utils/luch-request/service";

enum Api {
  // 首页列表
  indexData = "/tiny-shop/v1/index/index",
  // 自定义首页列表
  customIndexData = "/tiny-shop/v1/index/custom",
  // 积分商城
  integralIndex = "/tiny-shop/v1/index/integral",
  // 经纬度转地址
  locationToAddress = "/tiny-shop/v1/index/location-to-address",
  // 地址转经纬度
  addressToLocation = "/tiny-shop/v1/index/address-to-location",
}

/**
 * @description: index api
 */
const indexApi = {
  // 经纬度转地址
  handleLocationToAddress(params = {}) {
    return http.get(Api.locationToAddress, { params });
  },
  // 地址转经纬度
  handleAddressToLocation(params = {}) {
    return http.get(Api.addressToLocation, { params });
  },
  // 自定义首页列表
  getIndexData(params = {}) {
    return http.get(Api.indexData, { params });
  },
  // 积分商城
  getIntegralIndex(params = {}) {
    return http.get(Api.integralIndex, { params });
  },
  getCustomIndexData(params = {}) {
    return http.get(Api.customIndexData, { params });
  },
};
export default indexApi;
