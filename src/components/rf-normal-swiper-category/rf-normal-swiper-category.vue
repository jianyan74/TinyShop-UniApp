<template>
  <view class="rf-normal-swiper-category"
  >
    <swiper
      v-if="list.length > 0"
      :style="{
        height:
          list.length > lineNum
            ? `${40 * 4 + 160}rpx`
            : `${40 * 2 + 70}rpx`
      }"
      @change="handleCateSwiperChange"
    >
      <swiper-item
        v-for="(fItem, fIndex) in swipeCateList"
        :key="fIndex"
        class="category-list"
      >
        <view
          v-for="(sItem, sIndex) in fItem"
          :key="sIndex"
          :style="{
            width: `${100 / lineNum}%`
          }"
          class="category-list-swiper"
          @tap="navToCategory(sItem.id)"
        >
          <image
            class="pic-ad"
            :style="{
              height: `${40 * 2}rpx`,
              width: `${40 * 2}rpx`,
              borderRadius: '50%'
            }"
            :src="sItem.cover || errorImage"
          />
          <view style="font-size: 28rpx;"
          >
            {{ sItem.cate_title || sItem.title }}
          </view>
        </view>
      </swiper-item>
    </swiper>
    <view
      v-if="list.length > lineNum * 2"
      class="rf-swiper-category-dot"
    >
      <text
        v-for="(item, index) in Math.ceil(list.length / lineNum / 2)"
        :key="item"
        class="dot"
        :class="current === index ? 'active bg-' + themeColor.name : 'normal'"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import mAssetsPath from "@/config/assets";

import mHelper from "@/utils/helper";
import mRouteConfig from "@/config/routes";
import mRouter from "@/utils/routerUtil";
import {Route} from "@/response/route";
const themeColor = mHelper.getThemeColor(); // 主题颜色
const configList = mHelper.getGlobalConfig(); // 通用配置

const current = ref(0);
const errorImage = mAssetsPath.errorImage;
const lineNum = 5;

const props = defineProps({
  categoryType: {
    type: String,
    default: ""
  },
  list: {
    type: Array,
    default() {
      return [];
    }
  }
});
const swipeCateList = computed(() => {
  const list = props.list;
  let result = [];
  for (let i = 0, len = list.length; i < len; i += lineNum * 2) {
    result.push(list.slice(i, i + lineNum * 2));
  }
  return result;
});


// 跳转至分类模块
const navToCategory = (id:string) => {
  if (configList.app_cate_type === "2") {
    uni.setStorageSync("indexToCateId", id);
    navTo(mRouteConfig.category);
  } else {
    navTo(mRouteConfig.productList, { cate_id: id});
  }
};
const handleCateSwiperChange = (e:any) => {
  current.value = e.detail.current;
};
const navTo = (route:Route, query = {}) => {
  mRouter.push({ route, query });
};
</script>

<style scoped lang="scss">
/*分类列表*/
.rf-normal-swiper-category {
	white-space: nowrap;
	.category-list {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		.category-list-swiper {
			display: inline-block;
			text-align: center;
			.pic-ad {
				margin: 6px 0 2px !important;
			}
		}
	}
	.rf-swiper-category-dot {
		display: flex;
		justify-content: center;
		.dot {
			display: inline-block;
			height: 6rpx;
			width: $spacing-lg;
			border-radius: 3rpx;
		}
		.active {
			width: $spacing-lg * 1.5;
		}
		.normal {
			background-color: #e5e5e5;
		}
	}
	.swiper-scroll {
		width: 100%;
		border-radius: 12rpx;
		.category-scroll-list {
			padding: 0 15rpx;
			text-align: center;
			display: inline-block;
			.title {
				line-height: 1;
				font-size: $font-lg;
				font-weight: 400;
				color: $font-color-dark;
			}
			.sub-tit {
				margin-top: 10rpx;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
	}
	.swiper-default {
		.category-scroll-list {
			border-right: 5rpx solid rgba(0, 0, 0, 0.15);
		}
		.category-scroll-list:last-child {
			border-right: none;
		}
	}
}
</style>
