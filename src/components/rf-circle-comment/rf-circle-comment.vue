<template>
  <view v-if="state.isShow" class="rf-circle-comment">
    <view class="mask" @tap.stop="state.isShow = false"></view>
    <view class="comment-bottom">
      <view class="feedback-body feedback-uploader rf-uploader">
        <view class="uni-uploader">
          <view class="uni-uploader-body">
            <view class="uni-uploader__files">
              <view
                v-for="(image, index) in state.imageList"
                :key="index"
                class="uni-uploader__file p-relative"
              >
                <rf-image width="196" height="196" class="uni-uploader__img" :src="image"></rf-image>
                <view
                  class="close-view"
                  @tap="close(index)"
                  :class="'bg-' + themeColor.name"
                  >x</view
                >
              </view>
              <view class="video-wrap" v-if="state.video">
                <video class="video" :src="state.video"></video>
                <view
                  class="close iconfont iconguanbi"
                  @tap="closeVideo"
                  :class="'bg-' + themeColor.name"
                ></view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <textarea
        class="bottom-textarea"
        :cursor-spacing="setHeight()"
        v-model="state.content"
        placeholder-style="color:#999"
        :placeholder="placeholder"
      />
      <view class="bottom-view" id="bottomView">
<!--        <view-->
<!--          class="send-btn iconfont iconshipin"-->
<!--          :class="'text-' + themeColor.name"-->
<!--          @tap="uploadImage('video')"-->
<!--        ></view>-->
        <view
          class="send-btn iconfont icontupian2"
          :class="'text-' + themeColor.name"
          @tap="uploadImage('photo')"
        ></view>
        <view
          class="send-btn"
          :class="'text-' + themeColor.name"
          @click="clickSend()"
          >发送</view
        >
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onMounted, reactive, } from "vue";
import mHelper from "@/utils/helper";
import commonApi from "@/api/tinyShop/common";
import { UploadImage, } from "@/response/upload";

defineProps({
  placeholder: {
    type: String,
    default: "请输入评论内容…",
  },
});

// 常量
const themeColor = mHelper.getThemeColor(); // 主题颜色

// 变量
let state = reactive({
  imageList: [] as string[],
  video: "",
  isShow: false,
  content: "",
});

const emit = defineEmits(["sendComment",]);

onMounted(() => {
  state.imageList = [];
  state.video = "";
  state.content = "";
});

const setHeight = () => {
  return uni.upx2px(80);
};
const clickSend = () => {
  // let content = state.content;
  // if (state.imageList.length > 0) {
  //   state.imageList.forEach((item) => {
  //     content = `<img alt="" style="width: 31%; display: inline-block; margin-bottom: 3px; right: 2%;" src="${item}" /> ${content}`;
  //   });
  // }
  // if (state.video) {
  //   content = `<video style="width: 32px; height: 240px;" src="${state.video}"></video> ${content}`;
  // }
  emit("sendComment", state.content);
  // 发送后清空数据
  state.content = "";
  state.isShow = false;
  state.imageList = [];
};
// 删除已选中图片
const close = (e) => {
  state.imageList.splice(e, 1);
};
// 删除已选中图片
const closeVideo = () => {
  state.video = "";
};
// 打开相册选图
const uploadImage = (type) => {
  if (type === "photo") {
    uni.chooseImage({
      count: 1, // 最多一次可以选择的图片张数
      sizeType: ["compressed",],
      sourceType: ["album", "camera",], // album 从相册选图，camera 使用相机
      success: function (res: AnyObject) {
        handleUploadFile(res.tempFilePaths[0]);
      },
    });
  } else {
    uni.chooseVideo({
      sourceType: ["camera", "album",],
      success: function (res) {
        handleUploadVideo(res.tempFilePath);
      },
      fail: function () {
        //
      },
    });
  }
};
// 依次上传图片
const handleUploadFile = async (filePath) => {
  try {
    const data = (await commonApi.handleUploadImage({
      filePath,
      name: "file",
    })) as unknown as UploadImage;
    state.content = data.url;
    state.imageList.push(data.url);
    clickSend();
  } catch (e) {
    //
  }
};
// 上传视频
const handleUploadVideo = async (filePath) => {
  try {
    const data = (await commonApi.handleUploadVideo({
      filePath,
      name: "file",
    })) as unknown as UploadImage;
    state.video = data.url;
  } catch (e) {
    //
  }
};
const open = () => {
  state.isShow = true;
};
defineExpose({open,});
</script>
<style lang="scss">
.rf-circle-comment {
  z-index: 2;
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  .mask {
    width: 100%;
    flex: 1;
    background: rgba(0, 0, 0, 0.3);
  }
  .comment-bottom {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: white;
    position: absolute;
    bottom: 0;
    .bottom-textarea {
      margin: 20rpx auto 0;
      width: 92%;
      height: 210rpx;
      border-bottom: 1px solid #f6f6f6;
    }
    .bottom-view {
      margin: 0rpx 30rpx;
      display: flex;
      height: 80rpx;
      justify-content: flex-end;
      align-items: center;
      flex-direction: row;
      .send-btn {
        text-align: end;
        font-size: $font-base;
        align-items: center;
        margin-left: 36rpx;
      }
      .iconfont {
        font-size: $font-lg + 4rpx;
        font-weight: lighter;
        margin-left: 40rpx;
      }
    }
    .video-wrap {
      width: 600rpx;
      height: 360rpx;
      position: relative;
      .video {
        width: 600rpx;
        height: 360rpx;
      }
      .close {
        position: absolute;
        right: -14rpx;
        top: -14rpx;
        width: 32rpx;
        height: 32rpx;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: $font-sm;
        line-height: 1;
        z-index: 9999;
      }
    }
  }
}
</style>
