<template>
  <view class="rf-product-detail">
    <!--header-->
    <view v-if="product.name" class="rf-product-detail__content">
      <!--顶部商品轮播图-->
      <view class="rf-product-detail__carousel">
        <view v-if="state.carouselTabActive === '2'" class="video-wrapper">
          <video :poster="product.covers[0]" :src="product.video_url" object-fit="contain" />
        </view>
        <swiper
          v-else :indicator-dots="false"
          circular="true" controls
          duration="400"
          touchable>
          <swiper-item v-for="(item, index) in product.covers" :key="index" class="swiper-item">
            <rf-image :src="item" height="100%" mode="aspectFill" width="750" />
            <view class="swiper-item-tag flex-align-items font-sm">
              {{ `${index + 1} / ${product.covers.length}` }}
            </view>
          </swiper-item>
        </swiper>
        <view v-if="product.video_url" class="flex-center">
          <view
            v-if="mHelper.platformGroupFilter('app') === PlatformGroupEnum.TINYSHOPAPP"
            class="carousel-tab carousel-tab-app"
          >
            <view
              :class="
                state.carouselTabActive === '1' ? 'bg-' + themeColor.name : 'normal-white text-' + themeColor.name
              "
              class="carousel-tab-item"
              @tap.stop="handleCarouselTabClick('1')"
            >
              图片
            </view>
            <view
              :class="
                state.carouselTabActive === '2' ? 'bg-' + themeColor.name : 'normal-white text-' + themeColor.name
              "
              class="carousel-tab-item"
              @tap.stop="handleCarouselTabClick('2')"
            >
              视频
            </view>
          </view>
          <view v-else class="carousel-tab carousel-tab-napp">
            <view
              :class="state.carouselTabActive === '1' ? 'active' : 'normal'"
              class="carousel-tab-item font-sm"
              @tap.stop="handleCarouselTabClick('1')"
            >
              图片
            </view>
            <view class="gap-container flex-center">
              <view class="gap" />
            </view>
            <view
              :class="state.carouselTabActive === '2' ? 'active' : 'normal'"
              class="carousel-tab-item font-sm"
              @tap.stop="handleCarouselTabClick('2')"
            >
              视频
            </view>
          </view>
        </view>
      </view>
      <!--商品信息-->
      <view
        v-if="!notMarketingByType(String(marketingType))"
        :class="'bg-gradual-' + themeColor.name"
        :style="{ height: product.video_url ? '150rpx' : '140rpx' }"
        class="price-block"
      >
        <view class="bg">
          <rf-image :src="marketingTagFilter(String(marketingType))" height="140" mode="widthFix" width="750" />
        </view>
        <view
          :style="{
            marginTop:
              product.video_url && mHelper.platformGroupFilter('app') === PlatformGroupEnum.TINYSHOPAPP ? '14rpx' : 0
          }"
          class="wrapper pl-base pr-base"
        >
          <view class="price-box">
            <view class="flex-align-items">
              <view class="font-base-2">
                {{ priceDescFilter(product.marketing_type) }}
              </view>
              <rf-tag
                :border-radius="26"
                :text="`${product.total_sales}${product.unit || '件'}已售`"
                bg-color="rgba(0, 0, 0, 0.18)"
                color="#fff"
                lr-padding="24rpx"
                scale="0.8"
              />
            </view>
            <view class="flex flex-end lh-1 mt-sm">
              <view v-if="product.marketing_type !== MarketingTypeEnum.POINT_EXCHANGE" class="font-base">
                {{ moneySymbol }}
              </view>
              <view
                :class="[
                  notMarketingByType(String(marketingType)) ? `text-${themeColor.name}` : '',
                  currentProductPrice?.length > 6 ? 'font-lg-4' : 'font-lg-8'
                ]"
                class="font-weight"
              >
                {{ currentProductPrice?.split(".")[0] }}
              </view>
              <view v-if="currentProductPrice?.split('.')[1]" class="font-base font-weight">
                .{{ currentProductPrice?.split(".")[1] }}
              </view>
              <rf-image
                v-if="Number(props.is_member_discount)"
                :src="vipPrice"
                class="member-level"
                height="36"
                mode="aspectFit"
                width="36"
              />
              <view v-if="Number(product.market_price) > Number(product.price)" class="line-through ml-base">
                <text class="font-sm">{{ moneySymbol }}</text>
                <text class="font-sm">{{ product.market_price }}</text>
              </view>
            </view>
          </view>
          <view
            v-if="
              marketingType === MarketingTypeEnum.GROUP_BUY ||
                marketingType === MarketingTypeEnum.BARGAIN ||
                marketingType === MarketingTypeEnum.SEC_KILL ||
                marketingType === MarketingTypeEnum.WHOLESALE ||
                marketingType === MarketingTypeEnum.PRE_SELL ||
                marketingType === MarketingTypeEnum.DISCOUNT
            "
            class="rf-time-down"
          >
            <view
              v-if="bargainSecond(product.marketing?.start_time, product.marketing?.end_time) > 0"
              class="text-center"
            >
              <view class="mb-base font-sm">
                {{ bargainSecondFlag(product.marketing?.start_time, product.marketing?.end_time) }}
              </view>
              <rf-count-down
                :border-color="themeColor.color"
                :second="bargainSecond(product.marketing?.start_time, product.marketing?.end_time)"
                :show-day="true"
                background-color="rgba(0,0,0,0.48)"
                color="#fff"
                font-size="24rpx"
                font-weight="500"
                lr-padding="8rpx"
                splitor-color="#fff"
                @timeup="bargainTimeUp()"
              />
            </view>
            <text v-else>
              活动已结束
            </text>
          </view>
        </view>
      </view>
      <!--活动标识 价格-->
      <view class="rf-product-detail__introduce">
        <view
          v-if="notMarketingByType(String(marketingType))"
          :style="{ height: product.video_url ? '80rpx' : '70rpx' }"
          class="price-block"
        >
          <view :style="{ marginTop: product.video_url ? '14rpx' : 0 }" class="wrapper">
            <view class="price-box w100">
              <!--    正常价格展示          -->
              <view v-if="notMarketingByType(String(marketingType))" class="flex-between w100">
                <view class="price-show-nm">
                  <view
                    :class="notMarketingByType(String(marketingType)) ? `text-${themeColor.name}` : ''"
                    class="price font-weight-normal"
                  >
                    <text
                      v-if="product.marketing_type !== MarketingTypeEnum.POINT_EXCHANGE"
                      class="font-sm font-weight"
                    >
                      {{ moneySymbol }}
                    </text>
                    <text class="font-weight">
                      <text
                        :class="[
                          currentProductPrice?.length > 6 ? 'font-lg-8' : 'font-lg-12'
                        ]">
                        {{ String(currentProductPrice).split(".")[0] }}
                      </text>
                      <text
                        v-if="String(currentProductPrice).split('.')[1]"
                        class="font-base">.{{ String(currentProductPrice).split(".")[1] }}
                      </text>
                      <text
                        v-if="String(currentProductPrice).split('.')[2]"
                        class="font-base">.{{ String(currentProductPrice).split(".")[2] }}
                      </text>
                    </text>
                  </view>
                  <!--       小图标           -->
                  <rf-image
                    v-if="product.is_member_discount > 0 && hasLogin"
                    :src="vipPrice"
                    class="member-level"
                    height="36"
                    mode="aspectFit"
                    width="36"
                  />
                  <!--      划线折扣            -->
                  <view
                    v-if="Number(product.market_price) > Number(product.price)"
                    class="line-through ml-base font-color-light font-sm"
                  >
                    <text class="font-sm line-height-2-lg">
                      {{ moneySymbol }}{{ product.market_price }}
                    </text>
                  </view>
                </view>
                <!--     已售           -->
                <view class="font-color-light font-sm">
                  已售{{ product.total_sales }}{{ product.unit || "件" }}
                </view>
              </view>
              <view v-else class="price-first-line">
                <view
                  :class="notMarketingByType(marketingType) ? `text-${themeColor.name}` : ''"
                  class="price font-weight-normal"
                >
                  <text class="symbol">{{ moneySymbol }}</text>
                  <text
                    :class="[
                      notMarketingByType(String(marketingType)) ? `text-${themeColor.name}` : '',
                      currentProductPrice?.length > 6 ? 'font-lg-8' : 'font-lg-4'
                    ]"
                    class="font-weight-500"
                  >{{ currentProductPrice }}
                  </text>
                </view>
                <rf-image
                  v-if="Number(props.is_member_discount)"
                  :src="vipPrice"
                  class="member-level"
                  height="36"
                  mode="aspectFit"
                  width="36"
                />
                <view
                  v-if="Number(product.market_price) > Number(product.price)"
                  class="line-through ml-base font-color-light font-sm"
                >
                  <text class="font-sm">
                    {{ moneySymbol }}
                  </text>
                  <text class="font-sm">
                    {{ product.market_price }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="mt-sm mb-sm flex-between">
          <view class="flex-1">
            <view v-if="product?.marketing_tags.length > 0" class="in1line">
              <view v-for="tagItem in product?.marketing_tags" :key="tagItem" class="inline-block pr-sm-half">
                <rf-tag
                  :bg-color="`rgba(${themeColor.rgb}, 0.08)`"
                  :border-radius="6"
                  :color="themeColor.color"
                  :text="tagItem"
                  lr-padding="8rpx"
                />
              </view>
            </view>
            <view v-else-if="product.tags?.length > 0" class="font-color-light font-sm in1line line-height-1">
              {{ product.tags?.join(" | ") }}
            </view>
          </view>
          <!--    领券      -->
          <view
            :class="'bg-gradual-' + themeColor.name"
            class="rf-product-detail__introduce__coupon flex-shrink"
            @tap="showPopupService('couponClass', props.product?.canReceiveCoupon)"
          >
            <text class="font-sm">领券</text>
            <rf-icon name="iconyou" padding-top="2" size="24" />
          </view>
        </view>
        <view class="product-info-wrapper">
          <view class="pt-sm">
            <text class="font-lg font-weight-500">
              {{ product.name }}
            </text>
            <text class="sketch">
              {{ product.sketch }}
            </text>
          </view>
          <view v-if="product.predictDiscount > 0" class="to-vip-card flex-between font-sm">
            现在开通会员卡，本商品预计可省{{ product.predictDiscount }}元
            <view
              class="btn font-color-dark font-sm flex-center font-weight-normal"
              @tap="navTo(mRouteConfig.accountCenter)"
            >
              立即开卡
            </view>
          </view>
          <view class="btn-tag font-color-light">
            <view class="btn-tag-item share">
              <button class="share-btn font-color-light border-color-none" open-type="share" @tap.stop="share()">
                <rf-icon name="iconshangpinxiangqingye_fenxiang" size="32" />
                <text class="ml-sm">
                  分享
                </text>
              </button>
            </view>
            <view class="btn-tag-item" @tap="toFavorite">
              <rf-icon
                :color="favorite ? themeColor.color : ''"
                :name="favorite ? 'iconshangpinxiangqingye_yishoucang' : 'iconshangpinxiangqingye_shoucang'"
                size="32"
              />
              <text class="ml-sm">
                收藏
              </text>
            </view>
            <view class="btn-tag-item" @tap="openPoster">
              <rf-icon name="iconshangpinxiangqingye_shengchenghaibao" size="32" />
              <text class="ml-sm">
                生成海报
              </text>
            </view>
          </view>
        </view>
      </view>
      <!--商品参数-->
      <view class="rf-product-detail__info">
        <!--预计发货时间-->
        <rf-item-popup v-if="marketingType === MarketingTypeEnum.PRE_SELL" title="发货时间">
          <template #content>
            <view v-if="product.marketing?.delivery_type === 1" class="font-color-dark">
              {{ dayTime(product.marketing?.delivery_time) }}
            </view>
            <view v-else class="font-color-dark">
              预付定金后，{{ product.marketing?.delivery_day || 0 }}天后发货
            </view>
          </template>
        </rf-item-popup>
        <!--尾款支付时间-->
        <rf-item-popup v-if="marketingType === MarketingTypeEnum.PRE_SELL" title="尾款时间">
          <template #content>
            <view class="font-sm-2 font-color-dark">
              {{ time(product.marketing?.final_start_time) }} - {{ time(product.marketing?.final_end_time) }}
            </view>
          </template>
        </rf-item-popup>
        <!--品牌-->
        <rf-item-popup v-if="product.brand && product.brand.title" title="商品品牌">
          <template #content>
            <view
              :class="'text-' + themeColor.name"
              class="font-base font-color-dark"
              @tap="
                navTo(mRouteConfig.productList, {
                  param: JSON.stringify({
                    brand_id: props.product?.brand?.id
                  })
                })
              "
            >
              {{ product.brand && product.brand.title }}
            </view>
          </template>
        </rf-item-popup>
        <!--发货地址-->
        <rf-item-popup v-if="product.address_name" title="发货地址">
          <template #content>
            <view class="font-base font-color-dark">
              {{ product.address_name }}
            </view>
          </template>
        </rf-item-popup>
        <!--商品库存-->
        <rf-item-popup
          v-if="parseInt(product.is_stock_visible, 10) === 1"
          :is-empty="parseInt(state.currentStock, 10) === 0"
          empty="库存不足"
          title="库存"
        >
          <template #content>
            <view class="font-base font-color-dark">
              {{ state.currentStock || product.stock || 0 }}
              {{ product.unit || "件" }}
            </view>
          </template>
        </rf-item-popup>
        <!--满减送-->
        <rf-item-popup
          v-if="product?.fullGiveRule?.length > 0"
          :spec-class="state.fullGiveClass"
          title="满减送"
          @hide="hideService"
          @show="showPopupService('fullGiveClass', product.fullGiveRule)"
        >
          <template #content>
            <view class="con-list font-base font-color-dark">
              <text :class="'text-' + themeColor.name">
                {{ product.fullGiveRule[0] }}
              </text>
            </view>
          </template>
          <template #right>
            <view v-if="product.fullGiveRule.length > 0">
              <rf-icon name="iconyou" size="26" />
            </view>
          </template>
          <template #popup>
            <view class="service">
              <view class="content">
                <view v-for="(item, index) in product.fullGiveRule" :key="index" class="row">
                  <text>{{ item }}</text>
                </view>
              </view>
              <button :class="'bg-gradual-' + themeColor.name" class="rf-confirm-btn" @tap="hideService">
                确定
              </button>
            </view>
          </template>
        </rf-item-popup>
        <!--满包邮-->
        <rf-item-popup
          v-if="product.fullMail && product.fullMail.is_open === '1' && product.shipping_type !== '1'"
          title="满包邮"
        >
          <template #content>
            <view :class="'text-' + themeColor.name" class="font-base font-color-dark">
              满{{ product.fullMail.full_mail_money }}元包邮
            </view>
          </template>
        </rf-item-popup>
        <!--购买类型-->
        <rf-item-popup :spec-class="state.specClass" title="选择" @hide="hideService" @show="toggleSpec">
          <template #content>
            <text v-if="state.currentSkuName" class="mr-sm-half font-base font-color-dark">
              {{ state.currentSkuName }} * {{ state.currentCartCount }}
            </text>
            <text v-else class="mr-sm-half font-base font-color-dark">
              请选择规格
            </text>
          </template>
          <template #right>
            <rf-icon name="iconyou" size="26" />
          </template>
          <template #popup>
            <rf-attr-content
              v-if="state.specClass === 'show'"
              :current-sku-name="state.currentSkuName"
              :market-type="marketingType"
              :max-num="maxNum"
              :min-num="minNum"
              :product="product"
              @close="state.specClass = 'none'"
              @toggle="toggleSpec"
            />
          </template>
        </rf-item-popup>
        <!--优惠券-->
        <rf-item-popup
          :is-empty="product.canReceiveCoupon?.length === 0"
          :spec-class="state.couponClass"
          empty="暂无可领取优惠券"
          title="优惠券"
          @hide="hideService"
          @show="showPopupService('couponClass', props.product?.canReceiveCoupon)"
        >
          <template #content>
            <text class="font-base font-color-dark">
              领取优惠券
            </text>
          </template>
          <template v-if="product.canReceiveCoupon?.length > 0" #right>
            <rf-icon name="iconyou" size="26" />
          </template>
          <template #popup>
            <view class="service">
              <!-- 优惠券列表 -->
              <scroll-view class="mb-lg" scroll-y style="max-height: 800rpx">
                <view v-for="(item, index) in product.canReceiveCoupon" :key="index" @tap="getCoupon(item.id)">
                  <rf-coupon :coupon-info="item" />
                </view>
              </scroll-view>
            </view>
          </template>
        </rf-item-popup>
        <!--限购说明-->
        <rf-item-popup
          v-if="notMarketingByType(String(marketingType)) && parseInt(product.max_buy, 10) > 0"
          title="限购"
        >
          <template #content>
            <text class="font-base font-color-dark">
              {{ `${product.max_buy} ${product.unit || "件"}` }}
            </text>
          </template>
        </rf-item-popup>
        <!--满减送-->
        <rf-item-popup
          v-if="product.fullGive && product.fullGive.length > 0"
          :spec-class="state.fullGiveClass"
          title="满减送"
          @hide="hideService"
          @show="showPopupService('fullGiveClass', product.fullGive)"
        >
          <template #content>
            <view class="in1line">
              <text
                v-for="(fullGiveItem, fullGiveIndex) in product.fullGive"
                :key="fullGiveIndex"
                class="font-color-dark">
                <text>{{ fullGiveItem }}</text>
                <text v-if="fullGiveIndex < product.fullGive.length - 1" class="ml-sm mr-sm font-color-dark">·</text>
              </text>
            </view>
          </template>
          <template #right>
            <view v-if="product.fullGive.length > 0">
              <rf-icon name="iconyou" size="26" />
            </view>
          </template>
          <template #popup>
            <view class="service">
              <view class="content">
                <view class="title">
                  满减送
                </view>
                <view v-for="(item, index) in product.fullGive" :key="index" class="row">
                  <view class="description">
                    活动 {{ index + 1 }}
                  </view>
                  <view class="explain">
                    {{ item }}
                  </view>
                </view>
              </view>
              <button :class="'bg-gradual-' + themeColor.name" class="rf-confirm-btn" @tap="hideService">
                确定
              </button>
            </view>
          </template>
        </rf-item-popup>
        <!--积分活动-->
        <rf-item-popup v-if="parseInt(product.give_point, 10) > 0 || product.point_exchange != 0" title="积分活动">
          <template #content>
            <view class="con-list font-base font-color-dark">
              <text v-if="product.point_exchange_type > 1">
                兑换类型: {{ pointExchangeTypeFilter(product.point_exchange_type) }}
              </text>
              <!--						<text v-if="parseInt(product.give_point, 10) > 0">赠送类型: {{ product.integral_give_type | integralGiveTypeFilter }}</text>-->
              <text v-if="parseInt(product.give_point, 10) > 0">
                下单可获得: {{ givePointFilter(props.product) }}积分
              </text>
              <text v-if="product.point_exchange != 0">
                兑换所需积分: {{ product.point_exchange }}
              </text>
              <text v-if="product.max_use_point != 0">
                可使用抵扣积分: {{ product.max_use_point }}
              </text>
              <text
                v-if="product.point_exchange_type == 3"
                :class="'text-' + themeColor.name"
                @tap="addCart('buy', true)"
              >
                积分兑换 >>
              </text>
            </view>
          </template>
        </rf-item-popup>
        <!--配送-->
        <rf-item-popup
          v-if="product.delivery_type && product.delivery_type.length > 0"
          :spec-class="state.deliveryTypeClass"
          title="配送"
          @hide="hideService"
          @show="showPopupService('deliveryTypeClass', product.delivery_type)"
        >
          <template #content>
            <view class="in1line">
              <text
                v-for="(deliveryTypeItem, deliveryTypeIndex) in product.delivery_type"
                :key="deliveryTypeIndex"
                class="font-color-dark">
                <text>{{ deliveryTypeItem.name }}</text>
                <text
                  v-if="deliveryTypeIndex < product.delivery_type.length - 1"
                  class="ml-sm mr-sm font-color-dark">·
                </text>
              </text>
            </view>
          </template>
          <template #right>
            <view v-if="product.delivery_type.length > 0">
              <rf-icon name="iconyou" size="26" />
            </view>
          </template>
          <template #popup>
            <view class="service">
              <view class="content">
                <view class="title">
                  配送
                </view>
                <view v-for="(item, index) in product.delivery_type" :key="index" class="row">
                  <view class="description">
                    {{ item.name }}
                  </view>
                  <view class="explain">
                    {{ item.explain }}
                  </view>
                </view>
              </view>
              <button :class="'bg-gradual-' + themeColor.name" class="rf-confirm-btn" @tap="hideService">
                确定
              </button>
            </view>
          </template>
        </rf-item-popup>
        <!--服务-->
        <rf-item-popup
          v-if="product.service && product.service.length > 0"
          :spec-class="state.serviceClass"
          title="保障"
          @hide="hideService"
          @show="showPopupService('serviceClass', product.service)"
        >
          <template #content>
            <view class="in1line">
              <text v-for="(serviceItem, serviceIndex) in product.service" :key="serviceIndex" class="font-color-dark">
                <text>{{ serviceItem.name }}</text>
                <text v-if="serviceIndex < product.service.length - 1" class="ml-sm mr-sm  font-color-dark">·</text>
              </text>
            </view>
          </template>
          <template #right>
            <view v-if="product.service.length > 0">
              <rf-icon name="iconyou" size="26" />
            </view>
          </template>
          <template #popup>
            <view class="service">
              <view class="content">
                <view class="title">
                  服务保障
                </view>
                <view v-for="(item, index) in product.service" :key="index" class="row">
                  <view class="description">
                    <image :src="item.cover" class="image" />
                    {{ item.name }}
                  </view>
                  <view class="explain">
                    {{ item.explain }}
                  </view>
                </view>
              </view>
              <button :class="'bg-gradual-' + themeColor.name" class="rf-confirm-btn" @tap="hideService">
                确定
              </button>
            </view>
          </template>
        </rf-item-popup>
        <!--阶梯优惠-->
        <rf-item-popup
          v-if="product.ladderPreferential?.length > 0"
          :spec-class="state.ladderPreferentialClass"
          title="阶梯优惠"
          @hide="hideService"
          @show="showPopupService('ladderPreferentialClass', product.ladderPreferential)"
        >
          <template #content>
            <view class="con-list font-base font-color-dark">
              <text>
                满{{ product?.ladderPreferential[0].quantity }}{{ product.unit || "件" }}
                <text v-if="parseInt(product?.ladderPreferential[0].type, 10) === 1">
                  每{{ product.unit || "件" }}减{{ product?.ladderPreferential[0].price }}元
                </text>
                <text v-if="parseInt(product?.ladderPreferential[0].type, 10) === 2">
                  每{{ product.unit || "件" }}{{ parseInt(product?.ladderPreferential[0].price, 10) }}折
                </text>
              </text>
            </view>
          </template>
          <template v-if="product.ladderPreferential?.length > 0" #right>
            <rf-icon name="iconyou" size="26" />
          </template>
          <template #popup>
            <view class="service">
              <view class="content">
                <view v-for="(item, index) in props.product?.ladderPreferential" :key="index" class="row">
                  <view class="title">
                    满{{ item.quantity }}{{ product.unit || "件" }}
                    <text v-if="parseInt(item.type, 10) === 1">
                      每{{ product.unit || "件" }}减{{ item.price }}元
                    </text>
                    <text v-if="parseInt(item.type, 10) === 2">
                      每{{ product.unit || "件" }}{{ parseInt(item.price, 10) }}折
                    </text>
                  </view>
                </view>
              </view>
              <button :class="'bg-gradual-' + themeColor.name" class="rf-confirm-btn" @tap="hideService">
                确定
              </button>
            </view>
          </template>
        </rf-item-popup>
        <!--商品参数-->
        <rf-item-popup
          v-if="product.attributeValue?.length > 0"
          :spec-class="state.attributeValueClass"
          title="参数"
          @hide="hideService"
          @show="showPopupService('attributeValueClass', props.product?.attributeValue)"
        >
          <template #content>
            <view class="in1line">
              <text v-for="(attrItem, attrIndex) in product.attributeValue" :key="attrIndex" class="font-color-dark">
                <text>{{ attrItem.title }}</text>
                <text v-if="attrIndex < product.attributeValue.length - 1" class="ml-sm mr-sm font-color-dark">·</text>
              </text>
            </view>
          </template>
          <template v-if="product.attributeValue.length > 0" #right>
            <rf-icon name="iconyou" size="26" />
          </template>
          <template #popup>
            <view class="text-center font-color-dark font-lg pt-base pb-base">
              商品参数
            </view>
            <scroll-view class="pl-base pr-base rf-scroll-bottom" scroll-y>
              <view
                v-for="(item, index) in product.attributeValue"
                :key="index"
                :class="index < product.attributeValue.length - 2 ? 'b-b-dark' : ''"
                class="pl-lg pt-base pb-base pr-lg rf-scroll-bottom__header"
              >
                <view class="mt-base flex-align-items">
                  <view class="font-color-light w120">
                    {{ item.title }}
                  </view>
                  <view class="font-color-dark">
                    {{ item.data || "暂无参数" }}
                  </view>
                </view>
              </view>
            </scroll-view>
            <button :class="'bg-gradual-' + themeColor.name" class="rf-confirm-btn" @tap="hideService">
              确定
            </button>
          </template>
        </rf-item-popup>
      </view>
      <!--店铺名称-->
      <view
        v-if="globalConfig.store_entrance && product.merchant && mSiteConfig.devPattern === 'b2b2c'"
        class="rf-product-detail__merchant"
      >
        <view class="rf-product-merchant">
          <view class="flex-align-items">
            <rf-image
              :src="(product.merchant && product.merchant.cover) || globalConfig.app_logo"
              border-radius="50%"
              class="mr-base"
              height="106"
              width="106"
            />
            <view class="flex-1">
              <view class="in1line font-lg mb-sm font-weight-500">
                {{ (product.merchant && product.merchant.title) || globalConfig.app_name }}
              </view>
              <view class="merchant-desc">
                <view :class="'bg-'+themeColor.name" class="merchant-tag">
                  <text class="scale-9 font-sm pl-sm pr-sm">店铺</text>
                </view>
                <view class="rate-wrap flex-align-items">
                  <text class="font-color-light font-sm">
                    综合体验
                  </text>
                  <rf-rate
                    :active-color="themeColor.color"
                    :disabled="true"
                    :size="30"
                    :value="product.merchant.grade && product.merchant.grade.match_point"
                    class="rf-rate ml-sm"
                  />
                </view>
              </view>
            </view>
            <view class="merchant-grade">
              <text class="merchant-grade-item">
                商品描述 {{ keepTwoDecimal(product.merchant.grade && product.merchant.grade.synthesize_point) }}
              </text>
              <text class="merchant-grade-item">
                卖家服务 {{ keepTwoDecimal(product.merchant.grade && product.merchant.grade.service_point) }}
              </text>
              <text class="merchant-grade-item">
                发货速度 {{ keepTwoDecimal(product.merchant.grade && product.merchant.grade.delivery_point) }}
              </text>
            </view>
          </view>
          <view class="btn-group">
            <button
              :class="'text-' + themeColor.name"
              class="btn no-border"
              @tap="
                baseNavTo(mRouteConfig.merchant, {
                  id: product?.merchant_id,
                  type: 2
                })
              "
            >
              全部商品
            </button>
            <button
              :class="'text-' + themeColor.name"
              class="btn no-border"
              @tap="baseNavTo(mRouteConfig.merchant, { id: product?.merchant_id })"
            >
              进店逛逛
            </button>
          </view>
        </view>
      </view>
      <!-- 评价 -->
      <view class="rf-product-detail__section" @tap="toEvaluateList">
        <view class="flex-align-items">
          <text class="flex-1 font-lg font-weight-500">
            评价
            <text class="font-color-light">
              ({{ (product.evaluateStat && product.evaluateStat.total_num) || 0 }})
            </text>
          </text>
          <text v-if="product.match_ratio" :class="'text-' + themeColor.name">
            好评率{{ product.match_ratio }}%
          </text>
          <text v-else class="tip">
            暂无评价信息
          </text>
          <rf-icon class="font-color-light ml-sm" name="iconyou" size="28" />
        </view>
        <view v-if="product.evaluate && product.evaluate.length > 0" class="flex-align-items mt-lg mb-base">
          <rf-image
            :src="(product.evaluate && product.evaluate[0] && product.evaluate[0].member_head_portrait) || headImg"
            border-radius="50%"
            height="72"
            width="72"
          />
          <view class="flex-1 ml-base">
            <view class="mt-sm font-color-dark">
              {{ (product.evaluate && product.evaluate[0] && product.evaluate[0].member_nickname) || "匿名用户" }}
            </view>
            <view class="desc">
              <text class="font-sm font-color-light">
                {{ time(product.evaluate && product.evaluate[0] && product.evaluate[0].created_at) }}
              </text>
            </view>
          </view>
          <rf-rate
            v-if="product.evaluate.length > 0"
            :active-color="themeColor.color"
            :value="product.evaluate[0].scores"
            disabled="true"
            size="28"
          />
        </view>
        <!--    评论内容    -->
        <view v-if="product.evaluate && product.evaluate.length > 0" class="font-base in2line">
          {{ (product.evaluate && product.evaluate[0] && product.evaluate[0].content) || "这个人很懒，什么都没留下~" }}
        </view>
        <view v-else class="mt-lg font-sm-2 font-color-light">
          暂无相关评价
        </view>
        <!--    购买规格    -->
        <view class="desc">
          <text
            v-if="(product.evaluate && product.evaluate[0] && product.evaluate[0].sku_name)"
            class="attr font-sm font-color-light"
          >
            {{ (product.evaluate && product.evaluate[0] && product.evaluate[0].sku_name) }}
          </text>
        </view>
      </view>
      <!--底部商品详情-->
      <view class="rf-product-detail__detail">
        <view class="d-header">
          <text class="line" />
          <text class="font-color-light">
            商品详情
          </text>
          <text class="line" />
        </view>
        <rf-parser :content="String(product.intro)" lazy-load />
      </view>
      <!--购买须知-->
      <view v-if="product.type === ProductTypeEnum.CARD_VOLUME" class="rf-product-detail__detail">
        <view class="d-header">
          <text class="line" />
          <text class="font-color-light">
            购买须知
          </text>
          <text class="line" />
        </view>
        <view class="desc-wrapper">
          <view :class="'text-' + themeColor.name" class="header">
            使用规则
          </view>
          {{ product.extend.text_rule }}
        </view>
        <view class="desc-wrapper">
          <view :class="'text-' + themeColor.name" class="header">
            可用时间
          </view>
          {{ product.extend.text_use_time }}
        </view>
        <view class="desc-wrapper">
          <view :class="'text-' + themeColor.name" class="header">
            有效期
          </view>
          <text v-if="TermOfValidityTypeEnum.GET === product.extend.term_of_validity_type">购买后
            {{ product.extend.fixed_term }} 天内
          </text>
          <text v-if="TermOfValidityTypeEnum.FIXATION === product.extend.term_of_validity_type">
            {{ product.extend.end_time }} - {{ product.extend.start_time }}
          </text>
        </view>
        <view class="desc-wrapper">
          <view :class="'text-' + themeColor.name" class="header">
            限制使用次数
          </view>
          {{ product.extend.confine_use_number }} 次
        </view>
      </view>
      <!--价格保障说明-->
      <view v-if="globalConfig.product_after_sale_explain" class="rf-product-detail__detail">
        <view class="d-header">
          <text class="line" />
          <text class="font-color-light">
            价格说明
          </text>
          <text class="line" />
        </view>
        <view class="pl-lg pr-lg">
          <rf-parser :content="globalConfig.product_after_sale_explain" lazy-load />
        </view>
      </view>
      <!-- 底部操作菜单 -->
      <view class="page-bottom">
        <view class="page-bottom-bth-wrapper">
          <view
            v-if="globalConfig.store_entrance && mSiteConfig.devPattern === 'b2b2c'"
            class="p-b-btn"
            @tap="baseNavTo(mRouteConfig.merchant, { id: product?.merchant_id })"
          >
            <rf-icon
              class="font-weight-500 font-color-dark mb-4"
              name="iconshangpinxiangqingye_dibudianpu"
              size="40"
            />
            <text class="font-sm font-color-light">
              店铺
            </text>
          </view>
          <view v-else class="p-b-btn" @tap="baseNavTo(mRouteConfig.index)">
            <rf-icon class="font-weight-500 font-color-dark mb-4" name="iconzhuyedefuben" size="40" />
            <text class="font-sm font-color-light">
              首页
            </text>
          </view>
          <view class="p-b-btn cart" @tap="baseNavTo(mRouteConfig.cart)">
            <rf-icon
              class="font-weight-500 font-color-dark mb-4"
              name="iconshangpinxiangqingye_gouwuche"
              size="40"
            />
            <text class="font-sm font-color-light">
              购物车
            </text>
            <view class="badge">
              <rf-badge
                v-if="hasLogin && cartNum && cartNum > 0"
                :text="cartNum"
                size="small"
                type="error"
              />
            </view>
          </view>
          <button
            v-if="globalConfig.app_service_type > 0"
            :open-type="globalConfig.app_service_type === 20 ? 'contact' : ''"
            class="p-b-btn border-color-none no-border-btn"
            @tap="
              toService(mRouteConfig.service, {
                merchant_id: product.merchant_id,
                productId: product.id
              })
            "
          >
            <rf-icon
              class="font-weight-500 font-color-dark mb-4"
              name="iconshangpinxiangqingye_kefu"
              size="40"
            />
            <text class="font-sm font-color-light">
              客服
            </text>
          </button>
        </view>
        <view v-if="marketingType === MarketingTypeEnum.PRE_SELL && parseInt(state.currentStock || product.stock, 10) > 0"
        >
          <button
            :class="'bg-gradual-' + themeColor.name"
            :disabled="addCartBtnDisabled"
            class="action-btn-submit in1line"
            @tap="addCart(MarketingTypeEnum.PRE_SELL)"
          >
            <text v-if="props.product.marketing.pre_sell_type === '2'" class="font-base">
              全款预定 {{ product.marketing?.marketing_price }}
            </text>
            <text v-else class="font-sm in1line">
              定金 {{ moneySymbol }}{{ product.marketing?.marketing_price }}
              {{ ` | 可抵 ${moneySymbol}${Number(product.marketing?.deposit_expansion)}` }}
            </text>
          </button>
        </view>
        <view
          v-else-if="
            (!product.marketing_type ||
              product.marketing_type === MarketingTypeEnum.BUY_NOW ||
              product.marketing_type === MarketingTypeEnum.BALE ||
              product.marketing_type === MarketingTypeEnum.SECOND_HALF_DISCOUNT) &&
              parseInt(state.currentStock || product.stock, 10) > 0
          "
          class="action-btn-group"
        >
          <button
            v-if="!addCartBtnDisabled"
            :class="'bg-sub-gradual-' + themeColor.name"
            class="action-btn none-border font-sm-2"
            @tap="addCart('cart')"
          >
            加入购物车
          </button>
          <button
            v-if="!addCartBtnDisabled"
            :class="'bg-gradual-' + themeColor.name"
            :disabled="buyBtnDisabled"
            class="action-btn none-border font-sm-2"
            @tap="addCart('buy')"
          >
            立即购买
          </button>
          <button v-else :class="'bg-gradual-' + themeColor.name" class="action-btn-submit" @tap="addCart('buy')">
            立即购买
            <text class="font-sm">
              {{ moneySymbol }}
            </text>
            <text class="font-sm-2">
              {{ currentProductPrice }}
            </text>
          </button>
        </view>
        <view
          v-else-if="
            product.marketing_type === MarketingTypeEnum.DISCOUNT &&
              parseInt(state.currentStock || product.stock, 10) > 0
          "
          class="action-btn-group"
        >
          <button
            v-if="!addCartBtnDisabled"
            :class="
              bargainSecondFlag(product.marketing.start_time, product.marketing.end_time) === '距活动结束'
                ? 'bg-sub-gradual-' + themeColor.name
                : 'btn-disabled no-border-btn'
            "
            :disabled="bargainSecondFlag(product.marketing.start_time, product.marketing.end_time) !== '距活动结束'"
            class="action-btn none-border font-sm-2"
            @tap="addCart('cart')"
          >
            加入购物车
          </button>
          <button
            v-if="!addCartBtnDisabled"
            :class="
              bargainSecondFlag(product.marketing.start_time, product.marketing.end_time) === '距活动结束'
                ? 'bg-gradual-' + themeColor.name
                : 'btn-disabled no-border-btn'
            "
            :disabled="bargainSecondFlag(product.marketing.start_time, product.marketing.end_time) !== '距活动结束'"
            class="action-btn none-border font-sm-2"
            @tap="addCart('buy')"
          >
            立即购买
          </button>
          <button v-else :class="'bg-gradual-' + themeColor.name" class="action-btn-submit" @tap="addCart('buy')">
            立即购买
            <text class="font-sm">
              {{ moneySymbol }}
            </text>
            <text class="font-sm-2">
              {{ currentProductPrice }}
            </text>
          </button>
        </view>
        <view
          v-else-if="
            product.marketing_type === MarketingTypeEnum.WHOLESALE &&
              parseInt(state.currentStock || product.stock, 10) > 0
          "
          class="action-btn-group"
        >
          <button
            :class="'bg-sub-gradual-' + themeColor.name"
            class="action-btn none-border"
            @tap="navTo(mRouteConfig.product, { id: product.id })"
          >
            <view class="lh-12">
              <view class="font-sm-2">
                直接购买
              </view>
              <view class="in1line">
                <text class="font-sm">
                  {{ moneySymbol }}
                </text>
                <text class="font-sm-2">
                  {{ product.minSkuPrice }}
                </text>
              </view>
            </view>
          </button>
          <button
            :class="
              bargainSecondFlag(product.marketing.start_time, product.marketing.end_time) === '距活动结束'
                ? 'bg-gradual-' + themeColor.name
                : 'btn-disabled no-border-btn'
            "
            :disabled="bargainSecondFlag(product.marketing.start_time, product.marketing.end_time) !== '距活动结束'"
            class="action-btn none-border"
            @tap="addCart('buy')"
          >
            <view class="lh-12">
              <view class="font-sm-2">
                开团抢购
              </view>
              <view class="in1line">
                <text class="font-sm">
                  {{ moneySymbol }}
                </text>
                <text class="font-sm-2">
                  {{ currentProductPrice }}
                </text>
              </view>
            </view>
          </button>
        </view>
        <view
          v-else-if="
            product.marketing_type === MarketingTypeEnum.BARGAIN &&
              parseInt(state.currentStock || product.stock, 10) > 0
          "
          class="action-btn-group"
        >
          <button
            :class="'bg-sub-gradual-' + themeColor.name"
            class="action-btn no-border buy-now-btn in1line none-border"
            @tap="navTo(mRouteConfig.product, { id: product.id })"
          >
            直接购买
          </button>
          <button
            :class="
              bargainSecondFlag(product.marketing.start_time, product.marketing.end_time) === '距活动结束'
                ? 'bg-gradual-' + themeColor.name
                : 'btn-disabled no-border-btn'
            "
            :disabled="bargainSecondFlag(product.marketing.start_time, product.marketing.end_time) !== '距活动结束'"
            class="action-btn no-border add-cart-btn in1line none-border"
            @tap="addCart(MarketingTypeEnum.BARGAIN)"
          >
            发起砍价
          </button>
        </view>
        <view class="action-btn">
          <button
            v-if="
              product.marketing_type === MarketingTypeEnum.GROUP_BUY &&
                parseInt(state.currentStock || product.stock, 10) > 0
            "
            :class="'bg-gradual-' + themeColor.name"
            :disabled="bargainSecondFlag(product.marketing.start_time, product.marketing.end_time) !== '距活动结束'"
            class="action-btn-submit"
            @tap="addCart('buy')"
          >
            立即团购 {{ moneySymbol }}{{ currentProductPrice }}
          </button>
          <button
            v-if="
              product.marketing_type === MarketingTypeEnum.SEC_KILL &&
                parseInt(state.currentStock || product.stock, 10) > 0
            "
            :class="
              bargainSecondFlag(product.marketing.start_time, product.marketing.end_time) === '距活动结束'
                ? 'bg-gradual-' + themeColor.name
                : 'btn-disabled no-border-btn'
            "
            :disabled="bargainSecondFlag(product.marketing.start_time, product.marketing.end_time) !== '距活动结束'"
            class="action-btn-submit"
            @tap="addCart('buy')"
          >
            立即抢购
            <text class="font-sm">
              {{ moneySymbol }}
            </text>
            <text class="font-sm-2">
              {{ currentProductPrice }}
            </text>
          </button>
          <button
            v-if="
              product.marketing_type === MarketingTypeEnum.POINT_EXCHANGE &&
                parseInt(state.currentStock || product.stock, 10) > 0
            "
            :class="'bg-gradual-' + themeColor.name"
            class="action-btn-submit in1line"
            @tap="addCart('buy')"
          >
            <text class="font-sm" />
            <text class="font-sm-2">
              {{ currentProductPrice }}
            </text>
          </button>
          <view
            v-if="parseInt(state.currentStock || product.stock, 10) === 0 && product.is_open_presell !== '1'"
            :disabled="buyBtnDisabled"
            :style="{height: '72rpx', lineHeight: '72rpx', minWidth: '320rpx', borderRadius: '100rpx',
                     margin: '0 20rpx 0 80rpx', fontSize: '26rpx', maxWidth: '360rpx', backgroundColor: '#eee',
                     textAlign: 'center', color: '#999'}"
          >
            库存不足
          </view>
        </view>
      </view>
    </view>
    <!-- 分享引导 -->
    <rf-base-popup v-if="state.shareShow" @close="closePopup">
      <template #position>
        <image :src="shareBg" class="share-bg" />
      </template>
    </rf-base-popup>
    <rf-live-tag v-if="product.name" />
    <!--海报分享-->
    <!--    <rf-poster :poster="state.poster.itempFilePathImg" :show="state.posterShow" @hidePoster="hidePoster" />-->
  </view>
