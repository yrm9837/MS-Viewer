var server = require("./server1");
var router = require("./router1");
 
server.start(router.route);