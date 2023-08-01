<script setup lang="ts">
import store from '@/store';
import { onLaunch } from '@dcloudio/uni-app';
import commonApi from '@/api/tinyShop/common';
import siteApi from '@/api/tinyShop/site';
import mPayment from '@/utils/payment';
import mHelper from '@/utils/helper';
import { PlatformGroupEnum } from '@/enum/loginEnum';
import memberApi from '@/api/tinyShop/member';
import { computed } from 'vue';
import mConstData from '@/config/constData';
import * as ConfigHandlers from '@/response/config';

// 是否登录
let hasLogin = computed(() => {
  return store.getters['user/hasLogin'];
});

onLaunch(() => {
  // 隐藏原生导航栏 使用自定义底部导航
  initData();
});
// 初始化数据
const initData = () => {
  uni.setStorageSync('isLaunch', true);
  if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMP) mPayment.wxConfigH5(window.location.href);
  initConfigList();
  if (!hasLogin.value) return;
  handleAccessTokenVerify().then(() => {
    initNotifyNum();
  });
};

// 设置未读消息个
const initNotifyNum = async () => {
  try {
    const data = (await memberApi.getNotifyUnReadCount()) as AnyObject;
    store.commit('notify/setNotifyNum', { notifyNum: data.count });
  } catch (e) {
    //
  }
};

// 初始化通用配置;
const initConfigList = async () => {
  const platFrom = mHelper.platformGroupFilter();
  try {
    const configList = (await commonApi.getGlobalConfig({from: platFrom})) as unknown as ConfigHandlers.CommonConfig;
    await store.dispatch('user/setConfigList', { configList: configList });
    if (!configList?.config?.style_user_is_open) {
      mConstData.themeList.forEach((item) => {
        if (item.name === configList?.config?.style_type) {
          store.commit('theme/setThemeColor', item);
        }
      });
    }
  } catch (e) {
    // 捕获异常
  }
};

// 初始化通用配置;
const handleAccessTokenVerify = async () => {
  const token = store.getters['user/getAccessToken'];
  if (!token) return;
  try {
    await siteApi.handleVerifyAccessToken({ token });
  } catch (e) {
    // 捕获异常
  }
};
</script>
<style lang="scss">
// 通用样式
@import './static/css/uni.scss';
// 主题样式
@import './static/css/theme.scss';
// 导入阿里巴巴矢量图标库
@import './static/css/iconfont.css';
</style>

<style scoped>
/deep/ .uni-progress-bar {
  border-radius: 12px !important;
}
/deep/ .uni-progress-inner-bar {
  border-radius: 12px !important;
}
/deep/.uni-scroll-view::-webkit-scrollbar {
  /* 隐藏滚动条，但依旧具备可以滚动的功能 */
  display: none;
}
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}
/* #ifdef MP-WEIXIN */

page {
  background: #212121;
}

/* #endif */
</style>
