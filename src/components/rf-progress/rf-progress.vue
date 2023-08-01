<template>
  <view :class="setStatusClass" class="rf-progress rf-progress-default">
    <block v-if="type === 'circle' || type === 'dashboard'">
      <view :class="setStatusClass" class="rf-progress rf-progress-default">
        <view :style="setCircleStyle" class="rf-progress-inner">
          <!-- 绘制圈 start -->
          <!-- #ifdef H5 -->
          <svg class="rf-progress-circle" viewBox="0 0 100 100">
            <path
              :d="setCirclePath"
              :stroke-linecap="strokeShape"
              :stroke-width="strokeWidth"
              :style="setCircleTrailStyle"
              class="rf-progress-circle-trail"
              fill-opacity="0"
              stroke="#f3f3f3"
            />
            <path
              :d="setCirclePath"
              :stroke-linecap="strokeShape"
              :stroke-width="strokeWidth"
              :style="setCirclePathStyle"
              class="rf-progress-circle-path"
              fill-opacity="0"
            />
          </svg>
          <!-- #endif -->
          <!-- #ifndef H5 -->
          <text :style="setCircle" />
          <!-- #endif -->
          <!-- 绘制圈 end -->
          <!-- 状态文本 start -->
          <block v-if="showInfo">
            <view :title="setFormat" class="rf-progress-text">
              <view
                v-if="
                  status !== 'success' &&
                    status !== 'exception' &&
                    setProgress < 100
                "
                :style="{color: showInfoColor, fontSize: showInfoFontSize }"
              >{{ setFormat }}
              </view
              >
              <!-- #ifdef H5 -->
              <svg
                v-if="status === 'exception'"
                aria-hidden="true"
                data-icon="close"
                fill="currentColor"
                height="1em"
                viewBox="64 64 896 896"
                width="1em"
              >
                <path
                  d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
                />
              </svg>
              <svg
                v-if="status === 'success' || setProgress === 100"
                :style="{ color: strokeColor ? strokeColor : '' }"
                aria-hidden="true"
                data-icon="check"
                fill="currentColor"
                height="1em"
                viewBox="64 64 896 896"
                width="1em"
              >
                <path
                  d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"
                />
              </svg>
              <!-- #endif -->
              <!-- #ifndef H5 -->
              <text
                v-if="
                  status === 'exception' ||
                    status === 'success' ||
                    setProgress === 100
                "
                :style="setCircleIcon"
              />
              <!-- #endif -->
            </view>
          </block>
          <!-- 状态文本 end -->
        </view>
      </view>
    </block>

    <block v-if="type === 'line'">
      <!-- 进度条 start -->
      <view class="rf-progress-outer" :style="{width: showInfo ? '85%' : '100%'}">
        <view
          :style="{ 'border-radius': strokeShape === 'square' ? 0 : '100px', background: `${inactiveColor} !important` }"
          style="overflow: hidden;"
          class="rf-progress-inner"
        >
          <view :style="setLineStyle" class="rf-progress-bg" />
          <view
            v-if="successPercent"
            :style="setLineSuccessStyle"
            class="rf-progress-success-bg"
          />
        </view>
      </view>
      <!-- 进度条 end -->
      <!-- 进度条是否显示信息 start -->
      <block v-if="showInfo">
        <view :title="setFormat" class="rf-progress-text">
          <view
            v-if="
              status !== 'success' && status !== 'exception' && setProgress < 100
            "
            :style="{color: showInfoColor, fontSize: showInfoFontSize}"
          >
            {{ setFormat }}
          </view>
          <!-- #ifdef H5 -->
          <svg
            v-if="status === 'exception'"
            aria-hidden="true"
            data-icon="close-circle"
            fill="currentColor"
            height="1em"
            viewBox="64 64 896 896"
            width="1em"
          >
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"
            />
          </svg>
          <svg
            v-if="status === 'success' || setProgress === 100"
            :style="{ color: strokeColor ? strokeColor : '' }"
            aria-hidden="true"
            data-icon="check-circle"
            fill="currentColor"
            height="1em"
            viewBox="64 64 896 896"
            width="1em"
          >
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
            />
          </svg>
          <!-- #endif -->
          <!-- #ifndef H5 -->
          <text
            v-if="
              status === 'exception' || status === 'success' || setProgress === 100
            "
            :style="setLineStatusIcon"
          />
          <!-- #endif -->
        </view>
      </block>
      <!-- 进度条是否显示信息 end -->
    </block>
  </view>
