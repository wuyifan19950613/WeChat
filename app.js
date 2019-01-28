//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    var user = wx.getStorageSync('user') || {};
    console.log(user)
    if (!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          var global = that.globalData;
          that.request({
            url: `/api/applet/userinfo?appid=${global.appid}&secret=${global.secret}&code=${res.code}`,
            success: function(res){
              wx.setStorageSync('user', { pid: res.data.data.pid, openid: res.data.data.openid, expires_in: Date.now() + res.data.data.expires_in});
            }
          })
        }
      })
    }
    // 登录
    that.request({
      url: '/api/applet/examine',
      success:function(res){
        wx.setStorageSync('examine', res.data.data);
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

    // 网络请求封装
  request: function (obj) {
      // obj = {
      //   url: '';
      //   method: 'GET',
      //   dataType: 'json',
      //   data: {},
      //   success: function() {},
      //   fail: function() {},
      //   errorMore: function() {}, // 登录密码错三次
      // }

      let token = '';

      wx.request({
          url: this.globalData.baseUrl + obj.url,
          method: obj.method || 'GET',
          data: obj.data || {},
          header: {
              token: token,
          },
          success: function (res) {
              if (obj.success) obj.success(res);
          },
          fail: function (res) {
              console.log('接口失败');
          },
      });
  },
  globalData: {
    userInfo: null,
    baseUrl: 'http://192.168.80.16:3000',
    // baseUrl: 'https://api.xiaohuanzi.cn',
    appid: 'wxe8a6c0f7f936eb6c',
    secret: '4b2c8c306af08641cc760bc21cc8929b',
  },
  monitor: function (cb){
    var that = this;
    wx.getClipboardData({
      success(res) {
        var data = res.data;
        that.request({
          url: '/api/smallProgram',
          data: {
            text: data,
          },
          success: function(res){
            if (res.data.code == 200) {
              var id = res.data.message.id;
              const value = wx.getStorageSync('id');
              if (value == '' || value != id) {
                wx.setStorageSync('id', id);
                that.request({
                  url: '/api/taobao/materialOptional?pageSize=30&pageNum=1&searchName=https://item.taobao.com/item.htm?id=' + id + '&pid=' + (wx.getStorageSync('user').pid),
                  success: function (msg) {
                    if (msg.data.msg.result_list) {
                      cb(msg.data.msg.result_list.map_data[0]);
                    }
                  }
                })
              }
            }
          }
        })
      }
    })
  }
})