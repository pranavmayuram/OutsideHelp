var uuid 			= require("uuid");
var forge 			= require("node-forge");
var bucket			= require("../app").bucket;
var bucketName		= require("../config").bucket;
var N1qlQuery 		= require('couchbase').N1qlQuery;

function User() { };

User.create = function(params, socketID, callback) {
	var currentTime = new Date().toUTCString();	
    var userDoc = {
    	userID: socketID,
        name: params.name,
        docType: user,
        injuryType: parms.injuryType,
        helpOnWay: false,
        location: {
        	latitude: params.latitude,
        	longitude: params.longitude
        },
        hasPicture: false,
	    timeTracker: {
	        postTime: currentTime,
	        latestUpdate: [currentTime]
    	}
    };
    if (params.picture) {
    	userDoc.login.hasPicture = true;
    }
    console.log(JSON.stringify(userDoc));
    var insertUser = N1qlQuery.fromString('INSERT INTO ' + bucketName + ' (KEY, VALUE) VALUES (\"' + userDoc.uuid + '\", ' + JSON.stringify(userDoc) + ')');
    console.log(insertUser);
    bucket.query(insertUser, function (err, result) {
    	if (err) {
    		console.log("ERROR IN USERMODEL QUERY: ");
    		console.log(err);
    		callback(err, null);
    		return;
    	}
    	callback(null, result);
    });
};
