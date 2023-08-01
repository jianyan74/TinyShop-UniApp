<template>
  <view class="rf-refund">
    <!-- 商品 -->
    <view class="rf-base-product-list">
      <view
        class="rf-base-product-item"
        @tap="navTo(mRouteConfig.product, { id: state.productInfo.product_id })"
      >
        <rf-image
          :src="state.productInfo.product_picture"
          border-radius="12"
          height="180"
          width="180"
        />
        <view class="flex-1 ml-base">
          <view class="rf-base-product-item__title in2line font-lg">{{
            state.productInfo.product_name
          }}
          </view>
          <view class="rf-base-product-item__sku font-weight-light font-sm">
            {{ state.productInfo.sku_name }}
          </view>
          <view
            :class="'text-' + themeColor.name"
            class="rf-base-product-item__price"
          >
            <text class="font-sm">{{ moneySymbol }}
            </text
            >
            {{ state.productInfo.product_money }} *
            {{ state.productInfo.num }}
          </view>
        </view>
      </view>
    </view>
    <view class="product-textarea pt-base">
      <radio-group
        v-if="state.refundType !== 1"
        class="refund-type"
        @change="handleRefundTypeChange"
      >
        <label v-for="(item, index) in refundTypeArr" :key="index">
          <radio
            :checked="state.refundRadioType === Number(item.value)"
            :color="themeColor.color"
            :value="item.value"
            class="gender-item-radio"
          />
          <text class="mr-base">{{ item.name }}</text>
        </label>
      </radio-group>
      <view class="feedback-title" @tap.stop="chooseRefundReasonType">
        <text>退款原因</text>
        <view class="feedback-quick">
          <text :class="state.refundReason?'':'font-color-light'" class="mr-sm">{{
            state.refundReason || "请选择"
          }}
          </text>
          <rf-icon color="#999" name="iconxia" padding-top="5" size="26" />
        </view>
      </view>
      <textarea
        v-model="state.refundExplain"
        class="textarea"
        placeholder="宝贝不满足您的期待吗？请填写一下您的退货/退款理由吧"
        placeholder-style="color:#ccc; font-size: 26rpx"
      />
      <view class="feedback-title">
        <text>退款金额</text>
        <text :class="'text-' + themeColor.name" class="font-sm font-weight">
          <text>{{ moneySymbol }}</text>
          <text>{{ state.productInfo.product_money }}</text>
        </text>
      </view>
      <view class="feedback-content">
        <text class="font-xs">成功退款后，该订单的金额会退回至原支付账户</text>
      </view>
      <!--  上传凭证    -->
      <view class="feedback-title mt-lg">
        <text class="font-base">上传凭证(选填,提供至多3张截图)</text>
      </view>
      <view class="rf-uploader pl-lg pr-lg">
        <view class="rf-uploader-content">
          <view class="mt-sm">
            <text class="font-xs">点击预览图片 {{ state.imageList.length }}/3</text>
          </view>
          <view class="uni-uploader-body">
            <view class="rf-uploader-content__files">
              <block v-for="(image, index) in state.imageList" :key="index">
                <view class="rf-uploader-content__file">
                  <rf-image
                    :src="image"
                    class="rf-uploader-content__img"
                    height="210"
                    width="210"
                  />
                  <view class="rf-uploader-content__close font-weight-500" @tap="close(index)">
                    <rf-icon name="iconxiaoxi_guanbi" scale="0.8" size="20" />
                  </view>
                </view>
              </block>
              <view
                v-if="state.imageList.length < 3"
                class="rf-uploader-content__input-box"
              >
                <view
                  class="rf-uploader-content__input"
                  @tap="uploadImage"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="pl-lg pr-lg">
        <button
          :class="'bg-gradual-' + themeColor.name"
          :disabled="state.btnLoading"
          :loading="state.btnLoading"
          class="rf-confirm-btn"
          @tap="handleOrderRefundApply"
        >
          {{
            Number(state.refundRadioType) === 1
              ? "仅退款"
              : Number(state.refundRadioType) === 2
                ? "退款且退货"
                : "换货"
          }}
        </button>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import {reactive,} from "vue";
import mHelper from "@/utils/helper";
import mConstData from "@/config/constData";
import {onLoad,} from "@dcloudio/uni-app";
import {Route,} from "@/response/route";
import mRouter from "@/utils/routerUtil";
import mRouteConfig from "@/config/routes";
import commonApi from "@/api/tinyShop/common";
import memberApi from "@/api/tinyShop/member";
import {UploadImage,} from "@/response/upload";
import {Product,} from "@/response/order";
import {subMessage} from "@/utils/wxMpSub/subscribeMessage"; // 路由管理

const themeColor = mHelper.getThemeColor(); // 主题颜色

