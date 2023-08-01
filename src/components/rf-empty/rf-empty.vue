<template>
  <view class="rf-empty">
    <view
      class="empty-content"
      :style="{
        'padding-top': paddingTop + 'rpx',
        'padding-bottom': paddingBottom + 'rpx',
      }"
    >
      <rf-image
        size="240" :src="notDataImg"
        width="270" height="135"
        :lazy-load="false"
        :show-loading="false"
        :fade="false" />
      <text class="empty-content-info p-lg">{{ info }}</text>
    </view>
    <rf-recommend v-if="isRecommendShow" :width="width" :bottom="bottom" :list="list" class="recommend" />
  </view>
</template>

<script lang="ts">
export default {
  name: "RfEmpty"
};
</script>
<script lang="ts" setup>
import mAssetsPath from "@/config/assets";
import RfImage from "@/components/rf-image/rf-image.vue";
const notDataImg = mAssetsPath.notDataImg;

defineProps({
  src: {
    type: String,
    default: "empty",
  },
  isRecommendShow: {
    type: Boolean,
    default: true,
  },
  paddingTop: {
    type: Number,
    default: 200,
  },
  paddingBottom: {
    type: Number,
    default: 200,
  },
  info: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  bottom: {
    type: Number,
    default: 0,
  },
  width: {
    type: Number,
    default: 346,
  },
  list: {
    type: Array,
    default() {
      return [];
    },
  },
});
</script>

<style lang="scss">
.rf-empty {
	.empty-content {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.empty-content-info {
			font-size: $font-base - 2rpx;
      color: $font-color-light;
		}
		&-image {
			width: 200rpx;
			height: 200rpx;
		}
	}
}
</style>
