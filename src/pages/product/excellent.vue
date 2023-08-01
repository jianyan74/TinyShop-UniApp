<template>
  <view class="rf-excellent">
    <scroll-view
      class="rf-excellent__cate"
      scroll-x
      :style="{ top: `${state.navigationBar}px` }"
    >
      <view
        class="rf-excellent__cate__item"
        :class="
          Number(item.id) === state.currentCateId
            ? 'font-base-2 bg-gradual-' + themeColor.name
            : ''
        "
        v-for="item in state.cateList"
        :key="item.id"
        @tap="dateChange(item.id)"
        >{{ item.title }}</view
      >
    </scroll-view>
    <view class="rf-excellent__list">
      <view
        class="rf-excellent__list__item"
        v-for="item in state.excellentList"
        :key="item.id"
        @tap.stop="
          mHelper.navToProduct(item.id, item.marketing_type, item.marketing_id)
        "
      >
        <view class="flex">
          <rf-image
            width="240"
            height="240"
            border-radius="12"
            :src="item.picture"
          ></rf-image>
          <view class="info ml-base flex-1">
            <view
              class="in2line line-height-2 font-base-2 font-color-dark font-weight-500 mb-sm"
              >{{ item.name }}</view
            >
            <view class="flex flex-wrap mb-base tags">
              <view class="mr-base" v-for="tag in item.tags" :key="tag">
                <rf-tag
                  :is-border-show="true"
                  bg-color="#fff"
                  :color="themeColor.color"
                  :border-radius="6"
                  :text="tag"
                ></rf-tag>
              </view>
            </view>
            <view class="flex-align-items">
              <view class="avatars mr-sm">
                <view
                  class="avatar"
                  v-for="(avatar, index) in item.memberHeadPortrait"
                  :key="index"
                >
                  <rf-image
                    class="border"
                    width="48"
                    height="48"
                    border-radius="50%"
                    :src="avatar"
                  ></rf-image>
                </view>
              </view>
              <view class="font-color-base"
                >{{ item.evaluateStat?.total_num }}人推荐</view
              >
            </view>
            <view class="mt-sm flex-align-items">
              <view
                class="mr-sm font-lg-4 font-weight-500"
                :class="'text-' + themeColor.name"
                ><text class="font-sm">{{ moneySymbol }}</text
                >{{ item.price }}</view
              >
              <view
                class="font-color-light line-through"
                v-if="item.market_price > item.price"
                ><text class="font-sm">{{ moneySymbol }}</text
                >{{ item.market_price }}</view
              >
            </view>
          </view>
        </view>
        <view class="mt-base">
          <view class="flex-between">
            <view class="flex-1 mr-base flex-align-items">
              <rf-image
                width="46"
                height="46"
                border-radius="50%"
                :src="item.firstEvaluate?.member_head_portrait"
              ></rf-image>
              <view class="in1line ml-sm font-color-light">{{
                item.firstEvaluate?.member_nickname
              }}</view>
            </view>
            <view :class="'text-' + themeColor.name" class="font-sm"
              >{{ item.match_ratio || 0 }}%好评率</view
            >
          </view>
          <view class="mt-base font-color-base">{{
            item.firstEvaluate?.content
          }}</view>
        </view>
      </view>
    </view>
    <rf-load-more
      :status="state.loadingType"
      v-if="state.excellentList.length > 0"
    ></rf-load-more>
    <rf-empty
      :info="state.errorInfo || '暂无相关数据'"
      v-if="state.excellentList.length === 0 && !state.loading"
    ></rf-empty>
    <rf-loading :active="state.loading"></rf-loading>
  </view>
</template>
<script setup lang="ts">
import { onLoad, onPullDownRefresh, onReachBottom, } from "@dcloudio/uni-app";
import { reactive, } from "vue";
import mRouter from "@/utils/routerUtil";
import mHelper from "@/utils/helper";
import mConstData from "@/config/constData";
import productApi from "@/api/tinyShop/product";
import { CategoryItem, CustomCategory, } from "@/response/category";
import { ExcellentItem, } from "@/response/excellent";
// 常量
const themeColor = mHelper.getThemeColor(); // 主题颜色
const moneySymbol = mConstData.moneySymbol;

// 变量
let state = reactive({
  navigationBar: 0,
  errorInfo: "",
  loading: true,
  loadingType: "more",
  cateList: [] as CategoryItem[],
  currentCateId: -1,
  excellentList: [] as ExcellentItem[],
  page: 1,
});

onLoad(() => {
  getCate();
  getExcellentList();
  uni.getSystemInfo({
    success: (res) => {
      state.navigationBar = res.windowTop || 0;
    },
  });
});
// 下拉刷新
onPullDownRefresh(() => {
  state.page = 1;
  state.excellentList.length = 0;
  getExcellentList("refresh");
});
// 加载更多
onReachBottom(() => {
  if (state.loadingType === "noMore") return;
  state.page++;
  getExcellentList();
});

// 跳转详情
const navTo = (route) => {
  mRouter.push({ route, });
};
const getCate = async () => {
  try {
    const data =
      (await productApi.getProductCate()) as unknown as CustomCategory;
    state.cateList = [
      { id: "-1", title: "全部", } as CategoryItem,
      ...data.list,
    ];
  } catch (e) {
    //
  }
};
const getExcellentList = async (type = "") => {
  state.loading = true;
  try {
    //
    const data = (await productApi.getProductExcellentList({
      cate_id: state.currentCateId >= 0 ? state.currentCateId : "",
      page: state.page,
    })) as unknown as ExcellentItem[];
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
    state.loadingType = data.length < 10 ? "noMore" : "more";
    state.excellentList = [...state.excellentList, ...data,];
  } catch (e) {
    //
    state.errorInfo = JSON.stringify(e);
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
  }
};
const dateChange = (val: string) => {
  state.currentCateId = Number(val);
  state.page = 1;
  state.excellentList = [];
  getExcellentList();
};
</script>
<style lang="scss">
.rf-excellent {
  &__cate {
    white-space: nowrap;
    padding: $spacing-base 0 $spacing-base $spacing-base;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 100;
    &__item {
      display: inline-block;
      text-align: center;
      padding: 6rpx 28rpx;
      position: relative;
      border-radius: 28rpx;
      font-size: $font-base;
      &:not(:last-child) {
        margin-right: 16rpx;
      }
    }
  }
  &__list {
    padding: 20rpx 24rpx;
    background-color: $color-white;
    &__item {
      .avatars {
        display: flex;
        align-items: center;
        .avatar {
          .border {
            border: 2rpx solid $color-white;
          }
          &:not(:first-child) {
            margin-left: -14rpx;
          }
        }
      }
      .tags {
        height: 36rpx;
      }
      &:not(:last-child) {
        margin-bottom: 30rpx;
      }
    }
  }
}
</style>
