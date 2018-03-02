DataControls = function(spectrum) {
	var self = this;
	this.spectrum = spectrum;

	console.log("spectrum level:"+spectrum.level);
	this.nowScan = -1;
	this.scanList = [];
	this.scanIndex = [];
	this.peakData = [];
	
	this.xDomain;
	this.xRange;
	this.xScale;
	this.yScale;
	this.xAxis;
	this.yAxis;

	this.x = 0;
	this.y = 0;
	this.xs = 1;
	this.ys = 1;
	this.dragx = 0;
	this.dragd_zoom = 0;
	this.dragd_drag = 0;

	this.peakmass = [];
	this.peakintensity = [];
	this.peakmassShow = [];
	this.peakintensityShow = [];
	this.maxPeakintensity = 0;
	this.MAX_PEAKS_COUNT = 1000;

	this.convertData = function() {
		var i = self.peakData.length;
		while(i--) {
			self.peakmass[i] = self.peakData[i][0];
			self.peakintensity[i] = self.peakData[i][1];
		}
		self.maxPeakintensity = d3.max(self.peakintensity);
		var i = self.peakintensity.length;
		while(i--) {
			self.peakintensity[i] = self.peakintensity[i] / self.maxPeakintensity
		}
		console.log(self.peakmass);
		console.log(self.peakintensity);

		self.xDomain = d3.max(self.peakmass) * 1.1 - d3.min(self.peakmass) * 0.1
		self.xRange = spectrum.width - spectrum.padding.left - spectrum.padding.right
		//x轴的比例尺
		self.xScale = d3.scale.linear()
			.domain([0,self.xDomain])
			.range([0, self.xRange]);
		//y轴的比例尺
		self.yScale = d3.scale.linear()
			.domain([0,d3.max(self.peakintensity)])
			.range([spectrum.height - spectrum.padding.top - spectrum.padding.bottom, 0]);

		//定义x轴
		self.xAxis = d3.svg.axis()
			.scale(self.xScale)
			.orient("bottom")
	        .ticks(10);
			
		//定义y轴
		self.yAxis = d3.svg.axis()
			.scale(self.yScale)
			.orient("left")
    		.tickFormat(function(d) { return Math.round(d * 100 / d3.max(self.peakintensity)) + "%"; })
        	.ticks(10);

	}
	// convertData();
	// cmpMassIntensity();
	this.cmpMassIntensity = function() {
			// console.log("dragx:"+self.dragx);
		console.log("spectrum level:"+self.level);
		console.log(self.peakmass);
		self.peakmassShow = [];
		self.peakintensityShow = [];
		var peakCount = 0;
		// console.log("xRange:"+self.xRange);
		for(var i = 0; i < self.peakmass.length; i++) {
			var tmpx = (self.xScale(self.peakmass[i]) + self.dragx) * self.xs + self.x;
			// console.log(i+"level:"+self.spectrum.level);
			// console.log(i+"dragx:"+self.dragx);
			// console.log(i+"tmpx:"+tmpx);
			// break;
			if (tmpx > 0 && tmpx < self.xRange){
				if(self.peakCount == 0) {
					self.peakmassShow[peakCount] = self.peakmass[i];
					self.peakintensityShow[peakCount] = self.peakintensity[i];
					peakCount++;
				} else {
					if(self.xScale(self.peakmass[i])-self.xScale(self.peakmassShow[peakCount-1]) < self.xRange/(self.MAX_PEAKS_COUNT*self.xs)) {
						if(self.peakintensity[i]>self.peakintensityShow[peakCount-1]) {
							self.peakmassShow[peakCount-1] = self.peakmass[i];
							self.peakintensityShow[peakCount-1] = self.peakintensity[i];
						}
					} else {
						self.peakmassShow[peakCount] = self.peakmass[i];
						self.peakintensityShow[peakCount] = self.peakintensity[i];
						peakCount++;
					}
				}
			}
		}	
		console.log("peakCount:"+peakCount);
		// console.log(self.peakmassShow);
		// console.log(self.peakintensityShow);
	}

	// var scanSelect = this.spectrum.scanSelect;
	// scanSelect.onchange = this.scanChanged;

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
	this.addScan = function(objSelect,scan){

		//判断是否存在 
		if (jsSelectIsExitItem(objSelect, scan)) { 
			// console.log("该Item的Value值已经存在"+scan); 
		} else { 
			var varItem = new Option(scan, scan); 
			objSelect.options.add(varItem); 
			// console.log("成功加入"); 
		} 
	}

	this.scanChanged = function() {
		// svg.call(xZoom.translate([0,0]).scale(1).event);
		// svg.call(yZoom.translate([0,0]).scale(1).event);
		var spectrum = self.spectrum;
		dragx = 0;

		var currSelectValue = Number(spectrum.scanSelect.value);
		self.nowScan = currSelectValue;
		spectrum.clear(spectrum);
		spectrum.dataBridge.scanPost(spectrum.scanSelect.selectedIndex,spectrum);

		if(!self.spectrum.dataBridge.isLoading) {
			self.spectrum.dataBridge.isLoading = true;
			if(spectrum.level == 1) {
				var MS2ScanIndex = self.getMS2Scan(self.scanIndex[self.spectrum.scanSelect.selectedIndex]);
				self.spectrum.dataBridge.spectrum2.scanSelect.selectedIndex = MS2ScanIndex;
				self.spectrum.dataBridge.spectrum2.dataControls.scanChanged();
			} else {
				var MS1ScanIndex = self.getMS1Scan(self.scanIndex[self.spectrum.scanSelect.selectedIndex]);
				if (self.spectrum.dataBridge.spectrum1.scanSelect.selectedIndex != MS1ScanIndex) {
					self.spectrum.dataBridge.spectrum1.scanSelect.selectedIndex = MS1ScanIndex;
					self.spectrum.dataBridge.spectrum1.dataControls.scanChanged();
				}
			}
			self.spectrum.dataBridge.isLoading = false;
			// console.log("MS2ScanIndex:"+MS2ScanIndex);
		}
	}

	this.getMS2Scan = function(MS1ScanIndex) {
		// console.log("scanIndex2.length:"+scanIndex2.length);
		var spectrum2 = self.spectrum.dataBridge.spectrum2;
		for (var i = 0; i < spectrum2.dataControls.scanIndex.length; i++) {
			// console.log("<MS1ScanIndex,scanIndex2[i]>:<"+MS1ScanIndex+","+scanIndex2[i]+">");
			if (MS1ScanIndex < spectrum2.dataControls.scanIndex[i]) {
				return i;
			}
		}
		return 0;
	}
	this.getMS1Scan = function(MS2ScanIndex) {
		// console.log("scanIndex.length:"+scanIndex.length);
		var spectrum1 = self.spectrum.dataBridge.spectrum1;
		for (var i = 0; i < spectrum1.dataControls.scanIndex.length; i++) {
			// console.log("<MS2ScanIndex,scanIndex[i]>:<"+MS2ScanIndex+","+scanIndex[i]+">");
			if (MS2ScanIndex < spectrum1.dataControls.scanIndex[i]) {
				return i-1;
			}
		}
		return spectrum1.dataControls.scanIndex.length - 1;
	}

	this.textMZ;
	this.textIN;
	this.over = function(t,d,i){
		console.log("----spectrum level:"+self.spectrum.level);
		var tmpData = [[d,self.yScale(self.peakintensityShow[i])]];
		d3.select(t).attr("stroke","red")
			.attr("stroke-width","3");
		self.textMZ = spectrum.group_top.selectAll(".MyTextMZ")
			.data(tmpData)
			.enter()
			.append("text")
			.attr("class","MyTextMZ")
			.attr("transform","translate(" + spectrum.padding.left + "," + spectrum.padding.top + ")")
			.attr("x", function(d) {
				var tmpx = (self.xScale(d[0]) + self.dragx) * self.xs + self.x;
		  		if (tmpx > 0 && tmpx < self.xRange){
		  			return tmpx;
		  		}else{
		  			return -1000;
		  		}
			})
			.attr("y", function(d) {
				var yHight = spectrum.height - spectrum.padding.bottom - spectrum.padding.top - d[1];
		  		var tmpy = spectrum.height - spectrum.padding.bottom - spectrum.padding.top - yHight * self.ys;
		  		if (tmpy > spectrum.height - spectrum.padding.bottom){
		  			return spectrum.height - spectrum.padding.bottom - 20;
		  		}else if (tmpy < 0){
		  			return 0 - 20;
		  		}else {
		  			return tmpy - 20;
		  		}
			})
			.text(function(d){
				return "M:"+d[0];
			});
		self.textIN = spectrum.group_top.selectAll(".MyTextIN")
			.data(tmpData)
			.enter()
			.append("text")
			.attr("class","MyTextMZ")
			.attr("transform","translate(" + spectrum.padding.left + "," + spectrum.padding.top + ")")
			.attr("x", function(d) {
				var tmpx = (self.xScale(d[0]) + self.dragx) * self.xs + self.x;
		  		if (tmpx > 0 && tmpx < self.xRange){
		  			return tmpx;
		  		}else{
		  			return -1000;
		  		}
			})
			.attr("y", function(d) {
				var yHight = spectrum.height - spectrum.padding.bottom - spectrum.padding.top - d[1];
		  		var tmpy = spectrum.height - spectrum.padding.bottom - spectrum.padding.top - yHight * self.ys;
		  		if (tmpy > spectrum.height - spectrum.padding.bottom){
		  			return spectrum.height - spectrum.padding.bottom - 10;
		  		}else if (tmpy < 0){
		  			return 0 - 10;
		  		}else {
		  			return tmpy - 10;
		  		}
			})
			.text(function(d){
				return "I:"+self.peakintensityShow[i]*100+"%";
			});
	};
	this.out = function(t,d){
		d3.select(t)
			.transition()
	        .duration(500)
			.attr("stroke",function(d){
				return "black";	
			})
			.attr("stroke-width","2");

		self.textMZ.remove();
		self.textIN.remove();
	};


	this.xZoom = d3.behavior.zoom()
		.translate([0, 0])
		.scaleExtent([1, 100000000])
		.scale(1)
		.on("zoom", xZoomed);
	this.yZoom = d3.behavior.zoom()
		.translate([0, 0])
		.scaleExtent([1, 100000000])
		.scale(1)
		.on("zoom", yZoomed);
	//开启拖动
	this.drag = d3.behavior.drag()
	    .on("dragstart", dragstarted)
	    .on("drag", dragged)
	    .on("dragend", dragended);

	function xZoomed() {
		self.xs=d3.event.scale;
		self.x=d3.event.translate[0] + spectrum.padding.left * (self.xs - 1);
		spectrum.reset(spectrum);
	};
	function yZoomed() {
		self.ys=d3.event.scale;
		spectrum.reset(spectrum);
	};
	function dragstarted() {
	  d3.event.sourceEvent.stopPropagation();
	  d3.select(this).classed("dragging", true);
		spectrum.svg.attr("cursor","move");
	}
	function dragged() {
		self.dragx += d3.event.dx/self.xs;
		self.dragd_drag = self.xDomain*self.dragx/self.xRange;
		spectrum.reset(spectrum);
	}
	function dragended() {
	  d3.select(this).classed("dragging", false);
		spectrum.svg.attr("cursor","default");
	}


	this.init = function() {
		d3.transition().duration(500).tween("zoom", function() {
		    var xsi = d3.interpolate(self.xs, 1);
		    var ysi = d3.interpolate(self.ys, 1);
		    var xi = d3.interpolate(self.x - spectrum.padding.left * (self.xs - 1), 0);
		    var yi = d3.interpolate(self.y, 0);
		    var dragxi = d3.interpolate(self.dragx, 0);
		    return function(t){
		      self.dragx = dragxi(t);
			  self.dragd_drag = self.xDomain*self.dragx/self.xRange;
		      spectrum.svg.call(self.xZoom.translate([xi(t),yi(t)]).scale(xsi(t)).event);
		      spectrum.svg.call(self.yZoom.translate([xi(t),yi(t)]).scale(ysi(t)).event);
		 	}
  		});

	}
}