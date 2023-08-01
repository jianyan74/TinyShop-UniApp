<template>
  <view class="rf-sign-calendar">
    <!-- 日历头部 -->
    <view class="r-header" v-if="signData.type === 'month'">
      <view class="r-header-icon prev" v-if="state.indexMonth < (state.longList.length - 1)" @tap="nextDate(1)"><text class="iconfont iconzuo font-weight-500"></text>
      </view>
      <view class="title">{{state.showList.year}}年{{state.showList.month}}月</view>
      <view class="r-header-icon next" v-if="state.indexMonth > 0" @tap="nextDate(-1)">
        <text class="iconfont iconyou"></text>
      </view>
    </view>
    <view class="r-header" v-if="signData.type === 'week'">
      <view class="r-header-icon prev" v-if="state.weekIndex > 0" @tap="nextWeekDate(-1)">
        <text class="iconfont iconzuo font-weight-500"></text>
      </view>
      <view class="title" :class="'text-' + themeColor.name">{{state.yearTitle.year || ''}}年{{state.yearTitle.month || ''}}月 第{{state.yearTitle.week || ''}}周</view>
      <view class="r-header-icon next" v-if="state.weekIndex < (state.weekList.length - 1)" @tap="nextWeekDate(1)">
        <text class="iconfont iconyou font-weight-500"></text>
      </view>
    </view>
    <!-- 日历星期 -->
    <view class="r-week font-sm font-color-light">
      <view class="item">周日</view>
      <view class="item">周一</view>
      <view class="item">周二</view>
      <view class="item">周三</view>
      <view class="item">周四</view>
      <view class="item">周五</view>
      <view class="item">周六</view>
    </view>
    <!-- 日历主体(月) -->
    <view class="r-content" v-if="signData.type === 'month'">
      <view class="r-content-box">
        <view class="item" v-for="(item, index) in state.showList.data" :key="index" @tap="handleSignCallback(item)">
          <view class="flex-align-items">
            <rf-image v-if="state.currentDate === dateFormat(item)" class="text" width="60" height="60" :src="signInChecked"></rf-image>
            <view class="text today" :class="'bg-gradual-tb-' + themeColor.color" v-else-if="(Number(state.toYear) === item.year) && (Number(state.toMonth) === item.month) && (Number(state.today) === item.day)">
              {{item.day}}
            </view>
            <view class="text tomonth" v-else-if="state.showList.month === item.month">
              {{item.day}}
            </view>
            <view v-else class="text normal">{{item.day}}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 日历主体(周) -->
    <view class="r-content" v-if="signData.type === 'week'">
      <swiper class="week-box" :duration="300" :current="state.weekIndex" @change="touchendWeek">
        <swiper-item v-for="(itemp, indexp) in state.weekList" :key="indexp">
          <view class="swiper-item">
            <view class="r-content-week">
              <view class="item" v-for="(item, index) in itemp" :key="index">
                <!--								#ifdef MP-->
                <view
                    v-if="state.ymd < `${item.year}${item.month < 10 ? `0${item.month}` : item.month}${item.day < 10 ? `0${item.day}` : item.day}`"
                    class="text after"
                    @tap="signClick(index, 'week')"
                >{{item.day}}</view>
                <block v-else>
                  <view
                      v-if="item.isSign"
                      class="text active"
                      @tap="signClick(index, 'week')"
                  >{{item.day}}</view>
                  <view
                      v-else-if="state.ymd === `${item.year}${item.month < 10 ? `0${item.month}` : item.month}${item.day < 10 ? `0${item.day}` : item.day}`"
                      class="text today"
                      @tap="signClick(index, 'week')"
                  >{{item.day}}</view>
                </block>
                <view class="text"
                      :class="item.type === 'notday' ? 'after' : ''"
                      @tap="signClick(index, 'week')"
                >{{item.day}}</view>
                <view class="text after"
                      v-if="item.type === 'notday'"
                      @tap="signClick(index, 'week')"
                >{{item.day}}</view>
                <!--								#endif-->
                <!--								#ifndef MP-->
                <view class="text"
                      :class="dayClassFilter(item)"
                      @tap="signClick(index, 'week')"
                >{{item.day}}</view>
                <!--								#endif-->
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
      <view class="info">
        <button class="sign-in-btn" :class="[todayIsSign ? 'sign-in-btn-disabled' : '']" @tap="handleSignCallback()"><text class="iconfont iconzhiwen"></text>{{ todayIsSign ? '今日已签到' : '签到' }}</button>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">

