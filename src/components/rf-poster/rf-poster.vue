<template>
  <!-- 分享引导 -->
  <view
    v-if="show && poster"
    class="rf-poster"
    @touchmove.stop.prevent="stopPrevent"
  >
    <!-- 遮罩层 -->
    <view class="mask" @tap.stop="hidePoster" />
    <view class="content" @longtap="handleImageSave">
      <image class="poster-img" :src="poster" />
      <text class="tips" @touchstart.stop.prevent="() => {}"
      >长按保存到相册</text
      >
      <!--#ifndef MP-->
      <view
        class="poster-close"
        @touchstart.stop="() => {}"
        @tap.stop="hidePoster"
      >
        <text class="iconfont iconfork" />
      </view>
      <!--#endif-->
    </view>
  </view>
</template>

<script>
import mHelper from "@/utils/helper";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    poster: {
      type: String,
      default: "",
    },
  },
  methods: {
    stopPrevent() {
      this.$emit("hidePoster");
    },
    hidePoster() {
      this.$emit("hidePoster");
    },
    handleImageSave() {
      // #ifdef H5
      if (!mHelper.isWechat())
        mHelper.toast("普通H5暂不支持保存二维码，请截图保存");
      // #endif
      // #ifndef H5
      uni.showModal({
        content: "是否保存海报到相册",
        success: (confirmRes) => {
          if (confirmRes.confirm) {
            this.saveImage();
          }
        },
      });
      // #endif
    },
    saveImage() {
      uni.saveImageToPhotosAlbum({
        filePath: this.poster,
        success() {
          mHelper.toast("保存成功");
        },
      });
    },
  },
};
</script>

<style lang="scss">
.rf-poster {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 101;
  .mask {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.4);
  }
  .content {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 101;
    transform: translate(-50%, -50%);
    .poster-img {
      z-index: 999;
      display: inline-block;
      width: 600rpx;
      border-radius: 12rpx;
      height: 1000rpx;
    }
    .poster-close {
      z-index: 100;
      padding: $spacing-base;
      position: absolute;
      top: -86rpx;
      right: -68rpx;
      .iconfork {
        font-size: 54rpx;
        font-weight: 600;
        color: $color-white;
      }
    }
    .tips {
      color: $color-white;
      display: flex;
      margin-top: $spacing-lg;
      justify-content: center;
    }
  }
}
</style>
