<template>
  <view class="rf-account">
    <!--账户信息面板-->
    <view class="rf-account__header mb-base" :class="'bg-gradual-' + themeColor.name">
      <view class="account">
        <view class="assets">
          <view>总资产(元)</view>
          <view class="font-lg-8">
            {{ state.userInfo?.member?.account.user_money || "0.00" }}
          </view>
        </view>
        <view class="btn-wrap">
          <text
            @tap="state.modalShow = true"
            class="recharge"
            :class="'text-' + themeColor.name"
            >兑换</text
          >
          <text
            v-if="configList.member_recharge"
            @tap="navTo(mRouteConfig.recharge)"
            class="recharge"
            :class="'text-' + themeColor.name"
            >充值</text
          >
        </view>
      </view>
      <view class="cumulative">
        <view>
          <view>累计充值(元)</view>
          <view class="font-lg-4">
            {{ state.userInfo?.member?.account.accumulate_money || "0.00" }}
          </view>
        </view>
        <view>
          <view>累计消费(元)</view>
          <view class="font-lg-4">
            {{ state.userInfo?.member?.account.consume_money || "0.00" }}
          </view>
        </view>
      </view>
    </view>
    <!--余额/积分导航-->
    <view class="flex-align-items pt-lg pb-base">
      <view
        class="flex-1 text-center"
        v-for="item in navList"
        :key="item.title"
        @tap="navTo(mRouteConfig[item.url], item.query)"
      >
        <rf-icon
          size="52"
          :color="themeColor.color"
          :name="item.icon"
        ></rf-icon>
        <view class="font-color-light mt-sm">{{ item.title }}</view>
      </view>
    </view>
    <!--广告-->
    <view class="mt-base">
      <view class="flex-between pl-base pr-base pt-sm pb-sm border-radius-12" :class="'bg-opacity-' + themeColor.name" @tap="navTo(mRouteConfig.couponList)">
        <view :class="'text-' + themeColor.name">
          <view class="font-base">领取优惠券</view>
          <text class="font-sm">满减享优惠</text>
        </view>
        <rf-icon
          size="56"
          name="iconwodeyouhuiquan"
          :class="'text-' + themeColor.name"
        ></rf-icon>
      </view>
    </view>
    <view class="rf-modal" v-if="state.modalShow">
      <view class="rf-modal__box" @tap.stop="() => {}">
        <view class="text-center pt-lg font-color-dark">请输入充值卡密</view>
        <view class="content">
          <input class="input" type="text" v-model="state.code" placeholder="请输入充值卡密" />
        </view>
        <view class="flex-align-items pb-base">
          <view class="flex-1 text-center font-color-light" @tap.stop="() => {
            state.modalShow = false;
            state.code = '';
          }">取消</view>
          <view
            class="flex-1 text-center"
            @tap.stop="handleCodeReCharge"
            :class="'text-' + themeColor.name"
            >兑换</view
          >
        </view>
      </view>
    </view>
    <!--加载动画-->
    <rf-loading :active="state.loading"></rf-loading>
  </view>
</template>
<script setup lang="ts">
import { onShow, } from "@dcloudio/uni-app";
import {reactive,} from "vue";
import mRouter from "@/utils/routerUtil";
import mHelper from "@/utils/helper";
import mRouteConfig from "@/config/routes";
import marketingApi from "@/api/tinyShop/marketing";
import memberApi from "@/api/tinyShop/member";
import {Profile,} from "@/response/profile"; // 路由管理
import { Route, } from "@/response/route";

// 常量
const navList = [
  {
    title: "账单记录",
    icon: "icondaifukuan",
    url: "bill",
    query: {},
  },
  {
    title: "充值记录",
    icon: "iconchongzhijilu",
    url: "bill",
    query: { state: "2", },
  },
  {
    title: "消费记录",
    icon: "iconzuheduozhongxiaofeifangshizuhexiaofei",
    url: "bill",
    query: { state: "3", },
  },
  {
    title: "积分中心",
    icon: "iconjifenqia",
    url: "integral",
    query: {},
  },
];
const themeColor = mHelper.getThemeColor();
const configList = mHelper.getGlobalConfig();
// 变量
let state = reactive({
  modalShow: false,
  code: "",
  userInfo: {} as Profile,
  loading: true,
});

onShow(() => {
  initData();
});

// 充值卡兑换
const handleCodeReCharge = async () => {
  if (!state.code) {
    mHelper.toast("请填写兑换码");
    return;
  }
  try {
    await marketingApi.handleRefillCardConversion({ code: state.code, });
    mHelper.toast("兑换成功");
    state.modalShow = false;
    await getMemberInfo();
  } catch (e) {
    state.loading = false;
  }
};
// 初始化数据
const initData = () => {
  getMemberInfo();
};
// 获取用户信息
const getMemberInfo = async () => {
  try {
    state.userInfo = await memberApi.getMemberInfo() as unknown as Profile;
    state.loading = false;
  } catch (e) {
    state.loading = false;
  }
};
const navTo = (route: Route, query = {}) => {
  mRouter.push({ route, query, });
};
</script>
<style scoped lang="scss">
.rf-account {
  background-color: $color-white;
  position: absolute;
  height: 100%;
  width: 100%;
  padding: 30rpx 20rpx;
  &__header {
    padding: 30rpx;
    height: 320rpx;
    opacity: 0.9;
    border-radius: 20rpx;
    color: rgba(255, 255, 255, 0.6);
    font-size: $font-sm;
    position: relative;
    .account {
      width: calc(100% - 60rpx);
      display: flex;
      position: absolute;
      z-index: 2;
      justify-content: space-between;
      .btn-wrap {
        display: flex;
        .recharge {
          margin-left: 20rpx;
          font-size: $font-base;
          width: 132rpx;
          height: 54rpx;
          line-height: 54rpx;
          border-radius: $font-base;
          background-color: #fff9f8;
          text-align: center;
          margin-top: 10rpx;
        }
      }
    }
    .cumulative {
      width: calc(100% - 240rpx);
      position: absolute;
      bottom: 20rpx;
      display: flex;
      justify-content: space-between;
    }
  }
  .rf-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    &__box {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      background-color: $color-white;
      border-radius: 20rpx;
      .content {
        padding: 48rpx 30rpx;
        .input {
          background-color: #efefef;
          padding: 0 10rpx;
          font-size: 28rpx;
          height: 56rpx;
          border-radius: 8rpx;
        }
      }
    }
  }
}
</style>
