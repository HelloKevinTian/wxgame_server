// var io = require('socket.io');
var io = require('socket.io-client');
var logger = require('ss-logger').getLogger(__filename);
var protoManager = require('./proto/ProtoManager');
var readline = require('readline');

protoManager.LoadAllProtoFile();

var configObj = require('./cfg/server');
var config;
for (var i = 0; i < configObj.length; i++) {
	if (configObj[i].type == 'ws') {
		config = configObj[i];
		break;
	}
};

if (!config) {
	return logger.error('no tcp server');
}

var client = io('http://127.0.0.1:30006');

var sendMsg = {
	'login': function() {
		var msg = protoManager.NewMessage('c2s_login', {
			'head': {
				token: '',
				uid: '100001',
				flowid: 1,
				version: '1.0.0',
				channel: 'template',
				op: 'login'
			}
		});
		client.sendData(msg, 'message_c2s_login', 'login');
	},
	'getTime': function() {
		var msg = protoManager.NewMessage('c2s_get_time', {
			'head': {
				token: '',
				uid: '100001',
				flowid: 1,
				version: '1.0.0',
				channel: 'template',
				op: 'getTime'
			}
		});
		client.sendData(msg, 'message_c2s_get_time', 'getTime');
	}
}

client.sendData = function(data, protoName, name) {
	var buf = protoManager.Encode(data, protoName);

	client.emit(name, buf);
}

go();

function go() {
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	function answer() {
		rl.question("please enter op:", function(answer) {
			if (sendMsg[answer]) {
				sendMsg[answer]();
			}

			setTimeout(loop, 3000);
		});
	}

	function loop() {
		answer();
	}

	loop();

	var msgList = protoManager.GetMessage('GAME_PROTOCOL_MSG_ID');
	var onList = Object.keys(msgList).filter(function(value) {
		return value.indexOf('message_s2c') > -1;
	});

	onList.forEach(function(value) {
		client.on(value, function(buf) {
			var msg = protoManager.Decode(buf);
			logger.info('收到服务器的数据[%s]: ', value, msg);
		});
	});
}