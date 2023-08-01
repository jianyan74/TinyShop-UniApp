// 分销商等级
export interface PromoterLevel {
  levels: Levels[];
  member: Member;
  promoterLevel: number;
  promoterAccount: PromoterAccount;
}
interface Levels {
  id: string;
  merchant_id: string;
  shop_id: string;
  title: string;
  level: string;
  apply_type: string;
  order_money: string;
  order_count: string;
  upgrade_type: string;
  one_brokerage_money: string;
  one_order_money: string;
  one_order_count: string;
  one_member_count: string;
  one_promoter_count: string;
  level_one: string;
  level_two: string;
  level_three: string;
  promoter_count: string;
  status: string;
  created_at: string;
  updated_at: string;
}
interface Member {
  nickname: string;
  head_portrait: string;
  id: string | number;
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
  underway_money: number;
}
interface Account {
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

// 分销商信息
export interface PromoterMember {
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
  promoter: Promoter;
  promoterAccount: PromoterAccount;
  promoterLevel: PromoterMemberLevel;
  promoterNextLevel: PromoterMemberLevel;
  regionalAgentIsApply: number;
}
interface Promoter {
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
interface PromoterMemberLevel {
  id: number;
  merchant_id: number;
  shop_id: number;
  title: string;
  level: number;
  apply_type: number;
  order_money: string;
  order_count: number;
  upgrade_type: number;
  one_brokerage_money: string;
  one_order_money: string;
  one_order_count: number;
  one_member_count: number;
  one_promoter_count: number;
  level_one: string;
  level_two: string;
  level_three: string;
  promoter_count: number;
  status: number;
  created_at: number;
  updated_at: number;
}

// 我的团队
export interface PromoterAgent {
  team: Team[];
  parent: PromoterAgentParent;
  promoterCommissionLevel: number;
  promoterAccount: PromoterAccount;
}
interface PromoterAgentParent {
  nickname: string;
  head_portrait: string;
}
interface Team {
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
  level: number;
  tree: string;
  promoter_code: string;
  certification_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  promoterBrokerageStat: string;
  is_promoter: number;
}

// 佣金明细
export interface PromoterBrokerageLog {
  list: PromoterBrokerageLogItem[];
  promoterAccount: PromoterAccount;
}
export interface PromoterBrokerageLogItem {
  id: string;
  app_id: string;
  merchant_id: string;
  shop_id: string;
  member_id: string;
  member_type: string;
  type: string;
  group: string;
  old_num: string;
  new_num: string;
  num: string;
  remark: string;
  ip: string;
  map_id: string;
  is_addon: string;
  addon_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// 佣金排行榜
export interface PromoterRank {
  list: List[];
  member: Member;
  myNumber: string;
  myRanking: number;
}
interface List {
  total: string;
  promoter_member_id: string;
  id: string;
  promoterMember: PromoterSimplerMember;
}
interface PromoterSimplerMember {
  id: string;
  nickname: string;
  head_portrait: string;
  mobile: string;
}

// 提现配置
export interface WithdrawConfig {
  withdraw_apply: string;
  withdraw_account: string[];
  withdraw_lowest_money: string;
  withdraw_service_charge_rate: string;
  withdraw_service_charge_single: string;
  promoter: Promoter;
  promoterAccount: PromoterAccount;
  defaultBankAccount: DefaultBankAccount;
}
export interface DefaultBankAccount {
  id: number;
  merchant_id: number;
  shop_id: number;
  member_id: number;
  member_type: number;
  realname: string;
  mobile: string;
  account_number: string;
  account_type: number;
  account_type_name: string;
  bank_name: string;
  bank_branch: string;
  identity_card: string;
  identity_card_front: string;
  identity_card_back: string;
  is_default: number;
  audit_status: number;
  status: number;
  created_at: number;
  updated_at: number;
}

// 分销订单
export interface PromoterOrder {
  list: PromoterOrderItem[];
  promoterCommissionLevel: number;
  regionalStatus: number;
  promoterAccount: PromoterAccount;
}
export interface PromoterOrderItem {
  id: string;
  merchant_id: string;
  shop_id: string;
  member_id: string;
  app_id: string;
  pay_type: string;
  type: string;
  remark: string;
  map_type: string;
  map_sn: string;
  map_id: string;
  map_money: string;
  map_cost_money: string;
  map_profit_money: string;
  map_refund_money: string;
  province_id: string;
  city_id: string;
  area_id: string;
  address_name: string;
  referrer_id: string;
  promoter_member_id: string;
  promoter_level: string;
  promoter_level_ratio: string;
  promoter_map_ratio: string;
  promoter_money: string;
  regional_agent_level: string;
  regional_agent_ratio: string;
  regional_agent_map_ratio: string;
  regional_agent_money: string;
  brokerage_money: string;
  accomplish_time: string;
  commission_mode: string;
  ip: string;
  state: string;
  is_addon: string;
  addon_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  member: PromoterOrderMember;
  product: Product;
}
interface PromoterOrderMember {
  id: string;
  nickname: string;
  head_portrait: string;
  realname: string;
  type: string;
}
interface Product {
  product_money: string;
  sku_name: string;
  product_name: string;
  product_picture: string;
}

// 分销商申请
export interface PromoterApplyConfig {
  apply: PromoterApplySchedule;
  level: Level;
  orderStat: OrderStat;
  promoterApplyType: string;
  promoterAuditType: string;
  promoterPerfectData: string;
  promoterApplyBg: string;
  promoterApplyData: PromoterApplyData[];
  protocolStatus: number;
  protocolTitle: string;
  isApply: number;
}
interface Level {
  id: number;
  merchant_id: number;
  shop_id: number;
  title: string;
  level: number;
  apply_type: number;
  order_money: string;
  order_count: number;
  upgrade_type: number;
  one_brokerage_money: string;
  one_order_money: string;
  one_order_count: number;
  one_member_count: number;
  one_promoter_count: number;
  level_one: string;
  level_two: string;
  level_three: string;
  promoter_count: number;
  status: number;
  created_at: number;
  updated_at: number;
}
interface OrderStat {
  count: string;
  pay_money: string;
}
interface PromoterApplyData {
  type: string;
  value: string;
  title: string;
}
export interface PromoterApplyProtocol {
  protocol: string;
  protocolTitle: string;
  protocolStatus: number;
}
export interface PromoterApplySchedule {
  id: string;
  merchant_id: string;
  shop_id: string;
  member_id: string;
  content: string;
  promoter_level: string;
  audit_status: string;
  audit_time: string;
  refusal_cause: string;
  status: string;
  created_at: string;
  updated_at: string;
  level: Level;
}

// 提现账号
export interface WithdrawItem {
  id: string;
  merchant_id: string;
  shop_id: string;
  member_id: string;
  member_type: string;
  ali_number: string;
  realname: string;
  mobile: string;
  account_number: string;
  account_type: string;
  account_type_name: string;
  bank_name: string;
  bank_branch: string;
  identity_card: string;
  identity_card_front: string;
  identity_card_back: string;
  is_default: string;
  audit_status: string;
  status: string;
  created_at: string;
  updated_at: string;
  is_open: boolean;
}
export interface BankItem {
  id: string;
  bank_name: string;
  bank_number: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}
