<template>
  <view class="rf-create-order">
    <view v-if="state.orderDetail?.items?.length > 0">
      <!--选择地址-->
      <view
        v-if="
          !mHelper.isVirtualProduct(
            state.orderDetail?.items[0]?.products[0].product_type
          )
        "
        class="rf-create-order__address flex"
        @tap="baseNavTo(mRouteConfig.address, { source: 1 })"
      >
        <rf-icon
          :color="themeColor.color"
          name="iconquerendingdan_dizhi"
          size="46"
        />
        <view class="flex-align-items flex-1">
          <view v-if="state.addressData" class="flex-1 ml-base">
            <view class="mb-sm">
              <text class="font-color-black font-base-2 mr-base">{{
                state.addressData.realname
              }}
              </text>
              <text class="font-color-black">{{
                state.addressData.mobile
              }}
              </text>
            </view>
            <view class="in1line font-color-black">
              {{
                state.addressData.name
              }}
            </view>
            <view class="in1line font-color-black">
              {{
                state.addressData.details
              }}
            </view>
          </view>
          <view v-else class="mr-base flex-1">
            请选择收货地址
          </view>
          <rf-icon class="font-color-light" name="iconyou" size="28" />
        </view>
      </view>
      <!--订单信息-->
      <view
        v-for="(fItem, fIndex) in state.orderDetail.items"
        :key="fItem.merchant?.id"
        class="rf-create-order__content"
      >
        <!--商品列表-->
        <view class="rf-create-order__content__product">
          <!--商家信息-->
          <view class="flex-align-items mb-lg" style="flex-direction: row-reverse">
            <text
              :class="'text-' + themeColor.name"
              @tap="
                baseNavTo(mRouteConfig.couponList, {
                  merchant_id: fItem.merchant?.id,
                })
              "
            >领券
            </text>
          </view>
          <!-- 商品列表 -->
          <view
            v-for="(item, index) in fItem.products"
            :key="index"
            class="rf-create-order__content__product__item mb-base"
            @tap="
              navToProduct(
                item.product_id,
                item.marketing_type,
                item.marketing_id
              )
            "
          >
            <rf-image
              :src="item.product_picture"
              border-radius="12"
              height="160"
              width="160"
            />
            <view class="ml-base mr-base flex-1">
              <view class="mb-base font-base-2 in2line flex-align-items">
                <rf-tag
                  v-if="item.gift_flag"
                  :bg-color="`rgba(${themeColor.rgb}, 0.12)`"
                  :border-radius="6"
                  :color="themeColor.color"
                  text="赠品"
                />
                {{ item.product_name }}
              </view
              >
              <view
                v-if="item.sku_name"
                class="font-color-light font-sm-2"
              >
                {{ item.sku_name }}
              </view
              >
            </view>
            <view class="text-right">
              <view class="font-lg font-weight-500 mb-sm"
              >
                <text class="font-sm">
                  {{ moneySymbol }}
                </text>
                <text> {{ item.product_original_money }}</text>
              </view>
              <view class="font-base font-color-light font-weight-normal">
                x{{ item.num }}
              </view
              >
            </view>
          </view>
        </view>
        <!-- 优惠明细 -->
        <view class="b-b-base">
          <view
            v-if="
              state.orderDetail.marketingType !==
                MarketingTypeEnum.POINT_EXCHANGE
            "
            class="rf-create-order__content__item"
            @tap="toggleMask('show', fIndex)"
          >
            <text class="font-base font-color-dark flex-shrink mr-lg">
              优惠券
            </text>
            <view
              v-if="fItem?.currentCoupon?.title"
              class="font-base-2 font-weight-500 mr-sm flex-1 in1line text-right"
            >
              {{ fItem?.currentCoupon?.title }}
            </view>
            <text v-else class="font-color-light">
              {{
                fItem?.coupons?.length > 0 ? "点击使用优惠券" : "暂无可用优惠券"
              }}
            </text>
            <rf-icon
              v-if="fItem.currentCoupon?.title"
              :class="'text-' + themeColor.name"
              name="iconshanchu4"
              @tap.stop="clearCoupon(fIndex)"
            />
          </view>
          <!--  配送方式        -->
          <view
            v-if="fItem.config.pickerShippingTypeArr?.length > 0 && !mHelper.isVirtualProduct(state.orderDetail.productType)"
            class="rf-create-order__content__item"
            @tap="showSinglePicker(fIndex)"
          >
            <text class="font-base font-color-dark flex-1">
              配送方式
            </text>
            <text
              v-if="fItem.config.currentShippingType?.label"
              class="font-base font-weight-500 mr-sm"
            >
              {{ fItem.config.currentShippingType?.label }}
            </text>
            <text v-else class="font-color-light">
              选择配送方式
            </text>
            <rf-icon
              class="font-color-light"
              name="iconyou"
              size="28"
            />
          </view>
          <!--   选择快递公司       -->
          <view
            v-if="
              fItem.config.currentShippingType?.value ===
                OrderShippingType.LOGISTICS &&
                fItem.config.logistics_list.length > 0 && !mHelper.isVirtualProduct(state.orderDetail.productType)
            "
            class="rf-create-order__content__item"
            @tap="showCompanyPicker(fIndex)"
          >
            <text class="font-base font-color-dark mr-base">
              快递公司
            </text>
            <text
              v-if="fItem.config.currentLogistics?.label"
              class="font-base font-weight-500 mr-sm text-right flex-1 in1line"
            >
              {{ fItem.config.currentLogistics?.label }}
            </text>
            <text v-else class="font-color-light">
              选择物流公司
            </text>
            <rf-icon
              class="font-color-light"
              name="iconyou"
              size="28"
            />
          </view>
          <!--   门店自提       -->
          <view
            v-if="
              fItem.config.currentShippingType?.value ===
                OrderShippingType.PICK_UP &&
                fItem.config.logistics_pick_up_list.length > 0 && !mHelper.isVirtualProduct(state.orderDetail.productType)
            "
            class="rf-create-order__content__item"
            @tap="showPickupPointPicker"
          >
            <text class="font-base font-color-dark mr-base">
              门店自提点
            </text>
            <view
              v-if="fItem.config.currentPickupPoint?.label"
              class="font-base font-weight-500 mr-sm text-right in1line flex-1"
            >
              {{ fItem.config.currentPickupPoint?.title }}
            </view>
            <text v-else class="font-color-light">
              请选择自提点
            </text>
            <rf-icon
              class="font-color-light"
              name="iconyou"
              size="28"
            />
          </view>
          <!--    配送时间      -->
          <view
            v-if="
              fItem.config.currentShippingType?.value ===
                OrderShippingType.PICK_UP ||
                fItem.config.currentShippingType?.value ===
                OrderShippingType.LOCAL_DISTRIBUTION
                && !mHelper.isVirtualProduct(state.orderDetail.productType)
            "
            class="rf-create-order__content__item"
            @tap="
              toggleShippingTimeMask(
                fIndex,
                'show',
                fItem.config.currentShippingType?.value
              )
            "
          >
            <text class="font-base font-color-dark mr-base">{{
              fItem.config.currentShippingType?.value ===
                OrderShippingType.LOCAL_DISTRIBUTION
                ? "配送时间"
                : "自提时间"
            }}
            </text>
            <text
              v-if="fItem.preview.distribute_time_out"
              class="font-base font-weight-500 mr-sm text-right in1line flex-1"
            >
              {{ fItem.preview.distribute_time_out }}
            </text>
            <text
              v-else
              class="font-color-light text-right in1line flex-1"
            >选择配送时间
            </text>
            <rf-icon
              class="font-color-light"
              name="iconyou"
              size="28"
            />
          </view>
        </view>
        <!-- 金额明细 -->
        <view class="b-b-base">
          <view class="rf-create-order__content__item">
            <text class="font-base font-color-dark flex-1">
              商品总价
            </text>
            <text class="font-base font-weight-500">
              <text class="font-base">{{ moneySymbol }}</text>
              <text>{{ fItem.preview?.product_original_money }}</text>
            </text>
          </view>
          <view
            v-if="state.marketingFee?.merchant && state.marketingFee?.merchant[fIndex]?.coupon > 0"
            class="rf-create-order__content__item"
          >
            <text class="font-base font-color-dark flex-1">
              优惠券抵扣
            </text>
            <text class="font-base font-weight-500">
              <text class="font-sm">{{ `-` + moneySymbol }}</text>
              <text>{{ state.marketingFee?.merchant[fIndex]?.coupon || 0 }}</text>
            </text>
          </view>
          <!--营销金额优惠-->
          <view v-for="(item, index) in fItem?.marketingDetails" :key="index">
            <view class="rf-create-order__content__item">
              <text
                v-if="item.marketing_type === 'full_mail'"
                class="font-base font-color-dark flex-1"
              >运费
              </text
              >
              <text v-else class="font-base font-color-dark flex-1">{{
                item.marketing_name
              }}
              </text>
              <view
                v-if="item.marketing_type === 'give_point'"
                class="font-base font-weight-500"
              >
                {{ item.discount_money }}积分
              </view
              >
              <view
                v-else-if="item.marketing_type === 'full_mail'"
                class="font-base font-weight-500"
              >
                {{ item.marketing_name }}
              </view
              >
              <view
                v-else-if="item.marketing_type === 'give_growth'"
                class="font-base font-weight-500"
              >
                {{ item.discount_money }}成长值
              </view
              >
              <view
                v-else
                class="font-base font-weight-500"
              >
                <text class="font-sm">{{ `-` + moneySymbol }}</text>
                <text>{{ item.discount_money }}</text>
              </view
              >
            </view>
          </view>
          <view
            v-if="
              state.marketingFee?.merchant &&
                state.marketingFee?.merchant[fIndex]?.shipping > 0
            "
            class="rf-create-order__content__item"
          >
            <text class="font-base font-color-dark flex-1">
              运费
            </text>
            <text class="font-base font-weight-500">
              <text class="font-sm">{{ moneySymbol }}</text>
              <text>{{ state.marketingFee?.merchant[fIndex]?.shipping || 0 }}</text>
            </text>
          </view>
          <view
            v-if="
              state.marketingFee?.merchant &&
                state.marketingFee?.merchant[fIndex]?.invoice > 0
            "
            class="rf-create-order__content__item"
          >
            <text class="font-base font-color-dark flex-1">
              发票税费
            </text>
            <text class="font-base font-weight-500">
              <text class="font-sm">{{ moneySymbol }}</text>
              <text>{{ state.marketingFee?.merchant[fIndex]?.invoice }}</text>
            </text>
          </view>
          <view class="rf-create-order__content__item">
            <text class="font-base font-color-dark flex-1">
              小计
            </text>
            <text
              :class="'text-' + themeColor.name"
              class="font-lg font-weight"
            >
              <text class="font-sm">{{ moneySymbol }}</text>
              <text>{{
                (state.marketingFee?.merchant &&
                  state.marketingFee?.merchant[fIndex]?.pay) ||
                  0
              }}
              </text>
            </text>
          </view>
        </view>
        <view>
          <view
            v-if="state.orderDetail.items[0]?.preview.invoice_is_open !== 0"
            @tap="navTo(mRouteConfig.invoice, { source: 1 }, fIndex)"
          >
            <view class="rf-create-order__content__item">
              <text class="font-base font-color-dark flex-1">
                开具发票
              </text>
              <view class="font-base font-weight-500">
                <view
                  v-if="fItem.currentInvoiceItem?.type"
                  class="invoice lh-15 text-right"
                >
                  {{
                    `电子发票 - ${
                      fItem.currentInvoiceItem?.type === "1" ? "公司" : "个人"
                    } - ${fItem?.currentInvoiceItem?.title}`
                  }}
                  <rf-icon
                    :class="'text-' + themeColor.name"
                    name="iconshanchu4"
                    @tap.stop="closeInvoice(fIndex)"
                  />
                </view>
                <text
                  v-else
                  class="font-color-light font-weight-normal"
                >本次不开具发票
                </text
                >
                <view
                  v-if="
                    fItem.currentInvoiceItem?.type &&
                      fItem.config?.order_invoice_content?.length > 0
                  "
                  class="lh-15"
                >
                  <radio-group class="gender" name="gender">
                    <label
                      v-for="(item, index) in fItem.config
                        .order_invoice_content"
                      :key="index"
                      class="gender-item"
                    >
                      <radio
                        :checked="index === 0"
                        :color="themeColor.color"
                        class="gender-item-radio"
                        style="transform: scale(0.7)"
                        @click.stop="handleInvoiceChange(fIndex, item)"
                      />
                      <text class="gender-item-text">
                        {{ item }}
                      </text>
                    </label>
                  </radio-group>
                </view>
              </view>
            </view>
          </view>
          <view class="rf-create-order__content__item">
            <text class="font-base font-color-dark flex-1">
              备注
            </text>
            <view class="text-right">
              <input
                v-model="fItem.preview.buyerMessage"
                placeholder="请填写备注信息"
                placeholder-style="color: #999;"
                type="text"
              >
            </view>
          </view>
        </view>
      </view>
      <view
        v-if="
          mHelper.isVirtualProduct(
            state.orderDetail?.items[0]?.products[0].product_type
          )
        "
        class="rf-create-order__content"
      >
        <view class="rf-create-order__content__item">
          <text class="font-base font-color-dark flex-1">
            用户姓名
          </text>
          <view class="text-right">
            <input
              v-model="state.commonParams.receiver_name"
              placeholder="请填写用户姓名"
              placeholder-style="color: #999;"
              type="text"
            >
          </view>
        </view>
        <view class="rf-create-order__content__item">
          <text class="font-base font-color-dark flex-1">
            联系方式
          </text>
          <view class="text-right">
            <input
              v-model="state.commonParams.receiver_mobile"
              maxlength="11"
              placeholder="请填写联系方式"
              placeholder-style="color: #999;"
              type="number"
            >
          </view>
        </view>
      </view>
      <!-- 底部 -->
      <view class="rf-create-order__footer">
        <view class="price-content in1line font-weight-500 font-color-base">
          <view class="flex">
            <text class="font-lg mr-base">
              合计
            </text>
            <view
              v-if="
                state.orderDetail.marketingType ===
                  MarketingTypeEnum.POINT_EXCHANGE
              "
            >
              <text
                v-if="Number(state.marketingFee.pay) > 0"
                :class="'text-' + themeColor.name"
                class="font-lg"
              >
                <text :class="'text-' + themeColor.name" class="font-base">{{
                  moneySymbol
                }}
                </text>
                <text class="font-lg">{{ state.marketingFee.pay + ` + ` }}</text>
              </text>
              <text
                :class="'text-' + themeColor.name"
                class="font-lg"
              >{{ state.marketingFee.point + `积分` }}
              </text>
            </view>
            <view v-else>
              <text :class="'text-' + themeColor.name" class="font-base">{{
                moneySymbol
              }}
              </text>
              <text :class="'text-' + themeColor.name" class="font-lg">{{
                state.marketingFee.pay
              }}
              </text>
            </view>
          </view>
        </view>
        <button
          :class="'bg-gradual-' + themeColor.name"
          :disabled="state.btnLoading"
          :loading="state.btnLoading"
          class="rf-short-btn"
          @tap="submit"
        >
          提交订单
        </button>
      </view>
    </view>
    <!-- 404页面 -->
    <rf-no-data
      v-if="!state.orderDetail?.items && !state.loading"
      :error-text="state.errorInfo"
      @refresh="getOrderDetail"
    />
    <!--页面加载动画-->
    <rf-loading :active="state.loading" />
    <!-- 优惠券面板 -->
    <view
      :class="state.maskState === 1 ? 'show' : 'none'"
      class="mask"
      @tap="toggleMask"
      @touchmove.stop.prevent="() => {}"
    >
      <view class="mask-content" @tap.stop.prevent="() => {}">
        <!-- 优惠券列表 -->
        <view
          v-if="state.shippingTimeVisible"
          class="text-center font-lg font-weight-500 pt-lg pb-lg"
        >
          选择时间
        </view
        >
        <scroll-view scroll-y style="max-height: 700rpx; background: #f8f8f8">
          <view v-if="!state.shippingTimeVisible">
            <view
              v-for="(item, index) in state.currentCouponList"
              :key="index"
              @tap="handleCouponSelect(item)"
            >
              <rf-coupon :coupon-info="item" />
            </view>
            <!-- 优惠券页面 -->
            <text
              v-if="state.currentCouponList.length === 0"
              class="no-coupon"
            >暂无优惠券
            </text
            >
          </view>
          <view v-else class="express-company-config">
            <rf-menu
              :left-width="150"
              :menus="state.expressCompanyConfig"
              @change="handleExpressCompanyConfigChange"
            />
          </view>
        </scroll-view>
        <button
          v-if="state.shippingTimeVisible"
          :class="'bg-gradual-' + themeColor.name"
          class="btn ml-lg mr-lg mb-lg"
          @tap="handleExpressCompanyConfigClose"
        >
          确定
        </button>
      </view>
    </view>
    <rf-picker
      ref="shippingTypePicker"
      :deep-length="1"
      :picker-value-array="state.pickerArr"
      :theme-color="themeColor.color"
      mode="selector"
      @onConfirm="onShippingConfirm"
    />
    <rf-picker
      ref="companyTypePicker"
      :deep-length="1"
      :picker-value-array="state.pickerArr"
      :theme-color="themeColor.color"
      mode="selector"
      @onConfirm="onCompanyConfirm"
    />
    <rf-picker
      ref="pickupPointPicker"
      :deep-length="1"
      :picker-value-array="state.pickerArr"
      :theme-color="themeColor.color"
      mode="selector"
      @onConfirm="onPickupPointConfirm"
    />
  </view>
