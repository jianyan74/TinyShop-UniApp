<template>
  <view class="rf-invoice-history">
    <view v-if="state.invoiceList.length > 0" class="rf-base-list">
      <view
        v-for="(item, index) in state.invoiceList"
        :key="index"
        class="rf-base-list__item"
        @tap="navTo(mRouteConfig.orderDetail, { id: item.order_id })"
      >
        <view class="font-color-light mb-base">
          订单号: {{ item.order_sn }}
        </view>
        <view class="flex-between mb-base">
          <view>
            {{ item.title
            }}<text v-if="item.explain">{{ ` - ${item.explain}` }}</text>
          </view>
          <view>
            开票金额: <text :class="'text-' + themeColor.name">{{
              item.tax_money
            }}</text>
          </view>
        </view>
        <view class="flex-between">
          <view class="in1line flex-align-items">
            <rf-tag
              :color="themeColor.color"
              :bg-color="`rgba(${themeColor.rgb}, 0.12)`"
              :border-radius="6"
              :text="Number(item.type) === 1 ? '公司' : '个人'"
            />
            <text class="ml-sm">{{
              item.duty_paragraph
            }}</text>
          </view>
          <text class="font-sm font-color-light">{{ time(item.created_at) }}</text>
        </view>
      </view>
      <rf-load-more
        v-if="state.invoiceList.length > 0"
        :status="state.loadingType"
      />
    </view>
    <rf-empty
      v-if="state.invoiceList.length === 0 && !state.loading"
      info="您还未购买任何商品"
    />
    <!--加载动画-->
    <rf-loading :active="state.loading" />
  </view>
</template>
<script setup lang="ts">
import { onLoad, onPullDownRefresh, onReachBottom, } from "@dcloudio/uni-app";
import { reactive, } from "vue";
import mHelper from "@/utils/helper";
import memberApi from "@/api/tinyShop/member";
import { Route, } from "@/response/route";
import mRouter from "@/utils/routerUtil";
import { formatToDateTime, } from "@/utils/dateUtil";
import { InvoiceOrder, } from "@/response/invoice";
import mRouteConfig from "@/config/routes"; // 路由管理

const themeColor = mHelper.getThemeColor(); // 主题颜色

onLoad(() => {
  initData();
});

let state = reactive({
  page: 1,
  invoiceList: [] as InvoiceOrder[],
  loading: true,
  loadingType: "more",
});

// 数据初始化
const initData = () => {
  getInvoiceList();
};
// 获取发票历史
const getInvoiceList = async (type = "") => {
  try {
    const data = (await memberApi.getOrderInvoiceList({
      page: state.page,
    })) as unknown as InvoiceOrder[];
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
    state.loadingType = data.length < 10 ? "noMore" : "more";
    state.invoiceList = [...state.invoiceList, ...data,];
  } catch (e) {
    //
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
  }
};

// 下拉刷新
onPullDownRefresh(() => {
  state.loading = true;
  state.page = 1;
  state.invoiceList = [];
  getInvoiceList("refresh");
});
// 加载更多
onReachBottom(() => {
  if (state.loadingType === "noMore") return;
  state.page++;
  getInvoiceList();
});
// 通用跳转
const navTo = (route: Route, query = {}) => {
  mRouter.push({ route, query, });
};
// 时间格式化
const time = (val: string) => {
  return formatToDateTime(parseInt(val) * 1000);
};
</script>
<style lang="scss">
.rf-invoice-history {
  background-color: $page-color-base;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
