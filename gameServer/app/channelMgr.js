var logger = require('ss-logger').getLogger(__filename);

var initChannel = 20;

var channelMgr = function() {
	this.chanList = {};

	for (var i = 1; i <= initChannel; i++) {
		this.chanList[i] = {
			'list': [],
			'num': 0
		};
	};
};

channelMgr.prototype.print = function() {
	var printObj = {};

	for (var k in this.chanList) {
		printObj[k] = this.chanList[k].num;
	}

	logger.info('channelMgr print: ', JSON.stringify(printObj));
}

channelMgr.prototype.getUserNum = function(channelId) {
	return (this.chanList[channelId] && this.chanList[channelId].num) ? this.chanList[channelId].num : 0;
}

/**
 * 找到一个人数未达上限且数值最小的聊天渠道号
 */
channelMgr.prototype.findAndJoinChannel = function(uid) {
	var hasFind = null;
	for (var k in this.chanList) {
		if (this.chanList[k].num < CONST.CHAT_CHANNEL_MAX_PLAYER_NUM) {
			if (this.chanList[k].list.indexOf(uid) == -1) {
				this.chanList[k].list.push(uid);
				this.chanList[k].num++;
			}
			hasFind = k;
			break;
		}
	}

	if (!hasFind) {
		hasFind = initChannel + 1;
		this.chanList[hasFind] = {
			'list': [uid],
			'num': 1
		};
		initChannel++;
	}
	this.print();
	return hasFind;
}

channelMgr.prototype.joinChannel = function(channelId, uid) {
	if (!this.chanList.hasOwnProperty(channelId)) {
		this.chanList[channelId] = {
			'list': [],
			'num': 0
		};
	}

	if (this.chanList[channelId].num > CONST.CHAT_CHANNEL_MAX_PLAYER_NUM) {
		return CONST.CODE.CHANNEL_IS_FULL;
	} else if (this.chanList[channelId].list.indexOf(uid) == -1) {
		this.chanList[channelId].list.push(uid);
		this.chanList[channelId].num++;
	}
	this.print();
}

channelMgr.prototype.leaveChannel = function(channelId, uid) {
	if (!this.chanList.hasOwnProperty(channelId)) {
		return;
	}
	var index = this.chanList[channelId].list.indexOf(uid);
	if (index > -1) {
		this.chanList[channelId].list.splice(index, 1);
		this.chanList[channelId].num--;
	}
	if (channelId > 20 && this.chanList[channelId].num <= 0) {
		delete this.chanList[channelId];
	}
	this.print();
}

/**
 * 聊天广播
 */
channelMgr.prototype.broadcast = function(channelId, msg, blackList) {
	var playerMgr = require('./playerMgr').getInstance();

	var list = this.chanList[channelId].list;
	for (var i = 0; i < list.length; i++) {
		var uid = list[i];
		if (blackList.indexOf(uid) == -1) {
			var player = playerMgr.getPlayer(uid);
			if (player) {
				player.socket.sendMessage(msg);
			}
		}
	};
}

var instance = null;

function getInstance() {
	if (!instance) {
		instance = new channelMgr();
	}
	return instance;
}

module.exports = {
	'getInstance': getInstance
};