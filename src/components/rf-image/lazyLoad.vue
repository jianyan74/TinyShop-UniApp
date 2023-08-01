<template>
	<view class="muqian-content" :style="{
			width,
			height,
		}">
		<!-- 加载中 -->
		<image :src="loadSrc" class="muqian-image muqain-load" @load="init"  mode="scaleToFill" :style="{
				opacity:isShow?'0':'1',
				borderRadius,
				width,
				height,
				transition: `opacity ${duration/1000}s ${effect}`
				}"></image>

		<!-- 加载成功 -->
		<image class="muqian-image" @load="load" @error="error" v-if="status==1" :src="src" mode="scaleToFill" :style="{
				opacity:isShow?'1':'0',
				borderRadius,
				width,
				height,
				transition: `opacity ${duration/1000}s ${effect}`
				}">
		</image>
		<!-- 加载失败 -->
		<image class="muqian-image" v-if="status==2" :src="errorSrc" mode="scaleToFill" :style="{
			opacity:isShow?'1':'0',
			borderRadius,
			width,
			height,
			transition: `opacity ${duration/1000}s ${effect}`
			}">
		</image>

	</view>
</template>

<script>
let loadTimer = null;
import loadingImage from "../../static/loading.png";
import loadFailImage from "../../static/loadFail.png";
/**
	 * 懒加载插件
	 * @description 懒加载插件
	 *
	 * @property {String}			borderRadius		图片圆角,必须带尺寸单位
	 * @property {String}			width				图片宽度,必须带尺寸单位(默认100%)
	 * @property {String}			height				图片高度,必须带尺寸单位(默认100%)
	 * @property {String}			src					图片链接,不传的话会一直是加载中状态
	 * @property {String|Number}	minTimeOut			当图片加载过快(存在缓存)至少显示多少秒加载动画
	 * @property {String} 			effect = [linear|ease|ease-in|ease-out|ease-in-out] 过渡效果,可以用cubic-bezier
	 * 	@value linear 		规定以相同速度开始至结束的过渡效果(默认)
	 * 	@value ease  		规定慢速开始,然后变快,然后慢速结束的过渡效果
	 * 	@value ease-in 		规定以慢速开始的过渡效果
	 * 	@value ease-out		规定以慢速结束的过渡效果
	 * 	@value ease-in-out  规定以慢速开始和结束的过渡效果
	 * @property {String|Number}			duration	图片加载成功后的过渡时间,单位毫秒
	 * @property {Object}			showDistance		 当图片到屏幕哪个位置的时候开始加载,单位px,可以是负数 (默认{bottom:0})
	 * @property {String}			loadSrc				加载中显示的图片，输入网络路径或绝对路径
	 * @property {String}			errorSrc			加载失败显示的图片，输入网络路径或绝对路径
	 * @event {Function} show 当图片进入页面触发
	 * @event {Function} showSuccess 当图片完全加载完毕触发
	 * @example <muqian-lazyLoad :src="src" width="100rpx" height="100rpx"></muqian-lazyLoad>
	 */

export default {
  name: "muqian-lazyLoad",
  props: {
    //图片圆角 必须带尺寸单位
    borderRadius: {
      type: String,
      default: "0",
    },
    //图片宽度
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
    //图片链接
    src: {
      type: String,
      default: "",
    },
    //当图片加载过快(存在缓存)至少显示多少秒加载动画
    minTimeOut: {
      type: String || Number,
      default: "300",
    },
    //当图片到屏幕哪个位置的时候开始加载 单位px 可以是负数
    showDistance: {
      type: Object,
      default: () => {
        20;
      },
    },
    //过渡效果  linear / ease / ease-in / ease-out / ease-in-out
    effect: {
      type: String,
      default: "linear",
    },
    //图片加载成功后的过渡时间 单位毫秒
    duration: {
      type: String || Number,
      default: "300",
    },
    //加载中图片
    loadSrc: {
      type: String,
      default: loadingImage,
    },
    //加载失败图片
    errorSrc: {
      type: String,
      default:loadFailImage,
    },

  },
  data() {
    return {
      status: 0, //0加载中 1加载成功 2加载失败
      isShow: false,
    };
  },
  watch: {
    //当链接变化重新加载
    src() {
      if (!this.isShow) return;
      this.status = 0;
      this.isShow = false;
      this.$nextTick(() => {
        this.status = 1;
      });
    },
  },
  destroyed() {
    //页面销毁取消监听
    this.$emit("destroyed");
  },
  methods: {
    load() {
      if (this.minTimeOut == 0) {
        this.isShow = true;
      }else{
        let newTimer = new Date().getTime() - loadTimer;
        if (newTimer < this.minTimeOut) {
          setTimeout(() => {
            this.isShow = true;
          }, this.minTimeOut - newTimer);
        } else {
          this.isShow = true;
        }
      }

      setTimeout(()=>{
        this.$emit("showSuccess");
      },this.duration);
    },
    error() {
      this.status = 2;
      this.isShow = true;
    },
    init(){
      let intersectionObserver = uni.createIntersectionObserver(this);
      let load = false;
      //当图片加载完的时候取消监听
      this.$once("destroyed", () => {
        intersectionObserver.disconnect();
      });
      intersectionObserver.relativeToViewport(this.showDistance).observe(".muqain-load", (res) => {
        if (!load && res.intersectionRatio == 0) {
          load = true;
          return;
        }
        this.$emit("show");
        load = true;
        this.status = 1;
        loadTimer = new Date().getTime();
        intersectionObserver.disconnect();
      });
    },
  },

};
</script>

<style lang="scss" scoped>
	.muqian-content {
		overflow: hidden;
		position: relative;
		.muqian-image {
			display: block;
			will-change: transform;
		}

		.muqain-load {
			position: absolute;
			left: 0;
			top: 0;
		}
	}
</style>
