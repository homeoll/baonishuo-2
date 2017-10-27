// pages/zhuanfa/zhuanfa.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagesrc:'',
    redid:'',
    openid:''
  },

  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    app.globalData.loading(true);
    var phoneNumber = wx.getStorageSync('phoneNumber');
    if (!phoneNumber || !app.globalData.userInfo) {
      wx.navigateTo({
        url: '../login/login'
      })
    }
    
    
    this.setData({
      imagesrc:app.globalData.app + 'share/share&redid='+options.redid+'&openid='+options.openid,
      redid:options.redid,
      openid:options.openid
    });
  },

  
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '包你说,福利福利福利领红包',
      path: '/pages/my_list/my_list?redid='+that.data.redid +'&openid='+that.data.openid,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  yulan:function() {
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [this.data.imagesrc] // 需要预览的图片http链接列表
    })
  },
  golast:function() {
    wx.navigateBack({
      delta: 1
    })
  },
  img_suc:function() {
    app.globalData.loading(false);
  }
})