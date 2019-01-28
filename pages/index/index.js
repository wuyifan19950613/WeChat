//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    formId: '',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  formSubmit: function(e){
    console.log(e.detail.formId);
    this.setData({
      formId: e.detail.formId
    })
    app.request({
      url: '/api/applet/access_token',
      success: function(res){
        wx.setStorageSync('access_token', res.data.data);
      }
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  fasong: function(){
    var that = this;
    var postData = {
      access_token: wx.getStorageSync('access_token').access_token,
      touser: 'oTQIP0St2MlTeVdlBLBFLoZWKfvs',
      template_id: 'p8CerHYRgg4k3bfBlh63d0IS1YFUSBaFKHbAgbWowIw',
      page: 'pages/YoCoupons/index',
      form_id: that.data.formId,
      data: {
        keyword1: {
          value: "339208499"
        },
        keyword2: {
          value: "2015年01月05日 12:30"
        },
        keyword3: {
          value: "腾讯微信总部"
        },
      },
    }
    console.log(postData)
    app.request({
      url: '/api/applet/sendTemplateMessage',
      data: JSON.stringify(postData),
      method:'post',
      success: function(res){

      }
    })
  },
})
