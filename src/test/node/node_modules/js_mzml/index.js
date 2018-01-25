var base64 = require('base64-js');
var pako = require('pako');
var saxStream = require('sax').createStream(true);
var fs = require('fs');

module.exports = class JsMzml {
  constructor(filename) {
    this.filename = filename;
    this.spectra = {};
    this.isFinished = true;
  }

  // The following code is heavily based on https://github.com/cheminfo-js/mzML
  // Changes have been made to suit my use case
  retrieve(options, callback) {
    var options = options || {};
    var level = options.level || "Both";
    var rtBegin = options.rtBegin || 0;
    var rtEnd = options.rtEnd || 9999999999;

    this.isFinished = false;
    var entry = {};
    var currentId;
    var kind;
    var nextValue;
    var readRaw;
    var bitType;
    var isCompressed;

    var self = this;

    var index = 1;

    saxStream.on("opentag", function(node) {
      readRaw = node.name === 'binary';

      switch (node.name) {
        case 'mzML':
          kind = 'mzML';
          break;
        case 'spectrum':
          if (node.attributes.id) {
            if (Object.keys(entry).length > 0) {
              if (entry.msLevel === level || level === 'Both') {
                if (entry.time <= rtEnd && entry.time >= rtBegin) {
                  self.spectra[index] = Object.assign({}, entry);
                  index++;
                  entry = {};                  
                }
              }
            }
            currentId = node.attributes.id;
            entry.id = currentId;
          }
          break;
        case 'chromatogram':
          currentId = undefined;
          break;
        case 'cvParam':
          switch (node.attributes.name) {
              case 'm/z array':
                nextValue = 'MASS';
                break;
              case 'intensity array':
                nextValue = 'INTENSITY';
                break;
              case 'scan start time':
                entry.time = parseFloat(node.attributes.value);
                break;
              case '64-bit float':
                bitType = '64';
                break;
              case '32-bit float':
                bitType = '32';
                break;
              case 'zlib compression':
                isCompressed = true;
                break;
              case 'ms level':
                entry.msLevel = node.attributes.value;
                break;
              default:
                nextValue = null;
                break;
          }
          break;
      }
    });

    saxStream.on("text", function(raw) {
      if (readRaw && currentId) {
        if (nextValue === 'MASS') {
          entry.mass = self.decodeData(raw, bitType, isCompressed);
        } else if (nextValue === 'INTENSITY') {
          entry.intensity = self.decodeData(raw, bitType, isCompressed);
        }
        nextValue = null;
      }
    });

    saxStream.on("end", function() {
      self.isFinished = true;
      callback();
    });

    fs.createReadStream(this.filename)
      .pipe(saxStream);
  }

  decodeData(raw, bitType, isCompressed) {
    var array = [];
    var buffer = base64.toByteArray(raw);
    if (isCompressed) {
      buffer = pako.inflate(buffer);
    }

    if (bitType === '32') {
      return new Float32Array(buffer.buffer);
    }
    else if (bitType === '64') {
      return new Float64Array(buffer.buffer);
    }
    else {
      return [];
    }
    return [];
  }
}