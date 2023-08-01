<template>
  <view class="rf-address-manage rf-row-wrapper">
    <view class="row b-b">
      <text class="tit">联系人</text>
      <input
        v-model="state.addressData.realname"
        class="input"
        type="text"
        placeholder="收货人姓名"
        @blur="handleRealNameChange"
      >
    </view>
    <view class="row b-b">
      <text class="tit">手机号</text>
      <input
        v-model="state.addressData.mobile"
        class="input"
        type="number"
        maxlength="11"
        placeholder="收货人手机号码"
        @blur="handleMobileChange"
      >
    </view>
    <block v-if="configList.address_select_type === 2">
      <view class="row b-b">
        <text class="tit">选择地址</text>
        <input
          v-model="state.addressData.details"
          class="input"
          type="text"
          disabled
          placeholder="请选择地址"
          @tap="handleLocationOpen"
        >
      </view>
      <view class="row b-b">
        <text class="tit">门牌号</text>
        <input
          v-model="state.addressData.street_number"
          class="input"
          type="text"
          placeholder="请输入门牌号"
        >
      </view>
    </block>
    <block v-else>
      <view class="row b-b">
        <text class="tit">选择地址</text>
        <!--地址三级联动-->
        <rf-pick-regions
          :address-data="state.addressData"
          @getRegions="handleGetRegions"
        />
      </view>
      <view class="row b-b">
        <text class="tit">详细地址</text>
        <input
          v-model="state.addressData.details"
          class="input"
          type="text"
          placeholder="请输入详细地址"
          @blur="bindAddressDetailsChange"
        >
      </view>
    </block>
    <view class="row default-row">
      <text class="tit">设为默认</text>
      <switch
        :checked="!!Number(state.addressData.is_default)"
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
    <rf-loading :active="state.loading" />
  </view>
</template>
<script setup lang="ts">
import {reactive,} from "vue";
import {onLoad,} from "@dcloudio/uni-app";
import mHelper from "@/utils/helper";
import mRouter from "@/utils/routerUtil";
import memberApi from "@/api/tinyShop/member";
import indexApi from "@/api/tinyShop";
import {AddressItem,} from "@/response/address";

// 常量
const themeColor = mHelper.getThemeColor();
const configList = mHelper.getGlobalConfig();

// 变量
let state = reactive({
  addressData: {} as AddressItem,
  btnLoading: false,
  loading: false,
  manageType: "",
});

onLoad((options) => {
  initData(options);
});

const handleLocationOpen = () => {
  uni.chooseLocation({
    success: function (res) {
      state.addressData.details = res.name;
      state.addressData.latitude = res.latitude.toString();
      state.addressData.longitude = res.longitude.toString();
      handleLocationToAddress(res.latitude, res.longitude);
    },
    fail: function (err) {
      mHelper.log(err);
    },
  });
};
// 经纬度转地址
const handleLocationToAddress = async (latitude: number, longitude: number) => {
  if (!longitude || !latitude) {
    return;
  }
  try {
    const data = await indexApi.handleLocationToAddress({
      location: `${longitude},${latitude}`,}) as AnyObject;
    state.addressData.area_id = data.adcode;
    state.addressData.province_id = "";
    state.addressData.city_id = "";
  } catch (e) {
    //
  }
};
// 获取选择的地区
const handleGetRegions = (e) => {
  state.addressData.province_id = e.province_id;
  state.addressData.city_id = e.city_id;
  state.addressData.area_id = e.area_id;
};
// 数据初始化
const initData = async (options) => {
  let title = "新增收货地址";
  if (options.type === "edit") {
    state.loading = true;
    title = "编辑收货地址";
    await getAddressDetail(options.id);
  } else {
    setTimeout(() => {
      if (options.first) {
        state.addressData.is_default = "1";
      }
      state.loading = false;
    }, 1000);
  }
  state.manageType = options.type;
  uni.setNavigationBarTitle({
    title,
  });
};
// 获取收货地址
const getAddressDetail = async (id:string) => {
  try {
    state.addressData = await memberApi.getAddressDetail({id,}) as unknown as AddressItem;
    state.loading = false;
  } catch (e) {
    state.loading = false;
  }
};
const handleRealNameChange = (e) => {
  state.addressData.realname = e.detail.value;
};
const bindAddressDetailsChange = (e) => {
  state.addressData.details = e.detail.value;
};
const handleMobileChange = (e) => {
  state.addressData.mobile = e.detail.value;
};
const switchChange = (e) => {
  state.addressData.is_default = e.detail.value;
};
// 提交
const confirm = () => {
  let data = state.addressData;
  if (!data.realname) {
    mHelper.toast("请填写收货人姓名");
    return;
  }
  if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(data.mobile)) {
    mHelper.toast("请输入正确的手机号码");
    return;
  }
  state.btnLoading = true;
  if (state.manageType === "edit") {
    handleAddressUpdate(data);
  } else {
    handleAddressCreate(data);
  }
};
const handleAddressUpdate = async (data) => {
  try {
    await memberApi.handleAddressUpdate({
      realname: data.realname,
      mobile: data.mobile,
      street_number: data.street_number,
      details: data.details,
      is_default: data.is_default ? 1 : 0,
      latitude: data.latitude,
      longitude: data.longitude,
      province_id: data.province_id,
      city_id: data.city_id,
      area_id: data.area_id,
    }, {id: data.id,});
    state.btnLoading = false;
    mHelper.toast("收货地址修改成功！");
    mRouter.back();
  } catch (e) {
    state.btnLoading = false;
  }
};
const handleAddressCreate = async (data) => {
  try {
    await memberApi.handleAddressCreate({
      realname: data.realname,
      mobile: data.mobile,
      street_number: data.street_number,
      details: data.details,
      is_default: data.is_default ? 1 : 0,
      latitude: data.latitude,
      longitude: data.longitude,
      province_id: data.province_id,
      city_id: data.city_id,
      area_id: data.area_id,
    });
    state.btnLoading = false;
    mHelper.toast("收货地址新增成功！");
    mRouter.back();
  } catch (e) {
    state.btnLoading = false;
  }
};
</script>
<style lang="scss">
.rf-address-manage {
  background: $page-color-base;
	padding-top: $spacing-base;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
