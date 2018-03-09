'use strict';
/**
 *  socket断开连接处理
 */
var logger = require('ss-logger').getLogger(__filename);
var async = require('async');
var _ = require('underscore');

var playerMgr = require('../../app/playerMgr').getInstance();
var channelMgr = require('../../app/channelMgr').getInstance();

function handle(socket, had_error) {
	if (!socket.uid) {
		return;
	}

	logger.info('[%s disconnect...]', socket.uid);
	playerMgr.deletePlayer(socket.uid);

};

module.exports = {
	'handle': handle
};