var uuid 			= require("uuid");
var forge 			= require("node-forge");
var bucket			= require("../app").bucket;
var bucketName		= require("../config").bucket;
var N1qlQuery 		= require('couchbase').N1qlQuery;

function Admin() { };

Admin.searchByEmail = function (params, callback) {
	var searchUsers = N1qlQuery.fromString('SELECT * FROM ' + bucketName + ' WHERE LOWER(login.email) LIKE LOWER(\"%' + params.email + '%\")');
	console.log("searchByEmail: " + searchUsers);
	bucket.query(searchUsers, function (err, result) {
		if (err) {
    		callback(err, null);
    		return;
    	}
    	callback(null, result);
	});
};

Admin.validatePassword = function(rawPassword, hashedPassword) {
    if (forge.md.sha1.create().update(rawPassword).digest().toHex() === hashedPassword) {
    	return true;
    }
    else {
    	return false;
    }
};