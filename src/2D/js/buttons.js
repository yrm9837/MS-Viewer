
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

	// });
}