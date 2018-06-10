//index.js
var config = require('../../config')

var exports=require('../../backend')

Page({
    data: {
        userInfo: {},
        logged: false, 
        returnedData: {},
        clockInfo: "开始番茄！",
        tomatoTime: 25,
        restTime: 5,
        // 默认是倒计时
        todoForm: 2
    },

    
    // 登录（此时会检查并且返回番茄状态，如果番茄过期则会返回的data.tomatoInfo.state="passedAndPaused"，可以弹出一个提示询问是否继续，继续则调用pauseOperation即可
    login: exports.login,

    // 这个是按下创建按钮时；现在正计时可能没有时间做了
    createTodoNow: exports.createTodoNow,

    // 直接点击开始番茄按钮，通过data里面的设置来设定状态
    clockOperation: exports.clockOperation,

    // 一个用来同步时间的
    updateOperation: exports.updateOperation,

    // 暂停按钮，虽然我觉得既然要番茄就是不想要暂停的啊……无所谓了反正都是在咸鱼
    pauseOperation: exports.pauseOperation,

    // 停止按钮，定了番茄又停止可太咸鱼了
    stopOperation: exports.stopOperation,

    // 查找todo的按钮
    // 注意：在之前的开始、更新、暂停、停止操作中，都已经返回了todoInfo，在这时应该保存（如果不想保存的话就在后端别返回这些了）
    // 所以应该是基于这些来进行的
    getTodoSubmit: exports.getTodoSubmit,

    // 执行todo的按钮
    startTodoSubmit: exports.startTodoSubmit,

    // 查找userinfo的按钮
    // 注意：之前只有登陆的时候返回了userinfo，但是中间的完成番茄操作会改变userinfo，所以记得要改！
    // 注意：一天的定义是从早上3点到第二天早上三点！
    getUserInfoSubmit: exports.getUserInfoSubmit,
})
