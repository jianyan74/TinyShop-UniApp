// 订单组别说明
export enum OrderGroupEnum {
  // 充值
  RECHARGE = "recharge",
  // 订单支付
  ORDER = "order",
  // 订单批量支付
  ORDERBATCH = "orderBatch",
  // 订单混合批量支付
  ORDERUNITEBATCH = "orderUniteBatch",
  // 订单尾款
  ORDERFINAL = "orderFinal",
  // 订单尾款混合支付
  ORDERUNITEFINAL = "orderUniteFinal",
  // 好友代付
  ORDERPEER = "orderPeer",
  // 会员卡支付
  MEMBERCARD = "memberCard",
}

// 订单组别说明
export enum PayTypeEnum {
  // 微信
  WECHAT = "100",
  // 支付宝
  ALIPAY = "101",
  // 银联
  UNIONPAY = "102",
  // 字节跳动
  BYTEDANCE = "103",
  // 余额
  BALANCE = "1",
}
