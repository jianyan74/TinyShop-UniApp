// 种草社区
export interface CircleItem {
  id: string;
  merchant_id: string;
  shop_id: string;
  member_id: string;
  title: string;
  cate_id: string;
  type: string;
  map_id: string;
  cover: string;
  covers: string[];
  video: string;
  video_cover: string;
  content: string;
  nice_num: string;
  disagree_num: string;
  transmit_num: string;
  comment_num: string;
  collect_num: string;
  report_num: string;
  recommend_num: string;
  view: string;
  hot: string;
  keywords: string;
  is_safety: string;
  is_excellent: string;
  audit_status: string;
  refusal_cause: string;
  status: string;
  created_at: string;
  updated_at: string;
  baseMember: BaseMember;
  cate: Cate;
  product: ProductItem[];
  myCollect: string;
  myNice: string;
}
export interface ProductItem {
  id: string;
  merchant_id: string;
  name: string;
  sketch: string;
  keywords: string;
  picture: string;
  view: string;
  match_point: string;
  price: string;
  market_price: string;
  cost_price: string;
  stock: string;
  total_sales: string;
  shipping_type: string;
  is_member_discount: string;
  member_discount_type: string;
  unit: string;
}
interface BaseMember {
  id: string;
  username: string;
  nickname: string;
  head_portrait: string;
}
interface Cate {
  id: string;
  title: string;
}
// 分类
export interface CircleCateItem {
  id: string;
  merchant_id: string;
  shop_id: string;
  title: string;
  cover: string;
  sort: string;
  level: string;
  pid: string;
  tree: string;
  is_recommend: string;
  status: string;
  created_at: string;
  updated_at: string;
}
// 评论列表
export interface CircleCommentItem {
  id: string;
  merchant_id: string;
  shop_id: string;
  member_id: string;
  nickname: string;
  head_portrait: string;
  topic_id: string;
  topic_type: string;
  content: string;
  nice_num: string;
  reply_num: string;
  complaint_num: string;
  is_hot: string;
  is_top: string;
  audit_status: string;
  refusal_cause: string;
  status: string;
  created_at: string;
  updated_at: string;
  reply: CircleReplyCommentItem[];
  baseMember: FormMember;
  myNice: string;
}
interface FormMember {
  id: string;
  username: string;
  nickname: string;
  head_portrait: string;
}
export interface CircleReplyCommentItem {
  id: string;
  merchant_id: string;
  shop_id: string;
  comment_id: string;
  from_member_id: string;
  from_nickname: string;
  from_head_portrait: string;
  to_member_id: string;
  to_nickname: string;
  to_head_portrait: string;
  content: string;
  nice_num: string;
  complaint_num: string;
  pid: string;
  audit_status: string;
  refusal_cause: string;
  status: string;
  created_at: string;
  updated_at: string;
  toMember: string;
  myNice: string;
  formMember: FormMember;
  child: CircleReplyCommentItem[];
}
// 评论点赞收藏
export interface CircleNiceCollectionItem {
  id: string;
  merchant_id: string;
  shop_id: string;
  member_id: string;
  topic_id: string;
  topic_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  circle: Circle;
}
interface Circle {
  id: string;
  merchant_id: string;
  shop_id: string;
  member_id: string;
  title: string;
  cate_id: string;
  type: string;
  map_id: string;
  cover: string;
  covers: string;
  video: string;
  video_cover: string;
  content: string;
  nice_num: string;
  disagree_num: string;
  transmit_num: string;
  comment_num: string;
  collect_num: string;
  report_num: string;
  recommend_num: string;
  view: string;
  hot: string;
  keywords: string;
  is_safety: string;
  is_excellent: string;
  audit_status: string;
  refusal_cause: string;
  status: string;
  created_at: string;
  updated_at: string;
}
// 帖子收藏
export interface CircleCollectionItem {
  id: string;
  merchant_id: string;
  shop_id: string;
  member_id: string;
  topic_id: string;
  topic_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  circle: Circle;
}
