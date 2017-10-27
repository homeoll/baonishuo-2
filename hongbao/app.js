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
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url:'https://w.microbuilder.cn/addons/mb_core/m/index.php?i=16&s=/extend/red/utility/getFan',
          data:{
            code:data.code
          },
          method:post,
          //对于 header['content-type'] 为 application/json 的数据，会对数据进行 JSON 序列化
          header:{
            'contect-type':'application/json'
          },
          success:function(msg){
            wx.setStorageSync('key','msg.data.session_key'),
            wx.setStorageSync('openid','msg.data.openid')
          }

        })
      }//success
    })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })


  },
  globalData: {
    userInfo: null,
    loading: function (is_loading) {
      if (is_loading) {
        wx.showToast({
          title: '数据加载中', icon: 'loading'
        });
      }
    },
  }
})