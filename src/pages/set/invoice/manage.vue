<template>
	<view class="rf-invoice-manage rf-row-wrapper">
		<view class="row b-b">
			<text class="tit">发票类型</text>
			<radio-group class="invoice-type" @change="handleInvoiceTypeChange">
				<label
					class="invoice-type-item"
					v-for="(item, index) in state.invoiceType"
					:key="index"
				>
					<radio
						class="gender-item-radio"
						:color="themeColor.color"
						:value="'' + item.value"
						:checked="item.value === state.invoiceData.type"
					/>
					<text class="gender-item-text">{{ item.name }}</text>
				</label>
			</radio-group>
		</view>
		<view class="row b-b">
			<text class="tit">发票抬头</text>
			<input
				class="input"
				type="text"
				v-model="state.invoiceData.title"
				placeholder="请输入发票抬头"
			/>
		</view>
		<view class="row b-b" v-if="state.invoiceData.type === 1">
			<text class="tit">发票税号</text>
			<input
				class="input"
				type="text"
				v-model="state.invoiceData.duty_paragraph"
				placeholder="请输入发票税号"
			/>
		</view>
		<view class="row b-b">
			<text class="tit"><text class="font-sm">地址及电话</text></text>
			<input
				class="input"
				type="text"
				v-model="state.invoiceData.address"
				placeholder="请输入地址及电话"
			/>
		</view>
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch
				:checked="!!state.invoiceData.is_default"
				:color="themeColor.color"
				@change="switchChange"
			/>
		</view>
		<button
			class="add-btn"
      :class="'bg-gradual-' + themeColor.name"
			:disabled="state.btnLoading"
			:loading="state.btnLoading"
			@tap="confirm"
		>
			提交
		</button>
    <!--加载动画-->
    <rf-loading :active="state.loading"></rf-loading>
	</view>
</template>
<script setup lang="ts">

import {onLoad,} from "@dcloudio/uni-app";
import {reactive,} from "vue";
import mHelper from "@/utils/helper";
import mRouter from "@/utils/routerUtil";
import mChecker from "@/utils/checker"; // 表单验证
import mFormRule from "@/config/formRule";
import memberApi from "@/api/tinyShop/member";
import {Invoice,} from "@/response/invoice";
const themeColor = mHelper.getThemeColor(); // 主题颜色

onLoad((options) => {
  initData(options);
});

let state = reactive({
  invoiceData: {
    type: 2,
    title: "",
    duty_paragraph: "",
    is_default: "",
  }  as unknown as Invoice,
  btnLoading: false,
  loading: false,
  manageType: "",
  invoiceType: [
    { name: "公司", value: 1, },
    { name: "个人", value: 2, },
  ],
});

const initData = async (options) => {
  let title = "新增发票";
  if (options.type === "edit") {
    title = "编辑发票";
    state.loading = true;
    await getInvoiceDetail(options.id);
  }
  state.manageType = options.type;
  uni.setNavigationBarTitle({
    title,
  });
};
// 获取发票详情
const getInvoiceDetail = async (id:string) => {
  try {
    state.invoiceData = await memberApi.getInvoiceDetail({id,}) as unknown as Invoice;
    state.loading = false;
  } catch (e) {
    //
    state.loading = false;
  }
};
const handleInvoiceTypeChange = (e) => {
  state.invoiceData.type = Number(e.detail.value);
};
const switchChange = (e) => {
  state.invoiceData.is_default = e.detail.value ? "1" : "0";
};
// 提交
const confirm = () => {
  let checkSendCode;
  if (state.invoiceData.type === 1) {
    checkSendCode = mChecker.check(
      state.invoiceData,
      mFormRule.cInvoiceRule
    );
  } else if (state.invoiceData.type === 2) {
    checkSendCode = mChecker.check(
      state.invoiceData,
      mFormRule.pInvoiceRule
    );
  }
  if (!checkSendCode) {
    mHelper.toast(mChecker.error);
    return;
  }
  state.btnLoading = true;
  if (state.manageType === "edit") {
    handleInvoiceUpdate(state.invoiceData);
  } else {
    handleInvoiceCreate(state.invoiceData);
  }
};
// 编辑发票
const handleInvoiceUpdate = async(params) => {
  try {
    await memberApi.handleInvoiceUpdate(params, `?id=${params.id}`);
    state.btnLoading = false;
    mHelper.toast("恭喜您, 发票修改成功！");
    mRouter.back();
  } catch (e) {
    //
    state.btnLoading = false;
  }
};
// 新增发票
const handleInvoiceCreate = async (params) => {
  try {
    await memberApi.handleInvoiceCreate(params);
    state.btnLoading = false;
    mHelper.toast("恭喜您, 发票添加成功！");
    mRouter.back();
  } catch (e) {
    //
    state.btnLoading = false;
  }
};
</script>
<style lang="scss">
.rf-invoice-manage {
  background: $page-color-base;
	padding-top: $spacing-base;
  position: absolute;
  width: 100%;
  height: 100%;
	.invoice-type-item {
		margin-right: $spacing-base;
		.gender-item-text {
			margin-left: $spacing-sm;
		}
		.gender-item-radio {
			transform: scale(0.8);
		}
	}
}
</style>
