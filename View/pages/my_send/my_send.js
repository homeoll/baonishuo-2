//index.js  
//获取应用实例  
var app = getApp();
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight:0,
    // tab切换  
    currentTab: 0,
    outCountPrice:0,
    outCountNumber:0,
    inCountPrice:0,
    inCountNumber:0,
    outList:{},
    inList:{}
  },
  onLoad: function () {
    var phoneNumber = wx.getStorageSync('phoneNumber');
    if (!phoneNumber || !app.globalData.userInfo) {
      wx.reLaunch({
        url: '../login/login'
      })
    }
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
    var that = this;
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    var pars = {};
    pars.openid = wx.getStorageSync('openid');//测试
    app.globalData.loading(true);
    wx.request({
      url: app.globalData.app + 'user/mylist',
      method: 'post',
      data: pars,
      header: {'content-type': 'application/json'},
      success: function (res) {
        app.globalData.loading(false);
        if(res) {
          that.setData({
            outCountPrice: res.data.outCountPrice,
            outCountNumber: res.data.outCountNumber,
            inCountPrice: res.data.inCountPrice,
            inCountNumber: res.data.inCountNumber,
            outList:res.data.outList,
            inList:res.data.inList
          })
        } else {
          app.globalData.confirm('错误', res.data);
        }
      }
    })
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  gored:function(evt){
    var id = evt.currentTarget.dataset.redid;
    wx.navigateTo({
      url:"../my_list/my_list?redid="+id
    })
  },
  goquestion: function () {
    wx.navigateTo({
      url: "../question/question"
    })
  }
})  