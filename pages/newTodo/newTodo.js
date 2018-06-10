// pages/newTodo/newTodo.js

var backend = require('../../backend');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        workTime: 0,
        restTime: 0,
        targetNum: 0
    },

    createnewtodo: function (e) {
        backend.createTodoNow(e.detail.value, function () {
            wx.navigateTo({
                url: '/pages/todo/todo'
            });
        });
    },

    worksliderchange: function (e) {
        this.setData({
            workTime: e.detail.value
        });
    },

    restsliderchange: function (e) {
        this.setData({
            restTime: e.detail.value
        });
    },

    totalsliderchange: function (e) {
        this.setData({
            targetNum: e.detail.value
        });
    }
});