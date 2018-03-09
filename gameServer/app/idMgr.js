'use strict';
/**
 * idMgr
 */
var logger = require('ss-logger').getLogger(__filename);
var mongo = require('ss-mongo');
var async = require('async');
var _ = require('underscore');

var idMgr = module.exports;

idMgr.init = function() {
    ['room'].forEach(function(value) {
        (function(name) {
            mongo.db().command({
                findAndModify: CONST.DB_IDS,
                query: {
                    '_id': getName(name)
                },
                new: false,
                upsert: true,
                update: {
                    $set: {
                        'uuid': 0
                    }
                }
            }, function(err) {
                logger.info('idMgr init');
            });
        }(value));　　
    });
}

idMgr.genId = function(name, callback) {
    mongo.db().command({
        findAndModify: CONST.DB_IDS,
        query: {
            '_id': getName(name)
        },
        new: true,
        upsert: true,
        update: {
            $inc: {
                'uuid': 1
            }
        }
    }, function(err, result) {
        if (err) {
            logger.error(err);
            callback(CONST.CODE.UNKNOWN_ERROR);
        } else {
            callback(null, result.value.uuid);
        }
    });
}

function getName(name) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    return name + '#' + year + '_' + month + '_' + day + '_' + hour;
}