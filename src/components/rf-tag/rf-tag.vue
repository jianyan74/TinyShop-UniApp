<template>
  <view
    v-if="text"
    :style="{transform: `scale(${scale})`, padding: `${tbPadding} ${lrPadding}`, backgroundColor: bgColor, color, borderRadius: `${borderRadius}rpx`, fontWeight: fontWeight, border: isBorderShow ? `1rpx solid ${color}` : 'none'}"
    class="rf-tag font-sm flex-align-items"
    :class="scale === '1' ? 'gap' : ''"
    @tap="onClick()"
  >
    {{ text }}
    <rf-icon v-if="isLink" size="26" class="font-weight-500" name="iconyou" />
  </view>
</template>
<script lang="ts">
export default { name: "RfTag", };
</script>
<script setup lang="ts">
const props = defineProps({
  type: {
    // 标签类型default、primary、success、warning、danger、royal
    type: String,
    default: "default",
  },
  size: {
    // 标签大小 normal, small
    type: String,
    default: "normal",
  },
  // 标签内容
  text: {
    type: String,
    default: "",
  },
  // 字体颜色
  bgColor: {
    type: String,
    default: "",
  },
  scale: {
    type: String,
    default: "1",
  },
  lrPadding: {
    type: String,
    default: "16rpx",
  },
  tbPadding: {
    type: String,
    default: "4rpx",
  },
  fontWeight: {
    type: String,
    default: "normal",
  },
  // 背景色
  color: {
    type: String,
    default: "",
  },
  disabled: {
    // 是否为禁用状态
    type: [String, Boolean,],
    default: false,
  },
  inverted: {
    // 是否为空心
    type: [String, Boolean,],
    default: false,
  },
  circle: {
    // 是否为圆角样式
    type: [String, Boolean,],
    default: false,
  },
  isLink: {
    // 是否可点击
    type: Boolean,
    default: false,
  },
  isBorderShow: {
    type: Boolean,
    default: false,
  },
  mark: {
    // 是否为标记样式
    type: [String, Boolean,],
    default: false,
  },
  borderRadius: {
    // 是否为标记样式
    type: [String, Number,],
    default: "",
  },
});
const emit = defineEmits(["click",]);
const onClick = () => {
  if (props.disabled) return;
  emit("click");
};
</script>

<style lang="scss">
.rf-tag {
	box-sizing: border-box;
	display: inline-flex;
	align-items: center;
}
.gap {
  margin: 0 3rpx;
}
</style>
