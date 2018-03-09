'use strict';
var logger = require('ss-logger').getLogger(__filename);
var CronJob = require('cron').CronJob;
var mongo = require('ss-mongo');
var _ = require('underscore');
var async = require('async');

var playerMgr = require('./playerMgr').getInstance();

var dayJob = '00 00 00 * * 0-6'; // 每天凌晨执行一次
var secondJob = '* * * * * *'; //每秒执行一次
var tenSecondJob = '*/10 * * * * *'; //每10秒一次
var twentySecondJob = '*/20 * * * * *'; //每20秒一次
var tenMinJob = '*/10 * * * *'; //10分钟一次

var HEARTBEAT_TIME = 1000 * 30;

var cronMgr = module.exports;

cronMgr.init = function() {
	if (CONST.HEART_BEAT_SWITCH) {
		logger.info('cronMgr init');
		checkHeartbeat();
	}
}

function foreachObj(callback) {
	var playerList = playerMgr.getAllPlayer();
	for (var i in playerList) {
		callback(playerList[i]);
	}
}

/**
 * heartbeatSwitch为心跳检查开关
 */
function onUpdateCheck() {
	foreachObj(function(player) {
		if (!player.socket) {
			return;
		}
		// 通讯间隔超时
		if (player.socket.heartbeatSwitch && player.socket.timestamp && (Date.now() - player.socket.timestamp) > HEARTBEAT_TIME) {
			//踢人
			logger.warn('【heartbeat】心跳踢人[%s]，超时毫秒数：[%s]', player.socket.uid, Date.now() - player.socket.timestamp);
			player.socket.emit('c_close');
		}
	});
};

function checkHeartbeat() {
	var job = new CronJob({
		cronTime: tenSecondJob,
		onTick: function() {
			onUpdateCheck();
			// logger.info('Player Heartbeat Check', process.game_config);
		},
		start: true, //是否直接开始执行调度
		timeZone: 'Asia/Shanghai' //时区
	});
};