</template>
<script lang="ts" setup>
import {computed, reactive, ref,} from "vue";
import {onLoad, onShow,} from "@dcloudio/uni-app";
import mConstData from "@/config/constData";
import mHelper from "@/utils/helper";
import {Route,} from "@/response/route";
import mRouter from "@/utils/routerUtil";
import mRouteConfig from "@/config/routes";
import orderApi from "@/api/tinyShop/order";
import {Address, Coupon, Logistics_pick_up_config, MarketingFee, OrderItemsPreview,} from "@/response/order";
import store from "@/store";
import {OrderShippingType,} from "@/enum/orderEnum";
import {Invoice,} from "@/response/invoice";
import {MarketingTypeEnum,} from "@/enum/marketingEnum";
import {subOrderMessage} from "@/utils/wxMpSub/subscribeMessage";

onShow(() => {
  // eslint-disable-next-line no-undef
  const pages: AnyObject = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  if (currentPage.addressData) state.addressData = currentPage.addressData;
  if (currentPage.invoiceItem) {
    state.orderDetail.items[state.currentMerchantIndex].currentInvoiceItem = currentPage.invoiceItem;
  }

  if (currentPage.addressData || currentPage.invoiceItem) {
    handleOrderMarketingFeeCalc();
  }
});
onLoad((options) => {
  initData(options);
});

