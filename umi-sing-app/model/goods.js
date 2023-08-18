import { genGood,allGoods } from './good';
import { REQUEST_CONFIG } from '../config/index';


export function getGoodsListByService(){
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${REQUEST_CONFIG.host}/api/consumePackage/list`,
                // 请求的方法
            method: 'POST', // 或 ‘POST’
            data: {
                "pageNum": 1,
                "pageSize": 100
            },
          success: res => {
            const currentGoods = res.data.data.list;
            const t= new Array(currentGoods.length).fill(0).map((_, idx) => genGood(currentGoods,idx + 1))
            resolve(t)
          },
          fail: err => {
            reject(err)
          }
        })
      })
}

export function getGoodsList(baseID = 0, length = 10) {
    // const goods = await getGoodsListByService();
  return new Array(allGoods.length).fill(0).map((_, idx) => genGood(idx + baseID));
}
