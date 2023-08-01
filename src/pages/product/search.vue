<template>
  <view class="rf-search">
    <view class="rf-search__input">
      <rf-search
        :mode="2"
        button="inside"
        :placeholder="globalConfig.hot_search_default || '请输入关键字'"
        @search="doSearch"
      />
    </view>
    <view class="rf-search__content" @tap="blur">
      <scroll-view class="keyword-box" scroll-y>
        <view class="keyword-block">
          <view class="keyword-list-header">
            <view>历史搜索</view>
            <rf-icon
              size="36"
              name="iconiconfontshanchu1"
              @tap="oldDelete"
            />
          </view>
          <view class="keyword">
            <view
              v-for="(keyword, index) in state.oldKeywordList"
              :key="index"
              @tap="doSearch(keyword)"
            >
              {{ keyword }}
            </view
            >
          </view>
          <view v-if="state.oldKeywordList.length === 0" class="hide-hot-tis">
            <view>暂无记录</view>
          </view>
        </view>
        <view class="keyword-block">
          <view class="keyword-list-header">
            <view>热门搜索</view>
            <rf-icon size="36" :name="state.forbid" @tap="hotToggle" />
          </view>
          <view v-if="state.forbid === 'iconai47'" class="keyword">
            <view
              v-for="(keyword, index) in globalConfig.hot_search_list || []"
              :key="index"
              @tap.stop="doSearch(keyword)"
            >
              {{ keyword }}
            </view
            >
          </view>
          <view v-else class="hide-hot-tis">
            <view>当前搜热门搜索已隐藏</view>
          </view>
        </view>
        <view v-if="state.hotKeywordList?.length === 0" class="hide-hot-tis ml-lg font-color-light">
          暂无热门搜索记录
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script setup lang="ts">
import {reactive,} from "vue";
import {onLoad,} from "@dcloudio/uni-app";
import mRouteConfig from "@/config/routes";
import {Route,} from "@/response/route";
import mRouter from "@/utils/routerUtil";
import mHelper from "@/utils/helper";

const globalConfig = mHelper.getGlobalConfig(); // 通用配置
// 变量
let state = reactive({
  keyword: "",
  oldKeywordList: [] as string[],
  hotKeywordList: [],
  keywordList: [] as AnyObject[],
  forbid: "iconai47",
  type: "",
});

onLoad((options) => {
  initData(options);
});

// 初始化数据
const initData = async (options) => {
  state.type = options.type;
  const search = JSON.parse(options.data || "{}");
  state.hotKeywordList = search.hot_search_list;
  loadOldKeyword();
};
// 失去表单焦点
const blur = () => {
  uni.hideKeyboard();
};
// 加载历史搜索,自动读取本地Storage
const loadOldKeyword = () => {
  uni.getStorage({
    key: "OldKeys",
    success: res => {
      state.oldKeywordList = JSON.parse(res.data);
    },
  });
};
// 顶置关键字
const setKeyword = (keyword:string) => {
  state.keyword = keyword;
};
// 清除历史搜索
const oldDelete = () => {
  uni.showModal({
    content: "确定清除历史搜索记录？",
    success: res => {
      if (res.confirm) {
        state.oldKeywordList = [];
        uni.removeStorage({ key: "OldKeys", });
      }
    },
  });
};
// 热门搜索开关
const hotToggle = () => {
  state.forbid = state.forbid === "iconai47" ? "iconyanjing" : "iconai47";
};
// 执行搜索
const doSearch = (val:string) => {
  let key = val || state.keyword;
  state.keyword = key;
  saveKeyword(key); // 保存为历史
  if (state.type === "order") {
    navTo(mRouteConfig.orderSearch, {keyword: key,});
  } else {
    navTo(mRouteConfig.productList, {keyword: key,});
  }
};
// 通用跳转
const navTo = (route:Route, query = {}) => {
  mRouter.push({ route, query, });
};
// 保存关键字到历史记录
const saveKeyword = (keyword:string) => {
  if (!keyword) return;
  uni.getStorage({
    key: "OldKeys",
    success: res => {
      let OldKeys = JSON.parse(res.data);
      let findIndex = OldKeys.indexOf(keyword);
      if (findIndex === -1) {
        OldKeys.unshift(keyword);
      } else {
        OldKeys.splice(findIndex, 1);
        OldKeys.unshift(keyword);
      }
      // 最多10个纪录
      OldKeys.length > 10 && OldKeys.pop();
      uni.setStorage({
        key: "OldKeys",
        data: JSON.stringify(OldKeys),
      });
      state.oldKeywordList = OldKeys; // 更新历史搜索
    },
    fail: () => {
      let OldKeys = [keyword,];
      uni.setStorage({
        key: "OldKeys",
        data: JSON.stringify(OldKeys),
      });
      state.oldKeywordList = OldKeys; // 更新历史搜索
    },
  });
};
</script>
<style lang="scss">
.rf-search {
	&__input {
		background-color: rgb(242, 242, 242);
		padding: 15rpx 2.5%;
	}
  &__content {
		width: 100%;
		background-color: rgb(242, 242, 242);
		.keyword-box {
			border-radius: 20rpx 20rpx 0 0;
			background-color: #fff;
			.keyword-block {
				padding: 10rpx 0;
				.keyword-list-header {
					width: 100vw;
					padding: 10rpx 3%;
					font-size: 27rpx;
					color: #333;
					display: flex;
					justify-content: space-between;
				}
				.keyword {
					width: 100vw;
					padding: 3px 3%;
					display: flex;
					flex-flow: wrap;
					justify-content: flex-start;
				}
				.hide-hot-tis {
					display: flex;
					justify-content: center;
					font-size: 28rpx;
					color: #6b6b6b;
				}
				.keyword > view {
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 60rpx;
					padding: 0 20rpx;
					margin: 10rpx 20rpx 10rpx 0;
					height: 60rpx;
					font-size: 28rpx;
					background-color: rgb(242, 242, 242);
					color: #6b6b6b;
				}
			}
		}
	}
}
</style>
