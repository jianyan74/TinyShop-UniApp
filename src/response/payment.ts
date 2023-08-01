import { OrderGroupEnum, PayTypeEnum } from "@/enum/paymentEnum";
import { Route } from "@/response/route";

export interface paymentConfig {
  order_group: OrderGroupEnum; // 订单组别
  code: string; // 平台授权码
  pay_type: PayTypeEnum; // 支付类型
  trade_type: string; // 交易类别
  data: string; // 提交的数据	例如: {“order_id”:199};
  openid: string; // 授权用户ID
  route: Route;
  query: object;
}

export interface RechargeConfigItem {
  id: string;
  merchant_id: string;
  price: string;
  give_price: string;
  give_point: string;
  give_growth: string;
  sort: string;
  status: string;
  created_at: string;
  updated_at: string;
}
