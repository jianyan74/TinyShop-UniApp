<template>
	<view class="rf-about">
		<view
			class="list-cell b-b"
			v-for="item in navList"
			:key="item.title"
			@tap="navTo(mRouteConfig.aboutDetail, {field: item.url, title: item.title})"
		>
			<text class="cell-tit">{{ item.title }}</text>
			<text class="cell-tip">{{ item.content }}</text>
			<rf-icon size="24" name="iconyou"></rf-icon>
		</view>
<!--		<view class="history-section">-->
<!--			<view class="sec-header">-->
<!--				<rf-icon name="iconshare"></rf-icon>-->
<!--				<text>分享商城二维码给好友</text>-->
<!--			</view>-->
<!--			<view class="qrcode-wrapper">-->
<!--				<view class="qrcode-img-wrapper">-->
<!--					<rf-qrcode class="qrcode" cid="qrcode2229" makeOnLoad :text="hostUrl"></rf-qrcode>-->
<!--				</view>-->
<!--				<text class="info">商城二维码</text>-->
<!--			</view>-->
<!--		</view>-->
	</view>
</template>
<script setup lang="ts">
import {Route,} from "@/response/route";
import mRouter from "@/utils/routerUtil";
import mSiteConfig from "@/config/site";  // 站点
import mRouteConfig from "@/config/routes";  // 路由管理
const navList = [
  // { title: "商城介绍", url: "", },
  { title: "注册协议", url: "register", },
  { title: "充值协议", url: "recharge", },
  { title: "隐私协议", url: "privacy", },
  { title: "会员开卡协议", url: "member_card", },
  { title: "会员权益细则", url: "member_card_rights", },
];

const hostUrl = mSiteConfig.hostURL; // 商城h5url
// 统一跳转接口
const navTo = (route:Route, query = {}) => {
  mRouter.push({ route, query, });
};

</script>
<style lang="scss">
/*关于商城*/
.rf-about {
  background-color: $page-color-base;
  position: absolute;
  width: 100%;
  height: 100%;
	padding: 20rpx 0;
	.history-section {
		padding: 30rpx 0 0;
		margin-top: 20rpx;
		background: #fff;
		border-radius: 10rpx;
		.sec-header {
			display: flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40rpx;
			margin-left: 30rpx;
			.iconfont {
				font-size: 44rpx;
				color: #5eba8f;
				margin-right: 16rpx;
				line-height: 40rpx;
			}
		}
		.qrcode-wrapper {
			padding: $spacing-lg 0;
			text-align: center;
			.qrcode-img-wrapper {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
}
</style>
