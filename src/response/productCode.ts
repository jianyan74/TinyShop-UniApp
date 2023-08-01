// 核销码订单
export interface OrderProductCodeItem {
  id: string;
  remark: string;
  merchant_id: string;
  shop_id: string;
  member_id: string;
  sku_id: string;
  product_id: string;
  product_type: string;
  code: string;
  order_id: string;
  order_sn: string;
  order_product_id: string;
  fixed_term: string;
  start_time: string;
  end_time?: string;
  use_number: string;
  confine_use_number: string;
  use_rules: string;
  state: string;
  use_time: string;
  past_due_auto_refund: string;
  unite_no: string;
  status: string;
  created_at: string;
  updated_at: string;
  product: Product;
}
export interface Product {
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
