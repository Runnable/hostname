'use strict';

require('bind-right'); // fn.bindRight
var pluck = require('101/pluck');
var replaceInvalid = require('./replace-invalid.js');
function add (a, b) {
  return (a || 0) + (b || 0);
}

module.exports = createHostLabel;

function createHostLabel (template, parts) {
  var maxLength = 63;
  var minLengthsLeft = parts
    .map(pluck('min'))
    .reduce(add);

  var hostLabel = parts
    .reduce(function (label, part) {
      var key = part.key;
      var val = part.val;
      var valMaxLength = part.max;
      var valMinLength = part.min;
      var lengthUsed = label.replace(/[{][^}]+[}]/g, '').length;
      minLengthsLeft -= valMinLength || 0;

      label = label.replace('{'+key+'}',
        val
          .slice(0, valMaxLength || val.length)
          .slice(0, maxLength - lengthUsed - minLengthsLeft)
      );

      return label;
    }, template);

  return replaceInvalid(hostLabel).toLowerCase();
}
