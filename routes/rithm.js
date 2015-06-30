var express = require('express'),
    busboy = require('connect-busboy'),
    fs = require('fs'),
    cp = require('child_process'),
    _ = require('lodash');;

var router = express.Router();

// setup rithm file paths
var rithmPath = 'maven-repo/';
var tracePath = rithmPath;
var inputFile = rithmPath + 'rithm_1.properties';

var htmlLogPath = 'files/htmlout';
var resPlotPath = 'files/plot';

// containers for client data
function propertyInst (propStr, plotData, htmlData) {
  this.str = propStr;
  this.plotData = plotData;
  this.htmlData = htmlData;
};
var properties = []; // collection of property insts

var isUndefined = function (value) { return typeof value == 'undefined' };

var showResults = function (res) {
  var i = 0, plotFileName = '', htmlFileName = '', property;

  // render results page once all data has been read in
  var done = _.after(properties.length * 2, function() {
    console.log('Done reading data! Rendering page.');
    console.log(properties);
    res.render('rithmout', { title: "RiTHM results", data: properties });
  });

  // read the plot data from the generated plot files
  for (i; i < properties.length; i++) {
    property = properties[i];
    plotFileName = resPlotPath + i + "1";
    htmlFileName = htmlLogPath + i + "0";

    (function (property, i) {
      console.log(i);
      console.log(property);

      fs.readFile(plotFileName, function (err, data) {
        if (err) throw err;
        console.log(i);
        property.plotData = data;
        done();
      });

      fs.readFile(htmlFileName, function (err, data) {
        console.log(i);
        if (err) throw err;
        property.htmlData = data;
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

router.post('/', function (req, res) {
  var fstream;
  req.pipe(req.busboy);

  req.busboy.on('file', function (filedname, file, filename) {
    console.log("Uploading: " + filename);

    var fileloc = tracePath + filename;
    fstream = fs.createWriteStream(fileloc);
    file.pipe(fstream);

    fstream.on('close', function () {
      console.log('file uploaded');
      // NOTE: assuming executable and trace file are in the same directory
      req.tracefile = filename;
    });
  });

  req.busboy.on('field', function (fieldname, props) {
    props = props.trim().split('\r\n');
    var propStr = "", str = "", cnt = 0, i = 0;

    for (i; i < props.length; i+=2) {
      cnt = i/2 + 1;
      str = props[i] + " " + props[i+1];
      properties.push(new propertyInst(str, null, null));

      // add the configuration string for the property
      propStr += "specsPipe" + cnt + "=" + props[i] + "#" + props[i+1] + "\n" +
        "specParsersPipe" + cnt + "=MTL#LTL\n" + "monitorsPipe" + cnt +
        "=MTL#LTL4\n\n";
    }
    propStr = "pipeCount=" + props.length/2 + "\n" + propStr;
    req.ltl = propStr;
  });

  req.busboy.on('finish', function () {
    var _varCheck = setInterval(function() {
      if (!isUndefined(req.tracefile) || !isUndefined(req.ltlfile)) {
        clearInterval(_varCheck);

        // prepare input file contents
        var content = "userName=rithm\n" +
          "password=uwaterloo\n" +
          "dataFile=" + req.tracefile + '\n' +
          "traceParserClass=CSV\n" +
          req.ltl +
          "monitorOutputLog=../" + htmlLogPath + "\n" +
          "plotFileName=../" + resPlotPath + "\n";

        // write contents to the input file
        fs.writeFile(inputFile, content, function (err) {
          if (err) console.log(err);
          execRithm(res);
        });
      }
    }, 300);
  });
});

module.exports = router;