</template>

<script>
/**
 * 进度条组件
 * @description 显示一个操作完成的百分比时，为用户显示该操作的当前进度和状态。
 * @tutorial https://ext.dcloud.net.cn/plugin?id=259
 * @property {String} type 进度类型 - 线型：line、圆圈形：circle、仪表盘：dashboard，默认线型：line
 * @property {Number} percent 进度百分比值 - 显示范围0-100 ，可能数比较大就需要自己转成百分比的值
 * @property {Number} success-percent 进度已完成的百分几 - 仅支持进度线型：line
 * @property {String} status 进度状态 - 涌动：active（仅支持线型：line）、正常：normal、完成：success、失败：exception，默认正常：normal
 * @property {Boolean} show-info 进度状态信息 - 是否显示进度数值或状态图标，默认true
 * @property {Number} stroke-width 进度线条的宽度 - 建议在条线的宽度范围：1-50，与进度条显示宽度有关，默认8
 * @property {String} stroke-color 进度线条的颜色 - 渐变色仅支持线型：line
 * @property {String} stroke-shape 进度线条两端的形状 - 圆：round、方块直角：square，默认圆：round
 * @property {Number} width 进度画布宽度 - 仅支持圆圈形：circle、仪表盘：dashboard，默认80
 * @property {String} gap-degree 进度圆形缺口角度 - 可取值 0 ~ 360,仅支持圆圈形：circle、仪表盘：dashboard
 * @property {String} gap-position 进度圆形缺口位置 - 可取值'top', 'bottom', 'left', 'right',仅支持圆圈形：circle、仪表盘：dashboard
 * @example <rf-progress :percent="30"></rf-progress>
 */
