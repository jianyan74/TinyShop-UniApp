export interface LiveItem {
  id: string;
  merchant_id: string;
  shop_id: string;
  name: string;
  roomid: string;
  cover_img: string;
  share_img: string;
  live_status: string;
  start_time: string;
  end_time: string;
  anchor_name: string;
  anchor_wechat: string;
  sub_anchor_wechat: string;
  live_type: string;
  creater_openid: string;
  creater_wechat: string;
  close_like: string;
  close_goods: string;
  close_comment: string;
  close_share: string;
  close_kf: string;
  close_replay: string;
  is_feeds_public: string;
  feeds_img: string;
  total: string;
  playback?: any;
  push_addr: string;
  assistant?: any;
  cover_media: string;
  share_media: string;
  feeds_media: string;
  share_path: string;
  qrcode_url: string;
  is_recommend: string;
  is_stick: string;
  status: string;
  created_at: string;
  updated_at: string;
}