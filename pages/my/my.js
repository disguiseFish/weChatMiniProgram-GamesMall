import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast.js';
const db = wx.cloud.database();
const _ = db.command
// const orderDB = db.collection('order')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
 

  // 跳转至订单列表页面点击事件
  pushToOrderList(event) {
    wx.navigateTo({
      // url: '../orderList/orderList?type=' + type,
      url: '../orderList/orderList',
    })
    // if (wx.getStorageSync('storage_user_info')) {
    //   wx.navigateTo({
    //     // url: '../orderList/orderList?type=' + type,
    //     url: '../orderList/orderList',
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '../login/login',
    //   })
    // }
  },

  // 跳转至地址管理点击事件
  pushToAddress() {
    if (wx.getStorageSync('storage_user_info')) {
      wx.navigateTo({
        url: '../address/address?from=' + 'my',
      })
    } else{
      wx.navigateTo({
        url: '../login/login',
      })
    }


  },
  onLoad: function (options) {
    console.log('1', wx.getStorageSync('storage_user_info'))
    if (wx.getUserProfile) {
      console.log('2', wx.getStorageSync('storage_user_info'))
      this.setData({
        canIUseGetUserProfile: true,
        userInfo: wx.getStorageSync('storage_user_info') ? wx.getStorageSync('storage_user_info') : {},
        hasUserInfo: wx.getStorageSync('storage_user_info') ? true : false
      })
    }
    // this.getOpenId();
  },
  onShow() {

    // this.getOpenId();
    // this.getOrderCount();
    this.getTabBar().setData({
      active: 3
    })
  },
  onHide(){
    Toast.clear();
  }
})