export interface TableListQueryParams {
  page?: number;
  per?: number;
  pageSize?: number;
  pageNum?: number;
}

export interface PaginationConfig {
  total: number;
  current: number;
  pageSize: number;
  pageNum: number;
  showSizeChanger: boolean;
  showQuickJumper: boolean;
}

export interface TableListItem {
  id?: number;
  name?: string;
  desc?: string;
  href?: string;
  type?: string;
  duration?: string;
  amount?: string;
  appid?: string;
  secret?: string;
  mobile?: string;
  roleName?: string;
  code?: string;
}

export interface IResponseData {
  list?: TableListItem[];
  total?: number;
}

export interface TokenConfig {
  appid?: string;
  secret?: string;
}

export interface GenerateConfig {
  token?: string;
  scene?: string;
  page?: string;
}
