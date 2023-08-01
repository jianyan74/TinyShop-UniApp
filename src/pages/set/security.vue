<template>
  <view class="rf-set">
    <view
      class="list-cell b-b"
      @tap="navTo(mRouteConfig.password, { type: '1' })"
    >
      <text class="cell-tit">修改密码</text>
      <text class="cell-more iconfont iconyou"></text>
    </view>
    <view @tap="navTo(mRouteConfig.mobile)" class="list-cell b-b">
      <text class="cell-tit">修改手机号</text>
      <text class="cell-more iconfont iconyou"></text>
    </view>
    <view @tap="handleAccountDelete" class="list-cell b-b mt-base">
      <text class="cell-tit">注销账号</text>
      <text class="cell-more iconfont iconyou"></text>
    </view>
  </view>
</template>
<script setup lang="ts">
import store from "@/store";
import mRouter from "@/utils/routerUtil";
import mRouteConfig from "@/config/routes";
import memberApi from "@/api/tinyShop/member";
import { Route, } from "@/response/route";
import mHelper from "@/utils/helper";
const themeColor = mHelper.getThemeColor();

// 通用跳转
const navTo = (route: Route, query = {}) => {
  mRouter.push({ route, query, });
};
// 注销账号
const handleAccountDelete = () => {
  uni.showModal({
    content: "确定要注销账号么",
    success: async (e) => {
      if (e.confirm) {
        try {
          await memberApi.handleMemberCancel();
          store.commit("user/logout");
          navTo(mRouteConfig.profile);
        } catch (e) {
          //
        }
      }
    },
  });
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
