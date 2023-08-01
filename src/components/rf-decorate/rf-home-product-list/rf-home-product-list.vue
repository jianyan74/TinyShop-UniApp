<template>
  <view class="rf-home-product-list">
    <!-- 一行一个 -->
    <view v-if="showType === 'oneLine'">
      <view v-for="(item, index) in list" :key="index" class="mb-base">
        <!--商品列表-->
        <view
          :style="{
            backgroundColor: info.productBgColor,
            borderRadius: `${info.productRadius * 2}rpx`
          }"
          class="flex"
          @tap.stop="navToDetail(item)"
        >
          <view class="rf-home-product-list__product_img">
            <rf-image
              :border-radius="`${info.radius * 2}rpx`"
              :src="item.picture || productImg"
              height="196"
              width="196"
            />
            <view v-if="info.cornerMarkShow === 'image'" class="corner-mark">
              <rf-image
                :height="info.cornerMarkBgHeight * 2"
                :src="info.cornerMarkBg || productImg"
                :width="info.cornerMarkBgWidth * 2"
              />
            </view>
            <view v-if="info.cornerMarkShow === 'icon'" class="corner-mark">
              <rf-icon :name="info.cornerMarkIcon" :size="info.cornerMarkIconSize" />
              <text class="text">{{ info.cornerMarkText }}</text>
            </view>
            <view v-if="Number(item.stock) === 0" class="no-sale-num font-lg">
              已售罄
            </view>
          </view>
          <view class="ml-base flex-1 mr-base">
            <view class="mt-sm-half mb-sm-half">
              <view v-if="contentValue.toString().includes('title')" class="line-height-2 in2line font-weight-500">
                {{ item.name }}
              </view>
              <view class="line-height-1">
                <view
                  v-if="item?.marketing_tags?.length > 0 && contentValue.toString().includes('sub')"
                  class="flex in1line"
                >
                  <view v-for="tagItem in item?.marketing_tags" :key="tagItem" class="inline-block w-auto">
                    <rf-tag
                      :bg-color="`rgba(${themeColor.rgb}, 0.08)`"
                      :border-radius="6"
                      :color="themeColor.color"
                      :text="tagItem"
                      lr-padding="8rpx"
                      scale="0.9"
                    />
                  </view>
                </view>
                <view
                  v-else-if="item.tags?.length > 0 && contentValue.toString().includes('sub')"
                  class="font-color-light font-sm line-height-1 in1line"
                >
                  {{ item.tags?.join(' | ') }}
                </view>
              </view>
            </view>
            <!--    价格        -->
            <view class="flex-between flex-end line-height-2">
              <view>
                <view class="in1line">
                  <view
                    v-if="Number(item.is_member_discount)"
                    :class="'text-' + themeColor.name"
                    class="flex-align-items font-weight"
                  >
                    <text class="font-sm mt-sm-half">{{ moneySymbol }}</text>
                    <text class="font-lg">{{ item.member_discount_price }}</text>
                    <rf-image :src="vipPrice" height="30" width="30" />
                  </view>
                  <text
                    v-else-if="item.marketing_type === MarketingTypeEnum.POINT_EXCHANGE"
                    :class="'text-' + themeColor.name"
                    class="font-lg font-weight mr-sm"
                  >
                    <text v-if="Number(item?.marketing?.marketing_price) > 0" class="font-weight">
                      <text class="font-sm">{{ moneySymbol }}</text>
                      <text class="font-lg">{{ item?.marketing?.marketing_price }}+{{
                        item?.marketing?.point
                      }}积分
                      </text>
                    </text>
                  </text>
                  <text
                    v-else-if="item.marketing_type"
                    :class="'text-' + themeColor.name"
                    class="font-weight mr-sm"
                  >
                    <text class="font-sm">{{ moneySymbol }}</text>
                    <text class="font-lg">{{ item?.marketing?.marketing_price }}</text>
                  </text>
                  <text v-else :class="'text-' + themeColor.name" class="font-weight mr-sm">
                    <text class="font-sm">{{ moneySymbol }}</text>
                    <text class="font-lg">{{ item.price }}</text>
                  </text>
                  <text
                    v-if="
                      (item.market_price > item.price || item.market_price > item?.marketing?.marketing_price) &&
                        !Number(item.is_member_discount) &&
                        contentValue.toString().includes('marketPrice')
                    "
                    class="line-through font-color-light font-sm"
                  >{{ moneySymbol }}{{ item.market_price }}
                  </text>
                </view>
                <view v-if="contentValue.toString().includes('sales')" class="font-color-light font-sm">
                  <text
                    v-if="Number(item.is_member_discount) && Number(item.member_discount_price) < Number(item.price)"
                    class="font-color-light"
                  >
                    <text class="font-sm">{{ moneySymbol }}</text>
                    <text>{{ item.price }}</text>
                  </text>
                  <text v-else class="font-sm">
                    {{ filterTotalSales(item.total_sales || '0') }}人付款
                  </text>
                </view>
              </view>
              <view class="flex-between">
                <view v-if="info.cartBtnShow === 'icon'" @tap.stop="toggleSpec(item)">
                  <rf-icon
                    :color="themeColor.color"
                    :name="info.cartIcon"
                    :size="info.cartIconSize * 2"
                  />
                </view>
                <text
                  v-if="info.cartBtnShow === 'text'"
                  :class="'bg-gradual-' + themeColor.name"
                  class="rf-short-btn in1line font-sm pt-sm-half pb-sm-half pl-base pr-base text-white"
                >
                  {{ info.cartBtnText }}
                </text>
                <text
                  v-if="info.cartBtnShow === 'desc'"
                  :class="'bg-gradual-' + themeColor.name"
                  class="rf-short-btn in1line font-sm pt-sm-half pb-sm-half pl-base pr-base text-white"
                >
                  {{ info.cartBtnText }}
                </text>
              </view>
            </view>
          </view>
        </view>
        <!--商品列表-->
      </view>
    </view>
    <!-- 一行二个 -->
    <view v-if="showType === 'twoLine'">
      <view
        v-for="(item, index) in list"
        :key="index"
        :style="{
          backgroundColor: info.productBgColor,
          borderRadius: `${info.productRadius * 2}rpx`
        }"
        class="inline-block rf-home-product-list__two"
      >
        <!--商品列表-->
        <view @tap.stop="navToDetail(item)">
          <view class="rf-home-product-list__product_img">
            <rf-image
              :border-radius="`${radius * 2}rpx ${radius * 2}rpx 0 0`"
              :src="item.picture || productImg"
              :style="{ borderRadius: `${radius * 2}rpx` }"
              height="340"
              width="100%"
            />
            <view v-if="info.cornerMarkShow === 'image'" class="corner-mark">
              <rf-image
                :height="info.cornerMarkBgHeight * 2"
                :src="info.cornerMarkBg || productImg"
                :width="info.cornerMarkBgWidth * 2"
              />
            </view>
            <view v-if="info.cornerMarkShow === 'icon'" class="corner-mark flex-center">
              <rf-icon
                :color="themeColor.color"
                :name="info.cornerMarkIcon"
                :size="info.cornerMarkIconSize * 2"
              />
              <text class="text">{{ info.cornerMarkText }}</text>
            </view>
            <view v-if="Number(item.stock) === 0" class="no-sale-num font-lg">
              已售罄
            </view>
          </view>
          <view class="mt-base pl-sm pr-sm pb-sm">
            <view class="mb-sm">
              <view v-if="contentValue.toString().includes('title')" class="line-height-2 in2line font-weight-500">
                {{ item.name }}
              </view>
              <!-- 标签 -->
              <view v-if="contentValue.toString().includes('sub')" class="line-height-1">
                <view
                  v-if="item?.marketing_tags?.length > 0"
                  class="flex in1line"
                >
                  <view v-for="tagItem in item?.marketing_tags" :key="tagItem" class="inline-block w-auto">
                    <rf-tag
                      :bg-color="`rgba(${themeColor.rgb}, 0.08)`"
                      :border-radius="6"
                      :color="themeColor.color"
                      :text="tagItem"
                      lr-padding="8rpx"
                      scale="0.9"
                    />
                  </view>
                </view>
                <view
                  v-else-if="item.tags?.length > 0"
                  class="font-color-light font-sm line-height-1 in1line"
                >
                  {{ item.tags?.join(' | ') }}
                </view>
              </view>
            </view>
            <view
              :class="contentValue.toString().includes('sales') ? 'line-height-2' : 'line-height-1'"
              class="flex-between flex-end">
              <view>
                <view class="in1line">
                  <!-- 会员价 -->
                  <view
                    v-if="Number(item.is_member_discount)"
                    :class="'text-' + themeColor.name"
                    class="flex-align-items font-weight"
                  >
                    <text class="font-sm mt-sm-half">{{ moneySymbol }}</text>
                    <text class="font-lg">{{ item.member_discount_price }}</text>
                    <rf-image :src="vipPrice" height="30" width="30" />
                  </view>
                  <!-- 积分兑换 -->
                  <text
                    v-else-if="item.marketing_type === MarketingTypeEnum.POINT_EXCHANGE"
                    :class="'text-' + themeColor.name"
                    class="font-lg font-weight mr-sm"
                  >
                    <text v-if="Number(item?.marketing?.marketing_price) > 0" class="font-weight">
                      <text class="font-sm">{{ moneySymbol }}</text>
                      <text class="font-lg">{{ item?.marketing?.marketing_price }}+{{
                        item?.marketing?.point
                      }}积分
                      </text>
                    </text>
                  </text>
                  <!-- 营销价 -->
                  <text
                    v-else-if="item.marketing_type"
                    :class="'text-' + themeColor.name"
                    class="font-weight mr-sm"
                  >
                    <text class="font-sm">{{ moneySymbol }}</text>
                    <text class="font-lg">{{ item?.marketing?.marketing_price }}</text>
                  </text>
                  <!-- 普通价 -->
                  <text v-else :class="'text-' + themeColor.name" class="font-weight mr-sm">
                    <text class="font-sm">{{ moneySymbol }}</text>
                    <text class="font-lg">{{ item.price }}</text>
                  </text>
                  <!-- 划线价 -->
                  <text
                    v-if="
                      (item.market_price > item.price || item.market_price > item?.marketing?.marketing_price) &&
                        item.marketing_type !== MarketingTypeEnum.POINT_EXCHANGE &&
                        !Number(item.is_member_discount) &&
                        contentValue.toString().includes('marketPrice')
                    "
                    class="line-through font-color-light font-sm"
                  >
                    {{ moneySymbol }}{{ item.market_price }}
                  </text>
                </view>
                <!-- 付款人数 -->
                <view v-if="contentValue.toString().includes('sales')" class="font-color-light font-sm">
                  <text
                    v-if="Number(item.is_member_discount) && Number(item.member_discount_price) < Number(item.price)"
                    class="font-color-light"
                  >
                    <text class="font-sm">{{ moneySymbol }}</text>
                    <text>{{ item.price }}</text>
                  </text>
                  <text v-else class="font-sm">
                    {{ filterTotalSales(item.total_sales || '0') }}人付款
                  </text>
                </view>
              </view>
              <view class="flex-between">
                <view v-if="info.cartBtnShow === 'icon'" @tap.stop="toggleSpec(item)">
                  <rf-icon
                    :color="themeColor.color"
                    :name="info.cartIcon"
                    :size="info.cartIconSize * 2"
                  />
                </view>
                <text
                  v-if="info.cartBtnShow === 'text'"
                  :class="'bg-gradual-' + themeColor.name"
                  class="rf-short-btn in1line font-sm pt-sm-half pb-sm-half pl-base pr-base text-white"
                >
                  {{ info.cartBtnText }}
                </text>
                <text
                  v-if="info.cartBtnShow === 'desc'"
                  :class="'bg-gradual-' + themeColor.name"
                  class="rf-short-btn in1line font-sm pt-sm-half pb-sm-half pl-base pr-base text-white"
                >
                  {{ info.cartBtnText }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 一行三个 -->
    <view v-if="showType === 'threeLine'" class="prod-container">
      <view
        v-for="(item, index) in list"
        :key="index"
        :style="{
          backgroundColor: info.productBgColor,
          borderRadius: `${info.productRadius * 2}rpx`
        }"
        class="rf-home-product-list__three"
      >
        <!--商品列表-->
        <view @tap.stop="navToDetail(item)">
          <view class="rf-home-product-list__product_img w100">
            <rf-image
              :border-radius="`${radius * 2}rpx ${radius * 2}rpx 0 0`"
              :src="item.picture || productImg"
              :style="{ borderRadius: `${radius * 2}rpx` }"
              height="240"
              width="100%"
            />
            <view v-if="info.cornerMarkShow === 'image'" class="corner-mark">
              <rf-image
                :height="info.cornerMarkBgHeight * 2"
                :src="info.cornerMarkBg || productImg"
                :width="info.cornerMarkBgWidth * 2"
              />
            </view>
            <view v-if="info.cornerMarkShow === 'icon'" class="corner-mark">
              <rf-icon :name="info.cornerMarkIcon" :size="info.cornerMarkIconSize" />
              <text class="text">{{ info.cornerMarkText }}</text>
            </view>
            <view v-if="Number(item.stock) === 0" class="no-sale-num font-lg">
              已售罄
            </view>
          </view>
          <view class="mt-base pl-sm pr-sm pb-sm w100">
            <view class="mb-sm">
              <view v-if="contentValue.toString().includes('title')" class="line-height-2 in2line font-weight-500">
                {{ item.name }}
              </view>
              <view v-if="contentValue.toString().includes('sub')" class="line-height-1">
                <view
                  v-if="item?.marketing_tags?.length > 0"
                  class="flex in1line"
                >
                  <view v-for="tagItem in item?.marketing_tags" :key="tagItem" class="inline-block w-auto">
                    <rf-tag
                      :bg-color="`rgba(${themeColor.rgb}, 0.08)`"
                      :border-radius="6"
                      :color="themeColor.color"
                      :text="tagItem"
                      lr-padding="8rpx"
                      scale="0.9"
                    />
                  </view>
                </view>
                <view
                  v-else-if="item.tags?.length > 0"
                  class="font-color-light font-sm line-height-1 in1line"
                >
                  {{ item.tags?.join(' | ') }}
                </view>
              </view>
            </view>
            <view
              :class="contentValue.toString().includes('sales') ? 'line-height-2' : 'line-height-1'"
              class="flex-between flex-end">
              <view>
                <view class="in1line">
                  <view
                    v-if="Number(item.is_member_discount)"
                    :class="'text-' + themeColor.name"
                    class="flex-align-items font-weight"
                  >
                    <text class="font-sm mt-sm-half">{{ moneySymbol }}</text>
                    <text class="font-lg">{{ item.member_discount_price }}</text>
                    <rf-image :src="vipPrice" height="30" width="30" />
                  </view>
                  <text
                    v-else-if="item.marketing_type === MarketingTypeEnum.POINT_EXCHANGE"
                    :class="'text-' + themeColor.name"
                    class="font-lg font-weight mr-sm"
                  >
                    <text v-if="Number(item?.marketing?.marketing_price) > 0" class="font-weight">
                      <text class="font-sm">{{ moneySymbol }}</text>
                      <text class="font-lg">{{ item?.marketing?.marketing_price }}+{{
                        item?.marketing?.point
                      }}积分
                      </text>
                    </text>
                  </text>
                  <text
                    v-else-if="item.marketing_type"
                    :class="'text-' + themeColor.name"
                    class="font-weight mr-sm"
                  >
                    <text class="font-sm">{{ moneySymbol }}</text>
                    <text class="font-lg">{{ item?.marketing?.marketing_price }}</text>
                  </text>
                  <text v-else :class="'text-' + themeColor.name" class="font-weight mr-sm">
                    <text class="font-sm">{{ moneySymbol }}</text>
                    <text class="font-lg">{{ item.price }}</text>
                  </text>
                  <text
                    v-if="
                      (item.market_price > item.price || item.market_price > item?.marketing?.marketing_price) &&
                        item.marketing_type !== MarketingTypeEnum.POINT_EXCHANGE &&
                        !Number(item.is_member_discount) &&
                        contentValue.toString().includes('marketPrice')
                    "
                    class="line-through font-color-light font-sm"
                  >{{ moneySymbol }}{{ item.market_price }}
                  </text>
                </view>
                <view v-if="contentValue.toString().includes('sales')" class="font-color-light font-sm">
                  <text
                    v-if="Number(item.is_member_discount) && Number(item.member_discount_price) < Number(item.price)"
                    class="font-color-light"
                  >
                    <text class="font-sm">{{ moneySymbol }}</text>
                    <text>{{ item.price }}</text>
                  </text>
                  <text v-else class="font-sm">
                    {{ filterTotalSales(item.total_sales || '0') }}人付款
                  </text>
                </view>
              </view>
              <view class="flex-between">
                <view v-if="info.cartBtnShow === 'icon'" @tap.stop="toggleSpec(item)">
                  <rf-icon
                    :color="themeColor.color"
                    :name="info.cartIcon"
                    :size="info.cartIconSize * 2"
                  />
                </view>
                <text
                  v-if="info.cartBtnShow === 'text'"
                  :class="'bg-gradual-' + themeColor.name"
                  class="rf-short-btn in1line font-sm pt-sm-half pb-sm-half pl-base pr-base text-white"
                >
                  {{ info.cartBtnText }}
                </text>
                <text
                  v-if="info.cartBtnShow === 'desc'"
                  :class="'bg-gradual-' + themeColor.name"
                  class="rf-short-btn in1line font-sm pt-sm-half pb-sm-half pl-base pr-base text-white"
                >
                  {{ info.cartBtnText }}
                </text>
              </view>
            </view>
          </view>
        </view>
        <!--商品列表-->
      </view>
      <view v-for="n in showEmptyCountForThreeLine" :key="n" :style="{height: 0}" class="rf-home-product-list__three" />
    </view>
    <!-- 大图 -->
    <view v-if="showType === 'onePic'">
      <view
        v-for="(item, index) in list"
        :key="index"
        :style="{
          backgroundColor: info.productBgColor,
          borderRadius: `${info.productRadius * 2}rpx`
        }"
        class="mb-base"
      >
        <!--商品列表-->
        <view @tap.stop="navToDetail(item)">
          <view class="rf-home-product-list__product_img">
            <rf-image :border-radius="`${radius * 2}rpx`" :src="item.picture || productImg" height="340" width="100%" />
            <view v-if="info.cornerMarkShow === 'image'" class="corner-mark">
              <rf-image
                :height="info.cornerMarkBgHeight * 2"
                :src="info.cornerMarkBg || productImg"
                :width="info.cornerMarkBgWidth * 2"
              />
            </view>
            <view v-if="info.cornerMarkShow === 'icon'" class="corner-mark">
              <rf-icon :name="info.cornerMarkIcon" :size="info.cornerMarkIconSize" />
              <text class="text">{{ info.cornerMarkText }}</text>
            </view>
            <view v-if="Number(item.stock) === 0" class="no-sale-num font-lg">
              已售罄
            </view>
          </view>
          <view class="mt-base pl-sm pr-sm pb-sm">
            <view class="mb-sm">
              <view v-if="contentValue.toString().includes('title')" class="line-height-2 in2line font-weight-500">
                {{ item.name }}
              </view>
              <view v-if="contentValue.toString().includes('sub')" class="line-height-1">
                <view
                  v-if="item?.marketing_tags?.length > 0"
                  class="flex in1line"
                >
                  <view v-for="tagItem in item?.marketing_tags" :key="tagItem" class="inline-block w-auto">
                    <rf-tag
                      :bg-color="`rgba(${themeColor.rgb}, 0.08)`"
                      :border-radius="6"
                      :color="themeColor.color"
                      :text="tagItem"
                      lr-padding="8rpx"
                      scale="0.9"
                    />
                  </view>
                </view>
                <view
                  v-else-if="item.tags?.length > 0"
                  class="font-color-light font-sm line-height-1 in1line"
                >
                  {{ item.tags?.join(' | ') }}
                </view>
              </view>
            </view>
            <view
              :class="contentValue.toString().includes('sales') ? 'line-height-2' : 'line-height-1'"
              class="flex-between flex-end">
              <view>
                <view class="in1line">
                  <view
                    v-if="Number(item.is_member_discount)"
                    :class="'text-' + themeColor.name"
                    class="flex-align-items font-weight"
                  >
                    <text class="font-sm mt-sm-half">{{ moneySymbol }}</text>
                    <text class="font-lg">{{ item.member_discount_price }}</text>
                    <rf-image :src="vipPrice" height="30" width="30" />
                  </view>
                  <text
                    v-else-if="item.marketing_type === MarketingTypeEnum.POINT_EXCHANGE"
                    :class="'text-' + themeColor.name"
                    class="mr-sm"
                  >
                    <text v-if="Number(item?.marketing?.marketing_price) > 0" class="font-weight">
                      <text class="font-sm">{{ moneySymbol }}</text>
                      <text class="font-lg">{{ item?.marketing?.marketing_price }}+{{
                        item?.marketing?.point
                      }}积分
                      </text>
                    </text>
                  </text>
                  <text
                    v-else-if="item.marketing_type"
                    :class="'text-' + themeColor.name"
                    class="font-weight mr-sm"
                  >
                    <text class="font-sm">{{ moneySymbol }}</text>
                    <text class="font-lg">{{ item?.marketing?.marketing_price }}</text>
                  </text>
                  <text v-else :class="'text-' + themeColor.name" class="font-weight mr-sm">
                    <text class="font-sm">{{ moneySymbol }}</text>
                    <text class="font-lg">{{ item.price }}</text>
                  </text>
                  <text
                    v-if="
                      (item.market_price > item.price || item.market_price > item?.marketing?.marketing_price) &&
                        !Number(item.is_member_discount) &&
                        contentValue.toString().includes('marketPrice')
                    "
                    class="line-through font-color-light font-sm"
                  >{{ moneySymbol }}{{ item.market_price }}
                  </text>
                </view>
                <view v-if="contentValue.toString().includes('sales')" class="font-color-light font-sm">
                  <text
                    v-if="Number(item.is_member_discount) && Number(item.member_discount_price) < Number(item.price)"
                    class="font-color-light"
                  >
                    <text class="font-sm">{{ moneySymbol }}</text>
                    <text>{{ item.price }}</text>
                  </text>
                  <text v-else class="font-sm">
                    {{ filterTotalSales(item.total_sales || '0') }}人付款
                  </text>
                </view>
              </view>
              <view class="flex-between">
                <view v-if="info.cartBtnShow === 'icon'" @tap.stop="toggleSpec(item)">
                  <rf-icon
                    :color="themeColor.color"
                    :name="info.cartIcon"
                    :size="info.cartIconSize * 2"
                  />
                </view>
                <text
                  v-if="info.cartBtnShow === 'text'"
                  :class="'bg-gradual-' + themeColor.name"
                  class="rf-short-btn in1line font-sm pt-sm-half pb-sm-half pl-base pr-base text-white"
                >
                  {{ info.cartBtnText }}
                </text>
                <text
                  v-if="info.cartBtnShow === 'desc'"
                  :class="'bg-gradual-' + themeColor.name"
                  class="rf-short-btn in1line font-sm pt-sm-half pb-sm-half pl-base pr-base text-white"
                >
                  {{ info.cartBtnText }}
                </text>
              </view>
            </view>
          </view>
        </view>
        <!--商品列表-->
      </view>
    </view>
    <!-- 左右滑动 -->
    <view v-if="showType === 'slide'">
      <scroll-view class="white-space-nowrap" scroll-x>
        <view
          v-for="(item, index) in list"
          :key="index"
          :style="{
            backgroundColor: info.productBgColor,
            borderRadius: `${info.productRadius * 2}rpx`
          }"
          class="inline-block mr-sm rf-home-product-list__slide"
          @tap.stop="navToDetail(item)"
        >
          <view class="rf-home-product-list__product_img">
            <rf-image
              :border-radius="`${radius || info.productRadius}px ${radius || info.productRadius}px 0 0`"
              :src="item.picture || productImg"
              :style="{
                borderRadius: `${radius * 2}rpx`,
                borderTopLeftRadius: `${radius || info.productRadius}px`,
                borderTopRightRadius: `${radius || info.productRadius}px`
              }"
              height="208"
              width="208"
            />
            <view v-if="info.cornerMarkShow === 'image'" class="corner-mark">
              <rf-image
                :height="info.cornerMarkBgHeight * 2"
                :src="info.cornerMarkBg || productImg"
                :width="info.cornerMarkBgWidth * 2"
              />
            </view>
            <view v-if="info.cornerMarkShow === 'icon'" class="corner-mark">
              {{ info.cornerMarkIcon }}
              <rf-icon :name="info.cornerMarkIcon" :size="info.cornerMarkIconSize * 2" />
              <text class="text">{{ info.cornerMarkText }}</text>
            </view>
            <view v-if="Number(item.stock) === 0" class="no-sale-num font-lg">
              已售罄
            </view>
          </view>
          <view class="mt-sm pl-sm pr-sm pb-sm">
            <view class="mb-sm">
              <view v-if="contentValue.toString().includes('title')" class="in1line font-weight-500">
                {{ item.name }}
              </view>
            </view>
            <view class="in1line line-height-1">
              <text
                v-if="
                  (item.market_price > item.price || item.market_price > item?.marketing?.marketing_price) &&
                    item.marketing_type !== MarketingTypeEnum.POINT_EXCHANGE &&
                    !Number(item.is_member_discount) &&
                    contentValue.toString().includes('marketPrice')
                "
                class="line-through font-color-light font-sm"
              >
                {{ moneySymbol }}{{ item.market_price }}
              </text>
            </view>
            <view class="flex-between">
              <view class="in1line">
                <view
                  v-if="Number(item.is_member_discount)"
                  :class="'text-' + themeColor.name"
                  class="flex-align-items font-weight"
                >
                  <text class="font-sm mt-sm-half">{{ moneySymbol }}</text>
                  <text class="font-lg">{{ item.member_discount_price }}</text>
                  <rf-image :src="vipPrice" height="30" width="30" />
                </view>
                <text
                  v-else-if="item.marketing_type === MarketingTypeEnum.POINT_EXCHANGE"
                  :class="'text-' + themeColor.name"
                  class="font-lg font-weight mr-sm"
                >
                  <text v-if="Number(item?.marketing?.marketing_price) > 0" class="font-lg font-weight">
                    <text class="font-sm">{{ moneySymbol }}</text>
                    <text>{{ item?.marketing?.marketing_price }}+{{ item?.marketing?.point }}积分</text>
                  </text>
                </text>
                <text
                  v-else-if="item.marketing_type"
                  :class="'text-' + themeColor.name"
                  class="font-weight mr-sm"
                >
                  <text class="font-sm">{{ moneySymbol }}</text>
                  <text class="font-lg">{{ item?.marketing?.marketing_price }}</text>
                </text>
                <text v-else :class="'text-' + themeColor.name" class="font-weight mr-sm">
                  <text class="font-sm">{{ moneySymbol }}</text>
                  <text class="font-lg">{{ item.price }}</text>
                </text>
              </view>
              <view class="flex-between">
                <view v-if="info.cartBtnShow === 'icon'" @tap.stop="toggleSpec(item)">
                  <rf-icon
                    :color="themeColor.color"
                    :name="info.cartIcon"
                    :size="info.cartIconSize * 2"
                  />
                </view>
                <text
                  v-if="info.cartBtnShow === 'text'"
                  :class="'bg-gradual-' + themeColor.name"
                  class="rf-short-btn in1line font-sm pt-sm-half pb-sm-half pl-base pr-base text-white"
                >
                  {{ info.cartBtnText }}
                </text>
                <text
                  v-if="info.cartBtnShow === 'desc'"
                  :class="'bg-gradual-' + themeColor.name"
                  class="rf-short-btn in1line font-sm pt-sm-half pb-sm-half pl-base pr-base text-white"
                >
                  {{ info.cartBtnText }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <!-- 规格-模态层弹窗 -->
    <rf-attr-content
      v-if="state.isAtteContentShow"
      :bottom="bottom ? `${bottom}rpx` : '0'"
      :product="state.productDetail"
      :show-buy-btn="true"
      @close="state.isAtteContentShow = false"
      @toggle="toggleSpec"
    />
  </view>
</template>
<script lang="ts" setup>
import mConstData from '@/config/constData';
import {computed, reactive} from "vue";
import mAssetsPath from '@/config/assets';
import mRouter from '@/utils/routerUtil';
import {Route} from '@/response/route';
import mHelper from '@/utils/helper';
import mRouteConfig from '@/config/routes';
import productApi from '@/api/tinyShop/product';
import memberApi from '@/api/tinyShop/member';
import store from '@/store';
import {MarketingTypeEnum} from '@/enum/marketingEnum';
import {Product} from '@/response/product';
import marketingApi from '@/api/tinyShop/marketing';

const themeColor = mHelper.getThemeColor(); // 主题颜色

const moneySymbol = mConstData.moneySymbol;
const productImg = mAssetsPath.defaultImg;

const emit = defineEmits(['checkProduct', 'cart']);
const vipPrice = mAssetsPath.vipIcon;

let state = reactive({
  isAtteContentShow: false,
  productDetail: {} as Product
});

const props = defineProps({
  list: {
    type: Array,
    default() {
      return [];
    }
  },
  info: {
    type: Object,
    default() {
      return {};
    }
  },
  contentValue: {
    type: Array,
    default() {
      return [];
    }
  },
  // 显示类型
  showType: {
    type: String,
    default: 'oneLine'
  },
  // 商品类型
  type: {
    type: String,
    default: MarketingTypeEnum.PRODUCT
  },
  // 底部距离
  bottom: {
    type: Number,
    default: 0
  },
  radius: {
    type: Number,
    default: 0
  },
  source: {
    type: String,
    default: ''
  },
});
/**
 * 一行三列计算空白占位元素数量
 */
const showEmptyCountForThreeLine = computed(() => {
  if (props.list?.length > 0) {
    return Math.floor(3 - props.list?.length % 3);
  }
  return 0;
})

// 格式化销量显示
const filterTotalSales = (val: string) => {
  if (parseInt(val) > 10000) {
    val = `${(parseInt(val) / 10000).toFixed(2)}w`;
  }
  return val;
};

// 跳转详情
const navTo = (route: Route, query = {}) => {
  mRouter.push({route, query});
};

// 跳转详情
const navToDetail = (item) => {
  if (parseInt(props.source, 10) === 1 || props.source === 'service') {
    emit('checkProduct', {item});
  } else {
    mHelper.navToProduct(item.id, item.marketing_type, item.marketing_id, item?.marketing?.marketing_product_id);
  }
};

// 获取产品详情
const getProductBaseDetail = async (row: AnyObject) => {
  try {
    state.productDetail = (await productApi.getProductBaseDetail({
      id: row.id,
      marketing_id: row?.marketing_id,
      marketing_type: row?.marketing_type,
      marketing_product_id: row?.marketing?.marketing_product_id
    })) as unknown as Product;
    state.productDetail.sku_name = row.skuName;
    state.isAtteContentShow = true;
  } catch (e) {
    //
  }
};
// 规格弹窗开关
const toggleSpec = async (row) => {
  if (parseInt(row.status, 10) === 0) return;
  if (state.isAtteContentShow) {
    state.isAtteContentShow = false;
    if (row.stock === 0) {
      mHelper.toast('库存不足');
      return;
    }
    if (row.type === 1) {
      // 加入购物车
      await handleCartItemCreate(row.skuId, row.cartCount);
    } else if (row.type === 2) {
      if (row.marketing_type === MarketingTypeEnum.PRE_SELL) {
        const data: AnyObject[] = [];
        const params: AnyObject = {item: {}};
        params['merchant_id'] = row.merchant_id;
        params['item']['type'] = MarketingTypeEnum.PRE_SELL;
        params['item']['data'] = JSON.stringify({
          num: row.cartCount,
          sku_id: row.skuId,
          marketing_id: row.marketing_id
        });
        data.push(params);
        navTo(mRouteConfig.createOrder, {
          data: JSON.stringify(data)
        });
      } else if (row.marketing_type === MarketingTypeEnum.BARGAIN) {
        const params: AnyObject = {};
        params.sku_id = row.skuId;
        params.bargain_id = row.marketing_id;
        try {
          const data = (await marketingApi.handleBargainLaunchCreate(params)) as any;
          navTo(mRouteConfig.bargainDetail, {id: data.id});
        } catch (e) {
          //
        }
      } else {
        // 立即购买
        const data: AnyArray = [];
        const params: AnyObject = {item: {}};
        params['merchant_id'] = state.productDetail.merchant.id;
        params['item']['data'] = {
          sku_id: row.skuId,
          num: row.cartCount,
          marketing_id: state.productDetail.marketing_id
        };
        params['item']['type'] = state.productDetail.marketing_type || 'buy_now';
        data.push(params);
        navTo(mRouteConfig.createOrder, {data: JSON.stringify(data)});
      }
    }
    setTimeout(() => {
      state.isAtteContentShow = false;
    }, 250);
  } else if (!state.isAtteContentShow) {
    await getProductBaseDetail(row);
  }
};

// 添加商品至购物车
const handleCartItemCreate = async (skuId: string, cartCount: string) => {
  await memberApi.handleCartItemCreate({
    sku_id: skuId,
    number: cartCount
  }).then(async (res) => {
    console.log('handleCartItemCreate', res)
    const cartNum = await memberApi.getCartItemCount();
    store.commit('notify/setCartNum', {cartNum});
    emit('cart');
    mHelper.toast('添加购物车成功');
  })
};
</script>
<style lang="scss" scoped>
.rf-home-product-list {
  width: 100%;

  .prod-container {
    width: 100%;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  &__two {
    width: calc(50% - 11rpx);
    margin-bottom: $spacing-base;
  }

  &__two:nth-of-type(odd) {
    margin-right: $spacing-base;
  }

  &__three {
    width: calc(100% / 3 - 20rpx);
    flex-grow: 1;
    margin-bottom: $spacing-base;
    margin-right: $spacing-base;
    box-sizing: border-box;
  }

  &__three:nth-child(3n + 3) {
    margin-right: 0;
  }

  &__slide {
    width: 208rpx;
  }

  &__product_img {
    position: relative;

    .corner-mark {
      position: absolute;
      top: 0;
      left: 0;

      .text {
        position: absolute;
        left: 50%;
        color: #fff;
        font-size: 10px;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .no-sale-num {
      width: 100%;
      height: 100%;
      padding: 0 48rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: $color-white;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.36);
      border-radius: 10rpx 10rpx 0 0;
    }
  }
}
</style>
