// 最新一条消息
export interface NotifyNewest {
  newest: Newest;
  unReadCount: UnReadCount;
}
interface Newest {
  id: string;
  app_id: string;
  merchant_id: string;
  member_id: string;
  notify_id: string;
  is_read: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  notify: Notify;
}

// 消息通知数
export interface ReadCount {
  count: number;
  announce: number;
  message: number;
  remind: number;
}

// 服务通知
export interface NotifyData {
  chat: Chat;
  list: NotifyItem[];
}
interface UnReadCount {
  count: number;
  announce: number;
  remind: number;
  message: number;
}
interface Chat {
  newest: NotifyDataNewest;
  unReadCount: string;
}
export interface NotifyItem {
  id: string;
  app_id: string;
  merchant_id: string;
  member_id: string;
  notify_id: string;
  is_read: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  notify: Notify;
}
interface NotifyDataNewest {
  id: string;
  merchant_id: string;
  shop_id: string;
  bubble_id: string;
  send_id: string;
  send_type: string;
  send_nickname: string;
  send_head_portrait: string;
  send_status: string;
  user_id: string;
  type: string;
  content: string;
  extend_content: any[];
  receiver_id: string;
  receiver_type: string;
  receiver_nickname: string;
  receiver_head_portrait: string;
  receiver_status: string;
  is_read: string;
  is_robot_reply: string;
  status: string;
  created_at: string;
  updated_at: string;
  time: string;
}
export interface Notify {
  id: string;
  title: string;
  merchant_id: string;
  content: string;
  cover: string;
  synopsis: string;
  type: string;
  target_id: string;
  target_type: string;
  target_display: string;
  action: string;
  view: string;
  sender_id: string;
  sender_display: string;
  sender_withdraw: string;
  params: string;
  status: string;
  created_at: string;
  updated_at: string;
}
