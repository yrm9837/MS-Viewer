var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var filePath = ""

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
app.use(express.static('public'));
 
var CONFIG = {
  EXE_APP: "../exe/msReader",
  DATA_DIR: "../data/"
}

app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
});
 
app.post('/file_path_post', urlencodedParser, function (req, res) {
  filePath = CONFIG.DATA_DIR + req.body.filePath
  var cmd = CONFIG.EXE_APP + " " + filePath + " -s 1";
  exec(cmd,function(error, stdout,stderr) {
    // get the output
    // console.log('Success execute the demo file.\n'+stdout);

   res.write(stdout);
   // console.log(stdout);
   res.end();
  })
});
app.post('/scan_post', urlencodedParser, function (req, res) {
  var cmd = CONFIG.EXE_APP + " " + filePath + " " + req.body.nowScanIndex;
  exec(cmd,function(error, stdout,stderr) {
    // get the output
    // console.log('Success execute the demo file.\n'+stdout);

   res.write(stdout);
   // console.log(stdout);
   res.end();
  })
});
app.post('/file_path_post2', urlencodedParser, function (req, res) {
  filePath = CONFIG.DATA_DIR + req.body.filePath
  var cmd = CONFIG.EXE_APP + " " + filePath + " -s 2";
  exec(cmd,function(error, stdout,stderr) {
    // get the output
    // console.log('Success execute the demo file.\n'+stdout);

   res.write(stdout);
   // console.log(stdout);
   res.end();
  })
});
 
var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  // console.log("应用实例，访问地址为 http://%s:%s", host, port)
  console.log('Server running at http://127.0.0.1:%s/index.html',port);//express_demo.js 文件
 
});

