import { http } from "@/utils/luch-request/service";
import mHelper from "@/utils/helper";
import {GlobalConfig} from "@/response/config";

enum Api {
  // 获取省市区列表
  provinceList = "/tiny-shop/v1/common/provinces/index",
  // 收藏商品
  collectCreate = "/tiny-shop/v1/common/collect/create",
  // 删除收藏商品
  collectDel = "/tiny-shop/v1/common/collect/delete",

  // 分享/转发
  transmitCreate = "/tiny-shop/v1/common/transmit/create",

  // 广告
  advList = "/tiny-shop/v1/common/adv/index",
  // 广告详情
  advView = "/tiny-shop/v1/common/adv/view",

  // 配置
  configList = "/tiny-shop/v1/common/config/index",

  // 公告
  // 公告列表
  notifyAnnounceIndex = "/tiny-shop/v1/common/notify-announce/index",
  // 公告详情
  notifyAnnounceView = "/tiny-shop/v1/common/notify-announce/view",

  // 版本检测
  pickupPointIndex = "/tiny-shop/v1/common/pickup-point/index",

  // 站点帮助-列表
  helperIndex = "/tiny-shop/v1/common/helper/index",
  // 站点帮助-详情
  helperView = "/tiny-shop/v1/common/helper/view",

  // 订单支付
  orderPay = "/tiny-shop/v1/common/pay/create",

  // 上传图片
  uploadImage = "/tiny-shop/v1/common/file/images",
  // 上传视频
  uploadVideo = "/tiny-shop/v1/common/file/videos",
  // 用户协议
  protocolDetail = "/tiny-shop/v1/common/protocol/detail",
}

/**
 * @description: common login api
 */
const commonApi = {
  // 配置
  getGlobalConfig(params = {}) {
    return http.get(Api.configList, { params });
  },
  // 广告
  getAdvList(params = {}) {
    return http.get(Api.advList, { params });
  },
  // 广告详情
  getAdvView(params = {}) {
    return http.get(Api.advView, { params });
  },
  //更新用户信息
  getProvinceList(params = {}) {
    return http.get(Api.provinceList, { params });
  },
  // 删除收藏商品
  handleCollectDel(params = {}, query = {}) {
    return http.delete(
      Api.collectDel + mHelper.objParseUrlAndParam("", query),
      params
    );
  },
  // 收藏商品
  handleCollectCreate(params = {}) {
    return http.post(Api.collectCreate, params);
  },
  // 站点帮助-列表
  getHelperIndex(params = {}) {
    return http.get(Api.helperIndex, { params });
  },
  // 站点帮助-详情
  getHelperView(params = {}) {
    return http.get(Api.helperView, { params });
  },
  // 版本检测
  getPickupPointIndex(params = {}) {
    return http.get(Api.pickupPointIndex, { params });
  },
  // 公告列表
  getNotifyAnnounceIndex(params = {}) {
    return http.get(Api.notifyAnnounceIndex, { params });
  },
  // 更新用户信息
  getProtocolDetail(params = {}) {
    return http.get(Api.protocolDetail, { params });
  },
  // 公告详情
  getNotifyAnnounceView(params = {}) {
    return http.get(Api.notifyAnnounceView, { params });
  },
  // 订单支付
  handleOrderPay(params = {}, str = "") {
    return http.post(Api.orderPay + str, params);
  },
  // 上传图片
  handleUploadImage(params = {}) {
    return http.upload(Api.uploadImage, params);
  },
  // 上传视频
  handleUploadVideo(params = {}) {
    return http.upload(Api.uploadVideo, params);
  },
  // 用户协议
  handleTransmitCreate(params = {}) {
    return http.upload(Api.transmitCreate, params);
  },
};
export default commonApi;
