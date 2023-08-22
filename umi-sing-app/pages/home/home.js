import { fetchHome } from '../../services/home/home';
import { fetchGoodsList } from '../../services/good/fetchGoods';
import { REQUEST_CONFIG } from '../../config/index';
import {formatDateThis} from '../../utils/dateUtil'
import Toast from 'tdesign-miniprogram/toast/index';


Page({
  data: {
    deviceNo: '',
    imgSrcs: [],
    tabList: [],
    goodsList: [],
    goodsListLoadStatus: 0,
    pageLoading: false,
    current: 1,
    autoplay: true,
    duration: '500',
    interval: 5000,
    navigation: { type: 'dots' },
    swiperImageProps: { mode: 'scaleToFill' },
  },

  goodListPagination: {
    index: 0,
    num: 20,
  },

  privateData: {
    tabIndex: 0,
  },

  onShow() {
    this.getTabBar().init();
  },

  onLoad(query) {
    this.init();
    const deviceNo = decodeURIComponent(query.deviceNo) // 获取到二维码原始链接内容
    wx.setStorageSync('deviceNo', deviceNo); // 将获取到的设备号存储到本地缓存中
    this.setData({
        deviceNo
    })
    // const scancode_time = parseInt(query.scancode_time) // 获取用户扫码时间 UNIX 时间戳
  },

  onReachBottom() {
    if (this.data.goodsListLoadStatus === 0) {
      this.loadGoodsList();
    }
  },

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.loadHomePage();
  },

  loadHomePage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: true,
    });
    fetchHome().then(({ swiper, tabList }) => {
      this.setData({
        tabList,
        imgSrcs: swiper,
        pageLoading: false,
      });
      this.loadGoodsList(true);
    });
  },

  tabChangeHandle(e) {
    this.privateData.tabIndex = e.detail;
    this.loadGoodsList(true);
  },

  onReTry() {
    this.loadGoodsList();
  },

  async loadGoodsList(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }

    this.setData({ goodsListLoadStatus: 1 });

    const pageSize = this.goodListPagination.num;
    let pageIndex = this.privateData.tabIndex * pageSize + this.goodListPagination.index + 1;
    if (fresh) {
      pageIndex = 0;
    }

    try {
      const nextList = await fetchGoodsList(pageIndex, pageSize);
      this.setData({
        goodsList: fresh ? nextList : this.data.goodsList.concat(nextList),
        goodsListLoadStatus: 0,
      });

      this.goodListPagination.index = pageIndex;
      this.goodListPagination.num = pageSize;
    } catch (err) {
      this.setData({ goodsListLoadStatus: 3 });
    }
  },

  goodListClickHandle(e) {
    const { index } = e.detail;
    const { id } = this.data.goodsList[index];
    const {nickName} = wx.getStorageSync('userInfo');
    const openId = wx.getStorageSync('openId');
    const deviceNo = wx.getStorageSync('deviceNo');
    const params = {
        deviceNo,
        orderDate: formatDateThis(new Date(),''),
        packageId: id,
        payMode: "01",
        source: "01",
        token: Math.random().toString(36).slice(-8),
        userId: openId,
        userName: nickName
    }
    wx.request({
        url: `${REQUEST_CONFIG.host}/api/consumeOrder/operate`,
        // 请求的方法
        method: 'POST', // 或 ‘POST’
        // 设置请求头，不能设置 Referer
        data: params,
        // 请求成功时的处理
        success: function (res) {
            // 一般在这一打印下看看是否拿到数据
            console.log(res.data)
            const {data} = res;
            const {appId,timeStamp,nonceStr,packageVal,signType,paySign} = data.data;
            wx.requestPayment
                (
                    {   
                        provider: 'wxpay',
                        appId,
                        timeStamp,
                        nonceStr,
                        package:packageVal,
                        signType,paySign,
                        "success":function(res){
                            wx.showToast({
                                title: '购买成功',
                                icon: 'success',
                                duration: 2000
                              })
                        },
                        "fail":function(res){
                            wx.showToast({
                                title: '购买失败，请联系客服。',
                                icon: 'error',
                                duration: 2000
                              })
                        }
                    }
                )
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
  },

  goodListAddCartHandle() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '点击加入购物车',
    });
  },

  navToSearchPage() {
    wx.navigateTo({ url: '/pages/goods/search/index' });
  },

  navToActivityDetail({ detail }) {
    const { index: promotionID = 0 } = detail || {};
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${promotionID}`,
    });
  },
});
