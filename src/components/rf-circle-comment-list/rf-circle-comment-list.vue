<template>
  <view class="rf-circle-comment-list">
    <view class="text-left font-lg font-weight-500"
      >{{ title }} <text class="font-weight-normal font-color-light font-sm">({{ collectNum(commentList) }})</text>
    </view>
    <view
      class="rf-circle-comment-list__item"
      v-for="(item, index) in commentList"
      :key="index"
    >
      <view class="flex">
        <view class="mt-sm">
          <rf-image
            :src="item.baseMember?.head_portrait || headImg"
            width="80"
            height="80"
            border-radius="50%"
          ></rf-image>
        </view>
        <view class="flex-1 ml-base">
          <view class="flex-between">
            <text class="font-sm-2 in1line font-color-light mr-base">{{
              item.baseMember?.nickname || "匿名用户"
            }}</text>
            <view class="flex-align-items">
              <view class="flex-align-items">
                <rf-icon
                  name="iconshejiao-dianzan"
                  size="36"
                  :class="
                    item.myNice ? 'text-' + themeColor.name : 'font-color-light'
                  "
                  @tap="clickPraise(item, index)"
                ></rf-icon>
                <text class="font-color-light font-lg ml-sm">{{
                  item.nice_num
                }}</text>
              </view>
              <!--              <view class="ml-lg">-->
              <!--                <rf-icon-->
              <!--                  name="iconic_huifu"-->
              <!--                  size="36"-->
              <!--                  class="font-color-light"-->
              <!--                  @tap="clickReComment(item)"-->
              <!--                ></rf-icon>-->
              <!--              </view>-->
              <view
                class="ml-lg"
                v-if="item?.baseMember.id === userInfo?.member?.id"
              >
                <rf-icon
                  name="iconic_shanchu"
                  size="36"
                  class="font-color-light"
                  @tap="handleCommentDelete(item)"
                ></rf-icon>
              </view>
            </view>
          </view>
          <view class="mt-sm vertical-align" @tap="clickReComment(item)">
            <view
              class="inline-block"
              @tap.stop="() => {}"
              v-if="item.content?.indexOf('http') === 0"
            >
              <rf-image
                  :preview="true" width="150" height="150" :src="item.content"></rf-image>
            </view>
            <text class="font-base-2 font-color-dark" v-else>
              {{ item.content }}
            </text>
            <text class="font-sm font-color-light ml-base">{{
              time(item.updated_at)
            }}</text>
          </view>
        </view>
      </view>
      <view
        class="rf-circle-comment-list__item__reply mt-base"
        v-show="item.reply?.length > 0"
      >
        <view
          v-for="(itemChild, indexChild) in item.reply"
          :key="indexChild"
          class="mb-sm"
        >
          <view class="flex">
            <rf-image
              :src="itemChild.formMember?.head_portrait || headImg"
              width="56"
              height="56"
              border-radius="50%"
            ></rf-image>
            <view class="flex-1 ml-base">
              <view class="flex-between">
                <text class="font-sm-2 in1line mr-base font-color-light">{{
                  itemChild.formMember?.nickname || "匿名用户"
                }}</text>
                <view class="flex-align-items">
                  <view class="flex-align-items">
                    <rf-icon
                      name="iconshejiao-dianzan"
                      size="36"
                      :class="
                        itemChild.myNice
                          ? 'text-' + themeColor.name
                          : 'font-color-light'
                      "
                      @tap="clickPraise(itemChild, index, indexChild)"
                    ></rf-icon>
                    <text class="font-color-light font-lg ml-sm-half">{{
                      itemChild.nice_num
                    }}</text>
                  </view>
                  <!--                  <view class="ml-base">-->
                  <!--                    <rf-icon-->
                  <!--                      name="iconic_huifu"-->
                  <!--                      size="32"-->
                  <!--                      class="font-color-light"-->
                  <!--                      @tap="clickReCommentChild(item, itemChild)"-->
                  <!--                    ></rf-icon>-->
                  <!--                  </view>-->
                  <view
                    class="ml-base"
                    v-if="itemChild?.formMember.id === userInfo?.member?.id"
                  >
                    <rf-icon
                      name="iconic_shanchu"
                      size="36"
                      class="font-color-light"
                      @tap="handleCommentReplyDelete(itemChild)"
                    ></rf-icon>
                  </view>
                </view>
              </view>
              <view
                class="mt-sm-half flex-table"
                @tap="clickReCommentChild(item, itemChild)"
              >
                <view
                  class="inline-block"
                  @tap.stop="() => {}"
                  v-if="itemChild.content?.indexOf('http') === 0"
                >
                  <rf-image
                    width="150"
                    height="150"
                    :src="itemChild.content"
                  ></rf-image>
                </view>
                <text class="font-base-2 font-color-dark" v-else>
                  {{ itemChild.content }}
                </text>
                <text class="font-sm font-color-light ml-base">{{
                  time(itemChild.updated_at)
                }}</text>
              </view>
            </view>
          </view>
          <view
            class="mt-base"
            v-if="itemChild.child && itemChild.child.length > 0"
          >
            <view v-for="(row, rowChild) in itemChild.child" :key="rowChild">
              <view class="flex mb-sm">
                <rf-image
                  :src="row.formMember?.head_portrait || headImg"
                  width="56"
                  height="56"
                  border-radius="50%"
                ></rf-image>
                <view class="flex-1 ml-base">
                  <view class="flex-between">
                    <text class="mr-base font-sm-2 in1line font-color-light"
                      ><text class="mr-sm">{{
                        row.formMember?.nickname || "匿名用户"
                      }}</text>
                      <text class="font-weight-normal"
                        >回复 {{ row?.toMember?.nickname || "匿名用户" }}</text
                      ></text
                    >
                    <view class="flex-align-items">
                      <view class="ml-base">
                        <rf-icon
                          name="iconic_shanchu"
                          size="36"
                          v-if="row?.formMember.id === userInfo?.member?.id"
                          class="font-color-light"
                          @tap="handleCommentReplyDelete(row)"
                        ></rf-icon>
                      </view>
                    </view>
                  </view>
                  <view class="mt-sm flex-table">
                    <view
                      class="inline-block"
                      @tap.stop="() => {}"
                      v-if="row.content?.indexOf('http') === 0"
                    >
                      <rf-image
                        :preview="true"
                        width="150"
                        height="150"
                        :src="itemChild.content"
                      ></rf-image>
                    </view>
                    <text class="font-base-2 font-color-dark" v-else>
                      {{ row.content }}
                    </text>
                    <text class="font-sm font-color-light ml-base">{{
                      time(row.updated_at)
                    }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import mAssetsPath from "@/config/assets";
import mHelper from "@/utils/helper";
import { computed, } from "vue";
import store from "@/store";

defineProps({
  commentList: {
    type: Array,
  },
  title: {
    type: String,
    default: "评论",
  },
});

const collectNum = computed(() => {
  return function (list) {
    let num = 0;
    list.length > 0 &&
      list.forEach((fItem) => {
        num++;
        fItem.reply.length > 0 &&
          fItem.reply.forEach((sItem) => {
            num++;
            sItem.child.length > 0 &&
              sItem.child.forEach(() => {
                num++;
              });
          });
      });
    return num;
  };
});

const themeColor = mHelper.getThemeColor(); // 主题颜色
const headImg = mAssetsPath.headImg;

let emit = defineEmits([
  "praise",
  "reComment",
  "delete",
  "deleteChild",
  "commentReplyDelete",
  "commentDelete",
  "reCommentChild",
]);

// 是否登录
let userInfo = computed(() => {
  return store.getters["user/getUserInfo"];
});

const time = (val) => {
  return mHelper.getTimeAgo(val * 1000);
};
// 点赞
const clickPraise = (item, index, indexChild = -1) => {
  emit("praise", { item, index, indexChild, });
};
// 回复 评论
const clickReComment = (item) => {
  emit("reComment", item);
};
// 删除评论
const handleCommentDelete = (item) => {
  emit("commentDelete", item);
};
// 删除回复
const handleCommentReplyDelete = (item) => {
  emit("commentReplyDelete", item);
};
// 回复评论的评论
const clickReCommentChild = (item, itemChild = {}) => {
  emit("reCommentChild", { item, itemChild, });
};
</script>
<style lang="scss">
.rf-circle-comment-list {
  background-color: $color-white;
  padding: $spacing-lg $spacing-lg 0;
  &__item {
    padding: 20rpx 0;
    border-bottom: 1px solid #f6f6f6;
    &__reply {
      border-radius: 10rpx;
      padding: $spacing-sm 0 $spacing-sm 90rpx;
    }
    .comment-child-item-1 {
      flex-wrap: wrap;
      margin: 15rpx 0;
      display: flex;
      align-items: flex-end;
      flex-direction: row;
      .comment-child-item-name {
        white-space: nowrap;
        font-size: 30rpx;
        color: #5074cf;
      }
      .comment-child-item-content {
        font-size: 30rpx;
        text-align: center;
      }
      .comment-sub-time {
        font-size: $font-sm;
        margin-left: $spacing-base;
        color: $font-color-light;
      }
      .comment-child-item-delete {
        font-size: 28rpx;
        color: #999999;
        margin-left: 30rpx;
        text-align: center;
      }
    }
  }
}
</style>
