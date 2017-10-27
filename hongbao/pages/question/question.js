Page({
  data: {
    list: [
      {
        id: 'view',
        name: '包你说-语音口令怎你说-语音口令怎你说-语音口令怎你说-语音口令怎？',
        pages: ['您可以设置一个带奖励的语音口令，好友说对口令才能领到奖励']
      }, {
        id: 'content',
        name: '我支付了但没有发出去？',
        pages: ['请在主页的【我的记录】中找到相应的记录，点击进入详情后点击【去转发】可把口令转发给好友或群，你也可以生成朋友圈分享图后发朋友圈']
      }, {
        id: 'form',
        name: '好友可以转发我的口令吗？',
        pages: ['可以的，您分享给好友或者转发到微信群的语音口令，其他好友均可再次转发']
      }, {
        id: 'nav',
        name: '发口令会收取服务费吗？',
        pages: ['发语音口令会收取8%的服务费']
      }, {
        id: 'media',
        name: '未领取的金额会怎样处理？',

        pages: ['未领取的金额将于24小时后退至包你说小程序余额，同时，未领取金额的服务费也将退回90%']
      }, {
        id: 'map',
        name: '如何提现到微信钱包？',
        pages: ['在主页的【余额提现】或详情页的【去提现】均可跳转至余额提现页面进行提现，提现金额每次至少1元，每天至多提现三次']
      }, {
        id: 'canvas',
        name: '提现会收服务费吗？多久到账？',
        pages: ['提现不收取服务费；申请提现后会在1-5个工作日内转账到您的微信钱包']
      },{
        id: 'canvass',
        name: '如何联系客服？',
        pages: ['您可以点击本页面右下角的聊天小图标来联系我们的在线客服；您也可以拨打我们的客服电话：020-29052945']
      }
    ]
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

