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
  id: number;
  name: string;
  desc?: string;
  href?: string;
  type?: string;
  duration?: string;
  amount?: string;
}

export interface IResponseData {
  list?: TableListItem[];
  total?: number;
}
