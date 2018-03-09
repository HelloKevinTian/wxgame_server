'use strict';

module.exports = {

	SERVER_IP: '192.168.20.137', //服务器外网地址
	ROOM_MAX_SPACE: 4, //房间最大人数
	CHAT_CHANNEL_MAX_PLAYER_NUM: 200, //单个聊天频道最大人数上限
	HEART_BEAT_SWITCH: 1, //心跳开关
	CHECK_CHEAT_SWITCH: 1, //是否检查pvp作弊
	//TCP服务器单进程最大玩家数量
	SERVER_MAX_PLAYER_NUM: {
		'chat': 3000, //聊天服
		'lobby': 6000, //大厅服
		'battle': 3000 //对战服
	},

	//db表名
	DB_ROOM: 'cs2_room',
	DB_IDS: 'cs2_ids',
	DB_PLAYER: 'cs2_player', //game
	DB_CAR: 'cs2_car', //game
	DB_SERVER_LIST: 'cs2_server_list',
	DB_CHANNEL: 'cs2_channel',
	DB_CHAT: 'cs2_chat',
	DB_LIKE: 'cs2_like', //game
	DB_PVP: 'cs2_pvp', //game
	DB_RECENT_PVP_ENEMY: 'cs2_recent_pvp_enemy',
	DB_REAL_PVP_RANK: 'cs2_real_pvp_rank',
	DB_ROOM_REWARD: 'cs2_room_reward',
	DB_PVP_TITLE: 'cs2_pvp_title',
	DB_BROADCAST: 'cs2_broadcast',
	DB_TCP_BROADCAST: 'cs2_tcp_broadcast',

	//错误码
	CODE: {
		SUCCESS: 0,
		UNKNOWN_ERROR: 1000, //未知错误
		NOT_LOGIN: 1001, //尚未登录，请先登录
		ALREADY_LOGIN: 1002, //已经登录，不能重复登录
		SOCKET_DESTROYED: 1003, //socket已关闭
		ALREADY_IN_ROOM: 1004, //已在一个房间中
		ROOM_FULL: 1005, //房间人数已满
		ROOM_PASSWORD_ERROR: 1006, //房间密码错误
		ROOM_NOT_EXIST: 1007, //房间不存在
		ROOM_HAS_PASSWORD: 1008, //房间有密码
		SOMEONE_CHEAT: 1009, //有人作弊
		ROOM_LEVEL_ERROR: 1010, //房间等级不符
		SOMEONE_NOT_READY: 1011, //有人未准备
		ROOM_IN_BATTLE: 1012, //此房间已开战
		CHANNEL_IS_FULL: 1013, //聊天频道已满
		CAR_NOT_EXIST: 1014, //车不存在
	},

	ROOM_STATUS: {
		NOT_FULL: 0,
		FULL: 1,
		BATTLE: 2
	},

	SRV_MSG: {
		TIME_INFO: 's2c_time_info',
		LOGIN: 's2c_login',
		ROOM_INFO: 's2c_room_info',
		USER_INFO: 's2c_user_info',
		START_GAME: 's2c_startGame',
		SYNC_PLAYER_LOCATION: 's2c_synPlayerLocation',
		SYNC_PLAYER_ACTION: 's2c_synPlayerAction',
		GET_CHAT_MSG: 's2c_getChatMessage',
		ENTER_WORLD_CHANNEL: 's2c_enterWorldChannelID',
		CHAT_WITH_ONE: 's2c_chatWithOne',
		GET_CHAT_RECORD: 's2c_getChatRecord',
		GET_RECENT_MSG: 's2c_getRecentMsg',
		PVP_INVITE: 's2c_pvp_invite',
		ROOM_LIST: 's2c_room_list',
		FINISH_GAME: 's2c_finish_game',
		JOIN_ROOM: 's2c_join_room',
		CAR_CHANGE: 's2c_car_change',
		BROADCAST_INFO: 's2c_get_broadcast'
	},

	CHAT_TYPE: {
		SYSTEM: 'system',
		WORLD: 'world',
		TEAM: 'team',
		ROOM: 'room'
	}

};