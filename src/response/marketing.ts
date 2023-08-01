// 营销商品列表
export interface MarketingProductSku {
  id: string;
  marketing_id: string;
  marketing_type: string;
  name: string;
  sketch: string;
  keywords: string;
  picture: string;
  view: string;
  match_point: string;
  price: string;
  market_price: string;
  stock: string;
  total_sales: string;
  shipping_type: string;
  is_sales_visible: string;
  is_stock_visible: string;
  merchant: string;
  product: ProductPrice;
  marketing: Marketing;
}
interface Marketing {
  discount: string;
  min_buy: string;
  number: string;
  marketing_price: string;
}

// 我的砍价
export interface MyBargainItem {
  id: string;
  member_id: string;
  start_time: string;
  end_time: string;
  sku_id: string;
  product_id: string;
  min_money: string;
  product_money: string;
  bargain_money: string;
  surplus_money: string;
  state: string;
  sku: Sku;
  baseMember: BaseMember;
}
interface BaseMember {
  id: string;
  nickname: string;
  head_portrait: string;
}
interface Product {
  id: string;
  sku_id: string;
  merchant_id: string;
  shop_id: string;
  name: string;
  picture: string;
  cate_id: string;
  brand_id: string;
  type: string;
  sketch: string;
  intro: string;
  keywords: string;
  tags: string;
  sku_no: string;
  barcode: string;
  sales: string;
  real_sales: string;
  total_sales: string;
  price: string;
  market_price: string;
  cost_price: string;
  stock: string;
  stock_warning_num: string;
  stock_deduction_type: string;
  covers: string;
  video_url: string;
  sort: string;
  delivery_type: any;
  shipping_type: string;
  shipping_fee: string;
  shipping_fee_id: string;
  shipping_fee_type: string;
  weight: string;
  volume: string;
  marketing_id: string;
  marketing_type: string;
  marketing_price: string;
  point_exchange_type: string;
  point_exchange: string;
  point_give_type: string;
  give_point: string;
  max_use_point: string;
  min_buy: string;
  max_buy: string;
  order_max_buy: string;
  view: string;
  star: string;
  collect_num: string;
  comment_num: string;
  transmit_num: string;
  province_id: string;
  city_id: string;
  area_id: string;
  address_name: string;
  attribute_id: string;
  is_spec: string;
  is_stock_visible: string;
  is_sales_visible: string;
  is_hot: string;
  is_recommend: string;
  is_new: string;
  is_bill: string;
  spec_format: string;
  match_point: string;
  match_ratio: string;
  production_date: string;
  shelf_life: string;
  growth_give_type: string;
  give_growth: string;
  unit: string;
  supplier_id: string;
  spec_template_id: string;
  is_commission: string;
  is_member_discount: string;
  member_discount_type: string;
  active_blacklist: string;
  is_list_visible: string;
  start_time: string;
  end_time: string;
  extend: string;
  refusal_cause: string;
  audit_status: string;
  audit_time: string;
  status: string;
  created_at: string;
  updated_at: string;
}
interface Sku {
  id: string;
  merchant_id: string;
  product_id: string;
  name: string;
  picture: string;
  price: string;
  market_price: string;
  cost_price: string;
  stock: string;
  sku_no: string;
  barcode: string;
  weight: string;
  volume: string;
  sort: string;
  data: string;
  status: string;
  created_at: string;
  updated_at: string;
  product: Product;
}

// 砍价详情
export interface BargainDetail {
  id: string;
  member_id: string;
  bargain_id: string;
  start_time: string;
  end_time: string;
  sku_id: string;
  product_id: string;
  min_money: string;
  product_money: string;
  bargain_money: string;
  surplus_money: string;
  state: string;
  partake: Partake[];
  bargain: Bargain;
  sku: Sku;
  baseMember: BaseMember;
  is_accomplish: number;
  buy_status: number;
}
interface Bargain {
  id: string;
  title: string;
  merchant_id: string;
  start_time: string;
  end_time: string;
  buy_max_num: string;
  buy_type: string;
  need_user_level: string;
  min_number: string;
  activity_hours: string;
  pay_close_hours: string;
  one_min_rate: string;
  one_max_rate: string;
  self_bargain: string;
  every_amount: string;
  refusal_cause: string;
  audit_status: string;
  audit_time: string;
  status: string;
  created_at: string;
  updated_at: string;
}
interface Partake {
  id: string;
  launch_id: string;
  merchant_id: string;
  member_id: string;
  bargain_money: string;
  partake: Partake1;
  remark: string;
  status: string;
  created_at: string;
  updated_at: string;
}
interface Partake1 {
  member_nickname: string;
  member_head_portrait: string;
}

