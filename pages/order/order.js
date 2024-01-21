import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast.js';
const db = wx.cloud.database();
const _ = db.command
const orderDB = db.collection('order')


Page({
  data: {
    orderData: [],
    address: [],
    select_address: {},
    totalPrice: 0,
    message: '',
    openId: 0,
    orderId: 0,
    hasAddress: false,
    show: false,

  },

  // 获取订单的商品列表信息
  getOrderData(from) {
    let order;

    order = wx.getStorageSync('checkedGames') || []
    console.log('确认订单', order)

    this.setData({
      totalPrice: Number(order.totalPrice).toFixed([2]),
      orderData: order.checkedCar,
      createTime: (new Date()).toLocaleString(),
      // createdBy

    })
  },

  onLoad: function (options) {


    let from = options.from
    // 获取订单数据
    this.getOrderData(from)

    // 第一次加载 获取默认地址
    // this.getDefaultAddress()

    // 获取用户openid
    this.getOpenIdData();
  },


  onReady: function () {

  },

  onShow: function () {
    // 获取被选中的地址
    // this.getSelectedAddress()
  },

  // 跳转至地址选择页面
  pushToSelectAddress() {
    wx.navigateTo({
      url: '/pages/address/address?from=order',
    })
  },

  // 获取默认地址
  getDefaultAddress() {
    let address = wx.getStorageSync('address') || []
    if (address.length == 0) {
      this.setData({
        address: address,
        select_address: {},
        hasAddress: false
      })
      console.log('没有缓存地址', this.data.select_address)

      return
    }
    let select_address = address.filter((item) => {
      return item.isDefault == true
    })
    if (select_address.length == 0) {
      this.setData({
        select_address: {},
        hasAddress: false

      })
      console.log('没有默认地址', this.data.select_address)

      return
    }

    console.log('有缓存地址', this.data.select_address)

    this.setData({
      select_address: select_address[0],
      hasAddress: true

    })
    return
  },

  // 获取选中的地址
  getSelectedAddress() {
    let address = wx.getStorageSync('address') || []
    if (address.length == 0) {
      this.setData({
        address: address,
        select_address: {},
        hasAddress: false

      })
      console.log('没有缓存地址', this.data.select_address)


      return
    }
    let select_address = address.filter((item) => {
      return item.selected == true
    })

    console.log('选中的地址', select_address)
    if (select_address.length == 0) {
      this.setData({
        select_address: {},
        hasAddress: false

      })

      console.log('没有选中地址', this.data.select_address)

      return
    } else {
      console.log('有选中地址', select_address)

      this.setData({
        select_address: select_address[0],
        hasAddress: true
      })
    }
  },

  // 获取用户openid
  getOpenIdData() {
    wx.cloud.callFunction({
      name: 'getOpenid',
      success: res => {
        console.log('openid', res.result)
        this.setData({
          openId: res.result.openid
        })
      }
    })
  },
  // 展示订单付款点击事件 
  showPopup() {
    // 检查是否有填地址
    // let { select_address } = this.data;
    // if (JSON.stringify(select_address) === '{}') {
    //   Toast('请选择地址');
    //   console.log('地址为空')
    //   return
    // } else {
    //   console.log('地址不为空', select_address)
    // }

    this.setData({ show: true });
  },

  // 创建订单
  createOrder() {
    let { orderData, totalPrice, message, openId } = this.data
    let order = {
      openId: 0,
      order_number: 0,
      created: 0,
      productList: 0,
      totalPrice: 0,
      state: 0,
      address: 0,
      message: ''
    }
    // 用户openid
    // order.openId = openId

    // 订单编号
    let myDate = new Date();
    let year = myDate.getFullYear() + '';
    let month = (myDate.getMonth() + 1) + '';
    let day = myDate.getDate() + '';
    let ran = Math.floor(Math.random() * 10000 + 1) + '';
    order.order_number = `${year}${month}${day}${ran}`

    // 订单创建时间
    let hours = myDate.getHours()
    let min = myDate.getMinutes();
    order.created = `${year}-${month}-${day} ${hours}:${min}`
    order.productList = orderData
    // order.productList = orderData


    //总金额
    order.totalVolum = totalPrice

    // 订单id
    // order.Id = orderId

    // 收货人地址
    // order.address = JSON.stringify(select_address)

    // 给卖家的留言
    order.message = message
    // console.log()
    return order
  },

  // 取消支付,生成未付款订单
  onClose() {
    this.setData({
      show: false
    })
  },

  setCustomSelfOrder(newOrder) {
    if (wx.getStorageSync('selfOrders')) {
      wx.setStorageSync('selfOrders', [...wx.getStorageSync('selfOrders'), newOrder])
    } else {
      wx.setStorageSync('selfOrders', [newOrder])
    }
  },

  addZero(num) {
    var digit = num.toString().length; // 获取数字的位数
    
    if (digit === 1) {
        return "000" + num; // 如果只有一位数，则在前面添加一个 0
    } else if (digit > 2 && digit < 5) {
        return num.toLocaleString('en-US', {minimumIntegerDigits: digit}); // 其他情况下直接返回原始数值并保持不变
    } else {
        throw new Error("Invalid input"); // 输入无效时抛出错误
    }
},

  // 完成支付点击事件
  clickComfire() {
    let order = this.createOrder();
    order.state = "2"
    db.collection('game_orders').get().then(res => {
      // 这里拿到的res.data就不是全部的数据
      console.log('生成0>>>>', this.addZero(res.data.length + 1)) 
      order.orderId = `X${res.data.length + 1}`
      console.log('add的order_massage', order)
      console.log('game_orders>>>>', res.data.length)
      db.collection('game_orders').add({
        data: order,
        success: res => {
          this.setCustomSelfOrder(order)
          // 新购物车
          const array1 = wx.getStorageSync('userGameCar')
          const array2 = wx.getStorageSync('checkedGames').checkedCar
          const newCar = array1.filter(item => !array2.some(obj => obj._id === item._id));
          console.log('newCar>>>', newCar)
          // 把购物车中对应的已经生成订单的游戏删掉
          wx.setStorageSync('userGameCar', newCar)
          // 把选中的游戏删掉
          wx.setStorageSync('checkedGames', { checkedCar: [], totalPrice: '' })
          // 获取数据库中新建的订单，对购物车进行删减
          // 跳去订单页
          wx.navigateTo({
            url: '../orderList/orderList',
          })
        },
        fail: res => {
          console.log('失败', res)

        }
      })
    })
  }


})