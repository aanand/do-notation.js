var doNotation = require('../do-notation'),
    esprima    = require('esprima'),
    util       = require('util');

var inFn = function() {
  var x = 1;
  var y = 2;

  return x + y;
};

var expectedFn = function(bind) {
  return bind(1, function(x) {
    return bind(2, function(y) {
      return x + y;
    });
  });
};

var outFn = doNotation.transformFn(inFn);

function dump(obj) {
  return util.inspect(obj, false, null, true);
}

console.log('Input AST:\n'           + dump(esprima.parse('(' + inFn.toString() + ')')));
console.log('Expected output AST:\n' + dump(esprima.parse('(' + expectedFn.toString() + ')')));
console.log('Actual output AST:\n'   + dump(esprima.parse('(' + outFn.toString() + ')')));

console.log('Input:\n'           + inFn.toString());
console.log('Expected output:\n' + expectedFn.toString());
console.log('Actual output:\n'   + outFn.toString());