</template>
<script lang="ts" setup>
import {computed, reactive} from "vue";
import {currentTimestamp, formatToDateTime} from "@/utils/dateUtil";
import mAssetsPath from "@/config/assets";
import mHelper from "@/utils/helper";
import mConstData from "@/config/constData";
import mRouter from "@/utils/routerUtil";
import mRouteConfig from "@/config/routes"; // 路由管理
import memberApi from "@/api/tinyShop/member";
import marketingApi from "@/api/tinyShop/marketing";
import commonApi from "@/api/tinyShop/common";
import {PlatformGroupEnum} from "@/enum/loginEnum";
import {Route} from "@/response/route";
import {MarketingTypeEnum} from "@/enum/marketingEnum";
import RfImage from "@/components/rf-image/rf-image.vue";
import store from "@/store";
import {ProductTypeEnum, TermOfValidityTypeEnum} from "@/enum/productEnum";
import {navTo} from "@/utils/hFunc";
import mSiteConfig from "@/config/site";

// 海报弹窗开关
const openPoster = () => {
  uni.setStorageSync('prodPosterParams', {
    marketingType: props.marketingType,
    marketingId: props.marketingId,
    marketingProductId: props.marketingProductId,
    url: props.url,
    currentProductPrice: currentProductPrice.value,
    productDetail: props.product,
  })

  navTo({name: '商品海报', path: '/pages/product/prodPoster'})
};

