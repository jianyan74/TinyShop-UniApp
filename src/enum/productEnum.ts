// 商品组别
export enum ProductTypeEnum {
  // 实物商品
  ENTITY = "0",
  // 虚拟商品
  VIRTUAL = "201",
  // 电子卡卷
  CARD_VOLUME = "202",
}

// 卡卷有效期
export enum TermOfValidityTypeEnum {
  // 固定时间
  FIXATION = "0",
  // 领到券当日开始 N 天内有效
  GET = "1",
}
