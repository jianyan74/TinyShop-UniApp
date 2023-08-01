<template>
  <view class="rf-location-city">
    <scroll-view class="scrollList" scroll-y :scroll-into-view="state.scrollViewId" :style="{height:state.winHeight+'px'}">
      <view class="search-bar">
        <view class="search-bar-form">
          <view class="search-bar-box">
            <input class="search-bar-input" placeholder="输入城市名称或首字母查询" :value="state.inputVal" :focus="state.inputShowed" @input="inputTyping">
            <view v-if="state.inputVal" class="icon-clear" @tap="clearInput" />
          </view>
          <label v-if="!state.inputShowed" class="search-bar-label" @tap="showInput">
            <view class="search-bar-text">
              输入城市名称或首字母查询
            </view>
          </label>
        </view>
      </view>
      <view v-if="state.inputShowed" class="tui-list search-result">
        <view v-for="(item,index) in state.searchResult" :key="index" class="tui-list-cell" :data-name="item" @tap="selectCity">
          <view class="tui-list-cell-navigate">
            {{ item }}
          </view>
        </view>
      </view>
      <view v-if="!state.inputVal">
        <view class="current-city">
          <view class="title">
            定位城市
          </view>
          <view class="city-name">
            {{ state.localCity }}
          </view>
        </view>
        <view class="hot-city">
          <view class="title">
            热门城市
          </view>
          <view class="city-names">
            <view
              v-for="item in state.hotCity" :key="item"
              class="city-name-item" hover-class="tap-city"
              :hover-stay-time="150"
              :data-name="item" @tap="selectCity">
              {{ item }}
            </view>
          </view>
        </view>
        <view class="tui-list city-list">
          <block v-for="(list,index) in state.lists" :key="list.letter">
            <block v-if="list.data[0]">
              <view :id="index === 0 ? 'suoyin' : list.letter" class="tui-list-cell-divider">
                {{ list.letter }}
              </view>
              <view
                v-for="item in list.data" :key="item.cityName"
                class="tui-list-cell"
                hover-class="tui-list-cell-hover"
                :data-name="item.cityName" :hover-stay-time="150"
                @tap="selectCity">
                <view class="tui-list-cell-navigate" :class="[list.data.length-1==index?'last':'']">
                  {{ item.cityName }}
                </view>
              </view>
            </block>
          </block>
        </view>
      </view>
    </scroll-view>
    <view
      v-if="!state.inputVal" class="tui-indexed-list-bar"
      :style="{height:state.indexBarHeight+'px'}"
      @touchstart="touchStart"
      @touchmove.stop="touchMove" @touchend.stop="touchEnd"
      @touchcancel.stop="touchCancel">
      <text
        v-for="(items,index) in state.lists" :key="items.letter"
        class="tui-indexed-list-text"
        :style="{height:state.indexBarItemHeight+'px'}">
        {{ index===0?'索引':items.letter }}
      </text>
    </view>
    <view v-if="state.touchmove && lists[state.touchmoveIndex].letter" class="tui-indexed-list-alert">
      {{ state.lists[state.touchmoveIndex].letter }}
    </view>
  </view>
</template>
<script setup lang="ts">
import {reactive,} from "vue";
import cityList from "@/config/city";
import {onLoad,} from "@dcloudio/uni-app";
import mHelper from "@/utils/helper";
import mRouter from "@/utils/routerUtil";

const cityData:AnyObject[] = cityList;

let state = reactive({
  lists: [] as AnyObject[],
  touchmove: false, // 是否在索引表上滑动
  touchmoveIndex: -1,
  titleHeight: 0, // 索引二字距离窗口顶部的高度
  indexBarHeight: 0, // 索引表高度
  indexBarItemHeight: 0, // 索引表子项的高度
  scrollViewId: "", // scroll-view滚动到的子元素的id
  winHeight: 0,
  inputShowed: false, // 输入框是否显示
  inputVal: "", // 搜索框输入的内容
  hotCity: ["北京", "上海", "广州", "深圳", "杭州", "长沙", "武汉", "厦门", "西安", "昆明", "成都", "重庆",], // 热门城市
  searchResult: [] as AnyObject[], // 搜索城市的结果
  localCity: "",
});

