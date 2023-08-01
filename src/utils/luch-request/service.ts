/**
 * @version 3.0.5
 * @Author lu-ch
 * @Email webwork.s@qq.com
 * 文档: https://www.quanzhan.co/luch-request/
 * github: https://github.com/lei-mu/luch-request
 * DCloud: http://ext.dcloud.net.cn/plugin?id=392
 * HBuilderX: beat-3.0.4 alpha-3.0.4
 */
import Request from "@/utils/luch-request/index.js";
import siteConfig from "@/config/site";
import mHelper from "@/utils/helper";
import store from "@/store";
import siteApi from "@/api/tinyShop/site";

const http = new Request();
http.setConfig((config) => {
  /* 设置全局配置 */
  config.baseURL = siteConfig.baseURL; /* 根域名不同 */
  const systemInfo = uni.getSystemInfoSync();
  const systemInfoHeaders = {
    "device-name": systemInfo.brand, // 设备名称
    width: systemInfo.screenWidth, // 屏幕宽度
    height: systemInfo.screenHeight, // 屏幕高度
    os: systemInfo.platform, // 客户端平台
    "os-version": systemInfo.system, // 操作系统版本
  };
  config.header = {
    ...config.header,
    ...systemInfoHeaders,
  };
  return config;
});

http.interceptors.request.use(
  (config) => {
    /* 请求之前拦截器。可以使用async await 做异步操作 */
    config.header = {
      ...config.header,
      "x-api-key": store.getters["user/getAccessToken"] || "",
    };
    /*
     if (!token) { // 如果token不存在，return Promise.reject(config) 会取消本次请求
       return Promise.reject(config)
     }
     */
    return config;
  },
  (config) => {
    return Promise.reject(config);
  }
);

http.interceptors.response.use(
  async (response) => {
    /* 请求之后拦截器。可以使用async await 做异步操作  */
    /* 请求之后拦截器 */
    switch (response.data.code) {
      case 200:
        return Promise.resolve(response.data.data);
      case 400:
        mHelper.toast("错误的请求");
        return Promise.reject(response.data.message);
      case 401:
        // eslint-disable-next-line no-case-declarations
        let isRefreshing = false;
        // eslint-disable-next-line no-case-declarations
        let requests: AnyObject = [];
        // eslint-disable-next-line no-case-declarations
        const accessToken = store.getters["user/getAccessToken"];
        // eslint-disable-next-line no-case-declarations
        const refreshToken = store.getters["user/getRefreshToken"];
        if (response.config.url === siteApi.refreshToken || !refreshToken) {
          await store.commit("user/logout");
          uni.showModal({
            content: accessToken
              ? "会话已过期，是否跳转登录页面？"
              : "目前暂未登录，是否跳转登录页面？",
            success: (confirmRes) => {
              if (confirmRes.confirm) {
                mHelper.backToLogin();
                throw response.data.message;
              }
            },
          });
          break;
        } else {
          const config: AnyObject = response.config;
          // isRefreshing同一个页面只执行一次
          if (!isRefreshing) {
            isRefreshing = true;
            const params: AnyObject = {};
            params.group = mHelper.platformGroupFilter();
            params.refresh_token = refreshToken;
            await http.post(siteApi.refreshToken, params).then(async (r) => {
              store.commit("user/login", r);
            });
            requests.forEach((cb) => cb());
            requests = [];
            isRefreshing = false;
            return http.request(config);
          } else {
            return new Promise((resolve) => {
              // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
              requests.push(() => {
                resolve(http.request(config));
              });
            });
          }
        }
      case 405:
        mHelper.toast("当前操作不被允许");
        return Promise.reject(response.data.message);
      case 404:
        mHelper.toast(response.data.message);
        return Promise.reject(response.data.message);
      case 429:
        mHelper.toast("请求过多，先休息一下吧");
        return Promise.reject(response.data.message);
      case 500:
        mHelper.toast("服务器打瞌睡了");
        return Promise.reject(response.data.message);
      default:
        mHelper.toast(response.data.message);
        return Promise.reject(response.data.message);
    }
  },
  (response) => {
    // 请求错误做点什么。可以使用async await 做异步操作
    return Promise.reject(response);
  }
);

export { http };
