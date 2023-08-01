<template>
  <view class="rf-friend-pay">
    <view :class="'bg-gradual-' + themeColor.name" class="rf-friend-pay__header">
      <view>{{
        state.peerPayDetail.config?.seek_help_desc ||
          "特别喜欢你英姿飒爽的样子，超酷的~"
      }}
      </view>
      <rf-image
        :src="state.peerPayDetail.member?.head_portrait || headImg"
        border-radius="50%"
        class="avatar"
        height="140"
        width="140"
      />
    </view>
    <view v-if="state.peerPayDetail.product?.length > 0">
      <view
        v-for="(item, index) in state.peerPayDetail?.product"
        :key="index"
        class="flex mt-lg mb-base pl-lg pr-lg"
      >
        <view class="mr-base">
          <rf-image
            :src="item.product_picture"
            border-radius="6"
            height="160"
            width="200"
          />
        </view>
        <view class="flex-1">
          <text class="font-lg font-weight-500 in2line mb-sm">{{
            item.product_name
          }}
          </text>
          <view
            v-if="item.sku_name"
            class="font-color-light"
          >{{ item.sku_name }}
          </view
          >
        </view>
        <view class="text-right">
          <view :class="'text-' + themeColor.name" class="font-lg-4">
            <text class="font-sm">{{ moneySymbol }}</text>
            <text class="font-lg-2 font-weight">{{ item.product_money || item.product_original_money }}</text>
          </view>
          <view class="font-color-dark"> x {{ item.num }}</view>
        </view>
      </view>
    </view>
    <view
      v-if="!isOwnerOrder() && state.peerPayDetail.peerPay?.leave_word"
      class="rf-friend-pay__message"
    >
      <view class="content"
      >#{{ state.peerPayDetail.peerPay?.leave_word }}#
      </view
      >
    </view>
    <view v-if="isOwnerOrder()" class="rf-friend-pay__message">
      <view class="title">编辑留言</view>
      <textarea
        v-model="state.leaveWord"
        :placeholder="state.peerPayDetail.peerPay?.leave_word || '可以填写留言邀请好友来代付哦'"
        class="textarea"
        rows="2"
      />
    </view>
    <view class="rf-friend-pay__foot">
      <view
        v-if="state.peerPayDetail.peerPay?.pay_status === 0 && isOwnerOrder()"
        :class="'bg-gradual-' + themeColor.name"
        class="btn border-color-none"
        @tap="save"
      >保存留言
      </view>
      <button
        v-if="state.peerPayDetail.peerPay?.pay_status === 0"
        :class="'bg-gradual-' + themeColor.name"
        class="btn"
        open-type="share"
        @tap.stop="share()"
      >喊朋友来帮忙
      </button>
      <view
        v-if="state.peerPayDetail.peerPay?.pay_status === 0 && !isOwnerOrder()"
        :class="'bg-gradual-' + themeColor.name"
        class="btn"
        @tap="navTo(mRouteConfig.pay, { order_id: state.orderId, money: state.peerPayDetail.order.pay_money, is_peer_pay: 1 })"
      >
        立即支付
        <text class="font-sm">{{ moneySymbol }}</text>
        {{ state.peerPayDetail.order.pay_money }}
      </view>
    </view>
    <!-- 分享引导 -->
    <rf-base-popup v-if="state.shareShow" @close="state.shareShow = false">
      <template #position>
        <image :src="shareBg" class="share-bg" />
      </template>
    </rf-base-popup>
  </view>
</template>
<script lang="ts" setup>
import {reactive,} from "vue";
import mAssetsPath from "@/config/assets";
import {onLoad, onShareAppMessage, onShareTimeline,} from "@dcloudio/uni-app";
import mHelper from "@/utils/helper";
import mSiteConfig from "@/config/site";
import mRouter from "@/utils/routerUtil";
import {Route,} from "@/response/route";
import marketingApi from "@/api/tinyShop/marketing";
import mRouteConfig from "@/config/routes"; // 路由管理
import store from "@/store";
import {Member,} from "@/response/profile";
import {FriendPay,} from "@/response/order";
import mConstData from "@/config/constData";

