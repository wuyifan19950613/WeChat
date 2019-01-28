// pages/details/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    map_data: {},
    commlist: [],
    model: '',
    examine: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('examine'))
    var num_id = options.num_id;
    // var num_id = "549977766802";
    var that = this;
    app.request({
      url: '/api/taobao/materialOptional?pageSize=30&pageNum=1&searchName=https://item.taobao.com/item.htm?id=' + num_id,
      success: function(res){
        var map_data = res.data.msg.result_list.map_data[0];
        that.setData({
          map_data: map_data,
          examine: wx.getStorageSync('examine')
        });
        console.log(map_data)
        wx.setNavigationBarTitle({
          title: map_data.title,
        })
        app.request({
          url: '/api/taobao/pwdCreate',
          data: {
            title: map_data.title,
            url: 'https:' + (map_data.coupon_share_url ? map_data.coupon_share_url : map_data.url),
            logo: map_data.pict_url
          },
          success: function(msg){
            that.setData({
              model: msg.data.msg.data.model
            })
          }
        })
      }
    });
    app.request({
      url: '/api/taobao/recommend?num_iid=' + num_id,
      success: function(res){
        if (res.data.data.results) {
          var commlist = res.data.data.results.n_tbk_item;
          that.setData({
            commlist: commlist,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  copyCode: function() {
    var model = this.data.model;
    wx.setClipboardData({
      data: model,
      success(res) {
        wx.showToast({
          title: '复制成功，请打开手机淘宝',
          icon:'none',
          duration: 2000
        })
      }
    })
  },
  formSubmit: function(e){
    var formId = e.detail.formId;
    var model = this.data.model;
    var examine = this.data.examine;
    var userOpenId = wx.getStorageSync('user').openid;
    wx.setClipboardData({
      data: model,
      success(res) {
        wx.showToast({
          title: examine == true ? '复制成功，请打开手机掏宝': '复制成功，请打开拼多多',
          icon: 'none',
          duration: 2000
        });
        app.request({
          // url: '/api/applet/modifyFormId?FormId=' + formId,
          url: '/api/applet/modifyFormId',
          method: 'post',
          data: JSON.stringify({
            formId: formId,
            openid: userOpenId,
          }),
          success: function(res){
            console.log(res);
          }
        })
      }
    });
  }
})