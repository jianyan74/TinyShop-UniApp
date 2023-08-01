<template>
  <view class="rf-integral">
    <view class="rf-integral__header" :class="'bg-gradual-' + themeColor.name">
      <view>当前{{ state.type === "user_growth" ? "成长值" : "积分" }}</view>
      <text class="font-lg-20">
        {{
          (state.type === "user_growth"
            ? state.userInfo?.member?.account?.user_growth
            : state.userInfo?.member?.account?.user_integral) || "0"
        }}
      </text>
      <view class="line"></view>
      <view class="flex-align-items">
        <view class="flex-1">
          <view class="font-lg">
            {{
              (state.type === "user_growth"
                ? state.userInfo?.member?.account?.accumulate_growth
                : state.userInfo?.member?.account?.accumulate_integral) || "0"
            }}
          </view>
          <view class="font-sm mt-sm"
            >累计{{ state.type === "user_growth" ? "成长值" : "积分" }}</view
          >
        </view>
        <view class="flex-1">
          <view class="font-lg">
            {{
              (state.type === "user_growth"
                ? state.userInfo?.member?.account?.consume_growth
                : state.userInfo?.member?.account?.consume_integral) || "0"
            }}
          </view>
          <view class="font-sm mt-sm">累计消费</view>
        </view>
        <view class="flex-1">
          <view class="font-lg">
            {{
              (state.type === "user_growth"
                ? state.userInfo?.member?.account?.frozen_growth
                : state.userInfo?.member.account?.frozen_integral) || "0"
            }}
          </view>
          <view class="font-sm mt-sm"
            >冻结{{ state.type === "user_growth" ? "成长值" : "积分" }}</view
          >
        </view>
      </view>
      <view class="rf-integral__header__tab">
        <view
          class="tab-item"
          :class="
            state.current === index ? `text-${themeColor.name} tab-item-on` : ''
          "
          v-for="(item, index) in state.navList"
          :key="index"
          @tap="handleNavTabChange(index)"
        >
          {{ item.name }}
        </view>
      </view>
    </view>
    <view class="rf-integral__content">
      <view class="rf-integral__content__list" v-if="state.current === 0">
        <view
          class="tip"
          v-if="state.type !== 'user_growth'"
          @tap="navTo(mRouteConfig.productList)"
        >
          <view
            >您有{{
              state.userInfo.member?.account?.user_integral || "0"
            }}积分待使用，买买买！
          </view>
        </view>
        <view
          class="rf-integral__content__list__item pt-lg pb-lg"
          v-for="(item, index) in state.integralList"
          :key="index"
        >
          <view class="flex-1">
            <view class="font-base-2 mb-sm">{{ item.remark }}</view>
            <view class="font-color-light font-sm-2">
              {{ time(item.created_at) }}
            </view>
          </view>
          <view
            class="font-lg-4"
            :class="item.num > 0 ? 'color-success' : 'color-error'"
            >{{ numFilter(item.num) }}</view
          >
        </view>
        <rf-load-more
          class="load-more"
          :status="state.loadingType"
        ></rf-load-more>
      </view>
      <view class="rf-integral__content__link" v-if="state.current === 1">
        <view
          class="rf-integral__content__link__item text-center"
          @tap="navTo(mRouteConfig.productList)"
          v-if="state.type !== 'user_growth'"
          >买的越多赚的越多
        </view>
        <view
          class="rf-integral__content__link__item text-center"
          @tap="navTo(mRouteConfig.signIn)"
        >
          去签到赚{{ state.type === "user_growth" ? "成长值" : "积分" }}
        </view>
      </view>
    </view>
    <rf-ad type="suspension_int"></rf-ad>
    <!--加载动画-->
    <rf-loading :active="state.loading"></rf-loading>
  </view>
</template>
<script lang="ts" setup>
import { formatToDateTime, } from "@/utils/dateUtil";
import { onLoad, onReachBottom, } from "@dcloudio/uni-app";
import { reactive, } from "vue";
import mHelper from "@/utils/helper";
import memberApi from "@/api/tinyShop/member";
import store from "@/store";
import mRouter from "@/utils/routerUtil";
import mRouteConfig from "@/config/routes";
import { Route, } from "@/response/route";
import { CreditsLog, Profile, } from "@/response/profile";

