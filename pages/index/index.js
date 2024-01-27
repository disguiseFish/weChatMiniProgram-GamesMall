// index.js
// 获取应用实例
const app = getApp()

const db = wx.cloud.database();
const index_carousel = db.collection('index_carousel')
const goods_info = db.collection('goods_info')
const product_category_json = db.collection('product_category_json')

Page({
  data: {
    search: '',
    cover: [],
    sortData: [],
    activeImage: [],
    goodsList: [],
    page: 0,
    isLoading: false,//正在获取数据
    isBottom: false,//更新完所有数据后，底部提示
    hasMoreData: true,
    dataCount: 0//查找的数据总数
  },

  pushToSearch() {
    wx.navigateTo({
      url: '../../pages/search/search',
    })
  },

  onLoad() {
    // this.getUserInfo()
  },

  // addUser(userData){
  //   console.log('userData>>>', userData)
  //   wx.cloud.callFunction({
  //     name: 'newUser',
  //     data: userData,
  //     success: () => {
  //       wx.showToast({ title: '授权成功', icon: 'none' });
  //     },
  //     fail: (error) => {
  //       wx.showToast({ title: '授权失败', icon: 'none' });
  //     }
  //   })
  // },

  getLogin() {
    // wx.login({
    //   success: (r) => {
    //     let code = r.code //1 拿到登录凭证
    //     if (code) {
    //       // 2 获取用户信息
    //       wx.getUserInfo({
    //         // desc: '用户授权',
    //         success: (res) => {
    //           // 3 获取加密信息
    //           const APPID = 'wx247423fb1baf1b9f'
    //           // const SECRET = '9bacc0348288b1f8c950d6ac3947caed'
    //           const JSCODE = code
    //           wx.request({
    //             url: `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=9bacc0348288b1f8c950d6ac3947caed&js_code=${JSCODE}&grant_type=authorization_code`,
    //             // url: `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${JSCODE}&grant_type=authorization_code`,
    //             success: (openRes) => {
    //               console.log('openid>>', openRes.data.openid)
    //               console.log('session_key>>', openRes.data.session_key)
    //               const userInfo = {
    //                 openid: openRes.data.openid,
    //                 avatarUrl: res.userInfo.avatarUrl,
    //                 nickName: res.userInfo.nickName
    //               }
    //               console.log('授权登录存入storage：', userInfo)
    //               this.setData({
    //                 userInfo
    //               })
    //               wx.setStorageSync('storage_user_info', userInfo)
    //               this.addUser(userInfo)
    //             },
    //             fail: (error) => {
    //               wx.showToast({ title: '授权失败', icon: 'none' });
    //             }
    //           })

    //         }
    //       })
    //     }
    //   }
    // })
  },

  getUserInfo() {
    // console.log('先判断是否登录')
    // 1 先判断是否登录
    // 2  登录的不展示  没登陆的提示登录  并告知不授权的话没法使用功能
    // if (wx.getStorageSync('storage_user_info')) {
    //   console.log('登录过》》》》》', wx.getStorageSync('storage_user_info'))
    // } else {
    //   wx.showModal({
    //     title: '授权登录提示',
    //     content: '是否允许授权,不授权会用不了该小程序的功能哦~',
    //     success: (res) => {
    //       console.log('未登录', res)
    //       if (res.cancel) {

    //       }

    //       if (res.confirm) {
    //         this.getLogin()
    //       }
    //     }
    //   })
    // }
  },

  onShow() {
    this.getTabBar().setData({
      active: 0
    })
  },
  onReachBottom() {
    let { page } = this.data
    this.setData({
      page: ++page
    })
    this.getGoodsData()
  },
  async getIndexCover() {
    let res = await index_carousel.orderBy('sort', 'desc').get()
    let data = res.data
    let { cover, activeImage } = this.data
    console.log('轮播图', res)
    for (let i in data) {
      if (data[i].is_carousel) {
        cover.push(data[i])
      } else if (data[i].is_activity) {
        activeImage.push(data[i])
      }
    }

    this.setData({
      cover: cover,
      activeImage: activeImage
    })
    console.log('轮播图1111', this.data.cover)
    console.log('活动图', this.data.activeImage)
  },

  async getSortData() {
    let res = await product_category_json.get()
    let data = res.data[2].json
    let { sortData } = this.data
    console.log('分类信息', res)
    for (let i in data) {
      if (data[i].name == '男装' || data[i].name == '女装') {
        for (let j in data[i].child) {
          sortData.push(data[i].child[j])
        }

      }
    }
    this.setData({
      sortData: sortData
    })
    console.log('分类信息', this.data.sortData)
  },

  // 跳转至分类页面
  pushToSort(e) {
    const event = e.currentTarget.dataset
    console.log(event)
    let name = event.name
    console.log('选择分类', name)
    wx.navigateTo({
      url: '../search/search?name=' + name
    })
  },

  // 轮播图和活动专区跳转
  bannerClickPush(e) {
    const item = e.currentTarget.dataset.item
    console.log('轮播图信息', item)
    if (item.type == 1 && item.product_id) {
      wx.navigateTo({
        url: '../detail/detail?id=' + item.product_id
      })
    } else if (item.type == 3) {
      wx.navigateTo({
        url: '../search/search?search=' + item.keyword,
      })
    }
  },

  // 获取商品列表数据
  async getGoodsData() {
    const LIMIT = 4
    let { page, goodsList } = this.data

    if (!this.data.hasMoreData || this.data.isLoading) {
      console.log('没有数据了,不在执行后续')
      return;
    }
    this.setData({ isLoading: true })

    let res = await goods_info.limit(LIMIT).skip(page * LIMIT).get()

    console.log('商品列表', res)
    if (page == 0) {
      this.setData({
        goodsList: res.data,
        hasData: true
      })
    } else {
      this.setData({
        goodsList: [...goodsList, ...res.data],
        hasData: true
      })
    }
    if (res.data.length == 0) {
      this.setData({
        isBottom: true,
        hasMoreData: false
      })
    }
    this.setData({ isLoading: false })
  },

  // 跳转至商品详情页
  pushToDetail(event) {
    let eventData = event.currentTarget.dataset;
    console.log('参数', eventData)


    wx.navigateTo({
      url: '../detail/detail?id=' + eventData.id
    })
  }
})