import {onMounted, reactive, watch,} from "vue";
import mHelper from "@/utils/helper";
import {formatToDateTime,} from "@/utils/dateUtil";
import mAssetsPath from "@/config/assets";
const themeColor = mHelper.getThemeColor();
const signInChecked = mAssetsPath.signInChecked;

onMounted(() => {
  getMonth();
});

const emit = defineEmits(["nextDate", "callbackSign", "nextWeekDate",]);

const dayClassFilter = (item) => {
  const day = state.ymd;
  let type = "normal";
  if (day < `${item.year}${item.month < 10 ? `0${item.month}` : item.month}${item.day < 10 ? `0${item.day}` : item.day}`) {
    type = "after";
  } else {
    if (day === `${item.year}${item.month < 10 ? `0${item.month}` : item.month}${item.day < 10 ? `0${item.day}` : item.day}`) {
      type = "today";
    }
    if (item.isSign) {
      type = "active";
    }
  }
  if (item.type === "notday") {
    type = "after";
  }
  return type;
};

watch(
  () => props.signData.type,
  () => {
    // 渲染当前显示页
    getMonth();
  }
);

const props = defineProps({
  signData: {
    type: Object,
    default: () => {
      return [];
    },
  },
});

const state = reactive({
  ymd: formatToDateTime(new Date(),"YYYYMMDD"),
  indexMonth: 0, // 当前显示月的index
  longList: [] as any, // 从signData.start 到当前的年份月份
  nowList: {}, // 当前月日期数据
  showList: {year: "", month: "", data: [],}, // 显示月日期数据
  today: new Date().getDate(), //本日
  toMonth: new Date().getMonth() + 1, //本月
  toYear: new Date().getFullYear(), //本年
  // 周单位滑动
  weekIndex: 0, // 当前周index
  weekList: [] as any, // 周的列表
  yearDay: [], // title信息
  yearTitle: {year: "", month: "", week: "",},
  nextIndex: 0, // 记录已加载签到数据的周
  currentDate: "",
});
// 获取longList数据
const getMonth = () => {
  // 获取start到当前月共多少月
  let _s = props.signData.start || "2019-08-01";
  let [_y, _m, _d,] = _s.split("-");
  let _sy = state.toYear - _y, _sm = 0;
  if(_sy > 0) { // 跨年
    if(_sy == 1) {
      _sm = 12 - _m + state.toMonth;
    }else {
      _sm = (_sy - 1) * 12 + (12 - _m) + state.toMonth;
    }
  }else {
    _sm = state.toMonth - _m;
  }
  // y_index = state.toYear
  let m_index = state.toMonth;
  // 遍历添加数组
  for(let i = 0; i <= _sm; i++) {
    let _month = m_index - i, _year = state.toYear;
    for(let _i = 0; _i < _sy; _i++) {
      if(_month <= 0) {
        _month += 12;
        _year -= 1;
      }
    }
    state.longList.push({
      year: _year,
      month: _month,
      data: [],
    });
    // 获取每个月的天数
    // let _day = new Date(toYear, toMonth, 0), _dayCount = _day.getDate()
  }
  getDay();
};
// 获取每个月天数
const getDay = () => {
  for(let i = 0, _i = state.longList.length; i < _i; i++) {
    let _data:any = state.longList[i];
    let _day = new Date(_data.year, _data.month, 0), _dayCount = _day.getDate();
    let _dayData:any = [];
    // 当月一号前空格
    for(let j = 1; j <= _dayCount; j++) { // 遍历每个月天数
      _dayData.push({
        year: _data.year,
        month: _data.month,
        day: j,
        type: "day",
      });
    }
    state.longList[i].data = getDayEnd(_data.year, _data.month, _dayCount, _dayData);
  }
  // 渲染当前显示页
  if(props.signData.type == "month") {
    getNowData();
  }
  if(props.signData.type == "week") {
    getNowWeek();
  }
};
/*
    补全当前月开头结尾
    @param {Number} year
    @param {Number} month
    @param {Number} dayCount 当前月天数
  */
