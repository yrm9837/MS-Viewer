# js-mzml

js-mzML is a node module for parsing mzML files used in mass spectrometry.

This module is based off of cheminfo-js/mzML [found here](https://github.com/cheminfo-js/mzML), but some changes have been made. Notably:
* Both 32-bit and 64-bit compression is supported
* With or without zlib compression is supported
* The MS level can be specified
* The beginning and ending retention time can be specified

General information on how to decode mzML files also comes from [here](http://www.bryanesmith.com/docs/reading-binary-data-mzml/).

## Usage
js-mzML is installed with ```npm install -s js-mzml```

To use:
```javascript
var jsmzml = require('js-mzml');

filename = 'your-file-name-here.mzML';
var mzml = new jsmzml(filename);

var options = {
    'level': 'Both',
    'rtBegin': 0,
    'rtEnd': 0.005
};

var spectra = mzml.retrieve(options, function() {
    console.log(mzml.spectra);
});

```

The spectra will be of this form:
```javascript
 {'1':
    {
        id: 'controllerType=0 controllerNumber=1 scan=1',
        msLevel: '1',
        time: 0.004935,
        mass:
            Float32Array [
                data ...
            ],
        intensity:
            Float32Array [
                data ...
            ]
    }
}

```
There is also an ```example.js``` that you can modify to test things out.

js-mzML uses file streams under the hood which means that it is memory efficient and asynchronous-ish. Each js-mzML object has two variables associated with it, ```spectra``` (as discussed above) and ```isFinished```. The variable ```isFinished``` changes to false when the retrive method is called. This value will change to true once the file stream is finished and then the callback will be called. 

### Options
The options that can be passed to js-mzML are:

* ```level```: Either '1', '2', or 'Both'. '1' gives you MS data, '2' gives you MS/MS data, and 'Both' gives you both types. The default is 'Both'.
* ```rtBegin```: This is the earliest retention time you want to return data from. The default is 0.
* ```rtEnd```: This is the latest retention time you want to return data from. The default is 9999999999.

There is currently to way to declare the units of the retention time, so you will have to make sure those match the units of the files you are processing.

## Development
Tests can be run with ```npm run test```
There are spectra in the test folder from http://psidev.info/index.php?q=node/257

No breaking changes are expected in future versions, but this module was created to be part of a larger project, so changes may occur.

## Future Development
* Ability to specify minutes/seconds for retention time
* More MS levels (e.g. MS/MS/MS)