export default {
  name: "RfProgress",

  props: {
    /**
     * 类型默认：line，可选 line circle dashboard
     */
    type: {
      validator: (val) => {
        return ["line", "circle", "dashboard",].includes(val);
      },
      default: "line",
    },
    /**
     * 百分比
     */
    percent: {
      type: Number,
      default: 0,
    },
    /**
     * 已完成的分段百分，仅支持类型line
     */
    successPercent: {
      type: Number,
      default: 0,
    },
    /**
     * 是否显示进度数值或状态图标
     */
    showInfo: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否显示进度数值或状态图标
     */
    showInfoFontSize: {
      type: String,
      default: "",
    },
    /**
     * 进度状态，可选：normal success exception （active仅支持类型line
     */
    status: {
      validator: (val) => {
        return ["normal", "success", "exception", "active",].includes(val);
      },
      default: "normal",
    },
    /**
     * 条线的宽度1-50，与width有关
     */
    strokeWidth: {
      type: Number,
      default: 6,
    },
    /**
     * 条线的颜色，渐变色仅支持类型line
     */
    strokeColor: {
      type: String,
      default: "",
    },
    inactiveColor: {
      type: String,
      default: "#f5f5f5",
    },
    showInfoColor: {
      type: String,
      default: "#fff",
    },
    /**
     * 条线两端的形状 可选：'round', 'square'
     */
    strokeShape: {
      validator: (val) => {
        return ["round", "square",].includes(val);
      },
      default: "round",
    },
    /**
     * 圆形进度条画布宽度,支持类型circle dashboard
     */
    width: {
      type: Number,
      default: 80,
    },
    /**
     * 圆形进度条缺口角度，可取值 0 ~ 360,支持类型circle dashboard
     */
    gapDegree: {
      type: Number,
      default: 0,
    },
    /**
     * 圆形进度条缺口位置,可取值'top', 'bottom', 'left', 'right' ,支持类型circle dashboard
     */
    gapPosition: {
      validator: (val) => {
        return ["top", "bottom", "left", "right",].includes(val);
      },
      default: "top",
    },
  },

  computed: {
    /**
     * 如果需要自定义格式就在这改
     */
    setFormat() {
      return `${this.setProgress}%`;
    },
    /**
     * 设置显示进度值，禁止小于0和超过100
     */
    setProgress() {
      let percent = this.percent;
      if (!this.percent || this.percent < 0) {
        percent = 0;
      } else if (this.percent >= 100) {
        percent = 100;
      }
      return percent;
    },
    /**
     * 进度圈svg大小
     */
    setCircleStyle() {
      return `width: ${this.width}px;
				height: ${this.width}px;
				fontSize: ${this.width * 0.15 + 6}px;`;
    },
    /**
     * 圈底色
     */
    setCircleTrailStyle() {
      const radius = 50 - this.strokeWidth / 2;
      const len = Math.PI * 2 * radius;
      const gapDeg = this.gapDegree || (this.type === "dashboard" && 75);
      return `stroke-dasharray: ${len - (gapDeg || 0)}px, ${len}px;
				stroke-dashoffset: -${(gapDeg || 0) / 2}px;
				stroke: ${this.inactiveColor};
				transition: stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s;`;
    },
    /**
     * 圈进度
     */
    setCirclePathStyle() {
      const radius = 50 - this.strokeWidth / 2;
      const len = Math.PI * 2 * radius;
      const gapDeg = this.gapDegree || (this.type === "dashboard" && 75);
      return `stroke: ${this.strokeColor};
				stroke-dasharray: ${
        (this.setProgress / 100) * (len - (gapDeg || 0))
      }px, ${len}px;
				stroke-dashoffset: -${(gapDeg || 0) / 2}px;
				transition: stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s, stroke-width 0.06s ease 0.3s;`;
    },
    /**
     * 绘制圈
     */
    setCirclePath() {
      const radius = 50 - this.strokeWidth / 2;
      let beginPositionX = 0;
      let beginPositionY = -radius;
      let endPositionX = 0;
      let endPositionY = -2 * radius;
      const gapPos =
        (this.type === "dashboard" && "bottom") || this.gapPosition || "top";
      switch (gapPos) {
        case "left":
          beginPositionX = -radius;
          beginPositionY = 0;
          endPositionX = 2 * radius;
          endPositionY = 0;
          break;
        case "right":
          beginPositionX = radius;
          beginPositionY = 0;
          endPositionX = -2 * radius;
          endPositionY = 0;
          break;
        case "bottom":
          beginPositionY = radius;
          endPositionY = 2 * radius;
          break;
        default:
          break;
      }
      return `M 50,50 m ${beginPositionX},${beginPositionY} a ${radius},${radius} 0 1 1 ${endPositionX},${-endPositionY} a ${radius},${radius} 0 1 1 ${-endPositionX},${endPositionY}`;
    },
    // #ifndef H5
    /**
     * 非H5端，绘制进度圈svg转base URL
     */
    setCircle() {
      const radius = 50 - this.strokeWidth / 2;
      const len = Math.PI * 2 * radius;
      const gapDeg = this.gapDegree || (this.type === "dashboard" && 75);
      let currentColor = "#108ee9";
      // 异常进度
      if (this.status === "exception") {
        currentColor = "#f5222d";
      }
      // 完成进度
      if (
        this.status === "success" ||
        this.setProgress >= 100 ||
        this.strokeColor
      ) {
        currentColor = this.strokeColor || "#52c41a";
      }
      let svgToBase = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' class='rf-progress-circle'%3E%3Cpath d='${
        this.setCirclePath
      }' stroke='%23${this.inactiveColor.slice(1)}' stroke-linecap='${
        this.strokeShape
      }' stroke-width='${
        this.strokeWidth
      }' fill-opacity='0' class='rf-progress-circle-trail' style='stroke-dasharray: ${
        len - (gapDeg || 0)
      }px, ${len}px;stroke-dashoffset: -${
        (gapDeg || 0) / 2
      }px;transition: stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s;'%3E%3C/path%3E%3Cpath  d='${
        this.setCirclePath
      }' stroke-linecap='${this.strokeShape}' stroke-width='${
        this.strokeWidth
      }' fill-opacity='0' class='rf-progress-circle-path' style='stroke: ${escape(
        currentColor
      )};stroke-dasharray: ${
        (this.setProgress / 100) * (len - (gapDeg || 0))
      }px, ${len}px;stroke-dashoffset: -${
        (gapDeg || 0) / 2
      }px;transition: stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s, stroke-width 0.06s ease 0.3s;'%3E%3C/path%3E%3C/svg%3E`;
      return `background-image: url("${svgToBase}");
				background-size: cover;
				display: inline-block;
				${this.setCircleStyle}`;
    },
    /**
     * 设置进度圈状态图标
     */
    setCircleIcon() {
      let currentColor = "#108ee9";
      let svgToBase = "";
      // 异常进度
      if (this.status == "exception") {
        currentColor = "#f5222d";
        svgToBase = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='64 64 896 896' data-icon='close' width='1em' height='1em' fill='${escape(
          currentColor
        )}' aria-hidden='true'%3E %3Cpath d='M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z'%3E%3C/path%3E %3C/svg%3E`;
      }
      // 完成进度
      if (this.status == "success" || this.setProgress >= 100) {
        currentColor = this.strokeColor || "#52c41a";
        svgToBase = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='64 64 896 896' data-icon='check' width='1em' height='1em' fill='${escape(
          currentColor
        )}' aria-hidden='true'%3E %3Cpath d='M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z'%3E%3C/path%3E %3C/svg%3E`;
      }
      return `background-image: url("${svgToBase}");
				background-size: cover;
				display: inline-block;
				width: 1em;
				height: 1em;`;
    },
    // #endif
    /**
     * 设置进度条样式
     */
    setLineStyle() {
      return `width: ${this.setProgress}%;
				height: ${this.strokeWidth}px;
				background: ${this.strokeColor};
				overflow: hidden;
				border-radius: ${this.strokeShape === "square" ? 0 : "100px"} !important;`;
    },
    /**
     * 设置已完成分段进度
     */
    setLineSuccessStyle() {
      let successPercent = this.successPercent;
      if (
        !this.successPercent ||
        this.successPercent < 0 ||
        this.setProgress < this.successPercent
      ) {
        successPercent = 0;
      } else if (this.successPercent >= 100) {
        successPercent = 100;
      }
      return `width: ${successPercent}%;
				height: ${this.strokeWidth}px;
				border-radius: ${this.strokeShape === "square" ? 0 : "100px"};`;
    },
    // #ifndef H5
    /**
     * 设置进度条状态图标
     */
    setLineStatusIcon() {
      let currentColor = "#108ee9";
      let svgToBase = "";
      // 异常进度
      if (this.status == "exception") {
        currentColor = "#f5222d";
        svgToBase = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='64 64 896 896' data-icon='close-circle' width='1em' height='1em' fill='${escape(
          currentColor
        )}' aria-hidden='true'%3E %3Cpath d='M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z'%3E%3C/path%3E %3C/svg%3E`;
      }
      // 完成进度
      if (this.status == "success" || this.setProgress >= 100) {
        currentColor = this.strokeColor || "#52c41a";
        svgToBase = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='64 64 896 896' data-icon='check-circle' width='1em' height='1em' fill='${escape(
          currentColor
        )}' aria-hidden='true'%3E %3Cpath d='M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z'%3E%3C/path%3E %3C/svg%3E`;
      }
      return `background-image: url("${svgToBase}");
				background-size: cover;
				display: inline-block;
				width: 1em;
				height: 1em;`;
    },
    // #endif
    /**
     * 状态样式
     */
    setStatusClass() {
      let statusClass = [];
      // 异常进度
      if (this.status === "exception") {
        statusClass.push("rf-progress-status-exception");
      }
      // 完成进度
      if (this.status === "success" || this.setProgress >= 100) {
        statusClass.push("rf-progress-status-success");
      }
      // 活动进度条
      if (this.status === "active") {
        statusClass.push("rf-progress-status-active");
      }
      // 是否显示信息
      if (this.showInfo) {
        statusClass.push("rf-progress-show-info");
      }
      // 进度条类型
      if (this.type === "line") {
        statusClass.push("rf-progress-line");
      }
      // 进度圈、仪表盘类型
      if (this.type === "circle" || this.type === "dashboard") {
        statusClass.push("rf-progress-circle");
      }
      statusClass.push("rf-progress-status-normal");
      return statusClass;
    },
  },
};
</script>

