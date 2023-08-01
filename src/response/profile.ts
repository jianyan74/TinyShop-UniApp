// 个人中心
export interface Profile {
  member: Member;
  couponNum: string;
  cartNum: string;
  orderNum: OrderNum;
  notifyNum: NotifyNum;
  promoter: Promoter;
  promoterAccount: PromoterAccount;
  signOpen: number;
  memberCard: MemberCard;
}
export interface Account {
  id: string;
  merchant_id: string;
  shop_id: string;
  member_id: string;
  member_type: string;
  user_money: string;
  accumulate_money: string;
  give_money: string;
  consume_money: string;
  frozen_money: string;
  user_integral: string;
  accumulate_integral: string;
  give_integral: string;
  consume_integral: string;
  frozen_integral: string;
  user_growth: string;
  accumulate_growth: string;
  consume_growth: string;
  frozen_growth: string;
  economize_money: string;
  accumulate_drawn_money: string;
  status: string;
}
export interface Member {
  id: string;
  merchant_id: string;
  shop_id: string;
  username: string;
  password_hash: string;
  auth_key: string;
  password_reset_token: string;
  mobile_reset_token: string;
  type: string;
  realname: string;
  nickname: string;
  head_portrait: string;
  gender: string;
  qq: string;
  email: string;
  birthday: string;
  province_id: string;
  city_id: string;
  area_id: string;
  address: string;
  mobile: string;
  tel_no: string;
  visit_count: string;
  last_time: string;
  last_ip: string;
  role: string;
  current_level: string;
  level_expiration_time: string;
  level_buy_type: string;
  pid: string;
  level: string;
  tree: string;
  promoter_code: string;
  certification_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  account: Account;
  memberLevel: MemberLevel;
}
export interface MemberCard {
  id: number;
  merchant_id: number;
  title: string;
  economize_money: string;
  member_level: number;
  introduce: string;
  content: string;
  free_shipping: number;
  give_type: number;
  give_start_time: number;
  give_end_time: number;
  color: string;
  pay_rule: PayRule[];
  pay_type: number;
  status: number;
  created_at: number;
  updated_at: number;
}
export interface MemberLevel {
  id: string;
  merchant_id: string;
  shop_id: string;
  level: string;
  name: string;
  icon: string;
  cover: string;
  detail: string;
  money: string;
  integral: string;
  growth: string;
  discount: string;
  status: string;
  created_at: string;
  updated_at: string;
}
export interface NotifyNum {
  count: number;
  announce: number;
  remind: number;
  message: number;
}
export interface OrderNum {
  remainToBeEvaluated: number;
  afterSale: number;
  notPay: number;
  pay: number;
  shipments: number;
}
export interface PayRule {
  price: string;
  validity: string;
  give_point: string;
  give_growth: string;
  distribution_commission_rate: string;
}
export interface Promoter {
  id: number;
  member_id: number;
  merchant_id: number;
  shop_id: number;
  promoter_level: number;
  is_regional_agent: number;
  regional_agent_level: number;
  regional_agent_province_id: number;
  regional_agent_city_id: number;
  regional_agent_area_id: number;
  regional_agent_address_name: string;
  regional_agent_time: number;
  status: number;
  created_at: number;
  updated_at: number;
}
export interface PromoterAccount {
  id: number;
  member_id: number;
  merchant_id: number;
  shop_id: number;
  accumulate_brokerage: string;
  user_brokerage: string;
  frozen_brokerage: string;
  amount_drawn_brokerage: string;
  promoter_brokerage: string;
  regional_agent_brokerage: string;
  order_money: string;
  order_count: number;
  brokerage_money: string;
  one_brokerage_money: string;
  one_order_money: string;
  one_order_count: number;
  one_member_count: number;
  one_promoter_count: number;
  two_brokerage_money: string;
  two_order_money: string;
  two_order_count: number;
  two_member_count: number;
  two_promoter_count: number;
  three_brokerage_money: string;
  three_order_money: string;
  three_order_count: number;
  three_member_count: number;
  three_promoter_count: number;
  total_order_money: string;
  total_order_count: number;
  total_member_count: number;
  total_promoter_count: number;
  status: number;
  created_at: number;
  updated_at: number;
}

// 积分
export interface CreditsLog {
  id: string;
  merchant_id: string;
  member_id: string;
  pay_type: string;
  credit_type: string;
  app_id: string;
  credit_group: string;
  addons_name: string;
  old_num: string;
  new_num: string;
  num: string;
  remark: string;
  ip: string;
  map_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}
