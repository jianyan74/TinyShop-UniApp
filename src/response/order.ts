// 订单预览
import { Invoice } from "@/response/invoice";

export interface OrderItemsPreview {
  address: Address;
  account: Account;
  items: Item[];
  productType: string;
  lastMemberInfo: LastMemberInfo;
  coupons: Coupon[];
  pointConfig: PointConfig;
}
export interface Coupon {
  id: string;
  member_id: string;
  merchant_id: string;
  coupon_type_id: string;
  discount: string;
  discount_type: string;
  title: string;
  code: string;
  map_id?: string;
  map_type: string;
  use_order_id: string;
  at_least: string;
  state: string;
  get_type: string;
  single_type: string;
  is_read: string;
  fetch_time: string;
  use_time: string;
  start_time: string;
  end_time: string;
  status: string;
  couponType: CouponType;
}
export interface CouponType {
  id: string;
  merchant_id: string;
  title: string;
  discount: string;
  discount_type: string;
  count: string;
  get_count: string;
  max_fetch: string;
  max_day_fetch: string;
  at_least: string;
  need_user_level: string;
  range_type: string;
  get_start_time: string;
  get_end_time: string;
  start_time: string;
  end_time: string;
  min_price: string;
  max_price: string;
  term_of_validity_type: string;
  fixed_term: string;
  single_type: string;
  is_list_visible: string;
  is_new_people: string;
  remark: string;
  status: string;
  created_at: string;
  updated_at: string;
}
export interface Address {
  id: number;
  merchant_id: number;
  shop_id: number;
  member_id: number;
  realname: string;
  mobile: string;
  province_id: number;
  city_id: number;
  area_id: number;
  name: string;
  details: string;
  street_number: string;
  longitude: string;
  latitude: string;
  floor_level: number;
  zip_code: string;
  tel_no: string;
  is_default: number;
  status: number;
  created_at: number;
  updated_at: number;
}
export interface Account {
  id: number;
  merchant_id: number;
  shop_id?: string;
  member_id: number;
  member_type?: string;
  user_money: string;
  accumulate_money: string;
  give_money: string;
  consume_money: string;
  frozen_money: string;
  user_integral: number;
  accumulate_integral: number;
  give_integral: number;
  consume_integral: string;
  frozen_integral: number;
  user_growth: number;
  accumulate_growth: number;
  consume_growth: number;
  frozen_growth: number;
  economize_money: string;
  accumulate_drawn_money: string;
  status: number;
}
export interface Merchant {
  id: number;
  title: string;
  operating_type: number;
  cate_id: number;
  tax_rate: string;
  logo: string;
  cover: string;
  sort: number;
  brief_introduction: string;
  term_of_validity_type: number;
  start_time: number;
  end_time: number;
  email: string;
  province_id?: string;
  city_id?: string;
  area_id?: string;
  address_name: string;
  address_details: string;
  longitude: string;
  latitude: string;
  contacts: string;
  mobile: string;
  tel_no: string;
  level_id: number;
  keywords: string;
  description: string;
  environment?: any;
  qq: string;
  credit: number;
  desc_credit: number;
  service_credit: number;
  delivery_credit: number;
  sales_money: string;
  business_week?: any;
  business_time: string;
  collect_num: number;
  comment_num: number;
  transmit_num: number;
  auth_role_id: number;
  certification_type: number;
  close_cause: string;
  audit_time: number;
  audit_status: number;
  status: number;
  created_at: number;
  updated_at: number;
}
export interface Preview {
  invoiceAmount: number;
  invoiceItem: Invoice;
  invoice_is_open: string;
  invoice: Invoice[];
  merchant_id: string;
  merchant_title: string;
  order_sn: string;
  order_from: string;
  out_trade_no: string;
  order_type: number;
  pay_type: number;
  shipping_type: number;
  buyer_id: number;
  buyer_nickname: string;
  buyer_ip: string;
  buyer_message: string;
  receiver_id: number;
  receiver_mobile: string;
  receiver_province_id: number;
  receiver_city_id: number;
  receiver_area_id: number;
  receiver_name: string;
  receiver_details: string;
  receiver_zip: string;
  receiver_realname: string;
  receiver_longitude: string;
  receiver_latitude: string;
  seller_star: number;
  seller_memo: string;
  consign_time_adjust: number;
  shipping_money: string;
  product_money: string;
  product_original_money: string;
  product_profit_price: string;
  product_type: string;
  product_count: number;
  order_money: string;
  pay_money: string;
  final_money: string;
  point: number;
  marketing_id: number;
  marketing_type: string;
  marketing_money: number;
  wholesale_record_id: number;
  give_point: number;
  give_growth: number;
  give_coin: string;
  order_status: number;
  pay_status: number;
  shipping_status: number;
  feedback_status: number;
  is_evaluate: number;
  tax_money: string;
  store_id: number;
  invoice_id?: any;
  express_company_id: number;
  give_point_type: number;
  give_growth_type: number;
  caballero_member_id: number;
  pay_time: number;
  receiving_time: number;
  consign_time: number;
  sign_time: number;
  finish_time: number;
  close_time: number;
  auto_sign_time: number;
  auto_finish_time: number;
  auto_evaluate_time: number;
  fixed_telephone: string;
  distribute_time_out: string;
  subscribe_shipping_start_time: number;
  subscribe_shipping_end_time: number;
  is_new_member: number;
  is_print: number;
  is_oversold: number;
  refund_money: string;
  refund_num: number;
  is_after_sale: number;
  promoter_code: string;
  promoter_id: number;
  promoter_nickname: string;
  buyerMessage: string;
  unite_no: string;
  status: number;
  created_at: number;
  updated_at: number;
}
export interface Product {
  id: string;
  merchant_id: string;
  buyer_id: number;
  order_id: number;
  order_sn: string;
  store_id: number;
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
  num: number;
  adjust_money: string;
  point_exchange_type: string;
  product_type: string;
  marketing_id: number;
  marketing_type: string;
  order_type: number;
  order_status: string;
  give_point: string;
  give_growth: string;
  give_coin: string;
  shipping_status: number;
  is_oversold: number;
  is_evaluate: number;
  supplier_id: string;
  supplier_name: string;
  gift_flag: number;
  refund_money: string;
  refund_num: number;
  refund_type: string;
  refund_status: string;
  after_sale_id: number;
  is_commission: string;
  status: number;
  created_at: number;
  updated_at: number;
  product_id: string;
}
export interface MarketingFullDetail {
  marketing_id: number;
  marketing_type: string;
  marketing_condition: string;
  free_shipping: number;
  discount_money: string;
  marketing_name: string;
}
export interface MarketingDetail {
  discount_money: number;
  marketing_name: string;
  marketing_type: string;
}
export interface Logistics_list {
  id: string;
  merchant_id: string;
  title: string;
  label: string;
  express_no: string;
  cover: string;
  mobile: string;
  sort: string;
  is_default: string;
  status: string;
  created_at: string;
  updated_at: string;
}
export interface Logistics_local_distribute_list {
  id: string;
  merchant_id: string;
  title: string;
  label: string;
  cover: string;
  contacts: string;
  mobile: string;
  tel_no: string;
  province_id: string;
  city_id: string;
  area_id: string;
  address_name: string;
  address_details: string;
  longitude: string;
  latitude: string;
  sort: string;
  level_id: string;
  operating_type: string;
  certification_type: string;
  is_pickup: string;
  business_type: string;
  business_time: string;
  audit_time: string;
  refusal_cause: string;
  audit_status: string;
  status: string;
  created_at: string;
  updated_at: string;
}
export interface Time {
  end_time: string;
  start_time: string;
  explain: string;
}
export interface Logistics_pick_up_config {
  day: string;
  time: Time[];
}
export interface Config {
  logistics: string;
  logistics_select: string;
  logistics_list: Logistics_list[];
  order_invoice_content: string[];
  logistics_local_distribution: string;
  logistics_local_distribution_config: any[];
  logistics_pick_up_list: Logistics_local_distribute_list[];
  logistics_pick_up: string;
  logistics_pick_up_config: Logistics_pick_up_config[];
  order_min_pay_money: string;
  order_buy_close_time: string;
  order_back_points: string;
  order_back_growth: string;
  product_give_point: string;
  product_point_give_type: string;
  product_give_growth: string;
  product_growth_give_type: string;
  pickerShippingTypeArr: PickerShippingTypeItem[];
  currentShippingType: PickerShippingTypeItem;
  currentLogistics: Logistics_list;
  currentPickupPoint: Logistics_local_distribute_list;
}
// 物流方式
export interface PickerShippingTypeItem {
  label: string;
  value: number;
}
export interface Item {
  merchant: Merchant;
  preview: Preview;
  products: Product[];
  marketingFullDetails: MarketingFullDetail[];
  marketingDetails: MarketingDetail[];
  coupons: Coupon[];
  config: Config;
  currentInvoiceItem?: Invoice;
  currentCoupon: Coupon;
  invoiceContent: string;
}
export interface LastMemberInfo {
  realname: string;
  mobile: string;
}
export interface PointConfig {
  status: number;
  available: number;
  money: number;
}

