<template>
	<view class="emotion-box">
		<swiper
			class="swiper"
			disable-programmatic-animation="true"
			indicator-dots="true"
		>
			<swiper-item
				class="emotion-box-line"
				v-for="(xItem, xIndex) in state.list"
				:key="xIndex"
			>
				<view v-for="(yItem, yIndex) in xItem" :key="yIndex">
					<view
						v-for="(zItem, zIndex) in yItem"
						:key="zIndex"
						class="emotion-item"
						@click="clickHandler(zItem)"
					>
						<rf-image width="46" height="46" :src="`${
                    mSiteConfig.baseURL
                  }/resources/image/${zItem}.gif`"></rf-image>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script setup lang="ts">
import mSiteConfig from "@/config/site";
import {onMounted, reactive,} from "vue";

let state = reactive({
  list: [
    [
      [0, 1, 2, 3,],
      [4, 5, 6, 7,],
      [8, 9, 10, 11,],
      [12, 13, 14, 15,],
      [16, 17, 18, 19,],
      [20, 21, 22, 23,],
      [24, 25, 26, 27,],
      [28, 29, 30, 31,],
    ],
    [
      [32, 33, 34, 35,],
      [36, 37, 38, 39,],
      [40, 41, 42, 43,],
      [44, 45, 46, 47,],
      [48, 49, 50, 51,],
      [52, 53, 54, 55,],
      [56, 57, 58, 59,],
      [60, 61, 62, 63,],
    ],
    [
      [64, 65, 66, 67,],
      [68, 69, 70, 71,],
      [72, 73, 74, 75,],
      [76, 77, 78, 79,],
      [80, 81, 82, 83,],
      [84, 85, 86, 87,],
      [88, 89, 90, 91,],
      [92, 93, 94, 95,],
    ],
    [[96, 104,], [97,], [98,], [99,], [100,], [101,], [102,], [103,],],
  ],
  item: [],
  image_width: 0,
});
let emit = defineEmits(["emotion",]);
onMounted(() => {
  state.image_width = 64;
});
const clickHandler = (i) => {
  emit("emotion", i);
};
</script>

<style lang="scss">
.emotion-box {
	margin: 0 auto;
	overflow: hidden;
}
.swiper {
	height: 440rpx;
}
.icon {
	width: 48rpx;
	height: 48rpx;
	vertical-align: -0.15em;
	fill: currentColor;
	overflow: hidden;
}
.emotion-box-line {
	display: flex;
	justify-content: center;
	margin: 40rpx 0;
}

.emotion-item {
	flex: 1;
	text-align: center;
	cursor: pointer;
	margin: 28rpx 18rpx;
}
</style>
