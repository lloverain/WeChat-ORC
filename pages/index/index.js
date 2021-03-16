// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    show: true,
    code: 'test',
    json: '',
    userInfo: '',
    qRCodeMsg: '', //订单号完整
    tiaoma: '', //订单后6位
    ImageUrl: '', //扫描图片后的url
    Number: 0,
    count: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo') ////判断小程序的API，回调，参数，组件等是否在当前版本可用
  },
  //循环扫码录入
  getId: function () {
    console.log(this.data.count + '---------' + this.data.Number)
    if (this.data.count < this.data.Number) {
      var that = this;
      wx.showActionSheet({
        itemList: ['扫码', '上传'], //显示的列表项
        success: function (res) { //res.tapIndex点击的列表项
          if (res.tapIndex == 0) {
            wx.scanCode({ //扫描API
              success: function (res) {
                that.setData({
                  ImageUrl: res.result
                })
                wx.showModal({
                  title: '扫码返回内容',
                  content: res.result,
                  showCancel: true, //是否显示取消按钮
                  cancelText: "取消", //默认是“取消”
                  // cancelColor: 'skyblue', //取消文字的颜色
                  confirmText: "上传", //默认是“确定”
                  // confirmColor: 'skyblue', //确定文字的颜色
                  success(res) {
                    if (res.confirm) {
                      that.upText()
                    } else if (res.cancel) {
                      wx.showToast({
                        title: '取消',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            })
          } else {
            that.chooseImageTap()
            // wx.showToast({
            //   title: '上传',
            //   icon: 'success',
            //   duration: 1000
            // })
          }
        },
        fail: function (res) {

        },
        complete: function (res) {

        }
      })

      // wx.showModal({
      //   title: '请选择',
      //   content: '请选择上传方法',
      //   showCancel: true,//是否显示取消按钮
      //   cancelText:"上传",//默认是“取消”
      //   cancelColor:'skyblue',//取消文字的颜色
      //   confirmText:"扫码",//默认是“确定”
      //   confirmColor: 'skyblue',//确定文字的颜色
      //   success (res) {
      //     if (res.confirm) {

      //     } else if (res.cancel) {

      //     }
      //   }
      // })

    } else {
      wx.showToast({
        title: '扫描已完成！',
        icon: 'success',
        duration: 2000
      })
    }
  },
  //扫描订单
  getQRCode: function () {
    var _this = this;
    wx.scanCode({ //扫描API
      success: function (res) {
        _this.setData({
          qRCodeMsg: res.result,
          tiaoma: res.result
        });
        _this.getShop();
      }
    })
  },

  getShop() {
    var that = this
    wx.request({
      url: "https://sckxyy.cn1.utools.club/count",
      method: "POST",
      data: {
        id: that.data.qRCodeMsg
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.setData({
          count: res.data
        })
      },
    })

    wx.request({
      url: "https://sckxyy.cn1.utools.club/showShop",
      method: "POST",
      data: {
        data: that.data.qRCodeMsg
        // data:'661053'
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 200 && res.statusCode == 200) {
          if (res.data.data.length > 0) {
            that.setData({
              json: res.data.data,
              qRCodeMsg: res.data.data[0].djbh,
              Number: res.data.data.length,
              show: false
            });
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '没查询到该订单商品',
              icon: 'success',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: '网络错误！',
            icon: 'error',
            duration: 2000
          })
        }
      },
      fail:function(res){
        wx.showToast({
          title: '网络错误！',
          icon: 'error',
          duration: 2000
        })
      },
      complete:function(){
        wx.request({
          url: "https://sckxyy.cn1.utools.club/count",
          method: "POST",
          data: {
            id: that.data.tiaoma
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            that.setData({
              count: res.data
            })
          },
        })
      }

    })
  },

  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {

  },
  getCode() {
    wx.login({
      success: res => {
        var that = this
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.errMsg == 'login:ok') {
          wx.request({
            // 请求地址（必须基于https协议）
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code',
            // 发送到服务器的数据
            datatype: 'json',
            data: {
              appid: 'wx17f98792cede59c3',
              secret: '164d65a2676cbe8cf124b01a8c55b5c5',
              js_code: res.code,
              grant_type: 'authorization_code'
            },
            // 成功之后的回调函数
            success: function (result) {
              that.setData({
                code: result.data.openid
              })
            },
            fail: function (error) {
              that.setData({
                code: error
              })
            }
          })
        } else {
          that.setData({
            code: res
          })
        }
      }
    })


    // this.setData({
    //   code:app.globalData.code
    // })
  },

  //添加上传图片
  chooseImageTap: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#00000",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  // 图片本地路径
  chooseWxImage: function (type) {
    var that = this;
    var imgsPaths = that.data.imgs;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        // for(var i=0;i<res.tempFilePaths.length;i++){
        //   console.log(res.tempFilePaths[i])
        // }
        that.upImgs(res.tempFilePaths[0], 0) //调用上传方法
      }
    })
  },
  //图片上传服务器
  upImgs: function (imgurl, index) {
    var that = this;
    wx.uploadFile({
      url: 'https://sckxyy.cn1.utools.club/UploadImgae', //
      filePath: imgurl,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        orderNum: this.data.qRCodeMsg,
        tiaoma: that.data.tiaoma
      },
      success: function (res) {
        var data = JSON.parse(res.data);
        if (data.code == 200) {
          that.setData({
            count: that.data.count + 1
          })
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'error',
            duration: 1000
          })
        }
        // var data = JSON.parse(res.data)
        //   that.data.picPaths.push(data['msg'])
        //   that.setData({
        //     picPaths: that.data.picPaths
        //   })
        //   console.log(that.data.picPaths)
      }
    })
  },

  upText: function () {
    var that = this;
    var data = {
      orderNum: that.data.qRCodeMsg,
      tiaoma: that.data.tiaoma,
      ImageUrl: that.data.ImageUrl
    };
    wx.request({
      url: 'https://sckxyy.cn1.utools.club/uploadText',
      data: JSON.stringify(data),
      method: 'POST',
      success: function (res) {
        var data =res.data;
        if (data.code == 200) {
          that.setData({
            count: that.data.count + 1
          })
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'error',
            duration: 1000
          })
        }
      },
      fail:function(res){
        wx.showToast({
          title: '网络错误！',
          icon: 'error',
          duration: 2000
        })
      },
      complete:function(){
        console.log("123123")
        wx.request({
          url: "https://sckxyy.cn1.utools.club/count",
          method: "POST",
          data: {
            id: that.data.tiaoma
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            that.setData({
              count: res.data
            })
          },
        })
      }

    })
  },

  goshowImgae: function () {
    wx.navigateTo({
      url: '/pages/showImage/showImage?id=' + this.data.tiaoma,
    })
  },

  //清除
  clean:function(){
      this.setData({
        show: true,
        code: 'test',
        json: '',
        userInfo: '',
        qRCodeMsg: '', //订单号完整
        tiaoma: '', //订单后6位
        ImageUrl: '', //扫描图片后的url
        Number: 0,
        count: 0,
      })
  }

})
