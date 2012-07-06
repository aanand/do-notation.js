var doNotation = require('../do-notation');

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
  return [x + " cousin " + y + " removed "];
}));
