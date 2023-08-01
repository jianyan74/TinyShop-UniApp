<template>
  <view class="rf-order-detail">
    <rf-navbar
      title="订单详情" :border="false"
      :fixed="true" :status-bar="true"
      background-color="rgba(255,255,255,0)"
      color="#ffffff" />
    <!--订单状态-->
    <view
      v-if="state.orderDetail?.product"
      :class="'bg-gradual-tb-' + themeColor.name"
      class="rf-order-detail__header-bg"
      :style="{paddingTop: navPaddingTop+'px'}"
    >
      <view class="content">
        <view>
          <view class="tit font-lg-8 font-weight-500">
            {{
              handleStatusFilter("title")
            }}
          </view>
          <view
            v-if="
              state.orderDetail.order_status !== OrderStatusEnum.PENDING_PAYMENT
            "
            class="font-base font-weight-light"
          >
            {{ handleStatusFilter() }}
          </view>
          <view v-else class="font-base font-weight-light flex-align-items">
            剩
            <rf-count-down
              :background-color="themeColor.color"
              :border-color="themeColor.color"
              :second="second(state.orderDetail.close_time)"
              :show-day="false"
              color="#fff"
              font-size="28rpx"
              splitor-color="#fff"
              @timeup="handleOrderClose(state.orderDetail.id)"
            />
            自动关闭
          </view>
        </view>
      </view>
    </view>
    <view v-if="state.orderDetail?.product">
      <!--选择地址-->
      <view class="rf-order-detail__address mb-base flex">
        <view>
          <rf-icon
            :color="themeColor.color"
            class="border-radius-6"
            name="iconquerendingdan_dizhi"
            size="42"
            @rfComponentClick="handleLocationOpen"
          />
        </view>
        <view class="flex-align-items flex-1">
          <view class="flex-1 ml-base">
            <view class="mb-sm flex-align-items" @tap="handleLocationOpen">
              <view
                v-if="Number(state.orderDetail.shipping_type) === OrderShippingType.PICK_UP"
                class="mr-base">
                <rf-tag
                  :bg-color="`rgba(${themeColor.rgb}, 0.12)`"
                  :border-radius="6"
                  :color="themeColor.color"
                  text="自提点"
                />
              </view>
              <text class="font-color-dark font-lg font-weight mr-base">{{
                Number(state.orderDetail.shipping_type) === OrderShippingType.PICK_UP
                  ? state.orderDetail.store?.title
                  : state.orderDetail.receiver_realname
              }}
              </text>
              <text class="font-lg font-weight">{{
                Number(state.orderDetail.shipping_type) === OrderShippingType.PICK_UP
                  ? state.orderDetail.store?.mobile
                  : state.orderDetail.receiver_mobile
              }}
              </text>
            </view>
            <view class="in1line font-color-dark">
              {{
                Number(state.orderDetail.shipping_type) === OrderShippingType.PICK_UP
                  ? state.orderDetail.store?.address_name :
                    state.orderDetail.receiver_name
              }}
            </view>
            <view class="in1line font-color-dark">
              {{
                Number(state.orderDetail.shipping_type) === OrderShippingType.PICK_UP ?
                  state.orderDetail.store?.address_details :
                  state.orderDetail.receiver_details
              }}
            </view>
          </view>
        </view>
      </view>
      <view class="rf-order-detail__content mb-base">
        <!--商户信息-->
        <view class="flex-align-items mb-lg pt-lg">
          <view
            class="flex-1 flex"
            @tap.stop="
              navTo(mRouteConfig.merchant, {
                id: state.orderDetail.baseMerchant?.id,
              })
            "
          >
            <rf-image
              :src="
                state.orderDetail.baseMerchant?.cover || globalConfig.app_logo
              "
              border-radius="50%"
              height="42"
              width="42"
            />
            <text class="ml-sm mr-sm font-base-2 font-weight-500">{{
              state.orderDetail.baseMerchant?.title || globalConfig.app_name
            }}
            </text>
            <view v-if="state.orderDetail.baseMerchant?.id" class="font-color-light" :style="{paddingTop: '3rpx'}">
              <rf-icon name="iconyou" size="28" />
            </view>
          </view>
          <text
            :class="'text-' + themeColor.name"
            @tap.stop="
              navTo(mRouteConfig.couponList, {
                merchant_id: state.orderDetail.baseMerchant?.id,
              })
            "
          >领券
          </text>
        </view>
        <!--商品列表-->
        <view class="rf-order-detail__product b-b-base">
          <view
            v-for="(item, index) in state.orderDetail.product"
            :key="index"
            class="mb-base"
          >
            <!-- 商品列表 -->
            <view
              class="flex mb-base"
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
                <view class="mb-base font-base-2 in2line">
                  {{
                    item.product_name
                  }}
                </view>
                <view
                  v-if="item.sku_name"
                  class="font-color-light font-sm-2"
                >
                  {{ item.sku_name }}
                </view>
              </view>
              <view class="text-right">
                <view class="font-lg font-weight-500 mb-sm">
                  <text class="font-sm">{{ moneySymbol }}</text>
                  <text>{{ item.product_original_money }}</text>
                </view>
                <view class="font-base font-color-light font-weight-normal">
                  x{{ item.num }}
                </view>
              </view>
            </view>
            <view
              v-if="item.gift_flag !== '1'"
              class="rf-order-detail__product__operation"
            >
              <button
                v-if="
                  (item.order_status === OrderStatusEnum.RECEIVED ||
                    item.order_status === OrderStatusEnum.COMPLETED) &&
                    Number(item.is_evaluate) === 0
                "
                class="action-btn no-border"
                @tap="
                  navTo(mRouteConfig.evaluation, { data: JSON.stringify(item) })
                "
              >
                我要评价
              </button>
              <button
                v-if="
                  (item.order_status === OrderStatusEnum.RECEIVED ||
                    item.order_status === OrderStatusEnum.COMPLETED) &&
                    Number(item.is_evaluate) === 1
                "
                class="action-btn no-border"
                @tap="
                  navTo(mRouteConfig.evaluation, {
                    data: JSON.stringify(item),
                    type: 'add',
                  })
                "
              >
                追加评价
              </button>
              <button
                v-if="
                  (state.orderDetail.order_status === OrderStatusEnum.SENT ||
                    state.orderDetail.order_status ===
                    OrderStatusEnum.RECEIVED ||
                    state.orderDetail.order_status ===
                    OrderStatusEnum.COMPLETED) &&
                    !mHelper.isVirtualProduct(state.orderDetail.product_type) &&
                    item.refund_status !== OrderRefundStatusEnum.CONSENT
                "
                :class="'text-' + themeColor.name"
                class="action-btn no-border"
                @tap="handleOrderOperation(state.orderDetail, 'shipping')"
              >
                查看物流
              </button>
              <button
                v-if="
                  item.order_status === OrderStatusEnum.DELIVERED &&
                    (item.refund_status === OrderRefundStatusEnum.UN_APPLY ||
                      item.refund_status === OrderRefundStatusEnum.NO_PASS)
                "
                class="action-btn no-border"
                @tap="
                  navTo(mRouteConfig.orderRefund, {
                    data: JSON.stringify(item),
                    refundType: 1,
                  })
                "
              >
                申请售后
              </button>
              <button
                v-if="
                  (item.order_status === OrderStatusEnum.RECEIVED ||
                    item.order_status === OrderStatusEnum.SENT) &&
                    (item.refund_status === OrderRefundStatusEnum.UN_APPLY ||
                      item.refund_status === OrderRefundStatusEnum.NO_PASS)
                "
                class="action-btn no-border"
                @tap="
                  navTo(mRouteConfig.orderRefund, {
                    data: JSON.stringify(item),
                    refundType: 2,
                  })
                "
              >
                申请售后
              </button>
              <button
                v-if="
                  item.order_status === OrderStatusEnum.SENT &&
                    item.order_status === OrderStatusEnum.RECEIVED &&
                    item.order_status === OrderStatusEnum.COMPLETED &&
                    (item.refund_status === OrderRefundStatusEnum.UN_APPLY ||
                      item.refund_status === OrderRefundStatusEnum.NO_PASS)
                "
                class="action-btn no-border"
                @tap="
                  navTo(mRouteConfig.orderRefund, {
                    data: JSON.stringify(item),
                    refundType: 3,
                  })
                "
              >
                申请售后
              </button>
              <button
                v-if="
                  (item.order_status === OrderStatusEnum.RECEIVED ||
                    item.order_status === OrderStatusEnum.SENT ||
                    item.order_status === OrderStatusEnum.COMPLETED) &&
                    item.refund_status === OrderRefundStatusEnum.SALES_RETURN
                "
                class="action-btn no-border"
                @tap="
                  () => {
                    state.isShippingReturnShow = true;
                    state.shippingReturnInfo.id = item.id;
                  }
                "
              >
                填写退货信息
              </button>
              <button
                v-if="item.refund_status === OrderRefundStatusEnum.APPLY"
                class="action-btn no-border"
                @tap.stop="
                  handleCloseOrderRefundApply(item.order_status, item.id)
                "
              >
                取消{{
                  item.refund_type === OrderRefundType.MONEY
                    ? "仅退款"
                    : item.refund_type === OrderRefundType.MONEY_AND_PRODUCT
                      ? "退款且退货"
                      : "换货"
                }}
              </button>
              <button
                v-if="item.refund_status === OrderRefundStatusEnum.CANCEL"
                class="action-btn action-btn-disabled no-border"
              >
                退款已关闭
              </button>
              <button
                v-if="
                  item.refund_status === OrderRefundStatusEnum.NO_PASS_ALWAYS
                "
                class="action-btn action-btn-disabled no-border"
              >
                退款/退款已关闭
              </button>
              <button
                v-if="
                  item.refund_status ===
                    OrderRefundStatusEnum.AFFIRM_RETURN_MONEY
                "
                class="action-btn action-btn-disabled no-border"
              >
                等待卖家退款
              </button>
              <button
                v-if="item.refund_status === OrderRefundStatusEnum.CONSENT"
                class="action-btn action-btn-disabled no-border"
              >
                售后完成
              </button>
              <button
                v-if="
                  item.refund_status ===
                    OrderRefundStatusEnum.AFFIRM_SALES_RETURN
                "
                class="action-btn action-btn-disabled no-border"
              >
                等待卖家确认收货
              </button>
              <button
                v-if="
                  item.refund_status === OrderRefundStatusEnum.AFFIRM_SHIPMENTS
                "
                class="action-btn action-btn-disabled no-border"
              >
                等待商家发货
              </button>
              <button
                v-if="
                  item.refund_status === OrderRefundStatusEnum.MEMBER_AFFIRM
                "
                class="action-btn action-btn-disabled no-border"
              >
                换货完成
              </button>
              <button
                v-if="item.refund_status === OrderRefundStatusEnum.SHIPMENTS"
                :class="'bg-gradual-' + themeColor.name"
                class="action-btn no-border"
                @tap="
                  handleOrderOperation(
                    state.orderDetail,
                    'afterSaleDelivery',
                    item.id
                  )
                "
              >
                确认收货(换货)
              </button>
              <button
                v-if="
                  state.orderDetail.order_status === OrderStatusEnum.SENT &&
                    item.refund_status === OrderRefundStatusEnum.UN_APPLY
                "
                :class="'bg-gradual-' + themeColor.name"
                class="action-btn no-border"
                @tap="handleOrderOperation(state.orderDetail, 'delivery')"
              >
                确认收货
              </button>
            </view>
          </view>
        </view>
        <!-- 金额明细 -->
        <view class="flex-between mt-lg mb-base">
          <view class="font-color-dark font-base">
            商品总价
          </view>
          <text>
            <text class="font-sm">{{ moneySymbol }}
            </text>{{
              keepTwoDecimal(state.orderDetail.product_original_money || state.orderDetail.product_money)
            }}
          </text>
        </view>
        <view v-if="state.orderDetail.adjust_money < 0" class="flex-between mt-lg mb-base">
          <text class="font-color-dark font-base">调整优惠</text>
          <text class="font-lg">
            -
            <text>
              <text class="font-sm">{{ moneySymbol }}
              </text>{{ Math.abs(state.orderDetail.adjust_money) }}
            </text>
          </text>
        </view>
        <view
          v-for="(item, index) in state.orderDetail.marketingDetail"
          :key="index"
          class="flex-between mt-lg mb-base"
        >
          <text v-if="item.marketing_type === 'full_mail'" class="font-color-dark font-base">运费</text>
          <text v-else class="font-color-dark font-base">{{ item.marketing_name }}</text>
          <text class="font-lg">
            <text v-if="item.marketing_type === 'give_point'">{{ item.discount_money }}积分</text>
            <text v-else-if="item.marketing_type === 'give_growth'">{{ item.discount_money }}成长值</text>
            <text v-else-if="item.marketing_type === 'full_mail'">{{ item.marketing_name }}</text>
            <text v-else>-
              <text class="font-sm">{{ moneySymbol }}</text>{{ item.discount_money }}
            </text>
          </text>
        </view>
        <!--营销金额优惠-->
        <!--调价-->
        <view v-if="state.orderDetail.adjust_money > 0" class="flex-between mt-lg mb-base">
          <text class="font-color-dark font-base">调整金额</text>
          <text class="font-lg">
            <text>
              <text class="font-sm">{{ moneySymbol }}
              </text>{{ state.orderDetail.adjust_money }}
            </text>
          </text>
        </view>
        <view v-if="isShippingMoneyShow" class="flex-between mt-lg mb-base">
          <text class="font-color-dark font-base">运费</text>
          <text class="font-lg">
            <text>
              <text class="font-sm">{{ moneySymbol }}
              </text>{{ state.orderDetail.shipping_money }}
            </text>
          </text>
        </view>
        <view
          v-if="state.orderDetail.tax_money > 0"
          class="flex-between mt-lg mb-base"
        >
          <text class="font-color-dark font-base">发票税费</text>
          <text class="font-lg">
            <text>
              <text class="font-sm">{{ moneySymbol }}</text>{{ state.orderDetail.tax_money }}
            </text>
          </text>
        </view>
        <view
          v-if="state.orderDetail.marketing_type === MarketingTypeEnum.PRE_SELL"
          class="pt-base pl-sm"
        >
          <rf-timeline>
            <rf-timeline-item color="#ccc">
              <view class="flex-between mb-base">
                <text class="font-weight-500 font-color-dark"
                >定金
                  <text class="font-weight-normal font-color-light"
                  >已支付
                    {{ timeFormat(state.orderDetail?.pre_sell?.pay_time) }}
                  </text
                  >
                </text
                >
                <text
                >{{ moneySymbol }}{{ state.orderDetail.pre_sell.pay_money }}
                </text
                >
              </view>
            </rf-timeline-item>
            <rf-timeline-item :color="themeColor.color" :is-end="true">
              <view class="flex-between">
                <text
                  :class="'text-' + themeColor.name"
                  class="font-weight-500"
                >尾款
                  <text
                    v-if="
                      state.orderDetail.order_status === OrderStatusEnum.IN_STOCK
                    "
                    class="font-weight-normal font-color-light"
                  >备货中
                  </text>
                  <text
                    v-if="
                      state.orderDetail.order_status ===
                        OrderStatusEnum.BALANCE_TO_BE_PAID &&
                        !state.orderDetail.is_full_payment
                    "
                    class="font-weight-normal font-color-light"
                  >{{
                    timeFormat(state.orderDetail.pre_sell.final_start_time)
                  }}
                    开始支付尾款
                  </text>
                  <text
                    v-if="
                      state.orderDetail.order_status >= OrderStatusEnum.DELIVERED &&
                        state.orderDetail.pre_sell.final_pay_time > 0 &&
                        !state.orderDetail.is_full_payment
                    "
                    class="font-weight-normal font-color-light"
                  >已支付
                    {{
                      timeFormat(state.orderDetail.pre_sell.final_pay_time)
                    }}
                  </text>
                </text>
                <text
                  :class="
                    state.orderDetail.order_status === OrderStatusEnum.DELIVERED
                      ? ''
                      : 'text-' + themeColor.name
                  "
                >{{
                  moneySymbol
                }}{{ state.orderDetail.pre_sell.final_money }}
                </text>
              </view>
            </rf-timeline-item>
          </rf-timeline>
        </view>
        <view class="flex-between mt-lg mb-base">
          <text class="font-color-dark font-base-2 font-weight">实付款</text>
          <text
            :class="'text-' + themeColor.name"
            class="font-lg font-weight"
          >
            <text class="font-sm">{{ moneySymbol }}
            </text
            >{{ state.orderDetail.pay_money || 0 }}
            <text
              v-if="
                Number(state.orderDetail.point) > 0 &&
                  state.orderDetail.marketing_type ===
                  MarketingTypeEnum.POINT_EXCHANGE
              "
              class="font-lg"
            >
              + {{ state.orderDetail.point }}积分
            </text>
          </text>
        </view>
        <view
          v-if="state.orderDetail.final_payment_money > 0"
          class="flex-between mt-lg mb-base"
        >
          <text class="font-color-dark font-base">尾款金额</text>
          <text class="font-lg"
          >
            <text class="font-sm">{{ moneySymbol }}
            </text
            >
            {{ state.orderDetail.final_payment_money }}
          </text
          >
        </view>
        <view class="text-center b-t-base">
          <button
            v-if="globalConfig.app_service_type > 0"
            class="p-b-btn border-color-none no-border-btn"
            :open-type="globalConfig.app_service_type === 20 ? 'contact' : ''"
            @tap="
              toService(mRouteConfig.service, {
                merchant_id: state.orderDetail.merchant_id
              })
            "
          >
            <rf-icon
              name="iconshouhoukefu"
              size="36"
              @rfComponentClick="handleLocationOpen"
            />
            <text class="font-sm-2 ml-sm">联系客服</text>
          </button>
        </view>
      </view>
      <!-- 订单信息 -->
      <view class="rf-order-detail__content">
        <!-- 订单号 -->
        <view class="flex-between mt-lg mb-base">
          <text class="font-base font-color-light flex-1">订单号</text>
          <text
            :class="'text-' + themeColor.name"
            class="mr-sm"
            @tap.stop="copy(state.orderDetail.order_sn)"
          >复制
          </text>
          <text class="font-base font-color-light">
            {{ state.orderDetail.order_sn }}
          </text>
        </view>
        <!-- 订单号 -->
        <view class="flex-between mt-lg mb-base">
          <text class="font-base font-color-light flex-1">外部交易号</text>
          <text class="font-base font-color-light">
            {{ state.orderDetail.out_trade_no }}
          </text>
        </view>
        <view class="flex-between mt-lg mb-base">
          <text class="font-base font-color-light flex-1">支付方式</text>
          <text class="font-base font-color-light">
            {{ filterPayType(state.orderDetail.pay_type) }}
          </text>
        </view>
        <view class="flex-between mt-lg mb-base">
          <text class="font-base font-color-light">优惠券</text>
          <text class="font-base font-color-light">
            {{ state.orderDetail.coupon?.title || "未使用优惠券" }}
          </text>
        </view>
        <view
          v-if="filterShippingType(state.orderDetail.shipping_type)"
          class="flex-between mt-lg mb-base"
        >
          <text class="font-base font-color-light">配送方式</text>
          <text class="font-base font-color-light">
            {{ filterShippingType(state.orderDetail.shipping_type) }}
          </text>
        </view>
        <view
          v-if="state.orderDetail?.distribute_time_out"
          class="flex-between mt-lg mb-base"
        >
          <text class="font-base font-color-light">自提时间</text>
          <text class="font-base font-color-light">
            {{ state.orderDetail?.distribute_time_out }}
          </text>
        </view>
        <view
          v-if="state.orderDetail.company_name"
          class="flex-between mt-lg mb-base"
        >
          <text class="font-base font-color-light">快递公司</text>
          <text class="font-base font-color-light">
            {{ state.orderDetail.company_name }}
          </text>
        </view>
        <view
          v-if="state.orderDetail.company_name"
          class="flex-between mt-lg mb-base"
        >
          <text class="font-base font-color-light">快递公司</text>
          <text class="font-base font-color-light">
            {{ state.orderDetail.company_name }}
          </text>
        </view>
        <view
          v-if="state.orderDetail.invoice_id"
          class="flex-between mt-lg mb-base"
        >
          <text class="font-base font-color-light">发票类型</text>
          <text class="font-base font-color-light">已开发票</text>
        </view>
        <view
          v-if="
            state.orderDetail.point > 0 &&
              state.orderDetail.payment_explain === '积分兑换'
          "
          class="flex-between mt-lg mb-base"
        >
          <text class="font-lg font-color-light">积分下单</text>
          <text class="font-base font-color-light"
          >消耗了{{ state.orderDetail.point || 0 }}积分
          </text>
        </view>
        <view
          v-if="state.orderDetail.created_at !== '0'"
          class="flex-between mt-lg mb-base"
        >
          <text class="font-base font-color-light">订单创建时间</text>
          <text class="font-base font-color-light">{{
            time(state.orderDetail.created_at)
          }}
          </text>
        </view>
        <view
          v-if="state.orderDetail.consign_time !== '0'"
          class="flex-between mt-lg mb-base"
        >
          <text class="font-base font-color-light">卖家发货时间</text>
          <text class="font-base font-color-light">{{
            time(state.orderDetail.consign_time)
          }}
          </text>
        </view>
        <view
          v-if="state.orderDetail.sign_time !== '0'"
          class="flex-between mt-lg mb-base"
        >
          <text class="font-base font-color-light">确认收货时间</text>
          <text class="font-base font-color-light">{{
            time(state.orderDetail.sign_time)
          }}
          </text>
        </view>
        <view
          v-if="state.orderDetail.finish_time !== '0'"
          class="flex-between mt-lg mb-base"
        >
          <text class="font-base font-color-light">订单完成</text>
          <text class="font-base font-color-light">{{
            time(state.orderDetail.finish_time)
          }}
          </text>
        </view>
        <view
          v-if="state.orderDetail.buyer_message"
          class="flex-between mt-lg mb-base"
        >
          <text class="font-base font-color-light">备注</text>
          <text class="font-base font-color-light">{{
            state.orderDetail.buyer_message
          }}
          </text>
        </view>
      </view>
      <!-- 底部 -->
      <view class="rf-order-detail__footer">
        <button
          v-if="
            (state.orderDetail.order_status === OrderStatusEnum.SENT ||
              state.orderDetail.order_status === OrderStatusEnum.RECEIVED ||
              state.orderDetail.order_status === OrderStatusEnum.COMPLETED) &&
              !mHelper.isVirtualProduct(state.orderDetail.product_type)
          "
          class="action-btn bg-white action-btn-border no-border"
          @tap="handleOrderOperation(state.orderDetail, 'shipping')"
        >
          查看物流
        </button>
        <button
          v-if="state.orderDetail.peer_pay?.status"
          :class="'text-' + themeColor.name"
          class="action-btn bg-white no-border"
          @tap="navTo(mRouteConfig.friendPay, { id: state.orderDetail.id })"
        >
          好友代付
        </button>
        <button
          v-if="state.orderDetail.order_status === OrderStatusEnum.CLOSE"
          :class="'text-' + themeColor.name"
          class="action-btn bg-white no-border"
          @tap="handleOrderOperation(state.orderDetail, 'delete')"
        >
          删除订单
        </button>
        <button
          v-if="
            state.orderDetail.order_status === OrderStatusEnum.PENDING_PAYMENT
          "
          :class="'text-' + themeColor.name"
          class="action-btn bg-white no-border"
          @tap="handleOrderOperation(state.orderDetail, 'close')"
        >
          取消订单
        </button>
        <button
          v-if="
            state.orderDetail.pay_money > 0 &&
              state.orderDetail.order_status !== OrderStatusEnum.CLOSE &&
              !(
                state.orderDetail.order_status ===
                OrderStatusEnum.PENDING_PAYMENT ||
                state.orderDetail.order_status ===
                OrderStatusEnum.BALANCE_TO_BE_PAID
              ) &&
              !state.orderDetail.invoice_id
          "
          :class="'text-' + themeColor.name"
          class="action-btn bg-white no-border"
          @tap="navTo(mRouteConfig.invoice, { source: 1 })"
        >
          申请开票
        </button>
        <button
          v-if="
            state.orderDetail.order_status === OrderStatusEnum.PENDING_PAYMENT
          "
          :class="'text-' + themeColor.name"
          class="action-btn bg-white no-border"
          @tap="
            navTo(mRouteConfig.pay, {
              order_id: state.orderDetail.id,
              type: 'order',
            })
          "
        >
          立即支付
        </button>
        <button
          v-if="
            state.orderDetail.order_status ===
              OrderStatusEnum.BALANCE_TO_BE_PAID
          "
          :class="'bg-gradual-' + themeColor.name"
          class="action-btn no-border"
          @tap="
            navTo(mRouteConfig.pay, {
              order_id: state.orderDetail.id,
              pay_status: 'presell',
            })
          "
        >
          支付尾款
        </button>
        <button
          v-if="
            (state.orderDetail.order_status === OrderStatusEnum.RECEIVED ||
              state.orderDetail.order_status === OrderStatusEnum.COMPLETED) &&
              state.orderDetail.is_evaluate
          "
          :class="'text-' + themeColor.name"
          class="action-btn bg-white no-border"
          @tap="handleOrderOperation(state.orderDetail, 'evaluation')"
        >
          评价一下
        </button>
        <button
          v-if="state.orderDetail.order_status === OrderStatusEnum.SENT"
          :class="'text-' + themeColor.name"
          class="action-btn bg-white no-border"
          @tap="handleOrderOperation(state.orderDetail, 'delivery')"
        >
          确认收货
        </button>
        <button
          v-if="mHelper.isVirtualProduct(state.orderDetail.product_type) && (
            (state.orderDetail.order_status === OrderStatusEnum.RECEIVED ||
              state.orderDetail.order_status === OrderStatusEnum.COMPLETED))"
          :class="'text-' + themeColor.name"
          class="action-btn bg-white no-border"
          @tap="navTo(mRouteConfig.virtual, { id: state.orderDetail.id })"
        >
          核销码
        </button>
        <button
          v-if="
            state.orderDetail.marketing_type === MarketingTypeEnum.WHOLESALE
          "
          :class="'text-' + themeColor.name"
          class="action-btn bg-white no-border"
          @tap="
            navTo(mRouteConfig.wholesaleDetail, {
              id: state.orderDetail.wholesale_record_id,
            })
          "
        >
          拼团详情
        </button>
      </view>
    </view>
    <!-- 404页面 -->
    <rf-no-data
      v-if="!state.orderDetail?.product && !state.loading"
      :error-text="state.errorInfo"
      @refresh="getOrderDetail"
    />
    <!--页面加载动画-->
    <rf-loading :active="state.loading" />
    <!-- 发票类型面板 -->
    <rf-modal
      v-if="state.isInvoiceShow"
      :btn-show="false"
      :is-close-show="true"
      title="选择发票类型"
      @hide="state.isInvoiceShow = false"
    >
      <template #content>
        <!-- 发票类型 -->
        <view class="mt-lg mb-lg pb-lg">
          <view class="font-lg font-color-dark mr-base mb-lg">
            发票类型
          </view>
          <radio-group @change="handleInvoiceContentChange">
            <label
              v-for="(item, index) in invoiceItem.invoiceContentArr"
              :key="index"
              class="mr-sm mb-base"
            >
              <radio
                :checked="state.orderInvoiceContent === item"
                :color="themeColor.color"
                :value="item"
                class="scale-8"
              />
              <text class="mr-sm">{{ item }}</text>
            </label>
          </radio-group>
        </view>
        <button
          :class="'bg-gradual-' + themeColor.name"
          class="rf-short-btn"
          @tap="handleOrderInvoiceCreate"
        >
          确定
        </button>
      </template>
    </rf-modal>
    <rf-modal
      v-if="state.isShippingReturnShow"
      :btn-show="false"
      :is-close-show="true"
      title="填写退货信息"
      @hide="state.isShippingReturnShow = false"
    >
      <template #content>
        <view class="rf-mobile-form">
          <view class="rf-mobile-form__item">
            <input
              v-model="state.shippingReturnInfo.member_express_company"
              placeholder="请输入请输入快递公司"
              type="text"
            >
          </view>
          <view class="rf-mobile-form__item">
            <input
              v-model="state.shippingReturnInfo.member_express_no"
              placeholder="请输入快递单号"
              type="text"
            >
          </view>
          <button
            :class="'bg-gradual-' + themeColor.name"
            class="rf-confirm-btn"
            @tap="handleSalesReturn"
          >
            提交退货物流
          </button>
        </view>
      </template>
    </rf-modal>
    <!--客服-->
    <rf-base-popup v-if="state.serviceShow" @close="state.serviceShow = false">
      <template #content>
        <rf-image :src="globalConfig.app_service_qr" border-radius="12rpx" height="360" width="360" />
      </template>
    </rf-base-popup>
  </view>
