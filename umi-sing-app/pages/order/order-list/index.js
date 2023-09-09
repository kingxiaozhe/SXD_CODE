import { OrderStatus } from '../config';
import {
  fetchOrders,
  fetchOrdersCount,
  stopCurrentOrder,
} from '../../../services/order/orderList';
import { cosThumb } from '../../../utils/util';

Page({
  page: {
    size: 100,
    num: 1,
  },

  data: {
    tabs: [
      { key: -1, text: '全部' },
    //   { key: OrderStatus.PENDING_PAYMENT, text: '待付款', info: '' },
    //   { key: OrderStatus.PENDING_DELIVERY, text: '待发货', info: '' },
    //   { key: OrderStatus.PENDING_RECEIPT, text: '待收货', info: '' },
    //   { key: OrderStatus.COMPLETE, text: '已完成', info: '' },
    ],
    curTab: -1,
    orderList: [],
    listLoading: 0,
    pullDownRefreshing: false,
    emptyImg:
      'https://cdn-we-retail.ym.tencent.com/miniapp/order/empty-order-list.png',
    backRefresh: false,
    status: -1,
  },

  onLoad(query) {
    let status = parseInt(query.status);
    status = this.data.tabs.map((t) => t.key).includes(status) ? status : -1;
    this.init(status);
    this.pullDownRefresh = this.selectComponent('#wr-pull-down-refresh');
  },

  onShow() {
    if (!this.data.backRefresh) return;
    this.onRefresh();
    this.setData({ backRefresh: false });
  },

//   onReachBottom() {
//     if (this.data.listLoading === 0) {
//       this.getOrderList(this.data.curTab);
//     }
//   },
  handleButtonClick: function (event) {
    const _this = this;
    wx.showModal({
        title: '提示',
        content: '确定要提前结束吗？',
        success: function (res) {
          if (res.confirm) {
            _this.stopCurrentOrder(event.currentTarget.dataset.param1);
          } else if (res.cancel) {
            // // 用户点击了取消按钮
            // console.log('用户点击了取消');
            // // 可选：在取消时执行其他操作
          }
        }
      });
    
  },

//   onPageScroll(e) {
//     this.pullDownRefresh && this.pullDownRefresh.onPageScroll(e);
//   },

  onPullDownRefresh_(e) {
    const { callback } = e.detail;
    this.setData({ pullDownRefreshing: true });
    this.refreshList(this.data.curTab)
      .then(() => {
        this.setData({ pullDownRefreshing: false });
        callback && callback();
      })
      .catch((err) => {
        this.setData({ pullDownRefreshing: false });
        Promise.reject(err);
      });
  },

  init(status) {
    status = status !== undefined ? status : this.data.curTab;
    this.setData({
      status,
    });
    this.refreshList(status);
  },

  // 提前结束订单
  stopCurrentOrder(orderNo){
    const _this=this;
    const params = {
        orderNo
    };
    this.setData({ listLoading: 1 });
    return stopCurrentOrder(params)
      .then((res) => {
        return new Promise((resolve) => {
          resolve();
        }).then(() => {
            
            _this.data.orderList.forEach((item,idx)=>{
                if(item['orderNo']==orderNo){
                    _this.data.orderList[idx]['status'] = "2";
                    _this.data.orderList[idx]['statusDesc'] = "已完成";
                }
            })
            _this.setData({
                orderList: [..._this.data.orderList],
                listLoading: _this.data.orderList.length > 0 ? 0 : 2,
            });
        });
      })
      .catch((err) => {
        this.setData({ listLoading: 3 });
        return Promise.reject(err);
      });
  },

  getOrderList(statusCode = -1, reset = false) {
    const params = {
      parameter: {
        pageSize: this.page.size,
        pageNum: this.page.num,
      },
    };
    if (statusCode !== -1) params.parameter.orderStatus = statusCode;
    this.setData({ listLoading: 1 });
    return fetchOrders(params)
      .then((res) => {
        const {list,pageNum,pageSize,pages} = res.data;
        this.page.num++;
        let orderList = [];
        if (list) {
          orderList = (list || []).map((order) => {
            return {
                deviceNo: order.deviceNo,
                endTime: order.endTime,
                startTime: order.startTime,
                status: order.status,
                statusDesc: order.statusName,
                userId: order.userId,
              id: order.orderId,
              orderNo: order.orderNo,
              packageName: order.packageName,
              storeId: order.deviceNo,
              storeName: order.deviceNo,
              amount: order.amount,
            //   statusDesc: order.orderStatusName,
            //   amount: order.paymentAmount,
            //   totalAmount: order.totalAmount,
            //   logisticsNo: order.logisticsVO.logisticsNo,
              createTime: order.startTime,
            //   goodsList: (order.orderItemVOs || []).map((goods) => ({
            //     id: goods.id,
            //     thumb: cosThumb(goods.goodsPictureUrl, 70),
            //     title: goods.goodsName,
            //     skuId: goods.skuId,
            //     spuId: goods.spuId,
            //     specs: (goods.specifications || []).map(
            //       (spec) => spec.specValue,
            //     ),
            //     price: goods.tagPrice ? goods.tagPrice : goods.actualPrice,
            //     num: goods.buyQuantity,
            //     titlePrefixTags: goods.tagText ? [{ text: goods.tagText }] : [],
            //   })),
            //   buttons: order.buttonVOs || [],
            //   groupInfoVo: order.groupInfoVo,
            //   freightFee: order.freightFee,
            };
          });
        }
        return new Promise((resolve) => {
          if (reset) {
            this.setData({ orderList: [] }, () => resolve());
          } else resolve();
        }).then(() => {
          this.setData({
            orderList: this.data.orderList.concat(orderList),
            listLoading: orderList.length > 0 ? 0 : 2,
          });
        });
      })
      .catch((err) => {
        this.setData({ listLoading: 3 });
        return Promise.reject(err);
      });
  },

  onReTryLoad() {
    this.getOrderList(this.data.curTab);
  },

  onTabChange(e) {
    const { value } = e.detail;
    this.setData({
      status: value,
    });
    this.refreshList(value);
  },

  getOrdersCount() {
    return fetchOrdersCount().then((res) => {
      const tabsCount = res.data || [];
      const { tabs } = this.data;
      tabs.forEach((tab) => {
        const tabCount = tabsCount.find((c) => c.tabType === tab.key);
        if (tabCount) {
          tab.info = tabCount.orderNum;
        }
      });
      this.setData({ tabs });
    });
  },

  refreshList(status = -1) {
    this.page = {
      size: this.page.size,
      num: 1,
    };
    this.setData({ curTab: status, orderList: [] });

    return Promise.all([
      this.getOrderList(status, true),
      this.getOrdersCount(),
    ]);
  },

  onRefresh() {
    this.refreshList(this.data.curTab);
  },

  onOrderCardTap(e) {
    const { order } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/order/order-detail/index?orderNo=${order.orderNo}`,
    });
  },
});
