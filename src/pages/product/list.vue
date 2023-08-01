<template>
  <view class="rf-product-base-list" :style="{ paddingTop: state.inputTop + 'px' }">
    <view class="rf-product-base-list__top">
      <view
        class="rf-product-base-list__header"
        :style="{
          width: `${state.topSafeWidth}px`,
          paddingTop: state.inputTop + 'px'
        }"
      >
        <rf-icon size="36" name="iconzuo" @tap="back" />
        <view class="rf-product-base-list__header__input-box">
          <input v-model="state.keyword" class="input" placeholder="请输入关键字" type="text" @confirm="search">
          <rf-icon class="search" name="iconsousuo2" @tap.stop="search" />
        </view>
      </view>
      <view class="rf-product-base-list__filter">
        <view class="rf-product-base-list__filter__top">
          <view
            class="flex-center flex-1"
            :class="[state.tabIndex === 0 ? `text-${themeColor.name} font-weight` : '']"
            @tap="screen(0)"
          >
            <text>{{ state.selectedName }}</text>
            <rf-icon
              size="28"
              :color="state.tabIndex === 0 ? themeColor.color : '#444'"
              :name="state.selectH > 0 ? 'iconshang' : 'iconxia'"
              :padding-top="state.selectH > 0 ? '2' : '8'"
            />
          </view>
          <view
            class="flex-center flex-1 font-weight-light"
            :class="[state.totalSalesOrderBy > 0 ? `text-${themeColor.name} font-weight` : '']"
            @tap="screen(1)"
          >
            <text class="font-weight-normal">销量</text>
            <view v-if="state.totalSalesOrderBy > 0">
              <rf-icon
                size="26"
                :color="themeColor.color"
                :name="state.totalSalesOrderBy === 1 ? 'iconarrow-fine-up' : 'iconjiantour-copy'"
              />
            </view>
          </view>
          <view class="flex-center flex-1 font-weight-500 font-color-dark" @tap="screen(2)">
            <rf-icon size="44" :name="state.isList > 0 ? 'iconliebiaoqiehuan' : 'iconfenlei'" />
          </view>
          <view class="flex-center flex-1" data-index="3" @tap="screen(3)">
            筛选
          </view>
          <!--下拉选择列表--综合-->
          <view v-if="state.selectH > 0" class="dropdown" :style="{ height: state.selectH + 'rpx' }">
            <view
              v-for="(item, index) in state.dropdownList"
              :key="index"
              class="dropdown-item"
              :class="item.selected ? 'font-weight' : ''"
              :data-index="index"
              @tap.stop="dropdownItem"
            >
              <text>{{ item.name }}</text>
              <rf-icon v-if="item.selected" size="38" name="icongouxuan" :class="'text-' + themeColor.name" />
            </view>
          </view>
          <view v-if="state.selectH > 0" class="dropdown-mask" @tap.stop="hideDropdownList" />
          <!--下拉选择列表--综合-->
        </view>
        <view class="rf-product-base-list__filter__bottom">
          <view
            v-for="(item, index) in state.attrArr"
            :key="index"
            class="bottom-tab"
            :class="[item.isActive ? `bg-${themeColor.name} font-weight` : '']"
            @tap="btnDropChange(index)"
          >
            {{ item.name }}
          </view>
        </view>
      </view>
    </view>
    <!-- 商品列表   -->
    <view class="rf-product-base-list__content">
      <view class="pl-base pr-base">
        <rf-home-product-list
          :content-value="contentValue"
          :info="{ productBgColor: '#fff', cartBtnShow: 'icon', cartIcon: 'iconyijiagou', cartIconSize: 26 }"
          :bottom="0"
          :radius="5"
          :list="state.productList"
          :show-type="state.isList ? 'oneLine' : 'twoLine'"
          :source="state.source"
          type="product"
          @check-product="checkProduct"
        />
      </view>
      <rf-load-more v-if="state.productList.length > 0" :status="state.loadingType" />
    </view>
    <!--左抽屉弹层 筛选 -->
    <rf-base-popup v-if="state.drawer" @close="state.drawer = false">
      <template #position>
        <view class="rf-product-base-list__drawer" :style="{ paddingTop: state.height + 'px' }">
          <scroll-view scroll-y :style="{ height: state.drawerH + 'px' }">
            <view class="flex-between mb-base">
              <text class="font-weight-500">价格区间</text>
              <view class="font-sm" :class="'text-' + themeColor.name">
                请输入价格区间
              </view>
            </view>
            <view class="drawer-content mb-lg">
              <input v-model="state.minPrice" class="input" placeholder="最低价" maxlength="11" type="number">
              <text>-</text>
              <input v-model="state.maxPrice" class="input" placeholder="最高价" maxlength="11" type="number">
            </view>
            <view class="flex-between mb-base">
              <text class="font-weight-500 mr-base">全部分类</text>
              <view class="flex-1 font-sm in1line text-right" :class="'text-' + themeColor.name">
                {{ state.currentCateStr }}
              </view>
            </view>
            <view class="drawer-content flex-wrap">
              <view
                v-for="(item, index) in state.productCateList"
                :key="index"
                class="attr-item"
                :class="[item.isActive ? `bg-${themeColor.name}` : '']"
                @tap.stop="cateBtnSelected(index)"
              >
                {{ item.title }}
              </view>
            </view>
            <view class="flex-between mb-base">
              <text class="font-weight-500 mr-base">品牌</text>
              <view class="flex-1 font-sm in1line text-right" :class="'text-' + themeColor.name">
                {{ state.currentBrandStr }}
              </view>
            </view>
            <view class="drawer-content flex-wrap">
              <view
                v-for="(item, index) in state.brandList"
                :key="item.id"
                class="attr-item"
                :class="[item.isActive ? `bg-${themeColor.name}` : '']"
                @tap.stop="brandBtnSelected(index)"
              >
                {{ item.title }}
              </view>
            </view>
          </scroll-view>
          <view class="flex">
            <view class="flex-1 mr-base">
              <button class="bg-white rf-short-btn" :class="'text-' + themeColor.name" @tap="reset">
                重置
              </button>
            </view>
            <view class="flex-1 ml-base">
              <button class="rf-short-btn" :class="'bg-' + themeColor.name" @tap="closeDrawer">
                确定
              </button>
            </view>
          </view>
        </view>
      </template>
    </rf-base-popup>
    <rf-empty
      v-if="state.productList.length === 0 && !state.loading"
      :info="state.errorInfo || '暂无相关数据'"
    />
    <!--页面加载动画-->
    <rf-loading :active="state.loading" />
  </view>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import mHelper from '@/utils/helper';
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import mRouter from '@/utils/routerUtil';
import productApi from '@/api/tinyShop/product';
import { Brand, ProductListItem } from '@/response/product';
import { CategoryItem, CustomCategory } from '@/response/category';
import { PlatformGroupEnum } from '@/enum/loginEnum'; // 路由管理
const themeColor = mHelper.getThemeColor(); // 主题颜色
const contentValue = ['title', "sub", 'marketPrice', 'sales'];

