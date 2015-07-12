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

Admin.calculateDistance = function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var radlon1 = Math.PI * lon1/180;
    var radlon2 = Math.PI * lon2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit=="K") { dist = dist * 1.609344 };
    if (unit=="N") { dist = dist * 0.8684 };
    if (unit=="F") { dist = dist/5280};
    return dist;
}
