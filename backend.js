var config = require('./config')

var exports = {
  // 登录（此时会检查并且返回番茄状态，如果番茄过期则会返回的data.tomatoInfo.state="passedAndPaused"，可以弹出一个提示询问是否继续，继续则调用pauseOperation即可
  login: function () {
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
              res.data = JSON.parse(res.data.split("<script")[0]);
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

  //gerw: 给app.js提供的login，将后端信息储存在globalData中
  login4App: function () {
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
              res.data = JSON.parse(res.data.split("<script")[0]);
              console.log("已登陆！返回信息：", res.data);
              wx.setStorageSync('session', res.data.session);
              wx.setStorageSync('invite', res.data.invite);
              // that.setData({
                // returnedData: res.data,
                // logged: true
              // })
              getApp().globalData.returnedData=res.data;
              getApp().globalData.logged=true;
            }
          })
        }
      },
      fail: function (error) {
        console.log('login failed ' + error);
        wx.showToast({//fixme 这一段还没有测试过
          title: '登录失败，请稍后重试',
          mask:true,
          complete: function() {
            wx.navigateBack({
              delta: -1,
            })
          }
        })
      }
    })
  },

  // 这个是按下创建按钮时；现在正计时可能没有时间做了
  createTodoNow: function (e) {
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
        res.data = JSON.parse(res.data.split("<script")[0]);
        console.log("已创建！返回信息：", res.data);
      }
    })
  },

  // 直接点击开始番茄按钮，通过data里面的设置来设定状态
  clockOperation: function () {
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
        res.data = JSON.parse(res.data.split("<script")[0]);
        console.log("已创建！返回信息：", res.data);
      }
    })
  },

  // 一个用来同步时间的
  updateOperation: function () {
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
        res.data = JSON.parse(res.data.split("<script")[0]);
        console.log("已更新！返回信息：", res.data);
      }
    })
  },

  // 暂停按钮，虽然我觉得既然要番茄就是不想要暂停的啊……无所谓了反正都是在咸鱼
  pauseOperation: function () {
    wx.request({
      url: config.service.pauseTomatoUrl,
      data: {
        'session': wx.getStorageSync('session'),
        'invite': wx.getStorageSync('invite'),
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        res.data = JSON.parse(res.data.split("<script")[0]);
        console.log("已暂停或恢复！返回信息：", res.data);
      }
    })
  },

  // 停止按钮，定了番茄又停止可太咸鱼了
  stopOperation: function () {
    wx.request({
      url: config.service.stopTomatoUrl,
      data: {
        'session': wx.getStorageSync('session'),
        'invite': wx.getStorageSync('invite'),
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        res.data = JSON.parse(res.data.split("<script")[0]);
        console.log("已停止！返回信息：", res.data);
      }
    })
  },

  // 查找todo的按钮
  // 注意：在之前的开始、更新、暂停、停止操作中，都已经返回了todoInfo，在这时应该保存（如果不想保存的话就在后端别返回这些了）
  // 所以应该是基于这些来进行的
  getTodoSubmit: function (e) {
    e.detail.value['session'] = wx.getStorageSync('session');
    e.detail.value['invite'] = wx.getStorageSync('invite');

    console.log("查找todo：", e.detail.value)
    wx.request({
      url: config.service.getTodoUrl,
      data: e.detail.value,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        res.data = JSON.parse(res.data.split("<script")[0]);
        console.log("已查询！返回信息：", res.data);
      }
    })
  },

  // 执行todo的按钮
  startTodoSubmit: function (e) {
    e.detail.value['session'] = wx.getStorageSync('session');
    e.detail.value['invite'] = wx.getStorageSync('invite');

    console.log("执行todo：", e.detail.value)
    wx.request({
      url: config.service.startTodoUrl,
      data: e.detail.value,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        res.data = JSON.parse(res.data.split("<script")[0]);
        console.log("已执行！返回信息：", res.data);
      }
    })
  },

  // 查找userinfo的按钮
  // 注意：之前只有登陆的时候返回了userinfo，但是中间的完成番茄操作会改变userinfo，所以记得要改！
  // 注意：一天的定义是从早上3点到第二天早上三点！
  getUserInfoSubmit: function (e) {
    e.detail.value['session'] = wx.getStorageSync('session');
    e.detail.value['invite'] = wx.getStorageSync('invite');

    console.log("查找UserInfo：", e.detail.value)
    wx.request({
      url: config.service.getUserInfoUrl,
      data: e.detail.value,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        res.data = JSON.parse(res.data.split("<script")[0]);
        console.log("已查询UserInfo！返回信息：", res.data);
      }
    })
  },
}

module.exports = exports