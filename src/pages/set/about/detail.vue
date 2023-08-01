<template>
  <view class="rf-about-detail">
    <view class="rf-about-detail__info">
      <view v-if="state.content" class="about-content">
        <rf-parser container-style="padding:20rpx" :content="state.content" lazy-load />
      </view>
    </view>
    <rf-empty v-if="!state.content && !state.loading" :info="`暂无${state.title}`" />
    <rf-loading :active="state.loading" />
  </view>
</template>
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { reactive } from 'vue'
import commonApi from '@/api/tinyShop/common'

onLoad((options) => {
  initData(options)
})

let state = reactive({
  title: '',
  content: '',
  loading: true,
  type: '',
})

// 数据初始化
const initData = (options) => {
  getProtocolDetail(options.field)
  uni.setNavigationBarTitle({
    title: options.title,
  })
}

// 初始化通用配置;
const getProtocolDetail = async (name) => {
  try {
    const data = (await commonApi.getProtocolDetail({ name })) as AnyObject
    state.content = data.content
    state.loading = false
  } catch (e) {
    // 捕获异常
    state.loading = false
  }
}
</script>
<style lang="scss">
.rf-about-detail {
  background-color: $page-color-base;
  position: absolute;
  width: 100%;
  height: 100%;
  &__info {
    .about-content {
      padding: $spacing-lg;
    }
    image {
      margin-top: 100rpx;
      width: 240rpx;
      height: 240rpx;
      border-radius: 50%;
    }
  }
}
</style>
