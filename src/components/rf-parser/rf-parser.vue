<template>
  <view class="rf-parser">
    <mp-html :content="content" :lazy-load="lazyLoad" :container-style="containerStyle"></mp-html>
  </view>
</template>
<script setup lang="ts">
import MpHtml from "mp-html/components/mp-html/mp-html.vue";

defineProps({
  content: {
    type: String,
    default: "",
  },
  containerStyle: {
    type: String,
    default: "",
  },
  lazyLoad: {
    type: Boolean,
    default: false,
  },
});

</script>
