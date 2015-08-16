var rithmApp = angular.module('rithmApp', []);

rithmApp.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function(){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);

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

  $scope.evalConfig = function (option) {
    var form = new FormData();
    _.forEach($scope.config, function (value, key) {
      form.append(key, value);
    });

    $http.post('/rithm?option=' + option, form, {
      transformRequest: angular.identity,
      headers: { 'Content-Type': undefined }
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
