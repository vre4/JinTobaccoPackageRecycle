// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const count = await db.collection('box_info').where({
    boxID: event.box_id
  }).count();

  if (count.total === 0) {
    console.log("要新增箱子");
    return await db.collection('box_info').add({
      data: {
        user: event.user_name,
        openID: event.open_id,
        boxID: event.box_id,
        latitude: event.latitude,
        status: 0,
        longitude: event.longitude,
        create_time: event.date
      }
    })
  } else if (count.total === 1) {
    console.log("要更新箱子");
    return await db.collection('box_info').where({
      boxID: event.box_id
    }).update({
      data: {
        unix_time: event.unix_time,
        latitude: event.latitude,
        status: 0,
        longitude: event.longitude,
        update_time: event.date
      }
    })
  } else {
    console.log("查找箱子条数异常");
  }
}