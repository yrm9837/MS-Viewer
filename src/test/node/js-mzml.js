var jsmzml = require('js_mzml');
 
filename = './spectra/tiny.pwiz.1.1.mzML';
var mzml = new jsmzml(filename);
 
var options = {
    'level': 'Both',
    'rtBegin': 0,
    'rtEnd': 5555.005
};
 
var spectra = mzml.retrieve(options, function() {
    console.log(mzml.spectra);
});