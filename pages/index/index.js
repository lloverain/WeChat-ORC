// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
   code:'test',
    canIUse: wx.canIUse('button.open-type.getUserInfo') ////判断小程序的API，回调，参数，组件等是否在当前版本可用
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    // if (app.globalData.code=='') {
    //     this.code = '123'
    // }
  },
  getUserInfo() {
    console.log(this.data.code)
    this.data.code = '123'
    console.log(this.data.code)
  }
})
