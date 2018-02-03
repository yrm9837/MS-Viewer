var express = require('express');
var app = express();
var bodyParser = require('body-parser');
 
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
app.use(express.static('public'));
 
app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index_post_ajax.html" );
})
 
app.post('/process_post', urlencodedParser, function (req, res) {
 
   // // 输出 JSON 格式
   // var response = {
   //     "first_name":req.body.first_name,
   //     "last_name":req.body.last_name
   // };
   res.write("Hello!"+req.body.first_name);
   console.log("Hello!"+req.body.first_name);
   res.end();
   // console.log(response);
   // res.end(JSON.stringify(response));
})
 

var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  // console.log("应用实例，访问地址为 http://%s:%s", host, port)
  console.log('Server running at http://127.0.0.1:%s/index.html',port);//express_demo.js 文件
 
})

