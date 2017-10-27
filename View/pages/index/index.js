const app = getApp()
Page({
  onLoad: function (){
    var phoneNumber = wx.getStorageSync('phoneNumber');
    if (!phoneNumber || !app.globalData.userInfo) {
      wx.reLaunch({
        url: '../login/login'
      })
    }
    
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
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
    var that = this;
    app.globalData.loading(true);
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.app + 'user/getConfig',
      method: 'post',
      data: {
        'openid':openid
      },
      header: {'content-type': 'application/json'},
      success: function (res) {
        app.globalData.loading(false);
        that.setData({
          percent: res.data.platform,
          fee: res.data.fee,
          manager: res.data.manager
        })
      }
    })
  },
  data: {
    title: '',
    price: '',
    number: '',
    showAlert: false,
    alertContent: '',
    percent: 0,
    service: 0.00.toFixed(2),
    fee:'',
    button:'生成语音口令',
    manager: '成为合伙人'
  },
  withDraw: function() {
    wx.navigateTo({
      url: './../withdraw/withdraw',
    })
  },
  mySend: function () {
    wx.navigateTo({
      url: './../my_send/my_send',
    })
  },
  alertTime: function() {
    var that = this;
    if(that.data.showAlert == true) {
      setTimeout(function(){
        that.setData({
          showAlert: false, alertContent: ''
        })
      }, 2000)
    }
  },
  titleInputEvent: function(e) {
    var that = this;
    e = e.detail.value;
    if(e.length > 20) {
      e = substrs(e, 20);
    }
    
    var a = /[^\u4e00-\u9fa5|,]+/.test(e);
    if(a) {
      var reg = /[a-zA-Z0-9]+/g;
      e = e.replace(reg,"");
      this.setData({
        showAlert: true,
        alertContent: '口令只能输入汉字'
      });
      this.alertTime();
    }
    e = e.replace(/[^\u4e00-\u9fa5|,]+/,'');

    that.setData({
      title: e
    });
    return e;
  },
  priceInputEvent: function(e) {
    e = e.detail.value;
    if(e < 0) {
      e = 0;
      that.setData({
        button:'生成语音口令'
      })
    }
    if(this.data.number) {
      var onePrice = Math.floor((e/this.data.number) * 100) / 100;
      if(onePrice < 1) {
        this.setData({
          showAlert: true,
          alertContent: '每人金额不得小于1元',
          button:'生成语音口令'
        });
        this.alertTime();
      }
    }
    var that = this;
    var len = e.toString().split(".")[1];
    if(len) {
      if(len.length > 2) {
        e = Math.floor(e * 100) / 100;
      }
    }
    if(e > 500) {
      that.setData({
        showAlert: true,
        alertContent: '金额不能大于500'
      });
      that.alertTime();
      e = 500;
    }
    that.setData({
      price: e,
      service:Math.round((e * that.data.percent)*100)/100,
    });
    var a_price = (parseInt(e*100)/100 + parseInt(this.data.service*100)/100 - parseInt(this.data.fee*100)/100);
    if(a_price > 0) {
      var one_price = parseInt(a_price * 100)/100;
      if(one_price < 0) {
        one_price = 0;
      }
      that.setData({
        button:'还需支付'+(one_price)+'元'
      })
    }else{
      that.setData({
        button:'生成语音口令',
      })
    }
    
    return e;
  },
  numberInputEvent: function(e) {
    e = e.detail.value;
    if(this.data.price) {
      var onePrice = Math.floor((this.data.price/e) * 100) / 100 ;
      if(onePrice < 1) {
        this.setData({
          showAlert: true,
          alertContent: '每人金额不得小于1元'
        });
        this.alertTime();
      }
    }
    //每人红包不能少于1元
    var that = this;
    if(e > 100) {
      that.setData({
        showAlert: true,
        alertContent: '数量不能大于100'
      });
      that.alertTime();
      e = 100;
    }
    this.setData({
      number: e
    })
    e = Math.floor(e);
    return e;
  },
  submit: function() {
    var pars = {};
    pars.price = this.data.price;
    pars.fee = this.data.fee;
    pars.title = this.data.title;
    pars.number = this.data.number;
    pars.fan = app.globalData.userInfo;
    pars.fan.openid = wx.getStorageSync('openid');
    var a = /[a-zA-Z0-9]+/.test(pars.title);
    if(a) {
      app.globalData.confirm('错误', '口令只能是汉字');
      return false;
    }
    if(pars.title == '') {
      app.globalData.confirm('错误', '必须输入口令');
      return false;
    }
    if(pars.price == '') {
      app.globalData.confirm('错误', '必须填写打赏金额');
      return false;
    }
    if(pars.number == '') {
      app.globalData.confirm('错误', '必须填写红包数量');
      return false;
    }
    if(pars.price > 500) {
      app.globalData.confirm('错误', '打赏金额不能超过500元');
      return false;
    }
    if(pars.price < 0) {
      app.globalData.confirm('错误', '打赏金额不能小于0元');
      return false;
    }
    if(isNaN(pars.price)) {
      app.globalData.confirm('错误', '打赏金额必须是数字');
      return false;
    }
    if(pars.number > 100) {
      app.globalData.confirm('错误', '红包数量不能超过100');
      return false;
    }
    if(isNaN(pars.number)) {
      app.globalData.confirm('错误', '红包数量必须是数字');
      return false;
    }
    var onePrice = Math.floor((pars.price/pars.number) * 100) / 100;
    if(onePrice < 1) {
      app.globalData.confirm('错误', '每人金额不得小于1元');
      return false;
    }
    app.globalData.loading(true);
    wx.request({
      url: app.globalData.app + 'user/outRed',
      method: 'post',
      data: pars,
      header: {'content-type': 'application/json'},
      success: function (res) {
        app.globalData.loading(false);
        if(res.data.status == 'full_price') {
          wx.navigateTo({
            url: "../share/share?redid=" + res.data.redid + "&openid=" + pars.fan.openid
          })
        } else if (res.data.status != 'success') {
          app.globalData.confirm('错误', '系统错误');
        } else {
          var log = res.data.ret;
          wx.requestPayment({
            'timeStamp': String(log.timestamp),
            'nonceStr': log.nonce,
            'package': log.package,
            'signType': 'MD5',
            'paySign': log.signature,
            'success':function(msg){
              wx.navigateTo({
                url: "../share/share?redid=" + res.data.redid + "&openid=" + pars.fan.openid
              });
            },
            'fail':function(res){
              app.globalData.confirm('错误', '操作失败');
            },
            'complete': function(msg) {
              
            }
          })
        }
      }
    })
  },
  gotixian:function() {
    wx.navigateTo({
      url: "../withdraw/withdraw"
    })
  },
  goreport:function() {
    wx.navigateTo({
      url: "../report/report"
    })
  },
  goquestion:function() {
    wx.navigateTo({
      url: "../question/question"
    })
  },
  gosend:function() {
    wx.navigateTo({
      url: "../my_send/my_send"
    })
  },
  member:function() {
    wx.navigateTo({
    url: "../manager/manager"
    })
  },
  goexplain:function() {
    wx.navigateTo({
      url: "../explain/explain"
    })
  },
})