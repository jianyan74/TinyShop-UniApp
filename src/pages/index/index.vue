<template>
  <view class="rf-home pb-safe">
    <rf-home-normal
      :refresh="state.isRefresh"
      :padding-top="topHeight"
      @loading="handleLoadingClose"
      @refresh-end="handleRefreshEnd"
    />
    <!--页面加载动画-->
    <rf-loading :active="state.loading" :is-full-screen="isFullScreen" />
    <rf-site-open v-if="parseInt(globalConfig.site_status) === 0" />
    <rf-back-top :scroll-top="state.scrollTop" />
    <!--浮动按钮-->
    <!--    <rf-quick-menu />-->
    <rf-popup-ad v-if="state.popupAdv?.cover || state.coupons?.total > 0" :ad-info="state.popupAdv" :ad-coupons="state.coupons" />
  </view>
</template>
<script lang="ts" setup>
import mHelper from '@/utils/helper';
import {computed, reactive, ref} from 'vue';
import store from '@/store';
import {
  onLaunch,
  onLoad,
  onPageScroll,
  onPullDownRefresh,
  onReachBottom,
  onShareAppMessage,
  onShareTimeline
} from '@dcloudio/uni-app';
import {Profile} from '@/response/profile';
import {PopupAdv, Share} from '@/response';
import mRouteConfig from '@/config/routes';
import {PlatformGroupEnum} from '@/enum/loginEnum';

// 获取全局配置
const globalConfig = computed(() => {
  return store.getters['user/getGlobalConfig'];
});

const isFullScreen = computed(() => {
  return mHelper.isBottomNav('index');
});

const statusBar = computed(() => {
  const e = uni.getSystemInfoSync();
  return Number(e.statusBarHeight);
});

const subParams = reactive({
  subShow: false,
  subType: 'normalOrder'
})

//调用子组件方法 用于页面翻页
import rfDecorate from '@/components/rf-decorate/rf-decorate.vue'
const decorateRef = ref<InstanceType<typeof rfDecorate> | null>(null)
onReachBottom(() => {
  decorateRef.value?.getIndexCateProductList()
})
// 下拉刷新
onPullDownRefresh(() => {
  state.isRefresh = true;
  state.loading = true;
  decorateRef.value?.refreshIndexCateProductList()
});


// 顶部间距判断
const topHeight = computed(() => {
  const platformGroup = mHelper.platformGroupFilter();
  // 微信小程序
  if (platformGroup === PlatformGroupEnum.TINYSHOPWECHATMINI) {
    // 分类Tab
    if (globalConfig.value.index_cate) {
      return 246 + statusBar.value;
    } else {
      return 150 + statusBar.value;
    }
  } else { // 默认H5
    // 分类Tab
    if (globalConfig.value.index_cate) {
      return 210;
    } else {
      return 110;
    }
  }
});

// 变量
let state = reactive({
  popupAdv: {} as PopupAdv,
  coupons: [],
  share: {} as Share,
  userInfo: {} as Profile,
  loading: true,
  scrollTop: 0,
  isAppVersionCheckShow: uni.getStorageSync('isLaunch'),
  isRefresh: false
});

// onLoad
onLoad(() => {
  // 隐藏原生导航栏 使用自定义底部导航
  state.userInfo = store.getters['user/getUserInfo'];
  // uni.setNavigationBarTitle({ title: globalConfig.value.app_name || "", });
});
// 滚动页面
onPageScroll((e) => {
  state.scrollTop = e.scrollTop;
});
// 分享朋友圈
onShareTimeline(() => {
  return {
    title: state.share.share_title || `欢迎来到${globalConfig.value.app_name}`,
    path: `${mRouteConfig.index.path}?promoter_code=${state.userInfo?.member.promoter_code}`
  };
});
// 分享好友
onShareAppMessage(() => {
  return {
    title: state.share.share_title || `欢迎来到${globalConfig.value.app_name}`,
    path: `${mRouteConfig.index.path}?promoter_code=${state.userInfo?.member.promoter_code}`
  };
});
// 监听数据加载完毕
const handleLoadingClose = (data: AnyObject) => {
  console.log(data);
  state.loading = false;
  state.popupAdv = data?.popupAdv;
  state.coupons = data?.coupons;
  state.share = data?.share;
};
// 停止下拉拉动画
const handleRefreshEnd = () => {
  console.log('handleRefreshEnd');
  uni.stopPullDownRefresh();
  state.isRefresh = false;
};
</script>
<style lang="scss">
.rf-home {
  background-color: $page-color-base;
  min-height: 100vh;
}
</style>
