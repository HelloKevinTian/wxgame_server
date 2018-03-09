'use strict';
/**
 *  客户端数据安全验证
 */
var logger = require('ss-logger').getLogger(__filename);
var request = require('request');
var protoManager = require('../../proto/ProtoManager');
var async = require('async');
var _ = require('underscore');

var PRIVATE_KEY = '_cs2_tcp_20170224';

/**
 * 消息验证逻辑
 */
function handle(args, endcb, socket) {
	if (socket.destroyed) {
		return logger.error('[Error] socket already destroyed!');
	}

	// if (args.head.op == 'login') { //verify code
	// 	var serverMd5 = UTIL.md5(args.uid + args.time + PRIVATE_KEY);
	// 	if (serverMd5 !== args.code) {
	// 		return logger.error('[Error] client verify error!', serverMd5, args.code);
	// 	}
	// } else if (!socket.isLogin) {
	// 	logger.error('[Error] not login!');
	// 	return socket.sendError(CONST.CODE.NOT_LOGIN, args.head.flowid);
	// }

	// 通讯时间戳，用于检查心跳
	socket.timestamp = Date.now();

	endcb(false, args);
};

module.exports = {
	'handle': handle
};