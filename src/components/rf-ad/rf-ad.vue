<template>
	<view
		class="backTop"
		v-if="advList && advList.length > 0"
		@tap="indexTopToDetailPage(advList[0])"
	>
		<image class="image" mode="aspectFill" :src="(advList[0] && advList[0].cover) || defaultImg"></image>
	</view>
</template>

<script lang="ts">
export default { name: "rf-ad", };
</script>
<script setup lang="ts">
import {onMounted, ref,} from "vue";
import mHelper from "@/utils/helper";
import mAssetsPath from "@/config/assets";
import commonApi from "@/api/tinyShop/common";

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
});

const advList = ref([]);
const defaultImg = mAssetsPath.defaultImg;


onMounted(() => {
  geAdvList();
});

// 跳至广告图指定页面
const indexTopToDetailPage = (item) => {
  mHelper.handleBasicNavTo(JSON.parse(item.extend_link || "{}"));
};
// 获取广告列表
const geAdvList = async () => {
  try {
    const data = await commonApi.getAdvList({ location: props.type, }) as any;
    advList.value = data[props.type];
  } catch (e) {
    //
  }
};
</script>
<style lang="scss">
.mescroll-lazy-in,
.mescroll-fade-in {
	-webkit-animation: mescrollFadeIn 0.3s linear forwards;
	animation: mescrollFadeIn 0.3s linear forwards;
}

.backTop {
	z-index: 98;
	position: fixed;
	right: 40rpx;
	bottom: 280rpx;
	border-radius: 50%;
	transform: translateZ(0);
	display: flex;
	justify-content: center;
	align-items: center;
	.image {
		width: 260rpx;
		height: 320rpx;
	}
}
</style>
