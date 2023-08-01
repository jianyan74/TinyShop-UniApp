<template>
	<view class="l-barrage">
		<view class="barrage-item" v-for="(item, index) in items" :key="index"
					:style="'top: ' + item.top + 'px;--animation-time:' + item.time + 's'">
			<block v-if="item.display">
				<image class="barrage-image" :src="item.image"></image>
				<text class="barrage-text">{{ item.text }}</text>
			</block>
		</view>
	</view>
</template>

<script>
let cycle;

export default {
  name: "l-barrage",
  props: {
    minTime: {
      type: Number,
      default: 4,
    },
    maxTime: {
      type: Number,
      default: 9,
    },
    minTop: {
      type: Number,
      default: 0,
    },
    maxTop: {
      type: Number,
      default: 40,
    },
    delayTime: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {
      items: [],
    };
  },
  methods: {
    add(item, time) {
      this.items.push({
        id: item.id,
        text: item.text,
        image: item.image,
        time: time,
        top: Math.ceil(Math.random() * (this.maxTop - this.minTop + 1) + this.minTop),
        display: 1,
      });
    },
    start(items = []) {
      this.items = [];
      cycle && (clearInterval(cycle));
      cycle = setInterval(() => {
        let time = Math.ceil(Math.floor(Math.random() * (this.maxTime - this.minTime + 8) + this.minTime));
        let item = items[0];
        this.add(item, time);
        items.splice(0, 1);
		 		items.push(item);
      }, Math.ceil(Math.floor(Math.random() * this.delayTime / 2 + this.delayTime / 2)) * 1000);
    },
  },
};
</script>

<style>
.l-barrage {
	z-index: 3;
	width: 100%;
	position: fixed;
}

.barrage-item {
	position: fixed;
	white-space: nowrap;

	animation: mymove var(--animation-time) linear forwards;
	animation-timing-function: linear;
	-webkit-animation-timing-function: linear;
	animation-fill-mode: forwards;

}

.barrage-image {
	display: inline-block;
	vertical-align: middle;
	width: 60rpx !important;
	height: 60rpx !important;
	margin-right: 10rpx;
	border-radius: 30rpx;
}

.barrage-text {
	font-size: 26rpx;
	vertical-align: middle;
	color: #FFFFFF;
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
	background: #000000;
	opacity: 0.7;
}

@keyframes mymove {
	from {
		transform: translateX(100vw);
	}

	to {
		transform: translateX(-100%);
	}
}

@-webkit-keyframes mymove {
	from {
		transform: translateX(100vw);
	}

	to {
		transform: translateX(-100%);
	}
}
</style>
