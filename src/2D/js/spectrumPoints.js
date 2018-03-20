Spectrum.prototype.addPeaks = function(spectrum) {
	var self = spectrum;
	self.peaks.data(self.dataControls.peakmassShow)
	.enter()
	.append("line")
	.attr("class","MyPeak")
	.attr("transform","translate(" + self.padding.left + "," + self.padding.top + ")")
	.attr("x1",function(d,i){
		return self.dataControls.xScale(d);
	} )
	.attr("y1",function(d,i){
		return self.dataControls.yScale(self.dataControls.peakintensityShow[i]);
	})
	.attr("x2",function(d,i){
		return self.dataControls.xScale(d);
	})
	.attr("y2",self.height - self.padding.bottom - self.padding.top)
	.attr("stroke",function(d,i){
		return "black";
	})
	.attr("stroke-width","2")
	.on("mouseover",function(d,i){
		console.log("----spectrum level:"+spectrum.level);
		self.dataControls.over(this,d,i);
	})
	.on("mouseout",function(d,i){
		self.dataControls.out(this,d);
	});
}
Spectrum.prototype.addAxis = function(spectrum) {
	var self = spectrum;
	//添加x轴
	self.x_Axis = self.group_bottom.append("g")
		.attr("id","xAxis")
		.attr("class","axis")
		.attr("transform","translate(" + self.padding.left + "," + (self.height - self.padding.bottom) + ")")
		.call(self.dataControls.xAxis); 
		
	//添加y轴
	self.y_Axis = self.group_top.append("g")
		.attr("id","yAxis")
		.attr("class","axis")
		.attr("transform","translate(" + self.padding.left + "," + self.padding.top + ")")
		.call(self.dataControls.yAxis);
}

Spectrum.prototype.clear = function(spectrum) {
	var self = spectrum;
	console.log("spectrum level:"+self.level);
	self.group_top.selectAll(".MyPeak").remove();
	self.claerAxis(spectrum);
}
Spectrum.prototype.claerAxis = function(spectrum) {
	var self = spectrum;
	self.group_bottom.selectAll("g").remove();
	self.group_top.selectAll("g").remove();
}
Spectrum.prototype.reset = function(spectrum) {
	var self = spectrum;
	console.log("spectrum level:"+self.level);
	self.dataControls.cmpMassIntensity();
	var updatePeak = self.group_top.selectAll(".MyPeak").data(self.dataControls.peakmassShow);
  	updatePeak	
	.attr("x1",function(d,i){
  		var tmpx = (self.dataControls.xScale(d) + self.dataControls.dragx) * self.dataControls.xs + self.dataControls.x;
  		if (tmpx > 0 && tmpx < self.dataControls.xRange){
  			return tmpx;
  		}else{
  			return -1000;
  		}
	} )	
	.attr("y1",function(d,i){
		var yHight = self.height - self.padding.bottom - self.padding.top - self.dataControls.yScale(self.dataControls.peakintensityShow[i]);
  		var tmpy = self.height - self.padding.bottom - self.padding.top - yHight * self.dataControls.ys;
  		if (tmpy > self.height - self.padding.bottom){
  			return self.height - self.padding.bottom;
  		}else if (tmpy < 0){
  			return 0;
  		}else {
  			return tmpy;
  		}
	} )
	.attr("x2",function(d,i){
  		var tmpx = (self.dataControls.xScale(d) + self.dataControls.dragx) * self.dataControls.xs + self.dataControls.x;
  		if (tmpx > 0 && tmpx < self.dataControls.xRange){
  			return tmpx;
  		}else{
  			return -1000;
  		}
	});
	updatePeak
	.enter()
	.append("line")
	.attr("class","MyPeak")
	.attr("transform","translate(" + self.padding.left + "," + self.padding.top + ")")
	.attr("x1",function(d,i){
  		var tmpx = (self.dataControls.xScale(d) + self.dataControls.dragx) * self.dataControls.xs + self.dataControls.x;
  		if (tmpx > 0 && tmpx < self.dataControls.xRange){
  			return tmpx;
  		}else{
  			return -1000;
  		}
	} )	
	.attr("y1",function(d,i){
		var yHight = self.height - self.padding.bottom - self.padding.top - self.dataControls.yScale(self.dataControls.peakintensityShow[i]);
  		var tmpy = self.height - self.padding.bottom - self.padding.top - yHight * self.dataControls.ys;
  		if (tmpy > self.height - self.padding.bottom){
  			return self.height - self.padding.bottom;
  		}else if (tmpy < 0){
  			return 0;
  		}else {
  			return tmpy;
  		}
	} )
	.attr("x2",function(d,i){
  		var tmpx = (self.dataControls.xScale(d) + self.dataControls.dragx) * self.dataControls.xs + self.dataControls.x;
  		if (tmpx > 0 && tmpx < self.dataControls.xRange){
  			return tmpx;
  		}else{
  			return -1000;
  		}
	})
	.attr("y2",self.height - self.padding.bottom - self.padding.top)
	.attr("stroke",function(d,i){
		return "black";
	})
	.attr("stroke-width","2")
	.on("mouseover",function(d,i){
		self.dataControls.over(this,d,i);
	})
	.on("mouseout",function(d,i){
		self.dataControls.out(this,d);
	});
  	updatePeak.exit().remove();

	self.dataControls.dragd_zoom = self.dataControls.xDomain*self.dataControls.x/(self.dataControls.xRange*self.dataControls.xs);
	//x轴的比例尺
	var xScale_new = d3.scale.linear()
		.domain([0 - self.dataControls.dragd_zoom - self.dataControls.dragd_drag,self.dataControls.xDomain/self.dataControls.xs - self.dataControls.dragd_zoom - self.dataControls.dragd_drag])
		.range([0, self.dataControls.xRange]);
		//定义x轴
	self.dataControls.xAxis = d3.svg.axis()
		.scale(xScale_new)
		.orient("bottom")
    	.ticks(10);
	//y轴的比例尺
	var yScale_new = d3.scale.linear()
		.domain([0,d3.max(self.dataControls.peakintensity)/self.dataControls.ys])
		.range([self.height - self.padding.top - self.padding.bottom, 0]);
	//定义y轴
	self.dataControls.yAxis = d3.svg.axis()
		.scale(yScale_new)
		.orient("left")
		.tickFormat(function(d) { return Math.round(d * 100 / d3.max(self.dataControls.peakintensity)) + "%"; })
  	.ticks(10);

    self.claerAxis(self);
    self.addAxis(self);

};