const closePopup = () => {
  state.shareShow = false
}


const props = defineProps({
  product: {
    type: Object,
    default() {
      return {};
    }
  },
  wholesale: {
    type: Array,
    default() {
      return [];
    }
  },
  userInfo: {
    type: Object,
    default() {
      return {};
    }
  },
  url: {
    type: String,
    default: ""
  },
  marketingType: {
    type: String,
    default: MarketingTypeEnum.BUY_NOW
  },
  marketingId: {
    type: String,
    default: ""
  },
  marketingProductId: {
    type: String,
    default: ""
  }
});

let state = reactive({
  bgObj: {
    height: 10,
    width: 10
  },
  carouselTabActive: "1",
  serviceShow: false,
  posterShow: false,
  serviceClass: "none",
  ladderPreferentialClass: "none",
  attributeValueClass: "none",
  specClass: "none",
  couponClass: "none",
  shareShow: false,
  fullGiveClass: "none",
  deliveryTypeClass: "none",
  cartType: "",
  couponList: [],
  currentStock: "",
  currentSkuPrice: 0,
  currentSkuName: "",
  skuId: "",
  currentCartCount: 1,
  evaluateList: [],
  tabCurrentIndex: 0,
  errorInfo: "",
  isPointExchange: false,
  shareFrom: "",
  poster: {} as AnyObject,
  promoterCode: "",
  addressList: [] as AnyObject,
  currentWholesaleOn: {} as AnyObject,
  wholesaleOnShow: false,
  wholesaleId: "",
  tabState: 1,
  thirdPartyWechatMiniQrCodeImg: ""
});

