import { Module } from 'vuex';

const ISSTUFFSERVICELIST = uni.getStorageSync('isStuffServiceList') || [];

interface imObj {
  wsConnectStatus: boolean;
  imHistory: object[];
  imNoRead: number;
  isImPanel: boolean;
  isStuffService: boolean;
  isStuffServiceList: any;
  bubbleList: any;
  hasChart: boolean;
  nomore: boolean;
  merchantInfo: any;
}

const store: Module<imObj, unknown> = {
  namespaced: true,
  state() {
    return {
      //ws连接状态
      wsConnectStatus: false,
      // 历史聊天消息，仅保存最后100条
      imHistory: [],
      // 客服记录列表
      bubbleList: [],
      // 当前是否处于聊天面板
      isImPanel: false,
      // 当前是否人工客服服务
      isStuffService: false,
      // 当前未读聊天消息数量
      imNoRead: 0,
      // 当前是否人工客服服务数组
      isStuffServiceList: ISSTUFFSERVICELIST,
      // 当前消息记录里是否有聊天信息 非tip
      hasChart: true,
      // 没有更多消息了
      nomore: false,
      // 商户信息
      merchantInfo: {
        merchant: {},
        product: {},
        defaultRuleKeyword: []
      }
    };
  },
  mutations: {
    //插入聊天记录 塞入末尾 用于塞入
    addImHistory(state, provider) {
      if (provider) {
        const data = state.imHistory;
        data.push(provider);
        state.imHistory = data;
      }
    },
    //保存商户信息 keywords merchant product
    setMerchantInfo(state, provider) {
      if (provider) {
        state.merchantInfo = provider;
      }
    },
    //清空商户信息
    clearMerchantInfo(state) {
      console.log('clear merchantInfo');
      state.merchantInfo = {
        merchant: {
          cover: '',
          id: 0,
          logo: '',
          title: ''
        },
        product: {},
        defaultRuleKeyword: []
      };
    },
    //保存聊天记录 用于接口请求返回数据的保存
    setImHistory(state, provider) {
      if (provider) {
        let imHistory = state.imHistory;
        imHistory = [...provider, ...state.imHistory];
        state.imHistory = imHistory;
      }
    },
    //变更hasChart
    setHasChart(state, provider: boolean) {
      state.hasChart = provider;
    },
    //变更nomore
    setNomore(state, provider: boolean) {
      state.nomore = provider;
    },
    //更新会话列表
    setBubbleList(state: imObj, payload: AnyObject) {
      state.bubbleList = payload.bubbleList;
      uni.setStorageSync('bubbleList', state.bubbleList);
    },
    //清空聊天记录
    clearImHistory(state) {
      state.imHistory = [];
    },
    //更新是否专属客服状态
    updateStuffService(state, provider) {
      state.isStuffService = provider.isStuffService;
    },
    //修改ws链接状态
    updateWsConnectStatus(state, provider) {
      state.wsConnectStatus = provider.status;
    }
  },
  getters: {
    getWsConnectStatus(state: imObj) {
      return state.wsConnectStatus;
    },
    getImHistory(state: imObj) {
      return state.imHistory;
    },
    getHasChart(state: imObj) {
      return state.hasChart;
    },
    getNomore(state: imObj) {
      return state.nomore;
    },
    getBubbleList(state: imObj) {
      return state.bubbleList;
    },
    getIsStuffService(state: imObj) {
      return state.isStuffService;
    },
    getIsStuffServiceList(state: imObj) {
      return state.isStuffServiceList || [];
    },
    getMerchantInfo(state: imObj) {
      return state.merchantInfo || {};
    }
  }
};
export default store;
