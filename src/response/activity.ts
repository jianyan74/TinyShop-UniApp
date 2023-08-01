// 活动插件
// 签到
export interface ActivityDate {
  year: string;
  month: string;
  day: string;
}
// 签到排行榜
export interface SignInRank {
  list: SignInRankItem[];
  member: Member;
  myRanking: number;
  myNumber: number;
}
export interface SignInRankItem {
  id: string;
  merchant_id: string;
  shop_id: string;
  member_id: string;
  total_num: string;
  total_integral: string;
  total_growth: string;
  continuous_num: string;
  continuous_max_num: string;
  sign_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  baseMember: BaseMember;
}
interface Member {
  id: number;
  nickname: string;
  head_portrait: string;
}
interface BaseMember {
  id: string;
  nickname: string;
  mobile: string;
  email: string;
  head_portrait: string;
}

export interface SignIn {
  ranking: Ranking;
  config: Config;
}
export interface ContinuousSign {
  integral: string;
  growth: string;
  user_growth: string;
  continuous_num: string;
  coupon: Coupon;
}
interface Config {
  share_title: string;
  share_cover: string;
  share_desc: string;
  share_link: string;
  is_open: string;
  first_sign_integrate: string;
  every_sign_integrate: string;
  continuous_sign: ContinuousSign[];
  sign_rules: string;
  first_sign_growth: string;
  every_sign_growth: string;
}
interface Coupon {
  id: number;
  merchant_id: number;
  title: string;
  discount: string;
  discount_type: number;
  count: number;
  get_count: number;
  max_fetch: number;
  max_day_fetch: number;
  at_least: string;
  need_user_level: number;
  range_type: number;
  get_start_time: number;
  get_end_time: number;
  start_time: number;
  end_time: number;
  min_price: string;
  max_price: string;
  term_of_validity_type: number;
  fixed_term: number;
  single_type: number;
  is_list_visible: number;
  is_new_people: number;
  remark: string;
  status: number;
  created_at: number;
  updated_at: number;
}
interface Ranking {
  id: number;
  merchant_id: number;
  shop_id: number;
  member_id: number;
  total_num: number;
  total_integral: number;
  total_growth: string;
  continuous_num: number;
  continuous_max_num: number;
  sign_date: string;
  status: number;
  created_at: number;
  updated_at: number;
}
export interface SingInRecord {
  id: string;
  merchant_id: string;
  shop_id: string;
  member_id: string;
  integral: string;
  coupon_type_id: string;
  is_first: string;
  continuous_num: string;
  sign_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  growth: string;
}
// 签到创建
export interface SignCreateResult {
  merchant_id: number;
  shop_id: number;
  member_id: number;
  integral: string;
  coupon_type_id: number;
  is_first: number;
  continuous_num: number;
  status: number;
  created_at: number;
  updated_at: number;
  growth: string;
  sign_date: string;
  id: number;
}

// 九宫格
export interface LuckyWheelInfo {
  account: Account;
  activity: Activity;
  award: Award[];
  myJoin: MyJoin;
  drawNum: number;
}
interface Account {
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
interface Activity {
  id: number;
  merchant_id: number;
  shop_id: number;
  title: string;
  cover: string;
  description: string;
  start_time: number;
  end_time: number;
  day_join_num: number;
  all_join_num: number;
  use_integral: number;
  background_picture: string;
  color: string;
  logo: string;
  wheel_picture: string;
  qrcode: string;
  get_rules: string;
  get_award_type: number;
  activity_rules: string;
  award_info: string;
  grid_num: number;
  first_win: number;
  share_title: string;
  share_desc: string;
  share_picture: string;
  status: number;
  created_at: number;
  updated_at: number;
  type: number;
}
export interface Award {
  id?: string;
  title?: string;
  give_integral?: string;
  type: string;
  cover: string;
}
interface MyJoin {
  todayNum: number;
  totalNum: number;
}

// 中奖记录
export interface AwardRecord {
  id: string;
  merchant_id: string;
  member_id: string;
  shop_id: string;
  activity_id: string;
  is_win: string;
  award_id: string;
  award_title: string;
  award_cover: string;
  award_type: string;
  code: string;
  nickname: string;
  record_date: string;
  use_state: string;
  use_time: string;
  ip: string;
  status: string;
  created_at: string;
  updated_at: string;
}
// 中奖记录飘动
export interface AwardBarrage {
  id: string;
  image: string;
  name: string;
  award_title: string;
}
