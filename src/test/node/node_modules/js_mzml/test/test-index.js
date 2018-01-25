var should = require('chai').should();
var jsmzml = require('../index');

describe('parsing 32-bit', function() {
  var mzml = new jsmzml('./test/spectra/small_32bit.mzML');
  var options = {
    'level': 'Both',
    'rtBegin': 0,
    'rtEnd': 0.005
  };
  it('parses correctly', function() {
    var spectra = mzml.retrieve(options, function() {
      mzml.isFinished.should.equal(true);
      mzml.spectra['1'].msLevel.should.equal('1');
      mzml.spectra['1'].mass[0].should.equal(204.76007080078125);
    });   
  });
});

describe('parsing 32-bit w/ zlib', function() {
  var mzml = new jsmzml('./test/spectra/small_32bit_zlib.mzML');
  var options = {
    'level': 'Both',
    'rtBegin': 0,
    'rtEnd': 0.005
  };
  it('parses correctly', function() {
    var spectra = mzml.retrieve(options, function() {
      mzml.isFinished.should.equal(true);
      mzml.spectra['1'].msLevel.should.equal('1');
      mzml.spectra['1'].mass[0].should.equal(204.76007080078125);
    });   
  });
});

describe('parsing 64-bit', function() {
  var mzml = new jsmzml('./test/spectra/small_64bit.mzML');
  var options = {
    'level': 'Both',
    'rtBegin': 0,
    'rtEnd': 0.005
  };
  it('parses correctly', function() {
    var spectra = mzml.retrieve(options, function() {
      mzml.isFinished.should.equal(true);
      mzml.spectra['1'].msLevel.should.equal('1');
      mzml.spectra['1'].mass[0].should.equal(204.76007080078125);
    });   
  });
});

describe('parsing 64-bit w/ zlib', function() {
  var mzml = new jsmzml('./test/spectra/small_64bit_zlib.mzML');
  var options = {
    'level': 'Both',
    'rtBegin': 0,
    'rtEnd': 0.005
  };
  it('parses correctly', function() {
    var spectra = mzml.retrieve(options, function() {
      mzml.isFinished.should.equal(true);
      mzml.spectra['1'].msLevel.should.equal('1');
      mzml.spectra['1'].mass[0].should.equal(204.76007080078125);
    });   
  });
});


describe('choosing MS level', function() {
  var mzml = new jsmzml('./test/spectra/small_64bit_zlib.mzML');
  var options1 = {
    'level': '1',
    'rtBegin': 0,
    'rtEnd': 0.005
  };
  var options2 = {
    'level': '2',
    'rtBegin': 0,
    'rtEnd': 0.005
  };
  it('gets level 1', function() {
    var spectra = mzml.retrieve(options1, function() {
      Object.keys(spectra).length.should.equal(1);      
    });
  });
  it('doesn\'t get level 2', function() {
    var spectra = mzml.retrieve(options2, function() {
      Object.keys(spectra).length.should.equal(0);      
    });
  });   
});

  
