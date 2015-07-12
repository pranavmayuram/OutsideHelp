//var user = angular.module('user', [])
//var admin = angular.module('admin', [])
//var app = require('express')();
//var http = require('http').Server(app);
//var io = require('socket.io')(http);

var user = angular.module('user', []);
var admin = angular.module('admin', []);

user.factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io.connect();

  return {
    on: function (eventName, callback) {
      function wrapper() {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      }

      socket.on(eventName, wrapper);

      return function () {
        socket.removeListener(eventName, wrapper);
      };
    },

    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if(callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
}]);

user.controller("userController", ['$scope', 'socket', '$http', function($scope, socket, $http) {
  var th = this;
  $scope.formData={text:"hello"};
  $scope.loginData={};
  $scope.image={};
  $scope.helpData={};
  $scope.weatherData=[];

  socket.on('connection', function(socket){
	console.log('a user connected');

	socket.on('disconnect', function(){
	    console.log('user disconnected');
	});
    });
    
    //insert socket here
  
  function userToBack(){
    socket.emit('User to Back', {data: $scope.formData})
  }
  /*$http({method: "POST", url: "/addUser", data: userInfo})
      .success(function(data) {
        console.log($scope.formData);
        $scope.formData={};
        $scope.yesRegister="";
        $scope.create=data;
        console.log(data);
        console.log("SUCCESS!");
      })
      .error(function(data) {
        console.log('PROBLEM!');
        console.log('Error: ' + data);
      }); */

  $scope.getWeather = function() {
    $http({method:"GET", url: "/api/getWeather"})
      .success(function(data) {
        console.log(JSON.stringify(data));
        // $scope.weather = JSON.stringify(data);
      })
      .error(function(data) {
        console.log(data);
      });
  };

  $scope.getLocation = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        $scope.$apply(function(){
          $scope.formData.latitude = position.coords.latitude;
          $scope.formData.longitude = position.coords.longitude;
        });
      });
    }
    else {
      $scope.position = "no position available, browser does not support";
    }
  };

    /*$scope.getLocation = function() {
      if (navigator.geolocation) {
          navigator.geolocation.watchPosition(showPosition);
      } else { 
          x.innerHTML = "Geolocation is not supported by this browser.";}
      }
    $scope.$showPosition = function(position) {
      x.innerHTML="Stay put! RockMedicine will meet you at latitude: " + position.coords.latitude + 
      " and longitude: " + position.coords.longitude; 
      $scope.formData.latitude =  position.coords.latitude;
      $scope.formData.longitude = position.coords.longitude;
     } */

    window.onload = function() {
      //$scope.showPosition();
      $scope.getLocation();
    };

  /*$('help_form').onclick=function(){
	   socket.emit('Form back', $scope.formData);
	   $('#m').val('');
	   return false;
  }*/
}]);	    

admin.factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io.connect();

  return {
    on: function (eventName, callback) {
      function wrapper() {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      }

      socket.on(eventName, wrapper);

      return function () {
        socket.removeListener(eventName, wrapper);
      };
    },

    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if(callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
}]);

/*admin.controller("userController", ['$scope', 'socket', function($scope, $http) {
    var th = this;
    $scope.formData={};
    $scope.loginData={};
    $scope.image={};
    $scope.helpData={};
    $scope.weatherData=[];

    io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
	    console.log('user disconnected');
	});
    });
    
    //insert socket here
    io.on('Send weather', function(weather){
	$scope.weatherData = weather;
    });

    $('help_form').onclick=function(){
	socket.emit('Form back', $scope.formData);
	$('#m').val('');
	return false;
    }
}]);	    
*/