</template>
<script lang="ts" setup>
import {computed, reactive, ref,} from "vue";
import {onLoad, onShow,} from "@dcloudio/uni-app";
import {formatToDateTime,} from "@/utils/dateUtil";
import mRouter from "@/utils/routerUtil";
import {Route,} from "@/response/route";
import mConstData from "@/config/constData";
import mHelper from "@/utils/helper";
import mRouteConfig from "@/config/routes";
import memberApi from "@/api/tinyShop/member";
import {BaseOrderDetail,} from "@/response/order";
import {Invoice,} from "@/response/invoice";
import {OrderRefundStatusEnum, OrderRefundType, OrderShippingType, OrderStatusEnum,} from "@/enum/orderEnum";
import {MarketingTypeEnum,} from "@/enum/marketingEnum";
import {PayTypeEnum} from "@/enum/paymentEnum";
import RfImage from "@/components/rf-image/rf-image.vue";

const themeColor = mHelper.getThemeColor(); // 主题颜色
const globalConfig = mHelper.getGlobalConfig(); // 通用配置
const invoiceItem = ref({} as Invoice);
let state = reactive({
  serviceShow: false, //客服二维码展示
  isShippingReturnShow: false,
  isInvoiceShow: false,
  maskState: 0,
  orderDetail: {} as BaseOrderDetail,
  loading: true,
  errInfo: "",
  orderId: "",
  orderInvoiceContent: "",
  shippingReturnInfo: {
    id: "",
    member_express_no: "",
    member_express_company: "",
  },
});
//计算小程序胶囊菜单位置
const navPaddingTop = computed(() => {
  // #ifndef H5 || APP-PLUS
  let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
  return menuButtonInfo.top - (44-menuButtonInfo.height)/2 + 10
  // #endif
  // eslint-disable-next-line no-unreachable
  return 10;
})

