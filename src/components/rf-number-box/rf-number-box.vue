<template>
	<view class="uni-numbox">
		<view class="uni-numbox-minus" @tap.stop="_calcValue('subtract')">
			<text
				class="iconfont yticon icon-jianhao"
				:class="minDisabled ? 'uni-numbox-disabled' : ''"
			></text>
		</view>
		<input
			class="uni-numbox-value"
			type="number"
			:disabled="disabled"
			v-model="inputValue"
			:maxlength="max.toString().length"
			minlength="1"
			@blur="_onBlur"
			@focus="_onBlur"
			@input="_onBlur"
		/>
		<view class="uni-numbox-plus" @tap.stop="_calcValue('add')">
			<text
				class="iconfont yticon iconjia2"
				:class="maxDisabled ? 'uni-numbox-disabled' : ''"
			></text>
		</view>
	</view>
</template>
<script setup lang="ts">

import {onMounted, ref, watch,} from "vue";

const props = defineProps( {
  isMax: {
    type: Boolean,
    default: false,
  },
  isMin: {
    type: Boolean,
    default: false,
  },
  index: {
    type: Number,
    default: 0,
  },
  skuId: {
    type: Number,
    default: 0,
  },
  value: {
    type: Number,
    default: 0,
  },
  min: {
    type: Number,
    default: -Infinity,
  },
  max: {
    type: Number,
    default: 1,
  },
  step: {
    type: Number,
    default: 1,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const inputValue = ref(props.value);
const minDisabled =  ref(false);
const maxDisabled = ref(false);

onMounted(() => {
  maxDisabled.value = props.isMax;
  minDisabled.value = props.isMin;
});


const _calcValue = (type:string) => {
  const scale = _getDecimalScale();
  let value = inputValue.value * scale;
  let newValue = 0;
  let step:number = props.step * scale;

  if (type === "subtract") {
    newValue = value - step;
    if (newValue <= props.min) {
      minDisabled.value = true;
    }
    if (newValue < props.min) {
      newValue = props.min;
    }
    if (newValue < props.max && maxDisabled.value === true) {
      maxDisabled.value = false;
    }
  } else if (type === "add") {
    newValue = value + step;
    if (newValue >= props.max) {
      maxDisabled.value = true;
    }
    if (newValue > props.max) {
      newValue = props.max;
    }
    if (!newValue || newValue < 1) {
      newValue = props.min;
    }
    if (newValue > props.min && minDisabled.value === true) {
      minDisabled.value = false;
    }
  }
  if (newValue === value) {
    return;
  }
  inputValue.value = newValue / scale;
};
const _getDecimalScale = () => {
  let scale = 1;
  // 浮点型
  if (~~props.step !== props.step) {
    scale = Math.pow(10, (props.step + "").split(".")[1].length);
  }
  return scale;
};
const _onBlur = (event) => {
  let value = event.detail.value;
  if (!value) {
    // inputValue = 0;
    return;
  }
  value = +value;
  if (value > props.max) {
    value = props.max;
  } else if (value < props.min) {
    value = props.min;
  }
  const scale = _getDecimalScale();
  inputValue.value = value.toFixed(String(scale).length - 1);
};


const emit = defineEmits(["eventChange",]);
watch(
  () => inputValue.value,
  (number) => {
    const data = {
      number: number,
      index: props.index,
      skuId: props.skuId,
    };
    emit("eventChange", data);
  },
);
</script>
<style>
.uni-numbox {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	width: 230rpx;
	height: 70rpx;
	background: #f5f5f5;
}

.uni-numbox-minus,
.uni-numbox-plus {
	margin: 0;
	background-color: #f5f5f5;
	width: 70rpx;
	height: 100%;
	line-height: 70rpx;
	text-align: center;
	position: relative;
}
.uni-numbox-minus .yticon,
.uni-numbox-plus .yticon {
	font-size: 36rpx;
	color: #555;
}

.uni-numbox-minus {
	border-right: none;
	border-top-left-radius: 6rpx;
	border-bottom-left-radius: 6rpx;
}

.uni-numbox-plus {
	border-left: none;
	border-top-right-radius: 6rpx;
	border-bottom-right-radius: 6rpx;
}

.uni-numbox-value {
	position: relative;
	background-color: #f5f5f5;
	width: 90rpx;
	height: 50rpx;
	text-align: center;
	padding: 0;
	font-size: 30rpx;
}

.uni-numbox-disabled.yticon {
	color: #d6d6d6;
}
</style>
