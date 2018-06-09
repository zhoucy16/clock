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
  },

  worksliderchange: function (e) {
    console.log(e.detail.value);
    this.setData({
      totalTime: e.detail.value * 60,
    });
    getApp().globalData.totalTime = e.detail.value * 60;
  },

  restsliderchange: function (e) {
    this.setData({
      testTime: e.detail.value * 60,
    });
    getApp().globalData.restTime = e.detail.value * 60;
  },
  
})