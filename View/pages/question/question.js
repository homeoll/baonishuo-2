const app = getApp()
Page({
  onLoad: function() {
    var phoneNumber = wx.getStorageSync('phoneNumber');
    if (!phoneNumber || !app.globalData.userInfo) {
      wx.reLaunch({
        url: '../login/login'
      })
    }
    var that = this;
    app.globalData.loading(true);
    var pars = {};
    pars.openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.app + 'question/list',
      method: 'post',
      data: pars,
      header: {'content-type': 'application/json'},
      success: function (res) {
        app.globalData.loading(false);
        if(res.data.status == 'success') {
          that.setData({
            list:res.data.questions,
            phoneNumber: res.data.phoneNumber,
            manager: res.data.manager
          })
        } else {
          app.globalData.confirm('错误', res.data);
        }
      }
    })
  },
  data: {
    list: {},
    phoneNumber: '',
    manager: '成为合伙人'
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
  gojubao:function() {
    wx.navigateTo({
      url: "../report/report"
    })
  },
  manager:function() {
    wx.navigateTo({
      url: "../manager/manager"
    })
  },
  call: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber
    })
  }
})

