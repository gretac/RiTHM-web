var express = require('express'),
    busboy = require('connect-busboy'),
    fs = require('fs'),
    cp = require('child_process');

var router = express.Router();

var isUndefined = function (value) { return typeof value == 'undefined' };

var execRithm = function (ltlfile, tracefile, res) {
  console.log(tracefile);
  console.log(ltlfile);

  // call the RiTHM program to process the files
  cp.exec("./RiTHMJars/rithm " + ltlfile + " " + tracefile,
    function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    fs.readFile('files/out.html', function (err, data) {
      if (err) throw err;
      res.render('rithmout');
    });
  });

  fs.readFile('files/graphout.csv', {encoding: 'utf8'}, function (err, data) {
    if (err) throw err;
    res.render('rithmout', { title: "RiTHM results", data: data });
  });
};

router.post('/', function (req, res) {
  var fstream;
  req.pipe(req.busboy);

  req.busboy.on('file', function (filedname, file, filename) {
    console.log("Uploading: " + filename);
    var fileloc = 'files/' + filename;
    fstream = fs.createWriteStream(fileloc);
    file.pipe(fstream);
    fstream.on('close', function () {
      console.log('file uploaded');
      req.tracefile = fileloc;
    });
  });

  req.busboy.on('field', function (fieldname, value) {
    var fileloc = 'files/ltltext.txt';
    fs.writeFile(fileloc, value, function (err) {
      if (err) console.log(err);
      req.ltlfile = fileloc;
    });
  });

  req.busboy.on('finish', function () {
    var _varCheck = setInterval(function() {
      if (!isUndefined(req.tracefile) || !isUndefined(req.ltlfile)) {
        clearInterval(_varCheck);
        execRithm(req.ltlfile, req.tracefile, res);
      }
    }, 300);
  });
});

module.exports = router;
