var esprima   = require('esprima'),
    escodegen = require('escodegen'),
    util      = require('util');

var transformFn = function(inFn) {
  var inAst   = esprima.parse('(' + inFn.toString() + ')').body[0].expression;
  var outAst  = transformAst(inAst);
  var outCode = escodegen.generate(outAst);
  var outFn   = eval('(' + outCode + ')');

  return outFn;
}

var transformAst = function(inAst) {
  return {
    type: 'FunctionExpression',
    id: null,
    params: [{type: 'Identifier', name: 'bind'}],
    body: {
      type: 'BlockStatement',
      body: transformVariableDeclarations(inAst.body.body)
    }
  }
}

var transformVariableDeclarations = function(body) {
  if (body.length === 0) return body;

  var statement = body[0];

  if (statement.type === 'VariableDeclaration') {
    if (statement.declarations.length > 1) {
      throw "Don't support multi-var declarations yet";
    }

    var declaration  = statement.declarations[0],
        value        = declaration.init,
        identifier   = declaration.id,
        functionBody = transformVariableDeclarations(body.slice(1));

    return [{
      type: 'ReturnStatement',
      argument: {
        type: 'CallExpression',
        callee: {type: 'Identifier', name: 'bind'},
        arguments: [
          value,
          {
            type: 'FunctionExpression',
            id: null,
            params: [identifier],
            body: {
              type: 'BlockStatement',
              body: functionBody
            }
          }
        ]
      }
    }]
  } else if (body.length > 1) {
    throw "Encountered a non-variable-declaration statement before the end of the function";
  } else {
    return body;
  }
}

module.exports = {
  transformFn: transformFn,
  run: function(bind, fn) { return transformFn(fn)(bind) }
}