// 常量
const themeColor = mHelper.getThemeColor(); // 主题颜色
const globalConfig = mHelper.getGlobalConfig(); // 通用配置
const headImg = mAssetsPath.headImg;
const shareBg = mAssetsPath.shareBg;
const moneySymbol = mConstData.moneySymbol;

// 变量
let state = reactive({
  orderId: "",
  shareShow: false,
  peerPayDetail: {} as FriendPay,
  userInfo: {} as Member,
  currentUrl: "",
  leaveWord: "",
});

onShareTimeline(() => {
  return {
    title: `${state.peerPayDetail.member?.nickname}的代付`,
    path: `/pages/order/friendPay?id=${state.orderId}`,
  };
});
onShareAppMessage(() => {
  return {
    title: `${state.peerPayDetail.member?.nickname}的代付`,
    path: `/pages/order/friendPay?id=${state.orderId}`,
  };
});
onLoad((options: any) => {
  state.orderId = options.id || "";
  state.currentUrl = `${mSiteConfig.hostURL}/pages/order/friendPay?id=${state.orderId}`;
  state.userInfo = store.getters["user/getUserInfo"];
  getPeerPayDetail();
});

const isOwnerOrder = () => {
  return Number(state.userInfo.member?.id) === state.peerPayDetail.member?.id;
};

// 分享好友代付
const share = () => {
  // #ifdef MP
  console.log(321)
  // mStore.commit("setMpShowState", true);
  // #endif
  // #ifdef H5
  if (mHelper.isWechat()) {
    state.shareShow = true;
  } else {
    mHelper.h5Copy(state.currentUrl);
  }
  // #endif
  // #ifdef APP-PLUS
  mHelper.handleAppShare(
    state.currentUrl,
    globalConfig.app_name,
    state.peerPayDetail.product[0].product_name,
    state.peerPayDetail.product[0].product_picture
  );
  // #endif
};

const save = async () => {
  try {
    await marketingApi.handlePeerPayUpdate(
      {leave_word: state.leaveWord,},
      `?id=${state.peerPayDetail.peerPay.id}`
    );
    mHelper.toast("保存成功");
  } catch (e) {
    //
  }
};
const getPeerPayDetail = async () => {
  try {
    state.peerPayDetail = (await marketingApi.getPeerPayDetail({
      order_id: state.orderId
    })) as unknown as FriendPay;
    uni.setNavigationBarTitle({
      title: `${state.peerPayDetail.member.nickname}的代付`,
    });
    console.log(state.userInfo);
  } catch (e) {
    //
  }
};
const navTo = (route: Route, query = {}) => {
  mRouter.push({route, query,});
};
</script>
<style lang="scss" scoped>
.rf-friend-pay {
  background: $page-color-base;
  height: 100%;
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__header {
    position: relative;
    width: 950rpx;
    margin: 0 0 80rpx -100rpx;
    height: 320rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-bottom-left-radius: 50%;
    border-bottom-right-radius: 50%;

    .avatar {
      position: absolute;
      bottom: -50rpx;
      width: 140rpx;
      height: 140rpx;
      border-radius: 50%;
    }
  }

  &__message {
    margin-top: $spacing-base;
    padding: 16px;
    background-color: $color-white;

    .title {
      margin-bottom: 10px;
    }

    .content {
      text-align: center;
    }

    .textarea {
      height: 120rpx;
    }
  }

  &__foot {
    margin-top: 100rpx;
    padding: 16rpx 32rpx;

    .btn {
      margin-top: 20px;
      color: #fff;
      text-align: center;
      font-size: 14px;
      line-height: 80rpx;
      border-radius: 40rpx;
    }
  }
}

.share-bg {
  position: fixed;
  z-index: 101;
  top: 8%;
  right: 6%;
  width: 62%;
  height: 300rpx;
}
</style>
