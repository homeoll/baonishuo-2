// pages/tixian/tixian.js
const app = getApp()
Page({

  /**data.fee
   * 页面的初始数据
   */
  data: {
    fee: '',
    tixian: '',
    type: '',
    manager: '成为合伙人'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    this.data.type = options.type;
    var phoneNumber = wx.getStorageSync('phoneNumber');
    if (!phoneNumber || !app.globalData.userInfo) {
      wx.reLaunch({
        url: '../login/login'
      })
    }
    var that = this;
    var pars = {};
    pars.openid = wx.getStorageSync('openid');
    pars.type = that.data.type;
    app.globalData.loading(true);
    wx.request({
      url: app.globalData.app + 'user/getwithdraw',
      method: 'get',
      data: pars,
      header: {'content-type': 'application/json'},
      success: function (res) { 
        app.globalData.loading(false);
        if(res) {
          that.setData({
            fee: res.data.fee,
            manager: res.data.manager
          })
        } else {
          app.globalData.confirm('错误', res.data);
        }
      }
    })
  },
  goAll:function(){
    this.setData({
      tixian:this.data.fee,
    })
  },
  withdraw:function(){
    var that = this;
    var pars = {};
    pars.openid =wx.getStorageSync('openid');
    pars.fee = this.data.tixian;
    pars.type = that.data.type;
    app.globalData.loading(true);
    if(pars.fee > 0){
      wx.request({
        url: app.globalData.app + 'user/getwithdraw',
        method: 'post',
        data: pars,
        header: {'content-type': 'application/json'},
        success: function (res) {
          app.globalData.loading(false);
          if(res.data == 'ok') {
            app.globalData.confirm('包口令提现提醒','提现成功');
            that.onLoad();
          } else if(res.data == 'okMessage') {
            app.globalData.confirm('包口令提现提醒','提现成功,等待后台审核');
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1000);
          } else  {
            app.globalData.confirm('错误',res.data);
            that.onLoad();
          }
        },
        fail:function() {
          app.globalData.loading(false);
        }
      })
    }else{
      app.globalData.loading(false);
      app.globalData.confirm('错误','金额错误');
    }
  },
  checkmoney:function(evt){
    var e = evt.detail.value;
    var num = parseFloat(e);
    var fee = this.data.fee;
    if (fee == undefined){
      fee = 0
    }
    if(num > fee) {
      e = fee;
    }
    if(num < 0){
      e = 1;
    }
    var len = e.toString().split(".")[1];
    if(len){
      if(len.length > 2) {
        e = Math.floor(e * 100) / 100;
      }
    }
    this.setData({
      tixian: e
    });
    return e;
  },
  goquestion:function() {
    wx.navigateTo({
      url: "../question/question"
    })
  },
  gojubao:function() {
    wx.navigateTo({
      url: "../report/report"
    })
  },
  manager:function() {
    if(this.data.type == 'manager') {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateTo({
        url: "../manager/manager"
      })
    }
  }
})