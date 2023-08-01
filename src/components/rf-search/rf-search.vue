<template>
	<view class="rf-search-input">
		<view class="content" :style="{ borderRadius: radius + 'rpx' }">
			<!-- HM修改 增加进入输入状态的点击范围 -->
			<view class="content-box" :class="{ center: mode === 2 }">
				<rf-icon class="search-icon" name="iconsousuo"></rf-icon>
				<input
					:placeholder="placeholder"
					@input="inputChange"
					@confirm="search"
					class="input"
					:class="{ center: !state.active && mode === 2 }"
					:focus="state.isFocus"
					v-model="state.inputVal"
					@focus="focus"
					@blur="blur"
				/>
				<rf-icon v-if="state.isDelShow" name="iconguanbi" class="mr-sm icon-del" @tap.stop="clear"></rf-icon>
			</view>
			<view
				v-if="
					button === 'inside'
				"
				class="search-btn"
				:class="'bg-' + themeColor.name"
				@tap="search"
			>
				搜索
			</view>
		</view>
		<view
			v-if="button === 'outside'"
			class="button"
			:class="{ active: show || state.active }"
			@tap="search"
		>
			<view class="button-item">{{ !show ? state.searchName : '搜索' }}</view>
		</view>
	</view>
</template>
<script setup lang="ts">
import {reactive, watch,} from "vue";
import mHelper from "@/utils/helper";

const props = defineProps({
  mode: {
    type: Number,
    default: 1,
  },
  // HM修改 定义默认搜索关键词(水印文字)
  placeholder: {
    type: String,
    default: "请输入搜索内容",
  },
  button: {
    type: String,
    default: "outside",
  },
  show: {
    type: Boolean,
    default: true,
  },
  radius: {
    type: Number,
    default: 60,
  },
});

const themeColor = mHelper.getThemeColor();

let state = reactive({
  active: false,
  isFocus: true,
  inputVal: "",
  searchName: "取消",
  isDelShow: false,
});

let emit = defineEmits(["input", "confirm", "search",]);

// HM修改 触发组件input事件
const inputChange = (e) => {
  const keyword = e.detail.value;
  emit("input", keyword);
  if (state.inputVal) {
    state.isDelShow = true;
  }
};
const focus = () => {
  state.active = true;
  // HM修改 增加获取焦点判断
  if (state.inputVal) {
    state.isDelShow = true;
  }
};
const blur = () => {
  state.isFocus = false;
  uni.hideKeyboard();
  if (!state.inputVal) {
    state.active = false;
  }
};
const clear = () => {
  // HM修改 收起键盘
  uni.hideKeyboard();
  state.isFocus = false;
  state.inputVal = "";
  state.active = false;
  emit("input", "");
};
const search = () => {
  emit("search", state.inputVal ? state.inputVal : (props.placeholder === "请输入关键字" ? "" : props.placeholder));
};

watch(
  () => state.inputVal,
  (newVal) => {
    if (newVal) {
      state.searchName = "搜索";
    } else {
      state.searchName = "取消";
      state.isDelShow = false;
    }
  }
);
</script>
<style lang="scss">
.rf-search-input {
	display: flex;
	width: 100%;
	box-sizing: border-box;
	font-size: $font-base;
	.content {
		display: flex;
		align-items: center;
		width: 100%;
		height: 60rpx;
		background: #fff;
		overflow: hidden;
		transition: all 0.2s linear;
		border-radius: 30px;
		.content-box {
			width: 100%;
			display: flex;
			align-items: center;
			.search-icon {
				color: $font-color-light;
				margin: 0 6rpx 0 12rpx;
			}
			&.center {
				justify-content: center;
			}
			.input {
				width: 100%;
				max-width: 100%;
				line-height: 60rpx;
				height: 60rpx;
				transition: all 0.2s linear;
				&.center {
					width: 200rpx;
				}
				&.sub {
					width: auto;
					color: grey;
				}
			}
		}
		.search-btn {
			height: 100%;
			flex-shrink: 0;
			padding: 0 30rpx;
			line-height: 60rpx;
			transition: all 0.3s;
		}
	}
	.button {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		flex-shrink: 0;
		width: 0;
		transition: all 0.2s linear;
		white-space: nowrap;
		overflow: hidden;
		&.active {
			padding-left: 15rpx;
			width: 100rpx;
		}
	}
}
</style>