let state = reactive({
  isUsePoint: false,
  orderParams: "",
  promoterCode: "",
  maskState: 0, // 优惠券面板显示状态
  isFullPayment: 0, // 是否全款预定，默认全款预定
  desc: "", // 备注
  payType: 1, // 1微信 2支付宝
  orderDetail: {} as OrderItemsPreview,
  loadingType: "more", // 加载更多状态
  btnLoading: false,
  currentShippingType: {} as AnyObject,
  currentCompany: {} as AnyObject,
  currentPickupPoint: {} as AnyObject,
  cartIds: null,
  addressData: {} as Address,
  couponItem: {} as AnyObject,
  product: null,
  shippingMoney: 0,
  marketingFee: {} as MarketingFee,
  commonCurrentCoupon: {} as Coupon,
  commonParams: {
    use_point: "",
    coupon_id: "",
    receiver_name: "",
    receiver_mobile: "",
  },
  userInfo: {} as AnyObject,
  use_point: 0,
  loading: true,
  errorInfo: "",
  buyerMessage: "",
  promoCode: "",
  currentCouponList: [] as Coupon[],
  currentMerchantIndex: 0,
  pickerArr: [] as AnyObject[],
  shippingTimeVisible: false,
  expressCompanyConfig: [] as Logistics_pick_up_config[],
});

