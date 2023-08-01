<template>
  <view class="rf-swiper-slide">
    <slot v-if="list.length > 0" name="header" />
    <swiper
      :autoplay="autoplay"
      :duration="duration"
      :indicator-dots="indicatorDots"
      :interval="interval"
      class="rf-swiper"
      vertical="true"
    >
      <swiper-item
        v-for="(item, index) in list"
        :key="index"
        class="rf-swiper-item"
        @tap="navTo"
      >
        <view class="text in1line">
          <text class="newsTitle">{{
            item.title || `${item.member_nickname} 拼团成功`
          }}
          </text>
        </view>
        <text class="iconfont iconyou icon-style font-sm font-color-base" />
      </swiper-item>
    </swiper>
  </view>
</template>

<script lang="ts" setup>

const indicatorDots = false;
const autoplay = true;
const interval = 2000;
const duration = 500;

defineProps({
  list: {
    type: Array,
    default() {
      return [];
    }
  }
});

const emit = defineEmits(["navTo"]);
const navTo = () => {
  emit("navTo");
};
</script>

<style lang="scss" scoped>
.text,
.icon-style {
  height: 80rpx;
  line-height: 80rpx;
}
.rf-swiper-slide {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 0 $spacing-lg;
  background-color: $color-white;
  border-radius: 20rpx;

  .rf-swiper {
    height: 100%;
    flex: 1;
    margin-left: 30rpx;

    .rf-swiper-item {
      display: flex;
      justify-content: space-between;

      .iconfont {
        color: $font-color-light;
      }
    }
  }
}
</style>
