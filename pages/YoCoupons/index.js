// pages/YoCoupons/index.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      banner: [],
      modle: false,
      baseModel:'',
      search_value: '',
      typeNav: [{
        imgUrl:'http://www.xiaohuanzi.cn/images/woman.png',
        name: '女装'
      },{
        imgUrl: 'http://www.xiaohuanzi.cn/images/man.png',
        name: '男装'        
      },{
        imgUrl: 'http://www.xiaohuanzi.cn/images/neiyi.png',
        name: '内衣'
      },{
        imgUrl: 'http://www.xiaohuanzi.cn/images/muying.png',
        name: '母婴'
      }, {
        imgUrl: 'http://www.xiaohuanzi.cn/images/riyong.png',
        name: '日用'
      }, {
        imgUrl: '',
        name: '潮流范'
      }, {
        imgUrl: 'http://www.xiaohuanzi.cn/images/meishi.png',
        name: '食品'
      }, {
        imgUrl: 'http://www.xiaohuanzi.cn/images/meizhuang.png',
        name: '美妆个护'
      }, {
        imgUrl: 'http://www.xiaohuanzi.cn/images/shuma.png',
        name: '数码加电'
      }, {
        imgUrl: 'http://www.xiaohuanzi.cn/images/xiezi.png',
        name: '鞋包配饰'
      }],
      nav_list: [],
      navOnclick: 0,
      navTransformLeft:0,
      client:{
        clientX: 0,
        clientY: 0,
      },
      duration: 0,
      map_data: [],
      pageNum: 1,
      material_id: '',
      alertXml: {},
      fiexd: false,
      examine: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var that = this;
      app.request({
        url: '/api/getIndexBanner',
        success: function(res) {
          that.setData({
            banner: res.data.data,
          })
        }
      });
      app.request({
        url: '/api/getNavigation',
        success: function (res) {
          that.setData({
            nav_list: res.data.data,
            material_id: res.data.data[0].navId,
            examine: wx.getStorageSync('examine')
          });
          setTimeout(function(){
            that.getBabyList(1, res.data.data[0].navId);
          },1000)
        }
      });
      
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    onPageScroll:function(e){
      var that = this;
      if (e.scrollTop >= 200) {
        that.setData({
          fiexd: true,
        })
      } else{
        that.setData({
          fiexd: false,
        })
      }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      var that = this;
      app.monitor(function (cb) {
        that.setData({
          alertXml: cb,
          modle: true
        })
      });
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },
    onReachBottom: function () {
      var material_id = this.data.material_id;
      var pageNum = this.data.pageNum;
      pageNum ++;
      this.setData({
        pageNum: pageNum,
      });
      this.getBabyList(pageNum, material_id);
    },
    navClick: function (e) {
      var that = this;
      var index = e.target.dataset.num;
      var id = e.target.dataset.id;
      this.setData({
        navOnclick: index,
        duration: 500,
        material_id: id,
        map_data: [],
      });
      this.query('.list.active', function(res){
        var halfSlideWidth = res[0].width / 2;
        var slideLeft = e.target.offsetLeft;
        var slideCenter = slideLeft + halfSlideWidth;
        that.query('.nav-wrapper', function (res1){
          var maxWidth = res1[0].width;
          var swiperWidth = wx.getSystemInfoSync().windowWidth;
          if (slideCenter < swiperWidth / 2) {
            that.setData({
              navTransformLeft: 0,
            })
          } else if (slideCenter > (maxWidth + swiperWidth / 2)) {
            that.setData({
              navTransformLeft: -maxWidth + 1,
            })
          } else {
            var nowTlanslate = slideCenter - swiperWidth / 2;
            that.setData({
              navTransformLeft: -nowTlanslate,
            })
          }
          that.getBabyList(1, id);
        })
      })
    },
    query: function(dome, cb) {
      var query = wx.createSelectorQuery();
      query.select(dome).boundingClientRect();
      query.exec((res) => {
        if (cb) {
          cb(res);
        }
      })
    },
    getBabyList: function (pageNum, id) {
      var that = this;
      var pid = wx.getStorageSync('user').pid;
      app.request({
        url: '/api/taobao/optimusMaterial?pageNum=' + pageNum + '&pageSize=30&material_id=' + id + '&pid=' + pid,
        success: function (msg) {
          if (msg.data.msg.result_list) {
            var mp_data = that.data.map_data;
            for (var i = 0; i < msg.data.msg.result_list.map_data.length; i++) {
              mp_data.push(msg.data.msg.result_list.map_data[i]);
            }
            that.setData({
              map_data: mp_data
            });
          }
        }
      })
    },
    close: function(){
      this.setData({
        modle: false,
      });
    },
    search: function(){
      wx.navigateTo({
        url: '../searchlist/index?value=' + this.data.search_value,
      })
    },
    search_input: function(e){
      var value = e.detail.value;
      this.setData({
        search_value: value
      })
    },
    // navMove: function(e){
    //   var nx = e.touches[0].clientX;
    //   var x = this.data.client.clientX;
    //   var l = this.data.client.offsetLeft;
    //   var nl = nx - (x - l);
    //   console.log(nl)
    //   this.setData({
    //     navTransformLeft: nx - l,
    //   })
    // },
    // navStart:function(e) {
    //   this.setData({
    //     duration: 0,
    //     client:{
    //       clientX: e.touches[0].clientX,
    //       clientY: e.touches[0].clientY,
    //       offsetLeft: e.target.offsetLeft,
    //     }
    //   })
    // },
})