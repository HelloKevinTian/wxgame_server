var logger = require('ss-logger').getLogger(__filename);
var ExBuffer = require('ExBuffer');
var readline = require('readline');
var net = require('net');
var protoManager = require('./proto/ProtoManager');

protoManager.LoadAllProtoFile();

var configObj = require('./cfg/server');
var config;
for (var i = 0; i < configObj.length; i++) {
    if (configObj[i].type == 'tcp') {
        config = configObj[i];
        break;
    }
};

if (!config) {
    return logger.error('no tcp server');
}

//测试客户端
var exBuffer = config.big_endian ? new ExBuffer().uint32Head() : new ExBuffer().uint32Head().littleEndian();
var client = new net.Socket();

client.sendData = function(data, protoName) {
    var buf = protoManager.Encode(data, protoName);

    client.write(buf);
}

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
        client.sendData(msg, 'message_c2s_login');
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
        client.sendData(msg, 'message_c2s_get_time');
    }
}

client.connect(config.port, config.host, function() {
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

});

client.on('data', function(data) {
    exBuffer.put(data);
});

exBuffer.on('data', function(buffer) {
    var args = protoManager.TcpDecode(buffer);;
    logger.info('>> 收到服务器的数据:', args);
});

client.on('close', function() {
    logger.error('Connection closed');
});