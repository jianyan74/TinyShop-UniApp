import mRouter from '@/utils/routerUtil';
import store from '@/store';
import mPayment from '@/utils/payment';
import mRouteConfig from '@/config/routes';
import {PlatformGroupEnum} from '@/enum/loginEnum';
import {MarketingTypeEnum} from '@/enum/marketingEnum';
import {ProductTypeEnum} from '@/enum/productEnum';
import mSiteConfig from '@/config/site';
import * as pagesJson from '@/pages.json';
import {GlobalConfig} from "@/response/config";
//常用方法集合
const mHelper = {

  /**
   *  函数节流
   * @param fn
   * @param awaitTime 节流间隔
   */
  throttle(fn, awaitTime = 2000) {
    console.log('throttle:', awaitTime)
    let startTimer = 0;
    //节流  一段时间只能执行一次 使用时间戳控制
    return (fun, ...arrAgu) => {
      if (typeof fun !== 'function') return
      const endTimer = new Date().getTime()
      if (endTimer - startTimer > awaitTime) {
        fun(...arrAgu)
        startTimer = new Date().getTime()
      }
    }
  },

  /**
   * 吐司弹窗
   * @param {string} title
   * @param {number} duration
   * @param {boolean} mask
   * @param {string} icon
   */
  toast(title: string, duration = 3000, mask = false, icon: any = 'none') {
    if (!title) return;
    uni.showToast({
      title,
      duration,
      /*  #ifndef MP-TOUTIAO || MP-ALIPAY */
      mask,
      /*  #endif  */
      icon
    });
  },
  // 复制内容
  copy(content: string) {
    this.platformGroupFilter('h5') === PlatformGroupEnum.TINYSHOP
      ? mHelper.h5Copy(content)
      : uni.setClipboardData({
        data: content,
        success: function () {
          mHelper.toast('复制成功');
        }
      });
  },
  /**
   * 开发环境全局打印日志
   * @param {Object} title
   */
  log(title: string) {
    if (process.env.NODE_ENV === 'development' && Boolean(title)) {
      console.log(JSON.stringify(title));
    }
  },
  /**
   * 返回登录页面
   */
  backToLogin() {
    // 存当前页面的地址
    const currentPage: any = getCurrentPages()[getCurrentPages().length - 1];
    const backToPage = currentPage.$page.fullPath;
    store.commit('user/setBackToPage', {backToPage});
    const globalConfig = store.getters['user/getGlobalConfig'];
    mRouter.push({
      route: globalConfig.member_login_weight === 'account' ? mRouteConfig.login : mRouteConfig.loginAuthorized
    });
  },
  // 返回上一页
  back(delta = 1) {
    this.platformGroupFilter('h5') === PlatformGroupEnum.TINYSHOP ? history.back() : mRouter.back(delta);
  },
  /**
   * style 对象转字符串
   * @param {Object} styleObj
   */
  styleObjToString(styleObj: AnyObject) {
    return Object.keys(styleObj)
      .map((key) => {
        return `${key}:${styleObj[key]};`;
      })
      .join('');
  },
  // 添加单位，如果有rpx，%，px等单位结尾或者值为auto，直接返回，否则加上rpx单位结尾
  addUnit(value = 'auto', unit = 'rpx') {
    value = String(value);
    // 用uView内置验证规则中的number判断是否为数值
    return Number(value) ? `${value}${unit}` : value;
  },
  // 去掉字符串中的空格
  trim(str) {
    if (!str) {
      return '';
    }
    return str.replace(/\s*/g, '');
  },
  // 获取主题色
  getThemeColor() {
    return store.getters['theme/getThemeColor'];
  },
  // 获取全局参数
  getGlobalConfig() {
    return store.getters['user/getGlobalConfig'] as GlobalConfig;
  },
  // 获取当前语言
  getCurrentLocale() {
    return store.getters['locale/getLocale'];
  },
  // 判断是否登录
  hasLogin() {
    return store.getters['user/hasLogin'];
  },

  // 平台判断
  // 判断是否公众号（微信H5）
  isWechat() {
    // #ifdef H5
    const ua = window.navigator.userAgent.toLowerCase();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return ua.match(/micromessenger/i) == 'micromessenger';
    // #endif;
  },
  platformGroupFilter(type = '') {
    let platformGroup = PlatformGroupEnum.TINYSHOP;
    // #ifdef H5
    if (type === 'h5') {
      platformGroup = PlatformGroupEnum.TINYSHOP;
    } else {
      platformGroup = this.isWechat() ? PlatformGroupEnum.TINYSHOPWECHATMP : PlatformGroupEnum.TINYSHOPH5;
    }
    // #endif
    // #ifdef MP-QQ
    platformGroup = PlatformGroupEnum.TINYSHOPQQMINI;
    // #endif
    // #ifdef MP-WEIXIN
    platformGroup = PlatformGroupEnum.TINYSHOPWECHATMINI;
    // #endif
    // #ifdef MP-ALIPAY
    platformGroup = PlatformGroupEnum.TINYSHOPALIMINI;
    // #endif
    // #ifdef MP-BAIDU
    platformGroup = PlatformGroupEnum.TINYSHOPBAIDUMINI;
    // #endif
    // #ifdef MP-TOUTIAO
    platformGroup = PlatformGroupEnum.TINYSHOPBYTEDANCEMINI;
    // #endif
    // #ifdef APP-PLUS
    if (type === 'app') {
      platformGroup = PlatformGroupEnum.TINYSHOPAPP;
    } else {
      platformGroup =
        uni.getSystemInfoSync().platform === 'android'
          ? PlatformGroupEnum.TINYSHOPANDROID
          : PlatformGroupEnum.TINYSHOPIOS;
    }
    // #endif
    return platformGroup.toString();
  },
  // 自定义装修通用跳转封装
  handleBasicNavTo(item) {
    const {type, id, innerLink, externalLink, appid, mpPath, route} = item;
    let query = {},
      url;
    if (type === 'mp2mp') {
      if (this.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMINI) {
        wx.navigateToMiniProgram({
          appId: appid,
          path: mpPath,
          envVersion: 'release', // 打开正式版
          fail: function (err) {
            console.log(err);
            uni.showToast({
              title: err && err.errMsg,
              icon: 'none'
            });
          }
        });
      } else {
        return;
      }
    }
    if (!type) {
      url = route;
    } else {
      switch (type) {
        case 'hot':
          url = 'product';
          query = {id};
          break;
        case 'category':
          url = 'productList';
          query = {cate_id: id};
          break;
        case 'custom':
          url = 'custom';
          query = {id};
          break;
        case 'bigWheel':
          url = 'luckyWheelActivity';
          query = {id};
          break;
        case 'externalLink':
          url = 'url';
          query = {url: externalLink};
          break;
        case 'innerLink':
          url = innerLink;
          uni.navigateTo({url});
          return;
        default:
          url = 'product';
          //id: 228-19-4009  id=228&marketingId=19&marketingProductId=4009&marketingType=type
          query = Object.assign(this.parseId(id), {marketingType: ''})
          break;
      }
    }
    if (url) {
      mRouter.push({route: mRouteConfig[url], query});
    }
  },
  parseId(id:string){
    const arr = id.split('-');
    let marketingId = '';
    let marketingProductId = '';
    if (arr[1]) {
      marketingId = arr[1];
    }
    if (arr[2]) {
      marketingProductId = arr[2];
    }

    return {
      id: arr[0],
      marketingId: marketingId,
      marketingProductId: marketingProductId
    };
  },
  /**
   * 返回上一页携带参数
   */
  prePage(index = 2) {
    const pages = getCurrentPages();
    return pages[pages.length - index];
  },
  /*
   * obj 转 params字符串参数
   * 例子：{a:1,b:2} => a=1&b=2
   */
  objParseParam(obj: any) {
    let paramsStr = '';
    if (obj instanceof Array) return paramsStr;
    if (!(obj instanceof Object)) return paramsStr;
    for (const key in obj) {
      paramsStr += `${key}=${obj[key]}&`;
    }
    return paramsStr.substring(0, paramsStr.length - 1);
  },
  /*
   * obj 转 路由地址带参数
   * 例子：{a:1,b:2} => /pages/index/index?a=1&b=2
   */
  objParseUrlAndParam(path: string, obj: AnyObject) {
    let url = path || '';
    let paramsStr = '';
    if (obj instanceof Array) return url;
    if (!(obj instanceof Object)) return url;
    paramsStr = this.objParseParam(obj);
    paramsStr && (url += '?');
    url += paramsStr;
    return url;
  },
  navToType(navType: string, url: string) {
    switch (navType) {
      case 'navigateTo':
        uni.navigateTo({url});
        break;
      case 'reLaunch':
        uni.reLaunch({url});
        break;
      case 'switchTab':
        uni.switchTab({url});
        break;
      case 'redirectTo':
        uni.redirectTo({url});
        break;
      default:
        uni.navigateTo({url});
        break;
    }
  },
  /**
   * 验证十进制数字
   */
  isNumber(value: string) {
    return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
  },
  $parent(name = undefined) {
    let parent: any = this.$parent;
    // 通过while历遍，这里主要是为了H5需要多层解析的问题
    while (parent) {
      // 父组件
      if (parent.$options && parent.$options.name !== name) {
        // 如果组件的name不相等，继续上一级寻找
        parent = parent.$parent;
      } else {
        return parent;
      }
    }
    return false;
  },
  /**
   * H5复制
   */
  h5Copy(content: string) {
    const textarea = document.createElement('textarea') as any;
    textarea.value = content;
    textarea.readOnly = 'readOnly';
    document.body.appendChild(textarea);
    textarea.select(); // 选择对象
    textarea.setSelectionRange(0, content.length); //核心
    const result = document.execCommand('Copy'); // 执行浏览器复制命令
    textarea.remove();
    const msg = result ? '复制成功' : '复制失败';
    this.toast(msg);
  },
  // h5分享
  handleWxH5Share(title: string, desc: string, link: string, imgUrl: string) {
    // #ifdef H5
    if (this.isWechat()) {
      if (uni.getSystemInfoSync().platform === 'android') {
        mPayment.wxConfigH5(link);
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      jWeixin.ready(function() {
        // eslint-disable-next-line
        // @ts-ignore
        jWeixin.updateAppMessageShareData({
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl, // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        // eslint-disable-next-line
        // @ts-ignore
        jWeixin.updateTimelineShareData({
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl, // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
      });
    }
    // #endif
  },
  /**
   * app分享
   */
  handleAppShare(shareUrl: string, shareTitle: string, shareContent: string, shareImg: string, shareMoney = 1) {
    const shareData = {
      shareUrl,
      shareTitle,
      shareContent,
      shareImg
    };
    this.log(JSON.stringify(shareData));
    // appShare(shareData, shareMoney, res => {});
  },
  keepTwoDecimal(value: number | string) {
    return parseFloat(String(value)).toFixed(2);
  },

  getSafeAreaHeight() {
    let obj: any = {},
      height = 0;
    // #ifdef MP-WEIXIN || MP-TOUTIAO
    // eslint-disable-next-line
    obj = wx.getMenuButtonBoundingClientRect();
    // #endif
    uni.getSystemInfo({
      success: (res: any) => {
        height = obj.top ? obj.top + (obj.height - 30) / 2 : res.statusBarHeight + 7;
      }
    });
    return height;
  },
  navToProduct(id, marketingType = '', marketingId = '', marketingProductId = '') {
    let route;
    const query = {
      id,
      marketingType: Number(marketingType) !== 0 ? marketingType : '',
      marketingId: Number(marketingId) ? marketingId : '',
      marketingProductId: Number(marketingProductId) ? marketingProductId : ''
    } as any;
    switch (marketingType) {
      default:
        route = mRouteConfig.product;
        break;
    }

    mRouter.push({route, query});
  },
  // 扫一扫
  scanCode() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    if (this.platformGroupFilter() === PlatformGroupEnum.TINYSHOP) {
      if (this.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMP) {
        // eslint-disable-next-line
        // @ts-ignore
        jWeixin.ready(() => {
          // eslint-disable-next-line
          // @ts-ignore
          jWeixin.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            success(res) {
              if (res.resultStr.indexOf('http') !== -1) {
                if (res.resultStr.indexOf(mSiteConfig.hostURL) !== -1) {
                  mRouter.reLaunch({
                    route: res.resultStr.substring(mSiteConfig.hostURL.length)
                  });
                } else {
                  that.toast('不能识别该二维码');
                }
              } else {
                that.toast(res.resultStr);
                // _this.$http
                //   .post(productVirtualVerificationVerify, {
                //     code: res.resultStr,
                //   })
                //   .then(() => {
                //     _this.toast("核销成功");
                //   });
              }
            },
            fail(res) {
              // 支付成功后的回调函数
              that.toast('扫描失败：' + res.errMsg);
            }
          });
        });
      } else {
        mHelper.toast('请在微信H5进行相关操作');
      }
    } else {
      uni.scanCode({
        success: function (res) {
          if (res.result.indexOf('http') !== -1) {
            if (res.result.indexOf(mSiteConfig.hostURL) !== -1) {
              mRouter.reLaunch({
                route: res.result.substring(mSiteConfig.hostURL.length)
              });
            } else {
              mHelper.toast('不能识别该二维码');
            }
          } else {
            that.toast(res.result);
            // _this.$http
            //   .post(productVirtualVerificationVerify, { code: res.result })
            //   .then(() => {
            //     _this.toast("核销成功");
            //   });
          }
        },
        fail(res) {
          // 支付成功后的回调函数
          that.toast('扫描失败：' + res.errMsg);
        }
      });
    }
  },
  // 获取顶部bar高度
  getCustomBarHeight() {
    const e = uni.getSystemInfoSync();
    let customBar;
    console.log(this.platformGroupFilter());
    if (this.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMINI) {
      const custom = wx.getMenuButtonBoundingClientRect();
      console.log(custom);
      console.log(e);
      customBar = Number(custom.bottom) + Number(custom.top) - Number(e.statusBarHeight);
    } else if (this.platformGroupFilter() === PlatformGroupEnum.TINYSHOPALIMINI) {
      customBar = Number(e.statusBarHeight) + Number(e.titleBarHeight);
    } else {
      if (e.platform == 'android') {
        customBar = Number(e.statusBarHeight) + 50;
      } else {
        customBar = Number(e.statusBarHeight) + 45;
      }
    }
    return customBar;
  },
  // 时间格式化(几分钟前)
  getTimeAgo(time) {
    const data = new Date(time);
    const dateTimeStamp = data.getTime();
    const minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = month * 12;
    const now = new Date().getTime(); //获取当前时间毫秒
    const diffValue = now - dateTimeStamp; //时间差

    let result = '';
    console.log(diffValue);
    if (diffValue < 0) {
      result = '' + '未来';
    }
    const minC = diffValue / minute; //计算时间差的分，时，天，周，月
    const hourC = diffValue / hour;
    const dayC = diffValue / day;
    const weekC = diffValue / week;
    const monthC = diffValue / month;
    const yearC = diffValue / year;

    if (yearC >= 1) {
      result = ' ' + parseInt(String(yearC)) + '年前';
    } else if (monthC >= 1 && monthC < 12) {
      result = ' ' + parseInt(String(monthC)) + '月前';
    } else if (weekC >= 1 && weekC < 5 && dayC > 6 && monthC < 1) {
      result = ' ' + parseInt(String(weekC)) + '周前';
    } else if (dayC >= 1 && dayC <= 6) {
      result = ' ' + parseInt(String(dayC)) + '天前';
    } else if (hourC >= 1 && hourC <= 23) {
      result = ' ' + parseInt(String(hourC)) + '小时前';
    } else if (minC >= 1 && minC <= 59) {
      result = ' ' + parseInt(String(minC)) + '分钟前';
    } else if (diffValue >= -1000 && diffValue <= minute) {
      result = '刚刚';
    }

    return result;
  },
  // 虚拟商品
  isVirtualProduct(type) {
    let flag = false;
    if (type === ProductTypeEnum.VIRTUAL || type === ProductTypeEnum.CARD_VOLUME) {
      flag = true;
    }

    return flag;
  },
  // 判断是否底部菜单
  isBottomNav(path) {
    const bottomNavConfig = store.getters['user/getBottomNav'];
    console.log('isBottomNav', bottomNavConfig?.items, path, JSON.stringify(bottomNavConfig?.items || {}).indexOf(path) === -1);
    return JSON.stringify(bottomNavConfig?.items || {}).indexOf(path) === -1;
  },
  marketingTypeTextFilter(marketingType = '') {
    let tit;
    switch (marketingType) {
      case MarketingTypeEnum.BARGAIN:
        tit = '砍价商品';
        break;
      case MarketingTypeEnum.DISCOUNT:
        tit = '折扣商品';
        break;
      case MarketingTypeEnum.SEC_KILL:
        tit = '秒杀商品';
        break;
      case MarketingTypeEnum.GROUP_BUY:
        tit = '团购商品';
        break;
      case MarketingTypeEnum.SECOND_HALF_DISCOUNT:
        tit = '第2件半价';
        break;
      case MarketingTypeEnum.BALE:
        tit = '打包一口价';
        break;
      case MarketingTypeEnum.PRE_SELL:
        tit = '预售商品';
        break;
      case MarketingTypeEnum.COMBINATION:
        tit = '组合套餐';
        break;
      case MarketingTypeEnum.FULL_GIVE:
        tit = '满减送';
        break;
      case MarketingTypeEnum.MEMBER_DISCOUNT:
        tit = '会员折扣';
        break;
      case MarketingTypeEnum.WHOLESALE:
        tit = '拼团商品';
        break;
      default:
        tit = '立即购买';
        break;
    }
    return tit;
  },

  getTabBar() {
    const list = pagesJson.tabBar.list;
    // 重新组合
    const arr: Array<string> = [];
    list.forEach((i) => {
      arr.push('/'+i.pagePath);
    })
    return arr;
  },
  //判断头部高度
  getNavTop() {
    // #ifndef H5 || APP-PLUS
    const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
    return menuButtonInfo.top - (44-menuButtonInfo.height)/2
    // #endif
    // eslint-disable-next-line no-unreachable
    return 0;
  }
};
export default mHelper;
