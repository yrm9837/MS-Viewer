var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var filePath = ""

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
// app.use(express.static('public'));
app.use(express.static(__dirname));
 
app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
});
 
app.post('/file_path_post', urlencodedParser, function (req, res) {
  filePath = "./" + req.body.filePath
  var cmd = "./msReader " + filePath + " -s 1";
  exec(cmd,function(error, stdout,stderr) {
    // get the output
    // console.log('Success execute the demo file.\n'+stdout);

   res.write(stdout);
   // console.log(stdout);
   res.end();
  })
});
app.post('/scan_post', urlencodedParser, function (req, res) {
  var cmd = "./msReader ./" + filePath + " " + req.body.nowScanIndex;
  exec(cmd,function(error, stdout,stderr) {
    // get the output
    // console.log('Success execute the demo file.\n'+stdout);

   res.write(stdout);
   // console.log(stdout);
   res.end();
  })
});
app.post('/file_path_post2', urlencodedParser, function (req, res) {
  filePath = "./" + req.body.filePath
  var cmd = "./msReader " + filePath + " -s 2";
  exec(cmd,function(error, stdout,stderr) {
    // get the output
    // console.log('Success execute the demo file.\n'+stdout);

   res.write(stdout);
   // console.log(stdout);
   res.end();
  })
});
// app.get('/openfile', function (req, res) {
//    console.log('Success call openfile.');
// });
app.get('/filestatus', function (req, res) {
   // 输出 JSON 格式
  filePath = "./" + req.query.filename
  var cmd = "./msReader " + filePath + " -f";

  exec(cmd,function(error, stdout,stderr) {
   var re = stdout.split("\t");
   var response = {
       "mzmin":parseFloat(re[0]),
       "mzmax":parseFloat(re[1]),
       "rtmin":parseFloat(re[2]),
       "rtmax":parseFloat(re[3]),
       "intmin":parseFloat(re[4]),
       "intmax":parseFloat(re[5])
   };
   // console.log(response);
   // res.write(stdout);
   res.end(JSON.stringify(response));
   console.log('Success call openfile.');
  })
});
app.get('/getpoints', function (req, res) {
   // 输出 JSON 格式
  // console.log(req);
  var cmd = "./msReader " + filePath + " -p " + req.query.mzmin + " " + req.query.mzmax + " " 
    + req.query.rtmin + " " + req.query.rtmax + " " + req.query.numpoints + " " + req.query.intmin;
  console.log(cmd);
  exec(cmd,function(error, stdout,stderr) {
   var allScan = stdout.split("\t");
   var response = [];
   for (var i = 0; i < allScan.length; i++){
      if (allScan[i].length > 1) {
        var singleScan = allScan[i].split(",");
        response[i] = [parseInt(singleScan[0]),parseFloat(singleScan[1]),parseFloat(singleScan[2]),parseFloat(singleScan[3])];
      }
   }
   console.log(response);
   // res.write(stdout);
   res.end(JSON.stringify(response));
   console.log('Success call openfile.');
  })
});

 
var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  // console.log("应用实例，访问地址为 http://%s:%s", host, port)
  console.log('Server running at http://127.0.0.1:%s/index.html',port);//express_demo.js 文件
 
});