const moneySymbol = mConstData.moneySymbol;

const isShippingMoneyShow = computed(() => {
  return (
    JSON.stringify(state.orderDetail.marketingDetail || {}).indexOf(
      "full_mail"
    ) === -1
  );
});

const time = (val: string) => {
  if (!val) return;
  return formatToDateTime(parseInt(val) * 1000, "YYYY.MM.DD HH:mm:ss");
};

const timeFormat = (val: string) => {
  return formatToDateTime(parseInt(val) * 1000, "MM.DD HH:mm:ss");
};

// 订单状态显示
const handleStatusFilter = (type = "") => {
  let tit = "";
  switch (state.orderDetail.order_status) {
    case OrderStatusEnum.PENDING_PAYMENT:
      tit = type === "title" ? "待付款" : "剩23小时59分自动关闭";
      break;
    case OrderStatusEnum.DELIVERED:
      tit = type === "title" ? "待发货" : "等待卖家发货";
      break;
    case OrderStatusEnum.SENT:
      tit = type === "title" ? "已发货" : "包裹正在火速飞奔向你~";
      break;
    case OrderStatusEnum.RECEIVED:
      tit = type === "title" ? "已收货" : "";
      break;
    case OrderStatusEnum.COMPLETED:
      tit = type === "title" ? "已完成" : "";
      break;
    case OrderStatusEnum.REFUNDING:
      tit = type === "title" ? "退款中" : "";
      break;
    case OrderStatusEnum.RETURN_APPLY:
      tit = type === "title" ? "退款申请" : "";
      break;
    case OrderStatusEnum.REFUND_COMPLETE:
      tit = type === "title" ? "退款成功" : "未发货, 退款成功";
      break;
    case OrderStatusEnum.CLOSE:
      tit = type === "title" ? "交易已关闭" : "不想要了/不想买了/未及时支付";
      break;
    case OrderStatusEnum.APPLICATION_CANCELED:
      tit = type === "title" ? "撤销申请" : "";
      break;
    case OrderStatusEnum.FORMED:
      tit = type === "title" ? "待成团" : "";
      break;
    case OrderStatusEnum.IN_STOCK:
      tit = type === "title" ? "备货中" : "等待备货完成";
      break;
    case OrderStatusEnum.BALANCE_TO_BE_PAID:
      tit = type === "title" ? "备货已完成" : "08.08前支付尾款";
      break;
    case OrderStatusEnum.TAKE_ORDER:
      tit = type === "title" ? "等待骑手接单" : "";
      break;
    case OrderStatusEnum.PENDING_DELIVERY:
      tit = type === "title" ? "待配送" : "";
      break;
    default:
      break;
  }
  return tit;
};
const filterShippingType = (value: string) => {
  let text;
  switch (Number(value)) {
    case OrderShippingType.LOGISTICS:
      text = "物流配送";
      break;
    case OrderShippingType.LOCAL_DISTRIBUTION:
      text = "本地配送";
      break;
    case OrderShippingType.PICK_UP:
      text = "买家自提";
      break;
    case OrderShippingType.TO_STORE:
      text = "买家到店";
      break;
    case OrderShippingType.VIRTUAL:
      text = "无需物流";
      break;
    default:
      text = "物流配送";
      break;
  }
  return text;
};

