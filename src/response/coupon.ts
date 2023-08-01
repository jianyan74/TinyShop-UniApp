// 优惠券
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
interface CouponType {
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
export interface GroupCount {
  get: string;
  un_sed: string;
  past_due: string;
}
export interface CouponItem {
  id: string;
  member_id: string;
  merchant_id: string;
  coupon_type_id: string;
  discount: string;
  discount_type: string;
  title: string;
  code: string;
  map_id: string;
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
  usableProduct: AnyObject[];
  couponType: CouponType;
  baseMerchant: BaseMerchant;
}

export interface CouponDetail {
  id: string;
  merchant_id: string;
  title: string;
  discount: string;
  discount_type: string;
  money: string;
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
  myGet: MyGet;
  usableProduct: any[];
  is_get: number;
  percentage: number;
}
interface MyGet {
  count: string;
  coupon_type_id: string;
}
