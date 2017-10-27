// pages/jubao/jubao.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reasons: [],
    phone:'',
    weixin:'',
    msg:{},
    report_id:'',
    ooo:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var phoneNumber = wx.getStorageSync('phoneNumber');
    if (!phoneNumber || !app.globalData.userInfo) {
      wx.reLaunch({
        url: '../login/login'
      })
    }
    var that = this;
    app.globalData.loading(true);
    wx.request({
      url: app.globalData.app + 'user/report',
      data: {},
      method: 'get',
      header: {'content-type' : 'application/json'},
      success: function(msg) {
        app.globalData.loading(false);
        that.setData({
          msg:msg,
        })
      }
    })
  },
  checkmsg:function(res) {
    this.setData({
      report_id:res.currentTarget.dataset.order,
    })
  },
  tophone:function(res) {
    this.setData({
      phone:res.detail.value,
    })
  },
  toweixin:function(res) {
    this.setData({
      weixin:res.detail.value,
    })
  },
  report:function(res) {
    var that = this;
    var data = {
      openid:wx.getStorageSync('openid'),
      reason:this.data.report_id,
      weixin:this.data.weixin,
      phone:this.data.phone
    };
    if(this.data.report_id != ''){
      app.globalData.loading(true);
      wx.request({
        url: app.globalData.app + 'user/report',
        data:data,
        method: 'post',
        header: {'content-type' : 'application/json'},
        success: function(res) {
          app.globalData.loading(false);
          if(res.data == 'success'){
            wx.showModal({
              title: '通知',
              content: '举报成功,我们会积极处理!',
              showCancel:false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta:1
                  })
                } 
              }
            })
            that.setData({
              ooo:true,
            })
            
          }else{
            app.globalData.confirm('错误','举报失败，请重试！');
          }
        }
      })
    }else{
      app.globalData.confirm('错误','请选择举报内容');
    }
  }
})