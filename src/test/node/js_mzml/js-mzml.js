var jsmzml = require('js_mzml');
 
filename = 'small.pwiz.1.1.mzML';
var mzml = new jsmzml(filename);
 
var options = {
    'level': 'Both',
    'rtBegin': 0,
    'rtEnd': 99999
};
 
var spectra = mzml.retrieve(options, function() {
    console.log(mzml.spectra);
});