const getDayEnd = (year, month, dayCount, data) => {
  // 获取当前月第一天和最后一天是星期几
  let first = getFirstDayOfWeek(year, month, 1),
    last = getFirstDayOfWeek(year, month, dayCount);
  // 获取上个月最后一天
  let _month = month - 1 < 1 ? 12 : month - 1,
    _year = month - 1 < 1 ? year - 1 : year,
    month_ = month + 1 > 12 ? 1 : month + 1,
    year_ = month + 1 > 12 ? year + 1 : year;
  let _prev = new Date(_year, _month, 0).getDate(); // 上一月多少天
  // 处理数据
  for(let i = 0; i < first; i++) {
    data.unshift({
      year: _year,
      month: _month,
      day: _prev - i,
      type: "notday",
    });
  }
  if(7 - last > 1) {
    for(let i = 1; i < 7 - last; i++) {
      data.push({
        year: year_,
        month: month_,
        day: i,
        type: "notday",
      });
    }
  }
  return data;
};
// 获取当前月日历
const getNowData = () => {
  state.longList.map((item) => {
    if(item.year == state.toYear) {
      if(item.month == state.toMonth) {
        state.nowList = item;
        state.showList = item;
      }
    }
  });
};
// 上下月份切换（上一月indexMonth+1，下一月indexMonth-1）
const nextDate = (index) => {
  state.indexMonth += index;
  if(state.indexMonth < 0) state.indexMonth = 0;
  if(state.indexMonth > state.longList.length - 1) {state.indexMonth = state.longList.length - 1;}
  state.showList = state.longList[state.indexMonth];
  emit("nextDate", {date: `${state.showList.year}-${state.showList.month}-01`,});
};
// 获取当月第一天星期几
const getFirstDayOfWeek = (year, month, day) => {
  return new Date(Date.UTC(year, month - 1, day)).getDay();
};
// 签到操作
const signClick = (index, type) => {
  let days = {};
  if(type == "week") {
    days = state.weekList[state.weekIndex][index];
  }
  if(type == "month") {
    days = state.showList.data[index];
  }
  let _y = days.year, _m = days.month, _d = days.day;
  let click_data = _y + "-" + _m + "-" + _d, now_data = state.toYear + "-" + state.toMonth + "-" + state.today;
  let _n:any = new Date(click_data), _z:any = new Date(now_data);
  let __n = _n.getTime(_n), __z = _z.getTime(_z);
  if(__z >= __n) {
    if(__z == __n) { // 当天签到
      if(!days.isSign) {
        days.isSign = true;
        emit("callbackSign", {
          type: true,
          msg: "签到成功",
          data: days,
        });
      }
    }else { // 补签
      if(!props.signData.ismake) {return false;}
      if(days.type == "notday") {return false;}
      if(!days.isSign) {
        days.isSign = true;
        emit("callbackSign", {
          type: false,
          msg: "补签成功",
          data: days,
        });
      }
    }
  }
};
const handleSignCallback = (item) => {
  if (Number(formatToDateTime(new Date(), "YYYYMMDD")) < Number(dateFormat(item))) return;
  state.currentDate = dateFormat(item);
  emit("callbackSign", {date: state.currentDate,});
};
// 日期补0
const dateFormat = (item) => {
  return  `${item.year}${String(item.month).length < 2 ? `0${item.month}` : item.month}${String(item.day).length < 2 ? `0${item.day}` : item.day}`;
};

