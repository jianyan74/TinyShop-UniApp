<template>
  <view class="rf-rate">
    <view class="rf-rate__tip font-base">
      {{ props.tip }}
    </view>
    <view
      v-for="(star, index) in max"
      :key="index"
      :style="{ marginLeft: margin + 'px' }"
      class="rf-rate__icon"
      @tap="onClick(index)"
    >
      <rf-icon
        :size="size"
        name="iconshangpinxiangqingye_yishoucang"
        :style="{ color: state.currentIndex >= index ? activeColor : color }"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive, } from "vue";

const props = defineProps({
  isFill: {
    // 星星的类型，是否镂空
    type: [Boolean, String,],
    default: true,
  },
  color: {
    // 星星的颜色
    type: String,
    default: "#ececec",
  },
  activeColor: {
    // 星星选中状态颜色
    type: String,
    default: "#ffca3e",
  },
  size: {
    // 星星的大小
    type: [Number, String,],
    default: 24,
  },
  value: {
    // 当前评分
    type: [Number, String,],
    default: 0,
  },
  index: {
    // 当前索引
    type: Number,
    default: 1,
  },
  max: {
    // 最大评分
    type: [Number, String,],
    default: 5,
  },
  margin: {
    // 星星的间距
    type: [Number, String,],
    default: 0,
  },
  disabled: {
    // 是否可点击
    type: [Boolean, String,],
    default: false,
  },
  tip: {
    // 描述文字
    type: String,
    default: "",
  },
});

const emit = defineEmits(["change",]);
let state = reactive({
  currentIndex: props.value,
});
const onClick = (index) => {
  if (props.disabled) {
    return;
  }
  state.currentIndex = index;
  emit("change", {
    value: index + 1,
    index: props.index,
  });
};
</script>

<style lang="scss" scoped>
.rf-rate {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
