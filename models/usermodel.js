//var uuid 			= require("uuid");
var forge 			= require("node-forge");
var bucket			= require("../app").bucket;
var bucketName		= require("../config").couchbase.bucket;
var N1qlQuery 		= require('couchbase').N1qlQuery;

function User() { };

User.create = function(params, callback) {
	var currentTime = new Date().toUTCString();	
    var userDoc = {
    	userID: params.userID,
        name: params.name,
        docType: 'user',
        injuryType: params.injuryType,
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
    var insertUser = N1qlQuery.fromString('INSERT INTO ' + bucketName + ' (KEY, VALUE) VALUES (\"' + userDoc.userID + '\", ' + JSON.stringify(userDoc) + ')');
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

User.checkHelp = function(params, callback) {
    var checkHelpQuery = N1qlQuery.fromString('SELECT * from '+bucketName+' WHERE userID = \"'+params.currentUserID+"\" AND docType='user'");
    bucket.query(checkHelpQuery, function (err, result) {
        if (err) {
            console.log("ERROR IN checkHelp QUERY: ");
            console.log(err);
            callback(err, null);
            return;
        }
        var helpBool = (result[0].OutsideHelp.helpOnWay);
        console.log(helpBool);
        callback(null, helpBool);
        /*else {
            if(OutsideHelp[0].helpOnWay == true) {
                callback(null, {helpOnWay: true});
            }
            else if (OutsideHelp[0].helpOnWay == false){
                callback(null, {helpOnWay: false});
            }
        } */
    });
};

module.exports = User;