export interface OrderList {
  is_customer: string;
  merchant: Merchant;
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
  invoice_id: string;
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
  distribute_time_out: string;
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
  product: Product[];
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

// 订单详情
export interface BaseOrderDetail {
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
  invoice_id: string;
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
  distribute_time_out: string;
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
  product: Product[];
  coupon: string;
  baseMerchant: BaseMerchant;
  marketingDetail: any[];
  store: any[];
  pay_explain: string;
  shipping_explain: string;
  peer_pay: any[];
  order_invoice_status: string;
}

// 好友代付
export interface FriendPay {
  peerPay: PeerPay;
  product: FriendPayProduct[];
  member: Member;
  order: Order;
  config: FriendPayConfig;
}
interface FriendPayConfig {
  merchant_id: number;
  bg_image: string;
  word_color: string;
  status: number;
  created_at: number;
  updated_at: number;
}
interface Member {
  id: number;
  nickname: string;
  mobile: string;
  email: string;
  head_portrait: string;
}
interface Order {
  id: number;
  pay_money: string;
  order_sn: string;
}
interface PeerPay {
  id: number;
  merchant_id: number;
  member_id: number;
  order_id: number;
  order_sn: string;
  leave_word: string;
  pay_status: number;
  pay_member_id: number;
  pay_member_nickname: string;
  status: number;
  created_at: number;
  updated_at: number;
}
interface FriendPayProduct {
  id: number;
  merchant_id: number;
  buyer_id: number;
  order_id: number;
  order_sn: string;
  store_id: number;
  product_id: number;
  product_name: string;
  product_money: string;
  product_original_money: string;
  product_picture: string;
  sku_id: number;
  sku_name: string;
  sku_no: string;
  barcode: string;
  price: string;
  cost_price: string;
  profit_price: string;
  num: number;
  adjust_money: string;
  point_exchange_type: number;
  product_type: number;
  marketing_id: number;
  marketing_type: string;
  order_type: number;
  order_status: number;
  give_point: number;
  give_growth: number;
  give_coin: string;
  shipping_status: number;
  is_oversold: number;
  is_evaluate: number;
  supplier_id: number;
  supplier_name: string;
  gift_flag: number;
  refund_money: string;
  refund_num: number;
  refund_status: number;
  after_sale_id: number;
  is_commission: number;
  status: number;
  created_at: number;
  updated_at: number;
}

// 物流信息
export interface ShippingInfo {
  count: number;
  data: ShippingInfoItem[];
}

/**
 * 包裹信息
 */
export interface ShippingInfoItem {
  id: string;
  address: address;
  order_id: string;
  order_product_ids: string[];
  name: string;
  shipping_type: string;
  express_company_id: string;
  express_company: string;
  express_no: string;
  buyer_id: string;
  buyer_realname: string;
  operator_id: string;
  operator_username: string;
  memo: string;
  status: string;
  created_at: string;
  updated_at: string;
  order_product: OrderProduct;
  trace: traceItem[];
}

/**
 * 地址信息
 */
interface address {
  receiver_details: string;
  receiver_latitude: string;
  receiver_longitude:string;
  receiver_mobile: string;
  receiver_name:string;
  receiver_realname:string;
  receiver_zip:string;
}
interface traceItem {
  datetime: string;
  remark: string;
}
interface OrderProduct {
  id: string;
  product_picture: string;
  product_name: string;
}

// 下单计算价格
export interface MarketingFee {
  coupon: number;
  point: number;
  pay: number;
  pointConfig: any;
  merchant: MarketingFeeMerchant[];
}
export interface MarketingFeeMerchant {
  merchant_id: number;
  shipping: number;
  coupon: number;
  invoice: number;
  pay: number;
}
