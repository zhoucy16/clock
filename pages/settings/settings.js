var backend = require('../../backend');

Page({
    data: {
        totalTime: getApp().globalData.totalTime,
        restTime: getApp().globalData.restTime,
        vibrate: getApp().globalData.vibrate,
        muse: getApp().globalData.muse,
        alwaysLighting: getApp().globalData.alwaysLighting,
        paired: getApp().globalData.havePart
    },

    onLoad: function () {
        console.log(this.data.restTime);
        this.setData({
            totalTime: getApp().globalData.totalTime,
            restTime: getApp().globalData.restTime,
            vibrate: getApp().globalData.vibrate,
            muse: getApp().globalData.muse,
            alwaysLighting: getApp().globalData.alwaysLighting,
            paired: getApp().globalData.havePart
        })
    },

    worksliderchange: function (e) {
        this.setData({
            totalTime: e.detail.value,
        });
        getApp().globalData.totalTime = e.detail.value;
        wx.setStorageSync('totalTime', getApp().globalData.totalTime);
    },

    restsliderchange: function (e) {
        this.setData({
            testTime: e.detail.value,
        });
        getApp().globalData.restTime = e.detail.value;
        wx.setStorageSync('restTime', getApp().globalData.restTime);
    },

    vibrateswitchchange: function (e) {
        this.setData({
            vibrate: e.detail.value
        });
        getApp().globalData.vibrate = e.detail.value;
        console.log(getApp().globalData.vibrate);
        wx.setStorageSync('vibrate', getApp().globalData.vibrate);
    },

    alwaysLightingswitchchange: function (e) {
        this.setData({
            alwaysLighting: e.detail.value
        });
        getApp().globalData.alwaysLighting = e.detail.value;
        wx.setStorageSync('alwaysLighting', getApp().globalData.alwaysLighting);
        wx.setKeepScreenOn({
            keepScreenOn: getApp().globalData.alwaysLighting,
        })
    },

    onShareAppMessage: function () {
        return {
            title: '点击这个链接和我共享番茄数据',
            path: '/pages/clock/clock?invitePart=' + wx.getStorageSync('invite')
        };
    },

    deletemylove: function () {
        backend.disconnectSubmit();
        this.setData({
            paired: false
        });
    }
});