const touchendWeek = (e) => {
  state.weekIndex = e.detail.current;
  state.yearTitle = state.yearDay[state.weekIndex];
  if(state.nextIndex > state.weekIndex) {
    state.nextIndex = state.weekIndex;
  }
};
// 获取当前周的信息
const getNowWeek = () => {
  // month数据已做过处理，若当月一号不为周日，则往前面补位('', '', '', '1', '2')
  let _list = state.longList, _:any = [], _yearDay:any = [];
  _list.reverse();
  _list.map((item, index) => {
    let num = Math.ceil(item.data.length / 7);
    // 在当前月只保留到当前周
    // 获取当前天是当前月第几周
    let __n = getMonthWeek(state.toYear, state.toMonth, state.today + 1);
    if(index == _list.length - 1) {
      num = __n;
    }
    for(let i = 0; i < num; i++) {
      _.push(item.data.slice(i * 7, i * 7 + 7));
      _yearDay.push({
        year: item.year,
        month: item.month,
        week: i + 1,
      });
    }
  });
  state.yearDay = _yearDay;
  state.weekIndex = _.length - 1;
  state.nextIndex = state.weekIndex;
  state.yearTitle = state.yearDay[state.weekIndex];
};
const getMonthWeek = (a, b, c) => {
  let _k = new Date(a, b - 1, c), w = _k.getDay(), d = _k.getDate();
  if(w == 0) {w = 7;}
  return Math.ceil((d + 6 - w) / 7);
};
const nextWeekDate = (index) => {
  state.weekIndex += index;
  if(state.weekIndex < 0) {
    state.weekIndex = 0;
    return false;
  }
  if(state.weekIndex > state.weekList.length - 1) {
    state.weekIndex = state.weekList.length - 1;
    return false;
  }
  state.yearTitle = state.yearDay[state.weekIndex];
  emit("nextWeekDate", {date: `${state.weekList[state.weekIndex][0].year}-${state.weekList[state.weekIndex][0].month}-${state.weekList[state.weekIndex][0].day}`,});
};
</script>
<style lang="scss">
.rf-sign-calendar {
  background-color: #fff;
  border-radius: 0 0 8rpx 8rpx;
  width: 100%;
  .r-header {
    position: relative;
    .title {
      height: 88rpx;
      line-height: 88rpx;
      font-size: 32rpx;
      text-align: center;
    }
  }
  .r-header::before, .r-header::after, .r-content::after {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    content: '';
    background-color: #f2f2f2;
    transform: scaleY(.6);
  }
  .r-header::before {
    top: 0;
  }
  .r-header::after, .r-content::after {
    bottom: 0;
  }
  .r-header-icon {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 88rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666;
    font-size: 26rpx;
  }
  .r-header-icon.prev {
    left: 0;
  }
  .r-header-icon.next {
    right: 0;
  }
  .r-week {
    padding: 0 20rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
    font-size: 24rpx;
    .item {
      flex: 1;
      text-align: center;
    }
  }
  .r-content {
    padding: 0 20rpx 10rpx;
    position: relative;
  }
  .r-content-box {
    display: flex;
    flex-wrap: wrap;
    .item {
      box-sizing: border-box;
      width: 14.285%;
      padding-bottom: 24rpx;
    }
    .text {
      box-sizing: border-box;
      //background: #efefef;
      color: #999;
      width: 60rpx;
      height: 60rpx;
      text-align: center;
      font-size: 28rpx;
      line-height: 60rpx;
      border-radius: 50%;
      margin: 0 auto;
    } // 今日样式
    .tomonth {
      color: $font-color-dark;
      font-size: $spacing-lg;
      font-weight: 500;
    }
    .active {
      background: linear-gradient(to top, #1d976c, #93f9b9);
      color: #fff;
    }
    .text.today {
      background: linear-gradient(to top, #e8783e, #e84127);
      color: #fff;
    }
    // 普通样式
    .text.normal {
      //background: #efefef;
      color: #999;
    }
    // 选中样式
    .text.active {
      background: linear-gradient(to top, #1d976c, #93f9b9);
      color: #fff;
    }
    // 漏签样式
    .text.not {
      color: #fff;
      background: linear-gradient(to top, #ff512f, #f09819)
    }
    // 补全样式
    .text.after {
      color: #333;
      background: none;
    }
  }
  .icon-direction {
    border: 20rpx solid transparent;
  }
  .icon-direction.left {
    border-right-color: #f2f2f2;
    transform: scale(1.1, .6);
  }
  .icon-direction.right {
    border-left-color: #f2f2f2;
    transform: scale(1.1, .6);
  }
  .week-box {
    white-space: nowrap;
    height: 70rpx;
  }
  .r-content-week {
    width: 100%;
    display: inline-block;
    vertical-align: top;
    white-space: nowrap;
    .item {
      display: inline-block;
      vertical-align: top;
      box-sizing: border-box;
      width: 14.285%;
      padding-bottom: 20rpx;
    }
    .text {
      box-sizing: border-box;
      width: 60rpx;
      height: 60rpx;
      text-align: center;
      font-size: 22rpx;
      line-height: 60rpx;
      border-radius: 50%;
      margin: 0 auto;
    }
    // 今日样式
    .text.today {
      background: linear-gradient(to top, #eb3349, #f45c43);
      color: #fff;
    }
    // 普通样式
    .text.normal {
      background: #efefef;
      color: #999;
    }
    // 选中样式
    .text.active {
      background: linear-gradient(to top, #1d976c, #93f9b9);
      color: #fff;
    }
    // 漏签样式
    .text.not {
      color: #fff;
      background: linear-gradient(to top, #ff512f, #f09819)
    }
    // 补全样式
    .text.after {
      color: #999;
    }
  }
  .info {
    text-align: center;
    margin: $spacing-base 0 $spacing-sm;
    .sign-in-btn {
      background: linear-gradient(0deg,#f74056 0%, #f74083 100%);
      border-radius: 10px;
      margin: 0 $spacing-base;
      width: calc(100% - 60rpx);
      display: inline-block;
      height: 84rpx;
      line-height: 84rpx;
      font-size: $font-base;
      .iconfont {
        font-size: $font-base;
        margin-right: $spacing-sm;
      }
    }
    .sign-in-btn-disabled {
      opacity: 0.5;
    }
  }
}
</style>
