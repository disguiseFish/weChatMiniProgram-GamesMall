import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast.js';

const db = wx.cloud.database();
const _ = db.command
// const product_stock = db.collection('product_stock')
// const product_stock = db.collection('allGames')
// const goods_info = db.collection('goods_info')

Page({

  data: {
    cartData: [],
    recommendedData: [],
    totalPrice: 0,
    hasLogin: true,
    isEdit: false,
    isSelectAll: false,
    isEmpty: true,

  },

  // 跳转到分类页面
  pushToSort() {
    wx.switchTab({
      url: '../sort/sort',
    })
  },

  // 获取购物车数据
  getCartData() {
    wx.getStorage({
      key: 'userGameCar',
      success: (res) => {
        this.checkCart(res.data)
      },
      fail: (res) => {
        console.log('失败', res)
        wx.setStorage({
          key: "userGameCar",
          data: [],
          success: (res) => {
            let arr = []
            this.checkCart(arr)
          }
        })
      }
    })


  },
  // 已经登录-操作后的购物车数据与数据库的库存做对比
  checkCart(cart) {
    console.log('拿到游戏篮的总数量后》执行checkCart', cart)
    // Toast.loading({
    //   message: '加载中...',
    //   forbidClick: true,
    // });
    let newCart = []
    // 1.判断购物车是否为空

    if (cart.length == 0) {
      this.setData({
        isEmpty: true,
        cartData: cart,
      },
        () => {
          wx.setStorage({
            key: "userGameCar",
            data: cart
          }).then(() => {
            Toast.clear();
            // return;
          })
        }
      )
      // wx.setStorageSync('userGameCar', cart)



    } else {
      // Toast.loading({
      //   message: '加载中...',
      //   forbidClick: true,
      // });
      this.setData({ isEmpty: false })

      // for (let i in cart) {

      //   newCart.push(new Promise((resolve, reject) => {
      //     product_stock.doc(cart[i]._id).get().then(newStock => {
      //       // 获取库存，更新购物车
      //       let stockData = newStock.data

      //       console.log('新库存' + i, stockData)

      //       if (stockData.stock == 0) {
      //         // 库存为0,从购物车中删除
      //         cart.splice(i, 1)
      //         reject('库存为0,从购物车中删除')
      //       } else if (stockData.stock > 0 && stockData.stock < cart[i].number) {
      //         // 商品库存小于购物车所选数量
      //         stockData.name = cart[i].name
      //         stockData.number = stockData.stock
      //         stockData.selected = cart[i].selected
      //         // newCart.push(stockData)
      //         resolve(stockData)


      //       } else {
      //         stockData.name = cart[i].name
      //         stockData.number = cart[i].number
      //         stockData.selected = cart[i].selected
      //         // newCart.push(stockData)
      //         resolve(stockData)

      //       }
      //     })
      //   }).catch((err) => {
      //     console.log('错误', err)
      //   })
      //   )

      // }
      // console.log('最终购物车', newCart)
      console.log('最终游戏篮', cart)
      Promise.all(cart).then(res => {
        for (let i in res) {
          if (res[i] == undefined) {
            res.splice(i, 1)
          }
        }

        this.setData({
          cartData: res
        })
        wx.setStorageSync('userGameCar', this.data.cartData)
        console.log('最后缓存中的游戏篮', wx.getStorageSync('userGameCar'))
        this.countTotalPrice();
        this.hasSelectAll()
        Toast.clear();
      })
    }
  },

  //判断是否登录
  getOpenId() {
    this.getCartData()
  },

  //切换购物车状态
  switchEdit() {
    let { isEdit } = this.data
    this.setData({
      isEdit: !isEdit
    })
  },

  // 勾选购物车列表
  onChange(event) {
    let eventData = event.currentTarget.dataset;
    let index = eventData.index
    let { cartData } = this.data

    cartData[index].selected = event.detail

    this.setData({
      cartData: cartData
    })

    this.checkCart(this.data.cartData)
    console.log('勾选', this.data.cartData[index].selected)
  },

  // 全选按钮
  selectAll() {
    let { isSelectAll, cartData } = this.data
    for (let i in cartData) {
      cartData[i].selected = !isSelectAll
    }

    this.setData({
      cartData: cartData,
      isSelectAll: !isSelectAll
    })
    this.checkCart(this.data.cartData)


  },

  // 判断是否所有商品被选中
  hasSelectAll() {
    let { cartData } = this.data
    for (let i in cartData) {
      if (cartData[i].selected == false) {
        this.setData({ isSelectAll: false })
        return
      }
    }
    this.setData({ isSelectAll: true })
  },

  // 步进器处理
  setStepper(event) {
    console.log('事件', event)
    let number = event.detail
    let index = event.currentTarget.dataset.index
    let { cartData } = this.data
    cartData[index].number = number
    this.setData({
      cartData: cartData
    })
    this.checkCart(this.data.cartData)
  },

  // 计算勾选的商品总价
  countTotalPrice() {
    let cart = wx.getStorageSync('userGameCar') || []
    let totalPrice = 0
    console.log('缓存中的购物车', cart)
    if (cart.length == 0) {
      console.log('1', cart)
      this.setData({ totalPrice: 0 })
      return
    } else {
      console.log('2', cart)
      for (let i in cart) {
        if (cart[i]?.selected == true) {
          totalPrice = (Number(cart[i].size) * cart[i].number) + totalPrice
        } 
      }
      console.log('>>>', totalPrice?.toFixed([2]))
      this.setData({ totalPrice: totalPrice?.toFixed([2]) })
    }
  },

  // 删除勾选的商品
  deleteGoods() {
    let cart = wx.getStorageSync('userGameCar') || []
    if (cart.length == 0) {
      return
    }

    if (this.data.isSelectAll == true) {
      cart = []
      this.checkCart(cart)
    } else {
      let newCart = cart.filter((item, index) => {
        return item.selected == false
      })

      console.log('删除后的购物车', newCart)
      this.checkCart(newCart)
    }
  },

  // 推荐列表跳转
  pushToDetail(event) {
    let eventData = event.currentTarget.dataset;
    console.log('参数', eventData)
    wx.navigateTo({
      url: '../detail/detail?id=' + eventData.id
    })
  },

  // 商品列表跳转至商品详情
  push(event) {
    console.log('商品列表跳转至商品详情', event)
    // if (event.target.id === "") {
    //   wx.navigateTo({
    //     url: '../detail/detail?id=' + event.currentTarget.dataset.item[0],
    //   })
    // }
  },

  // 商品结算
  settlement() {
    let cart = wx.getStorageSync('userGameCar') || []
    // 选中的商品
    let newCart = cart.filter((item) => {
      return item.selected == true
    })
    console.log('选中的游戏>>>', newCart)

    if (newCart.length == 0) {
      Toast('您还没选择游戏');
      return;
    }
    let { totalPrice } = this.data
    let to_add_data = {}
    let date = new Date()
    const obj = {
      checkedCar: newCart,
      totalPrice
    }
    console.log('obj', obj)
    wx.setStorageSync('back', 'userGameCar')
    wx.setStorageSync('checkedGames', obj)
    wx.navigateTo({
      url: '../order/order?from=' + 'userGameCar',
    })
  },

  // 用户登录后，获取购物车商品数量
  getCartCount() {
    if (wx.getStorageSync('storage_user_info')) {
      console.log('用户登录后')
      let cart = wx.getStorageSync('userGameCar') || []
      if (cart.length > 0) {
        getApp().globalData.number = cart.length
      } else {
        getApp().globalData.number = ''

      }
    } else {
      getApp().globalData.number = ''
    }
  },
  onLoad: function (options) {
    console.log('第一次加载')
    // this.getRecommendedData()
  },
  onShow() {
    this.getTabBar().setData({
      active: 2
    })

    this.setData({
      isEdit: false
    },
      () => {
        this.getOpenId()
      }
    )

    Toast.clear();
  },
  onHide() {
    console.log('隐藏')
    Toast.clear();

  },
  // 下拉刷新
  onPullDownRefresh: function () {
    console.log('下拉')
    if (wx.getStorageSync('storage_info') !== 1) {
      console.log('没登陆')
      wx.stopPullDownRefresh()

      return
    }
    let cart = wx.getStorageSync('userGameCar') || []
    if (cart.length == 0) {
      console.log('没货物')
      wx.stopPullDownRefresh()

      return
    }
    this.checkCart(cart)
    wx.stopPullDownRefresh()
  },
})
