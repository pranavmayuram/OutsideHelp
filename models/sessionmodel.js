var uuid 				= require("uuid");
var forge 				= require("node-forge");
var bucket				= require("../app").bucket;
var bucketName			= require("../config").couchbase.bucket;
var N1qlQuery 			= require('couchbase').N1qlQuery;

function Session() {};

Session.create = function(userID, callback) {
	var sessionModel = {
		type: "session",
		userID: userID,
		sessionID: (uuid.v4()+"_session")
	};
	var insertSession = bucket.insert(sessionModel.sessionID, sessionModel, {expiry: 1800}, function(error, result) {
		if (error) {
    		callback(error, null);
    		return;
    	}
    	callback(null, sessionModel.sessionID);
    });
};

Session.auth = function(req, res, next) {
	var sessionID = req.headers.Authorization;
	var sessionArray = sessionID.split(" ");
	if (sessionArray[0] === "Bearer") {
		var getSession = N1qlQuery.fromString("SELECT userID FROM `" + bucketName + "` WHERE type = \"session\" AND sessionID = $1");
		bucket.query(getSession, [sessionArray[1]], function(error, result) {
			if(error) {
				callback(error, null);
    			return;
			}
			req.userID = result[0].userID;
			next();
		});
	}
};

// potential Session.delete for forceful login

module.exports = Session;