var backend = require('./backend');
App({
    globalData: {
        totalTime: wx.getStorageSync('totalTime') || 1500,
        restTime: wx.getStorageSync('restTime') || 300,
        vibrate: wx.getStorageSync('vibrate'),
        muse: wx.getStorageSync('muse'),
        alwaysLighting: wx.getStorageSync('alwaysLighting'),
        logged: false,

        havePart: false,
        nowInTomato: 0,
        todoInfo: null,
        userInfo: null,
        tomatoInfo: 0,
        partTomatoInfo: null
    },
    onLaunch: function () {
        backend.login4App()
    }
});