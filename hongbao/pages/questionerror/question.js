Page({
  data: {
    showView: false
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    showView: (options.showView == "false" ? true : false)
  }
  , onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  }
})