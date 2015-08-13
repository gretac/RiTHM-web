var express = require('express'),
    fs = require('fs'),
    _ = require('lodash');;

var router = express.Router();

// setup config file paths
var configPath = 'files/';

var getConfig = function (fileName, cb) {
  fs.readFile(fileName, function (err, data) {
    if (err) {
      console.log(err);
      return cb([]);
    }
    return cb(data);
  });
};

router.get('/syntax', function (req, res, next) {
  var configFile = configPath + "syntax.json";
  getConfig(configFile, function (data) { res.send(data); });
});

router.get('/monitor', function (req, res, next) {
  var configFile = configPath + "monitorType.json";
  getConfig(configFile, function (data) { res.send(data); });
});

router.get('/format', function (req, res, next) {
  var configFile = configPath + "dataFormat.json";
  getConfig(configFile, function (data) { res.send(data); });
});

router.get('/evaluator', function (req, res, next) {
  var configFile = configPath + "evaluatorType.json";
  getConfig(configFile, function (data) { res.send(data); });
});

router.get('/invocator', function (req, res, next) {
  var configFile = configPath + "invocationController.json";
  getConfig(configFile, function (data) { res.send(data); });
});

module.exports = router;
