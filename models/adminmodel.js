//var uuid            = require("uuid");
var forge           = require("node-forge");
var bucket          = require("../app").bucket;
var bucketName      = require("../config").couchbase.bucket;
var N1qlQuery       = require('couchbase').N1qlQuery;

function Admin() { };

Admin.searchAdminsByEmail = function (params, callback) {
    var searchUsers = N1qlQuery.fromString('SELECT * FROM ' + bucketName + ' WHERE LOWER(email) LIKE LOWER(\"%' + params.email + '%\") AND type=\"admin\"');
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

Admin.calculateDistance = function(lat1, lon1, lat2, lon2, unit) {
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
};

Admin.getAllUsers = function(callback) {
    var getQuery = N1qlQuery.fromString('SELECT * FROM '+bucketName+' WHERE type=\"user\" AND helpOnWay = false');
    bucket.query (getQuery, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        res.json(result);
    });
};

// params will need the userID selected, the adminID/Name, the 
Admin.checkOffUser = function(params, callback) {
    var checkOffUser = N1qlQuery.fromString('UPDATE '+bucketName+' SET helpOnWay = true WHERE userID =\"'+params.userID+'\")';
    bucket.query(checkOffUser, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        var sendMessage = N1qlQuery.fromString('INSERT INTO '+bucketName+' (KEY, VALUE) VALUES(\"'+params.userID+'_respDoc\", '+ JSON.stringify(params)+')');
        bucket.query(sendMessage, function(error), result {
            if(error) {
                return callback(error, null);
            }
            else {
                console.log('admin respDoc added!');
            }
        });
        res.json(result);
    });
};

Admin.createMap = function(lat1, lon1, lat2, lon2) {
    var watchID = null;
    var optn {
        enableHighAccuracy: true,
        timeout: Infinity,
        maximumAge, 0
    };
    if (navigator.geolocation){
        navigator.geolocation.watchPosition(success, fail, optn);
    }
    else {
        $("p").html("HTML5 Not Supported");
        $("button").click(function(){
            if(watchID){
                navigator.geolocation.clearWatch(watchID);
            }
            watchID = null;
            return false;
        });
    }
    }
    }
}


module.exports = Admin;