/**
 * playerMgr
 */
var logger = require('ss-logger').getLogger(__filename);

var playerMgr = function() {
	this.playerNum = 0;
	this.playerList = {};
};

playerMgr.prototype.print = function() {
	logger.info('当前在线玩家统计: ', this.playerNum);
}

playerMgr.prototype.getPlayerNum = function() {
	return this.playerNum;
}

playerMgr.prototype.getPlayer = function(uid) {
	if (this.playerList.hasOwnProperty(uid)) {
		return this.playerList[uid];
	} else {
		// logger.info('getPlayer: not exist');
	}
}

playerMgr.prototype.addPlayer = function(player) {
	if (!player || typeof player !== 'object') {
		logger.error('addPlayer: not a player');
		return;
	}
	if (!player.uid) {
		logger.error('addPlayer: no uid');
		return;
	}
	if (!this.playerList.hasOwnProperty(player.uid)) {
		this.playerNum++;
	}
	this.playerList[player.uid] = player;
	this.print();
}

playerMgr.prototype.updatePlayer = function(uid, newObj) {
	if (this.playerList.hasOwnProperty(uid)) {
		for (var k in newObj) {
			this.playerList[uid][k] = newObj[k];
		}
		return this.playerList[uid];
	} else {
		logger.error('updatePlayer: not exist');
	}
}

playerMgr.prototype.deletePlayer = function(uid) {
	if (this.playerList.hasOwnProperty(uid)) {
		this.playerNum--;
		delete this.playerList[uid];
		this.print();
	} else {
		logger.error('deletePlayer: not exist');
	}
}

playerMgr.prototype.getAllPlayer = function() {
	return this.playerList;
}

playerMgr.prototype.clear = function() {
	this.playerList = {};
	this.playerNum = 0;
}

playerMgr.prototype.broadcast = function(message) {
	for (var k in this.playerList) {
		if (this.playerList[k].socket) {
			this.playerList[k].socket.sendMessage(message);
		}
	}
}


var instance = null;

function getInstance() {
	if (!instance) {
		instance = new playerMgr();
	}
	return instance;
}

module.exports = {
	'getInstance': getInstance
};