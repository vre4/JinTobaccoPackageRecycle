// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log("updateBoxStatus")
  console.log(event.box_id)
  console.log(event.status)

  return await db.collection('box_info').where({
    boxID: event.box_id
  }).update({
    data: {
      status: event.status,
      update_time: event.date
    }
  })


  // db.collection('box_info').where({
  //   boxID: event.box_id
  // }).update({
  //   data: {
  //     unix_time: event.unix_time,
  //     location: event.location,
  //     date: event.date
  //   }
  // })

  // return await db.collection('box_location').add({
  //   data: {
  //     unix_time: event.unix_time,
  //     location: event.location,
  //     date: event.date
  //   }
  // })

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}