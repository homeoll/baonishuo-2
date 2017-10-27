  const app = getApp()
Page({
  onLoad: function (data) {
    this.data.redid = data.redid;
    this.data.manageropenid = data.openid;
    this.setData({
      hasLogin: app.globalData.hasLogin
    })
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
        withCredentials: false,
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        complete: function(msg) {
          
        }
      })
    }
  },
  data: {
    code: '',
    selected: true,
    selected1: false,
    second: 90,
    redid: 0,
    phoneNumber: '',
    manageropenid:'',
    showSuccess: false
  },
  phoneInputEvent:function(e){
    this.setData({
      phone:e.detail.value
    })
  },
  codeInputEvent: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  getTime: function(that) {
    var second = that.data.second;
    if (second == 0) {
      that.setData({
        selected:true,
        selected1:false,
        second: 90,
      });
      return;
    }
    setTimeout(function () {
          that.setData({
            second: second - 1
          });
          that.getTime(that);
        }
        , 1000
    )},
  getPhoneNumber: function(m) {
    var pars = {};
    var that = this;
    pars.key = wx.getStorageSync('key');
    pars.iv = m.detail.iv;
    pars.errMsg = m.detail.errMsg;
    pars.fan = app.globalData.userInfo;
    pars.openid = wx.getStorageSync('openid');
    pars.data = m.detail.encryptedData;
    app.globalData.loading(true);
    wx.request({
      url: app.globalData.app + 'utility/getPhoneNumber',
      method: 'post',
      data: pars,
      header: {'content-type': 'application/json'},
      success: function (res) {
        app.globalData.loading(false);
        that.setData({
          showSuccess:true,
          selected:false
        });
        if(res.data < 0) {
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
      selected:false,
      selected1:true
    });
    this.getTime(this);
    
    setTimeout(function() {
      that.submit();
    }, 800)
  },
  submit: function() {
    var pars = {};
    pars.fan = app.globalData.userInfo;
    pars.phone = this.data.phoneNumber;
    pars.openid = wx.getStorageSync('openid');
    pars.manager = this.data.manageropenid;
    if(!this.data.phoneNumber) {
      this.setData({
        selected:true,
        showSuccess:false
      });
      return false;
    }
    if(pars.phone != this.data.phoneNumber) {
      app.globalData.confirm('错误', '请输入该微信绑定手机号');
      return false;
    }
    if(!(/^1\d{10}$/).test(pars.phone)) {
      app.globalData.confirm('错误', '手机号格式不正确');
      return false;
    }

    app.globalData.loading(true);
    var that = this;
    wx.request({
      url: app.globalData.app + 'user/query',
      method: 'post',
      data: pars,
      header: {'content-type': 'application/json'},
      success: function (res) {
        app.globalData.loading(false);
        if(res.data == 'success') {
          app.globalData.toast('登录成功');
          if(that.data.redid) {
            wx.redirectTo({
              url: '../my_list/my_list?redid=' + that.data.redid
            })
          } else {
            wx.redirectTo({
              url: '../index/index'
            })
          }
        } else {
          app.globalData.confirm('错误', res.data);
          that.data.showSuccess = false;
          that.data.selected = true;
        }
      },
    })
  }
})
