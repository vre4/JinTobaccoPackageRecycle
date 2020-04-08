function getNowTime() {
  return JSON.stringify(new Date());
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    status: {
      type: Number,
      value: -1
    },
    boxID: {
      type: Number,
      value: -1
    },
    latitude: {
      type: Number,
      value: 35.503815
    },
    longitude: {
      type: Number,
      value: 112.871620
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeBoxStatus: function (event) {
      var that = this;
      wx.showActionSheet({
        itemList: ['未满', '满了'],
        success: function (res) {
          if (!res.cancel) {
            console.log(res)
            console.log(event.target.id)
            console.log(res.tapIndex)
            console.log(getNowTime())
            that.setData({
              status: res.tapIndex
            })
            const db = wx.cloud.database()
            wx.cloud.callFunction({
              // 需调用的云函数名
              name: 'updateBoxStatus',
              // 传给云函数的参数
              data: {
                box_id: event.target.id,
                status: res.tapIndex,
                date: getNowTime()
              },
              success: res => {
                wx.showToast({
                  title: '箱子状态更改',
                  icon: 'success',
                  mask: false
                });
              }
            })

          }
        }
      });
    }
  }
})