const headImg = mAssetsPath.headImg;
const shareBg = mAssetsPath.shareBg;
const moneySymbol = mConstData.moneySymbol;
const vipPrice = mAssetsPath.vipIcon;
const hasLogin = mHelper.hasLogin();
const themeColor = mHelper.getThemeColor(); // 主题颜色
const globalConfig = mHelper.getGlobalConfig(); // 通用配置

const emit = defineEmits(["product"]);

const cartNum = computed(() => {
  return store.getters["notify/getCartNum"];
});

const typeName = computed(() => {
  let typeName;
  switch (props.product.marketing_type) {
    case "discount":
      typeName = "秒杀商品";
      break;
    case "bargain":
      typeName = "砍价商品";
      break;
    case "group_buy":
      typeName = "团购商品";
      break;
    case "wholesale":
      typeName = "拼团商品";
      break;
  }
  if (props.marketingType === MarketingTypeEnum.BUY_NOW) typeName = "普通商品";
  return typeName;
});
// 购买按钮禁用
const buyBtnDisabled = computed(() => {
  return parseInt(state.currentStock || props.product.stock, 10) === 0;
});
// 添加购物车按钮禁用
const addCartBtnDisabled = computed(() => {
  console.log(mHelper.isVirtualProduct(props.product.type));
  return (
      props.product.point_exchange_type === "2" ||
      props.product.point_exchange_type === "4" ||
      parseInt(state.currentStock || props.product.stock, 10) === 0 ||
      props.product.type === "2" ||
      mHelper.isVirtualProduct(props.product.type)
  );
});
// 最小购买数量
const minNum = computed(() => {
  let minNum;
  if (props.marketingType === "group_buy") {
    minNum = parseInt(props.product.marketing.min_num, 10);
  } else {
    minNum = parseInt(props.product.min_buy, 10) || 1;
  }
  return minNum;
});
// 最小购买数量
const maxNum = computed(() => {
  let maxNum;
  if (props.marketingType === "group_buy") {
    maxNum = parseInt(props.product.marketing.max_num, 10);
  } else if (props.marketingType === "bargain" || props.marketingType === "wholesale") {
    maxNum = 1;
  } else {
    maxNum = 0;
  }
  return maxNum;
});
const favorite = computed(() => {
  return !!props.product.myCollect;
});
const wholesaleOn = computed(() => {
  return (props.wholesale.length > 0 && props.wholesale[0]) || {};
});
const wholesaleSuccess = computed(() => {
  return (props.wholesale.length > 0 && props.wholesale[1]) || {};
});
// 计算倒计时时间
const second = computed(() => {
  return function (val: string) {
    return Math.floor(Number(val) - currentTimestamp());
  };
});
const bargainSecond = computed(() => {
  return function (startTime: string, endTime: string) {
    const now = currentTimestamp();
    if (now < Number(startTime)) {
      return Math.floor(Number(startTime) - now);
    } else if (now < Number(endTime) && now >= Number(startTime)) {
      return Math.floor(Number(endTime) - now);
    } else {
      return 0;
    }
  };
});
const bargainSecondFlag = computed(() => {
  return function (startTime: string, endTime: string) {
    const now = currentTimestamp();
    if (now < Number(startTime)) {
      return "距活动开始";
    } else if (now < Number(endTime) && now >= Number(startTime)) {
      return "距活动结束";
    } else {
      return "";
    }
  };
});
const wholesaleBtnDisabled = computed(() => {
  if (!hasLogin) return true;
  let flag = false;
  console.log(props.userInfo);
  state.currentWholesaleOn?.members?.forEach((item) => {
    if (parseInt(item.id, 10) === parseInt(props.userInfo?.member?.id, 10)) {
      flag = true;
    }
  });
  return flag;
});
const currentProductPrice = computed(() => {
  let price: string;
  switch (props.marketingType) {
      // 积分兑换
    case MarketingTypeEnum.POINT_EXCHANGE :
      return Number(props.product.marketing?.marketing_price) > 0
          ? `${moneySymbol}${props.product.marketing?.marketing_price} + ${Number(props.product.marketing?.point)}积分`
          : `${Number(props.product.marketing?.point)}积分`;
      // 预售
    case MarketingTypeEnum.PRE_SELL :
      price = props.product?.price;
      // 全款预定
      if (props.product?.marketing.pre_sell_type == "2") {
        price = props.product?.marketing.marketing_price;
      }
      return price;
    case MarketingTypeEnum.BUY_NOW :
      // 当前选择的价格
      if (state.currentSkuPrice) {
        return state.currentSkuPrice;
      }
      if (props.product?.maxSkuPrice > props.product?.minSkuPrice) {
        return `${props.product?.minSkuPrice} ~ ${props.product?.maxSkuPrice}`;
      }
      if (props.product.is_member_discount > 0) {
        return props.product?.member_discount_price;
      }
      return props.product?.price;
    default :
      return props.product.marketing?.marketing_price;
  }
});

