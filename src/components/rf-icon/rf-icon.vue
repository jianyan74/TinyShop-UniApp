<template>
  <text
    class="iconfont"
    :class="name"
    :style="{
      marginTop: `${marginTop}rpx`,
      paddingTop: `${paddingTop}rpx`,
      color: color,
      fontSize: `${size}rpx`,
      transform: `scale(${scale})`,
    }"
    data-eventsync="true"
    @tap="click"
  />
</template>

<script lang="ts">
/**
 * icon 图标
 * @description 基于字体的图标集，包含了大多数常见场景的图标。
 * @tutorial https://www.uviewui.com/components/icon.html
 * @property {String} name 图标名称，见示例图标集
 * @property {String} color 图标颜色（默认inherit）
 * @property {String | Number} size 图标字体大小，单位rpx（默认32）
 * @property {String | Number} label-size label字体大小，单位rpx（默认28）
 * @property {String} label 图标右侧的label文字（默认28）
 * @property {String} label-pos label文字相对于图标的位置，只能right或bottom（默认right）
 * @property {String} label-color label字体颜色（默认#606266）
 * @property {Object} custom-style icon的样式，对象形式
 * @property {String} custom-prefix 自定义字体图标库时，需要写上此值
 * @property {String | Number} margin-left label在右侧时与图标的距离，单位rpx（默认6）
 * @property {String | Number} margin-top label在下方时与图标的距离，单位rpx（默认6）
 * @property {String | Number} margin-bottom label在上方时与图标的距离，单位rpx（默认6）
 * @property {String | Number} margin-right label在左侧时与图标的距离，单位rpx（默认6）
 * @property {String} label-pos label相对于图标的位置，只能right或bottom（默认right）
 * @property {String} index 一个用于区分多个图标的值，点击图标时通过click事件传出
 * @property {String} hover-class 图标按下去的样式类，用法同uni的view组件的hover-class参数，详情见官网
 * @property {String} width 显示图片小图标时的宽度
 * @property {String} height 显示图片小图标时的高度
 * @property {String} top 图标在垂直方向上的定位
 * @property {String} top 图标在垂直方向上的定位
 * @property {String} top 图标在垂直方向上的定位
 * @property {Boolean} show-decimal-icon 是否为DecimalIcon
 * @property {String} inactive-color 背景颜色，可接受主题色，仅Decimal时有效
 * @property {String | Number} percent 显示的百分比，仅Decimal时有效
 * @event {Function} click 点击图标时触发
 * @example <rf-icon name="photo" color="#2abc6d" size="28"></rf-icon>
 */
import { defineComponent, toRefs, } from "vue";

export default defineComponent({
  name: "RfIcon",

  props: {
    // 图标类名
    name: {
      type: [String, Array],
      default: "",
    },
    // 图标颜色，可接受主题色
    color: {
      type: String,
      default: "",
    },
    // 缩小比例
    scale: {
      type: String,
      default: "1",
    },
    // 字体大小，单位rpx
    size: {
      type: [Number, String,],
      default: "32",
    },
    // 是否显示粗体
    bold: {
      type: Boolean,
      default: false,
    },
    // 点击图标的时候传递事件出去的index（用于区分点击了哪一个）
    index: {
      type: [Number, String,],
      default: "",
    },
    // 触摸图标时的类名
    hoverClass: {
      type: String,
      default: "",
    },
    // 自定义扩展前缀，方便用户扩展自己的图标库
    customPrefix: {
      type: String,
      default: "uicon",
    },
    // 图标右边或者下面的文字
    label: {
      type: [String, Number,],
      default: "",
    },
    // label的位置，只能右边或者下边
    labelPos: {
      type: String,
      default: "right",
    },
    // label的大小
    labelSize: {
      type: [String, Number,],
      default: "28",
    },
    // label的颜色
    labelColor: {
      type: String,
      default: "#606266",
    },
    // label与图标的距离(横向排列)
    marginLeft: {
      type: [String, Number,],
      default: "6",
    },
    // label与图标的距离(竖向排列)
    marginTop: {
      type: [String, Number,],
      default: "0",
    },
    paddingTop: {
      type: [String, Number],
      default: "0"
    },
    // label与图标的距离(竖向排列)
    marginRight: {
      type: [String, Number,],
      default: "6",
    },
    // label与图标的距离(竖向排列)
    marginBottom: {
      type: [String, Number,],
      default: "6",
    },
    // 图片的mode
    imgMode: {
      type: String,
      default: "widthFix",
    },
    // 自定义样式
    customStyle: {
      type: Object,
      default: () => ({}),
    },
    // 用于显示图片小图标时，图片的宽度
    width: {
      type: [String, Number,],
      default: "",
    },
    // 用于显示图片小图标时，图片的高度
    height: {
      type: [String, Number,],
      default: "",
    },
    // 用于解决某些情况下，让图标垂直居中的用途
    top: {
      type: [String, Number,],
      default: 0,
    },
    // 是否为DecimalIcon
    showDecimalIcon: {
      type: Boolean,
      default: false,
    },
    // 背景颜色，可接受主题色，仅Decimal时有效
    inactiveColor: {
      type: String,
      default: "#ececec",
    },
    // 显示的百分比，仅Decimal时有效
    percent: {
      type: [Number, String,],
      default: "50",
    },
  },

  emits: ["rfComponentClick",],

  setup(props: any, { emit, }) {
    const click = () => {
      emit('rfComponentClick', props.index);
    }

    return {
      ...toRefs(props),
      click,
    };
  },
});
</script>

<style scoped lang="scss"></style>
