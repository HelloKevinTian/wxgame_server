'use strict';
var logger = require('ss-logger').getLogger(__filename);
var proto = require('../../proto/ProtoManager');
var async = require('async');
var _ = require('underscore');

var playerMgr = require('../../app/playerMgr').getInstance();
var channelMgr = require('../../app/channelMgr').getInstance();

function handle(args, client) {
	if (client.isLogin) {
		return client.sendError(CONST.CODE.ALREADY_LOGIN, args.head.flowid);
	}
	var uid = args.head.uid;

	client.isLogin = true; //设置登录状态

	var login = function() {
		playerMgr.addPlayer({
			'uid': uid,
			'socket': client
		});

		client.uid = uid;
		client.version = args.head.version;
		client.channel = args.head.channel;

		var msg = proto.NewMessage('s2c_login', {
			'tail': {
				'time': Math.floor(Date.now()),
				'flowid': args.head.flowid
			}
		});
		client.sendMessage(msg, 'message_s2c_login');
	}

	/**************************************************************************************************/
	cleanup(uid, function() {
		login();
	});
	/***************************************************************************************************/
};

/**
 * 登录首先清理玩家残留信息
 */
function cleanup(uid, cb) {
	var player = playerMgr.getPlayer(uid);

	if (!player || !player.uid || !player.socket) {
		return cb();
	}

	playerMgr.deletePlayer(player.socket.uid);

	cb();
};

module.exports = {
	'handle': handle
};