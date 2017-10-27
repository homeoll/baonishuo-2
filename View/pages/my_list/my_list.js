// pages/lingqu/lingqu.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        fee: '',
        fee_now: '',
        my_fee: '',
        number: '',
        number_now: '',
        token: '',
        user_list: {},
        status: '',
        time: '',
        time_now: Date.parse(new Date()) / 1000,
        if_my:'',
        active:'../../images/noactive.png',
        avatar :'',
        nickname :'',
        aaa:'',
        shuohua:'none',
        manager: '成为合伙人'
    }, 
   /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options){
       var phoneNumber = wx.getStorageSync('phoneNumber');
       if (!phoneNumber || !app.globalData.userInfo) {
         if(options.redid){
             wx.reLaunch({
                 url: '../login/login?redid='+options.redid +'&openid='+options.openid
             })
         }else{
             wx.reLaunch({
                 url: '../login/login'
             })
         }
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
               app.globalData.userInfo = res.userInfo
           this.setData({
               userInfo: res.userInfo,
               hasUserInfo: true
           })
        }
        })
        }
        var that = this;
       /**
        * 获取系统信息
        */
       wx.getSystemInfo({
           success: function (res) {
               that.setData({
                   winWidth: res.windowWidth,
                   winHeight: res.windowHeight
               });
           }
       });
       if(this.data.time = ''){
           app.globalData.loading(true);
       }
       options.openid = wx.getStorageSync('openid');
        wx.request({
            url: app.globalData.app + 'user/redlist',
            method: 'get',
            data: options,
            header: {'content-type': 'application/json'},
            success: function(res){
                app.globalData.loading(false);
                if(res.data != 'exit') {
                    that.setData({
                        fee: res.data.fee,
                        fee_now: res.data.fee_now,
                        my_fee: res.data.user_fee,
                        number_now: res.data.number_now,
                        number: res.data.number,
                        token: res.data.void,
                        status: res.data.status,
                        user_list: res.data.user_list,
                        user_list_back: res.data.user_list,
                        time: res.data.time + 60 * 60 * 24,
                        if_my: res.data.if_my,
                        redid:options.redid,
                        avatar:res.data.avatar,
                        nickname:res.data.nickname,
                        manager: res.data.manager
                    })
                } else {
                    wx.navigateTo({
                        url: "../my_send/my_send"
                    })
                }
            }
        })
    },
    startRecode:function() {
        var that = this;
        var data = {};
        data.openid = wx.getStorageSync('openid');
        data.redid = that.data.redid;
        that.setData({
          shuohua:'block'
        })
        wx.startRecord({
            success: function(res) {
                data.url = res.tempFilePath;
                app.globalData.loading(true);
                wx.uploadFile({
                    url: app.globalData.app + 'user/uploadfile',//仅为示例，非真实的接口地址
                    filePath: data.url,
                    name: 'file',
                    formData:{
                        'openid': data.openid,
                        'redid': that.data.redid
                    },
                    success: function(res){
                        var a = setInterval(function(){
                            wx.request({
                                url: app.globalData.app + 'user/getsb',
                                method: 'post',
                                data: data,
                                header: {'content-type': 'application/json'},
                                success: function(res){
                                    if(res.data != 1){
                                        if(res.data == 2){
                                            app.globalData.loading(false);
                                            setTimeout(function(){ 
                                              that.showfail()
                                              },300);
                                            clearTimeout(a);
                                            clearTimeout(b);
                                            that.onLoad(data);
                                        }
                                        if(res.data == 3){
                                            app.globalData.loading(false);
                                            setTimeout(function () {
                                              that.showok()
                                            }, 300);
                                            clearTimeout(a);
                                            clearTimeout(b);
                                            that.onLoad(data);
                                        }
                                    }
                                }
                            })
                        },1000);
                        var b = setInterval(function(){
                            app.globalData.loading(false);
                            clearTimeout(a);
                            clearTimeout(b);
                            setTimeout(function () {
                              that.showfail()
                            }, 300);
                        },10000);
                      
                    },
                    fail:function(res){
                        app.globalData.loading(false);
                    }
                })
            },
            fail: function(res) {
              that.setData({
                shuohua: 'none'
              })
            }
        });
        setTimeout(function() {
          that.setData({
            shuohua: 'none'
          })
            //结束录音  
            wx.stopRecord();
        }, 6000)
    },
    endRecode:function() {
      this.setData({
        shuohua: 'none'
      });
        wx.stopRecord();
    },
    gomysend:function() {
        wx.navigateBack({
            delta: 1
        })
    },
    gozhuanfa:function() {
      var openid = wx.getStorageSync('openid');
      var redid = this.data.redid;
      wx.navigateTo({
        url: "../share/share?redid=" + redid +"&openid="+openid
      })
    },
    gotixian:function() {
      wx.navigateTo({
        url: "../withdraw/withdraw"
      })
    },
    gotoken:function() {
      wx.navigateTo({
        url: "../index/index"
      })
    },
    goreport:function() {
      wx.navigateTo({
          url:'../report/report'
      })
    },
    manager:function() {
        wx.navigateTo({
            url: "../manager/manager"
        })
    },
    bofang:function(res) {
      var url = res.currentTarget.dataset.play;
      var id = res.target.dataset.id;
      var s = res.target.dataset.s;
        var a ='';
        var param = {};
        var string = "user_list["+id+"].void_length";
        var that = this;
        if(this.data.user_list[id].void_length == '播放中'){
            clearTimeout(a);
            this.setData({
                user_list:this.data.user_list_back
            });
            wx.stopVoice();
        }else{
            wx.stopVoice();
            clearTimeout(a);
            this.setData({
                user_list:this.data.user_list_back
            })
            param[string] = '播放中';
            this.setData(param);
            wx.downloadFile({
                url: url, //仅为示例，并非真实的资源
                success: function(res) {
                    wx.playVoice({
                        filePath: res.tempFilePath
                    })
                    a = setTimeout(function() {
                        //暂停播放
                        var param = {};
                        var string = "user_list["+id+"].void_length";
                        param[string] = s;
                        that.setData(param);
                        wx.stopVoice()
                    }, parseInt(s) * 1000+1500)
                }
            })
        }
      
    },
    showfail: function () {
        wx.showToast({
            title: '没有录到\r\n你的声音',
            icon: 'success',
            image:'../../images/fail.png',
            duration: 3000
        })
    },
    showok: function () {
        wx.showToast({
            title: '恭喜你\r\n领到奖励啦',
            icon: 'success',
            duration: 3000
        })
    }
})