var app = getApp()
Page({
  showfail: function () {
    wx.showToast({
      title: '没有录到\r\n你的声音',
      image:'../../images/fail.png',
      duration: 2000
    })
  },
  showok: function () {
    wx.showToast({
      title: '恭喜你\r\n领到奖励啦',
      icon: 'success',
      duration: 2000,
    })
  },
  showloading:function(){
    // wx.showToast({
    //   title:'正在拼命抢',
    //   icon:'loading'
    // })
    wx.showToast({
      title: '正在拼命抢',
      icon: 'loading',
      duration: 10000
    })
    setTimeout(function () {
      wx.hideToast()
    }, 2000)
  },
  record:function(){
    wx.startRecord({
      success: function (res) {
        var tempFilePath = res.tempFilePath
      },
      fail: function (res) {
        //录音失败
      }
    })
    setTimeout(function () {
      //结束录音  
      wx.stopRecord()
    }, 10000)
  }  


  
}) 