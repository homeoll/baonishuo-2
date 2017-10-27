const app = getApp()
Page({
  onLoad: function () {
    this.setData({
      hasLogin: app.globalData.hasLogin
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
  },
  data: {
    phone: '',
    code: '',
    selected: true,
    selected1: false,
    second: 10,
    phoneNumber: ''
  },
  phoneInputEvent: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  codeInputEvent: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  getTime: function (that) {
    var second = that.data.second;
    if (second == 0) {
      that.setData({
        selected: true,
        selected1: false,
        second: 10,
      });
      return;
    }
    setTimeout(function () {
      that.setData({
        second: second - 1
      });
      that.getTime(that);
    }
      , 1000)
  },
  getPhoneNumber: function (m) {
    app.globalData.loading(true);
    var pars = {};
    var that = this;
    wx.getStorage({
      key: 'sessionKey',
      success: function (res) {
        pars.key = res.data;
      }
    })
    pars.iv = m.detail.iv;
    pars.errMsg = m.detail.errMsg;
    pars.data = m.detail.encryptedData;
    wx.request({
      url: app.globalData.host + 'utility/getPhoneNumber',
      method: 'post',
      data: pars,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        that.setData({
          phoneNumber: res.data.phoneNumber
        });
      }
    })
    this.setData({
      selected: false,
      selected1: true
    });
    this.getTime(this);

  },
  getPhoneNumber: function (m) {
    app.globalData.loading(true);
    var pars = {};
    var that = this;
    pars.key = wx.getStorageSync('key');
    pars.iv = m.detail.iv;
    pars.errMsg = m.detail.errMsg;
    pars.fan = app.globalData.userInfo;
    pars.fan.openid = wx.getStorageSync('openid');
    pars.data = m.detail.encryptedData;
    wx.request({
      url: app.globalData.app + 'utility/getPhoneNumber',
      method: 'post',
      data: pars,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        app.globalData.loading(false);
        if (res.data < 0) {
          app.globalData.confirm('错误', '系统错误');
        } else {
          that.setData({
            phoneNumber: res.data.phoneNumber
          });
          wx.setStorageSync('phoneNumber', res.data.phoneNumber);
        }
      }
    })
    this.setData({
      selected: false,
      selected1: true
    });
    this.getTime(this);

  },
  submit: function () {
    app.globalData.loading(true);
    var pars = {};
    pars.fan = app.globalData.userInfo;
    pars.phone = this.data.phoneNumber;
    pars.fan.openid = wx.getStorageSync('openid');
    if (!this.data.phoneNumber) {
      app.globalData.confirm('错误', '请授权');
      return false;
    }
    if (pars.phone != this.data.phoneNumber) {
      app.globalData.confirm('错误', '请输入该微信绑定手机号');
      return false;
    }
    if (!(/^1\d{10}$/).test(pars.phone)) {
      app.globalData.confirm('错误', '手机号格式不正确');
      return false;
    }
    wx.request({
      url: app.globalData.app + 'user/query',
      method: 'post',
      data: pars,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        app.globalData.loading(false);
        if (res.data == 'success') {
          app.globalData.toast('登录成功');
          wx.navigateTo({
            url: '../index/index'
          })
        } else {
          app.globalData.confirm('错误', res.data);
        }
      }
    })
  }
})