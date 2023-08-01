/*
 * 路由对象
 * 中心思想：需要路由鉴权,由于uni-app没有vue中的全局钩子函数，所以封装了Router对象。
 * 说明：应用中的路由跳转尽量使用该Router的方法，并配合config中的路由表对象进行跳转。
 *
 * 示例：this.$mRouter.push({route.ts:this.$mRoutesConfig.main,query:{a:1}})
 *
 */
// const mRouter =  {
//   // private callBack: (type: string, to: to) => void;x
//   push(url:string) {
//     uni.navigateTo({url});
//   },
//   basicNavTo(url:string, type = '') {
//     if (type === 'tab') {
//       this.reLaunch(url);
//     } else {
//       this.push(url);
//     }
//   },
//   redirectTo(url:string) {
//     uni.redirectTo({url});
//   },
//   reLaunch(url:string) {
//     uni.reLaunch({url});
//   },
//   switchTab(url:string) {
//     uni.switchTab({url});
//   },
//   back(delta = 1) {
//     // #ifdef H5
//     history.back();
//     // #endif
//     // #ifndef H5
//     uni.navigateBack({
//       delta
//     });
//     // #endif
//   }
// };
//
// export default mRouter;

import mRouteConfig from "@/config/routes";
import mHelper from "@/utils/helper";
import store from "@/store";

class RouterUtil {

  private callBack: (navType: string, to) => void;
  constructor() {
    this.callBack = () => {
      //
    };
  }

  beforeEach(callBack) {
    if (callBack instanceof Function) this.callBack = callBack;
  }

  checkSwitchTab(to) {
    let isSwitchTab = false;
    const tabBarList = mHelper.getTabBar();
    for (let i = 0; i < tabBarList.length; i++) {
      if (tabBarList.indexOf(to?.route?.path) >= 0) {
        isSwitchTab = true;
        break;
      }
    }
    return isSwitchTab;
  }

  push(to) {
    if (this.checkSwitchTab(to)) {
      this.reLaunch(to);
    } else {
      this.callBack("navigateTo", to);
    }
  }

  redirectTo(to) {
    if (this.checkSwitchTab(to)) {
      this.switchTab(to);
    } else {
      this.callBack("redirectTo", to);
    }
  }

  reLaunch(to) {
    this.callBack("reLaunch", to);
  }

  switchTab(to) {
    this.callBack("switchTab", to);
  }

  back(delta = 1) {
    uni.navigateBack({
      delta,
    });
  }
}

const mRouter = new RouterUtil();

//路由请求
mRouter.beforeEach((navType: string, to: AnyObject) => {
  if (to.route === undefined) {
    console.log(
      "路由钩子函数中没有找到to.route对象，路由信息:" + JSON.stringify(to)
    );
    return;
  }
  // 过滤需要权限的页面
  if (to.route.requiresAuth) {
    const hasLogin = mHelper.hasLogin();
    if (hasLogin) {
      // 已经登录
      uni[navType]({
        url: mHelper.objParseUrlAndParam(to.route.path, to.query),
        animationType: "none",
      });
    } else {
      const globalConfig = store.getters["user/getGlobalConfig"];
      uni[navType]({
        url:
          globalConfig.member_login_weight === "account"
            ? mRouteConfig.login.path
            : mRouteConfig.loginAuthorized.path,
        animationType: "none",
      });
    }
  } else {
    mHelper.navToType(
      navType,
      mHelper.objParseUrlAndParam(to.route.path, to.query)
    );
  }
});

export default mRouter;
