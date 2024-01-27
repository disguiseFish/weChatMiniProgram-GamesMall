import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast.js';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog.js';
const db = wx.cloud.database();
const _ = db.command
// const orderDB = db.collection('order')

Page({
  data: {
    isAll: false,
    isEmpty: true,
    isLoading: true,
    tabIndex: 0,
    orderList: [],
    page: 0,
    hasMoreData: true,
    showReceipt: false,// 确认收货面板
    imageList: [],// 确认收货面板的图片
    id: 0,// 确认收货的订单id
    showPayment: false,// 打开付款面板
    totalPrice: 0
  },
  onLoad: function (options) {
    if (options.type) {
      this.setData({
        tabIndex: options.type
      })
    } else {
      this.setData({
        tabIndex: 0
      })
    }

    this.getOrderList()
  },
  onReady: function () {

  },
  onShow: function () {
    this.setData({
      // page:0,
      hasMoreData: true
    })
    this.getOrderList()
  },
  onUnload: function () {
    // 页面被关闭
    wx.switchTab({
      url: '/pages/my/my'
    })
    // 这里可以进行其他操作，比如保存数据、清除定时器等
  },

  changeInput(e) {
    console.log('e', e.detail)
    if (e.detail === "xxsz") {
      this.getAllOrders()
    } else {
      this.getOrderList()
    }
  },

  // 获取所有订单
  getAllOrders() {
    if (!this.data.hasMoreData) {
      return;
    }
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });
    db.collection('game_orders').get()
      .then(res => {
        console.log('获取game_orders的数据', res.data)
      
        this.setData({
          isAll:true,
          orderList: res?.data?.reverse()
        })
      })
  },

  //  用户获取自己的订单
  getOrderList() {
    // wx.getStorageSync('selfOrders')
    if (!this.data.hasMoreData) {
      return;
    }
    // Toast.loading({
    //   message: '加载中...',
    //   forbidClick: true,
    // });
    this.setData({
      orderList: wx.getStorageSync('selfOrders').length > 0 ? wx.getStorageSync('selfOrders')?.reverse() : [] ,
      isAll: false
    })
    //   db.collection('game_orders').get()
    //     .then(res => {
    //       // console.log('获取game_orders的数据', res.data)
    //     })
  },

  // 切换标签页点击事件
  onChange(event) {
    console.log('标签', event)
    this.setData({
      page: 0,
      tabIndex: event.detail.name,
      hasMoreData: true
    })
    this.getOrderList(this.data.tabIndex)
  },

  // 跳转至订单详情
  pushToOrderDetail(event) {
    // console.log('跳转', event)
    // let id = event.currentTarget.dataset.id
    // wx.navigateTo({
    //   url: '../order/orderDetail?id=' + id,
    // })
  },

  copyOrder(event) {
    wx.setClipboardData({
      data: event.target.dataset.id,
      success: function (res) {
        // Toast('复制成功');
      }
    })
  },

  // 打开确认收货面板点击事件
  openReceipt(event) {
    console.log('获取数据', event)
    let { image, id } = event.currentTarget.dataset
    // let {imageList} = this.data
    this.setData({
      id: id
    })

    this.setData({
      imageList: image
    })

    this.setData({
      showReceipt: true
    })
  },

  // 关闭确认收货面板点击事件
  closeReceipt() {
    console.log('关闭了面板')
    this.setData({
      id: 0,
      showReceipt: false
    })
  },

  // 关闭付款面板
  onClose() {
    // this.setData({
    //   showPayment: false,
    //   id: 0
    // })
  },
})