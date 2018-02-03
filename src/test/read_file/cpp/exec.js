var exec = require('child_process').exec;
var mzML_filename = "./mzml_reader/testcases/data/BW_20_1_111105183512_hcd.mzML";

var scanList = [];
var scanIndex = [];
var peakData = [];

function readScanList() {
	var cmd = "./msReader " + mzML_filename + " -s 1";
	exec(cmd,function(error, stdout,stderr) {
		// get the output
		// console.log('Success execute the demo file.\n'+stdout);
		var scanNum = 0;
		var allScan = stdout.split("\t");
		// console.log('allScan length: '+allScan.length);
		for (var i = 0; i < allScan.length; i++) {
			if (allScan[i].length > 1) {
				var singleScan = allScan[i].split(",");
				scanIndex[scanNum] = Number(singleScan[0]);
				scanList[scanNum] = Number(singleScan[1]);
				// console.log(scanNum+","+singleScan[0]+","+singleScan[1]);
				// console.log(scanNum+","+scanIndex[scanNum]+","+scanList[scanNum]);
				scanNum++;
			}
		}
		showScanList();
	})
}
function showScanList() {
	// console.log('scanList length: '+scanList.length);
	for (var i = 0; i <scanList.length; i++) {
		console.log(scanIndex[i] + "," + scanList[i]);
	}
}
function readPeakData() {
	var cmd = "./msReader " + mzML_filename + " 84";
	exec(cmd,function(error, stdout,stderr) {
		// get the output
		// console.log('Success execute the demo file.\n'+stdout);
		var peakNum = 0;
		var allPeak = stdout.split("\t");
		for (var i = 0; i < allPeak.length; i++) {
			if (allPeak[i].length > 1) {
				var singlePeak = allPeak[i].split(",");
				peakData[peakNum] = [Number(singlePeak[0]),Number(singlePeak[1])];
				peakNum++;
			}
		}
		showPeakData();
	})
}
function showPeakData() {
	// console.log('scanList length: '+scanList.length);
	for (var i = 0; i <peakData.length; i++) {
		console.log(peakData[i][0] + "," + peakData[i][1]);
	}
}

function main() {
	// console.log("Start reading file :" + mzML_filename);
	// readScanList();


	console.log("Start reading peaks :" + mzML_filename);
	readPeakData();
}

main();