// 常量
const themeColor = mHelper.getThemeColor();
// 变量
let state = reactive({
  navList: [{ name: "积分明细", },],
  current: 0,
  integralList: [] as CreditsLog[],
  loadingType: "more",
  page: 1,
  type: "",
  userInfo: {} as Profile,
  loading: true,
});

// 加载更多
onReachBottom(() => {
  if (state.loadingType === "noMore") return;
  state.page++;
  getIntegralListList();
});

onLoad((options) => {
  initData(options);
});

const time = (val: string) => {
  return formatToDateTime(Number(val) * 1000);
};
const numFilter = (val: string) => {
  return parseInt(val) >= 0 ? `+${val}` : val;
};
const handleNavTabChange = (index: number) => {
  state.loading = true;
  state.current = index;
  state.page = 1;
  state.integralList.length = 0;
  getIntegralListList();
};
const initData = (options) => {
  state.type = options.type || "";
  if (state.type === "user_growth") {
    uni.setNavigationBarTitle({ title: "成长值", });
    state.navList[0].name = "成长值明细";
  }
  state.navList.push({
    name: state.type !== "user_growth" ? "积分提升" : "成长值提升",
  });
  state.userInfo = store.getters["user/getUserInfo"];
  console.log(state.userInfo);
  getIntegralListList();
};
const getIntegralListList = async () => {
  const params: AnyObject = {};
  if (state.type === "user_growth") params.type = 2;
  params.page = state.page;
  try {
    const data = (await memberApi.getCreditsLogList(
      params
    )) as unknown as CreditsLog[];
    state.loading = false;
    state.loadingType = data.length < 10 ? "noMore" : "more";
    state.integralList = [...state.integralList, ...data,];
  } catch (e) {
    state.loading = false;
  }
};
// 通用跳转
const navTo = (route: Route, query = {}) => {
  mRouter.push({ route, query, });
};
</script>
<style scoped lang="scss">
.rf-integral {
  background-color: $color-white;
  position: absolute;
  width: 100%;
  height: 100%;
  &__header {
    opacity: 0.9;
    width: 100%;
    height: 420rpx;
    color: $color-white;
    padding: $spacing-base 0;
    text-align: center;
    position: relative;
    .line {
      width: 76rpx;
      height: 4rpx;
      background-color: $color-white;
      margin: $spacing-base auto $spacing-lg;
    }
    &__tab {
      position: absolute;
      bottom: -2rpx;
      display: flex;
      width: 80%;
      margin: 0 10%;
      border-radius: 20rpx 20rpx 0 0;
      background-color: #f7f7f7;
      height: 80rpx;
      line-height: 80rpx;
      font-size: $font-base;
      color: #bbb;
      .tab-item {
        flex: 1;
        text-align: center;
        line-height: 80rpx;
      }
      .tab-item-on {
        background-color: #fff;
        font-weight: bold;
        border-radius: 20rpx 0 0 0;
      }
      .tab-item-on:last-child {
        border-radius: 0 20rpx 0 0;
      }
    }
  }
  &__content {
    padding: $spacing-base 0;
    &__list {
      .tip {
        font-size: $font-sm;
        width: 690rpx;
        padding: $spacing-sm 0;
        margin: $spacing-base $spacing-lg;
        border-radius: 30rpx;
        background-color: #fff5e2;
        color: #c8a86b;
        text-align: center;
      }
      &__item {
        display: flex;
        align-items: center;
        padding: $spacing-lg 36rpx;
        position: relative;
      }
    }
    &__link {
      &__item {
        background-image: linear-gradient(to right, #fff7e7 0%, #fffdf9 100%);
        width: 690rpx;
        margin: $spacing-base $spacing-lg;
        height: 120rpx;
        line-height: 120rpx;
        border-radius: $spacing-base;
        padding: 0 $spacing-base;
        color: #c8a86b;
      }
    }
  }
}
</style>
