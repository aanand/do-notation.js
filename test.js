var doNotation = require('./do-notation'),
    esprima = require('esprima'),
    util = require('util');

var inFn = function() {
  var x = 1;
  var y = 2;

  return x + y;
};

var outFn = function(bind) {
  return bind(1, function(x) {
    return bind(2, function(y) {
      return x + y;
    });
  });
};

function dump(obj) {
  return util.inspect(obj, false, null, true);
}

// console.log('Input AST:\n' + dump(esprima.parse('(' + inFn.toString() + ')')));
// console.log('Desired output AST:\n' + dump(esprima.parse('(' + outFn.toString() + ')')));

// console.log('Input:\n' + inFn.toString());
// console.log('Desired output:\n' + outFn.toString());
// console.log('Actual output:\n' + doNotation.transformFn(inFn).toString());

var bindIdentity = function(obj, fn) { return fn(obj) };
var bindMaybe    = function(obj, fn) { return obj && fn(obj) };
var bindList     = function(arr, fn) { return [].concat.apply([], arr.map(fn)) }

console.log(doNotation.run(bindIdentity, function() {
  var x = 1;
  var y = 2;
  return x + y;
}) === 3);

console.log(doNotation.run(bindMaybe, function() {
  var x = 1;
  var y = 2;
  return x + y;
}) === 3);

console.log(doNotation.run(bindMaybe, function() {
  var x = 1;
  var y = null;
  throw "error";
}) === null);

console.log(doNotation.run(bindList, function() {
  var x = ["first", "second"];
  var y = ["once", "twice"];
  return x + " cousin " + y + " removed ";
}));