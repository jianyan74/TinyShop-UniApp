<template>
	<view class="rf-feedback-detail">
		<view class="mt-lg mb-base font-lg">
			问题和意见
		</view>
		<view class="feedback-body">
			<textarea
				disabled
				:value="feedbackDetail.content"
				class="textarea"
			/>
		</view>
		<view class="mt-lg mb-base font-lg"
			v-if="feedbackDetail.covers && feedbackDetail.covers.length > 0"
		>
			图片
		</view>
		<view class="rf-uploader-body">
			<view class="rf-uploader__files">
				<block v-for="(image, index) in feedbackDetail.covers" :key="index">
					<view class="rf-uploader__file">
						<rf-image width="210" height="210" class="rf-uploader__img" :src="image"></rf-image>
					</view>
				</block>
			</view>
		</view>
    <view class="mt-lg mb-base font-lg">
      反馈类型
    </view>
		<view class="mt-base mb-base">
			<radio-group>
				<label
					v-for="(item, index) in feedbackType"
					:key="index"
				>
					<radio
            disabled
            class="scale-8"
						:color="themeColor.color"
						:value="item.value"
						:checked="item.value === feedbackDetail.type"
					/>
					<text class="mr-base">{{ item.name }}</text>
				</label>
			</radio-group>
		</view>
    <view class="mt-lg mb-base font-lg">
      QQ/邮箱/手机号
    </view>
		<view class="feedback-body">
			<input
				class="input"
				disabled
				:value="feedbackDetail.contact_way || '暂未留下联系方式'"
			/>
		</view>
    <view class="mt-lg mb-base font-lg">
      回复内容
    </view>
		<view class="feedback-body">
			<textarea
				disabled
				:value="feedbackDetail.reply || '管理员未回复'"
				class="textarea"
			/>
		</view>
    <rf-loading :active="loading"></rf-loading>
  </view>
</template>
<script setup lang="ts">
import {onLoad,} from "@dcloudio/uni-app";
import {ref,} from "vue";
import mHelper from "@/utils/helper";
import memberApi from "@/api/tinyShop/member";
import {Feedback,} from "@/response/feedback";
const themeColor = mHelper.getThemeColor(); // 主题颜色

const feedbackDetail = ref({} as Feedback);
const loading = ref(true);
const feedbackType = [
  {
    value: 1,
    name: "功能建议",
  },
  {
    value: 2,
    name: "BUG反馈",
  },
  {
    value: 3,
    name: "业务咨询",
  },
];
onLoad((options) => {
  initData(options);
});
// 数据初始化
const initData = (options) => {
  getFeedbackDetail(options.id);
};
// 获取反馈详情
const getFeedbackDetail = async (id:string) => {
  try {
    feedbackDetail.value = await memberApi.getOpinionDetail({id,}) as unknown as Feedback;
    loading.value = false;
  } catch (e) {
    loading.value = false;
  }
};
</script>
<style lang="scss">
.rf-feedback-detail {
  background-color: $page-color-base;
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 0 $spacing-lg;
  .feedback-body {
    background: $color-white;
    padding: $spacing-sm $spacing-base;
    .input {
      font-size: 28rpx;
      padding: 10rpx;
    }
    .textarea {
      height: 200rpx;
      width: 100%;
      box-sizing: border-box;
      padding: 10rpx 10rpx 0;
    }
  }
  .rf-uploader-body {
    margin-top: 16rpx;
  }
  .rf-uploader__files {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .rf-uploader__file {
    margin: 10rpx;
    width: 196rpx;
    height: 196rpx;
    position: relative;
  }
}
</style>
