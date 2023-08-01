<template>
  <view class="rf-order-shipping">
    <rf-empty v-if="state.shippingDetail?.count === 0" info="暂无物流信息" />
    <view v-else>
      <!-- 多个包裹 选择    -->
      <scroll-view v-if="state.shippingDetail.count >= 1" :scroll-x="true" class="package-tab">
        <view v-for="(item, index) in state.shippingDetail.data"
              :key="index"
              class="inline-block"
              @tap="choosePackage(index)">
          <view :style="{border: '1rpx solid ' + (Number(state.selectIndex) === Number(index) ? 'red' : '#e5e5e5')}"
                class="package-tab-item">
            <view class="package-tab-item-left">
              <text :class="'text-'+themeColor.name" class="font-base font-weight">{{ `包裹${index + 1}` }}</text>
              <text class="font-sm font-color-light">{{ `共${item.order_product_ids.length}件` }}</text>
            </view>
            <view class="package-tab-item-right">
              <rf-image
                :src="item.order_product[0].product_picture || globalConfig.app_logo"
                border-radius="10rpx"
                height="80"
                width="80"
              />
            </view>
          </view>
        </view>
      </scroll-view>
      <!-- 详细物流信息   -->
      <view v-if="Number(state.selectData.shipping_type) === 1" class="trace-content">
        <!--  物流公司信息      -->
        <view class="flex-between p-base express-company">
          <text class="font-base font-color-light">{{ state.selectData.express_company }}:
            {{ state.selectData.express_no }}
          </text>
          <text
            :class="'text-' + themeColor.name"
            @tap.stop="copy(state.selectData.express_no)"
          >复制
          </text>
        </view>
        <!--   详细物流信息     -->
        <view v-for="(trace, tIndex) in state.selectData.trace" :key="tIndex" class="pl-base pr-base trace-box">
          <view class="trace-left">
            <view :class="isFirst(tIndex) ? 'bg-'+themeColor.name : 'bg-gray'" class="circle" />
            <view class="line bg-gray" />
          </view>
          <view class="trace-right">
            <text class="font-sm font-color-dark font-weight pb-sm">{{ trace.datetime }}</text>
            <text class="font-sm">{{ trace.remark }}</text>
          </view>
        </view>
        <view class="address pl-base pr-base">
          <view class="left">
            <view class="hollow-circle" :style="{border: '4rpx solid '+themeColor.color}" />
          </view>
          <view class="right">
            <text class="font-base font-weight font-color-dark pb-sm">{{ state.selectData.address.receiver_details }}</text>
            <text class="font-color-light font-sm-2">
              {{ state.selectData.address.receiver_realname }} {{ state.selectData.address.receiver_mobile }}
              <text class="tag font-xs" :style="{border: '1rpx solid '+themeColor.color, color: themeColor.color}">号码保护中</text>
            </text>
          </view>
        </view>
      </view>
      <view v-if="Number(state.selectData.shipping_type) === 0" class="withoutExpress">
        <text class="font-sm-2 font-color-light">该包裹无需物流</text>
      </view>
    </view>

    <rf-loading :active="state.loading" />
  </view>
</template>
<script lang="ts" setup>
import {onLoad,} from "@dcloudio/uni-app";
import {computed, reactive,} from "vue";
import mHelper from "@/utils/helper";
import memberApi from "@/api/tinyShop/member";
import {ShippingInfo, ShippingInfoItem,} from "@/response/order";

const themeColor = mHelper.getThemeColor(); // 主题颜色
const globalConfig = mHelper.getGlobalConfig(); // 通用配置

let state = reactive({
  shippingDetail: {} as ShippingInfo,
  loading: true,
  selectIndex: 0,
  selectData: {} as ShippingInfoItem
});

//判断是否为第一个元素
const isFirst = computed(() => (index) => {
  return Number(index) === 0;
});

onLoad((options) => {
  initData(options);
});

//选择包裹
const choosePackage = (index: number) => {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 50
  });
  state.selectIndex = index;
  state.selectData = state.shippingDetail.data[index]
};

// 订单号复制
const copy = (content: string) => {
  mHelper.copy(content);
};
// 初始化数据
const initData = (options) => {
  getOrderDetail(options.id);
};
// 获取物流信息
const getOrderDetail = async (id: string) => {
  try {
    state.shippingDetail = (await memberApi.getOrderProductExpressDetails({
      order_id: id,
    })) as unknown as ShippingInfo;
    //默认显示第一个包裹
    if (Number(state.shippingDetail.count) >= 1) {
      state.selectData = state.shippingDetail.data[0];
    }
    state.loading = false;
  } catch (e) {
    //
    state.loading = false;
  }
};
</script>
<style lang="scss">
.rf-order-shipping {
  width: 100%;
  background-color: $page-color-base;
  padding-top: 20rpx;
  // #ifndef MP-WEIXIN
  min-height: calc(100vh - var(--status-bar-height) - 84rpx);
  // #endif
  // #ifdef MP-WEIXIN
  min-height: calc(100vh);
  // #endif
  padding-bottom: 100rpx;

  .bg-gray {
    background-color: #c5c5c5;
  }


  //多个商品 选择tab
  .package-tab {
    position: sticky;
    // #ifndef MP-WEIXIN
    top: 85rpx;
    // #endif
    // #ifdef MP-WEIXIN
    top: -1rpx;
    // #endif
    z-index: 100;
    width: 96%;
    margin: 0 auto;
    height: 180rpx;
    background-color: #FFFFFF;
    white-space: nowrap;
    border-radius: 10rpx;
    padding: 20rpx;

    &-item {
      width: 220rpx;
      height: 110rpx;
      display: flex;
      align-items: center;
      justify-content: space-around;
      border-radius: 10rpx;
      margin-right: 30rpx;
    }

    &-item-left {
      height: 75%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    &-item-right {
      border: 1rpx solid #eee;
      border-radius: 10rpx;
    }
  }

  //物流信息详情
  .trace-content {
    width: 96%;
    margin: 20rpx auto;
    border-radius: 10rpx;
    background-color: #FFFFFF;
    padding-bottom: 20rpx;

    .express-company {
      margin-bottom: 20rpx;
      border-bottom: 1rpx solid #f0f0f0;
    }

    .trace-box {
      width: 100%;
      display: flex;
      position: relative;

      .trace-left {
        flex: 1;
        width: 5%;
        height: 100%;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: 6rpx;

        .circle {
          width: 20rpx;
          height: 20rpx;
          border-radius: 50%;
        }

        .line {
          width: 4rpx;
          margin-top: 5rpx;
          height: calc(100% - 30rpx);
          flex: 1;
        }
      }

      .trace-right {
        display: flex;
        width: 93%;
        margin-left: 7%;
        flex-direction: column;
        padding-bottom: 20rpx;
      }
    }

    .address {
      position: relative;
      .left {
        width: 5%;
        height: 100%;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding-top: 8rpx;
        .hollow-circle {
          width: 23rpx;
          height: 23rpx;
          border-radius: 50%;
          box-sizing: border-box;
        }
      }
      .right {
        display: flex;
        width: 93%;
        margin-left: 7%;
        flex-direction: column;
        padding-bottom: 20rpx;
        .tag {
          padding: 0 10rpx;
          border-radius: 8rpx;
          margin-left: 10rpx;
        }
      }

    }
  }
  .withoutExpress {
    width: 96%;
    margin: 20rpx auto;
    height: 125rpx;
    background-color: #fff;
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
