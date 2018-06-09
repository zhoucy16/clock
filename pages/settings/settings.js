Page({
  data: {
    totalTime: getApp().globalData.totalTime,
    restTime: getApp().globalData.restTime,
    vibrate: getApp().globalData.vibrate,
    muse: getApp().globalData.muse,
    alwaysLighting: getApp().globalData.alwaysLighting
  },

  onLoad: function () {
    console.log(this.data.restTime);
    this.setData({
      totalTime: getApp().globalData.totalTime,
      restTime: getApp().globalData.restTime,
      vibrate: getApp().globalData.vibrate,
      muse: getApp().globalData.muse,
      alwaysLighting: getApp().globalData.alwaysLighting
    })
  },

  worksliderchange: function (e) {
    this.setData({
      totalTime: e.detail.value * 60,
    });
    getApp().globalData.totalTime = e.detail.value * 60;
    console.log(getApp().globalData.totalTime);
    console.log(this.data.totalTime);
    wx.setStorageSync('totalTime', getApp().globalData.totalTime);
  },

  restsliderchange: function (e) {
    this.setData({
      testTime: e.detail.value * 60,
    });
    getApp().globalData.restTime = e.detail.value * 60;
    wx.setStorageSync('restTime', getApp().globalData.restTime);
  },
  
})