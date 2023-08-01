<template>
	<view class="uni-swiper__warp">
		<slot />
		<view
			v-if="mode === 'default'"
			:style="{ bottom: dots.bottom + 'px' }"
			class="uni-swiper__dots-box"
		>
			<view
				v-for="(item, index) in info"
				:style="{
					width: (index === current ? dots.width * 2 : dots.width) + 'px',
					height: dots.width / 3 + 'px',
					'background-color':
						index !== current
							? dots.backgroundColor
							: dots.selectedBackgroundColor,
					'border-radius': '0px'
				}"
				:key="index"
				class="uni-swiper__dots-item uni-swiper__dots-bar"
			/>
		</view>
		<view
			v-if="mode === 'dot'"
			:style="{ bottom: dots.bottom + 'px' }"
			class="uni-swiper__dots-box"
		>
			<view
				v-for="(item, index) in info"
				:style="{
					width: dots.width + 'px',
					height: dots.height + 'px',
					'background-color':
						index !== current
							? dots.backgroundColor
							: dots.selectedBackgroundColor,
					border: index !== current ? dots.border : dots.selectedBorder
				}"
				:key="index"
				class="uni-swiper__dots-item"
			/>
		</view>
		<view
			v-if="mode === 'round'"
			:style="{ bottom: dots.bottom + 'px' }"
			class="uni-swiper__dots-box"
		>
			<view
				v-for="(item, index) in info"
				:class="[index === current && 'uni-swiper__dots-long']"
				:style="{
					width: (index === current ? dots.width * 3 : dots.width) + 'px',
					height: dots.height + 'px',
					'background-color':
						index !== current
							? dots.backgroundColor
							: dots.selectedBackgroundColor,
					border: index !== current ? dots.border : dots.selectedBorder
				}"
				:key="index"
				class="uni-swiper__dots-item "
			/>
		</view>
		<view
			v-if="mode === 'nav'"
			:style="{ 'background-color': dotsStyles.backgroundColor }"
			class="uni-swiper__dots-box uni-swiper__dots-nav"
		>
			<view
				:style="{ color: dotsStyles.color }"
				class="uni-swiper__dots-nav-item"
				>{{ current + 1 + '/' + info.length }}
				{{ info[current] && info[current][field] }}</view
			>
		</view>
		<view
			v-if="mode === 'indexes'"
			:style="{ bottom: dots.bottom + 'px' }"
			class="uni-swiper__dots-box"
		>
			<view
				v-for="(item, index) in info"
				:style="{
					width: dots.width + 'px',
					height: dots.height + 'px',
					color: index === current ? dots.selectedColor : dots.color,
					'background-color':
						index !== current
							? dots.backgroundColor
							: dots.selectedBackgroundColor,
					border: index !== current ? dots.border : dots.selectedBorder
				}"
				:key="index"
				class="uni-swiper__dots-item uni-swiper__dots-indexes"
				>{{ index + 1 }}</view
			>
		</view>
	</view>
</template>
<script setup lang="ts">
import {onMounted, ref, watch} from "vue";

const props = defineProps({
  info: {
    type: Array,
    default() {
      return [];
    }
  },
  current: {
    type: Number,
    default: 0
  },
  dotsStyles: {
    type: Object,
    default() {
      return {};
    }
  },
  // 类型 ：default(默认) indexes long nav
  mode: {
    type: String,
    default: "default"
  },
  // 只在 nav 模式下生效，变量名称
  field: {
    type: String,
    default: ""
  }
});
const dots = ref({
  width: 8,
  height: 8,
  bottom: 10,
  color: "#fff",
  backgroundColor: "rgba(0, 0, 0, .3)",
  border: "1px rgba(0, 0, 0, .3) solid",
  selectedBackgroundColor: "#333",
  selectedBorder: "1px rgba(0, 0, 0, .9) solid"
});
onMounted(() => {
  if (props.mode === "indexes") {
    dots.value.width = 20;
    dots.value.height = 20;
  }
  dots.value = Object.assign(dots.value, props.dotsStyles);
});

watch(
  () => props.dotsStyles,
  () => {
    dots.value = Object.assign(dots.value, props.dotsStyles);
  }
);
watch(
  () => props.mode,
  (newVal) => {
    if (newVal === "indexes") {
      dots.value.width = 20;
      dots.value.height = 20;
    } else {
      dots.value.width = 8;
      dots.value.height = 8;
    }
  }
);

</script>
<style>
.uni-swiper__warp {
	position: relative;
	width: 100%;
	box-sizing: border-box;
	overflow: hidden;
}

.uni-swiper__dots-box {
	position: absolute;
	bottom: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: box-sizing;
	width: 100%;
}

.uni-swiper__dots-item {
	flex-shrink: 0;
	width: 16rpx;
	border-radius: 50%;
	margin-left: 12rpx;
	background: rgba(0, 0, 0, 0.3);
	transition: all 0.2s linear;
}

.uni-swiper__dots-item:first-child {
	margin: 0;
}

.uni-swiper__dots-default {
	border-radius: 50%;
}

.uni-swiper__dots-long {
	border-radius: 100rpx;
}

.uni-swiper__dots-bar {
	border-radius: 100rpx;
}

.uni-swiper__dots-nav {
	bottom: 0;
	height: 60rpx;
	justify-content: flex-start;
	background: rgba(0, 0, 0, 0.2);
	box-sizing: box-sizing;
	overflow: hidden;
	z-index: 10;
}

.uni-swiper__dots-nav-item {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 28rpx;
	color: #fff;
	box-sizing: box-sizing;
	margin: 0 30rpx;
}

.uni-swiper__dots-indexes {
	display: flex;
	justify-content: center;
	align-items: center;
	color: #fff;
	font-size: 24rpx;
}
</style>
