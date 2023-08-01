/*
 * 路由表对象：
 * 该文件挂载在Vue
 * 作用：调用router对象的方法 传入以下对应的路由对象
 * 示例：mRouter.push({route:mRouteConfig.index,query:{a:1}})
 * 注意：所有在pages目录下新建的页面都必须在"路由表"中进行声明，并且在框架的pages.json注册。
 *
 * 配置参数项说明：
 * name:可选配置 （路由名称）
 * path:必填配置 （路由地址）
 * requiresAuth:可选配置 （是否权限路由）
 */
const mRouteConfig = {
  index: {
    name: "首页",
    path: "/pages/index/index",
  },
  preview: {
    name: "预览",
    path: "/pages/index/preview",
  },
  custom: {
    name: "活动", // 自定义页面
    path: "/pages/index/custom",
  },
  category: {
    name: "分类",
    path: "/pages/tab/category/category",
  },
  notify: {
    name: "消息",
    path: "/pages/tab/notify/notify",
  },
  cart: {
    name: "购物车",
    path: "/pages/tab/cart/cart",
  },
  profile: {
    name: "我的",
    path: "/pages/tab/profile/profile",
  },
  circle: {
    name: "种草",
    path: "/pages/tab/circle/circle",
  },

  // public
  login: {
    name: "登录",
    path: "/pages/public/login",
  },
  loginAuthorized: {
    name: "授权登录",
    path: "/pages/public/loginAuthorized",
  },
  register: {
    name: "注册",
    path: "/pages/public/register",
  },
  password: {
    name: "修改密码",
    path: "/pages/public/password",
  },
  url: {
    name: "外部链接",
    path: "/pages/public/url",
  },
  notice: {
    name: "公告",
    path: "/pages/public/notice/notice",
  },
  noticeDetail: {
    name: "公告详情",
    path: "/pages/public/notice/detail",
  },

  // order
  order: {
    name: "订单列表",
    path: "/pages/tab/order/order",
  },
  orderDetail: {
    name: "订单详情",
    path: "/pages/order/detail",
  },
  friendPay: {
    name: "好友代付",
    path: "/pages/order/friendPay",
  },
  refund: {
    name: "订单售后列表",
    path: "/pages/order/refund",
  },
  createOrder: {
    name: "创建订单",
    path: "/pages/order/create",
  },
  evaluation: {
    name: "发表评价",
    path: "/pages/order/evaluation/evaluation",
  },
  evaluationList: {
    name: "评价列表",
    path: "/pages/order/evaluation/list",
  },
  orderRefund: {
    name: "订单售后",
    path: "/pages/order/orderRefund",
  },
  shipping: {
    name: "物流详情",
    path: "/pages/order/shipping",
  },

  // product
  product: {
    name: "商品详情",
    path: "/pages/product/product",
  },
  productList: {
    name: "商品列表",
    path: "/pages/product/list",
  },
  productExcellent: {
    name: "商品精选",
    path: "/pages/product/excellent",
  },
  productSearch: {
    name: "搜索",
    path: "/pages/product/search",
  },
  prodPoster:       {
    title: "商品海报",
    route: "prodPoster",
    path: "/pages/product/prodPoster",
  },
  // service
  service: {
    name: "联系客服",
    path: "/pages/service/service",
  },
  serviceDetail: {
    name: "问题详情",
    path: "/pages/service/detail",
  },
  serviceCenter: {
    name: "客服中心",
    path: "/pages/service/center",
  },

  // user
  account: {
    name: "我的账户",
    path: "/pages/user/account/account",
  },
  bill: {
    name: "账单明细",
    path: "/pages/user/account/bill",
  },
  accountLevel: {
    name: "会员等级",
    path: "/pages/user/account/level",
  },
  integral: {
    name: "积分详情",
    path: "/pages/user/account/integral",
  },
  level: {
    name: "会员等级",
    path: "/pages/user/account/level",
  },
  recharge: {
    name: "充值",
    path: "/pages/user/account/recharge",
  },
  accountCenter: {
    name: "会员中心",
    path: "/pages/user/card/center",
  },
  toVip: {
    name: "开通会员",
    path: "/pages/user/card/tovip",
  },
  address: {
    name: "收货地址",
    path: "/pages/user/address/address",
  },
  addressManage: {
    name: "收货地址管理",
    path: "/pages/user/address/manage",
  },
  collection: {
    name: "我的收藏",
    path: "/pages/user/collection",
  },
  coupon: {
    name: "我的优惠券",
    path: "/pages/user/coupon/coupon",
  },
  couponDetail: {
    name: "优惠券详情",
    path: "/pages/user/coupon/detail",
  },
  couponList: {
    name: "领券中心",
    path: "/pages/user/coupon/center",
  },
  footprint: {
    name: "我的足迹",
    path: "/pages/user/footprint",
  },
  pay: {
    name: "支付",
    path: "/pages/user/pay",
  },
  paySuccess: {
    name: "支付成功",
    path: "/pages/user/paySuccess",
  },
  mobile: {
    name: "修改手机号",
    path: "/pages/user/mobile",
  },
  userinfo: {
    name: "修改资料",
    path: "/pages/user/userinfo",
  },
  virtual: {
    name: "我的核销码",
    path: "/pages/user/virtual/virtual",
  },
  virtualDetail: {
    name: "核销码详情",
    path: "/pages/user/virtual/detail",
  },

  // set
  set: {
    name: "设置",
    path: "/pages/set/set",
  },
  security: {
    name: "账号与安全",
    path: "/pages/set/security",
  },
  about: {
    name: "关于",
    path: "/pages/set/about/about",
  },
  aboutDetail: {
    name: "关于详情",
    path: "/pages/set/about/detail",
  },
  authorization: {
    name: "授权列表",
    path: "/pages/set/authorization",
  },
  feedback: {
    name: "意见反馈",
    path: "/pages/set/feedback/feedback",
  },
  feedbackDetail: {
    name: "意见反馈详情",
    path: "/pages/set/feedback/detail",
  },
  feedbackList: {
    name: "意见反馈",
    path: "/pages/set/feedback/list",
  },
  helper: {
    name: "站点帮助",
    path: "/pages/set/helper/helper",
  },
  helperDetail: {
    name: "站点帮助详情",
    path: "/pages/set/helper/detail",
  },
  invoice: {
    name: "发票管理",
    path: "/pages/set/invoice/invoice",
  },
  invoiceList: {
    name: "开票列表",
    path: "/pages/set/invoice/list",
  },
  invoiceManage: {
    name: "开票历史",
    path: "/pages/set/invoice/manage",
  },

  // bigWheel
  luckyWheelActivity: {
    name: "大转盘",
    path: "/pages/bigWheel/lucky-wheel",
  },

  // sign
  signIn: {
    name: "每日签到",
    path: "/pages/sign/sign-in",
  },
  signInRank: {
    name: "签到排行榜",
    path: "/pages/sign/sign-in-rank",
  },

  // marketing
  marketingProductList: {
    name: "营销商品列表",
    path: "/pages/marketing/list",
  },
  preSellList: {
    name: "预售列表",
    path: "/pages/marketing/list?marketingType=pre_sell",
  },
  groupBuyList: {
    name: "团购列表",
    path: "/pages/marketing/list?marketingType=group_buy",
  },
  discountList: {
    name: "限时折扣列表",
    path: "/pages/marketing/list?marketingType=discount",
  },
  secKillList: {
    name: "限时秒杀列表",
    path: "/pages/marketing/list?marketingType=sec_kill",
  },
  bargainList: {
    name: "砍价列表",
    path: "/pages/marketing/list?marketingType=bargain",
  },
  bargainDetail: {
    name: "砍价详情",
    path: "/pages/marketing/bargain/detail",
  },
  bargainMy: {
    name: "我的砍价",
    path: "/pages/marketing/bargain/my",
  },
  wholesaleList: {
    name: "拼团列表",
    path: "/pages/marketing/list?marketingType=wholesale",
  },
  wholesaleDetail: {
    name: "拼团详情",
    path: "/pages/marketing/wholesale/detail",
  },
  wholesaleGroup: {
    name: "开团记录(拼团)",
    path: "/pages/marketing/wholesale/group",
  },
  wholesaleMy: {
    name: "我的拼团",
    path: "/pages/marketing/wholesale/my",
  },
  combination: {
    name: "组合套餐",
    path: "/pages/marketing/combination",
  },
  flashSale: {
    name: "限时秒杀",
    path: "/pages/marketing/secKill",
  },
  liveList: {
    name: "直播",
    path: "/pages/marketing/live",
  },
  point: {
    name: "积分商城",
    path: "/pages/marketing/point",
  },
  cartShop: {
    name: "加购商品",
    path: "/pages/marketing/cartShop",
  },

  // merchantCentre
  merchantOrderVerifyList: {
    name: "商户核销",
    path: "/pages/merchantCentre/order/verify/list",
  },

  // distribute
  distribute: {
    name: "推广中心",
    path: "/pages/tab/distribute/distribute",
  },
  distributeLevel: {
    name: "等级说明",
    path: "/pages/distribute/level",
  },
  distributeApply: {
    name: "申请推广员",
    path: "/pages/distribute/apply",
  },
  agent: {
    name: "我的团队",
    path: "/pages/distribute/agent",
  },
  brokerage: {
    name: "佣金明细",
    path: "/pages/distribute/brokerage/brokerage",
  },
  brokerageRank: {
    name: "佣金排行榜",
    path: "/pages/distribute/brokerage/rank",
  },
  cash: {
    name: "申请提现",
    path: "/pages/distribute/cash/cash",
  },
  cashList: {
    name: "提现明细",
    path: "/pages/distribute/cash/list",
  },
  distributeOrder: {
    name: "分销订单",
    path: "/pages/distribute/order",
  },
  distributeProduct: {
    name: "推广商品",
    path: "/pages/distribute/product",
  },
  regionalApply: {
    name: "申请区域代理",
    path: "/pages/distribute/regionalApply",
  },
  spread: {
    name: "分销商信息",
    path: "/pages/distribute/spread/spread",
  },
  spreadPromote: {
    name: "推广二维码",
    path: "/pages/distribute/spread/promote",
  },
  withdraw: {
    name: "提现账号",
    path: "/pages/distribute/withdraw/withdraw",
  },
  withdrawManage: {
    name: "提现账号管理",
    path: "/pages/distribute/withdraw/manage",
  },

  // merchant
  merchant: {
    name: "店铺主页",
    path: "/pages/merchant/merchant",
  },
  merchantCard: {
    name: "店铺印象",
    path: "/pages/merchant/card",
  },
  merchantDetail: {
    name: "店铺详情",
    path: "/pages/merchant/detail",
  },
  location: {
    name: "城市定位",
    path: "/pages/merchant/location",
  },
  merchantList: {
    name: "商户列表",
    path: "/pages/merchant/list",
  },

  // circle
  myCircle: {
    name: "我的帖子",
    path: "/pages/circle/my",
  },
  circleCollection: {
    name: "我的收藏",
    path: "/pages/circle/collection",
  },
  circleUpload: {
    name: "发布帖子",
    path: "/pages/circle/upload",
  },
  circleDetail: {
    name: "种草详情",
    path: "/pages/circle/detail",
  },
};

export default mRouteConfig;
