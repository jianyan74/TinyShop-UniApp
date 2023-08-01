// 订单状态
export enum OrderStatusEnum {
  PENDING_PAYMENT = "0", // 待付款
  DELIVERED = "10", // 待发货
  SENT = "20", // 已发货
  RECEIVED = "30", // 已收货
  COMPLETED = "40", // 已完成
  RETURN_APPLY = "-10", // 退货申请
  REFUNDING = "-20", // 退款中
  REFUND_COMPLETE = "-30", // 退款完成
  CLOSE = "-40", // 已关闭
  APPLICATION_CANCELED = "-50", // 撤销申请
  FORMED = "11", // 待成团
  IN_STOCK = "12", // 备货中
  BALANCE_TO_BE_PAID = "13", // 待付尾款
  TAKE_ORDER = "21", // 等待骑手接单
  PENDING_DELIVERY = "22", // 待配送(骑手已接单)
}

// 配送方式
export enum OrderShippingType {
  LOGISTICS = 1, // 物流配送
  LOCAL_DISTRIBUTION = 2, // 同城配送
  PICK_UP = 100, // 买家自提
  TO_STORE = 101, // 买家到店
  VIRTUAL = 201, // 无需物流 (虚拟商品)
}

// 订单状态
export enum OrderRefundStatusEnum {
  UN_APPLY = "0", // 未申请
  APPLY = "10", // 买家退款申请
  SALES_RETURN = "20", // 等待买家退货
  AFFIRM_SALES_RETURN = "30", // 	等待卖家确认收货
  AFFIRM_RETURN_MONEY = "40", // 等待卖家确认退款
  AFFIRM_SHIPMENTS = "41", // 等待商家发货(换货)
  SHIPMENTS = "42", // 等待买家收货(换货)
  MEMBER_AFFIRM = "43", // 换货完成(换货)
  CONSENT = "50", // 	换货完成
  NO_PASS_ALWAYS = "-10", // 退款已拒绝(不可再次申请退款退货流程)
  CANCEL = "-20", // 退款已关闭
  NO_PASS = "-30", // 退款申请不通过(可再次申请退款退货流程)
}

// 售后状态
export enum OrderRefundType {
  MONEY = "1", // 仅退款
  MONEY_AND_PRODUCT = "2", // 退款且退货
  EXCHANGE_PRODUCT = "3", // 换货
}
