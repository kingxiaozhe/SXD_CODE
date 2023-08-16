import request from '@/utils/request';
// import requestLocal from '@/utils/requestLocal';
import { TableListQueryParams, TableListItem } from './data';

export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/consumePackage/list',
    method: 'POST',
    data: params,
  });
}

export async function createData(params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: '/consumePackage/add',
    method: 'POST',
    data: params,
  });
}

export async function updateData(id: number, params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: `/consumePackage/update`,
    method: 'POST',
    data: { id, ...params },
  });
}

export async function removeData(id: string): Promise<any> {
  const bodyFormData = new FormData();
  bodyFormData.append('id', id);
  return request({
    url: `/consumePackage/delete`,
    method: 'POST',
    data: bodyFormData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function detailData(id: string): Promise<any> {
  const bodyFormData = new FormData();
  bodyFormData.append('id', id);
  return request({
    url: `/consumePackage/get`,
    method: 'POST',
    data: bodyFormData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
