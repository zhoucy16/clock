var backend = require('../../backend');
var clockBase = require('../../clockBase');

// 获取应用实例  
Page({

    width: 0,
    height: 0,
    data: {
        information: "",
        pairInformation: ""
    },
    mainClock: null,
    pairClock: null,

    //onLoad生命周期函数，监听页面加载
    onLoad: function () {
        //将全局变量Index保存在that中，里面函数调用
        var that = this;
        //获取系统信息
        wx.getSystemInfo({
            //获取系统信息成功，将系统窗口的宽高赋给页面的宽高
            success: function (res) {
                that.width = res.windowWidth;
                that.height = res.windowHeight
            }
        });
        wx.setKeepScreenOn({
            keepScreenOn: getApp().globalData.alwaysLighting
        });
        this.mainClock = clockBase.createClock(100, this.width / 2, this.height / 2, getApp().globalData.totalTime, getApp().globalData.restTime);
    },

    //onReady生命周期函数，监听页面初次渲染完成
    onReady: function () {
        this.mainClock.init();
        var that = this;
        this.mainClock.callback = function (info) {
            that.setData({
                information: info
            });
        };
        if (this.pairClock) {
            this.pairClock.init();
            this.pairClock.callback = function (info) {
                that.setData({
                    pairInformation: info
                });
            };
        }
    },

    //页面卸载，清除画布绘制计时器
    onUnload: function () {
        this.mainClock.destroy();
        if (this.pairClock) {
            this.pairClock.destroy();
        }
    },

    gotosettings: function () {
        wx.navigateTo({
            url: '/pages/settings/settings'
        })
    },

    gototodolist: function () {
        wx.navigateTo({
            url: '/pages/todo/todo'
        })
    },

    pushstartbutton: function () {

    },

    pushpausebutton: function () {

    },

    pushstopbutton: function () {

    },


    //开始一个快速番茄钟
    onetap: function () {
        if (this.mainClock.opening) {
            if (this.mainClock.waiting) {
                if (this.mainClock.working) {
                    // this.startWork(this.taskName);
                } else {
                    // this.startRest();
                }
            } else {
                // this.stop();
            }
        } else {
            // this.startWork("");//default task, no name
        }
    }
});