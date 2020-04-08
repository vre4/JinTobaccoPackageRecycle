Page({
  data: {
    markers: [],
    current_box_id: -1,
    current_mark_id: -1,
    current_mark_title: null,
    current_marker_latitude: null,
    current_marker_longtitude: null,
    current_marker_recycle_time: null,
    controls: [{
      id: 1,
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }],
    longitude: 112.853622,
    latitude: 35.515181
  },
  onLoad: function () {
    // wx.getLocation({
    //   type: 'gcj02',
    //   success: (res) => {
    //     console.log("地图定位")
    //     console.log(res);
    //     var latitude = res.latitude;
    //     var longitude = res.longitude;
    //     this.setData({
    //       latitude: latitude,
    //       longitude: longitude
    //     })
    //   }
    // })
    wx.cloud.callFunction({
      name: 'queryMarkerList',
      success: res => {
        console.log("查找所有箱子定位点");
        console.log(res.result.data);
        let dataList = res.result.data;
        let newDataList = [];
        for (let i = 0; i < dataList.length; i++) {
          let icon_path = '/images/box_empty.png'
          if (dataList[i].status === 1) {
            icon_path = '/images/box_full.png'
          }
          newDataList.push({
            id: i,
            iconPath: icon_path,
            latitude: dataList[i].latitude,
            longitude: dataList[i].longitude,
            title: dataList[i].title,
            recycle_time: dataList[i].recycle_time,
            boxID: dataList[i].boxID,
            width: 50,
            height: 50
          })
        }
        console.log(newDataList);
        this.setData({
          markers: newDataList
        })
      }
    })
  },
  regionchange(e) {
    console.log(e.type)
  },
  callouttap: function (e) {
  },
  markertap(e) {
    console.log("现在点击的marker")
    console.log(e)
    let current_mark_id = e.markerId;
    let marker_title = this.data.markers[current_mark_id].title;
    let current_box_id = this.data.markers[current_mark_id].boxID;
    let marker_latitude = this.data.markers[current_mark_id].latitude;
    let marker_longitude = this.data.markers[current_mark_id].longitude;
    let recycle_time = this.data.markers[current_mark_id].recycle_time;
    console.log(current_mark_id)
    console.log(marker_latitude, marker_longitude)
    this.setData({
      current_box_id: current_box_id,
      current_mark_id: current_mark_id,
      current_mark_title: marker_title,
      current_marker_latitude: marker_latitude,
      current_marker_longtitude: marker_longitude,
      current_marker_recycle_time: recycle_time,
    })
  },
  gotoSomeWhere(e) {
    console.log(e)
    wx.openLocation({ //​使用微信内置地图查看位置。
      latitude: this.data.current_marker_latitude, //要去的纬度-地址
      longitude: this.data.current_marker_longtitude, //要去的经度-地址
    })
  },
  gotoRecycle(e) {
    console.log(this.data.current_mark_id)
    console.log(this.data.current_box_id)
    console.log(e)
    console.log(e)
    wx.navigateTo({
      url: "../recycle/recycle?boxID=" + this.data.current_box_id
    });
  },
  controltap(e) {
    console.log(e.controlId)
  }
})