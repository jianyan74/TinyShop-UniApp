// 装修数据
export interface CustomIndex {
  decorate: Decorate;
  popup_adv: PopupAdv[];
  cate: Cate[];
  search: Search;
  coupons: Coupon[];
  copyright: Copyright;
  share: Share;
}
export interface Cate {
  id: string;
  title: string;
  subhead: string;
  cover: string;
}
interface Component {
  hide?: boolean;
  moving?: string;
  name: string;
  type: string;
  props?: Props;
  id: string;
  title: string;
  component: string;
  container: boolean;
  enableCustomTemplate: boolean;
  data: DecorateDataItem[];
  countDown: AnyArray;
  icon?: string;
}
interface Copyright {
  web_site_icp: string;
  copyright_company_name: string;
  copyright_url: string;
  copyright_desc: string;
}
interface DecorateDataItem {
  id: string;
  merchant_id: string;
  name: string;
  sketch: string;
  keywords: string;
  picture: string;
  view: string;
  match_point: string;
  price: string;
  market_price: string;
  stock: string;
  total_sales: string;
  shipping_type: string;
  is_sales_visible: string;
  is_stock_visible: string;
  marketing: Marketing;
}
export interface Decorate {
  id: string;
  merchant_id: string;
  title: string;
  name: string;
  type: string;
  description: string;
  component: Component[];
  bottom_tabbar: string;
  font_colour: string;
  top_colour: string;
  page_colour: string;
  background_picture: string;
  cover: string;
  uuid: string;
  status: string;
  created_at: string;
  updated_at: string;
}
interface List {
  cover: string;
  id: string;
  name: string;
}
interface Marketing {
  id: string;
  merchant_id: string;
  product_id: string;
  sku_id: string;
  marketing_product_id: string;
  marketing_id: string;
  marketing_type: string;
  discount: string;
  discount_type: string;
  marketing_sales: string;
  marketing_stock: string;
  prediction_time: string;
  start_time: string;
  end_time: string;
  number: string;
  min_buy: string;
  max_buy: string;
  decimal_reservation_number: string;
  marketing_price: string;
  is_min_price: string;
  status: string;
  tmp_money: string;
  tmp_price: string;
  tmp_discount: string;
  tmp_deduction: string;
  tmp_discount_type_explain: string;
}
interface Props {
  productType: string;
  showType: string;
  limit: number;
  headerTitleType: string;
  headerTitle: string;
  headerSubTitle: string;
  dataSource: string;
  contentValue: string[];
  list: List[];
  sortArr: AnyArray;
  bgColor: string;
  radius: number;
  leftRightMargin: number;
  topMargin: number;
  bottomMargin: number;
  tbPadding: number;
  lrPadding: number;
  price_sort: string;
  total_sales_sort: string;
  created_at_sort: string;
  collect_sort: string;
  view_sort: string;
  subTitleFontSizeColor: string;
  subTitleFontSize: number;
  titleFontSizeColor: string;
  titleFontSize: number;
  moreFontSizeColor: string;
  moreFontSize: number;
  link: AnyArray;
  productBgColor: string;
  productRadius: number;
}
interface Search {
  hot_search_default: string;
  hot_search_list: AnyArray;
}
export interface Share {
  share_title: string;
  share_cover: string;
  share_desc: string;
  share_link: string;
}

export interface PopupAdv {
  id: number;
  merchant_id: number;
  total: number;
  name: string;
  cover: string;
  view: number;
  start_time: number;
  end_time: number;
  jump_link: string;
  jump_type: string;
  extend_link: AnyObject[];
  popup_mode: number;
  popup_type: number;
  sort: number;
  status: number;
  created_at: number;
  updated_at: number;
}
export interface Notice {
  id: number;
  member_id: number;
  author_name: number;
  merchant_id: number;
  title: string;
  content: string;
  cover: string;
  synopsis: string;
  view: number;
  status: number;
  created_at: number;
  updated_at: number;
}
interface Coupon {
  title: string;
  total: number;
}

// 广告管理
export interface AdvList {
  bargain_top: AdvItem[];
}
export interface AdvItem {
  id: string;
  merchant_id: string;
  name: string;
  cover: string;
  location: string;
  view: string;
  describe: string;
  start_time: string;
  end_time: string;
  jump_link: string;
  jump_type: string;
  extend_link: string;
  sort: string;
  status: string;
  created_at: string;
  updated_at: string;
}
