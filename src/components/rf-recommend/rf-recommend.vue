<template>
  <view class="rf-recommend">
    <view class="f-header">
      <view class="f-header__bg">
        <rf-image width="600" height="44" :src="textTag0" />
      </view>
      <view class="name font-weight-500 font-base">
        为您推荐
      </view>
    </view>
    <view class="pl-base pr-base">
      <rf-home-product-list
        :content-value="contentValue"
        :info="{ productBgColor: '#fff', cartBtnShow: 'icon', cartIcon: 'iconyijiagou', cartIconSize: 26 }"
        :bottom="bottom"
        :radius="5"
        :list="guessYouLikeList"
        show-type="twoLine"
        type="product"
        @cart="handleCartChange"
      />
    </view>
  </view>
</template>
<script lang="ts" setup>
import {onMounted, ref,} from "vue";
import productApi from "@/api/tinyShop/product";
import mAssetsPath from "@/config/assets";
import {Product,} from "@/response/product";
const textTag0 = mAssetsPath.textTag0;
const contentValue = ['title', "sub", 'marketPrice', 'sales'];
const props = defineProps({
  list: {
    type: Array,
    default() {
      return [] as Product[];
    },
  },
  bottom: {
    type: Number,
    default: 0,
  },
  width: {
    type: Number,
    default: 346,
  },
});
const guessYouLikeList = ref([] as unknown as Product[]);

onMounted(() => {
  initData();
});

const initData = () => {
  if (props.list.length === 0) {
    getGuessYouLikeList();
  } else {
    guessYouLikeList.value = props.list as Product[];
  }
};

const emit = defineEmits(["cart",]);

// 监听购物车数量发生变化
const handleCartChange = () => {
  emit("cart");
};

const getGuessYouLikeList = async () => {
  try {
    const data = await productApi.getGuessYouLikeList();
    guessYouLikeList.value = data as unknown as Product[];
  } catch (e) {
    //
  }
};
</script>
<style scoped lang="scss">
.rf-recommend {
	.f-header {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx 30rpx 40rpx;
    position: relative;
    &__bg {
      position: absolute;
    }
		.line {
			border-bottom: 1rpx solid; // 边框
			width: calc(50% - 40rpx - 30rpx);
			opacity: 0.2;
		}
		.name {
			width: 180rpx;
			font-weight: 400;
			text-align: center;
		}
	}
}
</style>
