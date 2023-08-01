import { Module } from "vuex";
import siteConfig from "@/config/site";
import constDataConfig from "@/config/constData";

const THEMECOLOR: string =
  uni.getStorageSync("themeColor") || siteConfig.themeColor;

interface themeColorObj {
  themeColor: string;
}

const store: Module<themeColorObj, unknown> = {
  namespaced: true,
  state() {
    return {
      themeColor: THEMECOLOR,
    };
  },
  mutations: {
    setThemeColor(state: themeColorObj, payload: AnyObject) {
      state.themeColor = payload.name;
      uni.setStorageSync("themeColor", state.themeColor);
    },
  },
  actions: {
    setThemeColor(context, payload: AnyObject) {
      context.commit("setThemeColor", payload);
    },
  },
  getters: {
    getThemeColor(state: themeColorObj) {
      const theme: any = constDataConfig.themeList.filter(
        (item) => item.name === state.themeColor
      )[0];
      return theme;
    },
  },
};

export default store;
