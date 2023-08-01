interface Config {
  service_mobile: string;
  service_working_hours: string;
  service_on_line_working_hours: string;
}

export interface ServiceQuestions {
  config: Config;
  questions: Questions[];
}

interface Questions {
  id: string;
  title: string;
}

export interface Question {
  id: number;
  merchant_id: number;
  shop_id: number;
  title: string;
  content: string;
  view: number;
  sort: number;
  status: number;
  created_at: number;
  updated_at: number;
}
