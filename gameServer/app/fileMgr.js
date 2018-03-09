'use strict';
/**
 * @ Author Kevin
 * @ Email  tianwen@chukong-inc.com
 * @ 2017/3/7
 * @ 配置文件管理
 */
var async = require('async');
var fs = require('fs');
var logger = require('ss-logger').getLogger(__filename);

var fileMgr = module.exports;

var jsonTable = {}; //内存非活动数据表(存放objetc)
var jsonString = {}; //内存非活动数据表(存放string)

var tablePath = './table/';

fileMgr.init = function() {
    logger.info('fileMgr init');

    var files = fs.readdirSync(tablePath);

    for (var i = 0; i < files.length; i++) {

        var load = function() {
            var fileArr = files[i].split('.');

            if (fileArr[1] === 'json') {
                loadJsonByFile(tablePath + files[i], fileArr[0]);
            }
        }

        load();

    };
}

fileMgr.getTable = function(name, isString) {
    if (!name && typeof(name) != 'string') {
        logger.error('ss-globaltable getTableJson error', name, isString);
        return null;
    } else {
        if (isString) {
            return jsonString[name];
        } else {
            return jsonTable[name];
        }
    }
}

function loadJsonByFile(file, name) {
    if (!file || typeof(file) != 'string') {
        logger.error('参数file不正确');
        return;
    }

    if (!name || typeof(name) != 'string') {
        logger.error('参数name不正确');
        return;
    }

    logger.info('Load ' + file);

    var jsonData = fs.readFileSync(file, 'utf-8');
    if (!jsonData) {
        logger.error('读取文件%s失败', file);
        return;
    }

    jsonString[name] = jsonData;
    var obj = JSON.parse(jsonData);
    jsonTable[name] = obj;

    fs.watchFile(file, function(curr, prev) {
        if (curr.mtime.getTime() !== prev.mtime.getTime()) {
            logger.info('> > > Reload ' + file);

            fs.readFile(file, 'utf-8', function(err, data) {
                if (err) {
                    logger.error('读取文件%s失败', file, err);
                    return;
                }

                try {
                    jsonString[name] = data;
                    var obj = JSON.parse(data);
                    jsonTable[name] = obj;
                } catch (e) {
                    logger.error(e.name + ' : ' + e.message + ' in ' + file);
                }
            });
        }
    });
}