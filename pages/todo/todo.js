var backend = require('../../backend');

Page({
    data: {
        todo: '',
        todos: [],
        done: [],
        leftCount: 1,
        allFinished: false,
        allSetting: true,
        clearSetting: true,
        navbar: ['todo', 'done'],
        currentTab: 0,
    },

    refresh: function () {
        var page = this;
        backend.getTodoSubmit({
            start: 0,
            num: 100
        }, function (res) {
            page.setData({
                todos: res.todoInfo.notFinished,
                done: res.todoInfo.finished
            });
        });
    },

    navbarTap: function (e) {
        var that = this;
        that.setData({
            currentTab: e.currentTarget.dataset.idx
        })
    },

    onShow: function () {
        this.refresh();
    },

    createnewtodo: function (e) {
        wx.navigateTo({url: '/pages/newTodo/newTodo'})
    },

    startTodo: function (e) {
        var flag = getApp().globalData.nowInTomato;
        console.log('flag: ' + flag);
        if (flag !== 0) {
            console.log('please finish the current one first!');
            wx.showModal({
                title: '提示',
                content: '你还有未完成的番茄',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            });
            return;
        }
        var todo_id = parseInt(e.target.id);
        backend.startTodoSubmit({
            todoNum: todo_id
        });
        wx.navigateTo({
            url: '/pages/clock/clock'
        });
    }
});