const time = (val: string) => {
  return formatToDateTime(parseInt(val) * 1000, "YYYY-MM-DD HH:mm");
};
const dayTime = (val: string) => {
  return formatToDateTime(parseInt(val) * 1000, "YYYY-MM-DD");
};
const marketingTagFilter = (type: string) => {
  let tag = mAssetsPath.discountTagBg;
  switch (type) {
    case MarketingTypeEnum.PRE_SELL:
      tag = mAssetsPath.presellTagBg;
      break;
    case MarketingTypeEnum.DISCOUNT:
      tag = mAssetsPath.discountTagBg;
      break;
    case MarketingTypeEnum.BARGAIN:
      tag = mAssetsPath.bargainTagBg;
      break;
    case MarketingTypeEnum.GROUP_BUY:
      tag = mAssetsPath.groupBuyTagBg;
      break;
    case MarketingTypeEnum.WHOLESALE:
      tag = mAssetsPath.wholesaleTagBg;
      break;
    case MarketingTypeEnum.POINT_EXCHANGE:
      tag = mAssetsPath.pointTagBg;
      break;
    case MarketingTypeEnum.SEC_KILL:
      tag = mAssetsPath.secKillTagBg;
      break;
  }
  return tag;
};
const priceDescFilter = (type: string) => {
  let tag = "";
  switch (type) {
    case MarketingTypeEnum.PRE_SELL:
      tag = "预售价";
      break;
    case MarketingTypeEnum.BARGAIN:
      tag = "底价";
      break;
    case MarketingTypeEnum.GROUP_BUY:
      tag = "团购价";
      break;
    case MarketingTypeEnum.WHOLESALE:
      tag = "拼团价";
      break;
    case MarketingTypeEnum.SEC_KILL:
      tag = "秒杀价";
      break;
    case MarketingTypeEnum.POINT_EXCHANGE:
      tag = "积分兑换";
      break;
    default:
      tag = "优惠价";
      break;
  }
  if (props.product?.marketing?.activity_title) tag = props.product?.marketing?.activity_title;
  return tag;
};
const pointExchangeTypeFilter = (val: string) => {
  const type = ["", "非积分兑换", "积分加现金", "积分兑换或直接购买", "只支持积分兑换"];
  return type[parseInt(val, 10)];
};
const givePointFilter = (val: any) => {
  return val.integral_give_type === "1"
      ? Math.round(
          (parseInt(val.give_point, 10) / 100) * parseInt(val.minSkuPrice, 10)
          // eslint-disable-next-line no-mixed-spaces-and-tabs
      )
      : parseInt(val.give_point, 10);
};
const keepTwoDecimal = (value: string | number) => {
  return mHelper.keepTwoDecimal(value);
};
// 轮播图点击监听
const handleCarouselTabClick = (val: string) => {
  state.carouselTabActive = val;
};
// 返回上一页
const navBack = () => {
  //判断是否有上一页 外部进入没有上一页 直接回到首页
  // eslint-disable-next-line no-undef
  const pages = getCurrentPages();
  if (pages.length <= 1) {
    baseNavTo({name: '首页', path: '/pages/index/index'});
  } else {
    mRouter.back();
  }
};
// 分享商品
const share = async () => {
  // #ifdef MP
  // mStore.commit("setMpShowState", true);
  // #endif
  // #ifdef H5
  if (mHelper.isWechat()) {
    state.shareShow = true;
    mHelper.handleWxH5Share(props.product.name, "", props.url, props.product.picture);
  } else {
    mHelper.h5Copy(props.url);
  }
  // #endif
  // #ifdef APP-PLUS
  mHelper.handleAppShare(props.url, globalConfig.app_name, props.product.name, props.product.picture);
  // #endif
};
const baseNavTo = (route: Route, query = {}) => {
  mRouter.push({route, query});
};
// 客服跳转 0-不显示 10-rf客服 20-微信小程序客服 30-企业微信客服 40-二维码客服
const toService = (route: Route, query = {}) => {
  if (!hasLogin) {
    mHelper.backToLogin();
  }
  switch (globalConfig.app_service_type) {
    case 0 | 20:
      break;
    case 10:
      state.wholesaleOnShow = false;
      mRouter.push({route, query});
      break;
    case 30: //判断是H5还是小程序 跳转方式不同 app_service_corp_id  app_service_wechat_work_url
      // #ifdef H5
      query = {url: globalConfig.app_service_wechat_work_url};
      mRouter.push({route: mRouteConfig["url"], query});
      // #endif
      // #ifdef MP-WEIXIN
      wx.openCustomerServiceChat({
        extInfo: {
          url: globalConfig.app_service_wechat_work_url //客服地址链接
        },
        corpId: globalConfig.app_service_corp_id, //必须和你小程序上的一致
        success(res) {
          console.log(res, 1);
        },
        fail(res) {
          console.log(res, 2);
        },
      });
      // #endif
      break;
    case 40: //调起二维码弹窗 app_service_qr
      if (!globalConfig.app_service_qr) {
        mHelper.toast("暂未配置客服二维码");
      }
      state.serviceShow = true;
      break;
    default:
      return;
  }
};
// 弹窗显示
const showPopupService = (type: string, list: []) => {
  if (list?.length === 0 && type === "couponClass") {
    mHelper.toast("暂无可领取优惠券");
    return;
  }
  if (list?.length === 0) return;
  switch (type) {
    case "specClass":
      state.specClass = "show";
      break;
    case "couponClass":
      state.couponClass = "show";
      break;
    case "serviceClass":
      state.serviceClass = "show";
      break;
    case "deliveryTypeClass":
      state.deliveryTypeClass = "show";
      break;
    case "ladderPreferentialClass":
      state.ladderPreferentialClass = "show";
      break;
    case "attributeValueClass":
      state.attributeValueClass = "show";
      break;
    case "wholesaleOnClass":
      state.wholesaleOnShow = true;
      break;
    case "fullGiveClass":
      state.fullGiveClass = "show";
      break;
  }
};
// 关闭服务弹窗
const hideService = () => {
  state.specClass = "none";
  state.couponClass = "none";
  state.serviceClass = "none";
  state.ladderPreferentialClass = "none";
  state.attributeValueClass = "none";
  state.fullGiveClass = "none";
  state.deliveryTypeClass = "none";
};
// 获取优惠券
const getCoupon = async (id: string) => {
  if (!hasLogin) {
    await mHelper.backToLogin();
    return;
  }
  try {
    await marketingApi.handleCouponReceive({id});
    mHelper.toast("领取成功");
    state.couponClass = "none";
  } catch (e) {
    //
    state.couponClass = "none";
  }
};
// 跳转至评价列表
const toEvaluateList = () => {
  if (!props.product.evaluateStat || parseInt(props.product.comment_num, 10) === 0) {
    return;
  }
  baseNavTo(mRouteConfig.evaluationList, {
    productId: props.product.evaluateStat.product_id
  });
};
// 获取收货地址列表
const getAddressList = async (status: number) => {
  try {
    state.addressList =
        status === 1
            ? ((await memberApi.getAddressList()) as AnyObject)
            : ((await commonApi.getPickupPointIndex({
              merchant_id: props.product.merchant_id
            })) as AnyObject);
  } catch (e) {
    //
  }
};
// 规格弹窗开关
const toggleSpec = (row: AnyObject) => {
  if (!props.product.id) return;
  if (state.specClass === "show") {
    state.currentStock = row.stock;
    state.currentSkuPrice = Number(row.price);
    state.currentSkuName = row.skuName;
    state.currentCartCount = row.cartCount;
    const sku_id = row.skuId;
    if (parseInt(state.currentStock, 10) === 0) {
      mHelper.toast("库存不足");
      return;
    }
    if (state.cartType === "cart") {
      handleCartItemCreate(sku_id);
    } else if (state.cartType === "buy") {
      buy(sku_id);
    } else if (state.cartType === MarketingTypeEnum.PRE_SELL) {
      preSell(sku_id);
    } else if (state.cartType === MarketingTypeEnum.BARGAIN) {
      getAddressList(state.tabState);
      state.skuId = sku_id;
      state.cartType = "";
      state.specClass = "none";
      handleBargainCreate();
      return;
    }
    state.cartType = "";
    state.specClass = "none";
  } else if (state.specClass === "none") {
    console.log(state.currentSkuName);
    state.specClass = "show";
  }
};

