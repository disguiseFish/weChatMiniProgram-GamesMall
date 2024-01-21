// pages/sort/sort.js

const db = wx.cloud.database();
const game_category = db.collection('game_types')
const goods_info = db.collection('goods_info')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeKey: 0,
    gameTypes: [],
    firstSort: [],
    selectData: {},
    selectName: '',
    isShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getSortData();
    this.getCatagory();

  },

  //获取分类信息 
  getCatagory() {
    wx.cloud.callFunction({
      name: 'getTypes',
      data: {},
      success: (res) => {
        console.log('获取游戏分类1', res.result.res.data)
        // wx.getStorageSync('storage_user_info')
        this.setData({
          gameTypes: res.result.res.data,
          selectData: res.result.res.data[0]
        })
        // this.fetchGames(res.result.res.data)
      },
      fail: (error) => {
        console.log('获取到失败', error)
      }
    })
  },

  //获取分类信息  
  // async getSortData() {

  //   let res = await game_category.get()
  //   console.log('获取的信息', res)
  //   this.setData({
  //     gameTypes: res
  //   })
  //   console.log(this.data.gameTypes)
  //   let sale = await goods_info.orderBy('sales_volume', 'desc').limit(15).get()

  //   console.log(sale.data[0])
  //   for (let i = 0; i < sale.data.length; i++) {
  //     this.data.gameTypes[0].child.push(sale.data[i])
  //   }

  //   // let newGoods = await goods_info.where({
  //   //   is_NewProducts: true
  //   // }).orderBy('_createTime', 'desc').limit(15).get()
  //   // console.log('新品', newGoods)
  //   // for (let j = 0; j < newGoods.data.length; j++) {
  //   //   this.data.gameTypes[1].child.push(newGoods.data[j])
  //   // }

  //   // this.setData({
  //   //   gameTypes: this.data.gameTypes,
  //   //   selectData: this.data.gameTypes[0]
  //   // })
  //   // console.log('热销', this.data.gameTypes)
  // },

  /**
   * 点击游戏分类
   * @param {} event 
   */
  async selectType(event) {
    let eventData = event.currentTarget.dataset;
    let index = eventData.index;
    let { gameTypes } = this.data;
    this.setData({
      selectData: gameTypes[index]
    })

    console.log('点击的分类', this.data.selectData)
  },

  /**
   * 获取所有游戏
   */
  async fetchGames(gameTypes) {
    // wx.cloud.callFunction({
    //   name: 'findGames',
    //   data: {},
    //   success: (res) => {
    //     // console.log('获取所有游戏', res.result.res.data, gameTypes)
    //     // this.setData({
    //     //   gameTypes: res.result.res.data
    //     // })
    //   },
    //   fail: (error) => {
    //     // console.log('获取到失败', error)
    //   }
    // })
  },

  onChange(event) {
    console.log(event)
  },

  addInCar(e) {
    // if (wx.getStorageSync('storage_user_info')) {
      // 登陆过
      const event = e.currentTarget.dataset
      console.log('已加入购物车之前，点击加入购物车的事件', event.gamedata)
      const localCarData = wx.getStorageSync('userGameCar')
      const addItem = { ...event.gamedata, number: 1 }
      let newCar = []
      console.log('获取local里的数据>>>', localCarData, addItem)
      // number
      if (localCarData?.length > 0) {
        if (localCarData?.some(item => { return item._id === addItem._id })) {
          // 加入重复的游戏
          console.log('加入重复的游戏')
          newCar = localCarData.map(item => {
            if (item._id === addItem._id) {
              item['number'] = item['number'] + 1
            }
            return item
          })
        } else {
          newCar = localCarData.concat(addItem)
        }
      } else {
        newCar = [].concat(addItem)
      }
      console.log('newCar>>>', newCar)

      wx.setStorageSync('userGameCar', newCar)
      wx.showToast({ title: '已加入游戏篮', icon: 'none' });
    // } else {
    //   // 未登录过
    //   wx.showToast({ title: '请点击右上角重新进入小程序登录账号再加入购物车', icon: 'none' });
    // }

  },

  pushToSearchPage(e) {
    // const event = e.currentTarget.dataset
    // console.log(event)
    // let { item } = event
    // // let select_name = item.select-name
    // // console.log(select_name)
    // console.log(item.select)

    // wx.navigateTo({
    //   url: '../search/search?name=' + item.select
    // })
  },

  pushToDeatilPage(e) {
    // const event = e.currentTarget.dataset
    // console.log(event)

    // wx.navigateTo({
    //   url: '../detail/detail?id=' + event.id
    // })
  },
  onShow() {
    this.getTabBar().setData({
      active: 1
    })
  },


})