import { Module } from "vuex";
import siteConfig from "@/config/site";
import {setLanguage} from "@/locales";

const LOCALE: string = uni.getStorageSync("locale") || siteConfig.locale;

interface localeObj {
  locale: string
}


const store: Module<localeObj, unknown> = {
  namespaced: true,
  state() {
    return {
      locale: LOCALE
    };
  },
  mutations: {
    setLocale(state: localeObj, payload: AnyObject) {
      state.locale = payload.locale;
      uni.setStorageSync("locale", state.locale);
      setLanguage(state.locale);
    }
  },
  actions: {
    setLocale(context, payload: AnyObject) {
      context.commit("setLocale", payload);
    }
  },
  getters: {
    getLocale(state: localeObj) {
      return state.locale;
    }
  }
};

export default store;
