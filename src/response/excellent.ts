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
  tags?: any;
  status: string;
}

export interface FirstEvaluate {
  id: string;
  product_id: string;
  sku_name: string;
  content: string;
  member_id: string;
  member_nickname: string;
  member_head_portrait: string;
  is_anonymous: string;
  scores: string;
  explain_type: string;
  created_at: string;
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

export interface ExcellentItem {
  id: string;
  name: string;
  sketch: string;
  keywords: string;
  picture: string;
  tags: string[];
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
  evaluateStat: EvaluateStat;
  firstEvaluate: FirstEvaluate;
  baseMerchant: BaseMerchant;
  marketing_id: string;
  marketing_type: string;
  predict_brokerage: number;
  member_discount_price: number;
  memberHeadPortrait: string[];
}
