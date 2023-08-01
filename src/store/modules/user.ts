import { Module } from "vuex";
import * as ConfigHandlers from "@/response/config"

const USERINFO = uni.getStorageSync("userInfo") || {};
const COMMON_CONFIG = uni.getStorageSync("commonConfig") || {};
const ACCESS_TOKEN = uni.getStorageSync("accessToken") || "";
const REFRESH_TOKEN = uni.getStorageSync("refreshToken") || "";
const BACK_TO_PAGE = uni.getStorageSync("backToPage") || "";
const IS_FIRST_TIME_LOGIN = uni.getStorageSync("isFirstTimeLogin") || "";
const PROMOTER_CODE = uni.getStorageSync("promoterCode") || "";

interface StoreUser {
  refreshToken: string;
  promoterCode: string;
  accessToken: string;
  backToPage: AnyObject;
  commonConfig: ConfigHandlers.CommonConfig;
  userInfo: AnyObject;
  isFirstTimeLogin: string;
}

const store: Module<StoreUser, unknown> = {
  namespaced: true,
  state() {
    return {
      promoterCode: PROMOTER_CODE,
      isFirstTimeLogin: IS_FIRST_TIME_LOGIN,
      accessToken: ACCESS_TOKEN,
      commonConfig: COMMON_CONFIG,
      userInfo: USERINFO,
      backToPage: BACK_TO_PAGE,
      refreshToken: REFRESH_TOKEN,
    };
  },
  mutations: {
    setConfigList(state: StoreUser, payload: AnyObject) {
      state.commonConfig = payload.configList;
      uni.setStorageSync("commonConfig", payload.configList);
    },
    setUserInfo(state: StoreUser, payload: AnyObject) {
      state.userInfo = payload.userInfo;
      uni.setStorageSync("userInfo", payload.userInfo);
    },
    setPromoterCode(state: StoreUser, payload: AnyObject) {
      state.promoterCode = payload.promoterCode;
      uni.setStorageSync("promoterCode", payload.promoterCode);
    },
    setBackToPage(state: StoreUser, payload: AnyObject) {
      state.backToPage = payload.backToPage;
      uni.setStorageSync("backToPage", payload.backToPage);
    },
    setIsFirstTimeLogin(state: StoreUser, payload: AnyObject) {
      state.isFirstTimeLogin = payload.isFirstTimeLogin;
      uni.setStorageSync("isFirstTimeLogin", payload.isFirstTimeLogin);
    },
    login(state, provider) {
      state.accessToken = provider.access_token;
      state.refreshToken = provider.refresh_token;
      state.userInfo = provider.member;
      uni.setStorageSync("accessToken", provider.access_token);
      uni.setStorageSync("refreshToken", provider.refresh_token);
      uni.setStorageSync("userInfo", provider);
    },
    logout(state) {
      state.accessToken = "";
      state.refreshToken = "";
      state.userInfo = {};
      uni.removeStorageSync("accessToken");
      uni.removeStorageSync("refreshToken");
      uni.removeStorageSync("userInfo");
    },
  },
  actions: {
    setConfigList(context, payload: AnyObject) {
      context.commit("setConfigList", payload);
    },
  },
  getters: {
    getUserInfo(state: StoreUser) {
      return state.userInfo;
    },
    getPromoterCode(state: StoreUser) {
      if (state.promoterCode) {
        return state.promoterCode;
      }
      return '';
    },
    hasLogin(state: StoreUser) {
      return !!state.accessToken;
    },
    isFirstTimeLogin(state: StoreUser) {
      return !!state.isFirstTimeLogin;
    },
    getBackToPage(state: StoreUser) {
      return state.backToPage;
    },
    getAccessToken(state: StoreUser) {
      return state.accessToken;
    },
    getRefreshToken(state: StoreUser) {
      return state.refreshToken;
    },
    getGlobalConfig(state: StoreUser) {
      return state.commonConfig.config || {};
    },
    getBottomNav(state: StoreUser) {
      return state.commonConfig.bottom_nav || [];
    },
    getMemberCenterNav(state: StoreUser) {
      return state.commonConfig.member_center_nav || [];
    },
    getHomeFloatNav(state: StoreUser) {
      return state.commonConfig.home_float_nav || [];
    },
    getNotifyConfig(state: StoreUser) {
      return state.commonConfig.notify_config || [];
    }
  },
};

export default store;
