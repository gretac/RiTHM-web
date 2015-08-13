var rithmApp = angular.module('rithmApp', []);

rithmApp.controller('ConfigController', function($scope, $http) {
  $http.get('/config/syntax').success(function(data) {
    $scope.syntax = data;
  });

  $http.get('/config/monitor').success(function(data) {
    $scope.monitor = data;
  });

  $http.get('/config/format').success(function(data) {
    $scope.format = data;
  });

  $http.get('/config/evaluator').success(function(data) {
    $scope.evaluator = data;
  });

  $http.get('/config/invocator').success(function(data) {
    $scope.invocator = data;
  });
});

rithmApp.controller('PluginController', function($scope, $http) {
});

rithmApp.controller('PipeController', function($scope, $http) {
  $http.get('/config/format').success(function(data) {
    $scope.format = data;
  });

  $http.get('/config/evaluator').success(function(data) {
    $scope.evaluator = data;
  });

  $http.get('/config/invocator').success(function(data) {
    $scope.invocator = data;
  });
});
