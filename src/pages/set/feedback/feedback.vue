<template>
  <rf-navbar :border="false" :fixed="true" :status-bar="true" title="意见反馈" right-width="80" />
  <view class="rf-feedback" :style="{paddingTop: (mHelper.getNavTop() + 44)+'px'}">
    <view class="flex-between mt-base mb-base font-base">
      <text>问题和意见</text>
      <view class="feedback-select font-color-light">
        <text class="flex-align-items" @tap="chooseMsg">快速键入</text>
        <rf-icon size="26" name="iconxia" />
      </view>
    </view>
    <view class="feedback-body font-base">
      <textarea
        v-model="sendDate.content"
        class="textarea"
        placeholder="请详细描述您的问题和意见..."
      />
    </view>
    <view class="mt-lg mb-base  font-base">
      <text>图片(选填,提供问题截图,总大小10M以下)</text>
    </view>
    <view class="rf-uploader">
      <view class="rf-uploader-content">
        <view class="mt-sm mb-sm  font-base">
          <text>点击预览图片{{ imageList.length }}/9</text>
        </view>
        <view class="mt-base">
          <view class="rf-uploader-content__files">
            <block v-for="(image, index) in imageList" :key="index">
              <view class="rf-uploader-content__file">
                <rf-image
                  :src="image"
                  class="rf-uploader-content__img"
                  height="210"
                  width="210"
                />
                <view class="rf-uploader-content__close font-weight-500" @tap="close(index)">
                  <rf-icon name="iconxiaoxi_guanbi" scale="0.8" size="20" />
                </view>
              </view>
            </block>
            <view v-if="imageList.length < 9" class="rf-uploader-content__input-box">
              <view class="rf-uploader-content__input" @tap="uploadImage" />
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="mt-lg mb-base  font-base">
      <text>反馈类型</text>
    </view>
    <view class="mb-lg mt-lg">
      <radio-group @change="handleFeedbackTypeChange">
        <label
          v-for="(item, index) in feedbackType"
          :key="index"
        >
          <radio
            :checked="item.value === sendDate.type"
            :color="themeColor.color"
            :value="item.value"
            class="scale-8"
          />
          <text class="mr-base  font-base">{{ item.name }}</text>
        </label>
      </radio-group>
    </view>
    <view class="mt-lg mb-base  font-base">
      <text>QQ/邮箱/手机号</text>
    </view>
    <view class="feedback-body body-border">
      <input
        v-model="sendDate.contact_way"
        class="input"
        placeholder="(选填,方便我们联系您)"
      >
    </view>
    <button
      :class="'bg-gradual-' + themeColor.name"
      :disabled="btnLoading"
      :loading="btnLoading"
      class="rf-confirm-btn"
      @tap="send"
    >
      提交
    </button>
    <view class="mt-lg mb-base font-color-light text-center font-sm">
      反馈结果可在设置 -> 意见反馈 -> 点击列表后查看！
    </view>
  </view>
</template>
<script lang="ts" setup>
import {computed, ref,} from "vue";
import mHelper from "@/utils/helper";
import mRouter from "@/utils/routerUtil";
import commonApi from "@/api/tinyShop/common";
import memberApi from "@/api/tinyShop/member";
import {UploadImage,} from "@/response/upload";
import {onLoad} from "@dcloudio/uni-app";
import store from "@/store";

const themeColor = mHelper.getThemeColor(); // 主题颜色

// 登录状态
const hasLogin = computed(() => {
  return store.getters["user/hasLogin"];
});
onLoad(() => {
  if (!hasLogin.value) {
    uni.showModal({
      content: "目前暂未登录，是否跳转登录页面？",
      success: (confirmRes) => {
        if (confirmRes.confirm) {
          mHelper.backToLogin();
        }
      },
    });
  }
})

const msgContents = [
  "界面显示错乱",
  "启动缓慢，卡出翔了",
  "UI无法直视，丑哭了",
  "偶发性崩溃",
];
const imageList = ref([] as string[]);
const feedbackType = [
  {
    value: "1",
    name: "功能建议",
  },
  {
    value: "2",
    name: "BUG反馈",
  },
  {
    value: "3",
    name: "业务咨询",
  },
];
const sendDate = ref({
  type: "1",
  covers: "",
  content: "",
  contact_way: "",
});
const btnLoading = ref(false);

// 监听反馈类型事件
const handleFeedbackTypeChange = (e) => {
  sendDate.value.type = e.detail.value;
};
// 打开相册选图
const uploadImage = () => {
  uni.chooseImage({
    count: 9, // 最多一次可以选择的图片张数
    sizeType: ["compressed",],
    sourceType: ["album", "camera",], // album 从相册选图，camera 使用相机
    success: (res: AnyObject) => {
      if (imageList.value.length + res.tempFiles.length > 9) {
        mHelper.toast("不要贪心哦，最多只可上传9张照片");
        return;
      }
      handleUploadFile(res.tempFilePaths);
    },
  });
};
// 依次上传图片
const handleUploadFile = (data) => {
  data.forEach(async (item) => {
    try {
      const data = (await commonApi.handleUploadImage({
        filePath: item,
        name: "file",
      })) as unknown as UploadImage;
      imageList.value.push(data.url);
    } catch (e) {
      //
    }
  });
};
// 删除已选中图片
const close = (e) => {
  imageList.value.splice(e, 1);
};
// 快速输入
const chooseMsg = () => {
  uni.showActionSheet({
    itemList: msgContents,
    success: (res) => {
      sendDate.value.content = msgContents[res.tapIndex];
    },
  });
};
// 发送反馈
const send = async () => {
  btnLoading.value = true;
  sendDate.value.covers = JSON.stringify(imageList.value);
  try {
    await memberApi.handleOpinionCreate(sendDate.value);
    btnLoading.value = false;
    mRouter.back();
  } catch (e) {
    btnLoading.value = false;
  }
};
</script>
<style lang="scss">
.rf-feedback {
  background-color: #fff;
  width: 100%;
  height: 100%;
  padding: 5rpx $spacing-lg;
  .feedback-select {
    display: flex;
    justify-content: flex-end;
    flex-flow: row wrap;
    align-items: center;
  }
  .body-border {
    border: 1rpx solid rgba(0, 0, 0, 0.05);
    padding: 25rpx !important;
  }

  .feedback-body {
    background: $color-white;
    padding: $spacing-sm $spacing-base;

    .input {
      font-size: 26rpx;
    }

    .textarea {
      height: 250rpx;
      width: 100%;
      box-sizing: border-box;
      padding: 15rpx;
      font-size: 24rpx;
      border: 1rpx solid rgba(0, 0, 0, 0.05);
    }
  }
}
</style>
