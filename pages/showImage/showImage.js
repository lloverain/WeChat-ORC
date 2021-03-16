// pages/showImage/showImage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      requestUrl:"https://sckxyy.cn1.utools.club",
      url:'https://www.arma3.vip/rain/',
      json:[],
      id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      this.getImgaes()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  getImgaes:function(){
    var that = this
      wx.request({
      url : that.data.requestUrl+"/scanRecord",
      method: "POST",
      data: {
        id : that.data.id
        // data:'661053'
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data)
        console.log(res.data.data.length)
          if(res.data.code==200 && res.statusCode==200){
            if(res.data.data.length>0 && res.data.data!='无数据'){
              let imgaes = []
              var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
			        var objExp=new RegExp(Expression);
              for(let i=0;i<res.data.data.length;i++){
                var url = res.data.data[i].imgUrl;
                if(objExp.test(url)){
                  imgaes.push(url)
                }else{
                  imgaes.push(that.data.url + url)
                }
              }
              that.setData({
                json: imgaes
              });
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })
            }else{
              wx.showToast({
                title: '无记录',
                icon: 'success',
                duration: 2000,
                success:function(){
                  setTimeout(function(){
                    wx.navigateBack({ changed: true });
                  },2000)
                }
              })
            }
          }else{
            wx.showToast({
              title: '网络错误！',
              icon: 'error',
              duration: 2000
            })
          }
      },
    })
  },


  //预览图片，放大预览
  preview(event) {
    var that = this
    console.log(event.currentTarget.dataset.src)
    let currentUrl = event.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls:  that.data.json// 需要预览的图片http链接列表
    })
  },

  toPage: function (event) {
    var text = event.currentTarget.dataset.gid
    if(text.substr(0,7)=="http://"){
      wx.setClipboardData({
        //准备复制的数据
        data: event.currentTarget.dataset.gid,
        success: function (res) {
          wx.showToast({
            title: '复制成功,请在游览器打开',
          });
        }
      });
    }else{
      wx.navigateTo({
        url: '/pages/showPage/showPage?url=' + encodeURIComponent(event.currentTarget.dataset.gid),
      })
    }
  },
  
  copy:function(event){
    wx.setClipboardData({
      //准备复制的数据
      data: event.currentTarget.dataset.gid,
      success: function (res) {
        wx.showToast({
          title: '复制成功,请在游览器打开',
        });
      }
    });
  }

})