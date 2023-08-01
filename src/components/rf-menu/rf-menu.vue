<template>
  <view class="menu-goods">
    <view class="left">
      <view
        v-for="(item,index) in menus" :key="index"
        :class="{'active': list[index] && list[index].active}"
        @click="changeTab(item,index)">
        {{ renderMenuValue(item) }}
      </view>
    </view>
    <view class="right">
      <view
        v-for="(item, index) in currentDateArr.time" :key="index"
        :class="{'active': currentIndex === index}"
        class="time" @tap.stop="handleActivePanel(index)">
        {{ item.explain }}
      </view>
    </view>
  </view>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      list: [],
      activeID: this.activityId,
      currentDateArr: this.menus.length > 0 && this.menus[0],
      isAsyncRefresh: false,
      currentIndex: 0,
      scrollTop: 0,
      old: {
        scrollTop: 0
      }
    }
  },
  props: {
    menus: {
      type: Array,
      default: []
    },
    menuKey: {
      type: String
    },
    selectedGood: {
      type: Object
    },
  },
  methods: {
    init() {
      this.list = this.menus.map(() => {
        return {
          active: false,
          height: 0
        }
      })
      if (this.list.length > 0) {
        this.list[0].active = true;
        this.handleActivePanel(0)
      }
    },
    handleActivePanel(i) {
      console.log(i)
      this.currentIndex = i;
      const timeObj = this.currentDateArr.time[i];
      console.log(this.currentDateArr);
      console.log(timeObj);
      this.$emit('change', {
        timeStr: `${this.currentDateArr.day} ${timeObj.explain}`,
        startTime: parseInt(this.currentDateArr.daytime) + parseInt(timeObj.start_time),
        endTime: parseInt(this.currentDateArr.daytime) + parseInt(timeObj.end_time),
      });
    },
    changeTab(val, i) {
      this.list.forEach(item => {
        item.active = false
      })
      this.list[i].active = true;
      this.currentIndex = 0;
      this.currentDateArr = val;
    },
    renderMenuValue(item) {
      return typeof (item) === 'object' ? item.day : item
    },
  },
  created() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.menu-goods {
  display: flex;
  min-height: 32vh;

  .left {
    background-color: $page-color-base;

    view {
      background-color: $page-color-base;
      color: $font-color-light;
      font-size: $font-lg + 2rpx;
      padding: $spacing-base $spacing-lg;
    }

    .active {
      font-weight: 400;
      background-color: $color-white;
      color: #333;
    }
  }

  .right {
    flex: 1;
    padding: 0 $spacing-base;

    .active {
      color: $base-color;
    }

    .time {
      font-size: $font-lg;
      padding: $spacing-base;
      border-bottom: 1rpx solid rgba(0, 0, 0, .1);
    }
  }
}
</style>
