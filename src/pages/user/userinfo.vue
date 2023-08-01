<template>
  <view class="rf-userinfo">
    <!--头像 + 背景-->
    <view class="rf-userinfo__user-section">
      <!--h5直接上传头像-->
      <view
        v-if="mHelper.platformGroupFilter('h5') === PlatformGroupEnum.TINYSHOP"
        class="portrait-box"
        @tap="uploadImage">
        <rf-image
          :src="state.profileInfo.head_portrait || headImg"
          border-radius="50%"
          class="portrait"
          height="160"
          width="160"
        />
      </view>
      <!--非h5裁剪头像上传-->
      <view v-if="mHelper.platformGroupFilter('h5') !== PlatformGroupEnum.TINYSHOP" class="portrait-box">
        <rf-avatar
          :avatar-src="state.profileInfo.head_portrait || headImg"
          :can-rotate="false"
          avatar-style="width: 160rpx; height: 160rpx; border-radius: 50%;"
          sel-height="400rpx"
          sel-width="200px"
          @upload="handleUploadFile"
        />
      </view>
      <view class="font-sm-2 mt-base font-color-light portrait-txt">
        点击头像更换照片
      </view>
    </view>
    <view class="rf-userinfo__input-content">
      <view class="input-item">
        <text class="tit">手机号</text>
        <view class="value font-color-base" @tap.stop="navTo(mRouteConfig.mobile, {mobile: state.profileInfo.mobile})">
          {{ state.profileInfo.mobile }}
          <rf-icon class="ml-sm  icon-color" name="iconyou" />
        </view>
      </view>
      <view class="input-item">
        <text class="tit">昵称</text>
        <view class="value font-color-base" @tap="openModal('nickname')">
          {{ state.profileInfo.nickname }}
          <rf-icon class="ml-sm  icon-color" name="iconyou" />
        </view>
      </view>
      <view class="input-item">
        <text class="tit">姓名</text>
        <view class="value font-color-base" @tap="openModal('realname')">
          {{ state.profileInfo.realname }}
          <rf-icon class="ml-sm icon-color" name="iconyou" />
        </view>
      </view>
      <view class="input-item">
        <text class="tit">性别</text>
        <picker
          :range="genders"
          :value="Number(state.profileInfo.gender)"
          range-key="name"
          :style="{flex: 1}"
          @change="handleGenderChange">
          <view class="value font-color-base">
            {{ genders[state.profileInfo.gender] && genders[state.profileInfo.gender].name }}
            <rf-icon class="ml-sm icon-color" name="iconyou" />
          </view>
        </picker>
      </view>
      <view class="input-item">
        <text class="tit">生日</text>
        <picker :style="{flex: 1}" :value="state.profileInfo.birthday" mode="date" @change="bindDateChange">
          <view class="value font-color-base">
            {{
              state.profileInfo.birthday || '请选择日期'
            }}
            <rf-icon class="ml-sm icon-color" name="iconyou" />
          </view>
        </picker>
      </view>
      <view class="input-item">
        <text class="tit">QQ</text>
        <view class="value font-color-base" @tap="openModal('qq')">
          {{ state.profileInfo.qq }}
          <rf-icon class="ml-sm icon-color" name="iconyou" />
        </view>
      </view>
      <view class="input-item">
        <text class="tit">邮箱</text>
        <view class="value font-color-base" @tap="openModal('email')">
          {{ state.profileInfo.email }}
          <rf-icon class="ml-sm icon-color" name="iconyou" />
        </view>
      </view>
    </view>
    <view v-if="state.modalShow" class="rf-userinfo__modal" @tap="closeModal">
      <view class="modal-box" @tap.stop="() => {}">
        <view class="pt-lg text-center">
          修改内容
        </view>
        <view class="p-lg">
          <input v-model="state.modalData.value" class="input" type="text">
        </view>
        <view class="flex-align-items w100 p-sm pb-base">
          <view class="flex-1 text-center" @tap.stop="closeModal">
            取消
          </view>
          <view :class="'text-' + themeColor.name" class="flex-1 text-center" @tap.stop="handleUpdateInfo">
            确认
          </view>
        </view>
      </view>
    </view>
    <!--加载动画-->
    <rf-loading :active="state.loading" />
  </view>
</template>
<script lang="ts" setup>
import {onLoad,} from "@dcloudio/uni-app";
import {reactive,} from "vue";

