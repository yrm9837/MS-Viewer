function DataBridge() {
	this.spectrum1 = new Spectrum("#ms1svg",this,1);
	this.spectrum2 = new Spectrum("#ms2svg",this,2);
	this.Toolbar = new Toolbar("body", this);
    this.fileSelect = document.getElementById("file_select");
    this.fileName = "";
    this.isLoading = false;
    var self = this;
    // this.ADDRESS = "http://127.0.0.1:8081"
    this.ADDRESS = "http://149.166.112.123:8081"

	var isLoading = false;
	this.openFile = function() {
		self.filePathPost(self.spectrum1);
		self.filePathPost(self.spectrum2);
	}
    this.filePathPost = function(spectrum){
    	var dataControls = spectrum.dataControls;
        var xhr=new XMLHttpRequest();
        xhr.open("POST",self.ADDRESS + "/file_path_post" + spectrum.level,true);
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){
                if(xhr.status==200){
                    console.log(xhr.responseText);
					var scanNum = 0;
					var allScan = xhr.responseText.split("\t");
					for (var i = 0; i < allScan.length; i++) {
						if (allScan[i].length > 1) {
							var singleScan = allScan[i].split(",");
							dataControls.scanIndex[scanNum] = Number(singleScan[0]);
							dataControls.scanList[scanNum] = Number(singleScan[1]);
							dataControls.addScan(spectrum.scanSelect,singleScan[1]);
							scanNum++;
						}
					}
					dataControls.scanChanged()
                }
            }
        }
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        console.log("filePath="+self.fileName);
        // console.log("level="+spectrum.level);
        xhr.send("filePath="+self.fileName);
        // filePathPost2();
    }
    this.scanPost = function(nowScanIndex,spectrum){
    	var dataControls = spectrum.dataControls;
        var xhr=new XMLHttpRequest();
        xhr.open("POST",self.ADDRESS + "/scan_post",true);
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){
                if(xhr.status==200){
					var peakNum = 0;
					var allPeak = xhr.responseText.split("\t");
					for (var i = 0; i < allPeak.length; i++) {
						if (allPeak[i].length > 1) {
							var singlePeak = allPeak[i].split(",");
							dataControls.peakData[peakNum] = [Number(singlePeak[0]),Number(singlePeak[1])];
							peakNum++;
						}
					}
					dataControls.convertData();
					dataControls.cmpMassIntensity();
					spectrum.addPeaks(spectrum);
					spectrum.addAxis(spectrum);
            	}
            }
        }
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        console.log("nowScan="+dataControls.nowScan);
        console.log("nowScanIndex="+nowScanIndex);
        xhr.send("nowScanIndex="+nowScanIndex);
    }
    this.fileListPost = function(){
        // console.log("this.fileListPost");
        var dataControls = this.spectrum1.dataControls;
        var xhr=new XMLHttpRequest();
        xhr.open("POST",self.ADDRESS + "/filelist",true);
        xhr.onreadystatechange=function(){
            // console.log("xhr.readyState",xhr.readyState);
            // console.log("xhr.status",xhr.status);
            if(xhr.readyState==4){
                if(xhr.status==200){
                    console.log(xhr.responseText);
                    var fileNum = 0;
                    var allFlies = xhr.responseText.split("\t");
                    dataControls.addScan(self.fileSelect,"Select a mzML file.");
                    for (var i = 0; i < allFlies.length; i++) {
                        if (allFlies[i].length > 1) {
                            var singlefile = allFlies[i];
                            dataControls.addScan(self.fileSelect,singlefile);
                            fileNum++;
                        }
                    }
                }
            }
        }
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.send();
        // filePathPost2();
    }
    this.init = function() {
        console.log("init");
        this.fileListPost();
    }
}