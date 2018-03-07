var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var multer = require('multer');//***
var chalk = require('chalk');   // 只是一个 cli 界面字体颜色包而已//****
var log = console.log.bind(console);
var filePath = ""

// 接受 application/json 格式的过滤器
var jsonParser = bodyParser.json()
// 接受 application/x-www-form-urlencoded 格式的过滤器
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// 接受 text/html 格式的过滤器
var textParser = bodyParser.text()
 
app.use(express.static('public'));
 
var CONFIG = {
  EXE_APP: "../exe/msReader",
  DATA_DIR: "../data/"
}

app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
});
 
app.post('/file_path_post1', urlencodedParser, function (req, res) {
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
 

// 自定义 multer 的 diskStorage 的存储目录与文件名
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../data')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname)
  }
})

var upload = multer({ storage: storage })

// 页面渲染
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'read_demo8_progress.html'));
})


// 对应前端的上传接口 http://127.0.0.1:8081/upload, upload.any() 过滤时不对文件列表格式做任何特殊处理
app.post('/upload', upload.any(), function (req, res) {
  log(req.files)
  res.send({message: 'upload Success'})
})



var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  // console.log("应用实例，访问地址为 http://%s:%s", host, port)
  console.log('Server running at http://127.0.0.1:%s/index.html',port);//express_demo.js 文件
 
});

