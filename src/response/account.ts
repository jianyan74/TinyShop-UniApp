// 会员中心
export interface AccountCenterCard {
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

export interface AccountCenter {
  member: AccountCenterMember;
  memberAccount: MemberAccount;
  upgradeCurrent: number;
  card: AccountCenterCard;
  level: Level[];
  product: AnyArray;
  productTotalCount: string;
}

interface Level {
  id: number;
  merchant_id: number;
  shop_id: number;
  level: number;
  name: string;
  icon: string;
  cover: string;
  detail: string;
  money: string;
  integral: number;
  growth: number;
  discount: string;
  status: number;
  created_at: number;
  updated_at: number;
  upgrade: number;
  upgrade_name: string;
  upgrade_max: number;
  upgrade_next: number;
}

export interface AccountCenterMember {
  id: number;
  merchant_id: number;
  shop_id: number;
  username: string;
  password_hash: string;
  auth_key: string;
  password_reset_token: string;
  mobile_reset_token: string;
  type: number;
  realname: string;
  nickname: string;
  head_portrait: string;
  gender: number;
  qq: string;
  email: string;
  birthday: string;
  province_id: number;
  city_id: number;
  area_id: number;
  address: string;
  mobile: string;
  tel_no: string;
  visit_count: number;
  last_time: number;
  last_ip: string;
  role: number;
  current_level: number;
  level_expiration_time: number;
  level_buy_type: number;
  pid: number;
  level: number;
  tree: string;
  promoter_code: string;
  certification_type: number;
  status: number;
  created_at: number;
  updated_at: number;
}

interface MemberAccount {
  id: number;
  merchant_id: number;
  shop_id: string;
  member_id: number;
  member_type: string;
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

interface PayRule {
  price: string;
  validity: string;
  give_point: string;
  give_growth: string;
  distribute_commission_rate: string;
}