import mRouteConfig from "@/config/routes"; // 路由管理
import mRouter from "@/utils/routerUtil";
import mHelper from "@/utils/helper";
import commonApi from "@/api/tinyShop/common";
import memberApi from "@/api/tinyShop/member";
import mAssetsPath from "@/config/assets";

import {PlatformGroupEnum,} from "@/enum/loginEnum";
import {Member, Profile,} from "@/response/profile";
import {Route,} from "@/response/route";
import {UploadImage,} from "@/response/upload";

// 常量
const themeColor = mHelper.getThemeColor();
const headImg = mAssetsPath.headImg;
const genders = [
  {
    value: "0",
    name: "未知",
  },
  {
    value: "1",
    name: "男",
  },
  {
    value: "2",
    name: "女",
  },
];

// 变量
let state = reactive({
  profileInfo: {} as Member,
  loading: true,
  btnLoading: false,
  modalData: {
    key: "",
    value: "",
  },
  modalShow: false,
});

onLoad(() => {
  initData();
});

// 通用跳转封装
const navTo = (route: Route, query = {}) => {
  mRouter.push({route, query,});
};
// 上传头像
const uploadImage = () => {
  // 从相册选择图片
  uni.chooseImage({
    count: 1,
    sizeType: ["original", "compressed",],
    sourceType: ["album",],
    success: function (res) {
      handleUploadFile(res.tempFilePaths);
    },
  });
};
// 上传头像
const handleUploadFile = async (data) => {
  const filePath = data.path || data[0];
  try {
    const data = await commonApi.handleUploadImage({filePath, name: "file",}) as unknown as UploadImage;
    state.profileInfo.head_portrait = data.url;
    await handleUpdateInfo();
  } catch (e) {
    //
  }
};
// 监听日期更改
const bindDateChange = (e) => {
  state.profileInfo.birthday = e.detail.value;
  handleUpdateInfo();
};
// 监听性别更改
const handleGenderChange = (e) => {
  state.profileInfo.gender = e.detail.value;
  handleUpdateInfo();
};
// 数据初始化
const initData = () => {
  getMemberInfo();
};
// 获取用户信息
const getMemberInfo = async () => {
  state.loading = true;
  try {
    const data = await memberApi.getMemberInfo() as unknown as Profile;
    state.loading = false;
    state.profileInfo = data.member;
  } catch (e) {
    state.loading = false;
  }
};
// 更新用户信息
const handleUpdateInfo = async () => {
  state.btnLoading = true;
  let params: AnyObject;
  params = state.profileInfo;
  params[state.modalData.key] = state.modalData.value;
  try {
    await memberApi.handleMemberUpdate(params, {id: state.profileInfo.id,});
    state.btnLoading = false;
    state.modalShow = false;
    mHelper.toast("恭喜您, 资料修改成功!");
    initData();
  } catch (e) {
    state.btnLoading = false;
  }
};
// 打开编辑框
const openModal = (key: string) => {
  state.modalData.key = key;
  state.modalData.value = state.profileInfo[key];
  state.modalShow = true;
};
// 关闭编辑框
const closeModal = () => {
  state.modalData.value = "";
  state.modalShow = false;
};
</script>
<style lang="scss" scoped>
.rf-userinfo {
  background-color: $page-color-base;
  position: absolute;
  height: 100%;
  width: 100%;

  &__user-section {
    background-color: #fff;
    height: 320rpx;
    width: 100%;
    padding-top: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .portrait-box {
      height: 160rpx;
      width: 160rpx;
    }
    .portrait-txt {
      height: 50rpx;
    }
  }

  &__input-content {
    margin-top: 16rpx;
    background-color: #fff;

    .input-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30rpx;
      height: 112rpx;
      line-height: 112rpx;

      &:not(:last-child) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      }

      .tit, .value {
        font-size: $font-lg;
      }
      .value {
        flex: 1;
        text-align: right;
        font-weight: 400!important;
      }
      .icon-color {
        color: rgba(0, 0, 0, 0.3);
        transform: rotate(-180deg);
      }
    }
  }

  &__modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 999;

    .modal-box {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      background-color: #fff;
      border-radius: 20rpx;

      .input {
        background-color: #efefef;
        padding: 0 10rpx;
        font-size: 28rpx;
        height: 56rpx;
        border-radius: 8rpx;
      }
    }
  }
}
</style>
