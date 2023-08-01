<template>
  <view class="rf-evaluation">
    <view
      v-for="(item, index) in state.evaluationProductList"
      :key="index"
      class="rf-evaluation-item"
    >
      <!--商品信息-->
      <rf-base-product-item :product-detail="item" />
      <view
        v-if="state.evaluationType !== 'add'"
        class="border-bottom pt-base pb-base"
      >
        <rf-rate
          tip="整体评价"
          size="32"
          :value="item.scores"
          :index="index"
          margin="6"
          class="rate"
          :active-color="themeColor.color"
          @change="handleScoreChange"
        />
      </view>
      <!--详细描述信息-->
      <view class="rf-evaluation-item__textarea mt-base border-bottom pb-base">
        <textarea
          v-model="item.content"
          class="textarea font-base"
          maxlength="140"
          placeholder="宝贝满足您的期待吗？说说您的使用心得，分享给您想买的他们吧"
        />
        <view class="tips">
          <text
            v-if="
              item.content &&
                item.content.length > 0 &&
                item.content.length < 40
            "
          >
            您已输入<text class="f"> {{ item.content.length }} </text>字
          </text>
          <text v-if="item.content.length >= 40">
            还可输入 <text class="s"> {{ wordLimit(index) }} </text> 字
          </text>
        </view>
        <view v-if="state.evaluationType !== 'add'" class="anonymous">
          <switch
            :color="themeColor.color"
            :checked="item.is_anonymous === 1"
            @change="handleAnonymousChange($event, index)"
          />
          <view class="ml-base">
            {{
              item.is_anonymous === 1 ? "匿名" : "不匿名"
            }}
          </view>
        </view>
      </view>
      <!--上传图片-->
      <view class="rf-uploader">
        <view class="rf-uploader-content">
          <view class="uni-uploader-body">
            <view class="rf-uploader-content__files">
              <view v-for="(image, i) in item.imageList" :key="i">
                <view class="rf-uploader-content__file mb-sm">
                  <rf-image width="208" height="208" :src="image" />
                  <view
                    class="rf-uploader-content__close font-weight-500"
                    @tap="close(i, index)"
                  >
                    <rf-icon
                      name="iconxiaoxi_guanbi"
                      scale="0.8"
                      size="20"
                    />
                  </view>
                </view>
              </view>
              <view
                v-if="item.imageList.length < 8"
                class="rf-uploader-content__input-box"
              >
                <view
                  class="rf-uploader-content__input"
                  @tap="uploadImage(index)"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
      <!--发表评价-->
      <view class="pl-lg pr-lg">
        <button
          class="rf-confirm-btn"
          :class="'bg-gradual-' + themeColor.name"
          @tap="handleEvaluate(item)"
        >
          {{ state.evaluationType === "add" ? "我要追评" : "发表评价" }}
        </button>
      </view>
    </view>
    <rf-empty
      v-if="state.evaluationProductList.length === 0 && !state.loading"
      info="暂无待评价商品"
    />
    <rf-loading :active="state.loading" />
  </view>
</template>
<script setup lang="ts">
import { computed, reactive, } from "vue";
import { onLoad, } from "@dcloudio/uni-app";
import mRouter from "@/utils/routerUtil";
import memberApi from "@/api/tinyShop/member";
import commonApi from "@/api/tinyShop/common";
import mHelper from "@/utils/helper";
import { evaluationProductItem, } from "@/response/evaluation";
import {UploadImage,} from "@/response/upload";
import {Route} from "@/response/route";

const themeColor = mHelper.getThemeColor();

// 变量
let state = reactive({
  loading: true,
  evaluationType: "",
  evaluationProductList: [] as evaluationProductItem[],
  orderId: "",
});

onLoad((options) => {
  initData(options);
});

// 限制140字
const wordLimit = computed(() => {
  return (index) => {
    return 140 - state.evaluationProductList[index]?.content.length;
  };
});

