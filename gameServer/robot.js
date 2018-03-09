var logger = require('ss-logger').getLogger(__filename);
var ExBuffer = require('ExBuffer');
var net = require('net');
var util = require('./util/util');
var async = require('async');

var config = require('./cfg/server');

require('events').EventEmitter.prototype._maxListeners = 10000;

//测试客户端
var exBuffer = new ExBuffer().uint32Head().littleEndian();

var startIndex = 1000000;

var processNum = process.argv[2];
var robotNumPerProcess = process.argv[3];

for (var i = 1; i <= robotNumPerProcess; i++) {
    (function(k) {
        var uid = (processNum * startIndex + k).toString();
        createRobot(uid, k);
    }(i));
};

//1：空tcp连接
//2：广播
//3：模拟玩家操作
var TEST_CASE = 2;

function createRobot(uid, index) {
    var client = new net.Socket();

    client.sendData = function(data) {
        if (client.destroyed) {
            return;
        }
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }

        var len = Buffer.byteLength(data);

        //写入4个字节表示本次包长
        var headBuf = new Buffer(4);
        headBuf.writeUInt32LE(len, 0);
        client.write(headBuf);

        var bodyBuf = new Buffer(len);
        bodyBuf.write(data);
        client.write(bodyBuf);
    }

    client.connect(30001, '117.121.57.150', function() {
        if (TEST_CASE == 1) {
            //nothing to do
        } else if (TEST_CASE == 2) {
            broadcast(client, uid, index);
        } else if (TEST_CASE == 3) {
            play(client, uid, index);
        }
    });

    client.on('data', function(data) {
        // logger.info('>> 收到原始数据:', data.length, data.toString());
        exBuffer.put(data);
    });

    exBuffer.on('data', function(buffer) {
        // logger.info('>> 收到服务器的数据:', buffer.length, buffer.toString());
    });

    client.on('close', function() {
        logger.debug('Connection closed');
    });

    client.on("error", function(err) {
        logger.error('client error: ', err.stack);
    });
}

var PRIVATE_KEY = '_cs2_tcp_20170224';

function broadcast(client, uid, index) {
    async.auto({
        login: function(callback) {
            login(client, uid);
            setTimeout(function() {
                callback(null, 'login');
            }, (10 + (index - 1) * 5) * 1000);
        },
        sendChatMessage: ['login', function(callback) {
            sendChatMessage(client, uid);
            callback(null, 'sendChatMessage');
        }]
    }, function(err, results) {
        logger.info('压测结束: ', uid, err, results);
        client.destroy();
    });
}

//---------------------------------模拟玩家操作测试-------------------------------------
function play(client, uid, index) {

    var t0 = setInterval(function() {
        heartbeat(client, uid);
    }, 10000);

    async.auto({
        login: function(callback) {
            login(client, uid);
            setTimeout(function() {
                callback(null, 'login');
            }, 5000);
        },
        getRoomList: ['login', function(callback) {
            getRoomList(client, uid);
            setTimeout(function() {
                callback(null, 'getRoomList');
            }, 5000);
        }],
        quickRoom: ['getRoomList', function(callback) {
            quickRoom(client, uid);
            setTimeout(function() {
                callback(null, 'quickRoom');
            }, 5000);
        }],
        getUserInfo: ['quickRoom', function(callback) {
            getUserInfo(client, uid);
            setTimeout(function() {
                callback(null, 'getUserInfo');
            }, 5000);
        }],
        readyGame: ['getUserInfo', function(callback) {
            readyGame(client, uid);
            setTimeout(function() {
                callback(null, 'readyGame');
            }, 5000);
        }],
        finishGame: ['readyGame', function(callback) {
            finishGame(client, uid);
            callback(null, 'finishGame');
        }]
    }, function(err, results) {
        clearInterval(t0);
        logger.info('压测结束: ', uid, err, results);
        client.destroy();
    });
}

function battle(client, uid, index) {
    async.auto({
        login: function(callback) {
            login(client, uid);
            setTimeout(function() {
                callback(null, 'login');
            }, (3 + (index - 1) * 5) * 1000);
        },
        synPlayerLocation: ['login', function(callback) {
            var t = setInterval(function() {
                synPlayerLocation(client, uid);
            }, 500);
            setTimeout(function() {
                clearInterval(t);
                callback(null, 'synPlayerLocation');
            }, 60000);
        }],
        synPlayerAction: ['login', function(callback) {
            var t = setInterval(function() {
                synPlayerAction(client, uid);
            }, 500);
            setTimeout(function() {
                clearInterval(t);
                callback(null, 'synPlayerAction');
            }, 60000);
        }]
    }, function(err, results) {
        clearInterval(t0);
        logger.info('压测结束: ', uid, err, results);
    });
}
//---------------------------------模拟玩家操作测试-------------------------------------

function login(client, uid) {
    logger.info('login:', uid);
    var nowTime = '' + Date.now();
    client.sendData({
        'op': 'login',
        'time': nowTime,
        'version': '1.3.0',
        'channel': '999999',
        'uid': uid,
        'code': util.md5(uid + nowTime + PRIVATE_KEY)
    });
}

function heartbeat(client, uid) {
    logger.info('heartbeat:', uid);
    client.sendData({
        'op': 'heartbeat'
    });
}

function getRoomList(client, uid) {
    logger.info('getRoomList:', uid);
    client.sendData({
        'op': 'getRoomList',
        'skip_num': 0,
        'limit_num': 100,
        'type': 1,
        'level': 1
    });
}

function quickRoom(client, uid) {
    logger.info('quickRoom:', uid);
    client.sendData({
        'op': 'quickRoom',
        'type': 1,
        'level': 1
    });
}

function leaveRoom(client, uid) {
    logger.info('leaveRoom:', uid);
    client.sendData({
        'op': 'leaveRoom'
    });
}

function synPlayerLocation(client, uid) {
    logger.info('synPlayerLocation:', uid);
    client.sendData({
        'op': 'synPlayerLocation',
        'location': {
            'posx': 100,
            'posy': 85,
            'speed': '388'
        },
        'room_id': 1
    });
}

function synPlayerAction(client, uid) {
    logger.info('synPlayerAction:', uid);
    client.sendData({
        'op': 'synPlayerAction',
        'action': '1',
        'param1': '100',
        'param2': '200',
        'room_id': 1
    });
}

function readyGame(client, uid) {
    logger.info('readyGame:', uid);
    client.sendData({
        'op': 'readyGame',
        'start_flag': Math.random() > 0.7 ? 1 : 0
    });
}

function finishGame(client, uid) {
    logger.info('finishGame:', uid);
    client.sendData({
        'op': 'finishGame',
        'is_complete': 1,
        'race_distance': 10000,
        'game_time': Math.floor(Math.random() * 100),
        'game_distance': Math.floor(Math.random() * 10000),
        'game_score': Math.floor(Math.random() * 100),
        'coin': 500 + Math.floor(Math.random() * 500),
        'car_power': 200 + Math.floor(Math.random() * 300)
    });
}

function getUserInfo(client, uid) {
    logger.info('getUserInfo:', uid);
    client.sendData({
        'op': 'getUserInfo',
        'uid': '28354'
    });
}

var id = 0;

function sendChatMessage(client, uid) {
    id++;
    logger.info('sendChatMessage:', uid, id);
    client.sendData({
        'op': 'sendChatMessage',
        'chat_type': 'world',
        'text': '你好吗？我是Kevin，我们可以做个Friend吗 毛泽东先生TMD',
        'msg_id': id
    });
}