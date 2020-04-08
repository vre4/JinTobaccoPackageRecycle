// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('box_info').where({
    openID: event.open_id
  }).get({
    success: res => {
      console.log('[数据库] [查询记录] 成功: ', res)
    },
    fail: err => {
      console.error('[数据库] [查询记录] 失败：', err)
    }
  })
}