<style>
.rf-progress {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  display: inline-block;
}

.rf-progress-line {
  width: 100%;
  font-size: 20 upx;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.rf-progress-outer {
  display: inline-block;
  margin-right: 0;
  padding-right: 0;
}

.rf-progress-show-info .rf-progress-outer {
}

.rf-progress-inner {
  display: inline-block;
  width: 100%;
  /*background-color: #f5f5f5;*/
  border-radius: 200 upx;
  vertical-align: middle;
  position: relative;
}

.rf-progress-circle-trail {
  /*stroke: #fff;*/
}

.rf-progress-circle-path {
  stroke: #1890ff;
  animation: appear 0.3s;
}

.rf-progress-success-bg,
.rf-progress-bg {
  background-color: #1890ff;
  transition: all 0.4s cubic-bezier(0.08, 0.82, 0.17, 1) 0s;
  position: relative;
}

.rf-progress-success-bg {
  background-color: #52c41a;
  position: absolute;
  top: 0;
  left: 0;
}

.rf-progress-text {
  word-break: normal;
  text-align: center;
  vertical-align: middle;
  display: inline-block;
  white-space: nowrap;
  flex: 1;
}

.rf-progress-status-active .rf-progress-bg:before {
  content: "";
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border-radius: 20 upx;
  -webkit-animation: rf-progress-active 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite;
  animation: rf-progress-active 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite;
}

.rf-progress-status-exception .rf-progress-bg {
  background-color: #f5222d;
}

.rf-progress-status-exception .rf-progress-text {
  color: #f5222d;
}

.rf-progress-status-exception .rf-progress-circle-path {
  stroke: #f5222d;
}

.rf-progress-status-success .rf-progress-bg {
  background-color: #52c41a;
}

.rf-progress-status-success .rf-progress-text {
  color: #52c41a;
}

.rf-progress-status-success .rf-progress-circle-path {
  stroke: #52c41a;
}

.rf-progress-circle .rf-progress-inner {
  position: relative;
  line-height: 1;
  background-color: transparent;
}

.rf-progress-circle .rf-progress-text {
  display: block;
  position: absolute;
  width: 100%;
  text-align: center;
  line-height: 1;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  left: 0;
  margin: 0;
  color: rgba(0, 0, 0, 0.65);
  white-space: normal;
}

.rf-progress-circle .rf-progress-status-exception .rf-progress-text {
  color: #f5222d;
}

.rf-progress-circle .rf-progress-status-success .rf-progress-text {
  color: #52c41a;
}

@keyframes rf-progress-active {
  0% {
    opacity: 0.1;
    width: 0;
  }

  20% {
    opacity: 0.5;
    width: 0;
  }

  100% {
    opacity: 0;
    width: 100%;
  }
}
</style>
