export interface CommonConfig {
  config: GlobalConfig;
  bottom_nav: BottomNav;
  member_center_nav: BottomNav;
  home_float_nav: HomeFloatNav[];
  notify_config: NotifyConfigItem[];
}

export interface NotifyConfigItem {
  name: string;
  template_id: string;
  title: string
}

interface BottomNav {
  items: Items1[];
  config: Config2;
}

export interface GlobalConfig {
  scan: number;
  h5_url: string;
  bargain: number;
  app_logo: string;
  app_name: string;
  logistics: number;
  app_h5_url: string;
  index_cate: number;
  share_desc: string;
  share_link: string;
  style_type: string;
  close_login: number;
  share_cover: string;
  share_title: string;
  site_status: number;
  bargain_hint: string;
  bargain_rule: string;
  is_logistics: number;
  is_open_scan: number;
  is_open_site: number;
  member_login: number;
  copyright_url: string;
  order_ali_pay: number;
  app_service_qr: string;
  close_register: number;
  copyright_desc: number;
  copyright_logo: string;
  live_streaming: number;
  order_evaluate: string;
  order_oversold: number;
  store_entrance: number;
  bargain_is_open: number;
  bargain_max_num: number;
  close_site_date: string;
  hot_search_list: string[];
  member_recharge: number;
  member_register: number;
  site_close_time: string;
  style_cate_type: string;
  app_service_type: number;
  bargain_end_date: number;
  index_decoration: number;
  is_delivery_shop: number;
  is_open_recharge: number;
  logistics_select: number;
  order_wechat_pay: number;
  protocol_privacy: string;
  is_open_logistics: number;
  logistics_pick_up: number;
  order_back_growth: number;
  order_back_points: number;
  order_balance_pay: number;
  order_invoice_tax: number;
  protocol_recharge: string;
  protocol_register: string;
  bargain_first_hint: string;
  buyer_self_lifting: number;
  close_site_explain: string;
  delivery_shop_type: number;
  hot_search_default: string;
  is_open_index_cate: number;
  order_evaluate_day: number;
  product_give_point: number;
  site_close_explain: number;
  style_user_is_open: number;
  address_select_type: number;
  bargain_day_max_num: number;
  member_login_weight: string;
  order_auto_delivery: number;
  order_bytedance_pay: number;
  order_min_pay_money: number;
  product_give_growth: number;
  bargain_binding_time: number;
  order_buy_close_time: number;
  order_invoice_status: number;
  order_not_pay_remind: number;
  product_audit_status: number;
  protocol_member_card: string;
  third_party_register: number;
  copyright_companyname: string;
  close_register_promoter_code: string;
  order_after_sale_date: number;
  order_invoice_content: number;
  order_invoice_is_open: number;
  copyright_company_name: number;
  is_open_live_streaming: number;
  is_open_store_entrance: number;
  order_cash_against_pay: number;
  bargain_pay_close_hours: number;
  bargain_promote_content: string;
  close_third_party_login: number;
  product_point_give_type: number;
  auto_register_commission: number;
  bargain_binding_time_num: number;
  is_open_index_decoration: number;
  member_third_party_login: number;
  mobile_login_be_register: number;
  order_auto_complete_time: number;
  product_growth_give_type: number;
  close_register_promo_code: number;
  member_register_promo_code: number;
  product_after_sale_explain: string;
  protocol_member_card_rights: string;
  app_agreement_default_select: number;
  logistics_local_distribute: number;
  member_register_promoter_code: number;
  member_agreement_default_select: number;
  member_auto_register_commission: number;
  member_mobile_login_be_register: number;
  member_third_party_binding_type: number;
  mini_program_register_get_mobile: number;
  logistics_local_distribute_type: number;
  member_mini_program_register_get_mobile: number;
  product_poster_title: string;
  product_poster_cover_type: any;
  product_poster_qr_type: string;
  app_cate_type: string;
}

interface Config1 {
  style: string;
  isHump: string;
}

interface Config2 {
  style: string;
}

interface HomeFloatNav {
  link: Link1;
  type: string;
  title: string;
  picture: string;
}

interface Items {
  icon: string;
  type: string;
  title: string;
  iconType: string;
  pagePath: string;
  iconSelect: string;
}

interface Items1 {
  icon: string;
  link: Link;
  type: string;
  title: string;
  iconType: string;
}

interface Link {
  type: string;
  appid: string;
  title: string;
  mpPath: string;
  urlType: string;
  link_url: string;
  innerLink: string;
  fItemIndex: string;
  activeIndex: string;
  externalLink: string;
}

interface Link1 {
  type: string;
  appid: string;
  title: string;
  mpPath: string;
  link_url: string;
  innerLink: string;
  fItemIndex: string;
  activeIndex: string;
  externalLink: string;
}
