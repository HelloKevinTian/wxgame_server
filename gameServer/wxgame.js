'use strict';
/**
 * 服务器入口
 */
var app = require('ss-server');
var logger = require('ss-logger').getLogger(__filename);
var mongo = require('ss-mongo');
var fs = require('fs');
var protoManager = require('./proto/ProtoManager');

if (0) { //单进程模型，暂不使用
	global.UTIL = require('./util/util');
	global.CONST = require('./util/const');

	/**
	 *  修改框架配置
	 */
	app.configure('server', 'cfg/server.json');
	app.configure('handle', 'cfg/handle.json');
	app.configure('cluster', false); //tcp不能开启集群模式

	/**
	 * 添加mongodb读写组件
	 */
	mongo.configure('cfg/mongo.json');
	logger.info('添加mongodb读写组件');

	/**
	 * 添加proto管理器
	 */
	app.configure('proto', function() {
		protoManager.LoadAllProtoFile();
		logger.info('添加proto管理器');
	});

	/**
	 * app目录模块涉及游戏初始化动作，必须仅在主进程中启动一次！
	 */
	var files = fs.readdirSync('./app/');
	files.forEach(function(value) {
		var appModule = require('./app/' + value);
		for (var j in appModule) {
			if (j === 'init') {
				appModule.init();
				break;
			}
		}
	});
} else { //多进程模型
	app.configure('server', 'cfg/server.json');
	app.configure('handle', 'cfg/handle.json');
}

/**
 *  开启服务器
 */
app.start();