//var user = angular.module('user', [])
//var admin = angular.module('admin', [])
//var app = require('express')();
//var http = require('http').Server(app);
//var io = require('socket.io')(http);

var user = angular.module('user', ['ui.bootstrap']);
var admin = angular.module('admin', []);

var generateGuid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

/*user.factory('socket', ['$rootScope', function ($rootScope) {
  //var socket = io.connect();

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
}]); */
user.controller('ModalInstanceCtrl', ['$modal', function ($scope, $modalInstance, form)
  {
  $scope.form = form;

  }]);

user.controller("userController", ['$scope', '$http', '$interval', '$modal', function($scope, $http, $interval, $modal) {
  var th = this;
  $scope.formData={};
  $scope.loginData={};
  $scope.image={};
  $scope.helpData={};
  $scope.weatherData={};
  $scope.globalvar={};
  $scope.listOfForms={};

  /*socket.on('connection', function(socket){
    socket.emit('test', {data: "this is a test"});
     console.log('a user connected');

  socket.on('disconnect', function(){
      console.log('user disconnected');
  });
    }); */
    
    //insert socket here
  
  /*$scope.userToBack = function(){
    console.log('Sent to back')
    socket.emit('User to Back', {data: $scope.formData})
  }; */
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
        $scope.weatherData = data;
        // $scope.weather = JSON.stringify(data);
      })
      .error(function(data) {
        console.log(data);
      });
  };

  $scope.insertUserDoc = function() {
    var id = generateGuid();
    $scope.formData.userID = id;
    $scope.globalvar.currentUserID = id;
    console.log("globalvar: " + $scope.globalvar);
    $http({method:"POST", url: "/api/insertUserDoc", data: $scope.formData})
      .success(function(data) {
        console.log('userDoc sent to db');
      })
      .error(function(data) {
        console.log("fuck my balls userDoc failed");
      });
    check = $interval(function() {
    $http({method:"GET", url: "/api/checkHelpOnWay", params: $scope.globalvar})
      .success(function(data) {
        console.log('dataBool: ' + data);
      })
      .error(function(data) {
        console.log(data);
      });
    } , 1500);
  };

  $scope.getAllUsers = function(){
    $http({method:"GET", url: "/api/admin_getAllUsers", params: $scope.Admincoordinates})
      .success(function(data) {
        console.log('List of Users: ' + data);
        $scope.listOfForms = data;
      })
      .error(function(data) {
        console.log(data);
      });
  };

  $scope.checkAdminLogin = function() {
    //$scope.loginData={"email": "charu.dwivedi@outsidelands.com", "password": "password"};
    console.log($scope.loginData);
    $http({method:"GET", url: "/api/admin_loginAuth", params: $scope.loginData})
      .success(function(data) {
        console.log('dataBool: ' + data);
        if (data) {
          console.log('headed to portal.html');
          window.open("portal.html","_self");
        }
        else {
          alert("Your username/password combination is incorrect, please try again");;
        }
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

  $scope.showWeather = function() {
    if ($scope.weatherData) {
      console.log(JSON.stringify($scope.weatherData));
    }
    else {
      console.log("balls");
    }
  };

  $scope.printID = function(someID) {
    console.log(someID);
  };

    var app = angular.module('app', ['ui.bootstrap']);

  $scope.open = function (_form) {

    var modalInstance = $modal.open({
      controller: "ModalInstanceCtrl",
      templateUrl: 'myModalContent.html',
        resolve: {
            form: function()
            {
                return _form;
            }
        }
    });

  };


  /*$('help_form').onclick=function(){
     socket.emit('Form back', $scope.formData);
     $('#m').val('');
     return false;
  }*/
}]);      

/*admin.factory('socket', ['$rootScope', function ($rootScope) {
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
}]); */

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
