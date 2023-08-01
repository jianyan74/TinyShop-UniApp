<template>
  <view class="rf-helper-detail" v-if="!state.loading">
<!--    <view class="title">{{ state.helperDetail.title }}</view>-->
    <rf-parser :content="state.helperDetail.content || ''" lazy-load></rf-parser>
    <rf-empty
      info="暂无帮助内容"
      v-if="!state.helperDetail.title && !state.loading"
    ></rf-empty>
    <!--加载动画-->
    <rf-loading :active="state.loading"></rf-loading>
  </view>
</template>
<script setup lang="ts">
import { onLoad, } from "@dcloudio/uni-app";
import { reactive, } from "vue";
import commonApi from "@/api/tinyShop/common";

import { Helper, } from "@/response/helper";

let state = reactive({
  helperId: "",
  loading: true,
  helperDetail: {} as Helper,
});
onLoad((option) => {
  state.helperId = option.id || "";
  initData();
});
// 数据初始化
const initData = () => {
  getHelperDetail();
};
// 获取帮助详情
const getHelperDetail = async () => {
  try {
    state.helperDetail = (await commonApi.getHelperView({
      id: state.helperId,
    })) as unknown as Helper;
    state.loading = false;
    uni.setNavigationBarTitle({ title: state.helperDetail.title, });
  } catch (e) {
    state.loading = false;
  }
};
</script>
<style lang="scss" scoped>
.rf-helper-detail {
  background-color: $page-color-base;
  padding: $spacing-base;
  min-height: calc(100vh - var(--status-bar-height) - 86rpx);
  .title {
    text-align: center;
    font-size: $font-lg;
    color: $font-color-dark;
    padding: $spacing-base 0;
  }
}
</style>