let state = reactive({
  productInfo: {} as Product,
  refundType: 1,
  refundRadioType: 1,
  btnLoading: false,
  refundReason: "",
  imageList: [] as string[],
  refundExplain: "",
});

const moneySymbol = mConstData.moneySymbol;
const refundTypeArr = [
  {
    value: "1",
    name: "仅退款",
  },
  {
    value: "2",
    name: "退款且退货",
  },
  {
    value: "3",
    name: "换货",
  },
];

const msgContents = [
  "商品信息描述不符/质量问题",
  "退运费",
  "少件含缺少配件",
  "包装/商品损坏/污渍",
  "卖家发错货/未按约定时间发货",
  "发票问题/其他",
];

onLoad((options) => {
  initData(options);
});

// 数据初始化
const initData = (options) => {
  if (options.data) state.productInfo = JSON.parse(options.data);
  state.refundType = Number(options.refundType);
  state.refundRadioType = state.refundType;
  // let title;
  // if (state.refundType === 1) {
  //   title = "申请退款";
  // } else if (state.refundType === 2) {
  //   title = "退款且退货";
  // } else {
  //   title = "换货";
  // }
  // uni.setNavigationBarTitle({
  //   title,
  // });
};
// 快速输入
const chooseRefundReasonType = () => {
  uni.showActionSheet({
    itemList: msgContents,
    success: (res) => {
      state.refundReason = msgContents[res.tapIndex];
    },
    fail: (res) => {
      console.log(res);
    },
  });
};
// 打开相册选图
const uploadImage = () => {
  uni.chooseImage({
    count: 3, // 最多一次可以选择的图片张数
    sizeType: ["compressed",],
    sourceType: ["album", "camera",], // album 从相册选图，camera 使用相机
    success: function (res: AnyObject) {
      if (state.imageList.length + res.tempFiles.length > 9) {
        mHelper.toast("不要贪心哦，最多只可上传3张照片");
        return;
      }
      handleUploadFile(res.tempFilePaths);
    },
  });
};
// 依次上传图片
const handleUploadFile = async (data) => {
  for (const item of data) {
    try {
      const data = (await commonApi.handleUploadImage({
        filePath: item,
        name: "file",
      })) as unknown as UploadImage;
      state.imageList.push(data.url);
    } catch (e) {
      //
    }
  }
};
// 删除已选中图片
const close = (e) => {
  state.imageList.splice(e, 1);
};
const handleRefundTypeChange = (e) => {
  state.refundRadioType = e.detail.value;
};
// 跳转页面
const navTo = (route: Route, query = {}) => {
  mRouter.push({route, query,});
};
// 退货/退款
const handleOrderRefundApply = async () => {
  // #ifdef MP-WEIXIN
  // 如果是小程序 发起订阅
  await subMessage('afterSale');
  // #endif
  const formData: AnyObject = {};
  formData.refund_type = state.refundRadioType;
  formData.refund_evidence = JSON.stringify(state.imageList);
  formData.refund_explain = state.refundExplain;
  formData.refund_reason = state.refundReason;
  state.btnLoading = true;
  try {
    await memberApi.handleOrderAfterSaleApply({
      id: state.productInfo.id,
      ...formData,
    });
    mHelper.toast("申请成功");
    mRouter.back();
    state.btnLoading = false;
  } catch (e) {
    //
    state.btnLoading = false;
  }
};
</script>
<style lang="scss" scoped>
.rf-refund {
  .product-textarea {
    margin: $spacing-base 0 0;

    .gender-item-radio {
      transform: scale(0.7);
    }

    .refund-type {
      margin: $spacing-base $spacing-lg;
    }

    .textarea {
      width: 94%;
      margin: 15rpx auto;
      height: 250rpx;
      padding: 20rpx $spacing-lg;
      border: 1rpx solid rgba(0, 0, 0, 0.05);
    }
  }

  /*问题反馈*/
  .feedback-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 $spacing-lg;
    font-size: $font-base;
  }

  .feedback-quick {
    flex-grow: 3;
    display: flex;
    justify-content: flex-end;
    flex-flow: row wrap;
    align-items: center;
  }

  .feedback-content {
    padding: 0 $spacing-lg $spacing-base;
    color: $font-color-light;
  }

  .feedback-body {
    background: $color-white;
    padding: $spacing-base $spacing-lg;
  }

  .rf-base-product-list {
    .rf-base-product-item {
      margin: $spacing-base $spacing-lg;
      box-shadow: 0rpx 5rpx 20rpx rgba(0, 0, 0, 0.1);
      padding: $spacing-base;
      display: flex;

      &__title {
        height: 84rpx;
      }

      &__sku {
        height: 44rpx;
      }
    }
  }
}
</style>
