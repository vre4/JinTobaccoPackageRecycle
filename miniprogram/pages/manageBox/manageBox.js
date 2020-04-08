const app = getApp()
Page({
  onLoad: function () {

    const db = wx.cloud.database()

    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'queryBoxList',
      // 传给云函数的参数
      data: {
        open_id: app.globalData.openid,
      },
      success: res => {
        console.log(res.result.data)
        this.setData({
          goodsArray: res.result.data
        })
      }
    })

  },
  data: {
    goodsArray: [
      {
        title: '箱子测试',
        latitude: '999',
        longitude: '1111112'
      }
    ]
  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  onReady: function (e) {
    this.goodsList = this.selectComponent("#goodsList");
  }
})