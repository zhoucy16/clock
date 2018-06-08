//index.js
var config = require('../../config')

Page({
    data: {
        userInfo: {},
        logged: false, 
        returnedData: {},
        clockInfo: "开始番茄",
        tomatoTime: 25,
        restTime: 5,
        todoForm: 1
    },

    // 登录
    login: function() {
      var that = this;
      wx.login({
        success: function (res) {
          var code = res.code;//发送给服务器的code  
          if (code) {
            wx.request({
              url: config.service.loginUrl,
              data: {
                code: code,
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log("已登陆！返回信息：", res.data);
                wx.setStorageSync('session', res.data.session);
                wx.setStorageSync('invite', res.data.invite);
                that.setData({
                  returnedData: res.data,
                  logged: true
                })
              }
            })
          }
        },
        fail: function (error) {
          console.log('login failed ' + error);
        }
      })
    },

    testSubmit: function(e) {
      e.detail.value['session'] = wx.getStorageSync('session');
      e.detail.value['invite'] = wx.getStorageSync('invite');

      console.log("发送信息：", e.detail.value)
      wx.request({
        url: config.service.createTodoUrl,
        data: e.detail.value,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log("已创建！返回信息：", res.data);
          
        }
      })
    },

    clockOperation: function() {
      wx.request({
        url: config.service.createTomatoUrl,
        data: {
          'session': wx.getStorageSync('session'),
          'invite': wx.getStorageSync('invite'),
          'doTime': this.data['tomatoTime'],
          'restTime': this.data['restTime'],
          'todoForm': this.data['todoForm']
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log("已创建！返回信息：", res.data);
        }
      })
    },

    updateOperation: function() {
      wx.request({
        url: config.service.updateTomatoUrl,
        data: {
          'session': wx.getStorageSync('session'),
          'invite': wx.getStorageSync('invite'),
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log("已更新！返回信息：", res.data);
        }
      })
    }

})