const filterPayType = (value: string) => {
  let text;
  switch (value) {
    case PayTypeEnum.WECHAT:
      text = "微信支付";
      break;
    case PayTypeEnum.ALIPAY:
      text = "支付宝支付";
      break;
    case PayTypeEnum.UNIONPAY:
      text = "银联支付";
      break;
    case PayTypeEnum.BYTEDANCE:
      text = "字节跳动支付";
      break;
    case PayTypeEnum.BALANCE:
      text = "余额支付";
      break;
    default:
      text = "在线支付";
      break;
  }
  return text;
};
const keepTwoDecimal = (value: string | number) => {
  return mHelper.keepTwoDecimal(value);
};

onLoad((options: any) => {
  state.orderId = options.id || "";
});
onShow(() => {
  const pages: AnyObject = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  if (currentPage.invoiceItem) invoiceItem.value = currentPage.invoiceItem;
  initData();
});

// 计算倒计时时间
const second = computed(() => {
  return function (val) {
    const date = new Date();
    return Math.floor(val - Number(date) / 1000);
  };
});

// 监听发票内容发生改变
const handleInvoiceContentChange = (e) => {
  state.orderInvoiceContent = e.detail.value;
};
// 订单号复制
const copy = (content: string) => {
  mHelper.copy(content);
};
const navTo = (route: Route, query = {}) => {
  mRouter.push({route, query,});
};

