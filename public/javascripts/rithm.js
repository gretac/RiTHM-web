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
  // TODO: fix this to act the Angular way
  $("#load-file-select").css('opacity','0');
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
      if (option === 'view') {
        // display the contents of the config file in a modal
        var viewContent = [];
        String(resp.data).split('\n').forEach(function (rowStr) {
          viewContent.push(rowStr);
        });
        $scope.resultConfig = viewContent;
        $('#config-view').modal('show');
      } else if (option === 'save') {
        console.log(resp.data);
        console.log("supposedly saved");
      } else if (option === 'process') {
        console.log("RiTHM computed. Shod output.");
      }
    });
  };

  $scope.loadConfig = function () {
    // trigger a click on the file input field for the config
    $("#load-file-select").trigger('click');
    // wait for a file to be selected
    $scope.$watch('loadedConfig', function (newVal) {
      var form = new FormData();
      form.append('configfile', newVal);

      $http.post('/rithm/loadconfig', form, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      }).then(function (resp) {
        var configData = resp.data;
        _.forEach(configData, function (value, key) {
          $scope.config[key] = value;
        });
      });
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
