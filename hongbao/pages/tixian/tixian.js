// pages/tixian/tixian.js
Page({
  goquestion: function () {
    wx.navigateTo({
      url: "../question/question"
    })
  },
  gojubao: function () {
    wx.navigateTo({
      url: "../jubao/jubao"
    })
  },
  gopartner: function () {
    wx.navigateTo({
      url: "../partner/partner"
    })
  }
})