// 数据初始化
const initData = async (options) => {
  state.evaluationProductList.length = 0;
  state.evaluationType = options.type;
  if (options.data) {
    state.evaluationProductList.push(JSON.parse(options.data));
    state.evaluationProductList.forEach((item) => {
      item.imageList = [];
      item.content = "";
      item.scores = 5;
      item.is_anonymous = 1;
    });
    state.loading = false;
  } else if (options.order_id) {
    state.orderId = options.order_id;
    await getOrderProductList();
  }
  let title = "发表评价";
  if (options.type === "add") {
    title = "追加评价";
  }
  // 设置标题
  uni.setNavigationBarTitle({
    title,
  });
};
const getOrderProductList = async () => {
  try {
    state.evaluationProductList = (await memberApi.getOrderProductIndex({
      order_id: state.orderId,
      is_evaluate: 0,
    })) as unknown as evaluationProductItem[];
    state.loading = false;
    state.evaluationProductList.forEach((item) => {
      item.imageList = [];
      item.content = "";
      item.scores = 5;
      item.is_anonymous = 1;
    });
  } catch (e) {
    state.loading = false;
  }
};
// 评分监听事件
const handleScoreChange = (e) => {
  state.evaluationProductList[e.index].scores = e.value;
};
// 监听是否匿名
const handleAnonymousChange = (e, index) => {
  console.log(e.detail.value);
  state.evaluationProductList[index].is_anonymous = e.detail.value ? 1 : 0;
};
// 删除已选中图片
const close = (e, index: number) => {
  state.evaluationProductList[index].imageList.splice(e, 1);
};
// 监听图片上传
const uploadImage = (index: number) => {
  // 从相册选择6张图
  uni.chooseImage({
    count: 6,
    sizeType: ["original", "compressed",],
    sourceType: ["album", "camera",],
    success: async function (res) {
      await handleUploadFile(res.tempFilePaths, index);
    },
  });
};
// 依次上传图片
const handleUploadFile = async (data, index: number) => {
  for (const item of data) {
    try {
      const data = (await commonApi.handleUploadImage({
        filePath: item,
        name: "file",
      })) as unknown as UploadImage;
      state.evaluationProductList[index].imageList.push(data.url);
    } catch (e) {
      //
    }
  }
};
// 提交评价
const handleEvaluate = (item) => {
  const params: AnyObject = {};
  if (state.evaluationType !== "add") {
    let data: AnyArray = [];
    data.push({
      order_product_id: item.id,
      is_anonymous: item.is_anonymous,
      covers: item.imageList,
      scores: item.scores,
      content: item.content,
    });
    params.evaluate = JSON.stringify(data);
    handleEvaluateCreate(params);
  } else {
    params.order_product_id = item.id;
    params.again_content = item.content;
    params.again_covers = JSON.stringify(item.imageList);
    handleEvaluateAgain(params);
  }
};
// 发表评价
const handleEvaluateCreate = async (params) => {
  try {
    await memberApi.handleEvaluateCreate(params);
    if (state.evaluationProductList.length === 1) {
      const route: Route = {path: '/pages/tab/profile/profile', name: '我的'};
      mRouter.reLaunch({route})
    } else {
      await getOrderProductList();
    }
  } catch (e) {
    //
  }
};
// 追加评价
const handleEvaluateAgain = async (params) => {
  try {
    await memberApi.handleEvaluateAgain(
      params,
      `?order_product_id=${params.order_product_id}`
    );
    mRouter.back();
  } catch (e) {
    //
  }
};
</script>
<style lang="scss">
.rf-evaluation {
  background-color: $page-color-base;
  margin-bottom: $spacing-lg;
  padding-top: 5rpx;
  .rf-evaluation-item {
    margin: $spacing-base;
    padding: $spacing-lg;
    background-color: $color-white;
    border-radius: 12rpx;
    box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.05);
    &__textarea {
      height: 360rpx;
      position: relative;
      .tips {
        position: absolute;
        bottom: $spacing-lg;
        right: 0;
        font-size: $font-sm;
        color: $font-color-light;
        .f {
          color: $uni-color-success;
        }
        .s {
          color: $uni-color-primary;
        }
      }
      .anonymous {
        color: $font-color-light;
        position: absolute;
        font-size: $font-lg + 8rpx;
        bottom: $spacing-sm;
        left: -24rpx;
        transform: scale(0.6);
        display: flex;
        align-items: center;
      }
    }
  }
  .border-bottom {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}
</style>
