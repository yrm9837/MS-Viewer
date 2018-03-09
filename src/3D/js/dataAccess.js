// dataAccess.js: communication with server-side API
function DataBridge(graph) {
    this.graph = graph;
    // this.fileSelect = this.graph.containerEl.find(".file_select");
    // console.log(this.fileSelect);
    this.fileSelect = document.getElementById("file_select");
    // addScan(this.fileSelect,"Select a mzML file."); 

    this.openCancelId = undefined;
    this.queueCancelIds = [];
    this.QUEUE_PLOT_DELAY = 200; // delay between drawing more points
    this.REQUEST_DELAY = 100; // wait this many milliseconds before actually sending a request, in case another one shows up instead
    this.INTENSITY_MIN = 0; // minimum intensity to request from the server
}

var API_UTIL = {
    // API_ROOT: "http://127.0.0.1:8081",
    API_ROOT: "",
    HTTP_200_OK: 200,
    HTTP_204_NO_CONTENT: 204,
    HTTP_400_BAD_REQUEST: 400,
    HTTP_403_FORBIDDEN: 403,
    HTTP_406_NOT_ACCEPTABLE: 406,
    HTTP_409_CONFLICT: 409,
    HTTP_500_SERVER_ERROR: 500
};

// wait for a file to load on the server
DataBridge.prototype.openFileWaitLoop = function() {
    var self = this;
    var _filename = self.graph.FILE_NAME;
    // check the status of data model
    $.getJSON(API_UTIL.API_ROOT + "/filestatus",{filename:_filename})
        .done(function(data, status, jqXHR) {
            // console.log("done"+jqXHR.status);
            switch(jqXHR.status)
            {
                case API_UTIL.HTTP_200_OK:
                    self.updateCommStatus("Data model completed");
                    
                    if (data.mzmin - data.mzmax <= 1) {
                        data.mzmax += 0.1;
                        data.mzmin -= 0.1;
                    }
                    
                    if (data.rtmin - data.rtmax <= 1) {
                        data.rtmax += 0.1;
                        data.rtmin -= 0.1;
                    }
                    
                    // data is ready, decode the range
                    self.graph.dataRange = {
                        mzmin: data.mzmin, mzmax: data.mzmax, mzrange: data.mzmax - data.mzmin,
                        rtmin: data.rtmin, rtmax: data.rtmax, rtrange: data.rtmax - data.rtmin,
                        intmin: data.intmin, intmax: data.intmax, intrange: data.intmax - data.intmin,
                    };
                    
                    console.log(self.graph.dataRange);
                    // clear plot and set scope to returned area
                    self.graph.clearData();
                    self.graph.setViewingArea(self.graph.dataRange);
                    
                    // request points to plot
                    self.requestPointsFromServer();
                   
                    break;
                    
                case API_UTIL.HTTP_204_NO_CONTENT:
                        self.updateCommStatus("No file loaded");
                        break;
            }
            
            
        })
        .fail(function(jqXHR, textStatus, errorThrown) 
        {
            // console.log("fail"+jqXHR.status);
            // console.log("fail"+textStatus);
            // console.log("fail"+errorThrown);
            switch(jqXHR.status)
            {   
                // file still being selected
                case API_UTIL.HTTP_403_FORBIDDEN:
                    self.updateCommStatus("Server selecting file...");
                    self.openCancelId = setTimeout(self.openFileWaitLoop.bind(self), 1000);
                    break;
                // previously selected file was the incorrect type
                case API_UTIL.HTTP_406_NOT_ACCEPTABLE:
                    self.updateCommStatus("File read error");
                    break;
                // data model being constructed
                case API_UTIL.HTTP_409_CONFLICT:
                    // continue waiting for success
                    self.updateCommStatus(jqXHR.responseText);
                    self.openCancelId = setTimeout(self.openFileWaitLoop.bind(self), 1000);
                    break;
            }
        });
};

// cancel waiting for the server
DataBridge.prototype.cancelFileWaitLoop = function() {
    if (this.openCancelId) {
        clearTimeout(this.openCancelId);
    }
};

// this fuction keeps a queue of points to be plotted and plots a certain
// number at a time before letting the browser respond to input again to avoid hangs
// newPoints is the set of points to add
DataBridge.prototype.queuePlotPoints = function(newPoints) {
    // cancel any existing runs of point plotting
    while (this.queueCancelIds.length > 0) {
        clearTimeout(this.queueCancelIds.pop());
    }

    this.updateCommStatus("Drawing points...");
    this.graph.clearData();
    var pointList = newPoints.slice(0);
    var batchSize = this.graph.POINTS_VISIBLE_LIMIT;
    
    // inner function that actually processes more points in the queue
    function morePoints() {
        if (pointList.length && this.graph.linesArray.length < this.graph.POINTS_PLOTTED_LIMIT) {
            // plot that batch of points
            var batch = pointList.splice(0, batchSize);
            this.graph.plotPoints(batch);

            // draw more points after a delay
            this.queueCancelIds.push(setTimeout(morePoints.bind(this), this.QUEUE_PLOT_DELAY));
        } else {
            this.updateCommStatus("Ready");
        }
    }
    
    this.queueCancelIds.push(setTimeout(morePoints.bind(this), 0));
}

