<template>
  <view class="rf-attr-popup">
    <!-- 遮罩层 -->
    <view class="mask" @tap="hideSpec" @touchmove.stop.prevent="()=>false" />
    <view
      :style="{ bottom }"
      class="rf-attr-popup__content"
      @tap.stop="() => {}"
    >
      <view class="flex">
        <rf-image
          :src="state.picture || product.picture"
          border-radius="8"
          height="200"
          width="200"
        />
        <view class="flex-1 ml-base">
          <view class="mt-sm-half line-height-2 in2line font-color-dark font-base-2 font-weight-500">
            {{ product.name }}
          </view>
          <view class="font-color-base font-sm-2 line-height-1 in1line mt-sm-half"
          >
            <text v-if="state.specSelected.length > 0">已选：</text>
            <text
              v-for="(sItem, sIndex) in state.specSelected"
              :key="sIndex"
              class="ml-sm"
            >
              {{ sItem.title }}
            </text>
            <text v-if="state.specSelected.length > 0">
              * {{ state.cartCount }}
            </text>
          </view>
          <view class="flex-align-items mt-sm-half">
            <view
              :class="'text-' + themeColor.name"
              class="mr-sm font-weight-500"
            >
              <text v-if="product.marketing_type !== MarketingTypeEnum.POINT_EXCHANGE" class="font-sm">
                {{ moneySymbol }}
              </text>
              <text class="font-base-2">{{ currentProductPrice }}</text>
            </view>
            <rf-image
              v-if="Number(product.is_member_discount)"
              :src="vipPrice"
              height="32"
              width="32"
            />
          </view>
          <view
            v-if="state.stock && product.is_stock_visible === '1'"
            class="font-base font-color-base mt-sm-half"
          >
            库存：{{ state.stock }}{{ product.unit || "件" }}
          </view>
        </view>
      </view>
      <scroll-view class="rf-attr-popup__attr-list" scroll-y>
        <view
          v-for="(item, index) in state.specList"
          :key="index"
          class="attr-list"
        >
          <text>{{ item.title }}</text>
          <view class="item-list">
            <view
              v-for="(childItem, childIndex) in state.specChildList"
              :key="childIndex"
              @tap="
                selectSpec(
                  childIndex,
                  childItem.common_spec_id,
                  item.type,
                  childItem.common_spec_value_id,
                  childItem.disabled,
                  childItem.selected
                )
              "
            >
              <view
                v-if="childItem.common_spec_id === item.common_spec_id"
                :class="[childItem.disabled ? 'disabled' : '']"
                :style="{
                  ...(childItem.selected && parseInt(item.type) === 2
                    ? state.styleObject
                    : {}),
                  backgroundColor: childItem.selected
                    ? `rgba(${themeColor.rgb}, 0.12)`
                    : '',
                  color: childItem.selected ? themeColor.color : '',
                }"
                class="tit"
              >
                <text v-if="parseInt(item.type) === 1">
                  {{ childItem.title }}
                </text>
                <text v-if="parseInt(item.type) === 2">
                  {{ childItem.title }}
                </text>
                <view v-if="parseInt(item.type) === 3">
                  <image
                    :src="childItem.data || product.picture"
                    class="img"
                    mode="aspectFill"
                  />
                  {{ childItem.title }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <view v-if="isSelectedNum" class="flex-between mb-lg">
        <view class="font-color-base font-base-2">
          购买数量
        </view>
        <rf-number-box
          :max="
            parseInt(product.max_buy, 10) ||
              (maxNum === 0 ? Number(state.stock || product.stock) : maxNum)
          "
          :min="minNum"
          :value="state.cartCount"
          @eventChange="numberChange"
        />
      </view>
      <view v-if="!showBuyBtn" class="btn-container">
        <button
          v-if="!showBuyBtn"
          :class="'bg-gradual-' + themeColor.name"
          class="rf-attr-popup__btn font-base ml-sm mr-sm"
          :style="{width: '92.5%'}"
          @tap="toggleSpec"
        >
          完成
        </button>
      </view>
      <view v-else class="flex-between btn-container">
        <button
          v-if="
            product.marketing_type !== MarketingTypeEnum.BARGAIN &&
              product.marketing_type !== MarketingTypeEnum.WHOLESALE &&
              product.marketing_type !== MarketingTypeEnum.PRE_SELL &&
              product.marketing_type !== MarketingTypeEnum.POINT_EXCHANGE &&
              product.marketing_type !== MarketingTypeEnum.SEC_KILL &&
              !mHelper.isVirtualProduct(product.type)
          "
          :class="'bg-gradual-' + themeColor.name"
          class="rf-attr-popup__btn font-base ml-sm mr-sm"
          @tap="toggleSpec(1)"
        >
          加入购物车
        </button>
        <button
          v-if="isCreateOrderBtnShow"
          :class="'bg-gradual-' + themeColor.name"
          class="rf-attr-popup__btn font-base ml-sm mr-sm"
          @tap="toggleSpec(2)"
        >
          {{ handleTypeToDesc(product.marketing_type) }}
        </button>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import {computed, onMounted, reactive,} from "vue";
import {MarketingTypeEnum,} from "@/enum/marketingEnum";
import mHelper from "@/utils/helper";
import mAssetsPath from "@/config/assets";
import mConstData from "@/config/constData";
import {SpecFormatItem, SpecFormatItemValue,} from "@/response/product";
import {subMessage} from "@/utils/wxMpSub/subscribeMessage";
import store from "@/store";

const props = defineProps({
  isCreateOrderBtnShow: {
    type: Boolean,
    default: true,
  },
  showBuyBtn: {
    type: Boolean,
    default: false,
  },
  isSelectedNum: {
    type: Boolean,
    default: true,
  },
  marketType: {
    type: String,
    default: MarketingTypeEnum.BUY_NOW,
  },
  product: {
    type: Object,
    default() {
      return {};
    },
  },
  minNum: {
    type: Number,
    default: 1,
  },
  maxNum: {
    type: Number,
    default: 0,
  },
  bottom: {
    type: String,
    default: "0",
  },
  currentSkuName: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["change", "close", "toggle",]);
let state = reactive({
  styleObject: {},
  specList: [] as SpecFormatItem[],
  specChildList: [] as SpecFormatItemValue[],
  skuId: props.product?.sku_id,
  price: 0 as string | number,
  stock: 0,
  cartCount: props.minNum || 1,
  picture: "",
  specSelected: [] as SpecFormatItemValue[],
  skuName: "",
});

const themeColor = mHelper.getThemeColor();
const vipPrice = mAssetsPath.vipIcon;
const moneySymbol = mConstData.moneySymbol;
const currentProductPrice = computed(() => {
  if (state.price) {
    return state.price;
  }

  // 会员价
  if (Number(props.product.is_member_discount) > 0) {
    return props.product.member_discount_price;
  }

  // 积分兑换
  if (props.product.marketing_type === MarketingTypeEnum.POINT_EXCHANGE) {
    return (Number(props.product.marketing?.marketing_price) > 0 ? `${moneySymbol}${props.product.marketing?.marketing_price} + ${Number(props.product.marketing?.marketing_point)}积分` : `${Number(props.product.marketing?.marketing_point)}积分`);
  }

  // 营销
  if (props.product.marketing_type) {
    return props.product.marketing?.marketing_price;
  }

  return props.product.price;
});
onMounted(() => {
  initData();
});
const hideSpec = () => {
  emit("close");
};
const initData = () => {
  state.specChildList = [];
  state.specList = props.product.spec_format || [];
  state.specList &&
  state.specList.forEach((item) => {
    state.specChildList = [...state.specChildList, ...item.value,];
  });
  state.specChildList.forEach((item) => {
    item.selected = false;
  });
  if (props.currentSkuName) {
    state.specChildList.forEach((item) => {
      if (props.currentSkuName.indexOf(item.title) !== -1) {
        item.selected = true;
        state.specSelected.push(item);
      }
    });
  } else {
    state.specChildList = [];
    state.specSelected = [];
    if (state.specList.length > 0) {
      state.specList.forEach((item) => {
        state.specSelected.push(item.value && item.value[0]);
        item.value[0].selected = true;
        state.specChildList = [...state.specChildList, ...item.value,];
      });
    }
  }
  let skuStrArr: string[] = [];
  state.specSelected.forEach((item) => {
    skuStrArr.push(item.common_spec_value_id);
  });
  if (props.product?.plus_buy_discount) {
    state.price = props.product?.plus_buy_discount;
  }

  // 当前规格
  props.product.sku.forEach((item) => {
    if (item.data === skuStrArr.join("-")) {
      state.stock = item.stock;
      if (props.product.marketing_type === MarketingTypeEnum.POINT_EXCHANGE) {
        state.price = Number(item.marketing_price) > 0 ? `${moneySymbol}${item.marketing_price} + ${item.marketing_point}积分` : `${Number(item.marketing_point)}积分`;
      } else if (Number(props.product.is_member_discount) > 0) {
        state.price = item.member_discount_price;
      } else if (props.product.marketing_type) {
        state.price = item.marketing_price;
      } else {
        state.price = item.price;
      }
      state.skuName = item.name;
      state.skuId = item.id;
    }
  });

  if (!state.skuId) {
    state.specChildList = [];
    state.specList.length > 0 &&
    state.specList.forEach((item) => {
      state.specSelected.push(item.value && item.value[0]);
      item.value[0].selected = false;
      state.specChildList = [...state.specChildList, ...item.value,];
    });
  }
};
const numberChange = (data) => {
  state.cartCount = parseInt(data.number || "1", 10);
};
// 选择规格
const selectSpec = (index, pid, type, baseSpecValueId, disabled, selected) => {
  if (disabled) return;
  let list: SpecFormatItemValue[] = state.specChildList;
  list.forEach((item) => {
    if (item.common_spec_id === pid) {
      item.selected = false;
    }
  });
  if (parseInt(type, 10) === 3) {
    state.picture = list[index].data;
  }
  if (parseInt(type, 10) === 2) {
    state.styleObject = {
      color: list[index].data,
      border: "1px solid",
    };
  }
  list[index].selected = !selected;
  // 存储已选择
  /**
   * 修复选择规格存储错误
   * 将这几行代码替换即可
   * 选择的规格存放在specSelected中
   */
  state.specSelected = [];
  list.forEach((item) => {
    if (item.selected) state.specSelected.push(item);
  });
  let baseSpecValueIdArr: string[] = [];
  state.specSelected.forEach((item) => {
    baseSpecValueIdArr.push(item.common_spec_value_id);
  });
  let disabledSkuArr: string[] = [];
  props.product.sku.forEach((item) => {
    // if (item.data.indexOf(baseSpecValueId) !== -1 && state.specList.length === 2) {
    baseSpecValueIdArr.forEach((sItem) => {
      // 两数组相减
      // if (item.data.indexOf(sItem) !== -1) {
      // 	let skuValueId = item.data.replace('-', '').replace(sItem, '');
      // 	disabledSkuArr = [...disabledSkuArr, ...skuValueId.split('-')];
      // }
      // 两数组相减
      // if (state.specSelected.length >= 2) {
      // 	if (mHelper.isArrContained(item.data.split('-'), baseSpecValueIdArr)) {
      // 		const arr = item.data.split('-').filter(i => !baseSpecValueIdArr.includes(i));
      // 		disabledSkuArr = [...disabledSkuArr, ...arr];
      // 	} else {
      // 		// if (item.data.indexOf(sItem) !== -1) {
      // 		// 	let skuValueId = item.data.replace('-', '').replace(sItem, '');
      // 		// 	disabledSkuArr = [...disabledSkuArr, ...skuValueId.split('-')];
      // 		// }
      // 	}
      // } else {
      if (item.data.indexOf(sItem) !== -1) {
        let skuValueId = item.data.replace("-", "").replace(sItem, "");
        disabledSkuArr = [...disabledSkuArr, ...skuValueId.split("-"),];
      }
      // }
    });
    // if (item.data.indexOf(baseSpecValueId) !== -1) {
    // 	let skuValueId = item.data.replace('-', '').replace(baseSpecValueId, '');
    // 	// baseSpecValueIdArr.forEach(sItem => {
    // 	// 	skuValueId = skuValueId.replace('-', '').replace(sItem, '');
    // 	// });
    // 	// disabledSkuArr.push(...disabledSkuArr, ...skuValueId.split('-'));
    // 	disabledSkuArr.push(skuValueId);
    // }
  });
  disabledSkuArr = Array.from(new Set(disabledSkuArr));
  state.skuId = "";
  list.forEach((item) => {
    if (item.common_spec_id !== pid)
      item.disabled = disabledSkuArr.indexOf(item.common_spec_value_id) === -1;
  });
  let skuStr: string[] = [];
  state.specSelected.forEach((item) => {
    skuStr.push(item.common_spec_value_id);
  });
  props.product.sku.forEach((item) => {
    if (item.data === skuStr.join("-")) {
      state.picture = item.picture;
      state.stock = item.stock;
      // if (props.product.marketing_type === MarketingTypeEnum.POINT_EXCHANGE) {
      //   state.price = Number(item.marketing_price) > 0 ? `${item.marketing_price}元 + ${item.marketing_point}积分` : `${Number(item.marketing_point)}积分`;
      // } else if (props.product.plus_buy_discount) {
      //   state.price = props.product.plus_buy_discount;
      // } else {
      //   state.price =
      //     props.marketType === "wholesale"
      //       ? item.wholesale_price
      //       : props.product.is_member_discount === "1"
      //         ? item.member_discount_price
      //         : item.price;
      // }
      if (props.product.marketing_type === MarketingTypeEnum.POINT_EXCHANGE) {
        state.price = Number(item.marketing_price) > 0 ? `${moneySymbol}${item.marketing_price} + ${item.marketing_point}积分` : `${Number(item.marketing_point)}积分`;
      } else if (Number(props.product.is_member_discount) > 0) {
        state.price = item.member_discount_price;
      } else if (props.product.marketing_type) {
        state.price = item.marketing_price;
      } else {
        state.price = item.price;
      }
      state.skuId = item.id;
      state.skuName = item.name;
    }
    // else {
    // 	if (item.data.indexOf(skuStr.join('-')) !== -1) {
    // 		state.specChildList.forEach(item2 => {
    // 			if (item2.common_spec_value_id === '120') {
    // 				item2.disabled = true;
    // 			}
    // 		});
    // 	}
    // }
  });
};
// 显示营销描述
const handleTypeToDesc = (type: string) => {
  let str;
  switch (type) {
    case MarketingTypeEnum.BARGAIN:
      str = "立即砍价";
      break;
    case MarketingTypeEnum.WHOLESALE:
      str = "立即拼团";
      break;
    case MarketingTypeEnum.PRE_SELL:
      str = "立即预定";
      break;
    case MarketingTypeEnum.GROUP_BUY:
      str = "立即团购";
      break;
    case MarketingTypeEnum.SEC_KILL:
      str = "立即秒杀";
      break;
    case MarketingTypeEnum.DISCOUNT:
      str = "立即抢购";
      break;
    case MarketingTypeEnum.POINT_EXCHANGE:
      str = "积分兑换";
      break;
    default:
      str = "立即购买";
      break;
  }
  return str;
};

const toggleSpec = async (type) => {
  //如果未登陆
  if (!mHelper.hasLogin()) {
    // eslint-disable-next-line no-case-declarations
    const accessToken = store.getters["user/getAccessToken"];
    uni.showModal({
      content: accessToken
          ? "会话已过期，是否跳转登录页面？"
          : "目前暂未登录，是否跳转登录页面？",
      success: (confirmRes) => {
        if (confirmRes.confirm) {
          mHelper.backToLogin();
        }
      },
    });
    return;
  }
  for (let i = 0; i < state.specSelected.length; i++) {
    if (state.specSelected[i].disabled) return;
  }
  if (!state.skuId) {
    mHelper.toast("请选择规格");
    return;
  }
  if (state.stock < 1) {
    mHelper.toast("库存不足");
    return;
  }
  // #ifdef MP-WEIXIN
  //如果是砍价 发起订阅
  if (props.product.marketing_type === MarketingTypeEnum.BARGAIN) {
    await subMessage('bargain');
  }
  // #endif
  if (
      props.marketType !== MarketingTypeEnum.BUY_NOW &&
      props.product.marketing?.min_buy > state.cartCount
  ) {
    mHelper.toast(
        `${props.product.marketing?.min_buy}${props.product.unit || "件"}起购`
    );
    return;
  }
  emit(
      "toggle",
      {
        stock: state.stock,
        skuId: state.skuId,
        cartCount: state.cartCount,
        skuName: state.skuName,
        price: state.price,
        marketing_type: props.product.marketing_type,
        marketing_id: props.product.marketing_id,
        marketing_product_id: props.product.marketing_product_id,
        merchant_id: props.product.merchant_id,
        product_id: props.product.id,
        type,
      },
      props.product.marketing_id || ""
  );
};
</script>
<style lang="scss" scoped>
.rf-attr-popup {
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999;

  .mask {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .btn-container {
    width: 100%;
  }

  &__btn {
    width: 100%;
    height: 66rpx;
    line-height: 66rpx;
    border-radius: 100rpx;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__attr-list {
    max-height: calc(65vh - 440rpx);
  }

  @keyframes show-content {
    0% {transform: translateY(100%)}
    100% {transform: translateY(0%)}
  }

  &__content {
    animation: show-content 300ms 1;
    background-color: #fff;
    z-index: 999;
    padding: 30rpx 30rpx calc(env(safe-area-inset-bottom) / 2);
    position: fixed;
    max-height: 65%;
    padding-bottom: 50rpx;
    width: 100%;
    border-radius: 20rpx 20rpx 0 0;
    //.select-count {
    //  padding: 30rpx 0 10rpx;
    //  margin: 20rpx 0;
    //  border-top: 1px solid #ccc;
    //  display: flex;
    //  justify-content: space-between;
    //  overflow: hidden;
    //  position: relative;
    //  font-size: $font-base + 6rpx;
    //  color: $font-color-base;
    //  line-height: 60rpx;
    //  .step {
    //    position: absolute;
    //    left: 60vw;
    //    bottom: 10rpx;
    //  }
    //}
    .attr-list {
      display: flex;
      flex-direction: column;
      font-size: $font-base + 2rpx;
      color: $font-color-base;
      padding-top: 30rpx;
      padding-left: 10rpx;
    }

    .item-list {
      padding: 20rpx 0 0;
      display: flex;
      flex-wrap: wrap;

      .tit {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1rpx solid rgba(0, 0, 0, 0.05);
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        border-radius: 100rpx;
        min-width: 60rpx;
        height: 60rpx;
        padding: 0 20rpx;
        font-size: $font-base;

        .img {
          width: 36rpx;
          height: 24rpx;
          margin: 0 4rpx;
        }
      }

      .disabled {
        opacity: 0.5;
      }

      .tit-normal {
        background-color: $page-color-light;
      }
    }
  }

  .sku-info-wrapper {
    width: 100%;
    padding-bottom: $spacing-sm;
  }

  .price-wrapper {
    height: 38rpx;
    display: flex;
    align-items: center;
    margin: $spacing-sm 0;

    .image {
      width: 36rpx;
      height: 36rpx;
      margin-left: 6rpx;
      margin-bottom: 4rpx;
    }

    .base-color {
      margin-top: 2rpx;
    }
  }
}
</style>
