<template>
  <view
    :style="{
      background: bgColorComputed,
      paddingTop: inputTop + 'px',
      backdropFilter: Number(configList.index_decoration) === 1 ? 'saturate(110%) blur(2px)' : 'blur(0)'
    }"
    class="rf-search-bar"
  >
    <!-- 顶部搜索栏 -->
    <view v-if="mHelper.platformGroupFilter() !== PlatformGroupEnum.TINYSHOPWECHATMINI" class="text-white">
      <view
        v-if="headerInfo?.isShowHeader === 'merchant'"
        class="merchant"
        @tap="navTo(mRouteConfig.locationMerchant)"
      >
        <text class="iconfont iconshouhuodizhi" />
        <text class="title">{{ merchantData.title || "选择商户" }}</text>
        <text class="iconfont iconxiajiantou1" />
      </view>
      <view v-else-if="headerInfo?.isShowHeader === 'title'" class="merchant">
        <text
          :style="{ color: headerInfo?.color || '#333' }"
          class="header-title"
        >{{ headerInfo.title || configList.app_name || "商城" }}
        </text>
      </view>
    </view>
    <view
      :style="{
        width: width + 'px',
      }"
      class="header"
    >
      <!-- 搜索框 -->
      <view class="input-box" @tap="toSearch">
        <input disabled>
        <view class="wrapper">
          <text class="iconfont iconsousuo2" />
          <text class="keyword in1line">{{ placeholder }}</text>
        </view>
      </view>
    </view>
    <scroll-view
      v-if="configList.index_cate && categoryList.length > 0"
      class="index-cate"
      scroll-x
    >
      <view
        v-for="(item, index) in categoryList"
        :key="index"
        class="index-cate-item"
        @tap.stop="tabClick(index, item.id)"
      >
        <text :class="tabCurrentIndex === index ? 'active' : ''">{{
          item.title
        }}
        </text>
        <text :class="tabCurrentIndex === index ? 'integral-active' : ''" />
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
// #ifdef H5
// import jWeixin from "@/common/jWeixin";
// #endif
import {computed, onMounted, PropType, ref,} from "vue";
import mHelper from "@/utils/helper";
import mRouteConfig from "@/config/routes";
import mRouter from "@/utils/routerUtil";
import {Route,} from "@/response/route";
import {PlatformGroupEnum,} from "@/enum/loginEnum";
import mSiteConfig from "@/config/site";
import orderApi from "@/api/tinyShop/order";
import {onPageScroll} from "@dcloudio/uni-app";

const configList = mHelper.getGlobalConfig(); // 通用配置
const themeColor = mHelper.getThemeColor(); // 主题颜色

interface TitlePropsInterface {
  title: string;
  bgColor: string
  lrMargin: number;
  lrPadding: number;
  headerBgType: string;
  headerStyle: string;
  headerBgColor: string;
  cover: string;
  color: string;
  coverStyle: string;
  isShowHeader: string;

  [key: string]: any;
}

const props = defineProps({
  merchantData: {
    type: Object,
    default() {
      return {};
    },
  },
  headerInfo: {
    type: Object as PropType<TitlePropsInterface>,
    default() {
      return {};
    },
  },
  globalStyle: {
    type: Object,
    default() {
      return {};
    },
  },
  categoryList: {
    type: Array,
    default() {
      return [];
    },
  },
  inputDisabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "请输入关键字",
  },
  title: {
    type: String,
    default: null,
  },
});

const searchValue = props.placeholder;
const width = ref(0);
const inputTop = ref(0);
const tabCurrentIndex = ref(0);

//透明度
const bgOpacity = Number(configList.index_decoration) === 1 ? ref(0) : ref(1);

//监听页面滑动 修改头部高斯模糊状态 背景图向上(Y轴负方向)滚动
onPageScroll((e) => {
	//如果是装修主页
	if (Number(configList.index_decoration) === 1){
    //100为界限 按比例设置透明度
    if (e.scrollTop === 0) {
      bgOpacity.value = 0;
    } else {
      bgOpacity.value = e.scrollTop <= 100 ? Number((e.scrollTop / 100).toFixed(2)) : 1;
    }
	}
})

//头部背景计算属性
const bgColorComputed = computed(() => {
  switch (true) {
    //图片
    case props.headerInfo?.headerBgType === 'pic':
      //头部
      if (props.headerInfo?.coverStyle === 'head') {
        //图片链接
        return 'url(' + props.headerInfo.cover + ')'
      }
      //整体
      if (props.headerInfo?.coverStyle === 'whole') {
        //半透明
        return `rgb(${themeColor.rgb}, ${bgOpacity.value})`;
      }
      return '';
    //自选 颜色
    case props.headerInfo?.headerBgType === 'color':

      return props.headerInfo.headerBgColor;
    //主题色
    case props.headerInfo?.headerBgType === 'theme':

      return themeColor.color;
  }
  return themeColor.color;
})


const emit = defineEmits(["search", "tab",]);
onMounted(() => {
  let obj = {} as any;
  // #ifdef MP-WEIXIN
  // eslint-disable-next-line
  obj = wx.getMenuButtonBoundingClientRect();
  // #endif
  uni.getSystemInfo({
    success: (res: any) => {
      width.value = obj.left || res.windowWidth;
      inputTop.value = obj.top
        ? obj.top + (obj.height - 40) / 2
        : res.statusBarHeight + 7;
    },
  });
});
const tabClick = (index: number, id: string) => {
  tabCurrentIndex.value = index;
  emit("tab", id);
};
// 获取定位信息
const navTo = (route: Route, query = {}) => {
  mRouter.push({route, query,});
};
const toSearch = async () => {
  await emit("search", {
    searchValue: searchValue,
  });
};
</script>

<style lang="scss" scoped>

.rf-search-bar {
  position: fixed;
  width: 100vw;
  top: 0;
  left: 0;
  z-index: 2;
  background-size: 100% 100% !important;
  //height: 50vw;
  ///*  #ifndef H5  */
  //height: 75vw;
  ///*  #endif */
  //border-radius: 0 0 50% 50%;

  .merchant {
    position: relative;
    line-height: 1;
    width: 100%;
    display: flex;
    align-items: center;
    z-index: 12;
    font-weight: 500;
    font-size: $font-lg;
    padding: $spacing-sm $spacing-lg 14rpx;
    // #ifdef MP
    padding-bottom: 24rpx;
    // #endif
    .iconshouhuodizhi {
      font-size: 40rpx;
      font-weight: 600;
      margin-right: $spacing-sm;
    }

    .iconxiajiantou1 {
      margin-left: 4rpx;
      font-size: $font-base;
    }

    .header-title {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 12;
    padding-bottom: 10rpx;

    .input-box {
      height: 60rpx;
      width: 90%;
      line-height: 60rpx;
      background-color: $color-white;
      border-radius: 30rpx;
      position: relative;
      display: flex;
      align-items: center;
      border: 1rpx solid rgba(0, 0, 0, 0.25);
      margin: 6rpx auto 0;

      .wrapper {
        display: flex;
        align-items: center;
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: $font-sm + 2rpx;
        color: $font-color-light;
        transform: translate(-50%, -50%);

        .iconsousuo2 {
          font-size: 34rpx;
          margin-right: $spacing-base;
        }
      }

      input {
        width: 100%;
        padding-left: 28rpx;
        height: 28rpx;
        color: #888;
        font-size: 28rpx;
      }
    }
  }
}
</style>
