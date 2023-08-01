<template>
  <view class="rf-helper" v-if="!state.loading">
    <!-- 帮助列表 -->
    <view v-if="state.helperList.length > 0" class="pt-lg">
      <rf-collapse v-for="(fItem, fIndex) in state.helperList" :key="fIndex">
        <rf-collapse-item open :title="fItem && fItem.title" type="line">
          <view
            class="rf-helper__item"
            v-for="(sItem, sIndex) in fItem.child"
            :key="sIndex"
            @tap="navTo(mRouteConfig.helperDetail, { id: sItem.id })"
          >
            <text>{{ sItem.title }}</text>
            <rf-icon name="iconyou"></rf-icon>
          </view>
        </rf-collapse-item>
      </rf-collapse>
    </view>
    <rf-empty
      info="暂无站点帮助"
      v-if="state.helperList.length === 0 && !state.loading"
    ></rf-empty>
    <!--加载动画-->
    <rf-loading :active="state.loading"></rf-loading>
  </view>
</template>
<script setup lang="ts">
import { onLoad, } from "@dcloudio/uni-app";
import { reactive, } from "vue";

import mRouteConfig from "@/config/routes";
import mRouter from "@/utils/routerUtil";
import commonApi from "@/api/tinyShop/common"; // 路由管理

import { Route, } from "@/response/route";
import { Helper, } from "@/response/helper";

// 变量
let state = reactive({
  loading: true,
  helperList: [] as Helper[],
});

onLoad(() => {
  initData();
});

// 数据初始化
const initData = () => {
  state.loading = true;
  getHelperList();
};
// 通用跳转
const navTo = (route: Route, query = {}) => {
  mRouter.push({ route, query, });
};
// 获取帮助列表
const getHelperList = async () => {
  try {
    const data = (await commonApi.getHelperIndex()) as unknown as Helper[];
    state.loading = false;
    state.helperList = data;
  } catch (e) {
    state.loading = false;
  }
};
</script>
<style lang="scss" scoped>
.rf-helper {
  background-color: $page-color-base;
  position: absolute;
  width: 100%;
  height: 100%;
  &__item {
    margin: $spacing-base $spacing-lg;
    display: flex;
    justify-content: space-between;
  }
}
</style>
