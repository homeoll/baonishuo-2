const app = getApp();
Page({
  onload:function(){
    // app.globalData.loading(true);

  },

  onTap1:function(event){
    wx.navigateTo({
      url:"../index/index"
    })
  },
  gosendmoney:function(){
    wx.navigateTo({
      url:"../sendmoney/sendmoney"
    })
  },
  gotixian:function(){
    wx.navigateTo({
      url:"../tixian/tixian"
    })
  },
  goquestion:function(){
    wx.navigateTo({
      url:"../question/question"
    })
  },
  gojubao:function(){
    wx.navigateTo({
      url:"../jubao/jubao"
    })
  },
  gopartner:function(){
    wx.navigateTo({
      url:"../partner/partner"
    })
  },
  titleInputEvent: function (e) {
    this.setData({
      title: e
    })
  },
  submit:function(){
    app.globalData.loading(true);
  },
  goexplain: function () {
    wx.navigateTo({
      url: "../explain/explain"
    })
  }
})