// 组合套餐
export interface Combination {
  id: string;
  merchant_id: string;
  title: string;
  price: string;
  original_price: string;
  save_the_price: string;
  refusal_cause: string;
  start_time: string;
  end_time: string;
  audit_status: string;
  audit_time: string;
  status: string;
  created_at: string;
  updated_at: string;
  combinationProduct: CombinationProduct[];
}
interface CombinationProduct {
  id: string;
  merchant_id: string;
  product_id: string;
  marketing_id: string;
  marketing_type: string;
  marketing_data: string;
  marketing_sales: string;
  marketing_stock: string;
  discount: string;
  discount_type: string;
  decimal_reservation_number: string;
  number: string;
  min_buy: string;
  max_buy: string;
  prediction_time: string;
  start_time: string;
  end_time: string;
  status: string;
  is_template: string;
  product: CombinationProduct1;
  selectedSku: {
    skuName: string,
    skuId: string | number,
    skuPrice: string | number
  },
  [prop: string]: any;
}
interface CombinationProduct1 {
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
  is_sales_visible: string;
  is_stock_visible: string;
  is_commission: string;
  unit: string;
  type: string;
  point_exchange_type: string;
  point_give_type: string;
  max_use_point: string;
  give_point: string;
  growth_give_type: string;
  give_growth: string;
  supplier_id: string;
  sku: CombinationSku[];
  base_attribute_format: string;
  [prop: string]: any;
}
interface CombinationSku {
  id: string;
  merchant_id: string;
  product_id: string;
  name: string;
  picture: string;
  price: string;
  market_price: string;
  cost_price: string;
  stock: string;
  sku_no: string;
  barcode: string;
  weight: string;
  volume: string;
  sort: string;
  data: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// 拼团
export interface MyWholesaleItem {
  id: string;
  merchant_id: string;
  member_id: string;
  member_nickname: string;
  member_head_portrait: string;
  member_mobile: string;
  wholesale_id: string;
  type: string;
  code: string;
  product_id: string;
  product_name: string;
  product_price: string;
  product_cost_price: string;
  product_money: string;
  product_picture: string;
  sku_id: string;
  sku_name: string;
  total_number: string;
  real_number: string;
  pay_number: string;
  number: string;
  state: string;
  start_time: string;
  end_time: string;
  free_shipping: string;
  head_discounts: string;
  simulation: string;
  status: string;
  created_at: string;
  updated_at: string;
  merchant: Merchant;
  product: ProductPrice;
}
interface ProductPrice {
  id: string;
  market_price: string;
  price: string;
}
interface Merchant {
  id: string;
  title: string;
  operating_type: string;
  cate_id: string;
  tax_rate: string;
  logo: string;
  cover: string;
  sort: string;
  brief_introduction: string;
  term_of_validity_type: string;
  start_time: string;
  end_time: string;
  email: string;
  province_id: string;
  city_id: string;
  area_id: string;
  address_name: string;
  address_details: string;
  longitude: string;
  latitude: string;
  contacts: string;
  mobile: string;
  tel_no: string;
  level_id: string;
  keywords: string;
  description: string;
  environment: string;
  qq: string;
  credit: string;
  desc_credit: string;
  service_credit: string;
  delivery_credit: string;
  sales_money: string;
  business_week: string;
  business_time: string;
  collect_num: string;
  comment_num: string;
  transmit_num: string;
  auth_role_id: string;
  certification_type: string;
  close_cause: string;
  audit_time: string;
  audit_status: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// 我的拼团记录
export interface MyWholesaleRecord {
  id: string;
  merchant_id: string;
  member_id: string;
  member_nickname: string;
  member_head_portrait: string;
  member_mobile: string;
  wholesale_id: string;
  type: string;
  code: string;
  product_id: string;
  product_name: string;
  product_price: string;
  product_cost_price: string;
  product_money: string;
  product_picture: string;
  sku_id: string;
  sku_name: string;
  total_number: string;
  real_number: string;
  pay_number: string;
  number: string;
  state: string;
  start_time: string;
  end_time: string;
  free_shipping: string;
  head_discounts: string;
  simulation: string;
  status: string;
  created_at: string;
  updated_at: string;
  merchant: Merchant;
}
export interface WholesaleRecord {
  id: string;
  merchant_id: string;
  member_id: string;
  member_nickname: string;
  member_head_portrait: string;
  member_mobile: string;
  wholesale_id: string;
  type: string;
  code: string;
  product_id: string;
  product_name: string;
  product_price: string;
  product_cost_price: string;
  product_money: string;
  product_picture: string;
  sku_id: string;
  sku_name: string;
  total_number: string;
  real_number: string;
  pay_number: string;
  number: string;
  state: string;
  start_time: string;
  end_time: string;
  free_shipping: string;
  head_discounts: string;
  simulation: string;
  status: string;
  created_at: string;
  updated_at: string;
  product: ProductPrice;
  members: Members[];
}
interface Members {
  id: string;
  nickname: string;
  head_portrait: string;
  order_status: string;
  pay_status: string;
}