let state = reactive({
  source: '',
  keyword: '',
  errorInfo: '',
  loadingType: 'more',
  page: 1,
  loading: true,
  specClass: 'none',
  productDetail: {},
  searchKey: '', //搜索关键词
  topSafeWidth: 0, //header宽度
  height: 64, //header高度
  inputTop: 0, //搜索框距离顶部距离
  arrowTop: 0, //箭头距离顶部距离
  dropScreenH: 0, //下拉筛选框距顶部距离
  attrData: [] as AnyObject[],
  attrIndex: -1,
  totalSalesOrderBy: 0,
  dropScreenShow: false,
  scrollTop: 0,
  tabIndex: 0, //顶部筛选索引
  isList: false, //是否以列表展示  | 列表或大图
  drawer: false,
  drawerH: 0, //抽屉内部scroll-view高度
  selectedName: '综合',
  selectH: 0,
  dropdownList: [
    {
      name: '综合',
      selected: true,
      param: {}
    },
    {
      name: '价格升序',
      selected: false,
      param: { price: 'asc' }
    },
    {
      name: '价格降序',
      selected: false,
      param: { price: 'desc' }
    }
  ],
  attrArr: [
    {
      name: '全部',
      isActive: false,
      params: {},
      list: []
    },
    {
      name: '新品',
      isActive: false,
      params: { is_new: 1 },
      list: []
    },
    {
      name: '推荐',
      isActive: false,
      params: { is_recommend: 1 },
      list: []
    },
    {
      name: '热门',
      isActive: false,
      params: { is_hot: 1 },
      list: []
    }
  ],
  productList: [] as ProductListItem[],
  pageIndex: 1,
  pullUpOn: true,
  productCateList: [] as CategoryItem[],
  brandList: [] as Brand[],
  currentCateStr: '',
  currentBrandStr: '',
  minPrice: '',
  maxPrice: '',
  cateId: '',
  productParams: {} as AnyObject,
  attrParams: {} as AnyObject
});

