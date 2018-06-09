App({
  globalData: {
    totalTime: wx.getStorageSync('totalTime') || 1500,
    restTime: wx.getStorageSync('restTime') || 300,
    vibrate: wx.getStorageSync('vibrate') || true,
    muse: wx.getStorageSync('muse') || false,
    alwaysLighting: wx.getStorageSync('alwaysLighting') || true
  },
  onLaunch: function () {
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

  }
})