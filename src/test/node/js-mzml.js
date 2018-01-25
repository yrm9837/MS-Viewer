var jsmzml = require('js_mzml');
 
filename = './spectra/20170127_Zhe_MCF7_TDCID_200min.mzML';
var mzml = new jsmzml(filename);
 
var options = {
    'level': 'Both',
    'rtBegin': 0,
    'rtEnd': 0.005
};
 
var spectra = mzml.retrieve(options, function() {
    console.log(mzml.spectra);
});