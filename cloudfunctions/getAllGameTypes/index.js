// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数  -- 已弃用
exports.main = async (event, context) => {
  console.log('查找游戏类型')
  const wxContext = cloud.getWXContext()
  let res = await db.collection('game_types').get()
  return {
    event,
    res: res,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}