const moneySymbol = mConstData.moneySymbol;
const themeColor = mHelper.getThemeColor(); // 主题颜色
const globalConfig = mHelper.getGlobalConfig(); // 通用配置

// 计算可使用积分
const usePoint = computed(() => {
  return state.orderDetail?.account?.user_integral >
  state.orderDetail?.pointConfig?.available
    ? state.orderDetail?.pointConfig?.available
    : state.orderDetail?.account?.user_integral;
});
// 计算可使用积分抵扣金额
const usePointMoney = computed(() => {
  let point =
    state.orderDetail?.account?.user_integral >
    state.orderDetail?.pointConfig?.available
      ? state.orderDetail?.pointConfig?.available
      : state.orderDetail?.account?.user_integral;
  return (
    (state.orderDetail?.pointConfig?.money /
      state.orderDetail?.pointConfig?.available) *
    point
  );
});
// 关闭定时配送面板
const handleExpressCompanyConfigClose = () => {
  state.maskState = 0;
};
// 选择送达时间
const handleExpressCompanyConfigChange = (val) => {
  state.orderDetail.items[state.currentMerchantIndex].preview.distribute_time_out = val.timeStr;
  state.orderDetail.items[state.currentMerchantIndex].preview.subscribe_shipping_start_time = val.startTime;
  state.orderDetail.items[state.currentMerchantIndex].preview.subscribe_shipping_end_time = val.endTime;
};
// 选择是否全款预售
const handleIsFullPaymentChange = (e: any) => {
  state.isFullPayment = e.detail.value;
};
// 选择发票类型
const handleInvoiceChange = (index, val) => {
  state.orderDetail.items[index].invoiceContent = val;
};
// 通用跳转
const navTo = (route, query = {}, index) => {
  if (index || index === 0) {
    state.currentMerchantIndex = index
  }

  mRouter.push({route, query,});
};
// 跳转对应商品页
const navToProduct = (id, marketingType = "", marketingId: number) => {
  mHelper.navToProduct(id, marketingType, String(marketingId));
};
const baseNavTo = (route: Route, query = {}, type = "push") => {
  type === "push"
    ? mRouter.push({route, query,})
    : mRouter.redirectTo({route, query,});
};

