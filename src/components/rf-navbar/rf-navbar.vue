<template>
  <view
    class="rf-navbar" :style="{
      position: fixed ? 'fixed' : 'static',
      zIndex: 1,
    }">
    <uni-nav-bar
      :background-color="backgroundColor"
      :border="border"
      :color="color"
      :dark="dark"
      :fixed="fixed"
      :height="height"
      :left-icon="leftIcon"
      :left-text="leftText"
      :left-width="leftWidth"
      :right-icon="rightIcon"
      :right-text="rightText"
      :right-width="navRightWidth"
      :shadow="shadow"
      :stat="stat"
      :status-bar="statusBar"
      :title="title"
    >
      <template #left>
        <view class="icon-box ss-flex" :class="fixed ? 'left-fixed' :''">
          <view class="icon-button icon-button-left ss-flex ss-row-center" @tap="onClickLeft">
            <text v-if="hasHistory" class="iconfont iconzuo" />
            <text v-else class="iconfont iconzhuyedefuben" />
          </view>
          <view class="line" />
          <view class="icon-button icon-button-right ss-flex ss-row-center" @tap="openPopup">
            <text class="iconfont iconfenlei3" />
          </view>
        </view>
      </template>
      <view v-if="navType === 'search'" class="search-page">
        <view class="input-view">
          <uni-icons class="input-uni-icon" color="#999" size="18" type="search" />
          <input
            v-if="searchType === 'jump'"
            class="nav-bar-input" confirm-type="search"
            :placeholder="searchPlaceholder" type="text"
            @tap.stop="jumpSearch">
          <input
            v-else
            class="nav-bar-input" confirm-type="search"
            :placeholder="searchPlaceholder" type="text"
            @confirm="toSearch($event)">
        </view>
      </view>
      <view v-else class="nav-title">
        {{ title }}
      </view>
    </uni-nav-bar>
  </view>
  <!--快捷菜单弹窗-->
  <uni-popup ref="popup" type="top" :style="{top: 0,}">
    <view class="popup-content" :style="{paddingTop: navPaddingTop+'px'}">
      <view class="popup-title">
        快捷菜单
      </view>
      <view class="popup-menus">
        <view v-for="(item, index) in menus" :key="index" class="menu" @tap="jumpMenu(item.url, item.query)">
          <text :class="[item.icon]" class="iconfont icon" />
          <text class="txt">{{ item.text }}</text>
        </view>
      </view>
    </view>
  </uni-popup>
</template>
<script setup>
import mRouter from "@/utils/routerUtil";
import mRouteConfig from "@/config/routes";
import mConstData from "@/config/constData";
import {computed, ref} from "vue";

const emits = defineEmits(['clickLeft', 'toSearch']);
const props = defineProps({
  searchPlaceholder: {
    type: String,
    default: '请输入关键字'
  },
  navType: {
    type: String,
    default: 'jump' //search | title
  },
  searchType: {
    type: String,
    default: 'jump' //jump | current
  },
  dark: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ""
  },
  leftText: {
    type: String,
    default: ""
  },
  rightText: {
    type: String,
    default: ""
  },
  leftIcon: {
    type: String,
    default: ""
  },
  rightIcon: {
    type: String,
    default: ""
  },
  fixed: {
    type: [Boolean, String],
    default: false
  },
  color: {
    type: String,
    default: ""
  },
  backgroundColor: {
    type: String,
    default: ""
  },
  statusBar: {
    type: [Boolean, String],
    default: false
  },
  shadow: {
    type: [Boolean, String],
    default: false
  },
  border: {
    type: [Boolean, String],
    default: true
  },
  height: {
    type: [Number, String],
    default: 44
  },
  leftWidth: {
    type: [Number, String],
    default: 80
  },
  rightWidth: {
    type: [Number, String],
    default: 0
  },
  stat: {
    type: [Boolean, String],
    default: ''
  },
  searchText: {
    type: String,
    default: ''
  }
})
//计算小程序胶囊菜单位置
const navPaddingTop = computed(() => {
  // #ifndef H5 || APP-PLUS
  let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
  return menuButtonInfo.top - (44-menuButtonInfo.height)/2
  // #endif
  // eslint-disable-next-line no-unreachable
  return 0;
})
//搜索框避开胶囊
const navRightWidth = computed(() => {
  // #ifndef H5 || APP-PLUS
  let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
  return menuButtonInfo.width
  // #endif
  // eslint-disable-next-line no-unreachable
  return props.rightWidth;
})

