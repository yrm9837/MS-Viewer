// spectrum.js: spectrum initialization code and helper methods

function Spectrum(containerEl,dataBridge,level) {
	self = this;
	this.level = level;
	this.containerEl = containerEl;
  this.scanSelect = document.getElementById("Select" + level);
	this.dataBridge = dataBridge;
	this.dataControls = new DataControls(this);
  //mzML file name
  this.FILE_NAME = "";

  this.x_Axis;
  this.y_Axis;

	//画布大小
	this.width = 1000;
	this.height = 400;


	//画布周边的空白
	this.padding = {left:100, right:100, top:50, bottom:50};

	//在 body 里添加一个 SVG 画布	
	this.svg = d3.select("body").select(containerEl)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("viewBox", "0 0 "+this.width+" "+this.height)
		.attr("width", "100%")
		.attr("height", "100%")
    .on('dblclick.zoom', this.dataControls.init)
  	.call(this.dataControls.drag);
  this.group_top = this.svg.append("g")
    .call(this.dataControls.yZoom);
  this.tect_top = this.group_top.append("rect")
  	.attr("x","0")
  	.attr("y","0")
  	.attr("width",this.width)
  	.attr("height",this.height - this.padding.bottom)
  	.attr("style","fill:rgb(255,255,255);stroke-width:0;stroke:rgb(0,0,0);fill-opacity:0");
  this.group_bottom = this.svg.append("g")
    .call(this.dataControls.xZoom)
    .on('mousedown', function(){
  		self.svg.attr("cursor","move");
        })
        .on('mouseup', function(){
  		self.svg.attr("cursor","default");
    });
  this.tect_bottom = this.group_bottom.append("rect")
  	.attr("x","0")
  	.attr("y",this.height - this.padding.bottom)
  	.attr("width",this.width)
  	.attr("height",this.padding.bottom)
  	.attr("style","fill:rgb(255,255,255);stroke-width:0;stroke:rgb(0,0,0);fill-opacity:0");

	this.peaks = this.group_top.selectAll(".MyPeak")
}


