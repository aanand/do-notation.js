var esprima   = require('esprima'),
    escodegen = require('escodegen');

var transform = function(inFn, astTransformer) {
  var inAst   = esprima.parse('(' + inFn.toString() + ')').body[0].expression;
  var outAst  = astTransformer(inAst);
  var outCode = escodegen.generate(outAst);
  var outFn   = eval('(' + outCode + ')');

  return outFn;
}

module.exports = {
  transform: transform
}
