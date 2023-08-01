import { http } from "@/utils/luch-request/service";

enum Api {
  // 直播列表
  wechatMiniLiveList = "/wechat-mini/v1/live/live/index",
}

/**
 * @description: user login api
 */
const wechatMiniApi = {
  getWechatMiniLiveList(params = {}) {
    return http.get(Api.wechatMiniLiveList, { params });
  },
};
export default wechatMiniApi;
