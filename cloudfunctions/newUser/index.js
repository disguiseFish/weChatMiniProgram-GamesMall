// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event) => {
  console.log('加入>>>>>', event)
  const wxContext = cloud.getWXContext()
  let res = await db.collection('user_list').add({data:event})
  return {
    event,
    res: res,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}