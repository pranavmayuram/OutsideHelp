
var user = angular.module('user', ['ui.bootstrap']);

var generateGuid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

user.controller('ModalInstanceCtrl', function ($scope, $modalInstance, form)
  {
  $scope.form = form;

  $scope.ok = function(form) {
    $modalInstance.close($scope.form);
  };
});

user.controller("userController", ['$scope', '$http', '$interval', '$modal', function($scope, $http, $interval, $modal) {
  var th = this;
  $scope.formData={};
  $scope.loginData={};
  $scope.image={};
  $scope.helpData={};
  $scope.weatherData={};
  $scope.globalvar={};
  $scope.listOfForms={};

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
    //function getCoordinates(callback) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          var returnValue = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          $http({method:"GET", url: "/api/admin_getAllUsers", params: returnValue})
            .success(function(data) {
              console.log('List of Users: ' + data);
              $scope.listOfForms = data;
            })
            .error(function(data) {
              console.log(data);
            });
      });
    //}
  };

  function updateCoordinate(callback) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var returnValue = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        var serializeCookie = serialize(returnValue);
        $.cookie('geolocation', serializeCookie);

        // and here you call the callback with whatever
        // data you need to return as a parameter.
        callback(serializeCookie);
      }
    )
}

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

}]);      

