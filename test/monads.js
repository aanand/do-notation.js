var assert     = require('assert'),
    doNotation = require('../lib/do-notation');

describe('the identity monad', function() {
  var bind = function(obj, fn) { return fn(obj) };

  it('behaves like normal variable assignment', function() {
    assert.equal(doNotation.run(bind, function() {
      var x = 1;
      var y = 2;
      return x + y;
    }), 3)
  })
})

describe('the maybe monad', function() {
  var bind = function(obj, fn) { return obj && fn(obj) };

  it('behaves normally when there are no nulls', function() {
    assert.equal(doNotation.run(bind, function() {
      var x = 1;
      var y = 2;
      return x + y;
    }), 3);
  });

  it('short-circuits when it encounters a null value', function() {
    assert.equal(doNotation.run(bind, function() {
      var x = 1;
      var y = null;
      throw "error";
    }), null);
  });
})

describe('the list monad', function() {
  var bind = function(arr, fn) { return [].concat.apply([], arr.map(fn)) };

  it('returns all combinations', function() {
    assert.deepEqual(doNotation.run(bind, function() {
      var x = ["first", "second"];
      var y = ["once", "twice"];
      return [x + " cousin " + y + " removed"];
    }), [
      "first cousin once removed",
      "first cousin twice removed",
      "second cousin once removed",
      "second cousin twice removed"
    ]);
  })
})
