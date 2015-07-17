//var uuid            = require("uuid");
var forge           = require("node-forge");
var bucket          = require("../app").bucket;
var bucketName      = require("../config").couchbase.bucket;
var N1qlQuery       = require('couchbase').N1qlQuery;

function Admin() { };

Admin.searchAdminsByEmail = function (params, callback) {
    var searchUsers = N1qlQuery.fromString('SELECT * FROM ' + bucketName + ' WHERE LOWER(email) = LOWER(\"' + params.email + '\") AND docType=\"admin\"');
    console.log("searchByEmail: " + searchUsers);
    bucket.query(searchUsers, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, result);
    });
};

Admin.validatePassword = function(rawPassword, savedPassword) {
    if (savedPassword === rawPassword) {
        return true;
    }
    else {
        return false;
    }
};

Admin.calculateDistance = function (lat1,lon1,lat2,lon2) {
    var deg2rad = function (deg) {
      return deg * (Math.PI/180)
    };
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c * 0.621371; // Distance in km
  return d.toFixed(2);
};

Admin.getAllUsers = function(callback) {
    var getQuery = N1qlQuery.fromString('SELECT * FROM '+bucketName+' WHERE docType=\"user\" AND helpOnWay = false');
    console.log(getQuery);
    bucket.query (getQuery, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        console.log(result);
        callback(null, result);
    });
};

// params will need the userID selected, the adminID/Name, the 
Admin.checkOffUser = function(params, callback) {
    var checkOffUser = N1qlQuery.fromString('UPDATE '+bucketName+' SET helpOnWay = true WHERE userID =\"'+params.userID+'\"');
    bucket.query(checkOffUser, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        var sendMessage = N1qlQuery.fromString('INSERT INTO '+bucketName+' (KEY, VALUE) VALUES(\"'+params.userID+'_respDoc\", '+ JSON.stringify(params)+')');
        bucket.query(sendMessage, function(error, result) {
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

// Admin.createMap = function(lat1, lon1, lat2, lon2) {
//     var watchID = null;
//     var optn {
//         enableHighAccuracy: true,
//         timeout: Infinity,
//         maximumAge, 0
//     };
//     if (navigator.geolocation){
//         navigator.geolocation.watchPosition(success, fail, optn);
//     }
//     else {
//         $("p").html("HTML5 Not Supported");
//         $("button").click(function(){
//             if(watchID){
//                 navigator.geolocation.clearWatch(watchID);
//             }
//             watchID = null;
//             return false;
//         });
//     }
//     }
//     }
// }


module.exports = Admin;