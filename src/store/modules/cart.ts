import { Module } from "vuex";
const CARTLIST: string = uni.getStorageSync("cartList") || {};

interface StoreCart {
  cartList: string
}

const store: Module<StoreCart, unknown> = {
  namespaced: true,
  state() {
    return {
      // 购物车数字角标
      cartList: CARTLIST
    };
  },
  mutations: {
    setCartList(state: StoreCart, payload: AnyObject) {
      state.cartList = payload.cartList;
      uni.setStorageSync("cartList", payload.cartList);
    }
  },
  getters: {
    getCartList(state: StoreCart) {
      return state.cartList;
    }
  }
};

export default store;
