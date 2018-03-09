'use strict';
/**
 *  socket连接处理
 */
var logger = require('ss-logger').getLogger(__filename);

function handle(socket) {
	socket.heartbeatSwitch = true; //开启心跳

	socket.isLogin = false; //初始化登录状态
};

module.exports = {
	'handle': handle
};