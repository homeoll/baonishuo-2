//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        //发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: "https://w.microbuilder.cn/addons/mb_core/m/index.php?i=16&s=/extend/red/utility/getFan",
          data: {
            code: res.code
          },
          method: 'post',
          header: {
            'content-type': 'application/json'
          },
          success: function (msg) {
            wx.setStorageSync('key', msg.data.session_key);
            wx.setStorageSync('openid', msg.data.openid);
          }
        })
      }
    })
  },

  globalData: {
    userInfo: null,
    app: "https://w.microbuilder.cn/addons/mb_core/m/index.php?i=16&s=/extend/red/",
    bench: "https://w.microbuilder.cn/live/addons/mb_core/w/index.php?s=/bench/extend/red/",
    //app: "http://microb.cn/live/addons/mb_core/m/index.php?s=/extend/red/",
    //bench: "http://microb.cn/live/addons/mb_core/w/index.php?s=/bench/extend/red/",
    toast: function(html, typeLen = 'success') {
      wx.showToast({
        title: html,
        icon: typeLen,
        duration: 3000,
        mask:true
      });
    },
    loading: function(is_loading) {
      if(is_loading) {
        wx.showLoading({
          title: '加载中', icon: 'loading',mask:true
        })
      }else{
        wx.hideLoading();
      }
    },
    confirm:function(title, html, confirm=function() {}, error=function() {}){
      wx.showModal({
        title: title, content: html, success: function(res){
          if(res.confirm) {
            confirm();
          } else {
            error();
          }
        }
      })
    }
  }
})