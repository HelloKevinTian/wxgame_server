'use strict';
var logger = require('ss-logger').getLogger(__filename);
var proto = require('../../proto/ProtoManager');
var async = require('async');
var _ = require('underscore');

function handle(args, client) {
	var msg = proto.NewMessage('s2c_get_time', {
		'tail': {
			'time': Math.floor(Date.now()),
			'flowid': args.head.flowid
		},
		'time': Math.floor(Date.now()),
		'date': UTIL.formatDate()
	});
	client.sendMessage(msg, 'message_s2c_get_time');
};

module.exports = {
	'handle': handle
};