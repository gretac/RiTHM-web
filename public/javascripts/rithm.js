var rithmApp = angular.module('rithmApp', []);

rithmApp.controller('ConfigController', function($scope, $http) {
  $scope.config = {};

  $http.get('/config/syntax').success(function(data) {
    $scope.config.syntax = data;
  });

  $http.get('/config/monitor').success(function(data) {
    $scope.config.monitor = data;
  });

  $http.get('/config/format').success(function(data) {
    $scope.config.format = data;
  });

  $http.get('/config/evaluator').success(function(data) {
    $scope.config.evaluator = data;
  });

  $http.get('/config/invocator').success(function(data) {
    $scope.config.invocator = data;
  });

  $scope.processConfig = function () {
    console.log($scope.config);
    $http.post('/rithm', { data: $scope.config }, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(function (resp) {
      console.log(resp);
    });
  };
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
