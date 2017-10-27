const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    content: '',
    manager: '成为合伙人',
    showPay: true,
    managerFee: 0,
    date: '',
    log:{},
    display: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var phoneNumber = wx.getStorageSync('phoneNumber');
    if (!phoneNumber || !app.globalData.userInfo) {
      wx.reLaunch({
        url: '../login/login'
      })
    }

    var pars = {};
    pars.openid = wx.getStorageSync('openid');
    app.globalData.loading(true);
    wx.request({
      url: app.globalData.app + 'user/getConfig',
      method: 'post',
      data: pars,
      header: {'content-type': 'application/json'},
      success: function(res){
        app.globalData.loading(false);
        var WxParse = require('../../wxParse/wxParse.js');
        WxParse.wxParse('article', 'html', res.data.content, that,5);
        that.setData({
          content: res.data.content,
          manager: res.data.manager,
          showPay: res.data.showPay,
          managerFee: res.data.managerFee,
          date: res.data.date
        })
        if(!that.data.showPay){
          app.globalData.loading(true);
          wx.request({
            url: app.globalData.app + 'manager/list',
            method: 'get',
            data: pars,
            header: { 'content-type': 'application/json' },
            success: function (res) {
              app.globalData.loading(false);
              that.setData({
                log:res.data
              })
            }
          })
        }
      }
    })
    
  },
  report: function() {
    wx.navigateTo({
      url: '../report/report'
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  withdraw: function() {
    wx.navigateTo({
      url: '../withdraw/withdraw?type=manager'
    })
  },
  showContent: function() {
    wx.navigateTo({
      url: '../content/content'
    })
  },
  showUsers: function() {
    wx.navigateTo({
      url: '../users/users'
    })
  },
  manager: function() {
    var pars = {};
    var openid = wx.getStorageSync('openid');
    pars.fan = app.globalData.userInfo;
    pars.fan.openid = openid;
    app.globalData.loading(true);
    wx.request({
      url: app.globalData.app + 'user/manager',
      method: 'post',
      data: pars,
      header: {'content-type': 'application/json'},
      success: function (res) {
        app.globalData.loading(false);
        if(res.data.status == 'success') {
          var dat = res.data.msg;
          wx.requestPayment({
            'timeStamp': String(dat.timestamp),
            'nonceStr': dat.nonce,
            'package': dat.package,
            'signType': 'MD5',
            'paySign': dat.signature,
            'success':function(msg){
              app.globalData.toast('操作成功');
            },
            'fail':function(msg){
              app.globalData.confirm('错误', '操作失败');
            }
          })
        } else {
          app.globalData.confirm('错误', res.data.msg);
        }
      }
    })
  },
  search:function(res) {
    app.globalData.loading(true);
    var that = this;
    var pars = {};
    pars.date = this.data.date;
    pars.ss = 1;
    pars.openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.app + 'manager/list',
      method: 'get',
      data: pars,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        app.globalData.loading(false);
        that.setData({
          log: res.data
        })
      }
    })
  },
  check:function(res){
    if (res.detail.value == true){
      this.setData({
        display:false
      })
    }else{
      this.setData({
        display: true
      })
    }
  }
})