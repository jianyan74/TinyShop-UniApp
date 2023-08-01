<template>
  <view name="fade" v-if="!globalConfig.style_loading_is_open">
    <view class="mask" v-show="isActive" :class="{ 'full-screen': isFullScreen }" :style="{ backgroundColor }">
      <view class="spinner" :style="{ transform: `translate(-50%, -${translateY}%)` }">
        <slot>
          <loop v-if="globalConfig.style_loading_type === 'loop'" :color="themeColor.color" :size="size" />
          <shrinkRect
            v-else-if="globalConfig.style_loading_type === 'shrinkRect'"
            :color="themeColor.color"
            :size="size"
          />
          <loader-bounce
            v-else-if="globalConfig.style_loading_type === 'bounce'"
            :color="themeColor.color"
            :size="size"
          />
          <doubleBounce
            v-else-if="globalConfig.style_loading_type === 'doubleBounce'"
            :color="themeColor.color"
            :size="size"
          />
          <doubleCube
            v-else-if="globalConfig.style_loading_type === 'doubleCube'"
            :color="themeColor.color"
            :size="size"
          />
          <doubleDot
            v-else-if="globalConfig.style_loading_type === 'doubleDot'"
            :color="themeColor.color"
            :size="size"
          />
          <rotatePlane
            v-else-if="globalConfig.style_loading_type === 'rotatePlane'"
            :color="themeColor.color"
            :size="size"
          />
          <scaleOut v-else-if="globalConfig.style_loading_type === 'scaleOut'" :color="themeColor.color" :size="size" />
          <loop v-else :color="themeColor.color" :size="size" />
        </slot>
        <view v-if="text.length" :style="{ color: textColor }">
          {{ text }}
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
export default { name: 'rf-loading' };
</script>
<script setup lang="ts">
import Loop from './loaders/loop.vue';
import LoaderBounce from './loaders/bounce.vue';
import DoubleBounce from './loaders/double-bounce.vue';
import DoubleCube from './loaders/double-cube.vue';
import DoubleDot from './loaders/double-dot.vue';
import RotatePlane from './loaders/rotate-plane.vue';
import ScaleOut from './loaders/scale-out.vue';
import ShrinkRect from './loaders/shrink-rect.vue';
import { computed, ref, watch } from 'vue';
import { useStore } from '@/store';
const st = useStore();
const globalConfig = computed(() => {
  return st.getters['user/getGlobalConfig'];
});
const themeColor = computed(() => {
  return st.getters['theme/getThemeColor'];
});
const props = defineProps({
  active: { type: Boolean, default: false },
  translateY: { type: Number, default: 150 },
  size: { type: Number, default: 40 },
  text: { type: String, default: '' },
  color: { type: String, default: '#333' },
  textColor: { type: String, default: '#333' },
  isFullScreen: { type: Boolean, default: true },
  backgroundColor: { type: String, default: 'rgba(255, 255, 255, .9)' }
});
let isActive = ref(props.active);
watch(
  () => props.active,
  async (value: boolean) => {
    isActive.value = value;
  }
);
</script>
<style scoped>
.mask {
  width: 100%;
  max-height: 100vh;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: calc(env(safe-area-inset-bottom) / 2 + 90rpx);
  z-index: 998;
  transition: opacity 0.3s linear;
  overflow: hidden;
}

.full-screen {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.spinner {
  position: absolute;
  top: 60%;
  left: 50%;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
