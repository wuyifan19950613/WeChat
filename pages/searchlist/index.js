// pages/searchlist/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    map_data: [],
    pageNum: 1,
    value: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var value = options.value;
    wx.setNavigationBarTitle({
      title: value,
    })
    var that =this;
    this.setData({
      value: value,
    })
    that.getSearchList(value, this.data.pageNum)
  },
  getSearchList: function (value, pageNum){
    var that = this;
    app.request({
      url: '/api/taobao/materialOptional?searchName=' + value + '&pageSize=30&pageNum=' + pageNum,
      success: function (res) {
        console.log(res);
        if (res.data.msg.result_list) {
          var map_data = that.data.map_data
          for (var i = 0; i < res.data.msg.result_list.map_data.length; i++) {
            map_data.push(res.data.msg.result_list.map_data[i]);
          }
          that.setData({
            map_data: map_data,
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
  onReachBottom: function (e) {
    var pageNum = this.data.pageNum;
    var value = this.data.value
    pageNum++;
    this.getSearchList(value, pageNum)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})