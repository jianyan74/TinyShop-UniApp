<template>
  <view class="rf-count-down flex-align-items" :style="{ textAlign: textAlign }">
    <view class="tip font-sm mr-sm" :style="{ color: splitorColor, display: tipType }">
      {{ tip }}
    </view>
    <view class="uni-countdown">
      <view
        v-if="showDay && d > 0"
        :style="{
          borderColor: borderColor,
          background: backgroundColor,
          color: color,
          fontSize: fontSize,
          fontWeight: fontWeight,
          padding: `${tbPadding} ${lrPadding}`
        }"
        class="uni-countdown__number"
      >
        {{ d }}
      </view>
      <view
        v-if="showDay && d > 0"
        :style="{ color: splitorColor, fontSize: fontSize, color: dayColor,
                  padding: `calc(${tbPadding} / 2) calc(${lrPadding} / 2)` }"
        class="uni-countdown__splitor"
      >
        天
      </view>
      <view
        :style="{
          borderColor: borderColor,
          color: color,
          fontWeight: fontWeight,
          fontSize: fontSize,
          padding: `${tbPadding} ${lrPadding}`,
          background: backgroundColor
        }"
        class="uni-countdown__number"
      >
        {{ h }}
      </view>
      <text
        :style="{ color: splitorColor,
                  padding: `calc(${tbPadding} / 2) calc(${lrPadding} / 2)` }"
        class="uni-countdown__splitor">{{
        showColon ? ':' : '时'
      }}</text>
      <view
        :style="{
          borderColor: borderColor,
          color: color,
          fontWeight: fontWeight,
          fontSize: fontSize,
          padding: `${tbPadding} ${lrPadding}`,
          background: backgroundColor
        }"
        class="uni-countdown__number"
      >
        {{ i }}
      </view>
      <view
        :style="{ color: splitorColor,
                  padding: `calc(${tbPadding} / 2) calc(${lrPadding} / 2)` }"
        class="uni-countdown__splitor">
        {{ showColon ? ':' : '分' }}
      </view>
      <view
        :style="{
          borderColor: borderColor,
          color: color,
          fontWeight: fontWeight,
          fontSize: fontSize,
          padding: `${tbPadding} ${lrPadding}`,
          background: backgroundColor
        }"
        class="uni-countdown__number"
      >
        {{ s }}
      </view>
      <view
        v-if="!showColon"
        :style="{ color: splitorColor, padding: `${tbPadding} ${lrPadding}`, }"
        class="uni-countdown__splitor"
      >
        秒
      </view
      >
    </view>
  </view>
</template>
<script>
export default {
  name: "RfCountDown",
  props: {
    tipType: {
      type: String,
      default: "block",
    },
    dayColor: {
      type: String,
      default: "#fff",
    },
    textAlign: {
      type: String,
      default: "center",
    },
    showDay: {
      type: Boolean,
      default: true,
    },
    showColon: {
      type: Boolean,
      default: true,
    },
    backgroundColor: {
      type: String,
      default: "#FFFFFF",
    },
    borderColor: {
      type: String,
      default: "#000000",
    },
    fontSize: {
      type: String,
      default: "24rpx",
    },
    fontWeight: {
      type: String,
      default: "normal",
    },
    color: {
      type: String,
      default: "#000000",
    },
    tip: {
      type: String,
      default: "",
    },
    lrPadding: {
      type: String,
      default: "2rpx",
    },
    tbPadding: {
      type: String,
      default: "2rpx",
    },
    splitorColor: {
      type: String,
      default: "#000000",
    },
    day: {
      type: Number,
      default: 0,
    },
    hour: {
      type: Number,
      default: 0,
    },
    minute: {
      type: Number,
      default: 0,
    },
    second: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      timer: null,
      d: "00",
      h: "00",
      i: "00",
      s: "00",
      leftTime: 0,
      seconds: 0,
    };
  },
  watch: {
    second() {
      clearInterval(this.timer);
      this.seconds = this.toSeconds(
        this.day,
        this.hour,
        this.minute,
        this.second
      );
      this.countDown();
      this.timer = setInterval(() => {
        this.seconds--;
        if (this.seconds < 0) {
          this.timeUp();
          return;
        }
        this.countDown();
      }, 1000);
    },
  },
  mounted() {
    this.seconds = this.toSeconds(
      this.day,
      this.hour,
      this.minute,
      this.second
    );
    this.countDown();
    this.timer = setInterval(() => {
      this.seconds--;
      if (this.seconds < 0) {
        this.timeUp();
        return;
      }
      this.countDown();
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    toSeconds(day, hours, minutes, seconds) {
      return day * 60 * 60 * 24 + hours * 60 * 60 + minutes * 60 + seconds;
    },
    timeUp() {
      clearInterval(this.timer);
      this.$emit("timeup");
    },
    countDown() {
      let seconds = this.seconds;
      let [day, hour, minute, second,] = [0, 0, 0, 0,];
      if (seconds > 0) {
        day = Math.floor(seconds / (60 * 60 * 24));
        hour = Math.floor(seconds / (60 * 60)) - day * 24;
        minute = Math.floor(seconds / 60) - day * 24 * 60 - hour * 60;
        second =
					Math.floor(seconds) -
					day * 24 * 60 * 60 -
					hour * 60 * 60 -
					minute * 60;
      } else {
        this.timeUp();
      }
      if (day < 10) {
        day = "0" + day;
      }
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
      if (second < 10) {
        second = "0" + second;
      }
      this.d = day;
      this.h = hour;
      this.i = minute;
	 		this.s = second;
    },
  },
};
</script>
<style lang="scss">
.tip {
	font-size: $font-sm;
	line-height: 32rpx;
}

.uni-countdown {
	display: flex;
	justify-content: center;
	align-items: center;
	line-height: 32rpx;
  height: 32rpx;
}

.uni-countdown__splitor {
  line-height: 1;
}

.uni-countdown__number {
	border-radius: 6rpx;
  width: 42rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
