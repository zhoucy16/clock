// 获取应用实例  
Page({
  data: {
    width: 0,
    height: 0,
    startPos: 0,
    totaltime: getApp().globalData.totalTime,
    currentPos: 0,
    finishPos: 0,
    resttime: getApp().globalData.restTime,
    restfinishPos: 0,
    leftworkTime: 0,
    leftrestTime: 0,
    information: "",
    working: false,
    opening: false,
    waiting: false
  },
  //onLoad生命周期函数，监听页面加载  
  onLoad: function () {
    //将全局变量Index保存在that中，里面函数调用  
    var that = this
    //获取系统信息  
    wx.getSystemInfo({
      //获取系统信息成功，将系统窗口的宽高赋给页面的宽高  
      success: function (res) {
        that.width = res.windowWidth
        that.height = res.windowHeight
      }
    })
  },
  //onReady生命周期函数，监听页面初次渲染完成  
  onReady: function () {
    //调用canvasClock函数  
    this.canvasClock()
    //对canvasClock函数循环调用  
    this.interval = setInterval(this.canvasClock, 1000)
  },
  canvasClock: function () {
    var context = wx.createContext()//创建并返回绘图上下文（获取画笔）  
    //设置宽高  
    var width = this.width
    var height = this.height 
    var clockR = width / 2 - 60;
    var that = this;
    //重置画布函数  
    function reSet() {
      context.height = context.height;//每次清除画布，然后变化后的时间补上  
      context.translate(width / 2, height / 2);//设置坐标轴原点  
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
      if(!that.data.opening){
        informationtext = "welcome";
      }
      else{
        if(that.data.waiting){
          if(that.data.working){
            informationtext = "点按以开始工作";
          }
          else{
            informationtext = "点按以开始休息";
          }
        }
        else{
          if(that.data.working){
            var minute = (Array(2).join(0) + Math.floor(that.data.leftworkTime / 60)).slice(-2);
            var second = (Array(2).join(0) + that.data.leftworkTime % 60).slice(-2);
            informationtext = minute + ":" + second;
          }
          else{
            var minute = (Array(2).join(0) + Math.floor(that.data.leftrestTime / 60)).slice(-2);
            var second = (Array(2).join(0) + that.data.leftrestTime % 60).slice(-2);
            informationtext = minute + ":" + second;
          }
        }
      }
      that.setData({
        information: informationtext
      })
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
      that.setData({
        currentPos: (Math.PI / 30) * (m + s / 60)
      });  
      context.save();//再次保存2  
      context.setLineWidth(4);
      //旋转角度=30度*（h+m/60+s/3600）  
      //分针旋转角度=6度*（m+s/60）  
      //秒针旋转角度=6度*s  
      context.beginPath();
      //绘制时针  
      context.rotate((Math.PI / 6) * (h + m / 60 + s / 3600));
      context.moveTo(-20, 0);
      context.lineTo(width / 4.5 - 20, 0);
      context.stroke();
      context.restore();//恢复到2,（最初未旋转状态）避免旋转叠加  
      context.save();//3  
      //画分针  
      context.setLineWidth(3);
      context.beginPath();
      context.rotate((Math.PI / 30) * (m + s / 60));
      context.moveTo(-20, 0);
      context.lineTo(width / 3.5 - 20, 0);
      context.stroke();
      context.restore();//恢复到3，（最初未旋转状态）避免旋转叠加  
      context.save();
      //绘制秒针  
      context.setLineWidth(1);
      context.setStrokeStyle("red");
      context.beginPath();
      context.rotate((Math.PI / 30) * s);
      context.moveTo(-20, 0);
      context.lineTo(width / 3 - 20, 0);
      context.stroke();
      context.restore();
    }
    //绘制扇形工作区
    function work() {
      context.setLineWidth(1);
      context.setStrokeStyle("orange");
      context.beginPath();
      context.arc(0, 0, clockR, that.data.startPos, that.data.finishPos, false);
      context.arc(0, 0, clockR - 15, that.data.finishPos, that.data.startPos, true);
      context.closePath();
      context.stroke();
    }
    //绘制扇形休息区
    function rest() { 
      context.setLineWidth(1);
      context.setStrokeStyle("green");
      context.beginPath();
      context.arc(0, 0, clockR, that.data.finishPos, that.data.restfinishPos, false);
      context.arc(0, 0, clockR - 15, that.data.restfinishPos, that.data.finishPos, true);
      context.closePath();
      context.stroke();
    }
    //绘制扇形剩余工作区
    function left() {
      context.setLineWidth(1);
      context.setStrokeStyle("red");
      context.beginPath();
      context.arc(0, 0, clockR, that.data.currentPos, that.data.finishPos, false);
      context.arc(0, 0, clockR - 15, that.data.finishPos, that.data.currentPos, true);
      context.closePath();
      context.stroke();
    }
    //绘制扇形剩余休息区
    function left2() {
      context.setLineWidth(1);
      context.setStrokeStyle("red");
      context.beginPath();
      context.arc(0, 0, clockR, that.data.currentPos, that.data.restfinishPos, false);
      context.arc(0, 0, clockR - 15, that.data.restfinishPos, that.data.currentPos, true);
      context.closePath();
      context.stroke();
    }
    //工作结束提醒
    function workfinishRing() {
      if (getApp().globalData.vibrate) {
        wx.vibrateLong({

        });
      }
    }
    //休息结束提醒
    function restfinishRing() {
      if (getApp().globalData.vibrate) {
        wx.vibrateLong({

        });
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
      if (that.data.opening){
        if(that.data.waiting){
          if(that.data.working){
            restfinishRing();
          }
          else{
            workfinishRing();
          }
        }
        else{
          if (that.data.working) {
            that.setData({
              leftworkTime: that.data.leftworkTime - 1
            })
            work();
            //rest();
            left();
            if (that.data.leftworkTime < 0) {
              that.setData({
                working: false,
                waiting: true
              })
            }
          }
          else {
            that.setData({
              leftrestTime: that.data.leftrestTime - 1
            })
            rest();
            left2();
            if (that.data.leftrestTime < 0) {
              that.setData({
                working: true,
                waiting: true,
              })
            }
          }
        }
        
      }
    }
    drawClock()//调用运动函数  
    // 调用 wx.drawCanvas，通过 canvasId 指定在哪张画布上绘制，通过 actions 指定绘制行为  
    wx.drawCanvas({
      canvasId: 'myCanvas',
      actions: context.getActions()
    })
  },
  //页面卸载，清除画布绘制计时器  
  onUnload: function () {
    clearInterval(this.interval)
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

  gototodolist: function () {
    wx.navigateTo({
      url: '/pages/todo/todo'
    })
  },

  share: function () {

  },

  onetap: function () {
    var t = new Date();//获取当前时间  
    var h = t.getHours();//获取小时  
    h = h > 12 ? (h - 12) : h;//将24小时制转化为12小时制  
    var m = t.getMinutes();//获取分针  
    var s = t.getSeconds();//获取秒针
    var start = (Math.PI / 30) * (m + s / 60);
    var total = (Math.PI / 30) * (getApp().globalData.totalTime / 60);
    var rest = (Math.PI / 30) * (getApp().globalData.restTime / 60);

    
    if(this.data.opening){
      if (this.data.waiting) {
        this.setData({
          waiting: false
        })
        if (this.data.working) {
          this.setData({
            startPos: start,
            currentPos: start,
            finishPos: start + total,
            restfinishPos: start + total + rest,
            leftworkTime: getApp().globalData.totalTime,
            leftrestTime: getApp().globalData.restTime
          })
        }
        else{
          this.setData({
            startPos: start,
            currentPos: start,
            finishPos: start,
            restfinishPos: start + rest,
            leftworkTime: getApp().globalData.totalTime,
            leftrestTime: getApp().globalData.restTime
          })
        }
        return;
      }
      else{
        this.setData({
          opening: false,
          waiting: false
        });
        return;
      } 
    }
    
    this.setData({
      startPos: start,
      currentPos: start,
      finishPos: start+total,
      restfinishPos: start+total+rest,
      working: true,
      opening: true,
      waiting: false,
      leftworkTime: getApp().globalData.totalTime,
      leftrestTime: getApp().globalData.restTime
    });
    console.log(this.data);
  },
})