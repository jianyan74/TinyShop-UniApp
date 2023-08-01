<template>
	<view class="rf-list-cell">
		<view
			class="mix-list-cell"
			:class="border"
			@tap="eventClick"
			hover-class="cell-hover"
			:hover-stay-time="50"
		>
			<i
				v-if="icon"
				class="iconfont cell-icon"
				:style="[{ color: iconColor }]"
				:class="icon"
			/>
			<text class="cell-tit clamp">{{ title }}</text>
			<text v-if="tips" class="cell-tip">{{ tips }}</text>
			<text class="cell-more iconfont" :class="typeList[navigateType]"></text>
		</view>
	</view>
</template>

<script lang="ts" setup>
/**
 *  简单封装了下， 应用范围比较狭窄，可以在此基础上进行扩展使用
 *  比如加入image， iconSize可控等
 */

defineProps({
  icon: { type: String, default: '' },
  title: { type: String, default: '' },
  tips: { type: String, default: '' },
  navigateType: { type: String, default: 'right' },
  border: { type: String, default: 'b-b' },
  hoverClass: { type: String, default: 'cell-hover' },
  iconColor: { type: String, default: '#333' }
});

const emit = defineEmits(['eventClick']);

const typeList = {
  left: 'iconzuo',
  right: 'iconyou',
  up: 'iconshang',
  down: 'iconxia'
};

const eventClick = () => {
  emit('eventClick');
};
</script>

<style lang="scss">
.icon .mix-list-cell.b-b:after {
	left: 90rpx;
}
.mix-list-cell {
	display: flex;
	align-items: baseline;
	padding: 20rpx $page-row-spacing;
	line-height: 60rpx;
	position: relative;

	&.cell-hover {
		background: #fafafa;
	}
	&.b-b:after {
		// left: 30rpx;
	}

	.cell-icon {
		align-self: center;
		width: 56rpx;
		max-height: 60rpx;
		font-size: 38rpx;
	}
	.cell-more {
		align-self: center;
		font-size: 30rpx;
		color: $font-color-base;
		margin-left: $spacing-sm;
	}
	.cell-tit {
		flex: 1;
		font-size: $font-base;
		color: $font-color-dark;
		margin-right: 10rpx;
	}
	.cell-tip {
		font-size: $font-sm + 2rpx;
	}
}
</style>
