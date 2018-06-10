var backend = require('../../backend');
var clockBase = require('../../clockBase');
var previosTodoId = 0;

var lock = false;

// 获取应用实例  
Page({

    width: 0,
    height: 0,
    data: {
        information: "",
        pairInformation: "",
        startEnable: true,
        pauseEnable: false,
        stopEnable: false,
        havePart: false
    },
    mainClock: null,
    partClock: null,
    interval: null,

    userstatus: 'idle',//wait, rest
    waitTime: 0,
    isNextWork: false,

    restStartTime: 0,
    restleftTime: 0,
    restPausing: false,

    //onLoad生命周期函数，监听页面加载
    onLoad: function (options) {
        if (options.invitePart) {
            console.log("邀请人：" + options.invitePart);
            backend.connectSubmit({
                invitePart: options.invitePart
            }, function (res) {
                console.log(res);
                if (res.state === 'error') {
                    wx.showToast(wx.showToast({
                        title: '连接失败，错误信息：' + res.info,
                        icon: 'loading',
                        duration: 3000
                    }));
                }
            });
        }
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
        this.mainClock = clockBase.createClock(100, this.width / 2, this.height / 2, 'myCanvas');//TODO: zcy来调整距离
        this.partClock = clockBase.createClock(50, this.width / 2, this.height / 2, 'herCanvas');//TODO 问下zcy相关原理
    },

    enterWait: function (iswork) {
        this.userstatus = 'wait';
        this.waitTime = 0;
        this.isNextWork = iswork;
    },

    convertTime2Str: function (t) {
        // var minute = (Array(2).join(0) + Math.floor(t / 60)).slice(-2);
        var minute = Math.floor(t / 60);
        var second = (Array(2).join(0) + t % 60).slice(-2);
        return minute + ":" + second
    },

    updateClocks: function (page) {
        backend.updateOperation(function (res) {
            getApp().globalData.tomatoInfo = res.tomatoInfo;
            getApp().globalData.havePart = res.havePart;
            getApp().globalData.nowInTomato = res.nowInTomato;


            var dataObj = {}, restInfo = null;

            dataObj.havePart = res.havePart;

            if (res.nowInTomato) {
                if (res.info === 'finished') {//从工作切换成休息
                    var todoinfo = res.tomatoInfo.todoInfo;
                    previosTodoId = todoinfo.todo_id;
                    if (todoinfo.todo_shown_name === 'autoTodo' ||
                        todoinfo.todo_complete_num + 1 < todoinfo.todo_tar_num) {
                        page.enterWait(false);
                    }
                    else {
                        page.userstatus = 'idle';
                    }
                }

                if (res.tomatoInfo.state === 'paused') {
                    dataObj.startEnable = true;
                    dataObj.stopEnable = true;
                    dataObj.pauseEnable = false;
                } else {
                    dataObj.startEnable = false;
                    dataObj.stopEnable = true;
                    dataObj.pauseEnable = true;
                }

                dataObj.information = res.tomatoInfo.todoInfo.todo_shown_name + " " + page.convertTime2Str(res.tomatoInfo.leftTime);
            } else {
                if (page.userstatus === 'wait') {



                    //ring bell
                    if (getApp().globalData.vibrate) {
                        wx.vibrateLong({});
                    }

                    page.waitTime++;
                    if (page.waitTime > 20) {//超时 switch to idle
                        page.userstatus = 'idle';
                    }
                    if (page.isNextWork) {
                        dataObj.information = "点按以开始工作";
                    } else {
                        dataObj.information = "点按以开始休息";
                    }

                    dataObj.startEnable = false;
                    dataObj.stopEnable = true;
                    dataObj.pauseEnable = false;


                } else if (page.userstatus === 'idle') {


                    dataObj.information = "点按以开始工作";

                    dataObj.startEnable = true;
                    dataObj.pauseEnable = false;
                    dataObj.stopEnable = false;


                } else if (page.userstatus === 'rest') {

                    if (!page.restPausing) {
                        page.restleftTime--;


                        dataObj.startEnable = false;
                        dataObj.stopEnable = true;
                        dataObj.pauseEnable = true;
                    } else {

                        dataObj.startEnable = true;
                        dataObj.stopEnable = true;
                        dataObj.pauseEnable = false;

                    }
                    if (page.restleftTime <= 0) {
                        page.enterWait(true);
                    }
                    dataObj.information = "休息：" + page.convertTime2Str(page.restleftTime);
                    restInfo = {
                        startTime: page.restStartTime,
                        leftTime: page.restleftTime
                    };


                }
            }

            page.mainClock.canvasClock(page.mainClock, res.tomatoInfo, restInfo);//res.tomatoInfo===undefined should work fine

            if (res.havePart) {
                var partTomato = null;
                if (res.partTomatoInfo && res.partTomatoInfo.tomatoInfo) {
                    partTomato = res.partTomatoInfo.tomatoInfo;
                }
                page.partClock.canvasClock(page.partClock, partTomato, null);//不显示partner的休息

                if (partTomato) {
                    dataObj.pairInformation = page.convertTime2Str(partTomato.leftTime);
                } else {
                    dataObj.pairInformation = "你的另一半没有开始工作";
                }
            }

            page.setData(dataObj);
            lock = false;
        });
    },

    //onReady生命周期函数，监听页面初次渲染完成
    onReady: function () {
        var page = this;
        this.interval = setInterval(function () {
            page.updateClocks(page);
        }, 1000);
    },

    //页面卸载，清除画布绘制计时器
    onUnload: function () {
        clearInterval(this.interval);
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

    pushstartbutton: function () {//fixme 在实现这些button的时候，我始终信任当前客户端的状态和服务端是对应的
        if (lock) {
            return;
        }
        lock = true;
        var app = getApp();
        if (app.globalData.tomatoInfo) {
            var state = app.globalData.tomatoInfo.state;
            if (state === 'paused') {
                backend.pauseOperation();
            } else {//start new
                backend.clockOperation();
            }
        } else {
            switch (this.userstatus) {
                case 'idle':
                    backend.clockOperation();
                    break;
                case 'rest':
                    this.restPausing = false;
                    break;
                default:
                    console.log("invalid userstatus! " + this.userstatus);
            }
        }
    },

    pushpausebutton: function () {
        if (lock) {
            return;
        }
        lock = true;
        var app = getApp();
        if (app.globalData.tomatoInfo) {
            backend.pauseOperation();
        } else {
            switch (this.userstatus) {
                case 'rest':
                    this.restPausing = true;
                    break;
                default:
                    console.log("invalid userstatus!" + this.userstatus);
            }
        }
    },

    pushstopbutton: function () {
        if (lock) {
            return;
        }
        lock = true;
        var app = getApp();
        if (app.globalData.tomatoInfo) {
            backend.stopOperation();
        } else {
            switch (this.userstatus) {
                case 'rest':
                    this.userstatus = 'idle';
                    break;
                case 'wait':
                    this.userstatus = 'idle';
                    break;
                default:
                    console.log("invalid userstatus!" + this.userstatus);
            }
        }
    },

    //开始一个快速番茄钟
    onetap: function () {
        if (lock) {
            return;
        }
        lock = true;
        var app = getApp();
        if (app.globalData.tomatoInfo) {//stop it
            backend.stopOperation();
        } else {
            switch (this.userstatus) {
                case 'idle':
                    backend.clockOperation();
                    break;
                case 'rest':
                    this.userstatus = 'idle';
                    break;
                case 'wait':
                    if (this.isNextWork) {
                        backend.startTodoSubmit({
                            todoNum: previosTodoId
                        });
                    } else {
                        //enter rest
                        this.userstatus = 'rest';
                        this.restStartTime = new Date();
                        this.restleftTime = app.globalData.restTime * 60;
                        this.restPausing = false;
                    }
                    break;
            }
        }
    }
});