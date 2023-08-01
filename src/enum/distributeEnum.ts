// 提现
export enum WithdrawEnum {
  UNION_PAY = 10, // 银联卡
  WECHAT = 20, // 微信
  WECHAT_MP = 21, // 微信小程序
  ALIPAY = 30, // 支付宝
  BALANCE = 1, // 余额
}

export enum WithdrawCashEnum {
  APPLY = 0, // 审核中
  APPLY_AGREE = 1, // 待转账
  TRANSFER_IN_PROGRESS = 2, // 转账中
  TRANSFER_SUCCESS = 3, // 转账成功
  APPLY_REFUSE = -1, // 审核拒绝
  TRANSFER_ERROR = -2, // 转账失败
}
