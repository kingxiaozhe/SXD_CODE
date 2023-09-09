import { config } from '../../config/index';

/** 获取个人中心信息 */
function mockFetchPerson() {
  const { delay } = require('../_utils/delay');
  const { genSimpleUserInfo } = require('../../model/usercenter');
  const { genAddress } = require('../../model/address');
  const address = genAddress();
  return delay().then(() => ({
    ...genSimpleUserInfo(),
    address: {
      provinceName: address.provinceName,
      provinceCode: address.provinceCode,
      cityName: address.cityName,
      cityCode: address.cityCode,
    },
  }));
}

/** 获取个人中心信息 */
export function fetchPerson() {
//   if (config.useMock) {
//     return mockFetchPerson();
//   }
  return new Promise((resolve) => {
    wx.getUserInfo({
        success: function(res) {
          var userInfo = res.userInfo
        //   var nickName = userInfo.nickName
        //   var avatarUrl = userInfo.avatarUrl
        //   var gender = userInfo.gender //性别 0：未知、1：男、2：女
        //   var province = userInfo.province
        //   var city = userInfo.city
        //   var country = userInfo.country
          resolve(userInfo);
        }
      })
    
  });
}