const hasLogin = mHelper.hasLogin();
// 客服跳转 0-不显示 10-rf客服 20-微信小程序客服 30-企业微信客服 40-二维码客服
const toService = (route: Route, query = {}) => {
  if (!hasLogin) {
    mHelper.backToLogin();
  }
  switch (globalConfig.app_service_type) {
    case 0 | 20:
      break;
    case 10:
      mRouter.push({route, query});
      break;
    case 30: //判断是H5还是小程序 跳转方式不同 app_service_corp_id  app_service_wechat_work_url
      // #ifdef H5
      query = {url: globalConfig.app_service_wechat_work_url}
      mRouter.push({route: mRouteConfig['url'], query});
      // #endif
      // #ifdef MP-WEIXIN
      wx.openCustomerServiceChat({
        extInfo: {
          url: globalConfig.app_service_wechat_work_url //客服地址链接
        },
        corpId: globalConfig.app_service_corp_id, //必须和你小程序上的一致
        success(res) {
          console.log(res, 1)
        },
        fail(res) {
          console.log(res, 2)
        },
      })
      // #endif
      break;
    case 40: //调起二维码弹窗 app_service_qr
      state.serviceShow = true;
      break;
    default:
      return;
  }
};
// 订单操作
const handleOrderOperation = (item, type: string, id = "") => {
  switch (type) {
    case "detail": // 订单详情
      navTo(mRouteConfig.orderDetail, {id: item.id,});
      break;
    case "evaluation": // 我要评价
      navTo(mRouteConfig.evaluation, {order_id: item.id,});
      break;
    case "close": // 取消订单
      handleOrderClose(item.id);
      break;
    case "delete": // 删除订单
      handleOrderDelete(item.id);
      break;
    case "shipping": // 查看物流
      navTo(mRouteConfig.shipping, {id: item.id,});
      break;
    case "delivery": // 确认收货
      handleOrderTakeDelivery(item.id);
      break;
    case "afterSaleDelivery": // 确认收货
      handleOrderAfterSaleTakeDelivery(id);
      break;
  }
};
// 初始化数据
const initData = () => {
  getOrderDetail();
};
// 获取订单详情
const getOrderDetail = async () => {
  try {
    state.orderDetail = (await memberApi.getOrderDetail({
      id: state.orderId,
    })) as unknown as BaseOrderDetail;
    if (invoiceItem.value.id && !state.orderDetail.invoice_id) {
      if (globalConfig.order_invoice_content) {
        invoiceItem.value.invoiceContentArr = globalConfig.order_invoice_content
          .toString()
          .split(",");
        state.orderInvoiceContent = invoiceItem.value.invoiceContentArr[0];
        state.isInvoiceShow = true;
      } else {
        invoiceItem.value.invoiceContentArr = [];
        mHelper.toast("请联系管理员配置发票类型");
      }
    }
    state.loading = false;
  } catch (e) {
    state.loading = false;
    state.errInfo = JSON.stringify(e);
  }
};
const handleOrderInvoiceCreate = async () => {
  try {
    await memberApi.handleOrderInvoiceCreate({
      order_id: state.orderDetail.id,
      invoice_id: invoiceItem.value.id,
      invoice_content: state.orderInvoiceContent,
    });
    state.isInvoiceShow = false;
    await getOrderDetail();
  } catch (e) {
    //
  }
};
// 取消订单
const handleOrderClose = async (id: string) => {
  try {
    await memberApi.handleOrderClose({
      id,
    });
    mHelper.toast("订单取消成功");
    await getOrderDetail();
  } catch (e) {
    //
  }
};
// 删除已关闭订单
const handleOrderDelete = async (id: string) => {
  try {
    await memberApi.handleOrderDelete({}, `?id=${id}`);
    mHelper.toast("订单删除成功");
    mRouter.back();
  } catch (e) {
    //
  }
};
// 确认收货
const handleOrderTakeDelivery = async (id: string) => {
  try {
    await memberApi.getOrderTakeDelivery({id,});
    uni.showModal({
      content: "确认收货成功, 是否立即去评价?",
      success: (confirmRes) => {
        getOrderDetail();
        if (confirmRes.confirm) {
          navTo(mRouteConfig.evaluation, {order_id: id,});
        }
      },
    });
  } catch (e) {
    //
  }
};
// 确认收货(换货)
const handleOrderAfterSaleTakeDelivery = async (id: string) => {
  try {
    await memberApi.handleOrderAfterSaleTakeDelivery({id,});
    await getOrderDetail();
    mHelper.toast("确认收货(换货)成功");
  } catch (e) {
    //
  }
};
// 跳转对应商品页
const navToProduct = (id, marketingType = "", marketingId = "") => {
  mHelper.navToProduct(id, marketingType, marketingId);
};
// 产品退款且退货关闭申请
const handleCloseOrderRefundApply = async (status: string, id: string) => {
  uni.showModal({
    content: "取消该售后后将无法再次提交申请，是否继续取消?",
    success: async (e) => {
      if (e.confirm) {
        try {
          await memberApi.handleOrderAfterSaleClose({id,});
          mHelper.toast("取消成功");
          await getOrderDetail();
        } catch (e) {
          //
        }
      }
    },
  });
};
// 提交退货物流
const handleSalesReturn = async () => {
  if (!state.shippingReturnInfo.member_express_company) {
    mHelper.toast("请输入物流公司");
    return;
  }
  if (!state.shippingReturnInfo.member_express_no) {
    mHelper.toast("请输入物流单号");
    return;
  }
  try {
    await memberApi.handleOrderAfterSaleSalesReturn(state.shippingReturnInfo);
    mHelper.toast("提交成功");
    state.isShippingReturnShow = false;
    await getOrderDetail();
    state.shippingReturnInfo = {
      id: "",
      member_express_no: "",
      member_express_company: "",
    };
  } catch (e) {
    //
  }
};
// 打开地图
const handleLocationOpen = () => {
  if (Number(state.orderDetail.shipping_type) !== OrderShippingType.PICK_UP) return;
  uni.openLocation({
    latitude: Number(state.orderDetail.store?.latitude),
    longitude: Number(state.orderDetail.store?.longitude),
    success: function () {
    },
    fail: function (err) {
      mHelper.log(err);
    },
  });
};
</script>
<style lang="scss" scoped>
.rf-order-detail {
  width: 100vw;
  padding-bottom: calc(env(safe-area-inset-bottom) / 2 + 110rpx);
  background-color: $page-color-dark;
  min-height: 100vh;

  &__header-bg {
    width: 100%;

    .content {
      height: 256rpx;
      display: flex;
      align-items: center;
      padding: 0 $spacing-lg;

      .tit {
        margin-bottom: 4rpx;
      }
    }
  }

  &__address {
    width: 702rpx;
    padding: $spacing-lg;
    margin: -62rpx $page-base-spacing $spacing-base;
    background-color: $color-white;
    border-radius: 18rpx;
  }

  &__product {
    /* 单条商品操作 */
    &__operation {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .action-btn {
        font-size: calc($font-sm + 2rpx);
        margin: 0 0 0 12rpx;
        padding: 0 32rpx;
        color: $font-color-dark;
        border-radius: 64rpx;
        height: 64rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1rpx solid rgba(0, 0, 0, 0.2);
        background-color: $color-white;
      }

      .action-btn-disabled {
        opacity: 0.5;
      }
    }
  }

  &__content {
    width: 702rpx;
    padding: $spacing-sm $spacing-lg;
    margin: 0 $page-base-spacing $spacing-base;
    background-color: $color-white;
    border-radius: 18rpx;

    .g-item {
      .goods-img {
        width: 176rpx;
        height: 176rpx;
        border-radius: 8rpx;
        margin-right: 16rpx;
      }

      .info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .detail {
          display: flex;
        }

        .mid {
          padding: 0;
        }

        .foot {
          margin-top: auto;
          display: flex;
          justify-content: space-between;

          .original-price {
            font-size: 28rpx;
            color: #999;
          }

          .paid-in {
            font-size: 28rpx;
            color: #333;
          }
        }
      }
    }
  }

  &__footer {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 98;
    width: 100%;
    background-color: $color-white;
    color: $font-color-base;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 $spacing-base calc(env(safe-area-inset-bottom) / 2);

    .action-btn {
      font-size: calc($font-sm + 2rpx);
      padding: 0 $spacing-lg;
      margin: $spacing-base 0 $spacing-base $spacing-base;
      height: 64rpx;
      border-radius: 32rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $color-white;
    }

    .action-btn-border {
      border: 1rpx solid rgba(0, 0, 0, 0.3);
    }
  }

  .rf-mobile-form {
    width: 84%;
    margin: 40rpx auto;

    &__item {
      padding-bottom: 16rpx;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      display: flex;
      align-items: center;

      &:not(:last-child) {
        margin-bottom: 56rpx;
      }

      input {
        flex: 1;
        font-size: 28rpx;
        height: 56rpx;
      }

      .link {
        font-size: 28rpx;
        line-height: 2;
        color: #333;
      }
    }
  }
}
</style>
