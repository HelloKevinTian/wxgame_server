/**
 * @ Author Kevin
 * @ Email  tianwen@chukong-inc.com
 * @ 2017/4/11
 * @ 敏感字过滤
 */
var logger = require('ss-logger').getLogger(__filename);
var async = require('async');
var nodejieba = require("nodejieba");

var maskwordJson = require('../cfg/maskword');

var maskwordMgr = module.exports;

maskwordMgr.init = function() {
	var specialWordList = [
		'男默女泪',
		'tmd',
		'你麻痹',
		'麻痹',
		'妈逼',
		'草你妈'
	];
	for (var i = 0; i < specialWordList.length; i++) {
		nodejieba.insertWord(specialWordList[i]);
	};
}

maskwordMgr.filter = function(sentence) {
	sentence = sentence || '';

	var wordList = nodejieba.cut(sentence);

	for (var i = 0; i < wordList.length; i++) {
		if (maskwordJson.indexOf(wordList[i]) > -1) {
			wordList[i] = Array(wordList[i].length + 1).join('*');
		}
	};
	return wordList.join('');
}