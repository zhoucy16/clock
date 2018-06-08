/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://sgoysnvt.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/login.php`,

        // 用于创建todo
        createTodoUrl: `${host}/newTodo.php`,

        // 用于直接创建番茄并且启动：
        createTomatoUrl: `${host}/newTomato.php`,

        updateTomatoUrl: `${host}/updateTomato.php`,

    }
};

module.exports = config;