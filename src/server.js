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
// app.use(express.static('public'));
app.use(express.static(__dirname));
 
app.get('/2Dindex.html', function (req, res) {
   res.sendFile( __dirname + "/2D/" + "index.html" );
});
app.get('/3Dindex.html', function (req, res) {
   res.sendFile( __dirname + "/3D/" + "index.html" );
});
app.get('/delete.html', function (req, res) {
   res.sendFile( __dirname + "/" + "delete.html" );
});
 
app.post('/file_path_post1', urlencodedParser, function (req, res) {
  filePath = "../data/" + req.body.filePath
  var cmd = "../exe/msReader " + filePath + " -s 1";
  exec(cmd,function(error, stdout,stderr) {
    // get the output
    // console.log('Success execute the demo file.\n'+stdout);

   res.write(stdout);
   // console.log(stdout);
   res.end();
  })
});
app.post('/scan_post', urlencodedParser, function (req, res) {
  var cmd = "../exe/msReader ./" + filePath + " " + req.body.nowScanIndex;
  exec(cmd,function(error, stdout,stderr) {
    // get the output
    // console.log('Success execute the demo file.\n'+stdout);

   res.write(stdout);
   // console.log(stdout);
   res.end();
  })
});
app.post('/file_path_post2', urlencodedParser, function (req, res) {
  filePath = "../data/" + req.body.filePath
  var cmd = "../exe/msReader " + filePath + " -s 2";
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
  filePath = "../data/" + req.query.filename
  var cmd = "../exe/msReader " + filePath + " -f";

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
  var cmd = "../exe/msReader " + filePath + " -p " + req.query.mzmin + " " + req.query.mzmax + " " 
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
app.post('/filelist', urlencodedParser, function (req, res) {
  var root = path.join(__dirname) + "/../data/"
  console.log("root: "+root)  
  var output = readDirSync(root) 
  function readDirSync(path){ 
      var output = "" 
      var pa = fs.readdirSync(path);  
      pa.forEach(function(ele,index){  
          var info = fs.statSync(path+"/"+ele)      
          if(info.isDirectory()){  
              console.log("dir: "+ele)  
              readDirSync(path+"/"+ele);  
          }else{  
              console.log("file: "+ele)   
              console.log(ele.slice(-4))  
              if (ele.slice(-4) == "mzML") {
                  output = output + "\t" + ele
              }
          }     
      }) 
      return output 
  }   
  // console.log("ouptut: "+output)  
  res.write(output);
  // console.log(output);
  res.end();
});
app.post('/delfeile', urlencodedParser, function (req, res) {
  var root = path.join(__dirname) + "/../data/" + req.body.filePath
  fs.unlink(root, function(err) {
   if (err) {
       return console.error(err);
   }
   console.log("success delete file:" + root);
  });
  res.end();
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
  console.log('Server running at \nhttp://127.0.0.1:%s/2Dindex.html or \nhttp://127.0.0.1:%s/3Dindex.html',port,port);//express_demo.js 文件
 
});

