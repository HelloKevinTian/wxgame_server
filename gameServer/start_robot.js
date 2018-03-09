var child_process = require('child_process');

function runWorker(index, count) {
	var child = child_process.spawn('node', ['robot.js', index, count]);

	child.stdout.on('data', function(data) {
		console.log('stdout: ' + data);
	});

	child.stderr.on('data', function(data) {
		console.log('stderr: ' + data);
	});

	child.on('close', function(code) {
		console.log('子进程退出，code：' + code);
	});
}

var processNum = 4;
var robotNumPerProcess = 1000;

for (var i = 1; i <= processNum; i++) {
	runWorker(i, robotNumPerProcess);
}
