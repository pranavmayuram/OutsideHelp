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

user.controller("userController", ['$scope', 'socket', function($scope, socket, $http) {
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
    socket.on('Send weather', function(weather){
	$scope.weatherData = weather;
    });

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
