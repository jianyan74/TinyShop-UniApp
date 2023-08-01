// 商品详情
export interface Product {
  id: string;
  type: string;
  sku_id: string;
  sku_name: string;
  plus_buy_discount: string;
  plus_buy_id: string;
  merchant_id: string;
  name: string;
  picture: string;
  cate_id: string;
  cate_id_one: string;
  cate_id_two: string;
  cate_id_three: string;
  merchant_cate_ids: string;
  brand_id: string;
  type_id: string;
  sketch: string;
  intro: string;
  keywords: string;
  tags: any[];
  marque: string;
  barcode: string;
  total_sales: string;
  price: string;
  market_price: string;
  wholesale_price: string;
  stock: string;
  warning_stock: string;
  covers: string[];
  posters: string;
  state: string;
  is_package: string;
  is_attribute: string;
  sort: string;
  product_status: string;
  shipping_type: string;
  shipping_fee: string;
  shipping_fee_id: string;
  shipping_fee_type: string;
  product_weight: string;
  product_volume: string;
  marketing_type: string;
  marketing_id: string;
  marketing_price: string;
  point_exchange_type: string;
  point_exchange: string;
  max_use_point: string;
  integral_give_type: string;
  give_point: string;
  min_buy: string;
  max_buy: string;
  view: string;
  star: string;
  collect_num: string;
  comment_num: string;
  transmit_num: string;
  province_id: string;
  city_id: string;
  area_id: string;
  address_name: string;
  is_stock_visible: string;
  is_hot: string;
  is_recommend: string;
  is_new: string;
  is_bill: string;
  base_attribute_id: string;
  base_attribute_format: any[];
  match_point: string;
  match_ratio: string;
  sale_date: string;
  is_virtual: string;
  production_date: string;
  shelf_life: string;
  is_open_presell: string;
  presell_time: string;
  presell_day: string;
  presell_delivery_type: string;
  presell_price: string;
  unit: string;
  video_url: string;
  supplier_id: string;
  is_open_commission: string;
  is_open_member_discount: string;
  member_discount_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  presell_deduction_price: string;
  growth_give_type: string;
  give_growth: string;
  is_sales_visible: string;
  sku: Sku[];
  attributeValue: any[];
  ladderPreferential: any[];
  myCollect: string;
  evaluate: any[];
  evaluateStat: EvaluateStat;
  merchant: Merchant;
  minSkuPrice: string;
  maxSkuPrice: boolean;
  commissionRate: any[];
  brand: any[];
  marketing: any[];
  canReceiveCoupon: any[];
  is_buy: number;
  purchased: number;
  pointConfig: string;
  fullMail: string;
  fullGive: FullGive;
  fullGiveRule: string[];
  memberDiscount: AnyObject;
  predictDiscount: number;
  combination: any[];
  service: any[];
  virtualType: any[];
  spec_format: SpecFormatItem[];
}
// 规格列表
export interface SpecFormatItem {
  selected: boolean;
  id: string;
  type: string;
  title: string;
  value: SpecFormatItemValue[];
  common_spec_id: string;
}
export interface SpecFormatItemValue {
  selected: boolean;
  disabled: boolean;
  id: string;
  data: string;
  title: string;
  status: string;
  common_spec_id: string;
  common_spec_value_id: string;
}
export interface EvaluateStat {
  id: string;
  merchant_id: string;
  product_id: string;
  cover_num: string;
  video_num: string;
  again_num: string;
  good_num: string;
  ordinary_num: string;
  negative_num: string;
  total_num: string;
  tags: string;
  status: string;
}
export interface FullGive {
  id: string;
  merchant_id: string;
  merchant_name: string;
  name: string;
  remark: string;
  type: string;
  range_type: string;
  start_time: string;
  end_time: string;
  state: string;
  status: string;
  created_at: string;
  updated_at: string;
  condition_type: string;
  rule: Rule[];
}
export interface Grade {
  merchant_id: number;
  comment_num: number;
  match_credit: number;
  match_point: number;
  match_ratio: number;
  service_credit: number;
  service_ratio: number;
  service_point: number;
  delivery_credit: number;
  delivery_point: number;
  delivery_ratio: number;
  synthesize_point: number;
  status: number;
  created_at: number;
  updated_at: number;
}
export interface Merchant {
  id: string;
  title: string;
  cover: string;
  address_name: string;
  address_details: string;
  longitude: string;
  latitude: string;
  grade: Grade;
  cate: string;
}
export interface Rule {
  id: string;
  full_give_id: string;
  price: string;
  discount: string;
  free_shipping: string;
  give_point: string;
  give_coupon_type_id: string;
  gift_id: string;
  gift: string;
  couponType: string;
}
export interface Sku {
  id: string;
  product_id: string;
  picture: string;
  price: string;
  market_price: string;
  cost_price: string;
  wholesale_price: string;
  name: string;
  stock: string;
  code: string;
  status: string;
  data: string;
}
export interface CartCallback {
  status: string;
  id: string;
  cartCount: number;
  price: string;
  skuId: string;
  skuName: string;
  stock: number;
  type: string;
}

// 商品列表
export interface ProductListItem {
  id: string;
  name: string;
  sketch: string;
  keywords: string;
  picture: string;
  tags: string;
  view: string;
  type: string;
  match_point: string;
  price: number;
  market_price: number;
  stock: string;
  total_sales: string;
  merchant_id: string;
  marketing_type: string;
  marketing_id: string;
  shipping_type: string;
  is_member_discount: string;
  is_commission: string;
  member_discount_type: string;
  max_use_point: string;
  give_point: string;
  match_ratio: string;
  unit: string;
  predict_brokerage: number;
  baseMerchant: BaseMerchant;
  commissionRate: CommissionRate;
}
export interface Brand {
  id: string;
  merchant_id: string;
  title: string;
  cate_id: string;
  cover: string;
  sort: string;
  status: string;
  created_at: string;
  updated_at: string;
  isActive: boolean;
}
interface BaseMerchant {
  id: string;
  title: string;
  cover: string;
  address_name: string;
  address_details: string;
  longitude: string;
  latitude: string;
  collect_num: string;
}
interface CommissionRate {
  id: string;
  merchant_id: string;
  product_id: string;
  distribution_commission_rate: string;
  region_agent_commission_rate: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// 商品评价列表
export interface Evaluation {
  list: EvaluationItem[];
  stat: Stat;
}
export interface EvaluationItem {
  id: string;
  merchant_id: string;
  order_id: string;
  order_sn: string;
  order_product_id: string;
  product_id: string;
  product_name: string;
  product_price: string;
  product_picture: string;
  sku_name: string;
  content: string;
  covers: string[];
  video: string;
  explain_first: string;
  member_id: string;
  member_nickname: string;
  member_head_portrait: string;
  is_anonymous: string;
  scores: string;
  again_content: string;
  again_covers: string[];
  again_explain: string;
  again_addtime: string;
  explain_type: string;
  has_again: string;
  has_content: string;
  has_cover: string;
  has_video: string;
  is_auto: string;
  status: string;
  created_at: string;
  updated_at: string;
}
interface Stat {
  id: string;
  merchant_id: string;
  product_id: string;
  cover_num: string;
  video_num: string;
  again_num: string;
  good_num: string;
  ordinary_num: string;
  negative_num: string;
  total_num: string;
  tags: string;
  status: string;
}
