/**
 *@des 常量参数
 */
const mConstData = {
  // app应用名称
  appName: 'RF商城',

  // 购物车在tab的位置
  cartIndex: 3,

  // 消息在tab的位置
  notifyIndex: 2,

  // 分页个数
  pageSize: 10,

  // 验证码发送间隔
  sendCodeTime: 60,

  // 金额符号
  moneySymbol: '￥',

  // 顶部导航菜单
  menuTop: [
    {
      icon: 'iconshouye4',
      text: '首页',
      url: 'index',
      query: {}
    },
    {
      icon: 'iconxiaoxi9',
      text: '消息',
      url: 'notify',
      query: {}
    },
    {
      icon: 'icongouwuche5',
      text: '购物车',
      url: 'cart',
      query: {}
    },
    {
      icon: 'iconwode3',
      text: '我的',
      url: 'profile',
      query: {}
    },
    {
      icon: 'iconbianji',
      text: '我要反馈',
      url: 'feedback',
      query: {}
    },
    {
      icon: 'iconquanbudingdan',
      text: '我的订单',
      url: 'order',
      query: { state: '-1' }
    },
    {
      icon: 'iconzuji',
      text: '我的足迹',
      url: 'footprint',
      query: {}
    },
    {
      icon: 'iconsousuo',
      text: '搜索',
      url: 'productSearch',
      query: {}
    },
  ],

  // 个人中心-设置中心菜单 e07472 ff4757 ff6b81
  settingList: [
    {
      icon: 'icongonggao',
      url: 'notice',
      query: {},
      title: '商城公告',
      color: '#ff6b81'
    },
    {
      icon: 'iconyouhuiquan-copy',
      url: 'couponList',
      query: {},
      title: '领券中心',
      color: '#ff6b81'
    },
    {
      icon: 'iconjifenshangcheng',
      url: 'point',
      query: {},
      title: '积分商城',
      color: '#ff6b81'
    },
    {
      icon: 'icondizhi1',
      url: 'address',
      query: {},
      title: '地址管理',
      color: '#ff6b81'
    },
    {
      icon: 'iconmimazhongzhi',
      url: 'virtual',
      query: {},
      title: '核销码',
      color: '#ff6b81'
    },
    {
      icon: 'iconpintuandingdan',
      url: 'wholesaleMy',
      query: {},
      title: '我的拼团',
      color: '#ff6b81'
    },
    {
      icon: 'iconkanjia1',
      url: 'bargainMy',
      query: {},
      title: '我的砍价',
      color: '#ff6b81'
    },
    {
      icon: 'iconshoucang3',
      url: 'collection',
      query: {},
      title: '我的收藏',
      color: '#ff6b81'
    },
    {
      icon: 'iconzuji1',
      url: 'footprint',
      query: {},
      title: '我的足迹',
      color: '#ff6b81'
    },
    {
      icon: 'iconyiguanzhudianpu',
      url: 'collection',
      query: { state: 2 },
      title: '店铺收藏',
      color: '#ff6b81'
    },
    {
      icon: 'iconfenxiaozhongxin',
      url: 'distributeApply',
      query: {},
      title: '推广中心',
      color: '#ff6b81'
    },
    {
      icon: 'iconfenxiang',
      url: '',
      query: {},
      title: '分享',
      color: '#ff6b81'
    },
    {
      icon: 'iconzhibo',
      url: 'liveList',
      query: {},
      title: '直播',
      color: '#ff6b81'
    },
    // { icon: 'iconzhibo', url: '/pages/user/live', title: '直播测试', color: '#ff6b81' },
    {
      icon: 'iconshouhoukefu',
      url: 'service',
      query: {},
      title: '联系客服',
      color: '#ff6b81'
    },
    {
      icon: 'iconshezhi3',
      url: 'set',
      query: {},
      title: '设置',
      color: '#ff6b81'
    }
  ],

  // 设置-设置中心
  setList: [
    {
      title: '个人资料',
      url: 'userinfo',
      content: ''
    },
    {
      title: '账号与安全',
      url: 'security',
      content: ''
    },
    {
      title: '地址管理',
      url: 'address',
      content: ''
    },
    {
      title: '授权管理',
      url: 'authorization',
      content: ''
    },
    {
      title: '发票管理',
      url: 'invoice',
      content: '',
      isMt: true
    },
    {
      title: '开票历史',
      url: 'invoiceList',
      content: ''
    },
    {
      title: '清除缓存',
      url: 'clearCache',
      content: ''
    },
    {
      title: '关于商城',
      url: 'about',
      content: '',
      isMt: true
    },
    /*  #ifdef APP-PLUS  */
    {
      title: '检查更新',
      url: 'versionUpgrade',
      content: ''
    },
    /*  #endif  */
    {
      title: '站点帮助',
      url: 'helper',
      content: ''
    },
    {
      title: '意见反馈',
      url: 'feedbackList',
      content: ''
    }
  ],

  // 个人中心-我的订单
  orderSectionList: [
    {
      title: '待付款',
      icon: 'icongerenzhongxin_daifukuan',
      url: 'order',
      query: { state: 0 },
      num: 0
    },
    {
      title: '待发货',
      icon: 'icongerenzhongxin_daifahuo',
      url: 'order',
      query: { state: 1 },
      num: 0
    },
    {
      title: '已发货',
      icon: 'icongerenzhongxin_daishouhuo',
      url: 'order',
      query: { state: 2 },
      num: 0
    },
    {
      title: '评价',
      icon: 'icongerenzhongxin_daipingjia',
      url: 'order',
      query: { state: 3 },
      num: 0
    },
    {
      title: '退款/售后',
      icon: 'icongerenzhongxin_shouhou',
      url: 'refund',
      num: 0
    }
  ],

  // 个人中心-积分余额
  amountList: [
    {
      title: '余额',
      value: '0',
      url: 'account',
      query: {}
    },
    {
      title: '优惠券',
      value: '0',
      url: 'coupon',
      query: { type: 1 }
    },
    {
      title: '积分',
      value: '0',
      url: 'integral',
      query: {}
    },
    {
      title: '成长值',
      value: '0',
      url: 'integral',
      query: { type: 'user_growth' }
    }
  ],

  // 个人中心-推广中心
  promotionList: [
    {
      title: '累计佣金',
      value: 0,
      url: 'distribute'
    },
    {
      title: '当前佣金',
      value: 0,
      url: 'brokerage'
    },
    {
      title: '已提现佣金',
      value: 0,
      url: 'cashList'
    }
  ],

  // 订单状态
  orderStatus: [
    {
      key: 0,
      value: '待付款'
    },
    {
      key: 1,
      value: '待发货'
    },
    {
      key: 2,
      value: '已发货'
    },
    {
      key: 3,
      value: '已收货'
    },
    {
      key: 4,
      value: '已完成'
    },
    {
      key: -1,
      value: '退货申请'
    },
    {
      key: -2,
      value: '退款中'
    },
    {
      key: -3,
      value: '退款完成'
    },
    {
      key: -4,
      value: '已关闭'
    },
    {
      key: -5,
      value: '撤销申请'
    },
    {
      key: 101,
      value: '待成团'
    },
    {
      key: 201,
      value: '备货中'
    },
    {
      key: 202,
      value: '待付尾款'
    },
    {
      key: 300,
      value: '待骑手接单'
    },
    {
      key: 301,
      value: '骑手已接单'
    }
  ],

  // 订单退货状态
  refundStatus: [
    {
      key: 1,
      value: '退款申请'
    },
    {
      key: 2,
      value: '等待退货'
    },
    {
      key: 3,
      value: '等待确认收货'
    },
    {
      key: 4,
      value: '等待确认退款'
    },
    {
      key: 5,
      value: '已退款'
    },
    {
      key: -1,
      value: '退款已拒绝'
    },
    {
      key: -2,
      value: '退款已关闭'
    },
    {
      key: -3,
      value: '退款不通过'
    }
  ],

  // 订单评价状态
  evaluateStatus: [
    {
      key: 0,
      value: '未评价'
    },
    {
      key: 1,
      value: '已评价'
    },
    {
      key: 2,
      value: '已追评'
    }
  ],

  // 订单状态导航
  orderNavList: [
    {
      state: undefined,
      text: '全部'
    },
    {
      state: 0,
      text: '待付款'
    },
    {
      state: 10,
      text: '待发货'
    },
    {
      state: 20,
      text: '已发货'
    },
    {
      state: 30,
      text: '评价'
    }
  ],

  // 表情列表
  emojiList: [
    {
      url: '0',
      alt: '[微笑]'
    },
    {
      url: '1',
      alt: '[撇嘴]'
    },
    {
      url: '2',
      alt: '[色]'
    },
    {
      url: '3',
      alt: '[发呆]'
    },
    {
      url: '4',
      alt: '[得意]'
    },
    {
      url: '5',
      alt: '[流泪]'
    },
    {
      url: '6',
      alt: '[害羞]'
    },
    {
      url: '7',
      alt: '[闭嘴]'
    },
    {
      url: '8',
      alt: '[睡]'
    },
    {
      url: '9',
      alt: '[大哭]'
    },
    {
      url: '10',
      alt: '[尴尬]'
    },
    {
      url: '11',
      alt: '[发怒]'
    },
    {
      url: '12',
      alt: '[调皮]'
    },
    {
      url: '13',
      alt: '[呲牙]'
    },
    {
      url: '14',
      alt: '[惊讶]'
    },
    {
      url: '15',
      alt: '[难过]'
    },
    {
      url: '16',
      alt: '[酷]'
    },
    {
      url: '17',
      alt: '[冷汗]'
    },
    {
      url: '18',
      alt: '[抓狂]'
    },
    {
      url: '19',
      alt: '[吐]'
    },
    {
      url: '20',
      alt: '[偷笑]'
    },
    {
      url: '21',
      alt: '[愉快]'
    },
    {
      url: '22',
      alt: '[白眼]'
    },
    {
      url: '23',
      alt: '[傲慢]'
    },
    {
      url: '24',
      alt: '[饥饿]'
    },
    {
      url: '25',
      alt: '[困]'
    },
    {
      url: '26',
      alt: '[惊恐]'
    },
    {
      url: '27',
      alt: '[流汗]'
    },
    {
      url: '28',
      alt: '[憨笑]'
    },
    {
      url: '29',
      alt: '[悠闲]'
    },
    {
      url: '30',
      alt: '[奋斗]'
    },
    {
      url: '31',
      alt: '[咒骂]'
    },
    {
      url: '32',
      alt: '[疑问]'
    },
    {
      url: '33',
      alt: '[嘘]'
    },
    {
      url: '34',
      alt: '[晕]'
    },
    {
      url: '35',
      alt: '[疯了]'
    },
    {
      url: '36',
      alt: '[衰]'
    },
    {
      url: '37',
      alt: '[骷髅]'
    },
    {
      url: '38',
      alt: '[敲打]'
    },
    {
      url: '39',
      alt: '[再见]'
    },
    {
      url: '40',
      alt: '[擦汗]'
    },
    {
      url: '41',
      alt: '[抠鼻]'
    },
    {
      url: '42',
      alt: '[鼓掌]'
    },
    {
      url: '43',
      alt: '[糗大了]'
    },
    {
      url: '44',
      alt: '[坏笔]'
    },
    {
      url: '45',
      alt: '[左哼哼]'
    },
    {
      url: '46',
      alt: '[右哼哼]'
    },
    {
      url: '47',
      alt: '[哈欠]'
    },
    {
      url: '48',
      alt: '[鄙视]'
    },
    {
      url: '49',
      alt: '[委屈]'
    },
    {
      url: '50',
      alt: '[快哭了]'
    },
    {
      url: '51',
      alt: '[阴险]'
    },
    {
      url: '52',
      alt: '[亲亲]'
    },
    {
      url: '53',
      alt: '[吓]'
    },
    {
      url: '54',
      alt: '[可怜]'
    },
    {
      url: '55',
      alt: '[菜刀]'
    },
    {
      url: '56',
      alt: '[西瓜]'
    },
    {
      url: '57',
      alt: '[啤酒]'
    },
    {
      url: '58',
      alt: '[篮球]'
    },
    {
      url: '59',
      alt: '[乒乓]'
    },
    {
      url: '60',
      alt: '[咖啡]'
    },
    {
      url: '61',
      alt: '[饭]'
    },
    {
      url: '62',
      alt: '[猪头]'
    },
    {
      url: '63',
      alt: '[玫瑰]'
    },
    {
      url: '64',
      alt: '[凋谢]'
    },
    {
      url: '65',
      alt: '[嘴唇]'
    },
    {
      url: '66',
      alt: '[爱心]'
    },
    {
      url: '67',
      alt: '[心碎]'
    },
    {
      url: '68',
      alt: '[蛋糕]'
    },
    {
      url: '69',
      alt: '[闪电]'
    },
    {
      url: '70',
      alt: '[炸弹]'
    },
    {
      url: '71',
      alt: '[刀]'
    },
    {
      url: '72',
      alt: '[足球]'
    },
    {
      url: '73',
      alt: '[瓢虫]'
    },
    {
      url: '74',
      alt: '[便便]'
    },
    {
      url: '75',
      alt: '[月亮]'
    },
    {
      url: '76',
      alt: '[太阳]'
    },
    {
      url: '77',
      alt: '[礼物]'
    },
    {
      url: '78',
      alt: '[拥抱]'
    },
    {
      url: '79',
      alt: '[强]'
    },
    {
      url: '80',
      alt: '[弱]'
    },
    {
      url: '81',
      alt: '[握手]'
    },
    {
      url: '82',
      alt: '[胜利]'
    },
    {
      url: '83',
      alt: '[抱拳]'
    },
    {
      url: '84',
      alt: '[勾引]'
    },
    {
      url: '85',
      alt: '[拳头]'
    },
    {
      url: '86',
      alt: '[差劲]'
    },
    {
      url: '87',
      alt: '[爱您]'
    },
    {
      url: '88',
      alt: '[NO]'
    },
    {
      url: '89',
      alt: '[OK]'
    },
    {
      url: '90',
      alt: '[爱情]'
    },
    {
      url: '91',
      alt: '[飞吻]'
    },
    {
      url: '92',
      alt: '[跳跳]'
    },
    {
      url: '93',
      alt: '[发抖]'
    },
    {
      url: '94',
      alt: '[怄火]'
    },
    {
      url: '95',
      alt: '[转圈]'
    },
    {
      url: '96',
      alt: '[磕头]'
    },
    {
      url: '97',
      alt: '[回头]'
    },
    {
      url: '98',
      alt: '[跳绳]'
    },
    {
      url: '99',
      alt: '[投降]'
    },
    {
      url: '100',
      alt: '[激动]'
    },
    {
      url: '101',
      alt: '[乱舞]'
    },
    {
      url: '102',
      alt: '[献吻]'
    },
    {
      url: '103',
      alt: '[左太极]'
    },
    {
      url: '104',
      alt: '[右太极]'
    }
  ],

  // 推广中心主页信息显示
  promotionIndexList: [
    {
      title: '待结算',
      value: 0,
      url: 'brokerage',
      query: {
        state: 0,
        type: 'promoter_brokerage'
      }
    },
    {
      title: '累计佣金',
      value: 0,
      url: 'brokerage',
      query: {
        state: 1,
        type: 'promoter_brokerage'
      }
    },
    {
      title: '当前佣金',
      value: 0,
      url: 'brokerage'
    },
    {
      title: '消费笔数',
      value: 0,
      url: 'distributeOrder'
    },
    {
      title: '消费金额',
      value: 0,
      url: 'distributeOrder'
    }
  ],

  // 推广中心主要操作
  promotionOperationList: [
    {
      title: '我的团队',
      url: 'agent',
      query: {
        type: 'group'
      },
      icon: 'iconfenxiaoshang_wodetuandui'
    },
    {
      title: '分销订单',
      url: 'distributeOrder',
      icon: 'iconfenxiaoshang_fenxiaodingdan'
    },
    {
      title: '佣金明细',
      url: 'brokerage',
      icon: 'iconfenxiaoshang_yongjinmingxi'
    },
    {
      title: '佣金排行榜',
      url: 'brokerageRank',
      icon: 'iconfenxiaoshang_yongjinpaihangbang'
    },
    {
      title: '提现账号',
      url: 'withdraw',
      query: {
        type: 'group'
      },
      icon: 'iconfenxiaoshang_tixianzhanghao'
    },
    {
      title: '提现明细',
      url: 'cashList',
      icon: 'iconfenxiaoshang_tixianmingxi'
    },
    {
      title: '推广商品',
      url: 'distributeProduct',
      icon: 'iconfenxiaoshang_tuiguangshangpin'
    },
    {
      title: '推广海报',
      url: 'spreadPromote',
      icon: 'iconfenxiaoshang_tuiguanghaibao'
    },
    {
      title: '区代申请',
      url: 'regionalApply',
      icon: 'iconfenxiaoshang_qudaishenqing'
    }
  ],

  // 我的团队级别
  agentTypeList: [
    {
      state: 1,
      text: '上级分销商'
    },
    {
      state: 2,
      text: '下级分销商'
    },
    {
      state: 3,
      text: '下下级分销商'
    }
  ],

  // 佣金明细状态
  brokerageTypeList: [
    {
      state: 999,
      text: '全部'
    },
    {
      state: 1,
      text: '已完成'
    },
    {
      state: 0,
      text: '进行中'
    },
    {
      state: -1,
      text: '已关闭'
    }
  ],

  // 提现明细类型
  cashTypeList: [
    {
      state: -2,
      text: '全部'
    },
    {
      state: 1,
      text: '已通过'
    },
    {
      state: 0,
      text: '审核中'
    },
    {
      state: -1,
      text: '已拒绝'
    }
  ],

  // 拼团类型
  wholesaleTypeList: [
    {
      state: 1,
      text: '开团中'
    },
    {
      state: 2,
      text: '开团成功'
    },
    {
      state: 3,
      text: '开团失败'
    }
  ],

  // 直播记录列表
  liveTypeList: [
    {
      state: 101,
      text: '进行中'
    },
    {
      state: 102,
      text: '未开始'
    },
    {
      state: 103,
      text: '已结束'
    }
  ],

  // 我的拼团
  myWholesaleOrder: [
    {
      state: '',
      text: '全部'
    },
    {
      state: 1,
      text: '拼团中'
    },
    {
      state: 2,
      text: '拼团成功'
    },
    {
      state: 3,
      text: '拼团失败'
    }
  ],

  // 我的砍价
  myBargainOrder: [
    {
      state: '',
      text: '全部'
    },
    {
      state: 1,
      text: '砍价中'
    },
    {
      state: 2,
      text: '砍价成功'
    },
    {
      state: 3,
      text: '砍价失败'
    }
  ],

  // 收货地址/自提点
  addressTypeList: [
    {
      state: 1,
      text: '选择物流配送'
    },
    {
      state: 2,
      text: '选择自提配送'
    }
  ],

  // 热门推荐
  hotRecommendList: [
    {
      url: 'bargainList',
      icon: '/static/image/common/kj.png',
      title: '我要砍价',
      desc: '淘到理想好物'
    },
    {
      url: 'groupBuyList',
      icon: '/static/image/common/tg.png',
      title: '团购专区',
      desc: '发现品质好物'
    },
    {
      url: 'discountList',
      icon: '/static/image/common/zk.png',
      title: '限时折扣',
      desc: '抢到就是赚到'
    }
  ],

  // 消息类型 1:公告;2:提醒;3:私信
  notifyTypeList: [
    {
      type: 0,
      content: ''
    },
    {
      type: 1,
      content: '公告'
    },
    {
      type: 2,
      content: '提醒'
    },
    {
      type: 3,
      content: '私信'
    }
  ],

  // 消息类型 -1:已过期;1:已使用;0:未使用
  orderProductVirtualTypeList: [
    {
      state: 0,
      text: '未使用'
    },
    {
      state: 1,
      text: '已使用'
    },
    {
      state: -1,
      text: '已过期'
    }
  ],

  // 主题色
  themeList: [
    {
      title: '官方',
      name: 'pink',
      color: '#ff3366',
      firstGradientColor: '#ff4040',
      subColor: '#ffe7a5',
      rgb: '255,51,102',
      gradientColor: 'linear-gradient(#ff4040 0%, #ff4070 100%)',
      subGradientColor: 'linear-gradient(#ffcc33 0%, #ff9d2f 100%)'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#8f14cc',
      firstGradientColor: '#7014cc',
      subColor: '#e6175c',
      rgb: '143, 20, 204',
      gradientColor: 'linear-gradient(#7014cc 1%, #8f14cc 100%)',
      subGradientColor: 'linear-gradient(#18171a 0%, #151118 100%)'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#26c059',
      firstGradientColor: '#56bf68',
      subColor: '#e53d2e',
      rgb: '38, 192, 89',
      gradientColor: 'linear-gradient(#56bf68 0%, #26bf59 100%)',
      subGradientColor: 'linear-gradient(#3d403d 0%, #212621 100%)'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#cc793d',
      firstGradientColor: '#cca164',
      subColor: '#ffe7a5',
      rgb: '204, 121, 61',
      gradientColor: 'linear-gradient(#cca164 0%, #b37447 100%)',
      subGradientColor: 'linear-gradient(#e6cfa1 0%, #e0bb87 100%)'
    },
    {
      title: '桔橙',
      name: 'orange',
      color: '#ff5319',
      firstGradientColor: '#ff8c19',
      subColor: '#ffe7a5',
      rgb: '255, 83, 25',
      gradientColor: 'linear-gradient(#ff8c19 0%, #ff5319 100%)',
      subGradientColor: 'linear-gradient(#ffdd33 0%, #ffaa33 100%)'
    },
    {
      title: '嫣红',
      name: 'red',
      color: '#e52e2e',
      firstGradientColor: '#eb2f3f',
      subColor: '#ffe7a5',
      rgb: '229, 46, 46',
      gradientColor: 'linear-gradient(#eb2f3f 0%, #e63d2e 100%)',
      subGradientColor: 'linear-gradient(#f2d649 0%, #fabb3e 100%)'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#1961f2',
      firstGradientColor: '#1861f2',
      subColor: '#ff4019',
      rgb: '25, 97, 242',
      gradientColor: 'linear-gradient(#1861f2 1%, #0ca6f2 100%)',
      subGradientColor: 'linear-gradient(#ffc44c 0%, #ffa64c 100%)'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333',
      firstGradientColor: '#262626',
      subColor: '#e65545',
      rgb: '51, 51, 51',
      gradientColor: 'linear-gradient(#262626 1%, #666561 100%)',
      subGradientColor: 'linear-gradient(#f7d54a 0%, #ffc94c 99%)'
    }
  ],

  // 消息类型
  notifyTabList: [
    { state: 0, text: '互动消息', icon: 'iconkefu2' },
    { state: 1, text: '服务通知', icon: 'icongonggao' }
  ]
};

export default mConstData;
