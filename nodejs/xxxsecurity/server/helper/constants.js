exports.RES_MSG = {
		"500" : "Server Error. Please try again later",
		"400" : "Invalid Input",
		"401" : "Unauthorized Request",
		"200" : "Successful",
		"403" : "Accedd Denied"
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

exports.REDIS_KEYS = {
	"QUERYHASH"	: "queryHashMap"
};

exports.SALARY = {
	"GUARD"	: 160 // 20 per hour and 8 hours per day
};

exports.SCHEDULE = {
	"MORNING" : {
		"START" : "10:00 AM",
		"END"	: "06:00 PM"
	},
	"EVENING" : {
		"START" : "04:00 PM",
		"END"	: "12:00 AM"
	},
	"NIGHT" : {
		"START" : "10:00 PM",
		"END"	: "06:00 AM"
	}
}