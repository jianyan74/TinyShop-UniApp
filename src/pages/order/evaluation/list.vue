<template>
  <view class="rf-evaluation-list">
    <!--评价分类选项-->
    <view class="rf-evaluation-list__label">
      <view
        class="rf-evaluation-list__label__item"
        v-for="(label, index) in state.labelList"
        :class="index === state.labelIndex ? 'on bg-' + themeColor.name : ''"
        @tap="tabClick(index, label.type)"
        :key="index"
      >
        {{ label.name }}
        ({{ label.number }})
      </view>
    </view>
    <!--评价列表-->
    <view
      class="rf-evaluation-list__list mt-lg"
      v-if="state.evaluationList.length > 0"
    >
      <view
        class="rf-evaluation-list__list__item mb-base"
        v-for="(row, index) in state.evaluationList"
        :key="index"
      >
        <rf-image
          width="100"
          height="100"
          class="mr-base flex-shrink"
          border-radius="50%"
          :src="row.member_head_portrait || headImg"
        ></rf-image>
        <view class="right">
          <view>
            <view>
              {{ row.member_nickname || "匿名用户" }}
            </view>
            <view class="font-color-light font-sm">
              {{ time(row.created_at) }}
            </view>
          </view>
          <view class="flex">
            <text v-if="row.sku_name"
              >购买类型: {{ row.sku_name }}
            </text>
            <rf-rate
              size="16"
              disabled="true"
              :value="row.scores"
              :active-color="themeColor.color"
            />
          </view>
          <view>
            <view class="mt-base in10line">
              {{ row.content }}
            </view>
            <view class="img-video mt-sm">
              <view class="mr-sm mb-sm" v-for="item in row.covers" :key="item">
                <rf-image
                  :preview="true"
                  width="180"
                  height="180"
                  border-radius="12"
                  class="image"
                  :src="item"
                ></rf-image>
              </view>
            </view>
          </view>
          <view class="append" v-if="parseInt(row.has_again, 10) === 1">
            <view class="date">
              {{ againDay(row) }}
            </view>
            <view class="rat">
              {{ row.again_content }}
            </view>
            <view class="img-video mt-sm">
              <view
                class="mr-sm mb-sm"
                v-for="item in row.again_covers"
                :key="item"
              >
                <rf-image
                  :preview="true"
                  width="180"
                  height="180"
                  border-radius="12"
                  class="image"
                  :src="item"
                ></rf-image>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="text-center mt-lg pt-lg" v-else>暂无相关评价</view>
    <rf-loading :active="state.loading"></rf-loading>
  </view>
</template>
<script setup lang="ts">
import { onLoad, onPullDownRefresh, onReachBottom, } from "@dcloudio/uni-app";
import { reactive, } from "vue";
import mAssetsPath from "@/config/assets";
import mConstData from "@/config/constData";
import mHelper from "@/utils/helper";
import { formatToDateTime, } from "@/utils/dateUtil";
import productApi from "@/api/tinyShop/product";
import { Evaluation, EvaluationItem, } from "@/response/product";

const themeColor = mHelper.getThemeColor(); // 主题颜色

// 评价标签
interface LabelItem {
  name: string;
  number: string;
  type: AnyObject;
}

// 变量
let state = reactive({
  page: 1,
  labelList: [] as LabelItem[],
  evaluationList: [] as EvaluationItem[],
  evaluationInfo: {} as Evaluation,
  labelIndex: 0,
  typeParams: {},
  loadingType: "",
  productId: "",
  loading: true,
});

const headImg = mAssetsPath.headImg;

onLoad((options) => {
  state.productId = options.productId || "";
  initData();
});
// 下拉刷新
onPullDownRefresh(() => {
  state.loading = true;
  state.page = 1;
  state.evaluationList = [];
  getEvaluationList("refresh");
});
// 加载更多
onReachBottom(() => {
  if (state.loadingType === "noMore") return;
  state.page++;
  getEvaluationList();
});

// 时间格式化
const time = (val: string) => {
  return formatToDateTime(parseInt(val) * 1000);
};
// 计算评论与追评时间
const againDay = (val) => {
  const day =
      Number(formatToDateTime(Number(val.again_addtime) * 1000)) -
      Number(formatToDateTime(Number(val.created_at) * 1000));
  return day ? `${day}天后追加` : "当天追加";
};
// 初始化数据
const initData = () => {
  state.loading = true;
  state.page = 1;
  state.evaluationList = [];
  getEvaluationList();
};
// 切换评论类型
const tabClick = (index: number, type = "") => {
  state.typeParams = type;
  state.labelIndex = index;
  initData();
};
// 获取评论列表
const getEvaluationList = async (type = "") => {
  try {
    state.evaluationInfo = (await productApi.getEvaluateList({
      product_id: state.productId,
      page: state.page,
      ...state.typeParams,
    })) as unknown as Evaluation;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
    state.loading = false;
    state.evaluationList = [
      ...state.evaluationList,
      ...state.evaluationInfo.list,
    ];
    state.labelList = [
      { name: "全部", number: state.evaluationInfo.stat.total_num, type: {}, },
      {
        name: "好评",
        number: state.evaluationInfo.stat.good_num || "0",
        type: { explain_type: 3, },
      },
      {
        name: "中评",
        number: state.evaluationInfo.stat.ordinary_num || "0",
        type: { explain_type: 2, },
      },
      {
        name: "差评",
        number: state.evaluationInfo.stat.negative_num || "0",
        type: { explain_type: 1, },
      },
      {
        name: "有图",
        number: state.evaluationInfo.stat.cover_num || "0",
        type: { has_cover: 1, },
      },
      {
        name: "视频",
        number: state.evaluationInfo.stat.video_num || "0",
        type: { has_video: 1, },
      },
      {
        name: "追加",
        number: state.evaluationInfo.stat.again_num || "0",
        type: { has_again: 1, },
      },
    ];
  } catch (e) {
    state.loading = false;
    if (type === "refresh") {
      uni.stopPullDownRefresh();
    }
  }
};
</script>
<style lang="scss">
.rf-evaluation-list {
  background-color: $color-white;
  &__label {
    flex-wrap: wrap;
    display: flex;
    justify-content: center;
    &__item {
      width: 20%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 20rpx;
      height: 50rpx;
      border-radius: 25rpx;
      border: solid 1rpx #ddd;
      font-size: $font-base;
      margin: 10rpx 20rpx 10rpx 0;
      &.on {
        border: solid 1rpx;
      }
    }
  }
  &__list {
    padding: $spacing-base $spacing-lg;
    &__item {
      display: flex;
      .right {
        .img-video {
          display: flex;
          flex-wrap: wrap;
        }
        .append {
          flex-wrap: wrap;
          .date {
            width: 100%;
            height: 40rpx;
            border-left: 10rpx solid #f06c7a;
            padding-left: 10rpx;
            align-items: center;
            font-size: 32rpx;
            margin: 20rpx 0;
          }
        }
      }
    }
  }
}
</style>
