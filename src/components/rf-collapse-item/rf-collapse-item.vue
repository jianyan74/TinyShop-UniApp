<template>
	<view
		:class="{
			'uni-collapse-cell--open': isOpen,
			'uni-collapse-cell--hide': !isOpen
		}"
		class="uni-collapse-cell"
	>
		<view class="uni-collapse-cell__title" @tap="onClick">
			<text class="iconfont" :class="[thumb, 'text-' + themeColor.name]"></text>
			<text class="uni-collapse-cell__title-text">{{ title }}</text>
			<!-- #ifdef MP-ALIPAY -->
			<view
				:class="{
					'uni-collapse-cell__title-arrow-active': isOpen,
					'uni-collapse-cell--animation': showAnimation === true,
				}"
				class="uni-collapse-cell__title-arrow"
			>
				<text class="iconfont iconxia" :class="'text-' + themeColor.name"></text>
			</view>
			<!-- #endif -->
			<!-- #ifndef MP-ALIPAY -->
			<text
				:class="{
					'uni-collapse-cell__title-arrow-active': isOpen,
					'uni-collapse-cell--animation': showAnimation === true
				}"
				class="iconfont iconxia"
			></text>
			<!-- #endif -->
		</view>
		<view
			:class="{ 'uni-collapse-cell__content--hide': !isOpen }"
			class="uni-collapse-cell__content"
		>
			<view
				:class="{ 'uni-collapse-cell--animation': showAnimation === true }"
				class="uni-collapse-cell__wrapper"
				:style="{
					transform: isOpen ? 'translateY(0)' : 'translateY(-50%)',
					'-webkit-transform': isOpen ? 'translateY(0)' : 'translateY(-50%)'
				}"
			>
				<slot/>
			</view>
		</view>
	</view>
</template>

<script>
import mHelper from "@/utils/helper";
export default {
  name: "rf-collapse-item",
  props: {
    title: {
      // 列表标题
      type: String,
      default: "标题"
    },
    name: {
      // 唯一标识符
      type: [Number, String],
      default: 0
    },
    showAnimation: {
      // 是否显示动画
      type: Boolean,
      default: false
    },
    open: {
      // 是否展开
      type: Boolean,
      default: false
    },
    thumb: {
      // 缩略图
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isOpen: false,
      themeColor: mHelper.getThemeColor()
    };
  },
  watch: {
    open(val) {
      this.isOpen = val;
    }
  },
  inject: ["collapse"],
  created() {
    this.isOpen = this.open;
    this.nameSync = this.name ? this.name : this.collapse.childrens.length;
    this.collapse.childrens.push(this);
    if (String(this.collapse.accordion) === "true") {
      if (this.isOpen) {
        let lastEl = this.collapse.childrens[
          this.collapse.childrens.length - 2
        ];
        if (lastEl) {
          this.collapse.childrens[
            this.collapse.childrens.length - 2
          ].isOpen = false;
        }
      }
    }
  },
  methods: {
    onClick() {
      if (String(this.collapse.accordion) === "true") {
        this.collapse.childrens.forEach(vm => {
          if (vm === this) {
            return;
          }
          vm.isOpen = false;
        });
      }
      this.isOpen = !this.isOpen;
      this.collapse.onChange && this.collapse.onChange();
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
	.uni-collapse-cell {
		flex-direction: column;
		border-radius: 12rpx;
		box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.05);
	}

	.uni-collapse-cell--open {
		background-color: $color-white;
	}

	.uni-collapse-cell--hide {
		height: 48px;
	}

	.uni-collapse-cell--animation {
		// transition: transform 0.3s ease;
		transition-property: transform;
		transition-duration: 0.3s;
		transition-timing-function: ease;
	}

	.uni-collapse-cell__title {
		padding: 12px 12px;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		box-sizing: border-box;
		/* #endif */
		height: 48px;
		line-height: 24px;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);

		.iconfont {
			margin-right: 6rpx;
		}
	}

	.uni-collapse-cell__title-arrow {
		width: 20px;
		height: 20px;
		transform: rotate(0deg);
		transform-origin: center center;
	}

	.uni-collapse-cell__title-arrow-active {
		transform: rotate(180deg);
	}

	.uni-collapse-cell__title-text {
		flex: 1;
		white-space: nowrap;
		color: inherit;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.uni-collapse-cell__content {
		overflow: hidden;
	}

	.uni-collapse-cell__wrapper {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-collapse-cell__content--hide {
		height: 0px;
		line-height: 0px;
	}
</style>
