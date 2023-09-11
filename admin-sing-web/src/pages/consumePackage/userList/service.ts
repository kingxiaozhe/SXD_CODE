import request from '@/utils/request';
// import requestLocal from '@/utils/requestLocal';
import { TableListQueryParams, TableListItem, TokenConfig, GenerateConfig } from './data';

export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/userInfo/list',
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

export async function updPassword(params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: '/userInfo/updPassword',
    method: 'POST',
    data: params,
  });
}

export async function getTokenData(params: TokenConfig): Promise<any> {
  return request({
    url: `/cgi-bin/token?grant_type=client_credential&appid=${params.appid}&secret=${params.secret}`,
    method: 'GET',
  });
}

export async function generateImage(params: GenerateConfig): Promise<any> {
  return request({
    url: `/wxa/getwxacodeunlimit?access_token=${params.token}`,
    method: 'POST',
    responseType: 'blob',
    data: {
      scene: params.scene,
      // page: params.page,
    },
  });
}

export async function updateData(id: number, params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: `/userInfo/update`,
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
