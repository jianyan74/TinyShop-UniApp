<template>
	<view class="rf-account-level">
		<view class="mt-lg mb-lg font-lg">会员级别列表</view>
		<view class="rf-account-level__table">
			<view class="flex-box thead">
				<view class="item-3">级别名称</view>
				<view class="item-3">升级条件(元)</view>
				<view class="item-3">说明</view>
			</view>
			<view
				class="flex-box table"
				v-for="(item, index) in state.memberLevelList"
				:key="index"
			>
				<text class="item-3">
					{{ item.name }}
				</text>
				<text class="item-3">
					消费满<text :class="'text-' + themeColor.name">{{ item.money }}</text>元
				</text>
				<text class="item-3 font-sm">
					<text>根据具体商品进行折扣</text>
				</text>
			</view>
		</view>
		<rf-loading :active="state.loading"></rf-loading>
	</view>
</template>
<script lang="ts" setup>
import {onLoad,} from "@dcloudio/uni-app";
import {reactive,} from "vue";
import memberApi from "@/api/tinyShop/member";
import mHelper from "@/utils/helper";

const themeColor = mHelper.getThemeColor();

// 变量
let state = reactive({
  memberLevelList: [],
  loading: true,
});

onLoad(() =>  {
  initData();
});
// 初始化数据
const initData = () => {
  getMemberLevelList();
};
// 获取用户信息
const getMemberLevelList = async () => {
  try {
    state.memberLevelList = await memberApi.getMemberLevelIndex();
    state.loading = false;
  } catch (e) {
    state.loading = false;
  }
};
</script>
<style scoped lang="scss">
.rf-account-level {
  background-color: $color-white;
	padding: $spacing-lg;
	// 多行合并表格
	&__table {
    .flex-box {
      display: flex;
      flex-wrap: wrap;
    }
    .flex-box > .item-3 {
      flex: 0 0 33.3333%;
      height: 100rpx;
    }
		.item-3 {
			font-size: 26rpx;
			border: 1rpx solid #e0e0e0;
			border-width: 1rpx 1rpx 0 0;
			box-sizing: border-box;
			text-align: center;
			&:first-child {
				border-left-width: 1rpx;
			}
			&:last-child {
				border-right-width: 1rpx;
			}
		}
		.thead {
			.item-3 {
				font-weight: bold;
				padding: 16rpx 0;
				box-sizing: border-box;
			}
		}
		.table {
			&:last-child {
				border-bottom: 1rpx solid #e0e0e0;
			}
			.item-3 {
				display: flex;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
			}
		}
	}
}
</style>