onLoad((options) => {
  let obj: AnyObject = {};
  if (
    mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPWECHATMINI ||
    mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPBYTEDANCEMINI
  )
    obj = wx.getMenuButtonBoundingClientRect();
  if (mHelper.platformGroupFilter() === PlatformGroupEnum.TINYSHOPALIMINI) my.hideAddToDesktopMenu();
  uni.getSystemInfo({
    success: (res: AnyObject) => {
      state.topSafeWidth = obj.left || res.windowWidth;
      state.height = obj.top ? obj.top + obj.height + 8 : res.statusBarHeight + 44;
      state.inputTop = obj.top ? obj.top + (obj.height - 30) / 2 : res.statusBarHeight + 7;
      state.drawerH = res.windowHeight - uni.upx2px(100) - state.height;
    }
  });
  initData(options);
});
// 下拉刷新
onPullDownRefresh(() => {
  state.page = 1;
  state.productList.length = 0;
  getProductList('refresh');
});
// 加载更多
onReachBottom(() => {
  if (state.loadingType === 'noMore') return;
  state.page++;
  getProductList();
});

// 初始化数据
const initData = (options) => {
  state.source = options.source || '';
  let params: AnyObject = {};
  if (options.cate_id) {
    state.cateId = options.cate_id;
    params.cate_id = options.cate_id;
  }
  if (options.param) {
    params = { ...params, ...JSON.parse(options.param) };
  }
  if (options.keyword) {
    state.keyword = options.keyword;
    params.keyword = options.keyword;
  }
  state.productParams = params;
  getProductList();
};
// 选择商品
const checkProduct = (item) => {
  if (state.source === 'service') {
    mHelper.prePage().productId = item.item?.id;
  } else {
    mHelper.prePage().productList = [item.item, ...mHelper.prePage().productList];
  }
  mRouter.back();
};
// 获取产品详情
const btnDropChange = (index) => {
  state.attrParams = {};
  if (index === 0) {
    state.attrArr[0].isActive = !state.attrArr[0].isActive;
    state.attrArr[1].isActive = false;
    state.attrArr[2].isActive = false;
    state.attrArr[3].isActive = false;
  } else if (index === 1) {
    state.attrArr[1].isActive = !state.attrArr[1].isActive;
    state.attrArr[0].isActive = false;
  } else if (index === 2) {
    state.attrArr[2].isActive = !state.attrArr[2].isActive;
    state.attrArr[0].isActive = false;
  } else if (index === 3) {
    state.attrArr[3].isActive = !state.attrArr[3].isActive;
    state.attrArr[0].isActive = false;
  }
  state.page = 1;
  state.productList = [];
  state.loading = true;
  state.attrArr.forEach((item) => {
    if (item.isActive) state.attrParams = { ...state.attrParams, ...item.params };
  });
  getProductList();
};
const reset = async () => {
  state.currentBrandStr = '';
  state.currentCateStr = '';
  state.minPrice = '';
  state.maxPrice = '';
  await getBrandList();
  await getProductCate();
};
const showDropdownList = () => {
  state.selectH = 246;
  state.tabIndex = 0;
};
const hideDropdownList = () => {
  state.selectH = 0;
};
// 筛选条件选择
const dropdownItem = (e) => {
  let index = parseInt(e.currentTarget.dataset.index, 10);
  let arr: AnyArray = state.dropdownList;
  for (let i = 0; i < arr.length; i++) {
    arr[i].selected = i === index;
  }
  state.dropdownList = arr;
  state.selectedName = index === 0 ? '综合' : index === 1 ? '价格升序' : '价格降序';
  state.selectH = 0;
  state.page = 1;
  state.productList = [];
  state.loading = true;
  state.productParams = state.dropdownList[index].param;
  getProductList();
};
const screen = (index) => {
  if (index === 0) {
    state.selectH === 0 ? showDropdownList() : hideDropdownList();
  } else if (index === 1) {
    let params: AnyObject = {};
    if (state.totalSalesOrderBy === 0) {
      state.totalSalesOrderBy = 1;
      params.total_sales = 'asc';
    } else if (state.totalSalesOrderBy === 1) {
      state.totalSalesOrderBy = 2;
      params.total_sales = 'desc';
    } else {
      state.totalSalesOrderBy = 0;
    }
    state.page = 1;
    state.productList = [];
    state.loading = true;
    state.productParams = { ...state.productParams, ...params };
    getProductList();
  } else if (index === 2) {
    state.isList = !state.isList;
  } else if (index === 3) {
    if (state.productCateList.length === 0) getProductCate();
    if (state.brandList.length === 0) getBrandList();
    state.drawer = true;
  }
};
// 关闭筛选面板
const closeDrawer = () => {
  state.drawer = false;
  const params: AnyObject = {};
  if (state.maxPrice) params.max_price = state.maxPrice;
  if (state.minPrice) params.min_price = state.minPrice;
  const brandArr: AnyArray = [];
  state.brandList.forEach((item: Brand) => {
    if (item.isActive) brandArr.push(item.id);
  });
  if (brandArr.join(',')) params.brand_id = brandArr.join(',');
  const cateArr: AnyArray = [];
  state.productCateList.forEach((item: CategoryItem) => {
    if (item.isActive) cateArr.push(item.id);
  });
  if (cateArr.join(',')) params.cate_id = cateArr.join(',');
  state.page = 1;
  state.productList = [];
  state.loading = true;
  state.productParams = params;
  getProductList();
};
// 筛选面板分类选择
const cateBtnSelected = (index: number) => {
  state.currentCateStr = '';
  state.productCateList[index].isActive = !state.productCateList[index].isActive;
  const productCateArr: AnyArray = [];
  state.productCateList.forEach((item: CategoryItem) => {
    if (item.isActive) {
      productCateArr.push(item.title);
    }
  });
  state.currentCateStr = productCateArr.join(',');
};
// 筛选面板品牌选择
const brandBtnSelected = (index: number) => {
  state.currentBrandStr = '';
  state.brandList[index].isActive = !state.brandList[index].isActive;
  const brandArr: AnyArray = [];
  state.brandList.forEach((item: Brand) => {
    if (item.isActive) {
      brandArr.push(item.title);
    }
  });
  state.currentBrandStr = brandArr.join(',');
};
// 获取商品分类列表
const getProductCate = async () => {
  try {
    const data = (await productApi.getProductCate()) as unknown as CustomCategory;
    state.productCateList = data.list || [];
  } catch (e) {
    //
  }
};
// 获取商品品牌列表
const getBrandList = async () => {
  try {
    state.brandList = (await productApi.getBrandIndex()) as unknown as Brand[];
  } catch (e) {
    //
  }
};
// 返回/关闭抽屉
const back = () => {
  if (state.drawer) {
    closeDrawer();
  } else {
    mHelper.back();
  }
};
// 搜索事件
const search = () => {
  state.page = 1;
  state.loading = true;
  state.productParams = { keyword: state.keyword };
  state.productList.length = 0;
  getProductList();
};
// 获取商品列表
const getProductList = async (type = '') => {
  if (state.cateId) state.productParams.cate_id = state.cateId;
  if (state.keyword) state.productParams.keyword = state.keyword;
  try {
    const data = (await productApi.getProductList({
      ...state.productParams,
      ...state.attrParams,
      page: state.page
    })) as unknown as ProductListItem[];
    state.loading = false;
    if (type === 'refresh') {
      uni.stopPullDownRefresh();
    }
    state.loadingType = data.length < 10 ? 'noMore' : 'more';
    state.productList = [...state.productList, ...data];
  } catch (e) {
    //
    state.errorInfo = JSON.stringify(e);
    state.loading = false;
    if (type === 'refresh') {
      uni.stopPullDownRefresh();
    }
  }
};
</script>
<style lang="scss" scoped>
.rf-product-base-list {
  background: $page-color-base;
  min-height: 100vh;
  padding-bottom: calc(env(safe-area-inset-bottom) / 2);
  &__top {
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 2;
    background-color: $color-white;
  }
  &__header {
    display: flex;
    align-items: center;
    padding-left: $spacing-base;
    &__input-box {
      flex: 1;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      height: 60rpx;
      position: relative;
      margin: 0 10rpx;
      .search {
        z-index: 100;
        display: flex;
        align-items: center;
        position: absolute;
        top: 0;
        right: 0;
        width: 60rpx;
        height: 60rpx;
        font-size: 36rpx;
        color: $font-color-dark;
      }
      .input {
        width: 100%;
        height: 60rpx;
        border-radius: 30rpx;
        font-size: $font-sm;
        padding-left: 28rpx;
        color: $font-color-dark;
        background-color: $page-color-dark;
      }
    }
  }
  &__filter {
    background-color: $color-white;
    &__top,
    &__bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: $font-base;
      color: $font-color-base;
    }
    &__top {
      padding-top: 16rpx;
      height: 88rpx;
      line-height: 88rpx;
      position: relative;
      .dropdown {
        width: 100%;
        position: absolute;
        background: $color-white;
        border-bottom-left-radius: 24rpx;
        border-bottom-right-radius: 24rpx;
        overflow: hidden;
        box-sizing: border-box;
        padding-top: 10rpx;
        padding-bottom: 26rpx;
        left: 0;
        top: 88rpx;
        transition: all 0.2s ease-in-out;
        z-index: 99;
        .dropdown-item {
          color: #333;
          height: 70rpx;
          font-size: 28rpx;
          padding: 0 40rpx;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
      .dropdown-mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        //background: rgba(0, 0, 0, 0.6);
        z-index: -1;
        transition: all 0.2s ease-in-out;
      }
    }
    &__bottom {
      height: 100rpx;
      padding: 0 30rpx;
      box-sizing: border-box;
      font-size: 24rpx;
      align-items: center;
      overflow: hidden;
      .bottom-tab {
        width: 143rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 12rpx;
        box-sizing: border-box;
        margin-right: 20rpx;
        white-space: nowrap;
        height: 58rpx;
        border-radius: 29rpx;
        border: 1rpx solid rgba(0, 0, 0, 0.18);
      }
      .bottom-tab:last-child {
        margin-right: 0;
      }
    }
  }
  &__content {
    margin-top: 260rpx;
    z-index: -1;
  }
  /*顶部下拉选择 综合*/
  &__drawer {
    background-color: $color-white;
    width: 670rpx;
    position: absolute;
    overflow-y: scroll;
    top: 0;
    left: 80rpx;
    height: 100%;
    transition: all 0.3s ease-out;
    z-index: 101;
    padding: 0 30rpx env(safe-area-inset-bottom);
    .drawer-content {
      padding: 16rpx 30rpx 30rpx 30rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      .input {
        height: 64rpx;
        border-radius: 32rpx;
        width: 45%;
        background: #f7f7f7;
        text-align: center;
        font-size: $font-base;
        color: #333;
      }
      .attr-item {
        width: 30%;
        height: 64rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 4rpx;
        box-sizing: border-box;
        border-radius: 32rpx;
        margin-right: 5%;
        margin-bottom: 5%;
        border: 1rpx solid rgba(0, 0, 0, 0.18);
      }
      .attr-item:nth-of-type(3n) {
        margin-right: 0;
      }
    }
  }
}
</style>
