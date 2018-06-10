var clockBase = {
    startPos: 0,
    totaltime: 0,
    currentPos: 0,
    finishPos: 0,
    resttime: 0,
    restfinishPos: 0,
    leftworkTime: 0,
    leftrestTime: 0,
    working: false,
    opening: false,
    waiting: false,
    pos: {
        x: 0,
        y: 0
    },
    radius: 0,
    information: "",
    pausing: false,
    interval: null,
    taskName: "",
    startAng: 0,
    totalAng: 0,
    restAng: 0,
    callback: null,

    updateAngle: function () {
        var t = new Date();//获取当前时间
        var h = t.getHours();//获取小时
        h = h > 12 ? (h - 12) : h;//将24小时制转化为12小时制
        var m = t.getMinutes();//获取分针
        var s = t.getSeconds();//获取秒针
        this.startAng = (Math.PI / 30) * (m + s / 60);
        this.totalAng = (Math.PI / 30) * this.totalTime / 60;
        this.restAng = (Math.PI / 30) * this.restTime / 60;
    },

    init: function () {
        this.canvasClock(this);
        var that = this;
        this.interval = setInterval(function () {
            that.canvasClock(that);
        }, 1000);
        //调用canvasClock函数
        //对canvasClock函数循环调用
    },

    destroy: function () {
        clearInterval(this.interval);
    },

    startWork: function (taskName) {
        this.taskName = taskName;
        this.updateAngle();
        this.startPos = this.currentPos = this.startAng;
        this.finishPos = this.startAng + this.totalAng;
        this.restfinishPos = this.startAng + this.totalAng + this.restAng;
        this.leftworkTime = this.totaltime;
    },

    startRest: function () {
        this.updateAngle();
        this.startPos = this.currentPos = this.startAng;
        this.finishPos = this.startAng;
        this.restfinishPos = this.startAng + this.restAng;
        this.leftrestTime = this.resttime;
    },

    startWait: function () {
        this.waiting = true;
    },

    stopWait: function () {
        this.waiting = false;
    },

    pause: function () {
        this.pausing = true;
    },

    stop: function () {
        this.opening = false;
        this.waiting = false;
    },

    resume: function () {
        this.pausing = false;
    },

    onetap: function () {//这里面没有暂停的事情
        if (this.opening) {
            if (this.waiting) {
                this.stopWait();
                if (this.working) {
                    this.startWork(this.taskName);
                } else {
                    this.startRest();
                }
            } else {
                this.stop();
            }
        } else {
            this.startWork("");//default task, no name
        }
    },

    canvasClock: function (that) {
        var context = wx.createContext();//创建并返回绘图上下文（获取画笔）
        //设置宽高
        // var width = this.width;
        // var height = this.height;
        // var clockR = width / 2 - 60;
        var clockR = that.radius;

        //重置画布函数
        function reSet() {
            // context.height = context.height;//每次清除画布，然后变化后的时间补上
            // context.translate(width / 2, height / 2);//设置坐标轴原点
            context.translate(that.pos.x, that.pos.y);
            context.save();//保存中点坐标1
        }

        //绘制外面大圆
        function circle() {
            context.setLineWidth(2);
            context.beginPath();
            context.arc(0, 0, clockR, 0, 2 * Math.PI, true);
            context.closePath();
            context.stroke();
        }

        //绘制提醒文字
        function information() {
            var informationtext = "";
            if (!that.opening) {
                informationtext = "点按以开始工作";
            }
            else {
                if (that.waiting) {
                    if (that.working) {
                        informationtext = "点按以开始工作";
                    }
                    else {
                        informationtext = "点按以开始休息";
                    }
                }
                else {
                    if (that.working) {
                        var minute = (Array(2).join(0) + Math.floor(that.leftworkTime / 60)).slice(-2);
                        var second = (Array(2).join(0) + that.leftworkTime % 60).slice(-2);
                        informationtext = minute + ":" + second;
                    }
                    else {
                        var minute = (Array(2).join(0) + Math.floor(that.leftrestTime / 60)).slice(-2);
                        var second = (Array(2).join(0) + that.leftrestTime % 60).slice(-2);
                        informationtext = minute + ":" + second;
                    }
                }
            }
            that.information = that.taskName + " " + informationtext; //将任务名和时间连在一起
            if (that.callback) {
                that.callback(that.information);
            }
        }

        //绘制大格
        function bigGrid() {
            context.setLineWidth(5);
            for (var i = 0; i < 4; i++) {
                context.beginPath();
                context.rotate(Math.PI / 2);
                context.moveTo(clockR, 0);
                context.lineTo(clockR - 15, 0);
                context.stroke();
            }
        }

        //指针运动函数
        function move() {
            var t = new Date();//获取当前时间
            var h = t.getHours();//获取小时
            h = h > 12 ? (h - 12) : h;//将24小时制转化为12小时制
            var m = t.getMinutes();//获取分针
            var s = t.getSeconds();//获取秒针
            that.currentPos = (Math.PI / 30) * (m + s / 60);
            context.save();//再次保存2
            context.setLineWidth(4);
            //旋转角度=30度*（h+m/60+s/3600）
            //分针旋转角度=6度*（m+s/60）
            //秒针旋转角度=6度*s
            context.beginPath();
            //绘制时针
            context.rotate((Math.PI / 6) * (h + m / 60 + s / 3600));
            context.moveTo(-20, 0);
            context.lineTo(that.radius / 4.5 * 2, 0);
            context.stroke();
            context.restore();//恢复到2,（最初未旋转状态）避免旋转叠加
            context.save();//3
            //画分针
            context.setLineWidth(3);
            context.beginPath();
            context.rotate((Math.PI / 30) * (m + s / 60));
            context.moveTo(-20, 0);
            context.lineTo(that.radius / 3.5 * 2, 0);
            context.stroke();
            context.restore();//恢复到3，（最初未旋转状态）避免旋转叠加
            context.save();
            //绘制秒针
            context.setLineWidth(1);
            context.setStrokeStyle("red");
            context.beginPath();
            context.rotate((Math.PI / 30) * s);
            context.moveTo(-20, 0);
            context.lineTo(that.radius / 3 * 2, 0);
            context.stroke();
            context.restore();
            if (that.pausing) {//移动扇形
                var deltaAng = (Math.PI / 30) / 60;
                that.startPos += deltaAng;
                that.finishPos += deltaAng;
                that.restfinishPos += deltaAng;
            }
        }

        //绘制扇形工作区
        function work() {
            context.setLineWidth(1);
            context.setStrokeStyle("orange");
            context.beginPath();
            context.arc(0, 0, clockR, that.startPos, that.finishPos, false);
            context.arc(0, 0, clockR - 15, that.finishPos, that.startPos, true);
            context.closePath();
            context.stroke();
        }

        //绘制扇形休息区
        function rest() {
            context.setLineWidth(1);
            context.setStrokeStyle("green");
            context.beginPath();
            context.arc(0, 0, clockR, that.finishPos, that.restfinishPos, false);
            context.arc(0, 0, clockR - 15, that.restfinishPos, that.finishPos, true);
            context.closePath();
            context.stroke();
        }

        //绘制扇形剩余工作区
        function left() {
            context.setLineWidth(1);
            context.setStrokeStyle("red");
            context.beginPath();
            context.arc(0, 0, clockR, that.currentPos, that.finishPos, false);
            context.arc(0, 0, clockR - 15, that.finishPos, that.currentPos, true);
            context.closePath();
            context.stroke();
        }

        //绘制扇形剩余休息区
        function left2() {
            context.setLineWidth(1);
            context.setStrokeStyle("red");
            context.beginPath();
            context.arc(0, 0, clockR, that.currentPos, that.restfinishPos, false);
            context.arc(0, 0, clockR - 15, that.restfinishPos, that.currentPos, true);
            context.closePath();
            context.stroke();
        }

        //工作结束提醒
        function workfinishRing() {
            if (getApp().globalData.vibrate) {
                wx.vibrateLong({});
            }
        }

        //休息结束提醒
        function restfinishRing() {
            if (getApp().globalData.vibrate) {
                wx.vibrateLong({});
            }
        }

        //调用
        function drawClock() {
            reSet();
            circle();
            information();
            context.rotate(-Math.PI / 2);//时间从3点开始，倒转90度
            bigGrid();
            move();
            if (that.opening) {
                if (that.waiting) {
                    if (that.working) {
                        restfinishRing();
                        that.leftrestTime--;
                        if (that.leftrestTime < -20) {
                            that.stop();
                        }
                    }
                    else {
                        workfinishRing();
                        that.leftworkTime--;
                        if (that.leftworkTime < -20) {
                            that.stop();
                        }
                    }
                }
                else {
                    if (that.working) {
                        work();
                        //rest();
                        left();
                        if (!that.pausing) {
                            that.leftworkTime--;
                            if (that.leftworkTime <= 0) {
                                that.working = false;
                                that.startWait();
                            }
                        }
                    }
                    else {
                        rest();
                        left2();
                        if (!that.pausing) {
                            that.leftrestTime--;
                            if (that.leftrestTime <= 0) {
                                that.working = true;
                                that.startWait();
                            }
                        }
                    }
                }
            }
        }

        drawClock();//调用运动函数
// 调用 wx.drawCanvas，通过 canvasId 指定在哪张画布上绘制，通过 actions 指定绘制行为
        wx.drawCanvas({
            canvasId: 'myCanvas',
            actions: context.getActions()
        })
    }
};

function createClock(radius, x, y, totalTime, restTime) {
    var res = Object.create(clockBase);
    res.radius = radius;
    res.pos.x = x;
    res.pos.y = y;
    res.totaltime = totalTime;
    res.resttime = restTime;
    return res;
}

module.exports = {
    createClock: createClock
};