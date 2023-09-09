import { config,REQUEST_CONFIG,cdnBase } from '../../config/index';
const imgPrefix = cdnBase;

const defaultDesc = [`${imgPrefix}/goods/details-1.png`];

/** 获取商品列表 */
async function mockFetchGoodsList(pageIndex = 1, pageSize = 5) {
  const { delay } = require('../_utils/delay');
  try{
    const { getGoodsListByService,getGoodsList } = require('../../model/goods');
    const t = await getGoodsListByService();
    return delay().then(async() =>
        t.map((item) => {
                return {
                    spuId: item.spuId,
                    thumb: item.primaryImage,
                    title: item.title,
                    price: item.minSalePrice,
                    originPrice: item.maxLinePrice,
                    tags: item.spuTagList.map((tag) => tag.title),
                };
            })
    );
  }catch(error){
  }
  
}

function genGood(currentGoods,id, available = 1) {
    const specID = ['135681624', '135681628'];
    if (specID.indexOf(id) > -1) {
      return currentGoods.filter((good) => good.spuId === id)[0];
    }
    const item = currentGoods[id % currentGoods.length];
    return {
      ...item,
      spuId: `${id}`,
      available: available,
      desc: item?.desc || '',
      title: item.name,
      desc: item?.desc || defaultDesc,
      price:item.amount,
      originPrice:Number(item.amount)+20,
      tags:[],
    };
  }

/** 获取商品列表 */
export function fetchGoodsList(pageIndex = 1, pageSize = 20) {
//   if (config.useMock) {
//     return mockFetchGoodsList(pageIndex, pageSize);
//   }
  return new Promise((resolve,reject) => {
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
  });
}
