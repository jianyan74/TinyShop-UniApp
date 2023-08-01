<template>
  <view class="rf-set">
    <view
      v-for="item in setList"
      :key="item.title"
      class="list-cell b-b"
      :class="{ 'm-t': item.isMt }"
      @tap="navToPage(item.url, item.query, mRouteConfig[item.url])"
    >
      <text class="cell-tit">{{ item.title }}</text>
      <text class="cell-tip">{{ item.content }}</text>
      <text class="cell-more iconfont iconyou" />
    </view>
    <view
      v-if="
        mHelper.platformGroupFilter('app') === PlatformGroupEnum.TINYSHOPAPP
      "
      class="list-cell m-t"
    >
      <text class="cell-tit">消息推送</text>
      <switch
        :checked="state.notifyChecked"
        :color="themeColor.color"
        @change="switchChange"
      />
    </view>
    <view v-if="globalConfig.style_user_is_open" class="rf-set__theme-select">
      <view class="rf-set__theme-select__info">
        <rf-icon
          name="iconai249"
          size="42"
          :class="'text-' + themeColor.name"
        />
        <view class="block" :class="'bg-' + themeColor.name" />
        <view class="font-base"
        >
          主题色：<text :class="'text-' + themeColor.name">{{
            themeColor.title
          }}</text>
        </view
        >
      </view>
      <button
        class="rf-set__theme-select__btn"
        :class="'bg-gradual-' + themeColor.name"
        @click="state.colorModal = true"
      >
        <rf-icon name="iconai249" /> 选择主题
      </button>
    </view>
    <view
      class="list-cell log-out-btn"
      :class="'text-' + themeColor.name"
      @tap="toLogout"
    >
      <text class="cell-tit">退出登录</text>
    </view>
    <!-- 选择颜色模态框 -->
    <rf-modal
      v-if="state.colorModal"
      title="选择颜色"
      :btn-show="false"
      :is-close-show="true"
      @hide="state.colorModal = false"
    >
      <template #content>
        <view class="rf-set__theme-list">
          <view
            v-for="(item, index) in themeList"
            :key="index"
            class="rf-set__theme-list__item"
            :data-color="item.name"
            @tap="setThemeColor(item)"
          >
            <view class="block" :class="'bg-' + item.name">
              {{ item.title }}
            </view>
          </view>
        </view>
      </template>
    </rf-modal>
  </view>
</template>
<script setup lang="ts">
import {computed, reactive, ref,} from "vue";
import { onLoad, } from "@dcloudio/uni-app";
import store, {useStore,} from "@/store";
import mConstData from "@/config/constData";
import mHelper from "@/utils/helper";
import mRouter from "@/utils/routerUtil";
import mRouteConfig from "@/config/routes";
import memberApi from "@/api/tinyShop/member";
import { PlatformGroupEnum, } from "@/enum/loginEnum";
import { Route, } from "@/response/route";
import siteApi from "@/api/tinyShop/site";

// 变量
let state = reactive({
  isIosShow: false,
  isAppVersionCheckShow: false,
  isTipsShow: false,
  notifyChecked: false,
  colorModal: false,
});
// 常量
let setList = mConstData.setList;
const themeList = mConstData.themeList;
const themeColor = ref(mHelper.getThemeColor());


const globalConfig = computed(() => {
  const st = useStore();
  return st.getters["user/getGlobalConfig"];
});

onLoad(() => {
  initData();
});

// 初始化数据
const initData = () => {
  // 缓存大小
  setList[6].content = `${uni.getStorageInfoSync().currentSize} kb`;
  if (mHelper.platformGroupFilter("app") === PlatformGroupEnum.TINYSHOPAPP) {
    setList[8].content = `当前版本 ${plus.runtime.version}`;
    getNotifySubscriptionConfigIndex();
  }
};
// 获取消息提醒配置
const getNotifySubscriptionConfigIndex = async () => {
  try {
    const data =
      (await memberApi.getNotifySubscriptionConfigIndex()) as AnyObject;
    state.notifyChecked = data.all;
  } catch (e) {
    //
  }
};
// 跳转判断
const navToPage = (url: string, query = {}, route: Route) => {
  if (!url) return;
  if (url === "clearCache") {
    uni.showModal({
      content: "确定要清除缓存吗",
      success: async (e) => {
        if (e.confirm) {
          let params:AnyObject = {
            member: store.getters["user/getUserInfo"],
            refresh_token: store.getters["user/getRefreshToken"],
            access_token: store.getters["user/getAccessToken"],
          };
          uni.clearStorageSync();
          setList[6].content = "0 kb";
          await store.commit("user/login", params);
          mHelper.toast("清除缓存成功");
        }
      },
    });
  } else if (url === "versionUpgrade") {
    // if (uni.getSystemInfoSync().platform.toLowerCase() === "ios") {
    //   getVersionsInfo(plus.runtime.version);
    // } else {
    state.isAppVersionCheckShow = true;
  } else {
    navTo(route, query);
  }
};
// 通用跳转
const navTo = (route: Route, query = {}) => {
  mRouter.push({ route, query, });
};
// 退出登录
const toLogout = () => {
  uni.showModal({
    content: "确定要退出登录么",
    success: async (e) => {
      if (e.confirm) {
        try {
          await siteApi.logout();
          store.commit("user/logout");
          navTo(mRouteConfig.profile);
        } catch (e) {
          //
        }
      }
    },
  });
};
// 监听消息推送是否打开
const switchChange = async (e) => {
  try {
    await memberApi.handleNotifySubscriptionConfigUpConfig({
      all: e.detail.value ? 1 : 0,
    });
    mHelper.toast(`${e.detail.value ? "打开" : "关闭"}消息推送`);
  } catch (e) {
    //
  }
};
// 设置主题色
const setThemeColor = (item) => {
  state.colorModal = false;
  themeColor.value = item;
  store.commit("theme/setThemeColor", item);
};
</script>
<style lang="scss">
.rf-set {
  background: $page-color-base;
  padding-top: $spacing-base;
  position: absolute;
  height: 100%;
  width: 100%;
  &__theme-list {
    width: 100%;
    padding: 10rpx 0 40rpx;
    display: flex;
    flex-wrap: wrap;
    &__item {
      width: 25%;
      height: 68rpx;
      margin-top: 20rpx;
      margin-bottom: 20rpx;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      .block {
        padding: 30rpx 36rpx;
        border-radius: 6rpx;
        font-size: $font-sm;
      }
    }
  }
  &__theme-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: $color-white;
    padding: $spacing-base $spacing-lg;
    margin-top: $spacing-base;
    &__info {
      flex: 1;
      display: flex;
      align-items: center;
      .block {
        padding: 24rpx;
        border-radius: 6rpx;
        margin: 0 10rpx;
      }
    }
    &__btn {
      height: 64rpx;
      line-height: 64rpx;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: $font-base;
      border-radius: 32rpx;
    }
  }
}
</style>
