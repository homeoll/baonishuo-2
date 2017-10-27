const app = getApp()
Page({

  /**
   * 页面的初始数据
   */

  data: {
    log: {}
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
    wx.request({
      url: app.globalData.app + 'manager/userlist',
      method: 'get',
      data: pars,
      header: { 'content-type': 'application/json' },
      success: function (res){
        app.globalData.loading(false);
        console.log(res);
        that.setData({
          log: res.data
        })
      }
    })
  }
})