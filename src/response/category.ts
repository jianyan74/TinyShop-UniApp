export interface Config {
  type: string;
}

export interface CustomCategory {
  list: CategoryItem[];
  config: Config;
}

export interface CategoryItem {
  id: string;
  title: string;
  pid: string;
  cover: string;
  level: string;
  isActive: boolean;
  child: CategoryItem[];
}

export interface CateItem {
  jump_type: string;
  jump_link: string;
  id: string;
  cover: string;
}
