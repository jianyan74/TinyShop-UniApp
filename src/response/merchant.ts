export interface Merchant {
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
  myCollect: MyCollect;
  grade: Grade;
}
interface Grade {
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
interface MyCollect {
  id: string;
  merchant_id: string;
  member_id: string;
  topic_id: string;
  topic_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// 商户列表
export interface MerchantItem {
  id: string;
  merchant_id: string;
  member_id: string;
  topic_id: string;
  topic_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  distance: number;
  merchant: BaseMerchant;
  products: Product[];
}
export interface BaseMerchant {
  id: string;
  title: string;
  cover: string;
  address_name: string;
  address_details: string;
  longitude: string;
  latitude: string;
  collect_num: string;
}
export interface Product {
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
  shipping_type: string;
  is_member_discount: string;
  is_commission: string;
  member_discount_type: string;
  max_use_point: string;
  give_point: string;
  match_ratio: string;
  unit: string;
  marketing?: any;
  baseMerchant: BaseMerchant;
  marketing_id: string;
  marketing_type: string;
  predict_brokerage: number;
}

// 商家中心
export interface MerchantCenter {
  merchant: BaseMerchantItem[];
  defaultMerchant: DefaultMerchant;
  list: MerchantCenterOrderItem[];
  stat: Stat;
}
export interface BaseMerchantItem {
  id: string;
  title: string;
  cover: string;
}
export interface DefaultMerchant {
  id: number;
  title: string;
  cover: string;
}
export interface Stat {
  count: number;
  money: number;
}
export interface MerchantCenterOrderItem {
  id: string;
  app_id: string;
  merchant_id: string;
  shop_id: string;
  member_id: string;
  product_code_id: string;
  product_code_state: string;
  use_number: string;
  confine_use_number: string;
  order_id: string;
  order_product_id: string;
  product_id: string;
  product_name: string;
  product_type: string;
  auditor_id: string;
  auditor_type: string;
  auditor_name: string;
  auditor_from: string;
  code: string;
  unite_no: string;
  ip: string;
  status: string;
  created_at: string;
  updated_at: string;
  order: MerchantCenterOrder;
  product: MerchantCenterProduct;
}
export interface MerchantCenterOrder {
  id: string;
  merchant_id: string;
  merchant_title: string;
  order_sn: string;
  order_from: string;
  out_trade_no: string;
  order_type: string;
  pay_type: string;
  shipping_type: string;
  buyer_id: string;
  buyer_nickname: string;
  buyer_ip: string;
  buyer_message: string;
  receiver_id: string;
  receiver_mobile: string;
  receiver_province_id: string;
  receiver_city_id: string;
  receiver_area_id: string;
  receiver_name: string;
  receiver_details: string;
  receiver_zip: string;
  receiver_realname: string;
  receiver_longitude: string;
  receiver_latitude: string;
  seller_star: string;
  seller_memo: string;
  consign_time_adjust: string;
  shipping_money: string;
  product_money: string;
  product_original_money: string;
  product_profit_price: string;
  product_type: string;
  product_count: string;
  order_money: string;
  pay_money: string;
  final_money: string;
  point: string;
  marketing_id: string;
  marketing_type: string;
  marketing_money: string;
  wholesale_record_id: string;
  give_point: string;
  give_growth: string;
  give_coin: string;
  order_status: string;
  pay_status: string;
  shipping_status: string;
  feedback_status: string;
  is_evaluate: string;
  tax_money: string;
  store_id: string;
  invoice_id?: any;
  express_company_id: string;
  give_point_type: string;
  give_growth_type: string;
  caballero_member_id: string;
  pay_time: string;
  receiving_time: string;
  consign_time: string;
  sign_time: string;
  finish_time: string;
  close_time: string;
  auto_sign_time: string;
  auto_finish_time: string;
  auto_evaluate_time: string;
  fixed_telephone: string;
  distribution_time_out: string;
  subscribe_shipping_start_time: string;
  subscribe_shipping_end_time: string;
  is_new_member: string;
  is_print: string;
  is_oversold: string;
  refund_money: string;
  refund_num: string;
  is_after_sale: string;
  promoter_code: string;
  promoter_id: string;
  promoter_nickname: string;
  unite_no: string;
  status: string;
  created_at: string;
  updated_at: string;
}
export interface MerchantCenterProduct {
  id: string;
  merchant_id: string;
  buyer_id: string;
  order_id: string;
  order_sn: string;
  store_id: string;
  product_id: string;
  product_name: string;
  product_money: string;
  product_original_money: string;
  product_picture: string;
  sku_id: string;
  sku_name: string;
  sku_no: string;
  barcode: string;
  price: string;
  cost_price: string;
  profit_price: string;
  num: string;
  adjust_money: string;
  point_exchange_type: string;
  product_type: string;
  marketing_id: string;
  marketing_type: string;
  order_type: string;
  order_status: string;
  give_point: string;
  give_growth: string;
  give_coin: string;
  shipping_status: string;
  is_oversold: string;
  is_evaluate: string;
  supplier_id: string;
  supplier_name: string;
  gift_flag: string;
  refund_money: string;
  refund_num: string;
  refund_type: string;
  refund_status: string;
  after_sale_id: string;
  is_commission: string;
  status: string;
  created_at: string;
  updated_at: string;
}
