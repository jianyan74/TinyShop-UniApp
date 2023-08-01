<template>
  <view class="rf-address-list">
    <view v-if="state.addressList.length > 0" class="mt-base">
      <view
        v-for="(item, index) in state.addressList"
        :key="index"
        class="rf-carrier mb-base"
        @tap="checkAddress(item)"
      >
        <!-- 删除按钮 -->
        <view class="rf-carrier__menu" :class="'bg-' + themeColor.name">
          <rf-icon
            size="60"
            name="iconiconfontshanchu1"
            @rfComponentClick="deleteAddress(item.id)"
          />
        </view>
        <view
          class="rf-carrier__item flex-between p-lg pr-lg"
          :class="[
            state.theIndex === index
              ? 'open'
              : state.oldIndex === index
                ? 'close'
                : '',
          ]"
          @touchstart="touchStart(index, $event)"
          @touchmove="touchMove(index, $event)"
          @touchend="touchEnd()"
        >
          <view>
            <view class="flex-align-items mb-sm">
              <view
                v-if="Number(item.is_default)"
                class="mr-sm">
                <rf-tag
                  :color="themeColor.color"
                  :bg-color="`rgba(${themeColor.rgb}, 0.12)`"
                  :border-radius="6"
                  text="默认"
                />
              </view>
              <text class="font-color-dark mr-base font-lg">{{ item.realname }}</text>
              <text class="mobile font-color-dark">{{ item.mobile }}</text>
            </view>
            <view class="in1line font-color-light">
              {{ item.name }} {{ item.details
              }}
            </view>
          </view>
          <rf-icon
            name="iconbianji"
            @rfComponentClick="addAddress('edit', item.id)"
          />
        </view>
      </view>
      <rf-load-more v-if="state.addressList.length > 0" :status="state.loadingType" />
    </view>
    <view class="rf-bottom-btn btn-safe-area-bottom">
      <button
        class="rf-bottom-btn__btn"
        :class="'bg-gradual-' + themeColor.name"
        @tap="addAddress('add')"
      >
        新增地址
      </button>
    </view>
    <rf-empty
      v-if="state.addressList.length === 0 && !state.loading"
      info="暂无收货地址，请添加地址"
    />
    <!--加载动画-->
    <rf-loading :active="state.loading" />
  </view>
</template>
<script setup lang="ts">
import {reactive,} from "vue";
import {
  onLoad,
  onPullDownRefresh,
  onReachBottom,
  onShow,
} from "@dcloudio/uni-app";
import memberApi from "@/api/tinyShop/member";
import mRouter from "@/utils/routerUtil";
import mHelper from "@/utils/helper";
import mRouteConfig from "@/config/routes"; // 路由管理

import { Route, } from "@/response/route";
import {AddressItem,} from "@/response/address";

// 常量
const themeColor = mHelper.getThemeColor();

// 变量
let state = reactive({
  source: "",
  page: 1,
  loading: true,
  loadingType: "more",
  addressList: [] as AddressItem[],
  theIndex: -1,
  oldIndex: -1,
  isStop: false,
  initXY: [] as number[],
});

// 下拉刷新
onPullDownRefresh(() => {
  state.page = 1;
  state.addressList = [];
  getAddressList("refresh");
});
// 加载更多
onReachBottom(() => {
  if (state.loadingType === "noMore") return;
  state.page++;
  getAddressList();
});

onLoad((option) => {
  state.source = option.source || "";
});
onShow(() => {
  initData();
});

const deleteAddress = (id: string) => {
  uni.showModal({
    content: "确定要删除该收货地址吗",
    success: (e) => {
      if (e.confirm) {
        handleAddressDelete(id);
      }
    },
  });
};
// 删除地址
const handleAddressDelete = async (id: string) => {
  try {
    await memberApi.handleAddressDelete({}, {id,});
    state.page = 1;
    state.addressList.length = 0;
    await getAddressList();
  } catch (e) {
    //
  }
};
// 数据初始化
const initData = () => {
  state.loading = true;
  state.page = 1;
  state.addressList.length = 0;
  getAddressList();
};
// 获取收货地址列表
const getAddressList = async (type = "") => {
  try {
    const data = (await memberApi.getAddressList({ page: state.page, })) as unknown as AddressItem[];
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
    state.loadingType = data.length < 10 ? "noMore" : "more";
    state.addressList = [...state.addressList, ...data,];
  } catch (e) {
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
  }
};
// 选择地址
const checkAddress = (item) => {
  if (state.source === "1") {
    // $mHelper.prePage()获取上一页实例，在App.vue定义
    mHelper.prePage().addressData = item;
    mRouter.back();
  }
};
// 跳转添加地址页面
const addAddress = (type: string, id = "") => {
  if (state.addressList.length) {
    navTo(mRouteConfig.addressManage, { type, id, });
  } else {
    navTo(mRouteConfig.addressManage, { type, id, first: true, });
  }
};

const navTo = (route: Route, query = {}) => {
  mRouter.push({ route, query, });
};

// 控制左滑删除效果
const touchStart = (index: number, event) => {
  // 多点触控不触发
  if (event.touches.length > 1) {
    state.isStop = true;
    return;
  }
  state.oldIndex = state.theIndex;
  state.theIndex = -1;
  // 初始坐标
  state.initXY = [event.touches[0].pageX, event.touches[0].pageY,];
};
const touchMove = (index: number, event) => {
  // 多点触控不触发
  if (event.touches.length > 1) {
    state.isStop = true;
    return;
  }
  let moveX = event.touches[0].pageX - state.initXY[0];
  let moveY = event.touches[0].pageY - state.initXY[1];

  if (state.isStop || Math.abs(moveX) < 5) {
    return;
  }
  if (Math.abs(moveY) > Math.abs(moveX)) {
    // 竖向滑动-不触发左滑效果
    state.isStop = true;
    return;
  }

  if (moveX < 0) {
    state.theIndex = index;
    state.isStop = true;
  } else if (moveX > 0) {
    if (state.theIndex !== -1 && state.oldIndex === state.theIndex) {
      state.oldIndex = index;
      state.theIndex = -1;
      state.isStop = true;
      setTimeout(() => {
        state.oldIndex = -1;
      }, 150);
    }
  }
};
const touchEnd = async () => {
  // 结束禁止触发效果
  state.isStop = false;
};
</script>
<style lang="scss">
.rf-address-list {
  background-color: $page-color-base;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
