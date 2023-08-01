import { Module } from "vuex";
const CARTNUM: string = uni.getStorageSync("cartNum") || 0;
const NOTIFYNUM: string = uni.getStorageSync("notifyNum") || 0;

interface StoreNotify {
  cartNum: string,
  notifyNum: string
}

const store: Module<StoreNotify, unknown> = {
  namespaced: true,
  state() {
    return {
      // 购物车数字角标
      cartNum: CARTNUM,
      // 消息中心数字角标
      notifyNum: NOTIFYNUM
    };
  },
  mutations: {
    setCartNum(state: StoreNotify, payload: AnyObject) {
      state.cartNum = payload.cartNum;
      uni.setStorageSync("cartNum", payload.cartNum);
    },
    setNotifyNum(state: StoreNotify, payload: AnyObject) {
      state.notifyNum = payload.notifyNum;
      uni.setStorageSync("notifyNum", payload.notifyNum);
    }
  },
  getters: {
    getCartNum(state: StoreNotify) {
      return state.cartNum;
    },
    getNotifyNum(state: StoreNotify) {
      return state.notifyNum;
    }
  }
};

export default store;
