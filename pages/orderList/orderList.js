import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast.js';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog.js';
const db = wx.cloud.database();
const _ = db.command
// const orderDB = db.collection('order')

Page({
  data: {
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
    console.log("页面被关闭");
    wx.switchTab({
      url:'/pages/my/my'
    })
    // 这里可以进行其他操作，比如保存数据、清除定时器等
  },
  // onReachBottom: function () {
  //   this.setData({
  //     page: ++this.data.page
  //   })
  //   this.getOrderList(this.data.tabIndex)
  // },

  // // 将订单的商品列表从json转化成对象
  // getProductList(list) {
  //   for (let i in list) {
  //     list[i].productList = JSON.parse(list[i].productList)
  //   }
  // },

  // 通过用户的openid以及订单状态获取订单列表数据
  getOrderList() {

    // console.log('tab参数', state)
    if (!this.data.hasMoreData) {
      return;
    }
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });

    // const LIMIT = 5
    // let { page, orderList } = this.data
    // console.log('wx.getStorageSyn', wx.getStorageSync('storage_user_info').openid)
    // db.collection('game_orders').where({
    //   openId: wx.getStorageSync('storage_user_info').openid
    // }).get()
    wx.cloud.callFunction({
      name: 'getOrders',
      data: {},
      success: (res) => {
        console.log('获取所有订单11>>>', res.result.res.data)
        // wx.getStorageSync('storage_user_info')
        // this.setData({
        //   gameTypes: res.result.res.data,
        //   selectData: res.result.res.data[0]
        // })
        // this.fetchGames(res.result.res.data)
      },
      fail: (error) => {
        console.log('获取到失败', error)
      }
    })

    db.collection('game_orders').get()
      .then(res => {
        // console.log('获取的数据', res.data)
        // let newlist = res.data.map(item=>{
        //   return {
        //     ...item,
        //     productList: JSON.parse(item.productList)
        //   }
        // })
        console.log('获取game_orders的数据', res.data)
        this.setData({
          orderList: res.data.reverse()
        })
        // user = res.data[0]
      })
    // wx.cloud.callFunction({
    //   name: 'getOpenid',
    //   success: res => {
    //     let openid = res.result.openid
    //     if (state == 0) {
    //       orderDB.where({
    //         openId: openid
    //       }).limit(LIMIT).skip(LIMIT * page).orderBy('created', 'desc').get().then(res => {
    //         console.log('全部订单列表', res)

    //         this.getProductList(res.data)
    //         if (page == 0) {
    //           this.setData({
    //             orderList: res.data
    //           })
    //         } else {
    //           this.setData({
    //             orderList: [...orderList, ...res.data]
    //           })
    //         }
    //         if (res.data.length == 0) {
    //           this.setData({
    //             hasMoreData: false
    //           })
    //           return
    //         }
    //         Toast.clear();

    //       })
    //     } else {
    //       orderDB.where({
    //         openId: openid,
    //         state: state
    //       }).limit(LIMIT).skip(LIMIT * page).orderBy('created', 'desc').get().then(res => {
    //         console.log('分类订单列表', res)

    //         this.getProductList(res.data)
    //         if (page == 0) {
    //           this.setData({
    //             orderList: res.data
    //           })
    //         } else {
    //           this.setData({
    //             orderList: [...orderList, ...res.data]
    //           })
    //         }
    //         if (res.data.length == 0) {
    //           this.setData({
    //             hasMoreData: false
    //           })
    //           return
    //         }
    //         Toast.clear();

    //       })
    //     }

    //   }
    // })
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
    console.log('event>>>', event.target.dataset.id)
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

    // let imageData=[];
    // for(let i in image){
    //   if(i<=2){
    //     imageData.push(image[i].color_image)
    //   }
    // }
    this.setData({
      imageList: image
    })

    this.setData({
      showReceipt: true
    })

    console.log('图片列表', this.data.imageList)



  },
  // 关闭确认收货面板点击事件
  closeReceipt() {
    console.log('关闭了面板')
    this.setData({
      id: 0,
      showReceipt: false
    })
  },


  // 查看物流点击事件
  clickLogistics(event) {
    console.log('查看物流', event)
    wx.navigateTo({
      url: './logistics?id=' + event.currentTarget.dataset.id,
    })
  },

  // 打开付款面板
  // openPayment(event) {
  //   let id = event.currentTarget.dataset.id
  //   this.setData({
  //     id: id
  //   })
  //   orderDB.doc(id).get().then(res => {
  //     console.log('付款', res)
  //     this.setData({
  //       totalPrice: res.data.totalPrice
  //     })
  //   })


  //   this.setData({
  //     showPayment: true
  //   })
  // },

  // 关闭付款面板
  onClose() {
    // this.setData({
    //   showPayment: false,
    //   id: 0
    // })
  },

  // 完成支付点击事件
  // clickComfire() {
  //   let { id } = this.data
  //   orderDB.doc(id).update({
  //     data: {
  //       state: "2"
  //     },
  //     success: res => {
  //       this.setData({
  //         page: 0,
  //         hasMoreData: true
  //       })
  //       this.getOrderList(this.data.tabIndex)
  //       Toast.success('支付成功');
  //       this.setData({
  //         showPayment: false
  //       })
  //     }
  //   })
  // }
})