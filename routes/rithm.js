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
  // var javaproc = cp.spawn('java', ['--silent'], {
  //   stdio: [
  //     0, // use parents stdin for child
  //     'pipe', // pipe child's stdout to parent
  //     fs.openSync("files/err.out", "w") // direct child's stderr to a file
  //   ]
  // });
  // javaproc.stdin.write();
  // javaproc.stdin.end();

  // javaproc.stdout.on('data', function (data) {
  //   console.log(data);

  //   // render the output data
  //   // res.render('rithmout', { title: 'RiTHM', output: data });
  // });

  res.render('rithmout', { title: 'RiTHM', output: 'done' });
}

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