const hidePoster = () => {
  // #ifdef APP-PLUS
  if (props.product.video_url && state.carouselTabActive === "2") {
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  }
  // #endif
  state.posterShow = false;
};

// 添加商品至购物车
const handleCartItemCreate = async (skuId: string) => {
  try {
    await memberApi.handleCartItemCreate({
      sku_id: skuId,
      number: state.currentCartCount
    });
    mHelper.toast("添加购物车成功");
    let cartNum = (await memberApi.getCartItemCount()) as AnyObject;
    store.commit("notify/setCartNum", {cartNum});
    state.specClass = "none";
  } catch (e) {
    //
  }
};
// 收藏
const toFavorite = async () => {
  if (!props.product.id) return;
  if (!hasLogin) {
    state.specClass = "none";
    await mHelper.backToLogin();
  } else {
    favorite.value ? await handleCollectDel() : await handleCollectCreate();
  }
};
// 收藏商品
const handleCollectCreate = async () => {
  try {
    await commonApi.handleCollectCreate({
      topic_id: props.product.id,
      topic_type: "product"
    });
    mHelper.toast("收藏成功");
    emit("product");
  } catch (e) {
    //
  }
};
// 倒计时结束 刷新页面
const bargainTimeUp = () => {
  emit("product");
};
// 取消收藏商品
const handleCollectDel = async () => {
  try {
    await commonApi.handleCollectDel({}, {id: props.product?.myCollect?.id});
    mHelper.toast("取消收藏成功");
    emit("product");
  } catch (e) {
    //
  }
};
const buy = async (id: string) => {
  const data: AnyObject[] = [];
  const params: AnyObject = {item: {}};
  params["merchant_id"] = props.product.merchant && props.product.merchant.id;
  params["item"]["data"] = {
    sku_id: id,
    num: state.currentCartCount,
    marketing_id: props.product.marketing_id,
    marketing_product_id: props.marketingProductId
  };

  switch (props.marketingType) {
    case MarketingTypeEnum.GROUP_BUY:
      params["item"]["group_buy_id"] = props.product.marketing.id;
      break;
    case "wholesale":
      params["item"]["wholesale_product_id"] = props.product.marketing.id;
      params["item"]["data"]["join_id"] = state.currentWholesaleOn.id;
      if (state.wholesaleId) {
        params["item"]["wholesale_id"] = state.wholesaleId;
        state.wholesaleId = "";
      }
      break;
    default:
      break;
  }

  params["item"]["type"] = props.product.marketing_type ? props.product.marketing_type : "buy_now";
  if (state.promoterCode) params["item"]["promoter_code"] = state.promoterCode;
  data.push(params);
  console.log(params);
  baseNavTo(mRouteConfig.createOrder, {
    data: JSON.stringify(data),
    promoter_code: state.promoterCode
  });
};
const preSell = async (skuId: string) => {
  const data: AnyObject[] = [];
  const params: AnyObject = {item: {}};
  params["merchant_id"] = props.product.merchant.id;
  params["item"]["type"] = MarketingTypeEnum.PRE_SELL;
  params["item"]["data"] = JSON.stringify({
    num: state.currentCartCount,
    sku_id: skuId,
    marketing_id: props.product.marketing_id
  });
  if (state.promoterCode) params["item"]["promoter_code"] = state.promoterCode;
  data.push(params);
  baseNavTo(mRouteConfig.createOrder, {
    data: JSON.stringify(data),
    promoter_code: state.promoterCode
  });
};
const addCart = (type: string, flag = "") => {
  if (!props.product.id) return;
  if (!hasLogin) {
    mHelper.backToLogin();
    return;
  }
  // state.wholesaleId = isPointExchange;
  state.wholesaleOnShow = false;
  state.specClass = "show";
  state.cartType = type;
  state.isPointExchange = !!flag;
};
// 创建砍价订单
const handleBargainCreate = async () => {
  const params: any = {};
  params.sku_id = state.skuId;
  params.bargain_id = props.product.marketing.id;
  try {
    const data = (await marketingApi.handleBargainLaunchCreate(params)) as any;
    baseNavTo(mRouteConfig.bargainDetail, {id: data.id});
  } catch (e) {
    //
  }
};
// 展示拼团窗口
const showWholesaleOn = (id: string) => {
  getWholesaleView(id);
};
// 获取拼团信息
const getWholesaleView = async (id: string) => {
  try {
    state.currentWholesaleOn = await marketingApi.getWholesaleView({id});
    state.wholesaleOnShow = true;
  } catch (e) {
    //
  }
};
// 正常营销类型
const notMarketingByType = (marketingType: string) => {
  if (
      marketingType === MarketingTypeEnum.BUY_NOW ||
      marketingType === MarketingTypeEnum.BALE ||
      marketingType === MarketingTypeEnum.SECOND_HALF_DISCOUNT
  ) {
    return true;
  }

  return false;
};

