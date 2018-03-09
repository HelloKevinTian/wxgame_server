'use strict';
var logger = require('ss-logger').getLogger(__filename);
var CronJob = require('cron').CronJob;
var mongo = require('ss-mongo');
var _ = require('underscore');
var async = require('async');

var dayJob = '00 00 00 * * 0-6'; // 每天凌晨执行一次
var secondJob = '* * * * * *'; //每秒执行一次
var tenSecondJob = '*/10 * * * * *'; //每10秒一次
var twentySecondJob = '*/20 * * * * *'; //每20秒一次
var tenMinJob = '*/10 * * * *'; //10分钟一次
var oneMinJob = '*/1 * * * *'; //1分钟一次

var broadcastMgr = module.exports;

broadcastMgr.init = function() {
	// gameBroadcast();
}

function gameBroadcast() {
	var job = new CronJob({
		cronTime: tenMinJob,
		onTick: function() {
			//TODO
		},
		start: true, //是否直接开始执行调度
		timeZone: 'Asia/Shanghai' //时区
	});
}