// 不使用发票
const closeInvoice = (index) => {
  state.orderDetail.items[index].currentInvoiceItem = {} as Invoice;
  handleOrderMarketingFeeCalc();
};
// 打开配送时间面板
const toggleShippingTimeMask = (
  index,
  type,
  shippingType = OrderShippingType.LOCAL_DISTRIBUTION
) => {
  let config = state.orderDetail.items[index].config;
  if (
      (shippingType === OrderShippingType.LOCAL_DISTRIBUTION && config?.logistics_local_distribution_config?.length === 0) ||
      (shippingType === OrderShippingType.PICK_UP && config?.logistics_pick_up_config?.length === 0)
  ) {
    mHelper.toast("请联系管理员配置");
    return;
  }
  let timer = type === "show" ? 10 : 300;
  let status = type === "show" ? 1 : 0;
  state.shippingTimeVisible = true;
  state.maskState = 0;
  state.expressCompanyConfig =
    shippingType === OrderShippingType.LOCAL_DISTRIBUTION
      ? state.orderDetail.items[index].config.logistics_local_distribution_config || []
      : state.orderDetail.items[index].config.logistics_pick_up_config || [];
  setTimeout(() => {
    state.maskState = status;
  }, timer);
};
const handleIsUsePointChange = () => {
  state.isUsePoint = !state.isUsePoint;
  handleOrderMarketingFeeCalc();
};
// 不使用优惠券
const clearCoupon = (index) => {
  if (index >= 0) {
    state.orderDetail.items[index].currentCoupon = {} as Coupon;
  } else {
    state.commonCurrentCoupon = {} as Coupon;
    state.commonParams.coupon_id = "";
  }
  handleOrderMarketingFeeCalc();
};
// 选择物流
const shippingTypePicker = ref({} as AnyObject);
const showSinglePicker = (index) => {
  state.currentMerchantIndex = index;
  state.pickerArr = state.orderDetail.items[index].config.pickerShippingTypeArr;
  shippingTypePicker.value.show();
};
// 选择快递公司
const companyTypePicker = ref({} as AnyObject);
const showCompanyPicker = (index) => {
  if (Number(state.orderDetail.items[state.currentMerchantIndex].config.logistics_select)) {
    mHelper.toast("未开启物流选择!");
    return;
  }
  state.currentMerchantIndex = index;
  state.pickerArr = state.orderDetail?.items[index]?.config?.logistics_list;
  companyTypePicker.value.show();
};
// 选择自提点
const pickupPointPicker = ref({} as AnyObject);
const showPickupPointPicker = () => {
  if (Number(state.orderDetail.items[state.currentMerchantIndex].config.logistics_select)) {
    mHelper.toast("未开启物流选择!");
    return;
  }
  state.pickerArr =
    state.orderDetail.items[
      state.currentMerchantIndex
      ].config.logistics_pick_up_list;
  console.log('pickerArr', state.pickerArr)
  pickupPointPicker.value.show();
};
// 确定选择物流
const onShippingConfirm = (e) => {
  console.log(e)
  const index = e.index[0];
  state.orderDetail.items[
    state.currentMerchantIndex
    ].config.currentShippingType =
    state.orderDetail.items[
      state.currentMerchantIndex
      ].config.pickerShippingTypeArr[index];
  //清空预约时间
  state.orderDetail.items[state.currentMerchantIndex].preview.distribute_time_out = '';
  handleOrderMarketingFeeCalc();
};
// 确定选择快递公司
const onCompanyConfirm = (e) => {
  const index = e.index[0];
  state.orderDetail.items[state.currentMerchantIndex].config.currentLogistics =
    state.orderDetail.items[state.currentMerchantIndex].config.logistics_list[
      index
      ];
  handleOrderMarketingFeeCalc();
};
// 确定选择自提点
const onPickupPointConfirm = (e) => {
  const index = e.index[0];
  state.orderDetail.items[
    state.currentMerchantIndex
    ].config.currentPickupPoint =
    state.orderDetail.items[
      state.currentMerchantIndex
      ].config.logistics_pick_up_list[index];
  //清空预约时间
  state.orderDetail.items[state.currentMerchantIndex].preview.distribute_time_out = '';
  handleOrderMarketingFeeCalc();
};
const handleCouponSelect = (item: Coupon) => {
  if (state.currentMerchantIndex >= 0) {
    if (
      Number(item.at_least) >
      Number(state.marketingFee[state.currentMerchantIndex]?.pay)
    ) {
      mHelper.toast("不满足优惠券使用条件~");
      state.maskState = 0;
      return;
    } else {
      state.orderDetail.items[state.currentMerchantIndex].currentCoupon = item;
      state.maskState = 0;
    }
  } else {
    state.commonCurrentCoupon = item;
    state.commonParams.coupon_id = item.id;
    state.maskState = 0;
  }
  handleOrderMarketingFeeCalc();
};
// 数据初始化
const initData = async (options) => {
  state.promoterCode = options.promoter_code || "";
  state.orderParams = options.data || "";
  state.userInfo = store.getters["user/getUserInfo"];
  await getOrderDetail();
};
// 获取订单详情
const getOrderDetail = async () => {
  try {
    state.orderDetail = (await orderApi.getOrderItemsPreview({
      items: state.orderParams,
    })) as unknown as OrderItemsPreview;
    state.loading = false;
    state.addressData = state.orderDetail.address;
    state.orderDetail.items.forEach((item: AnyObject) => {
      item.config.pickerShippingTypeArr = [];
      //物流配送开启状态
      if (item.config.logistics === "1") {
        item.config.pickerShippingTypeArr.push({
          label: "物流配送",
          value: OrderShippingType.LOGISTICS,
        });
        item.config.logistics_list.length > 0 &&
        item.config.logistics_list.forEach((item) => {
          item.label = item.title;
          item.value = item.id;
        });
        item.config.currentLogistics = item.config.logistics_list[0];
        for (const lItem of item.config.logistics_list) {
          if (lItem.is_default === "1") item.config.currentLogistics = lItem;
        }
      }
      //买家自提开启状态  自提门店不为空
      if (
        item.config.logistics_pick_up === "1" &&
        item.config.logistics_pick_up_list &&
        item.config.logistics_pick_up_list.length > 0
      ) {
        item.config.logistics_pick_up_list.forEach((sItem) => {
          sItem.label = `${sItem.title || "未知"} - ${
            sItem.address_details|| "未知"
          }`;
          sItem.value = sItem.id;
        });
        item.config.currentPickupPoint =
          item.config.logistics_pick_up_list[0] || {};
        item.config.pickerShippingTypeArr.push({
          label: "买家自提",
          value: OrderShippingType.PICK_UP,
        });
      }
      //同城配送是否开启
      if (item.config.logistics_local_distribution === "1") {
        item.config.pickerShippingTypeArr.push({
          label: "同城配送",
          value: OrderShippingType.LOCAL_DISTRIBUTION,
        });
      }
      //配送方式下拉框为不为空 默认选择第一个
      if (item.config.pickerShippingTypeArr.length > 0) {
        item.config.currentShippingType = item.config.pickerShippingTypeArr[0];
      }
      //虚拟商品
      if (
        mHelper.isVirtualProduct(
          state.orderDetail?.items[0]?.products[0].product_type
        )
      ) {
        state.commonParams.receiver_name = state.orderDetail.lastMemberInfo.realname;
        state.commonParams.receiver_mobile = state.orderDetail.lastMemberInfo.mobile;
      }
    });
    await handleOrderMarketingFeeCalc();
  } catch (e) {
    //
    state.loading = false;
    state.errorInfo = JSON.stringify(e);
  }
};
// 显示优惠券面板
const toggleMask = (type: string, index: number) => {
  if ("combination,wholesale,group_buy".indexOf(state.orderParams) !== -1) {
    mHelper.toast("套餐购买/拼团/团购下单不支持选择购物券");
    return;
  }
  if (type === "show") {
    state.currentMerchantIndex = index;
    if (index >= 0) {
      if (state.orderDetail.items[index].coupons.length === 0) {
        mHelper.toast("暂无可用优惠券");
        return;
      }
      state.currentCouponList = state.orderDetail.items[index].coupons;
    } else {
      if (state.orderDetail.coupons.length === 0) {
        mHelper.toast("暂无可用优惠券");
        return;
      }
      state.currentCouponList = state.orderDetail.coupons;
    }
  }
  state.shippingTimeVisible = false;
  let timer = type === "show" ? 10 : 300;
  let status = type === "show" ? 1 : 0;
  state.maskState = 2;
  setTimeout(() => {
    state.maskState = status;
  }, timer);
};
const submit = async () => {
  // #ifdef MP-WEIXIN
  // 如果是小程序 发起订阅
  await subOrderMessage(Number(state.orderDetail.items[0]?.preview.order_type));
  // #endif
  try {
    if (
      mHelper.isVirtualProduct(
        state.orderDetail?.items[0]?.products[0].product_type
      ) &&
      !state.commonParams.receiver_name
    ) {
      mHelper.toast("请填写用户姓名");
      return;
    }
    if (
      mHelper.isVirtualProduct(
        state.orderDetail?.items[0]?.products[0].product_type
      ) &&
      !state.commonParams.receiver_mobile
    ) {
      mHelper.toast("请填写联系方式");
      return;
    }
    let orderParams: AnyObject = JSON.parse(state.orderParams);
    for (const item of state.orderDetail.items) {
      if (item.config.logistics !== "1") {
        mHelper.toast(
          `店铺${
            item.merchant?.title || globalConfig.app_name
          }物流配送暂未开启，请联系客服`
        );
        throw new Error();
      }
    }
    if (
      !state.addressData?.id &&
      !mHelper.isVirtualProduct(state.orderDetail.productType)
    ) {
      mHelper.toast("请选择收货地址");
      return;
    }
    orderParams.forEach((item) => {
      if (state.addressData?.id)
        item["item"]["address_id"] = state.addressData?.id;
    });
    state.orderDetail.items.forEach((item, index: number) => {
      orderParams[index]["item"]["coupon_id"] =
        state.orderDetail.items[index]?.currentCoupon?.id;
      orderParams[index]["item"]["buyer_message"] =
        item["preview"]["buyerMessage"];
      if (!mHelper.isVirtualProduct(state.orderDetail.productType)) {
        orderParams[index]["item"]["shipping_type"] =
          state.orderDetail.items[index].config?.currentShippingType.value;
        if (
          item.config?.currentShippingType.value === OrderShippingType.LOGISTICS
        )
          orderParams[index]["item"]["company_id"] =
            item.config?.currentLogistics?.id;
        if (
          item.config?.currentShippingType.value === OrderShippingType.PICK_UP
        )
          orderParams[index]["item"]["store_id"] =
            item.config?.currentPickupPoint.id;
        if (item.currentInvoiceItem?.id) {
          orderParams[index]["item"].invoice_id = item.currentInvoiceItem?.id;
          orderParams[index]["item"].invoice_content =
            state.orderDetail.items[index].invoiceContent ||
            state.orderDetail.items[index]?.config.order_invoice_content[0];
        }
        if (
          item.config?.currentShippingType.value === OrderShippingType.LOCAL_DISTRIBUTION ||
          item.config?.currentShippingType.value === OrderShippingType.PICK_UP
        ) {
          if (!item["preview"].distribute_time_out) {
            mHelper.toast(
              `请选择${
                item.config?.currentShippingType.value ===
                OrderShippingType.LOCAL_DISTRIBUTION
                  ? "配送"
                  : "自提"
              }时间`
            );
            throw new Error();
          } else {
            orderParams[index]["item"].distribute_time_out = item["preview"].distribute_time_out;
            orderParams[index]["item"].subscribe_shipping_start_time = item["preview"].subscribe_shipping_start_time;
            orderParams[index]["item"].subscribe_shipping_end_time = item["preview"].subscribe_shipping_end_time;
          }
        }
      } else {
        orderParams[index]["item"]["shipping_type"] = OrderShippingType.VIRTUAL;
      }
      if (orderParams[0].item.type === "presell_buy")
        orderParams[index]["item"].is_full_payment = state.isFullPayment;
    });
    let params: AnyObject = {};
    params.items = JSON.stringify(orderParams);
    if (state.commonParams.coupon_id)
      params.coupon_id = state.commonParams.coupon_id;
    if (state.isUsePoint) params.use_point = usePoint.value;
    if (
      mHelper.isVirtualProduct(
        state.orderDetail?.items[0]?.products[0].product_type
      )
    ) {
      if (state.commonParams.receiver_name)
        params.receiver_name = state.commonParams.receiver_name;
      if (state.commonParams.receiver_mobile)
        params.receiver_mobile = state.commonParams.receiver_mobile;
    }
    state.btnLoading = true;
    await orderApi.handleOrderItemsCreate(params).then((res: AnyObject) => {
      if (res.pay_money === "0.00") {
        baseNavTo(
            mRouteConfig.paySuccess,
            {
              type: orderParams[0].item.type,
              id: res.wholesale_id,
              unite_no: res.unite_no,
            },
            "redirectTo"
        );
      } else {
        baseNavTo(
            mRouteConfig.pay,
            {
              type: orderParams[0].item.type,
              money: res.pay_money,
              id: res.id,
              unite_no: res.unite_no,
              is_full_payment: state.isFullPayment,
            },
            "redirectTo"
        );
      }
    }).catch(err => {
      state.btnLoading = false;
    })
  } catch (e) {
    //
    state.btnLoading = false;
  }
};
const handleOrderMarketingFeeCalc = async () => {
  try {
    let orderParams: AnyObject = JSON.parse(state.orderParams);
    for (const item of state.orderDetail.items) {
      if (item.config.logistics !== "1") {
        mHelper.toast(
          `店铺${
            item.merchant?.title || globalConfig.app_name
          }物流配送暂未开启，请联系客服`
        );
        throw new Error();
      }
    }
    orderParams.forEach((item) => {
      if (state.addressData?.id)
        item["item"]["address_id"] = state.addressData?.id;
    });
    state.orderDetail.items.forEach((item, index: number) => {
      orderParams[index]["item"]["coupon_id"] =
        state.orderDetail.items[index]?.currentCoupon?.id;
      orderParams[index]["item"]["buyer_message"] =
        item["preview"]["buyerMessage"];
      if (!mHelper.isVirtualProduct(state.orderDetail.productType)) {
        orderParams[index]["item"]["shipping_type"] = state.orderDetail.items[index].config?.currentShippingType.value;
        if (item.config?.currentShippingType.value === OrderShippingType.LOGISTICS)
          orderParams[index]["item"]["company_id"] = item.config?.currentLogistics?.id;
        if (item.config?.currentShippingType.value === OrderShippingType.PICK_UP)
          orderParams[index]["item"]["store_id"] = item.config?.currentPickupPoint.id;
        if (item.currentInvoiceItem?.id) {
          orderParams[index]["item"].invoice_id = item.currentInvoiceItem?.id;
          orderParams[index]["item"].invoice_content =
            state.orderDetail.items[index].invoiceContent ||
            state.orderDetail.items[index]?.config.order_invoice_content[0];
        }
        console.log(item.config?.currentShippingType.value);
        console.log(Number(item.config?.currentShippingType.value) === OrderShippingType.PICK_UP);
        if (
          (Number(item.config?.currentShippingType.value) ===
            OrderShippingType.LOCAL_DISTRIBUTION) ||
          (Number(item.config?.currentShippingType.value) === OrderShippingType.PICK_UP)
        ) {
          console.log("distribute_time_out", item["preview"].distribute_time_out);
          if (!item["preview"].distribute_time_out) {
            mHelper.toast(
              `请选择${
                item.config?.currentShippingType.value ===
                OrderShippingType.LOCAL_DISTRIBUTION
                  ? "配送"
                  : "自提"
              }时间`
            );
            throw new Error();
          } else {
            orderParams[index]["item"].distribute_time_out = item["preview"].distribute_time_out;
            orderParams[index]["item"].subscribe_shipping_start_time = item["preview"].subscribe_shipping_start_time;
            orderParams[index]["item"].subscribe_shipping_end_time = item["preview"].subscribe_shipping_end_time;
          }
        }
      } else {
        orderParams[index]["item"]["shipping_type"] = OrderShippingType.VIRTUAL;
      }
      if (orderParams[0].item.type === "presell_buy")
        orderParams[index]["item"].is_full_payment = state.isFullPayment;
    });
    let params: AnyObject = {};
    params.items = JSON.stringify(orderParams);
    if (state.commonParams.coupon_id)
      params.coupon_id = state.commonParams.coupon_id;
    if (state.isUsePoint) params.use_point = usePoint.value;
    state.marketingFee = (await orderApi.getOrderMarketingFee(params)) as unknown as MarketingFee;
    state.orderDetail.pointConfig = state.marketingFee.pointConfig;
  } catch (e) {
    //
  }
};
</script>
<style lang="scss">
.rf-create-order {
  background: $page-color-dark;
  min-height: calc(100vh - 144rpx);
  padding-top: $spacing-base;
  padding-bottom: calc(env(safe-area-inset-bottom) / 2 + 120rpx);

  &__address {
    width: 702rpx;
    padding: $spacing-lg;
    margin: 0 $page-base-spacing $spacing-base;
    background-color: $color-white;
    border-radius: 18rpx;
  }

  &__content {
    width: 702rpx;
    padding: $spacing-lg;
    margin: 0 $page-base-spacing $spacing-base;
    background-color: $color-white;
    border-radius: 18rpx;
    position: relative;

    &__product {
      &__item {
        display: flex;
        position: relative;
      }
    }

    &__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4rpx 0;
      line-height: 78rpx;
      position: relative;
    }
  }

  &__footer {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 98;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    font-size: 30rpx;
    background-color: $color-white;
    box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.05);
    padding: 16rpx $spacing-base calc(env(safe-area-inset-bottom) / 2 + 16rpx);

    .rf-short-btn {
      border-radius: 40rpx;
      padding: 0 48rpx;
      height: 76rpx;
      font-size: $font-lg;
    }
  }
}

/* 优惠券面板 */
.mask {
  display: flex;
  align-items: flex-end;
  position: fixed;
  left: 0;
  top: var(--window-top);
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 99;
  transition: 0.3s;

  .mask-content {
    width: 100%;
    max-height: 70vh;
    min-height: 16vh;
    background: $color-white;
    transform: translateY(100%);
    transition: 0.3s;
    overflow-y: scroll;

    .no-coupon {
      display: flex;
      justify-content: center; /* 水平居中 */
      line-height: 16vh;
    }
  }

  &.none {
    display: none;
  }

  &.show {
    background: rgba(0, 0, 0, 0.4);

    .mask-content {
      transform: translateY(0);
    }
  }

  .express-company-config {
    background-color: $color-white;

    .title {
      text-align: center;
      font-size: $font-lg;
      padding: $spacing-base 0;
    }

    .btn {
      width: 90%;
      margin: $spacing-base 5%;
      border-radius: 50rpx;
    }
  }
}
</style>