</script>
<style lang="scss">
.rf-product-detail {
  position: relative;
  padding-bottom: calc(env(safe-area-inset-bottom) / 2 + 40rpx);

  .hideCanvasView {
    position: absolute;
    top: 999999rpx;
  }

  &__back {
    position: fixed;
    left: 40rpx;
    z-index: 9999;
    padding-top: var(--status-bar-height);
    top: 40rpx;
    font-size: 48rpx;
    font-weight: 600;
    color: $font-color-dark;
  }

  &__content {
    padding-bottom: 60rpx;
  }

  /* 商品轮播图 */
  &__carousel {
    height: 750rpx;
    position: relative;

    .video-wrapper {
      width: 100%;
      height: 100%;

      video {
        width: 100%;
        height: 100%;
      }
    }

    swiper {
      height: 100%;
    }

    .swiper-item {
      display: flex;
      justify-content: center;
      align-content: center;
      height: 750rpx;
      overflow: hidden;

      .swiper-item-tag {
        position: absolute;
        right: $spacing-base;
        bottom: $spacing-base;
        background-color: rgba(0, 0, 0, 0.4);
        padding: 6rpx 16rpx;
        color: $color-white;
        border-radius: 28rpx;
        transform: scale(0.88);
      }
    }

    .carousel-tab {
      align-items: center;
      display: flex;
      width: 100%;
      height: 50rpx;
      justify-content: center;
      margin-right: $spacing-sm;
      z-index: 10;
      position: relative;

      .carousel-tab-item {
        height: 100%;
        width: 108rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .carousel-tab-item:first-child {
        border-bottom-left-radius: 2rpx;
        border-right: none;
        position: relative;

      }

      .carousel-tab-item:last-child {
        border-bottom-right-radius: 2rpx;
        border-left: none;
      }

      .gap-container {
        width: 2rpx;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);

        .gap {
          width: 100%;
          height: 50%;
          background-color: #abacae;
        }
      }


      .normal {
        background-color: rgba(0, 0, 0, 0.3);
        color: #e1e1e1;
        font-size: 22rpx;
      }

      .normal-white {
        background-color: $color-white;
        border: 1rpx solid rgba(0, 0, 0, 0.3);
        color: #999;
        font-size: 22rpx;
      }

      .active {
        background-color: rgba(0, 0, 0, 0.3);
        color: #fff;
        font-weight: 700;
        font-size: 22rpx;
      }
    }

    .carousel-tab-app {
      .carousel-tab-item:first-child {
        border-bottom-left-radius: 8rpx;
        border-right: none;
      }

      .carousel-tab-item:last-child {
        border-bottom-right-radius: 8rpx;
        border-left: none;
      }
    }

    .carousel-tab-napp {
      top: -150rpx;

      .carousel-tab-item {
        width: 85rpx;
        font-size: $font-sm;
      }

      .carousel-tab-item:first-child {
        border-top-left-radius: 24rpx;
        border-bottom-left-radius: 24rpx;
        border-right: none;
        padding-left: 10rpx;
      }

      .carousel-tab-item:last-child {
        border-top-right-radius: 24rpx;
        border-bottom-right-radius: 24rpx;
        border-left: none;
        padding-right: 10rpx;
      }
    }
  }

  /* 商品标题 */
  &__introduce {
    border-radius: 20rpx;
    margin: 20rpx 10rpx 20rpx;
    width: calc(100% - 20rpx);
    background-color: $color-white;
    padding: 10rpx 20rpx;

    &__coupon {
      width: 98rpx;
      height: 40rpx;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 40rpx;
      padding-left: 8rpx;
    }

    .product-info-wrapper {
      width: 100%;

      .title {
        flex: 1;
        font-size: $font-lg;
        color: $color-black;
        letter-spacing: 2rpx;
        line-height: 1.3;
        padding-top: $spacing-base;
      }

      .sketch {
        margin-top: 10rpx;
        display: block;
        color: $font-color-light;
        font-size: $font-base;
      }

      .btn-tag {
        display: flex;

        .btn-tag-item {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .share {
          .share-btn {
            font-size: $font-base;
            background: transparent;
            border-radius: 0;
            padding: 0;
            margin: 0;
          }

          .share-btn:after {
            background: transparent;
            border: none;
          }
        }
      }

      .to-vip-card {
        background: linear-gradient(to right, #1a1a1a 0%, #4d4d4d 100%);
        color: #ffe6b2;
        padding: 18rpx 30rpx;
        border-radius: 12rpx;

        .btn {
          width: 136rpx;
          height: 44rpx;
          background: linear-gradient(to right, #e7c279 0%, #ffe5b2 99%);
          border-radius: 22px;
        }
      }
    }

    .data {
      width: 100%;
      display: flex;
      margin: $spacing-base 0;
      padding: $spacing-base $spacing-lg;

      .item-fill {
        flex: 1;
        text-align: center;
      }
    }
  }

  .price-block {
    width: 100%;
    position: relative;
    opacity: 0.8;
    overflow: hidden;

    .bg {
      z-index: 9;
      position: absolute;
      right: 0;
      bottom: 0;
    }

    .wrapper {
      z-index: 10;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price-box {
      font-size: $font-base;

      .price-show-nm {
        display: flex;
        align-items: flex-end;
      }

      .m-price-wrapper {
        .m-price {
          margin-left: $spacing-sm;
          text-decoration: line-through;
        }
      }
    }

    .rf-time-down {
    }

    .price-wrapper-pd {
      padding: $spacing-lg $spacing-lg 0;
      background-color: $color-white;

      .price-box {
      }

      .product-tag {
        margin-left: $spacing-sm;
        display: flex;
        align-items: center;
      }

      .m-price {
        color: $font-color-light;
      }
    }
  }

  .service {
    padding: $spacing-lg 0 0;
    background-color: $page-color-base;

    .content {
      padding: 0 $spacing-lg;

      .title {
        text-align: center;
        font-size: $font-lg;
        color: $font-color-dark;
        font-weight: 400;
        margin: 0 0 $spacing-base;
      }

      .row {
        font-size: $font-lg;
        margin-bottom: $spacing-base;

        .description {
          font-size: $font-base + 2rpx;
          color: $font-color-dark;
          display: flex;
          align-items: center;
          margin-bottom: $spacing-sm;
        }

        .image {
          width: 48rpx;
          height: 48rpx;
          border-radius: 6rpx;
          margin-right: $spacing-sm;
        }

        .explain {
          color: $font-color-light;
        }
      }
    }
  }

  .share-bg {
    position: fixed;
    z-index: 101;
    width: 576rpx;
    height: 371rpx;
    top: 2%;
    right: 3%;
  }

  // 玩法介绍
  &__info {
    border-radius: 20rpx;
    background-color: $color-white;
    margin: 10rpx 10rpx 20rpx;
    width: calc(100% - 20rpx);
    padding: 20rpx 0;

    .tit {
      width: 140rpx;
    }

    .con {
      flex: 1;
      color: $font-color-dark;

      .selected-text {
        margin-right: 10rpx;
      }
    }

    .con-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      color: $font-color-dark;
      line-height: 40rpx;
    }
  }

  &__info-no-padding {
    padding: 0;
  }

  // 正在拼团弹窗
  .wholesale-avatar {
    width: 80rpx;
    height: 90rpx;
    position: relative;
    display: inline-block;

    .avatar-tag {
      width: 100%;
      position: absolute;
      display: flex;
      justify-content: center;
      top: 52rpx;
      transform: scale(0.68);
      z-index: 98;
    }
  }

  &__merchant {
    border-radius: 20rpx;
    background-color: $color-white;
    margin: 10rpx 10rpx 20rpx;
    width: calc(100% - 20rpx);
    padding: 30rpx 20rpx;

    .rf-product-merchant {
      .merchant-desc {
        width: 90%;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .merchant-tag {
          color: #FFFFFF;
          border-radius: 25rpx;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .rate-wrap {
        background-color: #f2f2f2;
        padding: 2rpx 12rpx;
        border-radius: 36rpx;
        transform: scale(0.9);
      }

      .merchant-grade {
        width: 160rpx;

        .merchant-grade-item {
          margin: 2rpx 0;
          display: flex;
          color: $font-color-base;
          font-weight: normal;
          text-align: center;
          font-size: $font-sm;
        }
      }

      .btn-group {
        margin-left: 120rpx;

        .btn {
          display: inline-block;
          height: 60rpx;
          line-height: 60rpx;
          margin: 30rpx 30rpx 0 0;
          width: 180rpx;
          border: 1px solid;
          border-radius: 30rpx;
          font-size: $font-base;
        }
      }
    }
  }

  /*  详情 */
  &__detail {
    margin-top: 16rpx;
    padding-bottom: 30rpx;

    .d-header {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80rpx;
      color: $font-color-dark;

      .line {
        width: 48rpx;
        height: 1rpx;
        background-color: rgba(0, 0, 0, 0.25);
        margin: 0 16rpx;
      }
    }

    .desc-wrapper {
      padding: 0 $page-row-spacing;
      margin-bottom: 15rpx;
      color: $font-color-light;

      .header {
        font-size: $font-base + 2rpx;
        font-weight: 400;
        color: $font-color-dark;
        margin-bottom: 5rpx;
      }
    }
  }

  /* 评价 */
  &__section {
    display: flex;
    flex-direction: column;
    border-radius: 20rpx;
    background-color: $color-white;
    margin: 10rpx 10rpx 20rpx;
    width: calc(100% - 20rpx);
    padding: 30rpx 20rpx;

    .h-list {
      white-space: nowrap;
      margin: 20rpx 0;

      .h-item {
        display: inline-block;
        font-size: $font-sm;
        margin-right: 20rpx;
        border-right: 1rpx solid rgba(0, 0, 0, 0.1);

        .combination-product-item {
          display: inline-block;
          margin-right: 20rpx;
          position: relative;

          .combination-product-img {
            width: 200rpx;
            height: 180rpx;
          }

          .combination-product-price {
            width: 100%;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.4);
            position: absolute;
            border-bottom-left-radius: 6rpx;
            bottom: 0;
            padding: 0 8rpx;
            right: 0;
            color: #fff;
            font-size: $font-sm;
          }
        }

        .combination-product-title {
          margin-top: 10rpx;
          text-align: center;
        }
      }
    }
  }

  .rf-short-btn {
    margin-left: $spacing-base;
    height: 50rpx;
    padding: 0 12rpx;
  }

  .rf-confirm-btn {
    width: 640rpx;
    margin-top: $spacing-lg;
    margin-bottom: $spacing-lg;
  }

  .desc {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .modal-btn {
    height: 220rpx;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .btn-item {
      width: 80%;
    }
  }
}
</style>
