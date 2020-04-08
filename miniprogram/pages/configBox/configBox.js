// pages/databaseGuide/databaseGuide.js

const app = getApp()

function getNowTime() {
  return JSON.stringify(new Date());
}

Page({

  data: {
    boxID: '',
    step: 1,
    counterId: '',
    openid: '',
    disabled: false,
    count: null,
    latitude: 0,
    longitude: 0,
    queryResult: '',
  },
  // showLoading: function (message) {
  //   if(wx.showLoading) {
  //     // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
  //     wx.showLoading({
  //       title: message,
  //       mask: true
  //     });
  //   } else {
  //     // 低版本采用Toast兼容处理并将时间设为20秒以免自动消失
  //     wx.showToast({
  //       title: message,
  //       icon: 'loading',
  //       mask: true,
  //       duration: 20000
  //     });
  //   }
  // },
  // hideLoading: function () {
  //   if (wx.hideLoading) {
  //     // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
  //     wx.hideLoading();
  //   } else {
  //     wx.hideToast();
  //   }
  // },
  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },

  scanCode: function () {
    wx.scanCode({
      success: (res) => {
        onlyFromCamera: true;
        var boxID = res.result;
        var scanType = res.scanType;
        var charSet = res.charSet;
        console.log("扫码信息获取成功");
        console.log(res);
        this.setData({
          boxID: boxID,
          scanType: scanType,
          charSet: charSet
        })
      }
    })
  },

  searchBoxIfHaveLocation: function () {
    const db = wx.cloud.database()
    db.collection('box_info').where({
      boxID: this.data.boxID
    }).count({
      success(res) {
        console.log(res.total)
        this.setData({
          query_num: res.total
        })
      }
    })

  },

  // addBoxLocation: function() {
  //   const db = wx.cloud.database()
  //   db.collection('box_info').add({
  //     data: {
  //       user: app.globalData.nickName,
  //       openID: app.globalData.openid,
  //       boxID: this.data.boxID,
  //       location: new db.Geo.Point(this.data.longitude, this.data.latitude),
  //       date: getNowTime()
  //     },
  //     success: res => {
  //       // 在返回结果中会包含新创建的记录的 _id
  //       this.setData({
  //         counterId: res._id,
  //       })
  //       wx.showToast({
  //         title: '新增记录成功',
  //       })
  //       console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
  //     },
  //     fail: err => {
  //       wx.showToast({
  //         icon: 'none',
  //         title: '新增记录失败'
  //       })
  //       console.error('[数据库] [新增记录] 失败：', err)
  //     }
  //   })
  // },
  // updateBoxLocation: function() {
  //   cosole
  //   console.log("要更新箱子");
  //   wx.cloud.callFunction({
  //     // 需调用的云函数名
  //     name: 'update',
  //     // 传给云函数的参数
  //     data: {
  //       box_id: this.data.boxID,
  //       location: new db.Geo.Point(this.data.longitude, this.data.latitude),
  //       unix_time: (new Date()).getTime(),
  //       date: getNowTime()
  //     },
  //     success: res => {
  //       wx.showToast({
  //         title: '箱子与地址绑定成功',
  //         duration: 4000
  //       })
  //     }
  //   })
  // },
  updateBoxInfo: function () {
    const db = wx.cloud.database()
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'insertOrUpdateBoxInfo',
      // 传给云函数的参数
      data: {
        user_name: app.globalData.nickName,
        open_id: app.globalData.openid,
        box_id: this.data.boxID,
        longitude: this.data.longitude,
        latitude: this.data.latitude,
        unix_time: (new Date()).getTime(),
        date: getNowTime()
      },
      success: res => {
        wx.showToast({
          title: '箱子绑定成功',
          duration: 4000
        })
      }
    })
  },
  getLocation: function () {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log(res);
        var latitude = res.latitude;
        var longitude = res.longitude;
        this.setData({
          latitude: latitude,
          longitude: longitude
        })
      }
    })
  },

  nextStep: function () {
    // 在第一步，需检查是否有 openid，如无需获取
    if (this.data.step === 1 && !this.data.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          this.setData({
            step: 2,
            disabled: false,
            openid: res.result.openid
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败',
          })
          console.log('请检查云函数，错误信息：', err)
        }
      })
    } else {
      const callback = this.data.step !== 6 ? function () { } : function () {
        console.group('数据库文档')
        console.groupEnd()
      }

      this.setData({
        step: this.data.step + 1
      }, callback)
    }
  },
  gotoFour: function () {
    this.setData({
      step: 4
    })
  },
  prevStep: function () {
    this.setData({
      step: this.data.step - 1
    })
  },

  goHome: function () {
    const pages = getCurrentPages()
    if (pages.length === 2) {
      wx.navigateBack()
    } else if (pages.length === 1) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  }

})