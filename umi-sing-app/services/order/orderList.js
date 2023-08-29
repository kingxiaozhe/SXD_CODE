import { config,REQUEST_CONFIG } from '../../config/index';


/** 获取订单列表mock数据 */
function mockFetchOrders(params) {
  const { delay } = require('../_utils/delay');
  const { genOrders } = require('../../model/order/orderList');

  return delay(200).then(() => genOrders(params));
}

/** 获取订单列表数据 */
export function fetchOrders(params) {
//   if (config.useMock) {
//     return mockFetchOrders(params);
//   }
const openId = wx.getStorageSync('openId');

  return new Promise((resolve) => {
    wx.request({
        url: `${REQUEST_CONFIG.host}/api/consumeOrder/getByUserId`,
        // 请求的方法
        method: 'POST', // 或 ‘POST’
        // 设置请求头，不能设置 Referer
        data: {
            ...params,
            userId:openId
        },
        // 请求成功时的处理
        success: function (res) {
            // 一般在这一打印下看看是否拿到数据
            console.log(res.data)
            resolve(res.data);
        },
        // 请求失败时的一些处理
        fail: function () {
            wx.showToast({
                icon: "none",
                mask: true,
                title: "接口调用失败，请稍后再试。",
            });
        }
    });
  });
}

/** 获取订单列表mock数据 */
function mockFetchOrdersCount(params) {
  const { delay } = require('../_utils/delay');
  const { genOrdersCount } = require('../../model/order/orderList');

  return delay().then(() => genOrdersCount(params));
}

/** 获取订单列表统计 */
export function fetchOrdersCount(params) {
  if (config.useMock) {
    return mockFetchOrdersCount(params);
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}
