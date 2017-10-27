//index.js  
//获取应用实例  
var app = getApp()
Page({
  data: {
    /**  页面配置  */
    sendData: [],
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    flag:true,
  },
  clickchange:function(e){
    console.log(this)
    this.setData({
      flag:!this.data.flag
    })
  },
 
})  