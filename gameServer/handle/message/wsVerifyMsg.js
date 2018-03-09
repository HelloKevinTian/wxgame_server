'use strict';
/**
 *  客户端数据安全验证
 */
var logger = require('ss-logger').getLogger(__filename);
var protoManager = require('../../proto/ProtoManager');

/**
 *  协议逻辑处理
 * @param {Object} args 数据包
 * @param {Function} endcb 回包回调函数
 * @param {Function} result 验证结果回调
 * @param {Object} socket 客户端对象
 * @param {string} urlpath 通讯协议
 */
function handle(args, result, socket, urlpath) {

	// 解析数据包
	args = protoManager.Decode(args);
	logger.debug('Client args: ', JSON.stringify(args));

	// // 黑名单
	// if( socket.backlist ){
	// 	return;
	// }
	// // 账号清理
	// if( socket.clean ){
	// 	return;	
	// };
	// // 账号被踢下线
	// if( socket.conflict ){
	// 	return;	
	// };
	
	// // 校验账号信息
	// if( urlpath != 'login' && urlpath != 'reconnection' && !socket.uid ){
	// 	logger.error('账号信息错误');
	// 	return;
	// }
	// 通讯时间戳
	socket.timestamp = Date.now();
	// 参数检验完成
	result(false, args);
};


/**
 * 导出函数列表
 */
module.exports = {
	'handle': handle
};