var backend = require('./backend');
App({
    globalData: {
        totalTime: wx.getStorageSync('totalTime') || 25,
        restTime: wx.getStorageSync('restTime') || 5,
        vibrate: wx.getStorageSync('vibrate') || true,
        muse: wx.getStorageSync('muse'),
        alwaysLighting: wx.getStorageSync('alwaysLighting') || true,
        logged: false,

        havePart: false,
        nowInTomato: 0,
        todoInfo: null,
        userInfo: null,
        tomatoInfo: 0,
        partTomatoInfo: null,
        todoForm: 2
    },
    onLaunch: function () {
        backend.login4App(this);
    }
});