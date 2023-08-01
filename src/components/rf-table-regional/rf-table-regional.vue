<template>
	<view class="content" v-if="list.length > 0">
		<view class="title">区域分销商级别列表</view>
		<view class="advance-area">
			<view class="flex-box tc thead">
				<view class="item-3">级别名称</view>
				<view class="item-3">消费金额(元)</view>
				<view class="item-3">分销占比(%)</view>
			</view>
			<view
				class="flex-box table tc"
				v-for="(item, index) in list"
				:key="index"
			>
				<view class="item-3" :class="level === item.name ? 'text-' + themeColor.name : ''">
					{{ item.name }}
				</view>
				<view class="item-3" :class="level === item.name ? 'text-' + themeColor.name : ''">
					{{ item.money }}
				</view>
				<view class="item-3" :class="level === item.name ? 'text-' + themeColor.name : ''">
					{{ item.award }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    list: {
      type: Array,
		 	default: () => {
        return [];
      }
    },
    level: {
      type: String,
      default: null
    }
  }
};
</script>

<style lang="scss">
$color: #e0e0e0;
.content {
	padding: 30rpx;
	display: flex;
	flex: 1;
	flex-direction: column;
	/*background-color: #fbf9fe;*/
}

.flex-box {
	display: flex;
	flex-wrap: wrap;
}

.flex-box > .item-2 {
	flex: 0 0 50%;
}

.flex-box > .item-3 {
	flex: 0 0 33.3333%;
	padding: 10rpx 0;
}

.flex-box > .item-4 {
	flex: 0 0 25%;
}

.title {
	margin: 30rpx 0;
	font-size: $font-lg;
	font-weight: 600;
	color: #333;
}

//普通表格
.genaral-area {
	.item-2 {
		font-size: 26rpx;
		border: 1rpx solid $color;
		border-width: 1rpx 1rpx 0 0;
		padding: 16rpx 0;
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
		.item-2 {
			font-weight: bold;

			box-sizing: border-box;
		}
	}

	.table {
		&:last-child {
			border-bottom: 1rpx solid $color;
		}

		.item-2 {
			display: flex;
			justify-content: center;
			align-items: center;
			box-sizing: border-box;
		}
	}
}

// 多行合并表格
.advance-area {
	.item-3,
	.item-4 {
		font-size: 26rpx;
		border: 1rpx solid $color;
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
		.item-3,
		.item-4 {
			font-weight: bold;
			padding: 16rpx 0;
			box-sizing: border-box;
		}
	}

	.table {
		&:last-child {
			border-bottom: 1rpx solid $color;
		}

		.item-3,
		.item-4 {
			display: flex;
			justify-content: center;
			align-items: center;
			box-sizing: border-box;
		}
	}

	.table-flex {
		flex: 1;

		.item {
			border-bottom: 1rpx solid $color;
			padding: 10rpx 0;
			box-sizing: border-box;

			&:last-child {
				border-width: 0;
			}
		}
	}
}
</style>
