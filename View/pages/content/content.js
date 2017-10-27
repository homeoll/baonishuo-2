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
})