//弹窗
const popup = ref(null);
const openPopup = () => {
  popup.value?.open()
}
const menus = mConstData.menuTop;
//菜单跳转
const jumpMenu = (url, query = {}) => {
  mRouter.push({route: mRouteConfig[url], params: query})
}
// 检测是否有浏览器历史
const checkHistory = () => {
  // eslint-disable-next-line no-undef
  const pages = getCurrentPages()
  return pages.length > 1;
}
const back = () => {
  // #ifdef H5
  history.back();
  // #endif

  // #ifndef H5
  uni.navigateBack();
  // #endif
}
//是否有历史页面
const hasHistory = checkHistory();

function onClickLeft() {
  if (hasHistory) {
    back();
  } else {
    mRouter.push({route: {name: '首页', path: '/pages/index/index'}});
  }
  emits('clickLeft');
}

// 跳转至搜索详情页
const jumpSearch = () => {
  //跳转搜索页
  mRouter.push({route: mRouteConfig.productSearch, params: {data: JSON.stringify(props.searchText || '{}')}});
}
const toSearch = (e) => {
  emits('toSearch', e.detail);
}
</script>
<style lang="scss" scoped>
$nav-height: 30px;
.icon-box {
  background: #ffffff;
  box-shadow: 0 0 4rpx rgba(51, 51, 51, 0.08), 0 4rpx 6rpx 2rpx rgba(102, 102, 102, 0.12);
  border-radius: 30rpx;
  width: 134rpx;
  height: 56rpx;
  margin-left: 8rpx;

  .line {
    width: 2rpx;
    height: 24rpx;
    background: #e5e5e7;
  }

  .sicon-back {
    font-size: 32rpx;
    color: #000;
  }

  .sicon-home {
    font-size: 32rpx;
    color: #000;
  }

  .sicon-more {
    font-size: 32rpx;
    color: #000;
  }

  .icon-button {
    width: 67rpx;
    height: 56rpx;

    &-left:hover {
      background: rgba(0, 0, 0, 0.16);
      border-radius: 30rpx 0 0 30rpx;
    }

    &-right:hover {
      background: rgba(0, 0, 0, 0.16);
      border-radius: 0 30rpx 30rpx 0;
    }
  }
}

.ss-flex {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.ss-row-center {
  justify-content: center;
}

.nav-title {
  width: 100%;
  line-height: $nav-height;
  text-align: center;
  padding-top: 7px;
}

//搜索页跳转
.search-page {
  width: 100%;

  .input-view {
    /* #ifndef APP-PLUS-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
    // width: 500rpx;
    flex: 1;
    background-color: #f8f8f8;
    height: $nav-height;
    border-radius: 15px;
    padding: 0 15px;
    flex-wrap: nowrap;
    margin: 7px 0;
  }

  .input-uni-icon {
    line-height: $nav-height;
  }

  .nav-bar-input {
    width: 100%;
    height: $nav-height;
    line-height: $nav-height;
    padding: 0 5px;
    font-size: 12px;
    background-color: #f8f8f8;
  }
}

.city {
  /* #ifndef APP-PLUS-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  // width: 160rpx;
  margin-left: 4px;
}

.popup-content {
  width: 100%;
  padding-bottom: 30rpx;
  border-radius: 0 0 15rpx 15rpx;
  background: rgba(255, 255, 255, 0.8);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);

  .popup-title {
    padding: 30rpx;
    font-size: 36rpx;
    font-weight: bold;
  }

  .popup-menus {
    width: 90%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    .menu {
      width: 25%;
      margin-bottom: 30rpx;
      height: 150rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .icon {
        font-size: 54rpx;
        background-color: #FFFFFF;
        width: 100rpx;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        border-radius: 50rpx;
      }

      .txt {
        font-size: 28rpx;
        padding-top: 10rpx;
      }
    }
  }
}

.popup-menus::after {
  content: '';
  flex: auto;
}

.left-fixed {
  background: rgba(255, 255, 255, 0.3);
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
}
</style>
