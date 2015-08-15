var express = require('express'),
    busboy = require('connect-busboy'),
    fs = require('fs'),
    cp = require('child_process'),
    _ = require('lodash');;

var router = express.Router();

// setup rithm file paths
var rithmPath = 'maven-repo/';
var uploadPath = 'files/';

var specsFileName = 'specifications';
var specsFilePath = rithmPath + specsFileName;
var configFileName = 'rithm_1.properties';
var configFilePath = rithmPath + configFileName;

var htmlLogPath = 'files/htmlout';
var resPlotPath = 'files/plot';

// containers for client data
var configData = {}; // container for user specified config data
var isSpecsUpdated = false;

function propertyInst (propStr, plotData, htmlData) {
  this.str = propStr;
  this.plotData = plotData;
  // this.htmlData = htmlData;
};

// helper functions
var parcePlotData = function (data) {
  var plotData = [];

  String(data).split('\n').forEach(function (rowStr) {
    var rowVals = rowStr.split(',');
    rowVals.shift();
    if (rowVals.length < 2) return;

    rowVals[0] = parseFloat(rowVals[0]).toFixed(2);

    if (rowVals[1] === 'Satisfied') {
      rowVals[1] = 2;
    } else if (rowVals[1] === 'Violated') {
      rowVals[1] = 0;
    } else if (rowVals[1] === 'Presumably Satisfied') {
      rowVals[1] = 1;
    } else {
      rowVals[1] = -1;
    }

    plotData.push(rowVals);
  });
  return plotData;
};

var showResults = function (res) {
  var i = 0, plotFileName = '', property;

  // render results page once all data has been read in
  var done = _.after(properties.length, function() {
    console.log('Done reading data! Rendering page.');
    res.render('rithmout', { title: "RiTHM results", data: properties });
  });

  // read the plot data from the generated plot files
  for (i; i < properties.length; i++) {
    property = properties[i];
    plotFileName = resPlotPath + i + "1";

    (function (property, i) {
      fs.readFile(plotFileName, function (err, data) {
        if (err) throw err;
        property.plotData = parcePlotData(data);
        done();
      });

    })(property, i);
  }
}

var execRithm = function (res) {
  console.log('Executing RiTHM');

  // call the RiTHM program to process the files
  cp.exec("cd " + rithmPath + " && ./rithm.sh",
    function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    showResults(res);
  });
};

var composeConfig = function (configData) {
  // prepare configuration file contents
  var content = "specFile=" + specsFileName + "\n" +
    "dataFile=" + configData.tracefile + "\n";

  if (!configData.useDefault) {
    content += "predicateEvaluatorScriptFile=" + configData.scriptfile + "\n" +
      "predicateEvaluatorType=" + configData.evalType + "\n";
  }

  content += "specParserClass=" + configData.logicalFormalism + "\n" +
    "monitorClass=" + configData.monitorType + "\n" +
    "traceParserClass=" + configData.dataFormat + "\n" +
    "invocationController=" + configData.invCtrl + "\n";

  return content;
};

// routes definition
router.post('/', function (req, res) {
  var fstream;
  req.pipe(req.busboy);

  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename);

    var fileloc = uploadPath + filename;
    fstream = fs.createWriteStream(fileloc);
    file.pipe(fstream);

    fstream.on('close', function () {
      console.log('file uploaded ' + fileloc);
      configData[fieldname] = fileloc;
    });
  });

  req.busboy.on('field', function (fieldname, value) {
    console.log("Up field: " + fieldname);
    configData[fieldname] = value;
  });

  req.busboy.on('finish', function () {
    // write specifications to a file
    if (_.isUndefined(configData.specs)) conole.log("Error: specs were not specified.");
    fs.writeFile(specsFilePath, configData.specs, function (err) {
      if (err) console.log(err);
      isSpecsUpdated = true;
    });

    var _varCheck = setInterval(function() {
      console.log("Tracefile: " + _.isUndefined(configData.tracefile));
      console.log("Scriptfile: " + _.isUndefined(configData.scriptfile));
      console.log("Specs: " + isSpecsUpdated);

      if (!_.isUndefined(configData.tracefile) && !_.isUndefined(configData.scriptfile && isSpecsUpdated)) {
        clearInterval(_varCheck);
        // write contents to the input file
        fs.writeFile(configFilePath, composeConfig(configData), function (err) {
          if (err) console.log(err);
          // res.send({});
          // execRithm(res);
          res.download(configFilePath, configFileName);
        });
      }
    }, 300);
  });
});

router.get('/htmllog', function (req, res) {
  var index = req.query.index;
  var htmlFileName = htmlLogPath + index + "0";

  fs.readFile(htmlFileName, function (err, data) {
    if (err) throw err;
    res.send(data);
  });
});

module.exports = router;