// asks server for points in range.
DataBridge.prototype.requestPointsFromServer = function() {
    // cancel any existing request that might be near-ready
    clearTimeout(this.requestCancelId);

    // set timeout: ask server for points 
    this.requestCancelId = setTimeout((function() {         
        
        // find plotting range
        var range = {mzmin: this.graph.viewRange.mzmin, mzmax: this.graph.viewRange.mzmax, rtmin: this.graph.viewRange.rtmin, rtmax: this.graph.viewRange.rtmax};
        
        // HTTP request parameters
        var params = {
            mzmin: range.mzmin, mzmax: range.mzmax, rtmin: range.rtmin, rtmax: range.rtmax,
            numpoints: this.graph.POINTS_VISIBLE_LIMIT, intmin: this.INTENSITY_MIN
        };

        this.updateCommStatus("Requesting points...");

        var self = this;
        // send HTTP GET request, accept JSON
        $.getJSON(API_UTIL.API_ROOT + "/getpoints", params)
        
            // HTTP status codes 2XX
            .done(function(data, status, jqXHR) {
                switch(jqXHR.status){
                    case API_UTIL.HTTP_200_OK:
                        self.queuePlotPoints(data);
                        break;
                    case API_UTIL.HTTP_204_NO_CONTENT:
                        self.updateCommStatus("No file loaded");
                        break;
                    default:
                        self.updateCommStatus("No points received");
                        break;
                }

            })
            
            // HTTP status codes 4XX/5XX
            .fail(function(jqXHR, textStatus, errorThrown) {
                switch(jqXHR.status){
                    case API_UTIL.HTTP_400_BAD_REQUEST:
                        self.updateCommStatus("Client error");
                        break;
                    case API_UTIL.HTTP_406_NOT_ACCEPTABLE:
                        self.updateCommStatus("File read error");
                        break;
                    case API_UTIL.HTTP_409_CONFLICT:
                        self.updateCommStatus("Processing new file");
                        break;
                    case API_UTIL.HTTP_500_SERVER_ERROR:
                        self.updateCommStatus("Server error");
                        break;       
                }
            });
            
    }).bind(this), this.REQUEST_DELAY);
};

// instructs the server to prompt for a file
DataBridge.prototype.openFile = function()
{
    console.log("Starting call /openfile")
    // $.get(API_UTIL.API_ROOT + "/openfile", filename);
    this.updateCommStatus("Server selecting file...");
    this.openFileWaitLoop();
    console.log("Finishing call /openfile")
};

// instructs the server to save data model as _filename
DataBridge.prototype.saveDataModel = function(_filename)
{
    this.updateCommStatus("Server saving " + _filename + "...");
    
    var self = this;
    // send save instruction to server
    $.getJSON(API_UTIL.API_ROOT + "/savemodel",{filename: _filename})
            
            // HTTP status codes 2XX
            .done(function(data,status,jqXHR){
                switch(jqXHR.status){
                    case API_UTIL.HTTP_200_OK:
                        self.updateCommStatus("Saved to " + data.filepath);
                        break;
                    case API_UTIL.HTTP_204_NO_CONTENT:
                        self.updateCommStatus("Cannot save, no data loaded");
                        break;
                }
            })
            
            // HTTP status codes 4XX/5XX
            .fail(function(jqXHR,textStatus,errorThrown){
                self.updateCommStatus("Could not save " + _filename);
            });
};

// sends point updates to server with onSuccess and onFail callbacks
DataBridge.prototype.setPointsServer = function(data, onSuccess, onFail) {
    this.updateCommStatus("Saving segmentation...");
    
    var self = this;
    $.post({ url: API_UTIL.API_ROOT + "/updatesegmentation", data: data, contentType: "application/json" })
        .done(function(data, status, jqXHR) {
            switch(jqXHR.status) {
                case API_UTIL.HTTP_200_OK:
                    self.updateCommStatus("Ready.");
                    onSuccess();
                    break;
                case API_UTIL.HTTP_204_NO_CONTENT:
                    self.updateCommStatus("No data to save points to.");
                    onFail();
                    break;
            }
        })
        
        .fail(function(jqXHR, textStatus, errorThrown) {
            self.updateCommStatus("Failed to save points.");
            onFail();
        });
};

// updates the on-screen display of the server status
DataBridge.prototype.updateCommStatus = function(status) {
    this.graph.containerEl.find(".commStatus").text(status);
};

DataBridge.prototype.fileListPost = function(){
    var self = this
    // console.log("this.fileListPost");
    var xhr=new XMLHttpRequest();
    xhr.open("POST", API_UTIL.API_ROOT + "/filelist",true);
    xhr.onreadystatechange=function(){
        // console.log("xhr.readyState",xhr.readyState);
        // console.log("xhr.status",xhr.status);
        if(xhr.readyState==4){
            if(xhr.status==200){
                console.log(xhr.responseText);
                var fileNum = 0;
                var allFlies = xhr.responseText.split("\t");
                addScan(self.fileSelect,"Select a mzML file.");
                for (var i = 0; i < allFlies.length; i++) {
                    if (allFlies[i].length > 1) {
                        var singlefile = allFlies[i];
                        addScan(self.fileSelect,singlefile);
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

// 1.判断select选项中 是否存在Value="paraValue"的Item 
function jsSelectIsExitItem(objSelect, objItemValue) { 
    var isExit = false; 
    for (var i = 0; i < objSelect.options.length; i++) { 
        if (objSelect.options[i].value == objItemValue) { 
            isExit = true; 
            break; 
        } 
    } 
    return isExit; 
} 
// 2.向select选项中 加入一个Item 
function addScan(objSelect,scan){

    //判断是否存在 
    if (jsSelectIsExitItem(objSelect, scan)) { 
        // console.log("该Item的Value值已经存在"+scan); 
    } else { 
        var varItem = new Option(scan, scan); 
        objSelect.options.add(varItem); 
        // console.log("成功加入"); 
    } 
}
DataBridge.prototype.toDelete = function(){
    var xhr=new XMLHttpRequest();
    xhr.open("GET",API_UTIL.API_ROOT + "/delete.html",true);
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
            if(xhr.status==200){
                console.log("To delete");
                document.write(xhr.responseText);
                fileListPost();
            }
        }
    }
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.send(null);
}
