'use strict';
var invalid = new RegExp('[^A-Za-z0-9-]', 'g');

module.exports = function (str) {
  return str.replace(invalid, '-');
};


