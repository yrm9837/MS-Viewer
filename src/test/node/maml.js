import {mzML} from 'mzml';

// mzML files
const mzMLFile = readFileSync("./spectra/small_32bit.mzML");
var response = mzML(mzMLFile);
console.log(response);