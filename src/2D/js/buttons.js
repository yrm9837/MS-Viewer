
function Toolbar(containerEl,dataBridge) {
  this.dataBridge = dataBridge;
  this.containerEl = $(containerEl);
  var self = this;
	// open file button
	this.containerEl.find("#file").change(function() {
    var filename = self.containerEl.find("#file").val();
    if (filename != null || filename != undefined || filename != ""){
	    filename = filename.substr(12, filename.length - 12);
	    console.log("open file: " + filename);
	    self.dataBridge.fileName = filename;
	    self.dataBridge.openFile();
    }

	});
	// ms1 scan changed
	this.containerEl.find("#Select1").change(function() {
		if (self.dataBridge.spectrum1.scanSelect.value != "") {
			dataBridge.spectrum1.dataControls.scanChanged()
		}
	});
	// ms2 scan changed
	this.containerEl.find("#Select2").change(function() {
		if (self.dataBridge.spectrum2.scanSelect.value != "") {
			dataBridge.spectrum2.dataControls.scanChanged()
		}
	});
	// file list changed
	this.containerEl.find("#file_select").change(function() {
		if (self.dataBridge.fileSelect.selectedIndex != 0) {
	    var filename = self.dataBridge.fileSelect.value;
	    if (filename != null || filename != undefined || filename != ""){
		    console.log("open file: " + filename);
		    self.dataBridge.fileName = filename;
		    self.dataBridge.openFile();
	    }
		}
	});
	// delete files
	this.containerEl.find("#delete").click(function() {
		self.dataBridge.toDelete();
	});
	// save as png
	this.containerEl.find("#save1").click(function() {
		// console.log("Save");
		dataBridge.spectrum1.dataControls.saveAsPng();
	});
	this.containerEl.find("#save2").click(function() {
    // console.log("Save");
		dataBridge.spectrum2.dataControls.saveAsPng();
	});

}