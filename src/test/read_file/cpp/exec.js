var exec = require('child_process').exec;
var cmd = './demo test';

exec(cmd,function(error, stdout,stderr){
	// get the output
	console.log('Success execute the demo file.\n'+stdout);
})