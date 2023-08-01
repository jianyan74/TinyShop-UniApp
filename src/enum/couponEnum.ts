// 优惠券使用类型
export enum CouponStatusEnum {
  // 全部商品可使用
  ALL = "1",
  // 部分商品可使用
  ASSIGN_PRODUCT = "2",
  // 部分商品不能使用
  NOT_ASSIGN_PRODUCT = "3",
  // 部分分类可使用
  ASSIGN_CATE = "11",
  // 部分分类不能使用
  NOT_ASSIGN_CATE = "12",
}
