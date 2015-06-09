exports.RES_MSG = {
		"500" : "Server Error. Please try again later",
		"400" : "Invalid Input",
		"401" : "Unauthorized Request",
		"200" : "Successful",
		"403" : "Access Denied"
};

exports.QUEUE_NAME = {
		"ADMIN"		: "admin_queue",
		"LOGIN" 	: "login_queue",
		"CLIENT"	: "client_queue",
		"GUARD" 	: "guard_queue",
		"BUILDING" 	: "building_queue",
		"SEARCH" 	: "search_queue",
		"CONTRACT"	: "contract_queue",
		"ALERT"		: "alert_queue",
		"REPORT"	: "report_queue",
		"SCHEDULE"	: "schedule_queue",
		"CHECKPOINT": "checkpoint_queue"
};


exports.REDIS_EXP_TIME = "600"; //in seconds

exports.REDIS_KEYNAME = {
	"ADMIN" 	: "admin_hashmap",
	"CLIENT"	: "client_hashmap",
	"GUARD" 	: "guard_hashmap",
	"BUILDING" 	: "building_hashmap",
	"CONTRACT"	: "contract_hashmap",
	"ALERT"		: "alert_hashmap",
	"REPORT"	: "report_hashmap"
};

exports.ROLE = {
		"ADMIN" : 0,
		"CLIENT": 1,
		"GUARD" : 2
};