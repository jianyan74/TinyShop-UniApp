export interface Cart {
  carts: Carts[];
  lose_efficacy: AnyObject[];
}

export interface Carts {
  merchant: Merchant;
  items: Items[];
  plusBuyList: AnyObject[];
  selected: boolean;
}

export interface Items {
  marketing: Marketing;
  products: Products[];
}

export interface Marketing {
  id: string;
  merchant_id: string;
  product_id: string;
  sku_id: string;
  marketing_product_id: string;
  marketing_id: string;
  marketing_type: string;
  marketing_data: MarketingData;
  discount: string;
  discount_type: string;
  marketing_sales: string;
  marketing_stock: string;
  start_time: string;
  end_time: string;
  number: string;
  min_buy: string;
  max_buy: string;
  decimal_reservation_number: string;
  marketing_price: string;
  is_min_price: string;
  status: string;
}

export interface MarketingData {
  tmp_money: number;
  tmp_price: string;
  tmp_discount: string;
  tmp_deduction: string;
  tmp_discount_type_explain: string;
}

export interface Merchant {
  id: string;
  title: string;
  cover: string;
  address_name: string;
  address_details: string;
  longitude: string;
  latitude: string;
  collect_num: string;
}

export interface Products {
  id: string;
  selected: boolean;
  merchant_id: string;
  marketing_id: string;
  marketing_type: string;
  price: string;
  number: string;
  product_id: string;
  product_picture: string;
  product_name: string;
  sku_id: string;
  sku_name: string;
  status: string;
  remark: string;
  original_price: string;
  min_buy: number;
  max_buy: number;
  marketing_price: string;
  stock: string;
}