onLoad((options) => {
  state.localCity = options.currentCity || "杭州";
  setTimeout(() => {
    uni.getSystemInfo({
      success: function(res) {
        let winHeight = res.windowHeight;
        let barHeight = winHeight - uni.upx2px(204);
        state.winHeight = winHeight;
        state.indexBarHeight = barHeight;
        state.indexBarItemHeight = barHeight / 25;
        state.titleHeight = uni.upx2px(132);
        state.lists = cityData;
      },
    });
  }, 50);
});
const showInput = () => {
  state.inputShowed = true;
};
const clearInput = () => {
  state.inputVal = "";
  state.inputShowed = false;
  state.searchResult = [];
  uni.hideKeyboard(); // 强行隐藏键盘
};
const inputTyping = (e) => {
  state.inputVal = e.detail.value;
  searchCity();
};
// 搜索城市
const searchCity = () => {
  let result:AnyObject[] = [];
  cityData.forEach((item1) => {
    item1.data.forEach((item2) => {
      if (item2.keyword.indexOf(state.inputVal.toLocaleUpperCase()) !== -1) {
        result.push(item2.cityName);
      }
    });
  });
  state.searchResult = result;
};
// 选择城市
const selectCity = (e) => {
  // 返回并刷新上一页面
  mHelper.prePage().cityName = e.currentTarget.dataset.name;
  mRouter.back();
};
const touchStart = (e) => {
  state.touchmove = true;
  let pageY = e.touches[0].pageY;
  let index = Math.floor((pageY - state.titleHeight) / state.indexBarItemHeight);
  let item = state.lists[index === 0 ? 1 : index];
  if (item) {
    state.scrollViewId = item.letter;
    state.touchmoveIndex = index;
  }
};
const touchMove = (e) => {
  let pageY = e.touches[0].pageY;
  let index = Math.floor((pageY - state.titleHeight) / state.indexBarItemHeight);
  let item = state.lists[index === 0 ? 1 : index];
  if (item) {
    state.scrollViewId = item.letter;
    state.touchmoveIndex = index;
  }
};
const touchEnd = () => {
  state.touchmove = false;
  state.touchmoveIndex = -1;
};
const touchCancel = () => {
  state.touchmove = false;
  state.touchmoveIndex = -1;
};
</script>
<style lang="scss">
.rf-location-city {
  height: 100%;
  overflow: hidden;
  .scrollList {
    flex: 1;
  }
  .search-bar {
    display: flex;
    align-items: center;
    position: relative;
    padding: 27rpx 30rpx 35rpx;
    background-color: #fff;
  }
  .search-bar-form {
    flex: 1;
    position: relative;
    border-radius: 32rpx;
    background: #f2f5f7;
  }
  .search-bar-box {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 20rpx;
    padding-right: 20rpx;
    height: 64rpx;
    z-index: 1;
  }
  .search-bar-input {
    line-height: normal;
    width: 100%;
    padding-left: 20rpx;
    font-size: 30rpx;
    color: #333;
  }
  .icon-clear {
    height: 38rpx;
  }
  .search-bar-label {
    height: 64rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    border-radius: 32rpx;
    color: #ccc;
    background: #f2f5f7;
  }
  .search-bar-text {
    font-size: 30rpx;
    line-height: 32rpx;
  }
  .search-result::before {
    display: none;
  }
  .search-result::after {
    display: none;
  }
  .tui-list-cell {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .tui-list-cell-navigate {
    width: 100%;
    position: relative;
    padding: 30rpx 0 30rpx 30rpx;
    font-size: 28rpx;
    color: #333;
  }
  .tui-list-cell-navigate::after {
    content: '';
    position: absolute;
    border-bottom: 1rpx solid #eaeef1;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    bottom: 0;
    right: 0;
    left: 30rpx;
  }
  .current-city {
    padding: 0 30rpx 30rpx;
    background: #fff;
  }
  .current-city .title {
    font-size: 24rpx;
    line-height: 24rpx;
    color: #999;
  }
  .city-name {
    display: flex;
    align-items: center;
    margin-top: 17rpx;
    font-size: 30rpx;
    font-weight: bold;
    line-height: 30rpx;
    color: #333;
  }
  .hot-city .title {
    padding-left: 30rpx;
    font-size: 24rpx !important;
    line-height: 48rpx !important;
    color: #999;
    background: #f2f5f7 !important;
  }

  .hot-city .title {
    height: 48rpx !important;
  }

  .city-names {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    width: 100%;
    padding: 12rpx 72rpx 26rpx 30rpx;
    background: #fff;
  }
  .city-name-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 140rpx;
    height: 56rpx;
    margin-top: 24rpx;
    margin-right: 20rpx;
    border-radius: 28rpx;
    font-size: 28rpx;
    color: #333;
    position: relative;
  }
  .city-name-item::before {
    content: "";
    position: absolute;
    width: 200%;
    height: 200%;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    transform: scale(0.5, 0.5);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    left: 0;
    top: 0;
    border-radius: 56rpx;
    border: 1px solid #ccc;
  }
  .tui-list {
    background-color: #fff;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: env(safe-area-inset-bottom);
  }
  .tui-list-cell-divider {
    height: 48rpx;
    font-size: 24rpx;
    color: #999;
    background: #f2f5f7;
    padding: 0 30rpx;
    display: flex;
    align-items: center;
  }
  .tui-indexed-list-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    z-index: 9999;
    position: absolute;
    top: 132rpx;
    right: 0;
    padding-right: 10rpx;
    width: 44rpx;
  }
  .tui-indexed-list-text {
    font-size: 22rpx;
    white-space: nowrap;
  }
  .tui-indexed-list-bar.active {
    background-color: rgb(200, 200, 200);
  }
  .tui-indexed-list-alert {
    position: absolute;
    z-index: 20;
    width: 160rpx;
    height: 160rpx;
    left: 50%;
    top: 50%;
    margin-left: -80rpx;
    margin-top: -80rpx;
    border-radius: 80rpx;
    text-align: center;
    line-height: 160rpx;
    font-size: 70rpx;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
