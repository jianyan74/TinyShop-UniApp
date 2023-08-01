<template>
  <view class="rf-invoice">
    <view v-if="state.invoiceList.length > 0 && !state.loading" class="mt-base">
      <view
        v-for="(item, index) in state.invoiceList"
        :key="index"
        class="rf-carrier mb-base"
        @tap="checkInvoice(item)"
      >
        <!-- 删除按钮 -->
        <view class="rf-carrier__menu" :class="'bg-' + themeColor.name">
          <rf-icon size="60" name="iconiconfontshanchu1" @rfComponentClick="deleteInvoice(item.id)" />
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
          @touchend="state.isStop = false"
        >
          <view>
            <view class="mb-base flex">
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
              <text>发票抬头: {{ item.title }}</text>
            </view>
            <view>
              [{{ Number(item.type) === 1 ? "公司" : "个人" }}] —
              {{ item.duty_paragraph || "个人发票无税号" }}
            </view>
          </view>
          <rf-icon
            name="iconbianji"
            @rfComponentClick="addInvoice('edit', item.id)"
          />
        </view>
      </view>
      <rf-load-more
        v-if="state.invoiceList.length > 0"
        :status="state.loadingType"
      />
    </view>
    <view class="rf-bottom-btn btn-safe-area-bottom">
      <button
        class="rf-bottom-btn__btn"
        :class="'bg-gradual-' + themeColor.name"
        @tap="addInvoice('add')"
      >
        新增发票
      </button>
    </view>
    <rf-empty
      v-if="state.invoiceList.length === 0 && !state.loading"
      info="暂无发票"
    />
    <!--加载动画-->
    <rf-loading :active="state.loading" />
  </view>
</template>
<script setup lang="ts">
// 下拉刷新
import { reactive, } from "vue";
import {
  onLoad,
  onPullDownRefresh,
  onReachBottom,
  onShow,
} from "@dcloudio/uni-app";
import mRouter from "@/utils/routerUtil";
import mHelper from "@/utils/helper";
import { Route, } from "@/response/route";
import mRouteConfig from "@/config/routes";
import memberApi from "@/api/tinyShop/member";
import { Invoice, } from "@/response/invoice";

const themeColor = mHelper.getThemeColor(); // 主题颜色

let state = reactive({
  source: 0,
  loadingType: "more",
  page: 1,
  invoiceList: [] as Invoice[],
  loading: true,
  theIndex: -1,
  oldIndex: -1,
  isStop: false,
  initXY: [] as number[],
});

onPullDownRefresh(() => {
  state.page = 1;
  state.invoiceList.length = 0;
  getInvoiceList("refresh");
});
// 加载更多
onReachBottom(() => {
  if (state.loadingType === "noMore") return;
  state.page++;
  getInvoiceList();
});

onShow(() => {
  initData();
});

onLoad((options: any) => {
  state.source = Number(options.source);
});

const deleteInvoice = (id: string) => {
  uni.showModal({
    content: "确定要删除该发票吗",
    success: (e) => {
      if (e.confirm) {
        handleInvoiceDel(id);
      }
    },
  });
};
const handleInvoiceDel = async (id: string) => {
  try {
    await memberApi.handleInvoiceDel({}, `?id=${id}`);
    state.page = 1;
    state.invoiceList.length = 0;
    state.theIndex = -1;
    state.oldIndex = -1;
    await getInvoiceList();
  } catch (e) {
    //
  }
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

// 初始化数据
const initData = () => {
  state.loading = true;
  state.page = 1;
  state.invoiceList.length = 0;
  getInvoiceList();
};
// 获取发票列表
const getInvoiceList = async (type = "") => {
  try {
    const data = (await memberApi.getInvoiceList({
      page: state.page,
    })) as unknown as Invoice[];
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
    state.loadingType = data.length < 10 ? "noMore" : "more";
    state.invoiceList = [...state.invoiceList, ...data,];
  } catch (e) {
    //
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
    state.loading = false;
  }
};
// 选择发票
const checkInvoice = (item) => {
  if (state.source === 1) {
    (mHelper.prePage() as any).invoiceItem = item;
    mRouter.back();
  }
};
// 跳转至新增/编辑发票
const addInvoice = (type: string, id = "") => {
  navTo(mRouteConfig.invoiceManage, { type, id, });
};

const navTo = (route: Route, query = {}) => {
  mRouter.push({ route, query, });
};
</script>
<style lang="scss">
.rf-invoice {
  background-color: $page-color-base;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
