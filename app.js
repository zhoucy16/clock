var backend=require('./backend')
App({
  globalData: {
    totalTime: wx.getStorageSync('totalTime') || 1500,
    restTime: wx.getStorageSync('restTime') || 300,
    vibrate: wx.getStorageSync('vibrate'),
    muse: wx.getStorageSync('muse'),
    alwaysLighting: wx.getStorageSync('alwaysLighting'),
    returnedData: null,
    logged: false,
  },
  onLaunch:function() {
    backend.login4App()
  }
})