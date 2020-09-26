(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
math.import(require('mathjs-simple-integral'));
  function draw() {
    try {
      //Grabs expression from input
      const expression = document.getElementById('eq').value

      //Transform the expression into a math object
      const expr = math.compile(expression)

      //Evaluate the expression repeatedly for different values of x
      const xValues = math.range(-10, 10, 0.1).toArray() // Returns [-10, -9.9, -9.8,...]
      const yValues = xValues.map(function (x) {
        return expr.evaluate({x: x})
      }) // [someYValue, someOtherYValue, ...]

      //Config object for plot
      const trace1 = {
        x: xValues,
        y: yValues,
        type: 'scatter'
      }
      const data = [trace1]
      Plotly.newPlot('plot', data, {}, {displayModeBar: false})

      //Get Derivative
      const derivativeExpression = math.derivative(expression, 'x');
      document.getElementById('derivative').innerHTML = derivativeExpression;

      const derivative = math.compile(String(derivativeExpression))

      const xValues2 = math.range(-10, 10, 0.1).toArray()
      const yValues2 = xValues2.map(function (x) {
        return derivative.evaluate({x: x})
      })

      const trace2 = {
        x: xValues2,
        y: yValues2,
        type: 'scatter'
      }
      const data2 = [trace2]
      Plotly.newPlot('derivativePlot', data2, {}, {displayModeBar: false})


      //Integral
      const integralExpression =  math.integral(expression, 'x')
      document.getElementById('integral').innerHTML = integralExpression;

      const integral = math.compile(String(integralExpression))

      const xValues3 = math.range(-10, 10, 0.1).toArray()
      const yValues3 = xValues3.map(function (x) {
        return integral.evaluate({x: x})
      })

      const trace3 = {
        x: xValues3,
        y: yValues3,
        type: 'scatter'
      }
      const data3 = [trace3]
      Plotly.newPlot('integralPlot', data3, {}, {displayModeBar: false})
    }
    catch (err) {
      console.error(err)
      alert(err)
    }
  }

  document.getElementById('form').onsubmit = function (event) {
    event.preventDefault()
    draw()
  }

  draw()
},{"mathjs-simple-integral":3}],2:[function(require,module,exports){
"use strict";

// Map the characters to escape to their escaped values. The list is derived
// from http://www.cespedes.org/blog/85/how-to-escape-latex-special-characters

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var defaultEscapes = {
  "{": "\\{",
  "}": "\\}",
  "\\": "\\textbackslash{}",
  "#": "\\#",
  $: "\\$",
  "%": "\\%",
  "&": "\\&",
  "^": "\\textasciicircum{}",
  _: "\\_",
  "~": "\\textasciitilde{}"
};
var formatEscapes = {
  "\u2013": "\\--",
  "\u2014": "\\---",
  " ": "~",
  "\t": "\\qquad{}",
  "\r\n": "\\newline{}",
  "\n": "\\newline{}"
};

var defaultEscapeMapFn = function defaultEscapeMapFn(defaultEscapes, formatEscapes) {
  return _extends({}, defaultEscapes, formatEscapes);
};

/**
 * Escape a string to be used in LaTeX documents.
 * @param {string} str the string to be escaped.
 * @param {boolean} params.preserveFormatting whether formatting escapes should
 *  be performed (default: false).
 * @param {function} params.escapeMapFn the function to modify the escape maps.
 * @return {string} the escaped string, ready to be used in LaTeX.
 */
module.exports = function (str) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$preserveFormatti = _ref.preserveFormatting,
      preserveFormatting = _ref$preserveFormatti === undefined ? false : _ref$preserveFormatti,
      _ref$escapeMapFn = _ref.escapeMapFn,
      escapeMapFn = _ref$escapeMapFn === undefined ? defaultEscapeMapFn : _ref$escapeMapFn;

  var runningStr = String(str);
  var result = "";

  var escapes = escapeMapFn(_extends({}, defaultEscapes), preserveFormatting ? _extends({}, formatEscapes) : {});
  var escapeKeys = Object.keys(escapes); // as it is reused later on

  // Algorithm: Go through the string character by character, if it matches
  // with one of the special characters then we'll replace it with the escaped
  // version.

  var _loop = function _loop() {
    var specialCharFound = false;
    escapeKeys.forEach(function (key, index) {
      if (specialCharFound) {
        return;
      }
      if (runningStr.length >= key.length && runningStr.slice(0, key.length) === key) {
        result += escapes[escapeKeys[index]];
        runningStr = runningStr.slice(key.length, runningStr.length);
        specialCharFound = true;
      }
    });
    if (!specialCharFound) {
      result += runningStr.slice(0, 1);
      runningStr = runningStr.slice(1, runningStr.length);
    }
  };

  while (runningStr) {
    _loop();
  }
  return result;
};
},{}],3:[function(require,module,exports){
module.exports = [
  require('./lib')
]

},{"./lib":4}],4:[function(require,module,exports){
module.exports = [
  require('./integral.js')
];

},{"./integral.js":5}],5:[function(require,module,exports){
'use strict';

function factory(type, config, load, typed) {
  var parse = load(require('mathjs/lib/expression/parse'));
  var simplify = load(require('mathjs/lib/function/algebra/simplify'));
  var simplifyConstant = load(require('mathjs/lib/function/algebra/simplify/simplifyConstant'));
  var ConstantNode = load(require('mathjs/lib/expression/node/ConstantNode'));
  var FunctionNode = load(require('mathjs/lib/expression/node/FunctionNode'));
  var OperatorNode = load(require('mathjs/lib/expression/node/OperatorNode'));
  var SymbolNode = load(require('mathjs/lib/expression/node/SymbolNode'));

  /**
   * Finds the integral of an expression with respect to the given variable.
   *
   * The basic algorithm works as follows: the integrand to each function in the
   * `rules` array, and returns the result of the first function that manages
   * to find an integral. Each function is also able to recursively call the
   * integral function, allowing for multiple rules to be applied successively.
   *
   * Integration is a rather hard problem, and as such, this implementation can
   * only find integrals for relatively simple integrands. If it cannot find the
   * integral for the given expression, it will throw an error.
   *
   * @param {Node | string} expr  The expression to be integrated
   * @param {SymbolNode | string} variable  The variable of integration
   * @param {{rules: Array.<IntegrationRule>, simplify: boolean, {debugPrint: boolean}}} [options]
   *        The options for how to integrate: `rules` is the array of rules that
   *        is applied to the integrand, `simplify` determines wether the output
   *        is simplified or not, and `debugPrint` determines if the integrator's
   *        steps are recorded to `console.log` or just ignored
   * @return {Node} Return the computed integral
   */
  var integral = typed('integral', {
    'Node, SymbolNode, Object': function(expr, variable, options) {
      // Apply defaults to options object
      if(options.simplify === undefined) options.simplify = true;
      if(options.debugPrint === undefined) options.debugPrint = false;
      if(options.rules === undefined) options.rules = integral.rules;

      // Create an integration context for this integral
      var context = new IntegrationContext(variable, options);

      // Simplify the integral
      var simplifiedExpr = preprocessIntegrand(expr, context);
      var integralResult = _integral(simplifiedExpr, context);

      if(!integralResult) {
        throw new Error('Unable to find integral of "' + expr + '" with respect to "' + variable + '"');
      }

      // Ensure that all nodes are unique
      integralResult = integralResult.cloneDeep();

      // Return the simplified expression if specified in options, or the unsimplified
      // integral otherwise
      return options.simplify === true ? simplify(integralResult) : integralResult;
    },

    'Node, SymbolNode': function(expr, variable) {
      return integral(expr, variable, {});
    },

    'string, SymbolNode, Object': function(expr, variable, options) {
      return integral(parse(expr), variable, options);
    },

    'string, SymbolNode': function(expr, variable) {
      return integral(parse(expr), variable);
    },

    'Node, string, Object': function(expr, variable, options) {
      return integral(expr, parse(variable), options);
    },

    'Node, string': function(expr, variable) {
      return integral(expr, parse(variable));
    },

    'string, string, Object': function(expr, variable, options) {
      return integral(parse(expr), parse(variable), options);
    },

    'string, string': function(expr, variable) {
      return integral(parse(expr), parse(variable));
    }

  });

  /**
   * @constructor IntegrationContext
   *
   * Encapsulates an integration context, including the following: the variable
   * of integration; a memoizing isConstant function (to determine if a given
   * expression is constant relative to the variable of integration); and a lookup
   * table for already computed subintegrals.
   *
   * @param {SymbolNode} variable The variable of integration.
   * @param {Object} options The integration options object.
   */
  function IntegrationContext(variable, options) {
    this.variable = variable.clone();
    this.options = options;

    this._constantExpr = {};
    this.subIntegral = {};

    this.rules = options.rules;

    this.debugIndent = 0;
  }

  /**
   * Determines if the given expression is constant in this context. An expression
   * is constant if and only if it does not contain the integration variable for
   * this context.
   *
   * @param {Node} expr The expression to test for constantness.
   * @return {boolean} True if the expression is constant, false otherwise.
   */
  IntegrationContext.prototype.isConstant = function(expr) {
    if(typeof this._constantExpr[expr] === 'boolean') {
      return this._constantExpr[expr];
    } else {
      // We must determine if this expression is constant ourselves
      return (this._constantExpr[expr] = isConstantHelper(expr, this));
    }

    function isConstantHelper(expr, self) {
      switch(expr.type) {
        case "ConstantNode":
          return true;
        case "SymbolNode":
          return expr.name !== self.variable.name;
        case "OperatorNode":
          return expr.args.every(self.isConstant.bind(self));
        case "ParenthesisNode":
          return self.isConstant(expr.content);
        case "FunctionNode":
          return expr.args.every(self.isConstant.bind(self));
        default:
          throw new Error("Node type '" + expr.type + "' is currently unsupported in isConstant.");
      }
    }
  };

  /**
   * Print some debug text about cacluating the integral in this context.
   */
  IntegrationContext.prototype.printDebug = function(text) {
    if(this.options.debugPrint) {
      var indent = "";
      for(var i = 0; i < this.debugIndent; i++) {
        indent += "  ";
      }
      console.log(indent + text);
    }
  }

  /**
   * Prepare the given expression for integration by
   *   - Remove parentheses
   *   - Reduce standard functions into more generic structures:
   *     - Convert 'add', 'subtract', 'multiply', and 'divide' into their operator counterparts
   *     - Convert 'sqrt', 'nthRoot', 'exp', and 'pow' into '^' operator
   *     - Convert 2-arg 'log' into quotient of natrual logarithms
   *   - Convert division into multiplication to power of -1 (only in non-constant nodes)
   *
   * @param {Node} expr  The expression tree representing the integrand to be processed
   * @param {Object} context  The integration context to interpret the integrand
   * @return {Node}  The processed integrand
   */
  function preprocessIntegrand(expr, context) {
    expr = removeParenthesis(expr);
    expr = reduceFunctions(expr);
    expr = removeDivision(expr);
    return expr;

    function removeParenthesis(node) {
      if(node.type === "ParenthesisNode") {
        return removeParenthesis(node.content);
      } else {
        return node.map(removeParenthesis);
      }
    }

    function reduceFunctions(expr) {
      return helper(expr);

      function helper(expr) {
        if(!context.isConstant(expr) && expr.type === "FunctionNode") {
          var funcName = typeof expr.fn === "string" ? expr.fn : expr.fn.name;

          switch(funcName) {
            case "add":
              return new OperatorNode('+', 'add', expr.args);
            case "subtract":
              return new OperatorNode('-', 'subtract', expr.args);
            case "multiply":
              return new OperatorNode('*', 'multiply', expr.args);
            case "divide":
              return new OperatorNode('/', 'divide', expr.args);
            case "sqrt":
              return new OperatorNode('^', 'pow', [
                expr.args[0].map(helper),
                new OperatorNode('/', 'divide', [
                  new ConstantNode(1),
                  new ConstantNode(2)
                ])
              ]);
            case "nthRoot":
              return new OperatorNode('^', 'pow', [
                expr.args[0].map(helper),
                new OperatorNode('/', 'divide', [
                  new ConstantNode(1),
                  expr.args[1].map(helper)
                ])
              ]);
            case "exp":
              return new OperatorNode('^', 'pow', [new SymbolNode('e'), expr.args[0]]);
            case "pow":
              return new OperatorNode('^', 'pow', expr.args);
            case "log":
              if(expr.args.length === 2) {
                return new OperatorNode('/', 'divide', [
                  new FunctionNode('log', [expr.args[0].map(helper)]),
                  new FunctionNode('log', [expr.args[1].map(helper)])
                ]);
              } else {
                break;
              }
            default:
              break;
          }
        }
        return expr.map(helper);
      }
    }

    function removeDivision(expr) {
      return expr.transform(function(node) {
        if(!context.isConstant(node) && node.type === 'OperatorNode' && node.op === '/') {
          return new OperatorNode('*', 'multiply', [
            node.args[0],
            new OperatorNode('^', 'pow', [
              node.args[1],
              new ConstantNode(-1)
            ])
          ]);
        } else {
          return node;
        }
      });
    }
  }

  /**
   * Gets the numerical value of the given node if possible, othewise returns undefined.
   * TODO: does this work with BigNumber / Fractions / etc.
   */
  function getNumericValue(expr) {
    var simplified = simplifyConstant(expr);
    return toNumber(simplified);

    function toNumber(expr) {
      if(expr.type === 'OperatorNode' && expr.op === '-' && expr.args.length === 1) {
        // Unary minus
        var num = toNumber(expr.args[0]);
        return num === undefined ? undefined : -num;
      } else if(expr.type === 'ConstantNode' && (!expr.valueType || expr.valueType === 'number')) {
        return +expr.value;
      } else {
        return undefined;
      }
    }
  }

  /**
   * @name IntegrationRule
   * @function
   * @param {Node} expr The expression that is being integrated.
   * @param {IntegrationContext} context The integration context.
   * @param {function(expr: Node, context: IntegrationContext, ?ruleName: string)} subIntegral
   *        Callback that attempts to integrate the given expression recursively.
   * @return {Node | undefined | null} Returns the integrated expression, or undefined
   *         or null if unable to find integral.
   */

  /**
   * The default rules for integration.
   *
   * @type {Array.<IntegrationRule>}
   */
  integral.rules = [
    // Simplify constants in the integral
    function(expr, context, subIntegral) {
      var simplified = simplify.simplifyCore(expr, context);
      if(!simplified.equals(expr)) {
        return subIntegral(simplified, context, "simplified expression");
      }
    },

    // Ignore parentheses
    function(expr, context, subIntegral) {
      if(expr.type === 'ParenthesisNode') {
        var int = subIntegral(expr.content, context, "parentheses removal");
        return int ? new ParenthesisNode(int) : null;
      }
    },

    // integral(c, x) = c * x
    function(expr, context) {
      if(context.isConstant(expr)) {
        return new OperatorNode('*', 'multiply', [
          expr.clone(),
          context.variable.clone()
        ]);
      }
    },

    // integral(+/- f(x), x) = +/- integral(f(x), x) and
    // integral(f(x) +/- g(x), x) = integral(f(x), x) +/- integral(g(x), x)
    function(expr, context, subIntegral) {
      if(expr.type === "OperatorNode" && (expr.op === '+' || expr.op === '-')) {
        var childInts = expr.args.map(function(expr) {
          return subIntegral(expr, context, "sum rule");
        });

        if(childInts.every(function(n) { return n; })) {
          return new OperatorNode(expr.op, expr.fn, childInts);
        }
      }
    },

    // integral(f(x) * (g(x) * h(x)), x) = integral(f(x) * g(x) * h(x), x)
    function(expr, context, subIntegral) {
      if(expr.type === "OperatorNode" && expr.op === "*") {
        var factors = getFactors(expr);
        if(factors.length > expr.args.length) {
          return subIntegral(new OperatorNode('*', 'multiply', factors), context, "product flattening");
        }
      }

      function getFactors(expr) {
        if(expr.type === "OperatorNode" && expr.op === "*") {
          return expr.args.reduce(function(factors, expr) {
            return factors.concat(getFactors(expr));
          }, []);
        } else if (expr.type === "ParenthesisNode") {
          return getFactors(expr.content)
        } else {
          return [expr];
        }
      }
    },

    // integral(x, x) = 1/2*x^2
    function(expr, context) {
      if(expr.type === "SymbolNode" && expr.name === context.variable.name) {
        return new OperatorNode('*', 'multiply', [
          new OperatorNode('/', 'divide', [
            new ConstantNode(1),
            new ConstantNode(2)
          ]),
          new OperatorNode('^', 'pow', [
            expr.clone(),
            new ConstantNode(2)
          ])
        ]);
      }
    },

    // integral(c*f(x), x) = c*integral(f(x), x)
    function(expr, context, subIntegral) {
      if(expr.type === "OperatorNode" && expr.op === '*') {
        var constantFactors = [];
        var nonConstantFactors = [];
        expr.args.forEach(function(expr) {
          if(context.isConstant(expr)) {
            constantFactors.push(expr);
          } else {
            nonConstantFactors.push(expr);
          }
        });

        if(constantFactors.length !== 0) {
          var constantNode = factorsToNode(constantFactors);
          var nonConstantNode = factorsToNode(nonConstantFactors);

          var nonConstantIntegral = subIntegral(nonConstantNode, context, "multiplication by constant");
          if(nonConstantIntegral) {
            return new OperatorNode('*', 'multiply', [constantNode, nonConstantIntegral]);
          }
        }

        function factorsToNode(factors) {
          if(factors.length === 1) {
            return factors[0];
          } else {
            return new OperatorNode('*', 'multiply', factors);
          }
        }
      }
    },

    // integral(x^c, x) = 1/(c+1) * x^(c+1) and integral(x^(-1)) = log(x)
    function(expr, context) {
      if(expr.type === "OperatorNode" && expr.op === '^' && expr.args[0].equals(context.variable) && context.isConstant(expr.args[1])) {
        // Simplify Exponent if constant
        var exponentValue = getNumericValue(expr.args[1]);
        if(exponentValue === -1) {
          return new FunctionNode('log', [
            new FunctionNode('abs', [
              context.variable.clone()
            ])
          ]);
        } else {
          return new OperatorNode('*', 'multiply', [
            new OperatorNode('/', 'divide', [
              new ConstantNode(1),
              new OperatorNode('+', 'add', [
                expr.args[1].clone(),
                new ConstantNode(1)
              ])
            ]),
            new OperatorNode('^', 'pow', [
              expr.args[0].clone(),
              new OperatorNode('+', 'add', [
                expr.args[1].clone(),
                new ConstantNode(1)
              ])
            ])
          ]);
        }
      }
    },

    // integral(c^x, x) = c^x / log(c)
    function(expr, context) {
      if(expr.type === 'OperatorNode' && expr.op === '^') {
        if(context.isConstant(expr.args[0]) && expr.args[1].equals(context.variable)) {
          return new OperatorNode('/', 'divide', [
            expr,
            new FunctionNode('log', [expr.args[0]])
          ]);
        }
      }
    },

    // integral(f(x)^g(x) * f(x)^h(x), x) = integral(f(x)^(g(x)+h(x)), x)
    function(expr, context, subIntegral) {
      if(expr.type === "OperatorNode" && expr.op === '*') {
        var argsAsPower = expr.args.map(getExprInPowerForm);

        // Collect common bases (this is O(n^2) worst case)
        var reducedArgs = argsAsPower.reduce(function(acc, exprPower) {
          for(var i = 0; i < acc.length; i++) {
            if(acc[i].base.equals(exprPower.base)) {
              acc[i].power = new OperatorNode('+', 'add', [
                acc[i].power,
                exprPower.power
              ]);
              return acc;
            }
          }

          // Did not share a common base with any other factor so far
          acc.push(exprPower);
          return acc;
        }, []);

        if(reducedArgs.length < expr.args.length) {
          // We combined some things
          var reducedExpr = powerFactorsToNode(reducedArgs);

          return subIntegral(reducedExpr, context, "combining powers");
        }
      }

      function getExprInPowerForm(expr) {
        if(expr.type === "OperatorNode" && expr.op === '^') {
          return {
            base: expr.args[0],
            power: expr.args[1]
          };
        } else {
          return {
            base: expr,
            power: new ConstantNode(1)
          };
        }
      }

      function powerFactorsToNode(factors) {
        if(factors.length === 1) {
          return powerToNode(factors[0]);
        } else {
          return new OperatorNode('*', 'multiply', factors.map(powerToNode));
        }

        function powerToNode(powerExpr) {
          return new OperatorNode('^', 'pow', [powerExpr.base, powerExpr.power]);
        }
      }
    },

    // integral((f(x) * g(x))^h(x), x) = integral(f(x)^h(x) * g(x)^h(x))
    function(expr, context, subIntegral) {
      if(expr.type === 'OperatorNode' && expr.op === '^') {
        var base = expr.args[0];
        var exponent = expr.args[1];
        if(base.type === 'OperatorNode' && base.op === '*') {
          return subIntegral(new OperatorNode('*', 'multiply', base.args.map(function(baseChild) {
            return new OperatorNode('^', 'pow', [baseChild, exponent]);
          })), context, "distributing power");
        }
      }
    },

    // integral((f(x) ^ g(x)) ^ h(x), x) = integral(f(x) ^ (g(x) * h(x)), x)
    function(expr, context, subIntegral) {
      if(expr.type === 'OperatorNode' && expr.op === '^') {
        if(expr.args[0].type === 'OperatorNode' && expr.args[0].op === '^') {
          return subIntegral(new OperatorNode('^', 'pow', [
            expr.args[0].args[0],
            new OperatorNode('*', 'multiply', [
              expr.args[0].args[1],
              expr.args[1]
            ])
          ]), context, 'removing double exponential');
        }
      }
    },

    // integral(f(x) * +/-g(x), x) = +/-integral(f(x) * g(x), x)
    function(expr, context, subIntegral) {
      if(expr.type === "OperatorNode" && expr.op === '*') {
        var wasChange = false;
        var isTotalPositive = true;
        var processedArgs = [];
        expr.args.forEach(function(expr) {
          if(expr.type === "OperatorNode" && expr.args.length === 1 && (expr.op === '+' || expr.op === '-')) {
            wasChange = true;
            isTotalPositive = isTotalPositive ^ (expr.op === '-');
            processedArgs.push(expr.args[0]);
          } else {
            processedArgs.push(expr);
          }
        });

        if(wasChange) {
          var int = subIntegral(new OperatorNode('*', 'multiply', processedArgs), context, "removing unary +/- from factors");
          if(int) {
            return isTotalPositive ? int : new OperatorNode('-', 'unaryMinus', [int]);
          }
        }
      }
    },

    // integral(f(x) * (g(x) + h(x)), x) = integral(f(x) * g(x) + f(x) * h(x), x)
    function(expr, context, subIntegral) {
      if(expr.type === "OperatorNode" && expr.op === '*') {
        var sumNode = null;
        var otherFactors = null;
        for(var i = 0; i < expr.args.length; i++) {
          if(expr.args[i].type === "OperatorNode" && (expr.args[i].op === '+' || expr.args[i].op === '-'))  {
            sumNode = expr.args[i];
            otherFactors = expr.args.filter(function(expr, index) { return index !== i; });
            break;
          }
        }

        if(sumNode !== null) {
          var newTerms = sumNode.args.map(function(term) {
            return new OperatorNode('*', 'multiply', otherFactors.concat([term]));
          });
          return subIntegral(new OperatorNode(sumNode.op, sumNode.fn, newTerms), context, "product distribution");
        }
      }
    },

    // integral(f(a*x + b), x) = 1/a * F(a*x + b) where F(u) = integral(f(u), u)
    // We also only handle the case where u shows up only once in f(u)
    function(expr, context, subIntegral) {
      var createIntegralWrapper = null;

      var uniqueParent = getParentOfUniqueVariable(expr);
      if(uniqueParent !== null && uniqueParent.type === "OperatorNode") {
        if(uniqueParent.op === '+' || uniqueParent.op === '-') {
          if(uniqueParent.args.length === 1) {
            // unary + or -
            createIntegralWrapper = function(int) {
              return new OperatorNode(uniqueParent.op, uniqueParent.fn, [int]);
            }
          } else {
            createIntegralWrapper = function(int) {
              return int;
            }
          }
        } else if(uniqueParent.op === '*') {
          createIntegralWrapper = function(int) {
            return new OperatorNode('/', 'divide', [int,
              // "remove" the variable of integration
              replaceNodeInTree(uniqueParent, context.variable, new ConstantNode(1))
            ]);
          };
        }

        if(createIntegralWrapper !== null) {
          var preIntegral = replaceNodeInTree(expr, uniqueParent, context.variable.clone());
          var int = subIntegral(preIntegral, context, "linear substitution");
          if(int) {
            var backSubstituted = replaceNodeInTree(int, context.variable, uniqueParent);
            return createIntegralWrapper(backSubstituted);
          }
        }
      }

      function replaceNodeInTree(expr, node, replacement) {
        return replaceHelper(expr);

        function replaceHelper(curNode) {
          return node.equals(curNode) ? replacement : curNode.map(replaceHelper);
        }
      }

      function getParentOfUniqueVariable(expr) {
        return helper(expr, null);

        function helper(expr, parent) {
          if(context.isConstant(expr)) {
            return null;
          } else if(expr.type === "SymbolNode" && expr.name === context.variable.name) {
            return parent;
          } else {
            var nonConstantChildren = [];
            expr.forEach(function(child) {
              if(!context.isConstant(child)) {
                nonConstantChildren.push(child);
              }
            });

            if(nonConstantChildren.length === 1) {
              return helper(nonConstantChildren[0], expr);
            } else {
              return null;
            }
          }
        }
      }
    },

    // integral(f(x)^c [* g(x)], x) = integral(f(x) * f(x)^(c-1) [* g(x)], x)
    // However, we only expand for c<=10 to save computational resources
    function(expr, context, subIntegral) {
      var MaxExponentExpanded = 10;

      if(expr.type === 'OperatorNode' && expr.op === '^') {
        var multipliedOut = tryMultiplyOut(expr);
        if(multipliedOut) {
          var int = subIntegral(multipliedOut, context, "reducing power");
          if(int) {
            return int;
          }
        }
      } else if(expr.type === 'OperatorNode' && expr.op === '*') {
        for(var i = 0; i < expr.args.length; i++) {
          var multipliedOutChild = tryMultiplyOut(expr.args[i]);
          if(multipliedOutChild) {
            var int = subIntegral(new OperatorNode('*', 'multiply', multipliedOutChild.args.concat(
              expr.args.slice(0, i),
              expr.args.slice(i+1)
            )), context, "reducing power");

            if(int) {
              return int;
            }
          }
        }
      }

      //
      function tryMultiplyOut(expr) {
        if(expr.type === 'OperatorNode' && expr.op === '^' && !context.isConstant(expr.args[0])) {
          var exponentValue = getNumericValue(expr.args[1]);
          if(Number.isInteger(exponentValue) && exponentValue > 1 && exponentValue <= MaxExponentExpanded) {
            return new OperatorNode('*', 'multiply', [
              expr.args[0],
              exponentValue === 2 ? expr.args[0] : new OperatorNode('^', 'pow', [
                expr.args[0],
                new ConstantNode(exponentValue-1)
              ])
            ]);
          }
        }

        return null;
      }
    },

    // integral(log(x), x) = x*log(x) - x
    function(expr, context, subIntegral) {
      if(expr.type === 'FunctionNode' && expr.name === 'log' && expr.args.length === 1) {
        if(expr.args.length === 1 && expr.args[0].equals(context.variable)) {
          return new OperatorNode('-', 'subtract', [
            new OperatorNode('*', 'multiply', [
              context.variable,
              new FunctionNode('log', [context.variable])
            ]),
            context.variable
          ]);
        }
      }
    },

    // integral(sin(x), x) = -cos(x)
    // integral(cos(x), x) = sin(x)
    // integral(tan(x), x) = log(abs(sec(x)))
    // integral(sec(x), x) = log(abs(sec(x) + tan(x)))
    // integral(csc(x), x) = log(abs(csc(x) - cot(x)))
    // integral(cot(x), x) = log(abs(sin(x)))
    function(expr, context, subIntegral) {
      if(expr.type === 'FunctionNode' && expr.args[0].equals(context.variable)) {
        switch(expr.name) {
          case "sin":
            return new OperatorNode('-', 'unaryMinus', [
              new FunctionNode("cos", [context.variable])
            ]);
          case "cos":
            return new FunctionNode("sin", [context.variable]);
          case "tan":
            //log(abs(sec(x)))
            return new FunctionNode('log', [
              new FunctionNode('abs', [
                new FunctionNode('sec', [context.variable])
              ])
            ]);
          case "sec":
            //log(abs(sec(x) + tan(x)))
            return new FunctionNode('log', [
              new FunctionNode('abs', [
                new OperatorNode('+', 'add', [
                  new FunctionNode('sec', [context.variable]),
                  new FunctionNode('tan', [context.variable])
                ])
              ])
            ]);
          case "csc":
            //log(abs(sec(x) + tan(x)))
            return new FunctionNode('log', [
              new FunctionNode('abs', [
                new OperatorNode('-', 'subtract', [
                  new FunctionNode('csc', [context.variable]),
                  new FunctionNode('cot', [context.variable])
                ])
              ])
            ]);
          case "cot":
            //log(abs(sec(x) + tan(x)))
            return new FunctionNode('log', [
              new FunctionNode('abs', [
                new FunctionNode('sin', [context.variable])
              ])
            ]);
          default:
            return null;
        }
      }
    }
  ];

  /**
   * Helper function that runs the main loop for the integrator. It scans over the
   * rules until one of them produces an integral or until no more rules are left.
   *
   * @param {Node} expr The expression to be integrated.
   * @param {IntegrationContext}
   */
  function _integral(expr, context, lastRuleComment) {
    var exprString = expr.toString({
      parenthesis: 'all',
      handler: function(node, options) {
        if(node.type === 'ParenthesisNode') {
          return '(' + node.content.toString(options) + ')';
        }
      }
    });

    var debugComment = lastRuleComment ? lastRuleComment + ": " : "";
    debugComment += "find integral of " + exprString + "  d" + context.variable.name;
    context.printDebug(debugComment);
    context.debugIndent++;

    // Check if we already tried to integrate this expression
    if(context.subIntegral[exprString] !== undefined) {
      // This could be null, indicating that we couldn't find an integral for
      // it (or we are currenly working on it a few levels of recursion up!)
      context.printDebug("Precomputed: " + context.subIntegral[exprString]);
      context.debugIndent--;
      return context.subIntegral[exprString];
    }

    // Remember that we are working on this integral, just haven't found a
    // solution yet!
    context.subIntegral[exprString] = null;

    for(var i = 0; i < context.rules.length; i++) {
      var result = context.rules[i](expr, context, _integral);
      if(result !== undefined && result !== null) {
        // Remember this solution!
        context.subIntegral[exprString] = result;

        context.printDebug("Computed: " + result.toString({parenthesis: 'all'}));
        context.debugIndent--;
        return result;
      }
    }

    // We couldn't find a solution :(
    context.printDebug("No integral found");
    context.debugIndent--;
    return null;
  }

  return integral;
};

exports.name = 'integral';
exports.factory = factory;

},{"mathjs/lib/expression/node/ConstantNode":15,"mathjs/lib/expression/node/FunctionNode":17,"mathjs/lib/expression/node/OperatorNode":21,"mathjs/lib/expression/node/SymbolNode":24,"mathjs/lib/expression/parse":30,"mathjs/lib/function/algebra/simplify":32,"mathjs/lib/function/algebra/simplify/simplifyConstant":34}],6:[function(require,module,exports){
'use strict';

/**
 * Create a syntax error with the message:
 *     'Wrong number of arguments in function <fn> (<count> provided, <min>-<max> expected)'
 * @param {string} fn     Function name
 * @param {number} count  Actual argument count
 * @param {number} min    Minimum required argument count
 * @param {number} [max]  Maximum required argument count
 * @extends Error
 */
function ArgumentsError(fn, count, min, max) {
  if (!(this instanceof ArgumentsError)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.fn = fn;
  this.count = count;
  this.min = min;
  this.max = max;

  this.message = 'Wrong number of arguments in function ' + fn +
      ' (' + count + ' provided, ' +
      min + ((max != undefined) ? ('-' + max) : '') + ' expected)';

  this.stack = (new Error()).stack;
}

ArgumentsError.prototype = new Error();
ArgumentsError.prototype.constructor = Error;
ArgumentsError.prototype.name = 'ArgumentsError';
ArgumentsError.prototype.isArgumentsError = true;

module.exports = ArgumentsError;

},{}],7:[function(require,module,exports){
'use strict';

/**
 * Create a range error with the message:
 *     'Dimension mismatch (<actual size> != <expected size>)'
 * @param {number | number[]} actual        The actual size
 * @param {number | number[]} expected      The expected size
 * @param {string} [relation='!=']          Optional relation between actual
 *                                          and expected size: '!=', '<', etc.
 * @extends RangeError
 */
function DimensionError(actual, expected, relation) {
  if (!(this instanceof DimensionError)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.actual   = actual;
  this.expected = expected;
  this.relation = relation;

  this.message = 'Dimension mismatch (' +
      (Array.isArray(actual) ? ('[' + actual.join(', ') + ']') : actual) +
      ' ' + (this.relation || '!=') + ' ' +
      (Array.isArray(expected) ? ('[' + expected.join(', ') + ']') : expected) +
      ')';

  this.stack = (new Error()).stack;
}

DimensionError.prototype = new RangeError();
DimensionError.prototype.constructor = RangeError;
DimensionError.prototype.name = 'DimensionError';
DimensionError.prototype.isDimensionError = true;

module.exports = DimensionError;

},{}],8:[function(require,module,exports){
'use strict';

/**
 * Create a range error with the message:
 *     'Index out of range (index < min)'
 *     'Index out of range (index < max)'
 *
 * @param {number} index     The actual index
 * @param {number} [min=0]   Minimum index (included)
 * @param {number} [max]     Maximum index (excluded)
 * @extends RangeError
 */
function IndexError(index, min, max) {
  if (!(this instanceof IndexError)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.index = index;
  if (arguments.length < 3) {
    this.min = 0;
    this.max = min;
  }
  else {
    this.min = min;
    this.max = max;
  }

  if (this.min !== undefined && this.index < this.min) {
    this.message = 'Index out of range (' + this.index + ' < ' + this.min + ')';
  }
  else if (this.max !== undefined && this.index >= this.max) {
    this.message = 'Index out of range (' + this.index + ' > ' + (this.max - 1) + ')';
  }
  else {
    this.message = 'Index out of range (' + this.index + ')';
  }

  this.stack = (new Error()).stack;
}

IndexError.prototype = new RangeError();
IndexError.prototype.constructor = RangeError;
IndexError.prototype.name = 'IndexError';
IndexError.prototype.isIndexError = true;

module.exports = IndexError;

},{}],9:[function(require,module,exports){
'use strict';

// Reserved keywords not allowed to use in the parser
module.exports = {
  end: true
};

},{}],10:[function(require,module,exports){
'use strict';

var stringify = require('../../utils/string').stringify;
var getSafeProperty = require('../../utils/customs').getSafeProperty;

function factory (type, config, load, typed) {
  var register = load(require('./compile')).register;
  var compile = load(require('./compile')).compile;
  var Node = load(require('./Node'));
  var IndexNode = load(require('./IndexNode'));
  var access = load(require('./utils/access'));

  /**
   * @constructor AccessorNode
   * @extends {Node}
   * Access an object property or get a matrix subset
   *
   * @param {Node} object                 The object from which to retrieve
   *                                      a property or subset.
   * @param {IndexNode} index             IndexNode containing ranges
   */
  function AccessorNode(object, index) {
    if (!(this instanceof AccessorNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    if (!type.isNode(object)) {
      throw new TypeError('Node expected for parameter "object"');
    }
    if (!type.isIndexNode(index)) {
      throw new TypeError('IndexNode expected for parameter "index"');
    }

    this.object = object || null;
    this.index = index;

    // readonly property name
    Object.defineProperty(this, 'name', {
      get: function () {
        if (this.index) {
          return (this.index.isObjectProperty())
              ? this.index.getObjectProperty()
              : '';
        }
        else {
          return this.object.name || '';
        }
      }.bind(this),
      set: function () {
        throw new Error('Cannot assign a new name, name is read-only');
      }
    });
  }

  AccessorNode.prototype = new Node();

  AccessorNode.prototype.type = 'AccessorNode';

  AccessorNode.prototype.isAccessorNode = true;

  /**
   * Compile the node to javascript code
   * @param {AccessorNode} node  Node to be compiled
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  function compileAccessorNode(node, defs, args) {
    if (!(node instanceof AccessorNode)) {
      throw new TypeError('No valid AccessorNode')
    }

    defs.access = access;
    defs.getSafeProperty = getSafeProperty;

    var object = compile(node.object, defs, args);
    var index = compile(node.index, defs, args);

    if (node.index.isObjectProperty()) {
      var jsProp = stringify(node.index.getObjectProperty());
      return 'getSafeProperty(' + object + ', ' + jsProp + ')';
    }
    else if (node.index.needsSize()) {
      // if some parameters use the 'end' parameter, we need to calculate the size
      return '(function () {' +
          '  var object = ' + object + ';' +
          '  var size = math.size(object).valueOf();' +
          '  return access(object, ' + index + ');' +
          '})()';
    }
    else {
      return 'access(' + object + ', ' + index + ')';
    }
  }

  // register the compile function
  register(AccessorNode.prototype.type, compileAccessorNode);

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  AccessorNode.prototype.forEach = function (callback) {
    callback(this.object, 'object', this);
    callback(this.index, 'index', this);
  };

  /**
   * Create a new AccessorNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {AccessorNode} Returns a transformed copy of the node
   */
  AccessorNode.prototype.map = function (callback) {
    return new AccessorNode(
        this._ifNode(callback(this.object, 'object', this)),
        this._ifNode(callback(this.index, 'index', this))
    );
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {AccessorNode}
   */
  AccessorNode.prototype.clone = function () {
    return new AccessorNode(this.object, this.index);
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string}
   */
  AccessorNode.prototype._toString = function (options) {
    var object = this.object.toString(options);
    if (needParenthesis(this.object)) {
      object = '(' + object + ')';
    }

    return object + this.index.toString(options);
  };

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string}
   */
  AccessorNode.prototype.toHTML = function (options) {
    var object = this.object.toHTML(options);
    if (needParenthesis(this.object)) {
      object = '<span class="math-parenthesis math-round-parenthesis">(</span>' + object + '<span class="math-parenthesis math-round-parenthesis">)</span>';
    }

    return object + this.index.toHTML(options);
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string}
   */
  AccessorNode.prototype._toTex = function (options) {
    var object = this.object.toTex(options);
    if (needParenthesis(this.object)) {
      object = '\\left(' + object + '\\right)';
    }

    return object + this.index.toTex(options);
  };

  /**
   * Are parenthesis needed?
   * @private
   */
  function needParenthesis(node) {
    // TODO: maybe make a method on the nodes which tells whether they need parenthesis?
    return !(
        type.isAccessorNode(node) ||
        type.isArrayNode(node) ||
        type.isConstantNode(node) ||
        type.isFunctionNode(node) ||
        type.isObjectNode(node) ||
        type.isParenthesisNode(node) ||
        type.isSymbolNode(node));
  }

  return AccessorNode;
}

exports.name = 'AccessorNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../../utils/customs":45,"../../utils/string":49,"./IndexNode":18,"./Node":19,"./compile":25,"./utils/access":26}],11:[function(require,module,exports){
'use strict';

var map = require('../../utils/array').map;
var join = require('../../utils/array').join;

function factory (type, config, load, typed) {
  var register = load(require('./compile')).register;
  var compile = load(require('./compile')).compile;
  var Node = load(require('./Node'));

  /**
   * @constructor ArrayNode
   * @extends {Node}
   * Holds an 1-dimensional array with items
   * @param {Node[]} [items]   1 dimensional array with items
   */
  function ArrayNode(items) {
    if (!(this instanceof ArrayNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    this.items = items || [];

    // validate input
    if (!Array.isArray(this.items) || !this.items.every(type.isNode)) {
      throw new TypeError('Array containing Nodes expected');
    }

    // TODO: deprecated since v3, remove some day
    var deprecated = function () {
      throw new Error('Property `ArrayNode.nodes` is deprecated, use `ArrayNode.items` instead');
    };
    Object.defineProperty(this, 'nodes', { get: deprecated, set: deprecated });
  }

  ArrayNode.prototype = new Node();

  ArrayNode.prototype.type = 'ArrayNode';

  ArrayNode.prototype.isArrayNode = true;

  /**
   * Compile the node to javascript code
   * @param {ArrayNode} node  Node to be compiled
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @private
   */
  function compileArrayNode(node, defs, args) {
    if (!(node instanceof ArrayNode)) {
      throw new TypeError('No valid ArrayNode')
    }

    var asMatrix = (defs.math.config().matrix !== 'Array');

    var items = map(node.items, function (item) {
      return compile(item, defs, args);
    });

    return (asMatrix ? 'math.matrix([' : '[') +
        join(items, ',') +
        (asMatrix ? '])' : ']');
  }

  // register the compile function
  register(ArrayNode.prototype.type, compileArrayNode);

      /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  ArrayNode.prototype.forEach = function (callback) {
    for (var i = 0; i < this.items.length; i++) {
      var node = this.items[i];
      callback(node, 'items[' + i + ']', this);
    }
  };

  /**
   * Create a new ArrayNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {ArrayNode} Returns a transformed copy of the node
   */
  ArrayNode.prototype.map = function (callback) {
    var items = [];
    for (var i = 0; i < this.items.length; i++) {
      items[i] = this._ifNode(callback(this.items[i], 'items[' + i + ']', this));
    }
    return new ArrayNode(items);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {ArrayNode}
   */
  ArrayNode.prototype.clone = function() {
    return new ArrayNode(this.items.slice(0));
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  ArrayNode.prototype._toString = function(options) {
    var items = this.items.map(function (node) {
      return node.toString(options);
    });
    return '[' + items.join(', ') + ']';
  };

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  ArrayNode.prototype.toHTML = function(options) {
    var items = this.items.map(function (node) {
      return node.toHTML(options);
    });
    return '<span class="math-parenthesis math-square-parenthesis">[</span>' + items.join('<span class="math-separator">,</span>') + '<span class="math-parenthesis math-square-parenthesis">]</span>';
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  ArrayNode.prototype._toTex = function(options) {
    var s = '\\begin{bmatrix}';

    this.items.forEach(function(node) {
      if (node.items) {
        s += node.items.map(function(childNode) {
          return childNode.toTex(options);
        }).join('&');
      }
      else {
        s += node.toTex(options);
      }

      // new line
      s += '\\\\';
    });
    s += '\\end{bmatrix}';
    return s;
  };

  return ArrayNode;
}

exports.name = 'ArrayNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../../utils/array":41,"./Node":19,"./compile":25}],12:[function(require,module,exports){
'use strict';

var latex = require('../../utils/latex');
var stringify = require('../../utils/string').stringify;
var getSafeProperty = require('../../utils/customs').getSafeProperty;
var setSafeProperty = require('../../utils/customs').setSafeProperty;

function factory (type, config, load, typed) {
  var register = load(require('./compile')).register;
  var compile = load(require('./compile')).compile;
  var Node = load(require('./Node'));
  var ArrayNode = load(require('./ArrayNode'));
  var matrix = load(require('../../type/matrix/function/matrix'));
  var assign = load(require('./utils/assign'));
  var access = load(require('./utils/access'));

  var keywords = require('../keywords');
  var operators = require('../operators');

  /**
   * @constructor AssignmentNode
   * @extends {Node}
   *
   * Define a symbol, like `a=3.2`, update a property like `a.b=3.2`, or
   * replace a subset of a matrix like `A[2,2]=42`.
   *
   * Syntax:
   *
   *     new AssignmentNode(symbol, value)
   *     new AssignmentNode(object, index, value)
   *
   * Usage:
   *
   *    new AssignmentNode(new SymbolNode('a'), new ConstantNode(2));                      // a=2
   *    new AssignmentNode(new SymbolNode('a'), new IndexNode('b'), new ConstantNode(2))   // a.b=2
   *    new AssignmentNode(new SymbolNode('a'), new IndexNode(1, 2), new ConstantNode(3))  // a[1,2]=3
   *
   * @param {SymbolNode | AccessorNode} object  Object on which to assign a value
   * @param {IndexNode} [index=null]            Index, property name or matrix
   *                                            index. Optional. If not provided
   *                                            and `object` is a SymbolNode,
   *                                            the property is assigned to the
   *                                            global scope.
   * @param {Node} value                        The value to be assigned
   */
  function AssignmentNode(object, index, value) {
    if (!(this instanceof AssignmentNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    this.object = object;
    this.index = value ? index : null;
    this.value = value ? value : index;

    // validate input
    if (!type.isSymbolNode(object) && !type.isAccessorNode(object)) {
      throw new TypeError('SymbolNode or AccessorNode expected as "object"');
    }
    if (type.isSymbolNode(object) && object.name === 'end') {
      throw new Error('Cannot assign to symbol "end"');
    }
    if (this.index && !type.isIndexNode(this.index)) { // index is optional
      throw new TypeError('IndexNode expected as "index"');
    }
    if (!type.isNode(this.value)) {
      throw new TypeError('Node expected as "value"');
    }

    // readonly property name
    Object.defineProperty(this, 'name', {
      get: function () {
        if (this.index) {
          return (this.index.isObjectProperty())
              ? this.index.getObjectProperty()
              : '';
        }
        else {
          return this.object.name || '';
        }
      }.bind(this),
      set: function () {
        throw new Error('Cannot assign a new name, name is read-only');
      }
    });
  }

  AssignmentNode.prototype = new Node();

  AssignmentNode.prototype.type = 'AssignmentNode';

  AssignmentNode.prototype.isAssignmentNode = true;

  /**
   * Compile the node to javascript code
   * @param {AssignmentNode} node The node to be compiled
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @private
   */
  function compileAssignmentNode (node, defs, args) {
    if (!(node instanceof AssignmentNode)) {
      throw new TypeError('No valid AssignmentNode')
    }

    defs.assign = assign;
    defs.access = access;
    defs.getSafeProperty = getSafeProperty;
    defs.setSafeProperty = setSafeProperty;

    var size;
    var object = compile(node.object, defs, args);
    var index = node.index ? compile(node.index, defs, args) : null;
    var value = compile(node.value, defs, args);
    var jsName = stringify(node.object.name);

    if (!node.index) {
      // apply a variable to the scope, for example `a=2`
      if (!type.isSymbolNode(node.object)) {
        throw new TypeError('SymbolNode expected as object');
      }

      return 'setSafeProperty(scope, ' + jsName + ', ' + value + ')';
    }
    else if (node.index.isObjectProperty()) {
      // apply an object property for example `a.b=2`
      var jsProp = stringify(node.index.getObjectProperty());
      return 'setSafeProperty(' + object + ', ' + jsProp + ', ' + value + ')';
    }
    else if (type.isSymbolNode(node.object)) {
      // update a matrix subset, for example `a[2]=3`
      size = node.index.needsSize() ? 'var size = math.size(object).valueOf();' : '';

      // apply updated object to scope
      return '(function () {' +
          '  var object = ' + object + ';' +
          '  var value = ' + value + ';' +
          '  ' + size +
          '  setSafeProperty(scope, ' + jsName + ', assign(object, ' + index + ', value));' +
          '  return value;' +
          '})()';
    }
    else { // type.isAccessorNode(node.object) === true
      // update a matrix subset, for example `a.b[2]=3`
      size = node.index.needsSize() ? 'var size = math.size(object).valueOf();' : '';

      // we will not use the compile function of the AccessorNode, but compile it
      // ourselves here as we need the parent object of the AccessorNode:
      // wee need to apply the updated object to parent object
      var parentObject = compile(node.object.object, defs, args);

      if (node.object.index.isObjectProperty()) {
        var jsParentProperty = stringify(node.object.index.getObjectProperty());
        return '(function () {' +
            '  var parent = ' + parentObject + ';' +
            '  var object = getSafeProperty(parent, ' + jsParentProperty + ');' + // parentIndex is a property
            '  var value = ' + value + ';' +
            size +
            '  setSafeProperty(parent, ' + jsParentProperty + ', assign(object, ' + index + ', value));' +
            '  return value;' +
            '})()';
      }
      else {
        // if some parameters use the 'end' parameter, we need to calculate the size
        var parentSize = node.object.index.needsSize() ? 'var size = math.size(parent).valueOf();' : '';
        var parentIndex = compile(node.object.index, defs, args);

        return '(function () {' +
            '  var parent = ' + parentObject + ';' +
            '  ' + parentSize +
            '  var parentIndex = ' + parentIndex + ';' +
            '  var object = access(parent, parentIndex);' +
            '  var value = ' + value + ';' +
            '  ' + size +
            '  assign(parent, parentIndex, assign(object, ' + index + ', value));' +
            '  return value;' +
            '})()';
      }
    }
  }

  // register the compile function
  register(AssignmentNode.prototype.type, compileAssignmentNode);

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  AssignmentNode.prototype.forEach = function (callback) {
    callback(this.object, 'object', this);
    if (this.index) {
      callback(this.index, 'index', this);
    }
    callback(this.value, 'value', this);
  };

  /**
   * Create a new AssignmentNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {AssignmentNode} Returns a transformed copy of the node
   */
  AssignmentNode.prototype.map = function (callback) {
    var object = this._ifNode(callback(this.object, 'object', this));
    var index = this.index
        ? this._ifNode(callback(this.index, 'index', this))
        : null;
    var value = this._ifNode(callback(this.value, 'value', this));

    return new AssignmentNode(object, index, value);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {AssignmentNode}
   */
  AssignmentNode.prototype.clone = function() {
    return new AssignmentNode(this.object, this.index, this.value);
  };

  /*
   * Is parenthesis needed?
   * @param {node} node
   * @param {string} [parenthesis='keep']
   * @private
   */
  function needParenthesis(node, parenthesis) {
    if (!parenthesis) {
      parenthesis = 'keep';
    }

    var precedence = operators.getPrecedence(node, parenthesis);
    var exprPrecedence = operators.getPrecedence(node.value, parenthesis);
    return (parenthesis === 'all')
      || ((exprPrecedence !== null) && (exprPrecedence <= precedence));
  }

  /**
   * Get string representation
   * @param {Object} options
   * @return {string}
   */
  AssignmentNode.prototype._toString = function(options) {
    var object = this.object.toString(options);
    var index = this.index ? this.index.toString(options) : '';
    var value = this.value.toString(options);
    if (needParenthesis(this, options && options.parenthesis)) {
      value = '(' + value + ')';
    }

    return object + index + ' = ' + value;
  };

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string}
   */
  AssignmentNode.prototype.toHTML = function(options) {
    var object = this.object.toHTML(options);
    var index = this.index ? this.index.toHTML(options) : '';
    var value = this.value.toHTML(options);
    if (needParenthesis(this, options && options.parenthesis)) {
      value = '<span class="math-paranthesis math-round-parenthesis">(</span>' + value + '<span class="math-paranthesis math-round-parenthesis">)</span>';
    }

    return object + index + '<span class="math-operator math-assignment-operator math-variable-assignment-operator math-binary-operator">=</span>' + value;
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string}
   */
  AssignmentNode.prototype._toTex = function(options) {
    var object = this.object.toTex(options);
    var index = this.index ? this.index.toTex(options) : '';
    var value = this.value.toTex(options);
    if (needParenthesis(this, options && options.parenthesis)) {
      value = '\\left(' + value + '\\right)';
    }

    return object + index + ':=' + value;
  };

  return AssignmentNode;
}

exports.name = 'AssignmentNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../../type/matrix/function/matrix":39,"../../utils/customs":45,"../../utils/latex":46,"../../utils/string":49,"../keywords":9,"../operators":29,"./ArrayNode":11,"./Node":19,"./compile":25,"./utils/access":26,"./utils/assign":27}],13:[function(require,module,exports){
'use strict';

var map = require('../../utils/array').map;
var join = require('../../utils/array').join;

function factory (type, config, load, typed) {
  var register = load(require('./compile')).register;
  var compile = load(require('./compile')).compile;
  var Node = load(require('./Node'));
  var ResultSet = load(require('../../type/resultset/ResultSet'));

  /**
   * @constructor BlockNode
   * @extends {Node}
   * Holds a set with blocks
   * @param {Array.<{node: Node} | {node: Node, visible: boolean}>} blocks
   *            An array with blocks, where a block is constructed as an Object
   *            with properties block, which is a Node, and visible, which is
   *            a boolean. The property visible is optional and is true by default
   */
  function BlockNode(blocks) {
    if (!(this instanceof BlockNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate input, copy blocks
    if (!Array.isArray(blocks)) throw new Error('Array expected');
    this.blocks = blocks.map(function (block) {
      var node = block && block.node;
      var visible = block && block.visible !== undefined ? block.visible : true;

      if (!type.isNode(node)) throw new TypeError('Property "node" must be a Node');
      if (typeof visible !== 'boolean') throw new TypeError('Property "visible" must be a boolean');

      return {
        node: node,
        visible: visible
      }
    });
  }

  BlockNode.prototype = new Node();

  BlockNode.prototype.type = 'BlockNode';

  BlockNode.prototype.isBlockNode = true;

  /**
   * Compile the node to javascript code
   * @param {BlockNode} node  The node to be compiled
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  function compileBlockNode (node, defs, args) {
    if (!(node instanceof BlockNode)) {
      throw new TypeError('No valid BlockNode')
    }

    defs.ResultSet = ResultSet;
    var blocks = map(node.blocks, function (param) {
      var js = compile(param.node, defs, args);
      if (param.visible) {
        return 'results.push(' + js + ');';
      }
      else {
        return js + ';';
      }
    });

    return '(function () {' +
        'var results = [];' +
        join(blocks, '') +
        'return new ResultSet(results);' +
        '})()';
  }

  // register the compile function
  register(BlockNode.prototype.type, compileBlockNode);

  /**
   * Execute a callback for each of the child blocks of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  BlockNode.prototype.forEach = function (callback) {
    for (var i = 0; i < this.blocks.length; i++) {
      callback(this.blocks[i].node, 'blocks[' + i + '].node', this);
    }
  };

  /**
   * Create a new BlockNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {BlockNode} Returns a transformed copy of the node
   */
  BlockNode.prototype.map = function (callback) {
    var blocks = [];
    for (var i = 0; i < this.blocks.length; i++) {
      var block = this.blocks[i];
      var node = this._ifNode(callback(block.node, 'blocks[' + i + '].node', this));
      blocks[i] = {
        node: node,
        visible: block.visible
      };
    }
    return new BlockNode(blocks);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {BlockNode}
   */
  BlockNode.prototype.clone = function () {
    var blocks = this.blocks.map(function (block) {
      return {
        node: block.node,
        visible: block.visible
      };
    });

    return new BlockNode(blocks);
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  BlockNode.prototype._toString = function (options) {
    return this.blocks.map(function (param) {
      return param.node.toString(options) + (param.visible ? '' : ';');
    }).join('\n');
  };

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  BlockNode.prototype.toHTML = function (options) {
    return this.blocks.map(function (param) {
      return param.node.toHTML(options) + (param.visible ? '' : '<span class="math-separator">;</span>');
    }).join('<span class="math-separator"><br /></span>');
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  BlockNode.prototype._toTex = function (options) {
    return this.blocks.map(function (param) {
      return param.node.toTex(options) + (param.visible ? '' : ';');
    }).join('\\;\\;\n');
  };

  return BlockNode;
}

exports.name = 'BlockNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../../type/resultset/ResultSet":40,"../../utils/array":41,"./Node":19,"./compile":25}],14:[function(require,module,exports){
'use strict';

var latex = require('../../utils/latex');
var operators = require('../operators');

function factory (type, config, load, typed) {
  var register = load(require('./compile')).register;
  var compile = load(require('./compile')).compile;
  var Node = load(require('./Node'));

  /**
   * A lazy evaluating conditional operator: 'condition ? trueExpr : falseExpr'
   *
   * @param {Node} condition   Condition, must result in a boolean
   * @param {Node} trueExpr    Expression evaluated when condition is true
   * @param {Node} falseExpr   Expression evaluated when condition is true
   *
   * @constructor ConditionalNode
   * @extends {Node}
   */
  function ConditionalNode(condition, trueExpr, falseExpr) {
    if (!(this instanceof ConditionalNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }
    if (!type.isNode(condition)) throw new TypeError('Parameter condition must be a Node');
    if (!type.isNode(trueExpr))  throw new TypeError('Parameter trueExpr must be a Node');
    if (!type.isNode(falseExpr)) throw new TypeError('Parameter falseExpr must be a Node');

    this.condition = condition;
    this.trueExpr = trueExpr;
    this.falseExpr = falseExpr;
  }

  ConditionalNode.prototype = new Node();

  ConditionalNode.prototype.type = 'ConditionalNode';

  ConditionalNode.prototype.isConditionalNode = true;

  /**
   * Compile the node to javascript code
   * @param {ConditionalNode} node  The node to be compiled
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  function compileConditionalNode(node, defs, args) {
    if (!(node instanceof ConditionalNode)) {
      throw new TypeError('No valid ConditionalNode')
    }

    /**
     * Test whether a condition is met
     * @param {*} condition
     * @returns {boolean} true if condition is true or non-zero, else false
     */
    defs.testCondition = function (condition) {
      if (typeof condition === 'number'
          || typeof condition === 'boolean'
          || typeof condition === 'string') {
        return condition ? true : false;
      }

      if (condition) {
        if (type.isBigNumber(condition)) {
          return condition.isZero() ? false : true;
        }

        if (type.isComplex(condition)) {
          return (condition.re || condition.im) ? true : false;
        }

        if (type.isUnit(condition)) {
          return condition.value ? true : false;
        }
      }

      if (condition === null || condition === undefined) {
        return false;
      }

      throw new TypeError('Unsupported type of condition "' + defs.math['typeof'](condition) + '"');
    };

    return (
      'testCondition(' + compile(node.condition, defs, args) + ') ? ' +
      '( ' + compile(node.trueExpr, defs, args) + ') : ' +
      '( ' + compile(node.falseExpr, defs, args) + ')'
    );
  }

  // register the compile function
  register(ConditionalNode.prototype.type, compileConditionalNode);

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  ConditionalNode.prototype.forEach = function (callback) {
    callback(this.condition, 'condition', this);
    callback(this.trueExpr, 'trueExpr', this);
    callback(this.falseExpr, 'falseExpr', this);
  };

  /**
   * Create a new ConditionalNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {ConditionalNode} Returns a transformed copy of the node
   */
  ConditionalNode.prototype.map = function (callback) {
    return new ConditionalNode(
        this._ifNode(callback(this.condition, 'condition', this)),
        this._ifNode(callback(this.trueExpr, 'trueExpr', this)),
        this._ifNode(callback(this.falseExpr, 'falseExpr', this))
    );
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {ConditionalNode}
   */
  ConditionalNode.prototype.clone = function () {
    return new ConditionalNode(this.condition, this.trueExpr, this.falseExpr);
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   */
  ConditionalNode.prototype._toString = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var precedence = operators.getPrecedence(this, parenthesis);

    //Enclose Arguments in parentheses if they are an OperatorNode
    //or have lower or equal precedence
    //NOTE: enclosing all OperatorNodes in parentheses is a decision
    //purely based on aesthetics and readability
    var condition = this.condition.toString(options);
    var conditionPrecedence = operators.getPrecedence(this.condition, parenthesis);
    if ((parenthesis === 'all')
        || (this.condition.type === 'OperatorNode')
        || ((conditionPrecedence !== null) && (conditionPrecedence <= precedence))) {
      condition = '(' + condition + ')';
    }

    var trueExpr = this.trueExpr.toString(options);
    var truePrecedence = operators.getPrecedence(this.trueExpr, parenthesis);
    if ((parenthesis === 'all')
        || (this.trueExpr.type === 'OperatorNode')
        || ((truePrecedence !== null) && (truePrecedence <= precedence))) {
      trueExpr = '(' + trueExpr + ')';
    }

    var falseExpr = this.falseExpr.toString(options);
    var falsePrecedence = operators.getPrecedence(this.falseExpr, parenthesis);
    if ((parenthesis === 'all')
        || (this.falseExpr.type === 'OperatorNode')
        || ((falsePrecedence !== null) && (falsePrecedence <= precedence))) {
      falseExpr = '(' + falseExpr + ')';
    }
    return condition + ' ? ' + trueExpr + ' : ' + falseExpr;
  };

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string} str
   */
  ConditionalNode.prototype.toHTML = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var precedence = operators.getPrecedence(this, parenthesis);

    //Enclose Arguments in parentheses if they are an OperatorNode
    //or have lower or equal precedence
    //NOTE: enclosing all OperatorNodes in parentheses is a decision
    //purely based on aesthetics and readability
    var condition = this.condition.toHTML(options);
    var conditionPrecedence = operators.getPrecedence(this.condition, parenthesis);
    if ((parenthesis === 'all')
        || (this.condition.type === 'OperatorNode')
        || ((conditionPrecedence !== null) && (conditionPrecedence <= precedence))) {
      condition = '<span class="math-parenthesis math-round-parenthesis">(</span>' + condition + '<span class="math-parenthesis math-round-parenthesis">)</span>';
    }

    var trueExpr = this.trueExpr.toHTML(options);
    var truePrecedence = operators.getPrecedence(this.trueExpr, parenthesis);
    if ((parenthesis === 'all')
        || (this.trueExpr.type === 'OperatorNode')
        || ((truePrecedence !== null) && (truePrecedence <= precedence))) {
      trueExpr = '<span class="math-parenthesis math-round-parenthesis">(</span>' + trueExpr + '<span class="math-parenthesis math-round-parenthesis">)</span>';
    }

    var falseExpr = this.falseExpr.toHTML(options);
    var falsePrecedence = operators.getPrecedence(this.falseExpr, parenthesis);
    if ((parenthesis === 'all')
        || (this.falseExpr.type === 'OperatorNode')
        || ((falsePrecedence !== null) && (falsePrecedence <= precedence))) {
      falseExpr = '<span class="math-parenthesis math-round-parenthesis">(</span>' + falseExpr + '<span class="math-parenthesis math-round-parenthesis">)</span>';
    }
    return condition + '<span class="math-operator math-conditional-operator">?</span>' + trueExpr + '<span class="math-operator math-conditional-operator">:</span>' + falseExpr;
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  ConditionalNode.prototype._toTex = function (options) {
    return '\\begin{cases} {'
        + this.trueExpr.toTex(options) + '}, &\\quad{\\text{if }\\;'
        + this.condition.toTex(options)
        + '}\\\\{' + this.falseExpr.toTex(options)
        + '}, &\\quad{\\text{otherwise}}\\end{cases}';
  };

  return ConditionalNode;
}

exports.name = 'ConditionalNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../../utils/latex":46,"../operators":29,"./Node":19,"./compile":25}],15:[function(require,module,exports){
'use strict';

var getType = require('../../utils/types').type;
var stringify = require('../../utils/string').stringify;
var escape = require('../../utils/string').escape;
var escapeLatex = require('../../utils/latex').escape;

function factory (type, config, load, typed) {
  var register = load(require('./compile')).register;
  var compile = load(require('./compile')).compile;
  var Node = load(require('./Node'));

  /**
   * A ConstantNode holds a constant value like a number or string. A ConstantNode
   * stores a stringified version of the value and uses this to compile to
   * JavaScript.
   *
   * In case of a stringified number as input, this may be compiled to a BigNumber
   * when the math instance is configured for BigNumbers.
   *
   * Usage:
   *
   *     // stringified values with type
   *     new ConstantNode('2.3', 'number');
   *     new ConstantNode('true', 'boolean');
   *     new ConstantNode('hello', 'string');
   *
   *     // non-stringified values, type will be automatically detected
   *     new ConstantNode(2.3);
   *     new ConstantNode('hello');
   *
   * @param {string | number | boolean | null | undefined} value
   *                            When valueType is provided, value must contain
   *                            an uninterpreted string representing the value.
   *                            When valueType is undefined, value can be a
   *                            number, string, boolean, null, or undefined, and
   *                            the type will be determined automatically.
   * @param {string} [valueType]  The type of value. Choose from 'number', 'string',
   *                              'boolean', 'undefined', 'null'
   * @constructor ConstantNode
   * @extends {Node}
   */
  function ConstantNode(value, valueType) {
    if (!(this instanceof ConstantNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    if (valueType) {
      if (typeof valueType !== 'string') {
        throw new TypeError('String expected for parameter "valueType"');
      }
      if (typeof value !== 'string') {
        throw new TypeError('String expected for parameter "value"');
      }

      this.value = value;
      this.valueType = valueType;
    }
    else {
      // stringify the value and determine the type
      this.value = value + '';
      this.valueType = getType(value);
    }

    if (!SUPPORTED_TYPES[this.valueType]) {
      throw new TypeError('Unsupported type of value "' + this.valueType + '"');
    }
  }

  var SUPPORTED_TYPES = {
    'number': true,
    'string': true,
    'boolean': true,
    'undefined': true,
    'null': true
  };

  ConstantNode.prototype = new Node();

  ConstantNode.prototype.type = 'ConstantNode';

  ConstantNode.prototype.isConstantNode = true;

  /**
   * Compile the node to javascript code
   * @param {ConstantNode} node The node to be compiled
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  function compileConstantNode(node, defs, args) {
    if (!(node instanceof ConstantNode)) {
      throw new TypeError('No valid ConstantNode')
    }

    switch (node.valueType) {
      case 'number':
        if (config.number === 'BigNumber') {
          return 'math.bignumber(' + stringify(node.value) + ')';
        }
        else if (config.number === 'Fraction') {
          return 'math.fraction(' + stringify(node.value) + ')';
        }
        else {
          // remove leading zeros like '003.2' which are not allowed by JavaScript
          validateNumericValue(node.value);
          return node.value.replace(/^(0*)[0-9]/, function (match, zeros) {
            return match.substring(zeros.length);
          });
        }

      case 'string':
        // Important to escape unescaped double quotes in the string
        return stringify(node.value);

      case 'boolean':
        // prevent invalid values
        return String(node.value) === 'true' ? 'true' : 'false';

      case 'undefined':
        return 'undefined';

      case 'null':
        return 'null';

      default:
        // TODO: move this error to the constructor?
        throw new TypeError('Unsupported type of constant "' + node.valueType + '"');
    }
  }

  /**
   * Test whether value is a string containing a numeric value
   * @param {String} value
   * @return {boolean} Returns true when ok
   */
  function validateNumericValue (value) {
    // The following regexp is relatively permissive
    if (typeof value !== 'string' ||
        !/^[\-+]?((\d+\.?\d*)|(\d*\.?\d+))([eE][+\-]?\d+)?$/.test(value)) {
      throw new Error('Invalid numeric value "' + value + '"');
    }
  }

  // register the compile function
  register(ConstantNode.prototype.type, compileConstantNode);

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  ConstantNode.prototype.forEach = function (callback) {
    // nothing to do, we don't have childs
  };


  /**
   * Create a new ConstantNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node) : Node} callback
   * @returns {ConstantNode} Returns a clone of the node
   */
  ConstantNode.prototype.map = function (callback) {
    return this.clone();
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {ConstantNode}
   */
  ConstantNode.prototype.clone = function () {
    return new ConstantNode(this.value, this.valueType);
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   */
  ConstantNode.prototype._toString = function (options) {
    switch (this.valueType) {
      case 'string':
        return stringify(this.value);

      default:
        return this.value;
    }
  };

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string} str
   */
  ConstantNode.prototype.toHTML = function (options) {
	var value = escape(this.value);
    switch (this.valueType) {
	  case 'number':
	    return '<span class="math-number">' + value + '</span>';
      case 'string':
	    return '<span class="math-string">' + value + '</span>';
      case 'boolean':
	    return '<span class="math-boolean">' + value + '</span>';
      case 'null':
	    return '<span class="math-null-symbol">' + value + '</span>';
      case 'undefined':
	    return '<span class="math-undefined">' + value + '</span>';

      default:
        return '<span class="math-symbol">' + value + '</span>';
    }
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  ConstantNode.prototype._toTex = function (options) {
    var value = this.value,
        index;
    switch (this.valueType) {
      case 'string':
        return '\\mathtt{' + escapeLatex(stringify(value)) + '}';

      case 'number':
        index = value.toLowerCase().indexOf('e');
        if (index !== -1) {
          return value.substring(0, index) + '\\cdot10^{' +
              value.substring(index + 1) + '}';
        }
        return value;

      default:
        return value;
    }
  };

  return ConstantNode;
}

exports.name = 'ConstantNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../../utils/latex":46,"../../utils/string":49,"../../utils/types":50,"./Node":19,"./compile":25}],16:[function(require,module,exports){
'use strict';

var keywords = require('../keywords');
var stringify = require('../../utils/string').stringify;
var escape = require('../../utils/string').escape;
var map = require('../../utils/array').map;
var join = require('../../utils/array').join;
var latex = require('../../utils/latex');
var operators = require('../operators');
var setSafeProperty = require('../../utils/customs').setSafeProperty;
var getUniqueArgumentName = require('./utils/getUniqueArgumentName');

function factory (type, config, load, typed) {
  var register = load(require('./compile')).register;
  var compile = load(require('./compile')).compile;
  var Node = load(require('./Node'));

  /**
   * @constructor FunctionAssignmentNode
   * @extends {Node}
   * Function assignment
   *
   * @param {string} name           Function name
   * @param {string[] | Array.<{name: string, type: string}>} params
   *                                Array with function parameter names, or an
   *                                array with objects containing the name
   *                                and type of the parameter
   * @param {Node} expr             The function expression
   */
  function FunctionAssignmentNode(name, params, expr) {
    if (!(this instanceof FunctionAssignmentNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate input
    if (typeof name !== 'string') throw new TypeError('String expected for parameter "name"');
    if (!Array.isArray(params))  throw new TypeError('Array containing strings or objects expected for parameter "params"');
    if (!type.isNode(expr)) throw new TypeError('Node expected for parameter "expr"');
    if (name in keywords) throw new Error('Illegal function name, "' + name + '" is a reserved keyword');

    this.name = name;
    this.params = params.map(function (param) {
      return param && param.name || param;
    });
    this.types = params.map(function (param) {
      return param && param.type || 'any'
    });
    this.expr = expr;
  }

  FunctionAssignmentNode.prototype = new Node();

  FunctionAssignmentNode.prototype.type = 'FunctionAssignmentNode';

  FunctionAssignmentNode.prototype.isFunctionAssignmentNode = true;

  /**
   * Compile the node to javascript code
   * @param {FunctionAssignmentNode} node The node to be compiled
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  function compileFunctionAssignmentNode(node, defs, args) {
    if (!(node instanceof FunctionAssignmentNode)) {
      throw new TypeError('No valid FunctionAssignmentNode')
    }

    defs.typed = typed;
    defs.setSafeProperty = setSafeProperty;

    // validate params
    // FIXME: rename parameters to safe, internal names

    // we extend the original args and add the args to the child object
    // and create a mapping from the unsafe param name to a safe, internal one
    var childArgs = Object.create(args);
    var jsParams = map(node.params, function (param) {
      childArgs[param] = getUniqueArgumentName(childArgs);
      return childArgs[param];
    });

    // compile the function expression with the child args
    var jsExpr = compile(node.expr, defs, childArgs);
    var jsName = stringify(node.name);

    return 'setSafeProperty(scope, ' + jsName + ', ' +
        '  (function () {' +
        '    var fn = typed(' + jsName + ', {' +
        '      ' + stringify(join(node.types, ',')) + ': function (' + join(jsParams, ',') + ') {' +
        '        return ' + jsExpr + '' +
        '      }' +
        '    });' +
        '    fn.syntax = ' + stringify(node.name + '(' + join(node.params, ', ') + ')') + ';' +
        '    return fn;' +
        '  })())';
  }

  // register the compile function
  register(FunctionAssignmentNode.prototype.type, compileFunctionAssignmentNode);

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  FunctionAssignmentNode.prototype.forEach = function (callback) {
    callback(this.expr, 'expr', this);
  };

  /**
   * Create a new FunctionAssignmentNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {FunctionAssignmentNode} Returns a transformed copy of the node
   */
  FunctionAssignmentNode.prototype.map = function (callback) {
    var expr = this._ifNode(callback(this.expr, 'expr', this));

    return new FunctionAssignmentNode(this.name, this.params.slice(0), expr);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {FunctionAssignmentNode}
   */
  FunctionAssignmentNode.prototype.clone = function () {
    return new FunctionAssignmentNode(this.name, this.params.slice(0), this.expr);
  };

  /**
   * Is parenthesis needed?
   * @param {Node} node
   * @param {Object} parenthesis
   * @private
   */
  function needParenthesis(node, parenthesis) {
    var precedence = operators.getPrecedence(node, parenthesis);
    var exprPrecedence = operators.getPrecedence(node.expr, parenthesis);

    return (parenthesis === 'all')
      || ((exprPrecedence !== null) && (exprPrecedence <= precedence));
  }

  /**
   * get string representation
   * @param {Object} options
   * @return {string} str
   */
  FunctionAssignmentNode.prototype._toString = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var expr = this.expr.toString(options);
    if (needParenthesis(this, parenthesis)) {
      expr = '(' + expr + ')';
    }
    return this.name + '(' + this.params.join(', ') + ') = ' + expr;
  };

  /**
   * get HTML representation
   * @param {Object} options
   * @return {string} str
   */
   FunctionAssignmentNode.prototype.toHTML = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
	var params = [];
	for (var i=0; i<this.params.length; i++)	{
	  params.push('<span class="math-symbol math-parameter">' + escape(this.params[i]) + '</span>');
	}
    var expr = this.expr.toHTML(options);
    if (needParenthesis(this, parenthesis)) {
      expr = '<span class="math-parenthesis math-round-parenthesis">(</span>' + expr + '<span class="math-parenthesis math-round-parenthesis">)</span>';
    }
    return '<span class="math-function">' + escape(this.name) + '</span>' + '<span class="math-parenthesis math-round-parenthesis">(</span>' + params.join('<span class="math-separator">,</span>') + '<span class="math-parenthesis math-round-parenthesis">)</span><span class="math-operator math-assignment-operator math-variable-assignment-operator math-binary-operator">=</span>' + expr;
  };

  /**
   * get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  FunctionAssignmentNode.prototype._toTex = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var expr = this.expr.toTex(options);
    if (needParenthesis(this, parenthesis)) {
      expr = '\\left(' + expr + '\\right)';
    }

    return '\\mathrm{' + this.name
        + '}\\left(' + this.params.map(latex.toSymbol).join(',') + '\\right):=' + expr;
  };

  return FunctionAssignmentNode;
}
exports.name = 'FunctionAssignmentNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../../utils/array":41,"../../utils/customs":45,"../../utils/latex":46,"../../utils/string":49,"../keywords":9,"../operators":29,"./Node":19,"./compile":25,"./utils/getUniqueArgumentName":28}],17:[function(require,module,exports){
'use strict';

var latex = require('../../utils/latex');
var stringify = require('../../utils/string').stringify;
var escape = require('../../utils/string').escape;
var extend = require('../../utils/object').extend;
var hasOwnProperty = require('../../utils/object').hasOwnProperty;
var map = require('../../utils/array').map;
var join = require('../../utils/array').join;
var validateSafeMethod = require('../../utils/customs').validateSafeMethod;
var getUniqueArgumentName = require('./utils/getUniqueArgumentName');

function factory (type, config, load, typed, math) {
  var register = load(require('./compile')).register;
  var compile = load(require('./compile')).compile;
  var Node = load(require('./Node'));
  var SymbolNode = load(require('./SymbolNode'));

  /**
   * @constructor FunctionNode
   * @extends {./Node}
   * invoke a list with arguments on a node
   * @param {./Node | string} fn Node resolving with a function on which to invoke
   *                             the arguments, typically a SymboNode or AccessorNode
   * @param {./Node[]} args
   */
  function FunctionNode(fn, args) {
    if (!(this instanceof FunctionNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    if (typeof fn === 'string') {
      fn = new SymbolNode(fn);
    }

    // validate input
    if (!type.isNode(fn)) throw new TypeError('Node expected as parameter "fn"');
    if (!Array.isArray(args) || !args.every(type.isNode)) {
      throw new TypeError('Array containing Nodes expected for parameter "args"');
    }

    this.fn = fn;
    this.args = args || [];

    // readonly property name
    Object.defineProperty(this, 'name', {
      get: function () {
        return this.fn.name || '';
      }.bind(this),
      set: function () {
        throw new Error('Cannot assign a new name, name is read-only');
      }
    });

    // TODO: deprecated since v3, remove some day
    var deprecated = function () {
      throw new Error('Property `FunctionNode.object` is deprecated, use `FunctionNode.fn` instead');
    };
    Object.defineProperty(this, 'object', { get: deprecated, set: deprecated });
  }

  FunctionNode.prototype = new Node();

  FunctionNode.prototype.type = 'FunctionNode';

  FunctionNode.prototype.isFunctionNode = true;

  /**
   * Compile the node to javascript code
   * @param {FunctionNode} node The node to be compiled
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  function compileFunctionNode(node, defs, args) {
    if (!(node instanceof FunctionNode)) {
      throw new TypeError('No valid FunctionNode')
    }

    // compile fn and arguments
    var jsFn = compile(node.fn, defs, args);
    var jsArgs = map(node.args, function (arg) {
      return compile(arg, defs, args);
    });
    var jsScope = compileScope(defs, args);
    var argsName;

    if (type.isSymbolNode(node.fn)) {
      // we can statically determine whether the function has an rawArgs property
      var name = node.fn.name;
      var fn = hasOwnProperty(defs.math, name) ? defs.math[name] : undefined;
      var isRaw = (typeof fn === 'function') && (fn.rawArgs == true);

      if (isRaw) {
        // pass unevaluated parameters (nodes) to the function
        argsName = getUniqueArgumentName(defs);
        defs[argsName] = node.args;

        return jsFn + '(' + argsName + ', math, ' + jsScope + ')'; // "raw" evaluation
      }
      else {
        return jsFn + '(' + join(jsArgs, ', ') + ')';              // "regular" evaluation
      }
    }
    else if (type.isAccessorNode(node.fn) &&
        type.isIndexNode(node.fn.index) && node.fn.index.isObjectProperty()) {
      // execute the function with the right context: the object of the AccessorNode
      argsName = getUniqueArgumentName(defs);
      defs[argsName] = node.args;
      defs.validateSafeMethod = validateSafeMethod

      var jsObject = compile(node.fn.object, defs, args);
      var jsProp = stringify(node.fn.index.getObjectProperty());

      return '(function () {' +
          'var object = ' + jsObject + ';' +
          'validateSafeMethod(object, ' + jsProp + ');' +
          'return (object[' + jsProp + '] && object[' + jsProp + '].rawArgs) ' +
          ' ? object[' + jsProp + '](' + argsName + ', math, ' + jsScope + ')' + // "raw" evaluation
          ' : object[' + jsProp + '](' + join(jsArgs, ', ') + ')' +              // "regular" evaluation
          '})()';
    }
    else { // node.fn.isAccessorNode && !node.fn.index.isObjectProperty()
      // we have to dynamically determine whether the function has a rawArgs property
      argsName = getUniqueArgumentName(defs);
      defs[argsName] = node.args;

      return '(function () {' +
          'var fn = ' + jsFn + ';' +
          'return (fn && fn.rawArgs) ' +
          ' ? fn(' + argsName + ', math, ' + jsScope + ')' +  // "raw" evaluation
          ' : fn(' + join(jsArgs, ', ') + ')' +               // "regular" evaluation
          '})()';
    }
  }

  // register the compile function
  register(FunctionNode.prototype.type, compileFunctionNode);

  /**
   * Merge function arguments into scope before passing to the actual function.
   * This is needed when the function has `rawArgs=true`. In that case we have
   * to pass the `scope` as third argument, including any variables of
   * enclosing functions.
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  function compileScope (defs, args) {
    var names = Object.keys(args)
        // .map(function (arg) {
        //   return args[arg];
        // });
    if (names.length === 0) {
      return 'scope';
    }
    else {
      // merge arguments into scope
      defs.extend = extend;

      var jsArgs = map(names, function (name) {
        return stringify(name) + ': ' + args[name];
      });

      return 'extend(extend({}, scope), {' + join(jsArgs, ', ') + '})';
    }
  }

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  FunctionNode.prototype.forEach = function (callback) {
    for (var i = 0; i < this.args.length; i++) {
      callback(this.args[i], 'args[' + i + ']', this);
    }
  };

  /**
   * Create a new FunctionNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {FunctionNode} Returns a transformed copy of the node
   */
  FunctionNode.prototype.map = function (callback) {
    var fn = this.fn.map(callback);
    var args = [];
    for (var i = 0; i < this.args.length; i++) {
      args[i] = this._ifNode(callback(this.args[i], 'args[' + i + ']', this));
    }
    return new FunctionNode(fn, args);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {FunctionNode}
   */
  FunctionNode.prototype.clone = function () {
    return new FunctionNode(this.fn, this.args.slice(0));
  };

  //backup Node's toString function
  //@private
  var nodeToString = FunctionNode.prototype.toString;

  /**
   * Get string representation. (wrapper function)
   * This overrides parts of Node's toString function.
   * If callback is an object containing callbacks, it
   * calls the correct callback for the current node,
   * otherwise it falls back to calling Node's toString
   * function.
   *
   * @param {Object} options
   * @return {string} str
   * @override
   */
  FunctionNode.prototype.toString = function (options) {
    var customString;
    var name = this.fn.toString(options);
    if (options && (typeof options.handler === 'object') && hasOwnProperty(options.handler, name)) {
      //callback is a map of callback functions
      customString = options.handler[name](this, options);
    }

    if (typeof customString !== 'undefined') {
      return customString;
    }

    //fall back to Node's toString
    return nodeToString.call(this, options);
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   */
  FunctionNode.prototype._toString = function (options) {
    var args = this.args.map(function (arg) {
      return arg.toString(options);
    });

    var fn = type.isFunctionAssignmentNode(this.fn)
        ? ('(' + this.fn.toString(options) + ')')
        : this.fn.toString(options)

    // format the arguments like "add(2, 4.2)"
    return fn + '(' + args.join(', ') + ')';
  };
  
  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string} str
   */
  FunctionNode.prototype.toHTML = function (options) {
    var args = this.args.map(function (arg) {
      return arg.toHTML(options);
    });

    // format the arguments like "add(2, 4.2)"
    return '<span class="math-function">' + escape(this.fn) + '</span><span class="math-paranthesis math-round-parenthesis">(</span>' + args.join('<span class="math-separator">,</span>') + '<span class="math-paranthesis math-round-parenthesis">)</span>';
  };

  /*
   * Expand a LaTeX template
   *
   * @param {string} template
   * @param {Node} node
   * @param {Object} options
   * @private
   **/
  function expandTemplate(template, node, options) {
    var latex = '';

    // Match everything of the form ${identifier} or ${identifier[2]} or $$
    // while submatching identifier and 2 (in the second case)
    var regex = new RegExp('\\$(?:\\{([a-z_][a-z_0-9]*)(?:\\[([0-9]+)\\])?\\}|\\$)', 'ig');

    var inputPos = 0;   //position in the input string
    var match;
    while ((match = regex.exec(template)) !== null) {   //go through all matches
      // add everything in front of the match to the LaTeX string
      latex += template.substring(inputPos, match.index);
      inputPos = match.index;

      if (match[0] === '$$') { // escaped dollar sign
        latex += '$';
        inputPos++;
      }
      else { // template parameter
        inputPos += match[0].length;
        var property = node[match[1]];
        if (!property) {
          throw new ReferenceError('Template: Property ' + match[1] + ' does not exist.');
        }
        if (match[2] === undefined) { //no square brackets
          switch (typeof property) {
            case 'string':
              latex += property;
              break;
            case 'object':
              if (type.isNode(property)) {
                latex += property.toTex(options);
              }
              else if (Array.isArray(property)) {
                //make array of Nodes into comma separated list
                latex += property.map(function (arg, index) {
                  if (type.isNode(arg)) {
                    return arg.toTex(options);
                  }
                  throw new TypeError('Template: ' + match[1] + '[' + index + '] is not a Node.');
                }).join(',');
              }
              else {
                throw new TypeError('Template: ' + match[1] + ' has to be a Node, String or array of Nodes');
              }
              break;
            default:
              throw new TypeError('Template: ' + match[1] + ' has to be a Node, String or array of Nodes');
          }
        }
        else { //with square brackets
          if (type.isNode(property[match[2]] && property[match[2]])) {
            latex += property[match[2]].toTex(options);
          }
          else {
            throw new TypeError('Template: ' + match[1] + '[' + match[2] + '] is not a Node.');
          }
        }
      }
    }
    latex += template.slice(inputPos);  //append rest of the template

    return latex;
  }

  //backup Node's toTex function
  //@private
  var nodeToTex = FunctionNode.prototype.toTex;

  /**
   * Get LaTeX representation. (wrapper function)
   * This overrides parts of Node's toTex function.
   * If callback is an object containing callbacks, it
   * calls the correct callback for the current node,
   * otherwise it falls back to calling Node's toTex
   * function.
   *
   * @param {Object} options
   * @return {string}
   */
  FunctionNode.prototype.toTex = function (options) {
    var customTex;
    if (options && (typeof options.handler === 'object') && hasOwnProperty(options.handler, this.name)) {
      //callback is a map of callback functions
      customTex = options.handler[this.name](this, options);
    }

    if (typeof customTex !== 'undefined') {
      return customTex;
    }

    //fall back to Node's toTex
    return nodeToTex.call(this, options);
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  FunctionNode.prototype._toTex = function (options) {
    var args = this.args.map(function (arg) { //get LaTeX of the arguments
      return arg.toTex(options);
    });

    var latexConverter;

    if (math[this.name] && ((typeof math[this.name].toTex === 'function') || (typeof math[this.name].toTex === 'object') || (typeof math[this.name].toTex === 'string'))) {
      //.toTex is a callback function
      latexConverter = math[this.name].toTex;
    }

    var customToTex;
    switch (typeof latexConverter) {
      case 'function': //a callback function
        customToTex = latexConverter(this, options);
        break;
      case 'string': //a template string
        customToTex = expandTemplate(latexConverter, this, options);
        break;
      case 'object': //an object with different "converters" for different numbers of arguments
        switch (typeof latexConverter[args.length]) {
          case 'function':
            customToTex = latexConverter[args.length](this, options);
            break;
          case 'string':
            customToTex = expandTemplate(latexConverter[args.length], this, options);
            break;
        }
    }

    if (typeof customToTex !== 'undefined') {
      return customToTex;
    }

    return expandTemplate(latex.defaultTemplate, this, options);
  };

  /**
   * Get identifier.
   * @return {string}
   */
  FunctionNode.prototype.getIdentifier = function () {
    return this.type + ':' + this.name;
  };

  return FunctionNode;
}

exports.name = 'FunctionNode';
exports.path = 'expression.node';
exports.math = true; // request access to the math namespace as 5th argument of the factory function
exports.factory = factory;

},{"../../utils/array":41,"../../utils/customs":45,"../../utils/latex":46,"../../utils/object":48,"../../utils/string":49,"./Node":19,"./SymbolNode":24,"./compile":25,"./utils/getUniqueArgumentName":28}],18:[function(require,module,exports){
'use strict';

var map = require('../../utils/array').map;
var join = require('../../utils/array').join;
var escape = require('../../utils/string').escape;

function factory (type, config, load, typed) {
  var register = load(require('./compile')).register;
  var compile = load(require('./compile')).compile;
  var Node = load(require('./Node'));
  var RangeNode = load(require('./RangeNode'));
  var SymbolNode = load(require('./SymbolNode'));

  var Range = load(require('../../type/matrix/Range'));

  var isArray = Array.isArray;

  /**
   * @constructor IndexNode
   * @extends Node
   *
   * Describes a subset of a matrix or an object property.
   * Cannot be used on its own, needs to be used within an AccessorNode or
   * AssignmentNode.
   *
   * @param {Node[]} dimensions
   * @param {boolean} [dotNotation=false]  Optional property describing whether
   *                                       this index was written using dot
   *                                       notation like `a.b`, or using bracket
   *                                       notation like `a["b"]` (default).
   *                                       Used to stringify an IndexNode.
   */
  function IndexNode(dimensions, dotNotation) {
    if (!(this instanceof IndexNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    this.dimensions = dimensions;
    this.dotNotation = dotNotation || false;

    // validate input
    if (!isArray(dimensions) || !dimensions.every(type.isNode)) {
      throw new TypeError('Array containing Nodes expected for parameter "dimensions"');
    }
    if (this.dotNotation && !this.isObjectProperty()) {
      throw new Error('dotNotation only applicable for object properties');
    }

    // TODO: deprecated since v3, remove some day
    var deprecated = function () {
      throw new Error('Property `IndexNode.object` is deprecated, use `IndexNode.fn` instead');
    };
    Object.defineProperty(this, 'object', { get: deprecated, set: deprecated });
  }

  IndexNode.prototype = new Node();

  IndexNode.prototype.type = 'IndexNode';

  IndexNode.prototype.isIndexNode = true;

  /**
   * Compile all range nodes
   *
   * When some of the dimensions has `end` defined, the IndexNode requires
   * a variable `size` to be defined in the current closure, and must contain
   * the size of the matrix that's being handled. To check whether the `size`
   * variable is needed, call IndexNode.needsSize().
   *
   * @param {IndexNode} node        The node to be compiled
   * @param {Object} defs           Object which can be used to define functions
   *                                or constants globally available for the
   *                                compiled expression
   * @param {Object} args           Object with local function arguments, the key is
   *                                the name of the argument, and the value is `true`.
   *                                The object may not be mutated, but must be
   *                                extended instead.
   * @return {string} code
   */
  function compileIndexNode(node, defs, args) {
    if (!(node instanceof IndexNode)) {
      throw new TypeError('No valid IndexNode')
    }

    // args can be mutated by IndexNode, when dimensions use `end`
    var childArgs = Object.create(args);

    // helper function to create a Range from start, step and end
    defs.range = function (start, end, step) {
      return new Range(
          type.isBigNumber(start) ? start.toNumber() : start,
          type.isBigNumber(end)   ? end.toNumber()   : end,
          type.isBigNumber(step)  ? step.toNumber()  : step
      );
    };

    // TODO: implement support for bignumber (currently bignumbers are silently
    //       reduced to numbers when changing the value to zero-based)

    // TODO: Optimization: when the range values are ConstantNodes,
    //       we can beforehand resolve the zero-based value

    // optimization for a simple object property
    var dimensions = map(node.dimensions, function (range, i) {
      if (type.isRangeNode(range)) {
        if (range.needsEnd()) {
          childArgs.end = 'end';

          // resolve end and create range
          return '(function () {' +
              'var end = size[' + i + ']; ' +
              'return range(' +
              compile(range.start, defs, childArgs) + ', ' +
              compile(range.end, defs, childArgs) + ', ' +
              (range.step ? compile(range.step, defs, childArgs) : '1') +
              '); ' +
              '})()';
        }
        else {
          // create range
          return 'range(' +
              compile(range.start, defs, childArgs) + ', ' +
              compile(range.end, defs, childArgs) + ', ' +
              (range.step ? compile(range.step, defs, childArgs) : '1') +
              ')';
        }
      }
      if (type.isSymbolNode(range) && range.name === 'end') {
        childArgs.end = 'end';

        // resolve the parameter 'end'
        return '(function () {' +
            'var end = size[' + i + ']; ' +
            'return ' + compile(range, defs, childArgs) + '; ' +
            '})()'
      }
      else { // ConstantNode
        return compile(range, defs, childArgs);
      }
    });

    return 'math.index(' + join(dimensions, ', ') + ')';
  }

  // register the compile function
  register(IndexNode.prototype.type, compileIndexNode);

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  IndexNode.prototype.forEach = function (callback) {
    for (var i = 0; i < this.dimensions.length; i++) {
      callback(this.dimensions[i], 'dimensions[' + i + ']', this);
    }
  };

  /**
   * Create a new IndexNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {IndexNode} Returns a transformed copy of the node
   */
  IndexNode.prototype.map = function (callback) {
    var dimensions = [];
    for (var i = 0; i < this.dimensions.length; i++) {
      dimensions[i] = this._ifNode(callback(this.dimensions[i], 'dimensions[' + i + ']', this));
    }

    return new IndexNode(dimensions);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {IndexNode}
   */
  IndexNode.prototype.clone = function () {
    return new IndexNode(this.dimensions.slice(0));
  };

  /**
   * Test whether this IndexNode contains a single property name
   * @return {boolean}
   */
  IndexNode.prototype.isObjectProperty = function () {
    return this.dimensions.length === 1 &&
        type.isConstantNode(this.dimensions[0]) &&
        this.dimensions[0].valueType === 'string';
  };

  /**
   * Returns the property name if IndexNode contains a property.
   * If not, returns null.
   * @return {string | null}
   */
  IndexNode.prototype.getObjectProperty = function () {
    return this.isObjectProperty() ? this.dimensions[0].value : null;
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   */
  IndexNode.prototype._toString = function (options) {
    // format the parameters like "[1, 0:5]"
    return this.dotNotation
        ? ('.' + this.getObjectProperty())
        : ('[' + this.dimensions.join(', ') + ']');
  };

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string} str
   */
  IndexNode.prototype.toHTML = function (options) {
    // format the parameters like "[1, 0:5]"
	var dimensions = []
	for (var i=0; i<this.dimensions.length; i++)	{
	  dimensions[i] = this.dimensions[i].toHTML();
	}
	if (this.dotNotation) {
	  return '<span class="math-operator math-accessor-operator">.</span>' + '<span class="math-symbol math-property">' + escape(this.getObjectProperty()) + '</span>';}
	else {
	  return '<span class="math-parenthesis math-square-parenthesis">[</span>' + dimensions.join('<span class="math-separator">,</span>') + '<span class="math-parenthesis math-square-parenthesis">]</span>'}
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  IndexNode.prototype._toTex = function (options) {
    var dimensions = this.dimensions.map(function (range) {
      return range.toTex(options);
    });

    return this.dotNotation
        ? ('.' + this.getObjectProperty() + '')
        : ('_{' + dimensions.join(',') + '}');
  };

  /**
   * Test whether this IndexNode needs the object size, size of the Matrix
   * @return {boolean}
   */
  IndexNode.prototype.needsSize = function () {
    return this.dimensions.some(function (range) {
      return (type.isRangeNode(range) && range.needsEnd()) ||
          (type.isSymbolNode(range) && range.name === 'end');
    });
  };

  return IndexNode;
}

exports.name = 'IndexNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../../type/matrix/Range":38,"../../utils/array":41,"../../utils/string":49,"./Node":19,"./RangeNode":23,"./SymbolNode":24,"./compile":25}],19:[function(require,module,exports){
'use strict';

var keywords = require('../keywords');
var deepEqual= require('../../utils/object').deepEqual;
var hasOwnProperty = require('../../utils/object').hasOwnProperty;

function factory (type, config, load, typed, math) {
  var compile = load(require('./compile')).compile;

  /**
   * Node
   */
  function Node() {
    if (!(this instanceof Node)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }
  }

  /**
   * Evaluate the node
   * @param {Object} [scope]  Scope to read/write variables
   * @return {*}              Returns the result
   */
  Node.prototype.eval = function(scope) {
    return this.compile().eval(scope);
  };

  Node.prototype.type = 'Node';

  Node.prototype.isNode = true;

  Node.prototype.comment = '';

  /**
   * Compile the node to javascript code
   * @return {{eval: function}} expr  Returns an object with a function 'eval',
   *                                  which can be invoked as expr.eval([scope]),
   *                                  where scope is an optional object with
   *                                  variables.
   */
  Node.prototype.compile = function () {
    // TODO: calling compile(math) is deprecated since version 2.0.0. Remove this warning some day
    if (arguments.length > 0) {
      throw new Error('Calling compile(math) is deprecated. Call the function as compile() instead.');
    }

    // definitions globally available inside the closure of the compiled expressions
    var defs = {
      math: math.expression.mathWithTransform,
      args: {}, // can be filled with names of FunctionAssignment arguments
      _validateScope: _validateScope
    };

    // will be used to put local function arguments
    var args = {};

    var code = compile(this, defs, args);

    var defsCode = Object.keys(defs).map(function (name) {
      return '    var ' + name + ' = defs["' + name + '"];';
    });

    var factoryCode =
        defsCode.join(' ') +
        'return {' +
        '  "eval": function (scope) {' +
        '    if (scope) _validateScope(scope);' +
        '    scope = scope || {};' +
        '    return ' + code + ';' +
        '  }' +
        '};';

    var factory = new Function('defs', factoryCode);
    return factory(defs);
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  Node.prototype.forEach = function (callback) {
    // must be implemented by each of the Node implementations
    throw new Error('Cannot run forEach on a Node interface');
  };

  /**
   * Create a new Node having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {OperatorNode} Returns a transformed copy of the node
   */
  Node.prototype.map = function (callback) {
    // must be implemented by each of the Node implementations
    throw new Error('Cannot run map on a Node interface');
  };

  /**
   * Validate whether an object is a Node, for use with map
   * @param {Node} node
   * @returns {Node} Returns the input if it's a node, else throws an Error
   * @protected
   */
  Node.prototype._ifNode = function (node) {
    if (!type.isNode(node)) {
      throw new TypeError('Callback function must return a Node');
    }

    return node;
  };

  /**
   * Recursively traverse all nodes in a node tree. Executes given callback for
   * this node and each of its child nodes.
   * @param {function(node: Node, path: string, parent: Node)} callback
   *          A callback called for every node in the node tree.
   */
  Node.prototype.traverse = function (callback) {
    // execute callback for itself
    callback(this, null, null);

    // recursively traverse over all childs of a node
    function _traverse(node, callback) {
      node.forEach(function (child, path, parent) {
        callback(child, path, parent);
        _traverse(child, callback);
      });
    }

    _traverse(this, callback);
  };

  /**
   * Recursively transform a node tree via a transform function.
   *
   * For example, to replace all nodes of type SymbolNode having name 'x' with a
   * ConstantNode with value 2:
   *
   *     var res = Node.transform(function (node, path, parent) {
   *       if (node && node.isSymbolNode) && (node.name == 'x')) {
   *         return new ConstantNode(2);
   *       }
   *       else {
   *         return node;
   *       }
   *     });
   *
   * @param {function(node: Node, path: string, parent: Node) : Node} callback
   *          A mapping function accepting a node, and returning
   *          a replacement for the node or the original node.
   *          Signature: callback(node: Node, index: string, parent: Node) : Node
   * @return {Node} Returns the original node or its replacement
   */
  Node.prototype.transform = function (callback) {
    // traverse over all childs
    function _transform (node, callback) {
      return node.map(function(child, path, parent) {
        var replacement = callback(child, path, parent);
        return _transform(replacement, callback);
      });
    }

    var replacement = callback(this, null, null);
    return _transform(replacement, callback);
  };

  /**
   * Find any node in the node tree matching given filter function. For example, to
   * find all nodes of type SymbolNode having name 'x':
   *
   *     var results = Node.filter(function (node) {
   *       return (node && node.isSymbolNode) && (node.name == 'x');
   *     });
   *
   * @param {function(node: Node, path: string, parent: Node) : Node} callback
   *            A test function returning true when a node matches, and false
   *            otherwise. Function signature:
   *            callback(node: Node, index: string, parent: Node) : boolean
   * @return {Node[]} nodes       An array with nodes matching given filter criteria
   */
  Node.prototype.filter = function (callback) {
    var nodes = [];

    this.traverse(function (node, path, parent) {
      if (callback(node, path, parent)) {
        nodes.push(node);
      }
    });

    return nodes;
  };

  // TODO: deprecated since version 1.1.0, remove this some day
  Node.prototype.find = function () {
    throw new Error('Function Node.find is deprecated. Use Node.filter instead.');
  };

  // TODO: deprecated since version 1.1.0, remove this some day
  Node.prototype.match = function () {
    throw new Error('Function Node.match is deprecated. See functions Node.filter, Node.transform, Node.traverse.');
  };

  /**
   * Create a shallow clone of this node
   * @return {Node}
   */
  Node.prototype.clone = function () {
    // must be implemented by each of the Node implementations
    throw new Error('Cannot clone a Node interface');
  };

  /**
   * Create a deep clone of this node
   * @return {Node}
   */
  Node.prototype.cloneDeep = function () {
    return this.map(function (node) {
      return node.cloneDeep();
    });
  };

  /**
   * Deep compare this node with another node.
   * @param {Node} other
   * @return {boolean} Returns true when both nodes are of the same type and
   *                   contain the same values (as do their childs)
   */
  Node.prototype.equals = function (other) {
    return other
        ? deepEqual(this, other)
        : false
  };

  /**
   * Get string representation. (wrapper function)
   *
   * This function can get an object of the following form:
   * {
   *    handler: //This can be a callback function of the form
   *             // "function callback(node, options)"or
   *             // a map that maps function names (used in FunctionNodes)
   *             // to callbacks
   *    parenthesis: "keep" //the parenthesis option (This is optional)
   * }
   *
   * @param {Object} [options]
   * @return {string}
   */
  Node.prototype.toString = function (options) {
    var customString;
    if (options && typeof options === 'object') {
        switch (typeof options.handler) {
          case 'object':
          case 'undefined':
            break;
          case 'function':
            customString = options.handler(this, options);
            break;
          default:
            throw new TypeError('Object or function expected as callback');
        }
    }

    if (typeof customString !== 'undefined') {
      return customString;
    }

    return this._toString(options);
  };

  /**
   * Get HTML representation. (wrapper function)
   *
   * This function can get an object of the following form:
   * {
   *    handler: //This can be a callback function of the form
   *             // "function callback(node, options)" or
   *             // a map that maps function names (used in FunctionNodes)
   *             // to callbacks
   *    parenthesis: "keep" //the parenthesis option (This is optional)
   * }
   *
   * @param {Object} [options]
   * @return {string}
   */
  Node.prototype.toHTML = function (options) {
    var customString;
    if (options && typeof options === 'object') {
        switch (typeof options.handler) {
          case 'object':
          case 'undefined':
            break;
          case 'function':
            customString = options.handler(this, options);
            break;
          default:
            throw new TypeError('Object or function expected as callback');
        }
    }

    if (typeof customString !== 'undefined') {
      return customString;
    }

    return this.toHTML(options);
  };

  /**
   * Internal function to generate the string output.
   * This has to be implemented by every Node
   *
   * @throws {Error}
   */
  Node.prototype._toString = function () {
    //must be implemented by each of the Node implementations
    throw new Error('_toString not implemented for ' + this.type);
  };

  /**
   * Get LaTeX representation. (wrapper function)
   *
   * This function can get an object of the following form:
   * {
   *    handler: //This can be a callback function of the form
   *             // "function callback(node, options)"or
   *             // a map that maps function names (used in FunctionNodes)
   *             // to callbacks
   *    parenthesis: "keep" //the parenthesis option (This is optional)
   * }
   *
   * @param {Object} [options]
   * @return {string}
   */
  Node.prototype.toTex = function (options) {
    var customTex;
    if (options && typeof options == 'object') {
      switch (typeof options.handler) {
        case 'object':
        case 'undefined':
          break;
        case 'function':
          customTex = options.handler(this, options);
          break;
        default:
          throw new TypeError('Object or function expected as callback');
      }
    }

    if (typeof customTex !== 'undefined') {
      return customTex;
    }

    return this._toTex(options);
  };

  /**
   * Internal function to generate the LaTeX output.
   * This has to be implemented by every Node
   *
   * @param {Object} [options]
   * @throws {Error}
   */
  Node.prototype._toTex = function (options) {
    //must be implemented by each of the Node implementations
    throw new Error('_toTex not implemented for ' + this.type);
  };

  /**
   * Get identifier.
   * @return {string}
   */
  Node.prototype.getIdentifier = function () {
    return this.type;
  };

  /**
   * Get the content of the current Node.
   * @return {Node} node
   **/
  Node.prototype.getContent = function () {
    return this;
  };

  /**
   * Validate the symbol names of a scope.
   * Throws an error when the scope contains an illegal symbol.
   * @param {Object} scope
   */
  function _validateScope(scope) {
    for (var symbol in scope) {
      if (hasOwnProperty(scope, symbol)) {
        if (symbol in keywords) {
          throw new Error('Scope contains an illegal symbol, "' + symbol + '" is a reserved keyword');
        }
      }
    }
  }

  return Node;
}

exports.name = 'Node';
exports.path = 'expression.node';
exports.math = true; // request access to the math namespace as 5th argument of the factory function
exports.factory = factory;

},{"../../utils/object":48,"../keywords":9,"./compile":25}],20:[function(require,module,exports){
'use strict';

var stringify = require('../../utils/string').stringify;
var escape = require('../../utils/string').escape;
var isSafeProperty = require('../../utils/customs').isSafeProperty;
var hasOwnProperty = require('../../utils/object').hasOwnProperty;

function factory (type, config, load, typed) {
  var register = load(require('./compile')).register;
  var compile = load(require('./compile')).compile;
  var Node = load(require('./Node'));

  /**
   * @constructor ObjectNode
   * @extends {Node}
   * Holds an object with keys/values
   * @param {Object.<string, Node>} [properties]   array with key/value pairs
   */
  function ObjectNode(properties) {
    if (!(this instanceof ObjectNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    this.properties = properties || {};

    // validate input
    if (properties) {
      if (!(typeof properties === 'object') || !Object.keys(properties).every(function (key) {
            return type.isNode(properties[key]);
          })) {
        throw new TypeError('Object containing Nodes expected');
      }
    }
  }

  ObjectNode.prototype = new Node();

  ObjectNode.prototype.type = 'ObjectNode';

  ObjectNode.prototype.isObjectNode = true;

  /**
   * Compile the node to javascript code
   * @param {ObjectNode} node The node to be compiled
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} code
   * @private
   */
  function compileObjectNode(node, defs, args) {
    if (!(node instanceof ObjectNode)) {
      throw new TypeError('No valid ObjectNode')
    }

    var entries = [];
    for (var key in node.properties) {
      if (hasOwnProperty(node.properties, key)) {
        // we stringify/parse the key here to resolve unicode characters,
        // so you cannot create a key like {"co\\u006Estructor": null} 
        var stringifiedKey = stringify(key)
        var parsedKey = JSON.parse(stringifiedKey)
        if (!isSafeProperty(node.properties, parsedKey)) {
          throw new Error('No access to property "' + parsedKey + '"');
        }

        entries.push(stringifiedKey + ': ' + compile(node.properties[key], defs, args));
      }
    }
    return '{' + entries.join(', ') + '}';
  }

  // register the compile function
  register(ObjectNode.prototype.type, compileObjectNode);

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  ObjectNode.prototype.forEach = function (callback) {
    for (var key in this.properties) {
      if (this.properties.hasOwnProperty(key)) {
        callback(this.properties[key], 'properties[' + stringify(key) + ']', this);
      }
    }
  };

  /**
   * Create a new ObjectNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {ObjectNode} Returns a transformed copy of the node
   */
  ObjectNode.prototype.map = function (callback) {
    var properties = {};
    for (var key in this.properties) {
      if (this.properties.hasOwnProperty(key)) {
        properties[key] = this._ifNode(callback(this.properties[key],
            'properties[' + stringify(key) + ']', this));
      }
    }
    return new ObjectNode(properties);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {ObjectNode}
   */
  ObjectNode.prototype.clone = function() {
    var properties = {};
    for (var key in this.properties) {
      if (this.properties.hasOwnProperty(key)) {
        properties[key] = this.properties[key];
      }
    }
    return new ObjectNode(properties);
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  ObjectNode.prototype._toString = function(options) {
    var entries = [];
    for (var key in this.properties) {
      if (this.properties.hasOwnProperty(key)) {
        entries.push(stringify(key) + ': ' + this.properties[key].toString(options));
      }
    }
    return '{' + entries.join(', ') + '}';
  };

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  ObjectNode.prototype.toHTML = function(options) {
    var entries = [];
    for (var key in this.properties) {
      if (this.properties.hasOwnProperty(key)) {
        entries.push('<span class="math-symbol math-property">' + escape(key) + '</span>' + '<span class="math-operator math-assignment-operator math-property-assignment-operator math-binary-operator">:</span>' + this.properties[key].toHTML(options));
      }
    }
    return '<span class="math-parenthesis math-curly-parenthesis">{</span>' + entries.join('<span class="math-separator">,</span>') + '<span class="math-parenthesis math-curly-parenthesis">}</span>';
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  ObjectNode.prototype._toTex = function(options) {
    var entries = [];
    for (var key in this.properties) {
      if (this.properties.hasOwnProperty(key)) {
        entries.push("\\mathbf{" + key + ':} & ' + this.properties[key].toTex(options) + "\\\\");
      }
    }
    return '\\left\\{\\begin{array}{ll}' + entries.join('\n') + '\\end{array}\\right\\}';
  };

  return ObjectNode;
}

exports.name = 'ObjectNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../../utils/customs":45,"../../utils/object":48,"../../utils/string":49,"./Node":19,"./compile":25}],21:[function(require,module,exports){
'use strict';

var latex = require('../../utils/latex');
var map = require('../../utils/array').map;
var join = require('../../utils/array').join;
var stringify = require('../../utils/string').stringify;
var escape = require('../../utils/string').escape;
var isSafeMethod = require('../../utils/customs').isSafeMethod;
var operators = require('../operators');

function factory (type, config, load, typed) {
  var register = load(require('./compile')).register;
  var compile = load(require('./compile')).compile;
  var Node         = load(require('./Node'));
  var ConstantNode = load(require('./ConstantNode'));
  var SymbolNode   = load(require('./SymbolNode'));
  var FunctionNode = load(require('./FunctionNode'));

  /**
   * @constructor OperatorNode
   * @extends {Node}
   * An operator with two arguments, like 2+3
   *
   * @param {string} op           Operator name, for example '+'
   * @param {string} fn           Function name, for example 'add'
   * @param {Node[]} args         Operator arguments
   * @param {boolean} [implicit]  Is this an implicit multiplication?
   */
  function OperatorNode(op, fn, args, implicit) {
    if (!(this instanceof OperatorNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    //validate input
    if (typeof op !== 'string') {
      throw new TypeError('string expected for parameter "op"');
    }
    if (typeof fn !== 'string') {
      throw new TypeError('string expected for parameter "fn"');
    }
    if (!Array.isArray(args) || !args.every(type.isNode)) {
      throw new TypeError('Array containing Nodes expected for parameter "args"');
    }

    this.implicit = (implicit === true);
    this.op = op;
    this.fn = fn;
    this.args = args || [];
  }

  OperatorNode.prototype = new Node();

  OperatorNode.prototype.type = 'OperatorNode';

  OperatorNode.prototype.isOperatorNode = true;

  /**
   * Compile the node to javascript code
   * @param {OperatorNode} node The node to be compiled
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  function compileOperatorNode(node, defs, args) {
    if (!(node instanceof OperatorNode)) {
      throw new TypeError('No valid OperatorNode')
    }

    // validate fn
    if (typeof node.fn !== 'string' || !isSafeMethod(defs.math, node.fn)) {
      if (!defs.math[node.fn]) {
        throw new Error('Function ' + node.fn + ' missing in provided namespace "math"');
      }
      else {
        throw new Error('No access to function "' + node.fn + '"');
      }
    }

    var jsArgs = map(node.args, function (arg) {
      return compile(arg, defs, args);
    });

    return 'math[' + stringify(node.fn) + '](' + join(jsArgs, ', ') + ')';
  }

  // register the compile function
  register(OperatorNode.prototype.type, compileOperatorNode);

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  OperatorNode.prototype.forEach = function (callback) {
    for (var i = 0; i < this.args.length; i++) {
      callback(this.args[i], 'args[' + i + ']', this);
    }
  };

  /**
   * Create a new OperatorNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {OperatorNode} Returns a transformed copy of the node
   */
  OperatorNode.prototype.map = function (callback) {
    var args = [];
    for (var i = 0; i < this.args.length; i++) {
      args[i] = this._ifNode(callback(this.args[i], 'args[' + i + ']', this));
    }
    return new OperatorNode(this.op, this.fn, args, this.implicit);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {OperatorNode}
   */
  OperatorNode.prototype.clone = function () {
    return new OperatorNode(this.op, this.fn, this.args.slice(0), this.implicit);
  };

  /**
   * Calculate which parentheses are necessary. Gets an OperatorNode
   * (which is the root of the tree) and an Array of Nodes
   * (this.args) and returns an array where 'true' means that an argument
   * has to be enclosed in parentheses whereas 'false' means the opposite.
   *
   * @param {OperatorNode} root
   * @param {string} parenthesis
   * @param {Node[]} args
   * @param {boolean} latex
   * @return {boolean[]}
   * @private
   */
  function calculateNecessaryParentheses(root, parenthesis, implicit, args, latex) {
    //precedence of the root OperatorNode
    var precedence = operators.getPrecedence(root, parenthesis);
    var associativity = operators.getAssociativity(root, parenthesis);

    if ((parenthesis === 'all') || ((args.length > 2) && (root.getIdentifier() !== 'OperatorNode:add') && (root.getIdentifier() !== 'OperatorNode:multiply'))) {
      var parens = args.map(function (arg) {
        switch (arg.getContent().type) { //Nodes that don't need extra parentheses
          case 'ArrayNode':
          case 'ConstantNode':
          case 'SymbolNode':
          case 'ParenthesisNode':
            return false;
            break;
          default:
            return true;
        }
      });
      return parens;
    }

    var result = undefined;
    switch (args.length) {
      case 0:
        result = [];
        break;

      case 1: //unary operators
        //precedence of the operand
        var operandPrecedence = operators.getPrecedence(args[0], parenthesis);

        //handle special cases for LaTeX, where some of the parentheses aren't needed
        if (latex && (operandPrecedence !== null)) {
          var operandIdentifier;
          var rootIdentifier;
          if (parenthesis === 'keep') {
            operandIdentifier = args[0].getIdentifier();
            rootIdentifier = root.getIdentifier();
          }
          else {
            //Ignore Parenthesis Nodes when not in 'keep' mode
            operandIdentifier = args[0].getContent().getIdentifier();
            rootIdentifier = root.getContent().getIdentifier();
          }
          if (operators.properties[precedence][rootIdentifier].latexLeftParens === false) {
            result = [false];
            break;
          }

          if (operators.properties[operandPrecedence][operandIdentifier].latexParens === false) {
            result = [false];
            break;
          }
        }

        if (operandPrecedence === null) {
          //if the operand has no defined precedence, no parens are needed
          result = [false];
          break;
        }

        if (operandPrecedence <= precedence) {
          //if the operands precedence is lower, parens are needed
          result = [true];
          break;
        }

        //otherwise, no parens needed
        result = [false];
        break;

      case 2: //binary operators
        var lhsParens; //left hand side needs parenthesis?
        //precedence of the left hand side
        var lhsPrecedence = operators.getPrecedence(args[0], parenthesis);
        //is the root node associative with the left hand side
        var assocWithLhs = operators.isAssociativeWith(root, args[0], parenthesis);

        if (lhsPrecedence === null) {
          //if the left hand side has no defined precedence, no parens are needed
          //FunctionNode for example
          lhsParens = false;
        }
        else if ((lhsPrecedence === precedence) && (associativity === 'right') && !assocWithLhs) {
          //In case of equal precedence, if the root node is left associative
          // parens are **never** necessary for the left hand side.
          //If it is right associative however, parens are necessary
          //if the root node isn't associative with the left hand side
          lhsParens = true;
        }
        else if (lhsPrecedence < precedence) {
          lhsParens = true;
        }
        else {
          lhsParens = false;
        }

        var rhsParens; //right hand side needs parenthesis?
        //precedence of the right hand side
        var rhsPrecedence = operators.getPrecedence(args[1], parenthesis);
        //is the root node associative with the right hand side?
        var assocWithRhs = operators.isAssociativeWith(root, args[1], parenthesis);

        if (rhsPrecedence === null) {
          //if the right hand side has no defined precedence, no parens are needed
          //FunctionNode for example
          rhsParens = false;
        }
        else if ((rhsPrecedence === precedence) && (associativity === 'left') && !assocWithRhs) {
          //In case of equal precedence, if the root node is right associative
          // parens are **never** necessary for the right hand side.
          //If it is left associative however, parens are necessary
          //if the root node isn't associative with the right hand side
          rhsParens = true;
        }
        else if (rhsPrecedence < precedence) {
          rhsParens = true;
        }
        else {
          rhsParens = false;
        }

        //handle special cases for LaTeX, where some of the parentheses aren't needed
        if (latex) {
          var rootIdentifier;
          var lhsIdentifier;
          var rhsIdentifier;
          if (parenthesis === 'keep') {
            rootIdentifier = root.getIdentifier();
            lhsIdentifier = root.args[0].getIdentifier();
            rhsIdentifier = root.args[1].getIdentifier();
          }
          else {
            //Ignore ParenthesisNodes when not in 'keep' mode
            rootIdentifier = root.getContent().getIdentifier();
            lhsIdentifier = root.args[0].getContent().getIdentifier();
            rhsIdentifier = root.args[1].getContent().getIdentifier();
          }

          if (lhsPrecedence !== null) {
            if (operators.properties[precedence][rootIdentifier].latexLeftParens === false) {
              lhsParens = false;
            }

            if (operators.properties[lhsPrecedence][lhsIdentifier].latexParens === false) {
              lhsParens = false;
            }
          }

          if (rhsPrecedence !== null) {
            if (operators.properties[precedence][rootIdentifier].latexRightParens === false) {
              rhsParens = false;
            }

            if (operators.properties[rhsPrecedence][rhsIdentifier].latexParens === false) {
              rhsParens = false;
            }
          }
        }

        result = [lhsParens, rhsParens];
        break;

      default:
        if ((root.getIdentifier() === 'OperatorNode:add') || (root.getIdentifier() === 'OperatorNode:multiply')) {
          var result = args.map(function (arg) {
            var argPrecedence = operators.getPrecedence(arg, parenthesis);
            var assocWithArg = operators.isAssociativeWith(root, arg, parenthesis);
            var argAssociativity = operators.getAssociativity(arg, parenthesis);
            if (argPrecedence === null) {
              //if the argument has no defined precedence, no parens are needed
              return false;
            } else if ((precedence === argPrecedence) && (associativity === argAssociativity) && !assocWithArg) {
              return true;
            } else if (argPrecedence < precedence) {
              return true;
            }

            return false;
          });
        }
        break;
    }

    //handles an edge case of 'auto' parentheses with implicit multiplication of ConstantNode
    //In that case print parentheses for ParenthesisNodes even though they normally wouldn't be
    //printed.
    if ((args.length >= 2) && (root.getIdentifier() === 'OperatorNode:multiply') && root.implicit && (parenthesis === 'auto') && (implicit === 'hide')) {
      result = args.map(function (arg, index) {
        var isParenthesisNode = (arg.getIdentifier() === 'ParenthesisNode');
        if (result[index] || isParenthesisNode) { //put in parenthesis?
          return true;
        }

        return false;
      });
    }

    return result;
  }

  /**
   * Get string representation.
   * @param {Object} options
   * @return {string} str
   */
  OperatorNode.prototype._toString = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var implicit = (options && options.implicit) ? options.implicit : 'hide';
    var args = this.args;
    var parens = calculateNecessaryParentheses(this, parenthesis, implicit, args, false);

    if (args.length === 1) { //unary operators
      var assoc = operators.getAssociativity(this, parenthesis);

      var operand = args[0].toString(options);
      if (parens[0]) {
        operand = '(' + operand + ')';
      }

      if (assoc === 'right') { //prefix operator
        return this.op + operand;
      }
      else if (assoc === 'left') { //postfix
        return operand + this.op;
      }

      //fall back to postfix
      return operand + this.op;
    } else if (args.length == 2) {
      var lhs = args[0].toString(options); //left hand side
      var rhs = args[1].toString(options); //right hand side
      if (parens[0]) { //left hand side in parenthesis?
        lhs = '(' + lhs + ')';
      }
      if (parens[1]) { //right hand side in parenthesis?
        rhs = '(' + rhs + ')';
      }

      if (this.implicit && (this.getIdentifier() === 'OperatorNode:multiply') && (implicit == 'hide')) {
        return lhs + ' ' + rhs;
      }

      return lhs + ' ' + this.op + ' ' + rhs;
    } else if ((args.length > 2) && ((this.getIdentifier() === 'OperatorNode:add') || (this.getIdentifier() === 'OperatorNode:multiply'))) {
      var stringifiedArgs = args.map(function (arg, index) {
        arg = arg.toString(options);
        if (parens[index]) { //put in parenthesis?
          arg = '(' + arg + ')';
        }

        return arg;
      });

      if (this.implicit && (this.getIdentifier() === 'OperatorNode:multiply') && (implicit === 'hide')) {
        return stringifiedArgs.join(' ');
      }

      return stringifiedArgs.join(' ' + this.op + ' ');
    } else {
      //fallback to formatting as a function call
      return this.fn + '(' + this.args.join(', ') + ')';
    }
  };

  /**
   * Get HTML representation.
   * @param {Object} options
   * @return {string} str
   */
  OperatorNode.prototype.toHTML = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var implicit = (options && options.implicit) ? options.implicit : 'hide';
    var args = this.args;
    var parens = calculateNecessaryParentheses(this, parenthesis, implicit, args, false);

    if (args.length === 1) { //unary operators
      var assoc = operators.getAssociativity(this, parenthesis);

      var operand = args[0].toHTML(options);
      if (parens[0]) {
        operand = '<span class="math-parenthesis math-round-parenthesis">(</span>' + operand + '<span class="math-parenthesis math-round-parenthesis">)</span>';
      }

      if (assoc === 'right') { //prefix operator
        return '<span class="math-operator math-unary-operator math-lefthand-unary-operator">' + escape(this.op) + '</span>' + operand;
      }
      else if (assoc === 'left') { //postfix
        return '<span class="math-operator math-unary-operator math-righthand-unary-operator">' + escape(this.op) + '</span>' + operand;
      }

      //fall back to postfix
      return '<span class="math-operator math-unary-operator math-righthand-unary-operator">' + escape(this.op) + '</span>' + operand;
    }
	else if (args.length == 2) { // binary operatoes
      var lhs = args[0].toHTML(options); //left hand side
      var rhs = args[1].toHTML(options); //right hand side
      if (parens[0]) { //left hand side in parenthesis?
        lhs = '<span class="math-parenthesis math-round-parenthesis">(</span>' + lhs + '<span class="math-parenthesis math-round-parenthesis">)</span>';
      }
      if (parens[1]) { //right hand side in parenthesis?
        rhs = '<span class="math-parenthesis math-round-parenthesis">(</span>' + rhs + '<span class="math-parenthesis math-round-parenthesis">)</span>';
      }
	  
	  if (this.implicit && (this.getIdentifier() === 'OperatorNode:multiply') && (implicit == 'hide')) {
	    return lhs + '<span class="math-operator math-binary-operator math-implicit-binary-operator"></span>' + rhs;
	  }
      
	  return lhs + '<span class="math-operator math-binary-operator math-explicit-binary-operator">' + escape(this.op) + '</span>' + rhs;
    }
	else if ((args.length > 2) && ((this.getIdentifier() === 'OperatorNode:add') || (this.getIdentifier() === 'OperatorNode:multiply'))) {
      var stringifiedArgs = args.map(function (arg, index) {
        arg = arg.toHTML(options);
        if (parens[index]) { //put in parenthesis?
          arg = '<span class="math-parenthesis math-round-parenthesis">(</span>' + arg + '<span class="math-parenthesis math-round-parenthesis">)</span>';
        }

        return arg;
      });

      if (this.implicit && (this.getIdentifier() === 'OperatorNode:multiply') && (implicit === 'hide')) {
        return stringifiedArgs.join('<span class="math-operator math-binary-operator math-implicit-binary-operator"></span>');
      }

      return stringifiedArgs.join('<span class="math-operator math-binary-operator math-explicit-binary-operator">' + escape(this.op) + '</span>');
    } else {
      //fallback to formatting as a function call
      return '<span class="math-function">' + escape(this.fn) + '</span><span class="math-paranthesis math-round-parenthesis">(</span>' + stringifiedArgs.join('<span class="math-separator">,</span>') + '<span class="math-paranthesis math-round-parenthesis">)</span>';
    }
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  OperatorNode.prototype._toTex = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var implicit = (options && options.implicit) ? options.implicit : 'hide';
    var args = this.args;
    var parens = calculateNecessaryParentheses(this, parenthesis, implicit, args, true);
    var op = latex.operators[this.fn];
    op = typeof op === 'undefined' ? this.op : op; //fall back to using this.op

    if (args.length === 1) { //unary operators
      var assoc = operators.getAssociativity(this, parenthesis);

      var operand = args[0].toTex(options);
      if (parens[0]) {
        operand = '\\left(' + operand + '\\right)';
      }

      if (assoc === 'right') { //prefix operator
        return op + operand;
      }
      else if (assoc === 'left') { //postfix operator
        return operand + op;
      }

      //fall back to postfix
      return operand + op;
    } else if (args.length === 2) { //binary operators
      var lhs = args[0]; //left hand side
      var lhsTex = lhs.toTex(options);
      if (parens[0]) {
        lhsTex = '\\left(' + lhsTex + '\\right)';
      }

      var rhs = args[1]; //right hand side
      var rhsTex = rhs.toTex(options);
      if (parens[1]) {
        rhsTex = '\\left(' + rhsTex + '\\right)';
      }

      //handle some exceptions (due to the way LaTeX works)
      var lhsIdentifier;
      if (parenthesis === 'keep') {
        lhsIdentifier = lhs.getIdentifier();
      }
      else {
        //Ignore ParenthesisNodes if in 'keep' mode
        lhsIdentifier = lhs.getContent().getIdentifier();
      }
      switch (this.getIdentifier()) {
        case 'OperatorNode:divide':
          //op contains '\\frac' at this point
          return op + '{' + lhsTex + '}' + '{' + rhsTex + '}';
        case 'OperatorNode:pow':
          lhsTex = '{' + lhsTex + '}';
          rhsTex = '{' + rhsTex + '}';
          switch (lhsIdentifier) {
            case 'ConditionalNode': //
            case 'OperatorNode:divide':
              lhsTex = '\\left(' + lhsTex + '\\right)';
          }
        case 'OperatorNode:multiply':
          if (this.implicit && (implicit === 'hide')) {
            return lhsTex + '~' + rhsTex;
          }
      }
      return lhsTex + op + rhsTex;
    } else if ((args.length > 2) && ((this.getIdentifier() === 'OperatorNode:add') || (this.getIdentifier() === 'OperatorNode:multiply'))) {
      var texifiedArgs = args.map(function (arg, index) {
        arg = arg.toTex(options);
        if (parens[index]) {
          arg = '\\left(' + arg + '\\right)';
        }
        return arg;
      });

      if ((this.getIdentifier() === 'OperatorNode:multiply') && this.implicit) {
        return texifiedArgs.join('~');
      }

      return texifiedArgs.join(op)
    } else {
      //fall back to formatting as a function call
      //as this is a fallback, it doesn't use
      //fancy function names
      return '\\mathrm{' + this.fn + '}\\left('
          + args.map(function (arg) {
            return arg.toTex(options);
          }).join(',') + '\\right)';
    }
  };

  /**
   * Get identifier.
   * @return {string}
   */
  OperatorNode.prototype.getIdentifier = function () {
    return this.type + ':' + this.fn;
  };

  return OperatorNode;
}

exports.name = 'OperatorNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../../utils/array":41,"../../utils/customs":45,"../../utils/latex":46,"../../utils/string":49,"../operators":29,"./ConstantNode":15,"./FunctionNode":17,"./Node":19,"./SymbolNode":24,"./compile":25}],22:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {
  var register = load(require('./compile')).register;
  var compile = load(require('./compile')).compile;
  var Node = load(require('./Node'));

  /**
   * @constructor ParenthesisNode
   * @extends {Node}
   * A parenthesis node describes manual parenthesis from the user input
   * @param {Node} content
   * @extends {Node}
   */
  function ParenthesisNode(content) {
    if (!(this instanceof ParenthesisNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate input
    if (!type.isNode(content)) {
      throw new TypeError('Node expected for parameter "content"');
    }

    this.content = content;
  }

  ParenthesisNode.prototype = new Node();

  ParenthesisNode.prototype.type = 'ParenthesisNode';

  ParenthesisNode.prototype.isParenthesisNode = true;

  /**
   * Compile the node to javascript code
   * @param {ParenthesisNode} node The node to be compiled
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  function compileParenthesisNode(node, defs, args) {
    if (!(node instanceof ParenthesisNode)) {
      throw new TypeError('No valid ParenthesisNode')
    }

    return compile(node.content, defs, args);
  }

  // register the compile function
  register(ParenthesisNode.prototype.type, compileParenthesisNode);

  /**
   * Get the content of the current Node.
   * @return {Node} content
   * @override
   **/
  ParenthesisNode.prototype.getContent = function () {
    return this.content.getContent();
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  ParenthesisNode.prototype.forEach = function (callback) {
    callback(this.content, 'content', this);
  };

  /**
   * Create a new ParenthesisNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node) : Node} callback
   * @returns {ParenthesisNode} Returns a clone of the node
   */
  ParenthesisNode.prototype.map = function (callback) {
    var content = callback(this.content, 'content', this);
    return new ParenthesisNode(content);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {ParenthesisNode}
   */
  ParenthesisNode.prototype.clone = function() {
    return new ParenthesisNode(this.content);
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  ParenthesisNode.prototype._toString = function(options) {
    if ((!options) || (options && !options.parenthesis) || (options && options.parenthesis === 'keep')) {
      return '(' + this.content.toString(options) + ')';
    }
    return this.content.toString(options);
  };

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  ParenthesisNode.prototype.toHTML = function(options) {
    if ((!options) || (options && !options.parenthesis) || (options && options.parenthesis === 'keep')) {
      return '<span class="math-parenthesis math-round-parenthesis">(</span>' + this.content.toHTML(options) + '<span class="math-parenthesis math-round-parenthesis">)</span>';
    }
    return this.content.toHTML(options);
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  ParenthesisNode.prototype._toTex = function(options) {
    if ((!options) || (options && !options.parenthesis) || (options && options.parenthesis === 'keep')) {
      return '\\left(' + this.content.toTex(options) + '\\right)';
    }
    return this.content.toTex(options);
  };

  return ParenthesisNode;
}

exports.name = 'ParenthesisNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"./Node":19,"./compile":25}],23:[function(require,module,exports){
'use strict';

var operators = require('../operators');

function factory (type, config, load, typed) {
  var register = load(require('./compile')).register;
  var compile = load(require('./compile')).compile;
  var Node = load(require('./Node'));

  /**
   * @constructor RangeNode
   * @extends {Node}
   * create a range
   * @param {Node} start  included lower-bound
   * @param {Node} end    included upper-bound
   * @param {Node} [step] optional step
   */
  function RangeNode(start, end, step) {
    if (!(this instanceof RangeNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate inputs
    if (!type.isNode(start)) throw new TypeError('Node expected');
    if (!type.isNode(end)) throw new TypeError('Node expected');
    if (step && !type.isNode(step)) throw new TypeError('Node expected');
    if (arguments.length > 3) throw new Error('Too many arguments');

    this.start = start;         // included lower-bound
    this.end = end;           // included upper-bound
    this.step = step || null;  // optional step
  }

  RangeNode.prototype = new Node();

  RangeNode.prototype.type = 'RangeNode';

  RangeNode.prototype.isRangeNode = true;

  /**
   * Check whether the RangeNode needs the `end` symbol to be defined.
   * This end is the size of the Matrix in current dimension.
   * @return {boolean}
   */
  RangeNode.prototype.needsEnd = function () {
    // find all `end` symbols in this RangeNode
    var endSymbols = this.filter(function (node) {
      return type.isSymbolNode(node) && (node.name === 'end');
    });

    return endSymbols.length > 0;
  };

  /**
   * Compile the node to javascript code
   *
   * When the range has a symbol `end` defined, the RangeNode requires
   * a variable `end` to be defined in the current closure, which must contain
   * the length of the of the matrix that's being handled in the range's
   * dimension. To check whether the `end` variable is needed, call
   * RangeNode.needsEnd().
   *
   * @param {RangeNode} node  The node to be compiled
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  function compileRangeNode(node, defs, args) {
    if (!(node instanceof RangeNode)) {
      throw new TypeError('No valid RangeNode')
    }

    return 'math.range(' +
        compile(node.start, defs, args) + ', ' +
        compile(node.end, defs, args) +
        (node.step ? (', ' + compile(node.step, defs, args)) : '') +
        ')';
  }

  // register the compile function
  register(RangeNode.prototype.type, compileRangeNode);

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  RangeNode.prototype.forEach = function (callback) {
    callback(this.start, 'start', this);
    callback(this.end, 'end', this);
    if (this.step) {
      callback(this.step, 'step', this);
    }
  };

  /**
   * Create a new RangeNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {RangeNode} Returns a transformed copy of the node
   */
  RangeNode.prototype.map = function (callback) {
    return new RangeNode(
        this._ifNode(callback(this.start, 'start', this)),
        this._ifNode(callback(this.end, 'end', this)),
        this.step && this._ifNode(callback(this.step, 'step', this))
    );
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {RangeNode}
   */
  RangeNode.prototype.clone = function () {
    return new RangeNode(this.start, this.end, this.step && this.step);
  };

  /**
   * Calculate the necessary parentheses
   * @param {Node} node
   * @param {string} parenthesis
   * @return {Object} parentheses
   * @private
   */
  function calculateNecessaryParentheses(node, parenthesis) {
    var precedence = operators.getPrecedence(node, parenthesis);
    var parens = {};

    var startPrecedence = operators.getPrecedence(node.start, parenthesis);
    parens.start = ((startPrecedence !== null) && (startPrecedence <= precedence))
      || (parenthesis === 'all');

    if (node.step) {
      var stepPrecedence = operators.getPrecedence(node.step, parenthesis);
      parens.step = ((stepPrecedence !== null) && (stepPrecedence <= precedence))
        || (parenthesis === 'all');
    }

    var endPrecedence = operators.getPrecedence(node.end, parenthesis);
    parens.end = ((endPrecedence !== null) && (endPrecedence <= precedence))
      || (parenthesis === 'all');

    return parens;
  }

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   */
  RangeNode.prototype._toString = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var parens = calculateNecessaryParentheses(this, parenthesis);

    //format string as start:step:stop
    var str;

    var start = this.start.toString(options);
    if (parens.start) {
      start = '(' + start + ')';
    }
    str = start;

    if (this.step) {
      var step = this.step.toString(options);
      if (parens.step) {
        step = '(' + step + ')';
      }
      str += ':' + step;
    }

    var end = this.end.toString(options);
    if (parens.end) {
      end = '(' + end + ')';
    }
    str += ':' + end;

    return str;
  };

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string} str
   */
  RangeNode.prototype.toHTML = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var parens = calculateNecessaryParentheses(this, parenthesis);

    //format string as start:step:stop
    var str;

    var start = this.start.toHTML(options);
    if (parens.start) {
      start = '<span class="math-parenthesis math-round-parenthesis">(</span>' + start + '<span class="math-parenthesis math-round-parenthesis">)</span>';
    }
    str = start;

    if (this.step) {
      var step = this.step.toHTML(options);
      if (parens.step) {
        step = '<span class="math-parenthesis math-round-parenthesis">(</span>' + step + '<span class="math-parenthesis math-round-parenthesis">)</span>';
      }
      str += '<span class="math-operator math-range-operator">:</span>' + step;
    }

    var end = this.end.toHTML(options);
    if (parens.end) {
      end = '<span class="math-parenthesis math-round-parenthesis">(</span>' + end + '<span class="math-parenthesis math-round-parenthesis">)</span>';
    }
    str += '<span class="math-operator math-range-operator">:</span>' + end;

    return str;
  };

  /**
   * Get LaTeX representation
   * @params {Object} options
   * @return {string} str
   */
  RangeNode.prototype._toTex = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var parens = calculateNecessaryParentheses(this, parenthesis);

    var str = this.start.toTex(options);
    if (parens.start) {
      str = '\\left(' + str + '\\right)';
    }

    if (this.step) {
      var step = this.step.toTex(options);
      if (parens.step) {
        step = '\\left(' + step + '\\right)';
      }
      str += ':' + step;
    }

    var end = this.end.toTex(options);
    if (parens.end) {
      end = '\\left(' + end + '\\right)';
    }
    str += ':' + end;

    return str;
  };

  return RangeNode;
}

exports.name = 'RangeNode';
exports.path = 'expression.node';
exports.factory = factory;

},{"../operators":29,"./Node":19,"./compile":25}],24:[function(require,module,exports){
'use strict';

var latex = require('../../utils/latex');
var stringify = require('../../utils/string').stringify;
var escape = require('../../utils/string').escape;
var hasOwnProperty = require('../../utils/object').hasOwnProperty;
var getSafeProperty = require('../../utils/customs').getSafeProperty;

function factory (type, config, load, typed, math) {
  var register = load(require('./compile')).register;
  var compile = load(require('./compile')).compile;
  var Node = load(require('./Node'));

  /**
   * Check whether some name is a valueless unit like "inch".
   * @param {string} name
   * @return {boolean}
   */
  function isValuelessUnit (name) {
    return type.Unit ? type.Unit.isValuelessUnit(name) : false;
  }

  /**
   * @constructor SymbolNode
   * @extends {Node}
   * A symbol node can hold and resolve a symbol
   * @param {string} name
   * @extends {Node}
   */
  function SymbolNode(name) {
    if (!(this instanceof SymbolNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate input
    if (typeof name !== 'string')  throw new TypeError('String expected for parameter "name"');

    this.name = name;
  }

  SymbolNode.prototype = new Node();

  SymbolNode.prototype.type = 'SymbolNode';

  SymbolNode.prototype.isSymbolNode = true;

  /**
   * Compile the node to javascript code
   * @param {SymbolNode} node The node to be compiled
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  function compileSymbolNode(node, defs, args) {
    if (!(node instanceof SymbolNode)) {
      throw new TypeError('No valid SymbolNode')
    }

    // add a function to the definitions
    defs['undef'] = undef;
    defs['Unit'] = type.Unit;
    defs.getSafeProperty = getSafeProperty;
    defs.hasOwnProperty = hasOwnProperty;

    var jsName = stringify(node.name); // escaped node name inside double quotes

    if (hasOwnProperty(args, node.name)) {
      // this is a FunctionAssignment argument
      // (like an x when inside the expression of a function assignment `f(x) = ...`)
      return args[node.name];
    }
    else if (node.name in defs.math) {
      return '(' + jsName + ' in scope ' +
          '? getSafeProperty(scope, ' + jsName + ') ' +
          ': getSafeProperty(math, ' + jsName + '))';
    }
    else {
      return '(' +
          jsName + ' in scope ' +
          '? getSafeProperty(scope, ' + jsName + ') ' +
          ': ' + (isValuelessUnit(node.name)
              ? 'new Unit(null, ' + jsName + ')'
              : 'undef(' + jsName + ')') +
          ')';
    }
  }

  // register the compile function
  register(SymbolNode.prototype.type, compileSymbolNode);

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  SymbolNode.prototype.forEach = function (callback) {
    // nothing to do, we don't have childs
  };

  /**
   * Create a new SymbolNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node) : Node} callback
   * @returns {SymbolNode} Returns a clone of the node
   */
  SymbolNode.prototype.map = function (callback) {
    return this.clone();
  };

  /**
   * Throws an error 'Undefined symbol {name}'
   * @param {string} name
   */
  function undef (name) {
    throw new Error('Undefined symbol ' + name);
  }

  /**
   * Create a clone of this node, a shallow copy
   * @return {SymbolNode}
   */
  SymbolNode.prototype.clone = function() {
    return new SymbolNode(this.name);
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  SymbolNode.prototype._toString = function(options) {
    return this.name;
  };

  /**
   * Get HTML representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  SymbolNode.prototype.toHTML = function(options) {
	var name = escape(this.name);
	
    if (name == "true" || name == "false") {
	  return '<span class="math-symbol math-boolean">' + name + '</span>';
	}
	else if (name == "i") {
	  return '<span class="math-symbol math-imaginary-symbol">' + name + '</span>';
	}
	else if (name == "Infinity") {
	  return '<span class="math-symbol math-infinity-symbol">' + name + '</span>';
	}
	else if (name == "NaN") {
	  return '<span class="math-symbol math-nan-symbol">' + name + '</span>';
	}
	else if (name == "null") {
	  return '<span class="math-symbol math-null-symbol">' + name + '</span>';
	}
	else if (name == "uninitialized") {
	  return '<span class="math-symbol math-uninitialized-symbol">' + name + '</span>';
	}
	
	return '<span class="math-symbol">' + name + '</span>';
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   * @override
   */
  SymbolNode.prototype._toTex = function(options) {
    var isUnit = false;
    if ((typeof math[this.name] === 'undefined') && isValuelessUnit(this.name)) {
      isUnit = true;
    }
    var symbol = latex.toSymbol(this.name, isUnit);
    if (symbol[0] === '\\') {
      //no space needed if the symbol starts with '\'
      return symbol;
    }
    //the space prevents symbols from breaking stuff like '\cdot' if it's written right before the symbol
    return ' ' + symbol;
  };

  return SymbolNode;
}

exports.name = 'SymbolNode';
exports.path = 'expression.node';
exports.math = true; // request access to the math namespace as 5th argument of the factory function
exports.factory = factory;

},{"../../utils/customs":45,"../../utils/latex":46,"../../utils/object":48,"../../utils/string":49,"./Node":19,"./compile":25}],25:[function(require,module,exports){
// the compile functions which compile a Node into JavaScript are not
// exposed as class methods for security reasons to prevent being able to
// override them or create fake Nodes. Instead, only compile functions of
// registered nodes can be executed

var hasOwnProperty = require('../../utils/object').hasOwnProperty;

function factory () {
  // map with node type as key and compile functions as value
  var compileFunctions = {}

  /**
   * Register a compile function for a node
   * @param {string} type
   * @param {function} compileFunction
   *                      The compile function, invoked as
   *                      compileFunction(node, defs, args)
   */
  function register(type, compileFunction) {
    if (compileFunctions[type] === undefined) {
      compileFunctions[type] = compileFunction;
    }
    else {
      throw new Error('Cannot register type "' + type + '": already exists');
    }
  }

  /**
   * Compile a Node into JavaScript
   * @param {Node} node
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} Returns JavaScript code
   */
  function compile (node, defs, args) {
    if (hasOwnProperty(compileFunctions, node.type)) {
      var compileFunction = compileFunctions[node.type];
      return compileFunction(node, defs, args);
    }
    else if (typeof node._compile === 'function' &&
        !hasOwnProperty(node, '_compile')) {
      // Compatibility for CustomNodes
      // TODO: this is a security risk, change it such that you have to register CustomNodes separately in math.js, like math.expression.node.register(MyCustomNode)
      return node._compile(defs, args);
    }
    else {
      throw new Error('Cannot compile node: unknown type "' + node.type + '"');
    }
  }

  return {
    register: register,
    compile: compile
  }
}

exports.factory = factory;

},{"../../utils/object":48}],26:[function(require,module,exports){
'use strict';

var errorTransform = require('../../transform/error.transform').transform;
var getSafeProperty = require('../../../utils/customs').getSafeProperty;

function factory (type, config, load, typed) {
  var subset = load(require('../../../function/matrix/subset'));

  /**
   * Retrieve part of an object:
   *
   * - Retrieve a property from an object
   * - Retrieve a part of a string
   * - Retrieve a matrix subset
   *
   * @param {Object | Array | Matrix | string} object
   * @param {Index} index
   * @return {Object | Array | Matrix | string} Returns the subset
   */
  return function access(object, index) {
    try {
      if (Array.isArray(object)) {
        return subset(object, index);
      }
      else if (object && typeof object.subset === 'function') { // Matrix
        return object.subset(index);
      }
      else if (typeof object === 'string') {
        // TODO: move getStringSubset into a separate util file, use that
        return subset(object, index);
      }
      else if (typeof object === 'object') {
        if (!index.isObjectProperty()) {
          throw new TypeError('Cannot apply a numeric index as object property');
        }

        return getSafeProperty(object, index.getObjectProperty());
      }
      else {
        throw new TypeError('Cannot apply index: unsupported type of object');
      }
    }
    catch (err) {
      throw errorTransform(err);
    }
  }
}

exports.factory = factory;

},{"../../../function/matrix/subset":37,"../../../utils/customs":45,"../../transform/error.transform":31}],27:[function(require,module,exports){
'use strict';

var errorTransform = require('../../transform/error.transform').transform;
var setSafeProperty = require('../../../utils/customs').setSafeProperty;

function factory (type, config, load, typed) {
  var subset = load(require('../../../function/matrix/subset'));
  var matrix = load(require('../../../type/matrix/function/matrix'));

  /**
   * Replace part of an object:
   *
   * - Assign a property to an object
   * - Replace a part of a string
   * - Replace a matrix subset
   *
   * @param {Object | Array | Matrix | string} object
   * @param {Index} index
   * @param {*} value
   * @return {Object | Array | Matrix | string} Returns the original object
   *                                            except in case of a string
   */
  // TODO: change assign to return the value instead of the object
  return function assign(object, index, value) {
    try {
      if (Array.isArray(object)) {
        return matrix(object).subset(index, value).valueOf();
      }
      else if (object && typeof object.subset === 'function') { // Matrix
        return object.subset(index, value);
      }
      else if (typeof object === 'string') {
        // TODO: move setStringSubset into a separate util file, use that
        return subset(object, index, value);
      }
      else if (typeof object === 'object') {
        if (!index.isObjectProperty()) {
          throw TypeError('Cannot apply a numeric index as object property');
        }
        setSafeProperty(object, index.getObjectProperty(), value);
        return object;
      }
      else {
        throw new TypeError('Cannot apply index: unsupported type of object');
      }
    }
    catch (err) {
        throw errorTransform(err);
    }
  }
}

exports.factory = factory;

},{"../../../function/matrix/subset":37,"../../../type/matrix/function/matrix":39,"../../../utils/customs":45,"../../transform/error.transform":31}],28:[function(require,module,exports){
/**
 * Get a unique name for an argument name to store in defs
 * @param {Object} defs
 * @return {string} A string like 'arg1', 'arg2', ...
 * @private
 */
function getUniqueArgumentName (defs) {
  return 'arg' + Object.keys(defs).length
}

module.exports = getUniqueArgumentName;

},{}],29:[function(require,module,exports){
'use strict'

//list of identifiers of nodes in order of their precedence
//also contains information about left/right associativity
//and which other operator the operator is associative with
//Example:
// addition is associative with addition and subtraction, because:
// (a+b)+c=a+(b+c)
// (a+b)-c=a+(b-c)
//
// postfix operators are left associative, prefix operators 
// are right associative
//
//It's also possible to set the following properties:
// latexParens: if set to false, this node doesn't need to be enclosed
//              in parentheses when using LaTeX
// latexLeftParens: if set to false, this !OperatorNode's! 
//                  left argument doesn't need to be enclosed
//                  in parentheses
// latexRightParens: the same for the right argument
var properties = [
  { //assignment
    'AssignmentNode': {},
    'FunctionAssignmentNode': {}
  },
  { //conditional expression
    'ConditionalNode': {
      latexLeftParens: false,
      latexRightParens: false,
      latexParens: false
      //conditionals don't need parentheses in LaTeX because
      //they are 2 dimensional
    }
  },
  { //logical or
    'OperatorNode:or': {
      associativity: 'left',
      associativeWith: []
    }

  },
  { //logical xor
    'OperatorNode:xor': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //logical and
    'OperatorNode:and': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //bitwise or
    'OperatorNode:bitOr': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //bitwise xor
    'OperatorNode:bitXor': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //bitwise and
    'OperatorNode:bitAnd': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //relational operators
    'OperatorNode:equal': {
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:unequal': {
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:smaller': {
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:larger': {
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:smallerEq': {
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:largerEq': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //bitshift operators
    'OperatorNode:leftShift': {
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:rightArithShift': {
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:rightLogShift': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //unit conversion
    'OperatorNode:to': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //range
    'RangeNode': {}
  },
  { //addition, subtraction
    'OperatorNode:add': {
      associativity: 'left',
      associativeWith: ['OperatorNode:add', 'OperatorNode:subtract']
    },
    'OperatorNode:subtract': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //multiply, divide, modulus
    'OperatorNode:multiply': {
      associativity: 'left',
      associativeWith: [
        'OperatorNode:multiply',
        'OperatorNode:divide',
        'Operator:dotMultiply',
        'Operator:dotDivide'
      ]
    },
    'OperatorNode:divide': {
      associativity: 'left',
      associativeWith: [],
      latexLeftParens: false,
      latexRightParens: false,
      latexParens: false
      //fractions don't require parentheses because
      //they're 2 dimensional, so parens aren't needed
      //in LaTeX
    },
    'OperatorNode:dotMultiply': {
      associativity: 'left',
      associativeWith: [
        'OperatorNode:multiply',
        'OperatorNode:divide',
        'OperatorNode:dotMultiply',
        'OperatorNode:doDivide'
      ]
    },
    'OperatorNode:dotDivide': {
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:mod': {
      associativity: 'left',
      associativeWith: []
    }
  },
  { //unary prefix operators
    'OperatorNode:unaryPlus': {
      associativity: 'right'
    },
    'OperatorNode:unaryMinus': {
      associativity: 'right'
    },
    'OperatorNode:bitNot': {
      associativity: 'right'
    },
    'OperatorNode:not': {
      associativity: 'right'
    }
  },
  { //exponentiation
    'OperatorNode:pow': {
      associativity: 'right',
      associativeWith: [],
      latexRightParens: false
      //the exponent doesn't need parentheses in
      //LaTeX because it's 2 dimensional
      //(it's on top)
    },
    'OperatorNode:dotPow': {
      associativity: 'right',
      associativeWith: []
    }
  },
  { //factorial
    'OperatorNode:factorial': {
      associativity: 'left'
    }
  },
  { //matrix transpose
    'OperatorNode:transpose': {
      associativity: 'left'
    }
  }
];

/**
 * Get the precedence of a Node.
 * Higher number for higher precedence, starting with 0.
 * Returns null if the precedence is undefined.
 *
 * @param {Node}
 * @param {string} parenthesis
 * @return {number|null}
 */
function getPrecedence (_node, parenthesis) {
  var node = _node;
  if (parenthesis !== 'keep') {
    //ParenthesisNodes are only ignored when not in 'keep' mode
    node = _node.getContent();
  }
  var identifier = node.getIdentifier();
  for (var i = 0; i < properties.length; i++) {
    if (identifier in properties[i]) {
      return i;
    }
  }
  return null;
}

/**
 * Get the associativity of an operator (left or right).
 * Returns a string containing 'left' or 'right' or null if
 * the associativity is not defined.
 *
 * @param {Node}
 * @param {string} parenthesis
 * @return {string|null}
 * @throws {Error}
 */
function getAssociativity (_node, parenthesis) {
  var node = _node;
  if (parenthesis !== 'keep') {
    //ParenthesisNodes are only ignored when not in 'keep' mode
    node = _node.getContent();
  }
  var identifier = node.getIdentifier();
  var index = getPrecedence(node, parenthesis);
  if (index === null) {
    //node isn't in the list
    return null;
  }
  var property = properties[index][identifier];

  if (property.hasOwnProperty('associativity')) {
    if (property.associativity === 'left') {
      return 'left';
    }
    if (property.associativity === 'right') {
      return 'right';
    }
    //associativity is invalid
    throw Error('\'' + identifier + '\' has the invalid associativity \''
                + property.associativity + '\'.');
  }

  //associativity is undefined
  return null;
}

/**
 * Check if an operator is associative with another operator.
 * Returns either true or false or null if not defined.
 *
 * @param {Node} nodeA
 * @param {Node} nodeB
 * @param {string} parenthesis
 * @return {bool|null}
 */
function isAssociativeWith (nodeA, nodeB, parenthesis) {
  var a = nodeA;
  var b = nodeB;
  if (parenthesis !== 'keep') {
    //ParenthesisNodes are only ignored when not in 'keep' mode
    var a = nodeA.getContent();
    var b = nodeB.getContent();
  }
  var identifierA = a.getIdentifier();
  var identifierB = b.getIdentifier();
  var index = getPrecedence(a, parenthesis);
  if (index === null) {
    //node isn't in the list
    return null;
  }
  var property = properties[index][identifierA];

  if (property.hasOwnProperty('associativeWith')
      && (property.associativeWith instanceof Array)) {
    for (var i = 0; i < property.associativeWith.length; i++) {
      if (property.associativeWith[i] === identifierB) {
        return true;
      }
    }
    return false;
  }

  //associativeWith is not defined
  return null;
}

module.exports.properties = properties;
module.exports.getPrecedence = getPrecedence;
module.exports.getAssociativity = getAssociativity;
module.exports.isAssociativeWith = isAssociativeWith;

},{}],30:[function(require,module,exports){
'use strict';

var ArgumentsError = require('../error/ArgumentsError');
var deepMap = require('../utils/collection/deepMap');

function factory (type, config, load, typed) {
  var AccessorNode            = load(require('./node/AccessorNode'));
  var ArrayNode               = load(require('./node/ArrayNode'));
  var AssignmentNode          = load(require('./node/AssignmentNode'));
  var BlockNode               = load(require('./node/BlockNode'));
  var ConditionalNode         = load(require('./node/ConditionalNode'));
  var ConstantNode            = load(require('./node/ConstantNode'));
  var FunctionAssignmentNode  = load(require('./node/FunctionAssignmentNode'));
  var IndexNode               = load(require('./node/IndexNode'));
  var ObjectNode              = load(require('./node/ObjectNode'));
  var OperatorNode            = load(require('./node/OperatorNode'));
  var ParenthesisNode         = load(require('./node/ParenthesisNode'));
  var FunctionNode            = load(require('./node/FunctionNode'));
  var RangeNode               = load(require('./node/RangeNode'));
  var SymbolNode              = load(require('./node/SymbolNode'));


  /**
   * Parse an expression. Returns a node tree, which can be evaluated by
   * invoking node.eval();
   *
   * Syntax:
   *
   *     parse(expr)
   *     parse(expr, options)
   *     parse([expr1, expr2, expr3, ...])
   *     parse([expr1, expr2, expr3, ...], options)
   *
   * Example:
   *
   *     var node = parse('sqrt(3^2 + 4^2)');
   *     node.compile(math).eval(); // 5
   *
   *     var scope = {a:3, b:4}
   *     var node = parse('a * b'); // 12
   *     var code = node.compile(math);
   *     code.eval(scope); // 12
   *     scope.a = 5;
   *     code.eval(scope); // 20
   *
   *     var nodes = math.parse(['a = 3', 'b = 4', 'a * b']);
   *     nodes[2].compile(math).eval(); // 12
   *
   * @param {string | string[] | Matrix} expr
   * @param {{nodes: Object<string, Node>}} [options]  Available options:
   *                                                   - `nodes` a set of custom nodes
   * @return {Node | Node[]} node
   * @throws {Error}
   */
  function parse (expr, options) {
    if (arguments.length != 1 && arguments.length != 2) {
      throw new ArgumentsError('parse', arguments.length, 1, 2);
    }

    // pass extra nodes
    extra_nodes = (options && options.nodes) ? options.nodes : {};

    if (typeof expr === 'string') {
      // parse a single expression
      expression = expr;
      return parseStart();
    }
    else if (Array.isArray(expr) || expr instanceof type.Matrix) {
      // parse an array or matrix with expressions
      return deepMap(expr, function (elem) {
        if (typeof elem !== 'string') throw new TypeError('String expected');

        expression = elem;
        return parseStart();
      });
    }
    else {
      // oops
      throw new TypeError('String or matrix expected');
    }
  }

  // token types enumeration
  var TOKENTYPE = {
    NULL : 0,
    DELIMITER : 1,
    NUMBER : 2,
    SYMBOL : 3,
    UNKNOWN : 4
  };

  // map with all delimiters
  var DELIMITERS = {
    ',': true,
    '(': true,
    ')': true,
    '[': true,
    ']': true,
    '{': true,
    '}': true,
    '\"': true,
    ';': true,

    '+': true,
    '-': true,
    '*': true,
    '.*': true,
    '/': true,
    './': true,
    '%': true,
    '^': true,
    '.^': true,
    '~': true,
    '!': true,
    '&': true,
    '|': true,
    '^|': true,
    '\'': true,
    '=': true,
    ':': true,
    '?': true,

    '==': true,
    '!=': true,
    '<': true,
    '>': true,
    '<=': true,
    '>=': true,

    '<<': true,
    '>>': true,
    '>>>': true
  };

  // map with all named delimiters
  var NAMED_DELIMITERS = {
    'mod': true,
    'to': true,
    'in': true,
    'and': true,
    'xor': true,
    'or': true,
    'not': true
  };

  var extra_nodes = {};             // current extra nodes
  var expression = '';              // current expression
  var comment = '';                 // last parsed comment
  var index = 0;                    // current index in expr
  var c = '';                       // current token character in expr
  var token = '';                   // current token
  var token_type = TOKENTYPE.NULL;  // type of the token
  var nesting_level = 0;            // level of nesting inside parameters, used to ignore newline characters
  var conditional_level = null;     // when a conditional is being parsed, the level of the conditional is stored here

  /**
   * Get the first character from the expression.
   * The character is stored into the char c. If the end of the expression is
   * reached, the function puts an empty string in c.
   * @private
   */
  function first() {
    index = 0;
    c = expression.charAt(0);
    nesting_level = 0;
    conditional_level = null;
  }

  /**
   * Get the next character from the expression.
   * The character is stored into the char c. If the end of the expression is
   * reached, the function puts an empty string in c.
   * @private
   */
  function next() {
    index++;
    c = expression.charAt(index);
  }

  /**
   * Preview the previous character from the expression.
   * @return {string} cNext
   * @private
   */
  function prevPreview() {
    return expression.charAt(index - 1);
  }

  /**
   * Preview the next character from the expression.
   * @return {string} cNext
   * @private
   */
  function nextPreview() {
    return expression.charAt(index + 1);
  }

  /**
   * Preview the second next character from the expression.
   * @return {string} cNext
   * @private
   */
  function nextNextPreview() {
    return expression.charAt(index + 2);
  }

  /**
   * Get next token in the current string expr.
   * The token and token type are available as token and token_type
   * @private
   */
  function getToken() {
    token_type = TOKENTYPE.NULL;
    token = '';
    comment = '';

    // skip over whitespaces
    // space, tab, and newline when inside parameters
    while (parse.isWhitespace(c, nesting_level)) {
      next();
    }

    // skip comment
    if (c == '#') {
      while (c != '\n' && c != '') {
        comment += c;
        next();
      }
    }

    // check for end of expression
    if (c == '') {
      // token is still empty
      token_type = TOKENTYPE.DELIMITER;
      return;
    }

    // check for new line character
    if (c == '\n' && !nesting_level) {
      token_type = TOKENTYPE.DELIMITER;
      token = c;
      next();
      return;
    }

    // check for delimiters consisting of 3 characters
    var c2 = c + nextPreview();
    var c3 = c2 + nextNextPreview();
    if (c3.length == 3 && DELIMITERS[c3]) {
      token_type = TOKENTYPE.DELIMITER;
      token = c3;
      next();
      next();
      next();
      return;
    }

    // check for delimiters consisting of 2 characters
    if (c2.length == 2 && DELIMITERS[c2]) {
      token_type = TOKENTYPE.DELIMITER;
      token = c2;
      next();
      next();
      return;
    }

    // check for delimiters consisting of 1 character
    if (DELIMITERS[c]) {
      token_type = TOKENTYPE.DELIMITER;
      token = c;
      next();
      return;
    }

    // check for a number
    if (parse.isDigitDot(c)) {
      token_type = TOKENTYPE.NUMBER;

      // get number, can have a single dot
      if (c == '.') {
        token += c;
        next();

        if (!parse.isDigit(c)) {
          // this is no number, it is just a dot (can be dot notation)
          token_type = TOKENTYPE.DELIMITER;
        }
      }
      else {
        while (parse.isDigit(c)) {
          token += c;
          next();
        }
        if (parse.isDecimalMark(c, nextPreview())) {
          token += c;
          next();
        }
      }
      while (parse.isDigit(c)) {
        token += c;
        next();
      }

      // check for exponential notation like "2.3e-4", "1.23e50" or "2e+4"
      c2 = nextPreview();
      if (c == 'E' || c == 'e') {
        if (parse.isDigit(c2) || c2 == '-' || c2 == '+') {
          token += c;
          next();

          if (c == '+' || c == '-') {
            token += c;
            next();
          }

          // Scientific notation MUST be followed by an exponent
          if (!parse.isDigit(c)) {
            throw createSyntaxError('Digit expected, got "' + c + '"');
          }

          while (parse.isDigit(c)) {
            token += c;
            next();
          }

          if (parse.isDecimalMark(c, nextPreview())) {
            throw createSyntaxError('Digit expected, got "' + c + '"');
          }
        }
        else if (c2 == '.') {
          next();
          throw createSyntaxError('Digit expected, got "' + c + '"');
        }
      }

      return;
    }

    // check for variables, functions, named operators
    if (parse.isAlpha(c, prevPreview(), nextPreview())) {
      while (parse.isAlpha(c, prevPreview(), nextPreview()) || parse.isDigit(c)) {
        token += c;
        next();
      }

      if (NAMED_DELIMITERS.hasOwnProperty(token)) {
        token_type = TOKENTYPE.DELIMITER;
      }
      else {
        token_type = TOKENTYPE.SYMBOL;
      }

      return;
    }

    // something unknown is found, wrong characters -> a syntax error
    token_type = TOKENTYPE.UNKNOWN;
    while (c != '') {
      token += c;
      next();
    }
    throw createSyntaxError('Syntax error in part "' + token + '"');
  }

  /**
   * Get next token and skip newline tokens
   */
  function getTokenSkipNewline () {
    do {
      getToken();
    }
    while (token == '\n');
  }

  /**
   * Open parameters.
   * New line characters will be ignored until closeParams() is called
   */
  function openParams() {
    nesting_level++;
  }

  /**
   * Close parameters.
   * New line characters will no longer be ignored
   */
  function closeParams() {
    nesting_level--;
  }

  /**
   * Checks whether the current character `c` is a valid alpha character:
   *
   * - A latin letter (upper or lower case) Ascii: a-z, A-Z
   * - An underscore                        Ascii: _
   * - A dollar sign                        Ascii: $
   * - A latin letter with accents          Unicode: \u00C0 - \u02AF
   * - A greek letter                       Unicode: \u0370 - \u03FF
   * - A mathematical alphanumeric symbol   Unicode: \u{1D400} - \u{1D7FF} excluding invalid code points
   *
   * The previous and next characters are needed to determine whether
   * this character is part of a unicode surrogate pair.
   *
   * @param {string} c      Current character in the expression
   * @param {string} cPrev  Previous character
   * @param {string} cNext  Next character
   * @return {boolean}
   */
  parse.isAlpha = function isAlpha (c, cPrev, cNext) {
    return parse.isValidLatinOrGreek(c)
        || parse.isValidMathSymbol(c, cNext)
        || parse.isValidMathSymbol(cPrev, c);
  };

  /**
   * Test whether a character is a valid latin, greek, or letter-like character
   * @param {string} c
   * @return {boolean}
   */
  parse.isValidLatinOrGreek = function isValidLatinOrGreek (c) {
    return /^[a-zA-Z_$\u00C0-\u02AF\u0370-\u03FF\u2100-\u214F]$/.test(c);
  };

  /**
   * Test whether two given 16 bit characters form a surrogate pair of a
   * unicode math symbol.
   *
   * http://unicode-table.com/en/
   * http://www.wikiwand.com/en/Mathematical_operators_and_symbols_in_Unicode
   *
   * Note: In ES6 will be unicode aware:
   * http://stackoverflow.com/questions/280712/javascript-unicode-regexes
   * https://mathiasbynens.be/notes/es6-unicode-regex
   *
   * @param {string} high
   * @param {string} low
   * @return {boolean}
   */
  parse.isValidMathSymbol = function isValidMathSymbol (high, low) {
    return /^[\uD835]$/.test(high) &&
        /^[\uDC00-\uDFFF]$/.test(low) &&
        /^[^\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDFCC\uDFCD]$/.test(low);
  };

  /**
   * Check whether given character c is a white space character: space, tab, or enter
   * @param {string} c
   * @param {number} nestingLevel
   * @return {boolean}
   */
  parse.isWhitespace = function isWhitespace (c, nestingLevel) {
    // TODO: also take '\r' carriage return as newline? Or does that give problems on mac?
    return c == ' ' || c == '\t' || (c == '\n' && nestingLevel > 0);
  };

  /**
   * Test whether the character c is a decimal mark (dot).
   * This is the case when it's not the start of a delimiter '.*', './', or '.^'
   * @param {string} c
   * @param {string} cNext
   * @return {boolean}
   */
  parse.isDecimalMark = function isDecimalMark (c, cNext) {
    return c == '.' && cNext !== '/' && cNext !== '*' && cNext !== '^';
  };

  /**
   * checks if the given char c is a digit or dot
   * @param {string} c   a string with one character
   * @return {boolean}
   */
  parse.isDigitDot = function isDigitDot (c) {
    return ((c >= '0' && c <= '9') || c == '.');
  };

  /**
   * checks if the given char c is a digit
   * @param {string} c   a string with one character
   * @return {boolean}
   */
  parse.isDigit = function isDigit (c) {
    return (c >= '0' && c <= '9');
  };

  /**
   * Start of the parse levels below, in order of precedence
   * @return {Node} node
   * @private
   */
  function parseStart () {
    // get the first character in expression
    first();

    getToken();

    var node = parseBlock();

    // check for garbage at the end of the expression
    // an expression ends with a empty character '' and token_type DELIMITER
    if (token != '') {
      if (token_type == TOKENTYPE.DELIMITER) {
        // user entered a not existing operator like "//"

        // TODO: give hints for aliases, for example with "<>" give as hint " did you mean != ?"
        throw createError('Unexpected operator ' + token);
      }
      else {
        throw createSyntaxError('Unexpected part "' + token + '"');
      }
    }

    return node;
  }

  /**
   * Parse a block with expressions. Expressions can be separated by a newline
   * character '\n', or by a semicolon ';'. In case of a semicolon, no output
   * of the preceding line is returned.
   * @return {Node} node
   * @private
   */
  function parseBlock () {
    var node;
    var blocks = [];
    var visible;

    if (token != '' && token != '\n' && token != ';') {
      node = parseAssignment();
      node.comment = comment;
    }

    // TODO: simplify this loop
    while (token == '\n' || token == ';') {
      if (blocks.length == 0 && node) {
        visible = (token != ';');
        blocks.push({
          node: node,
          visible: visible
        });
      }

      getToken();
      if (token != '\n' && token != ';' && token != '') {
        node = parseAssignment();
        node.comment = comment;

        visible = (token != ';');
        blocks.push({
          node: node,
          visible: visible
        });
      }
    }

    if (blocks.length > 0) {
      return new BlockNode(blocks);
    }
    else {
      if (!node) {
        node = new ConstantNode('undefined', 'undefined');
        node.comment = comment;
      }

      return node
    }
  }

  /**
   * Assignment of a function or variable,
   * - can be a variable like 'a=2.3'
   * - or a updating an existing variable like 'matrix(2,3:5)=[6,7,8]'
   * - defining a function like 'f(x) = x^2'
   * @return {Node} node
   * @private
   */
  function parseAssignment () {
    var name, args, value, valid;

    var node = parseConditional();

    if (token == '=') {
      if (type.isSymbolNode(node)) {
        // parse a variable assignment like 'a = 2/3'
        name = node.name;
        getTokenSkipNewline();
        value = parseAssignment();
        return new AssignmentNode(new SymbolNode(name), value);
      }
      else if (type.isAccessorNode(node)) {
        // parse a matrix subset assignment like 'A[1,2] = 4'
        getTokenSkipNewline();
        value = parseAssignment();
        return new AssignmentNode(node.object, node.index, value);
      }
      else if (type.isFunctionNode(node) && type.isSymbolNode(node.fn)) {
        // parse function assignment like 'f(x) = x^2'
        valid = true;
        args = [];

        name = node.name;
        node.args.forEach(function (arg, index) {
          if (type.isSymbolNode(arg)) {
            args[index] = arg.name;
          }
          else {
            valid = false;
          }
        });

        if (valid) {
          getTokenSkipNewline();
          value = parseAssignment();
          return new FunctionAssignmentNode(name, args, value);
        }
      }

      throw createSyntaxError('Invalid left hand side of assignment operator =');
    }

    return node;
  }

  /**
   * conditional operation
   *
   *     condition ? truePart : falsePart
   *
   * Note: conditional operator is right-associative
   *
   * @return {Node} node
   * @private
   */
  function parseConditional () {
    var node = parseLogicalOr();

    while (token == '?') {
      // set a conditional level, the range operator will be ignored as long
      // as conditional_level == nesting_level.
      var prev = conditional_level;
      conditional_level = nesting_level;
      getTokenSkipNewline();

      var condition = node;
      var trueExpr = parseAssignment();

      if (token != ':') throw createSyntaxError('False part of conditional expression expected');

      conditional_level = null;
      getTokenSkipNewline();

      var falseExpr = parseAssignment(); // Note: check for conditional operator again, right associativity

      node = new ConditionalNode(condition, trueExpr, falseExpr);

      // restore the previous conditional level
      conditional_level = prev;
    }

    return node;
  }

  /**
   * logical or, 'x or y'
   * @return {Node} node
   * @private
   */
  function parseLogicalOr() {
    var node = parseLogicalXor();

    while (token == 'or') {
      getTokenSkipNewline();
      node = new OperatorNode('or', 'or', [node, parseLogicalXor()]);
    }

    return node;
  }

  /**
   * logical exclusive or, 'x xor y'
   * @return {Node} node
   * @private
   */
  function parseLogicalXor() {
    var node = parseLogicalAnd();

    while (token == 'xor') {
      getTokenSkipNewline();
      node = new OperatorNode('xor', 'xor', [node, parseLogicalAnd()]);
    }

    return node;
  }

  /**
   * logical and, 'x and y'
   * @return {Node} node
   * @private
   */
  function parseLogicalAnd() {
    var node = parseBitwiseOr();

    while (token == 'and') {
      getTokenSkipNewline();
      node = new OperatorNode('and', 'and', [node, parseBitwiseOr()]);
    }

    return node;
  }

  /**
   * bitwise or, 'x | y'
   * @return {Node} node
   * @private
   */
  function parseBitwiseOr() {
    var node = parseBitwiseXor();

    while (token == '|') {
      getTokenSkipNewline();
      node = new OperatorNode('|', 'bitOr', [node, parseBitwiseXor()]);
    }

    return node;
  }

  /**
   * bitwise exclusive or (xor), 'x ^| y'
   * @return {Node} node
   * @private
   */
  function parseBitwiseXor() {
    var node = parseBitwiseAnd();

    while (token == '^|') {
      getTokenSkipNewline();
      node = new OperatorNode('^|', 'bitXor', [node, parseBitwiseAnd()]);
    }

    return node;
  }

  /**
   * bitwise and, 'x & y'
   * @return {Node} node
   * @private
   */
  function parseBitwiseAnd () {
    var node = parseRelational();

    while (token == '&') {
      getTokenSkipNewline();
      node = new OperatorNode('&', 'bitAnd', [node, parseRelational()]);
    }

    return node;
  }

  /**
   * relational operators
   * @return {Node} node
   * @private
   */
  function parseRelational () {
    var node, operators, name, fn, params;

    node = parseShift();

    operators = {
      '==': 'equal',
      '!=': 'unequal',
      '<': 'smaller',
      '>': 'larger',
      '<=': 'smallerEq',
      '>=': 'largerEq'
    };
    while (operators.hasOwnProperty(token)) {
      name = token;
      fn = operators[name];

      getTokenSkipNewline();
      params = [node, parseShift()];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * Bitwise left shift, bitwise right arithmetic shift, bitwise right logical shift
   * @return {Node} node
   * @private
   */
  function parseShift () {
    var node, operators, name, fn, params;

    node = parseConversion();

    operators = {
      '<<' : 'leftShift',
      '>>' : 'rightArithShift',
      '>>>' : 'rightLogShift'
    };

    while (operators.hasOwnProperty(token)) {
      name = token;
      fn = operators[name];

      getTokenSkipNewline();
      params = [node, parseConversion()];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * conversion operators 'to' and 'in'
   * @return {Node} node
   * @private
   */
  function parseConversion () {
    var node, operators, name, fn, params;

    node = parseRange();

    operators = {
      'to' : 'to',
      'in' : 'to'   // alias of 'to'
    };

    while (operators.hasOwnProperty(token)) {
      name = token;
      fn = operators[name];

      getTokenSkipNewline();
      
      if (name === 'in' && token === '') {
        // end of expression -> this is the unit 'in' ('inch')
        node = new OperatorNode('*', 'multiply', [node, new SymbolNode('in')], true);
      }
      else {
        // operator 'a to b' or 'a in b'
        params = [node, parseRange()];
        node = new OperatorNode(name, fn, params);
      }
    }

    return node;
  }

  /**
   * parse range, "start:end", "start:step:end", ":", "start:", ":end", etc
   * @return {Node} node
   * @private
   */
  function parseRange () {
    var node, params = [];

    if (token == ':') {
      // implicit start=1 (one-based)
      node = new ConstantNode('1', 'number');
    }
    else {
      // explicit start
      node = parseAddSubtract();
    }

    if (token == ':' && (conditional_level !== nesting_level)) {
      // we ignore the range operator when a conditional operator is being processed on the same level
      params.push(node);

      // parse step and end
      while (token == ':' && params.length < 3) {
        getTokenSkipNewline();

        if (token == ')' || token == ']' || token == ',' || token == '') {
          // implicit end
          params.push(new SymbolNode('end'));
        }
        else {
          // explicit end
          params.push(parseAddSubtract());
        }
      }

      if (params.length == 3) {
        // params = [start, step, end]
        node = new RangeNode(params[0], params[2], params[1]); // start, end, step
      }
      else { // length == 2
        // params = [start, end]
        node = new RangeNode(params[0], params[1]); // start, end
      }
    }

    return node;
  }

  /**
   * add or subtract
   * @return {Node} node
   * @private
   */
  function parseAddSubtract ()  {
    var node, operators, name, fn, params;

    node = parseMultiplyDivide();

    operators = {
      '+': 'add',
      '-': 'subtract'
    };
    while (operators.hasOwnProperty(token)) {
      name = token;
      fn = operators[name];

      getTokenSkipNewline();
      params = [node, parseMultiplyDivide()];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * multiply, divide, modulus
   * @return {Node} node
   * @private
   */
  function parseMultiplyDivide () {
    var node, last, operators, name, fn;

    node = parseUnary();
    last = node;

    operators = {
      '*': 'multiply',
      '.*': 'dotMultiply',
      '/': 'divide',
      './': 'dotDivide',
      '%': 'mod',
      'mod': 'mod'
    };

    while (true) {
      if (operators.hasOwnProperty(token)) {
        // explicit operators
        name = token;
        fn = operators[name];

        getTokenSkipNewline();

        last = parseUnary();
        node = new OperatorNode(name, fn, [node, last]);
      }
      else if ((token_type === TOKENTYPE.SYMBOL) ||
          (token === 'in' && type.isConstantNode(node)) ||
          (token_type === TOKENTYPE.NUMBER &&
              !type.isConstantNode(last) &&
              (!type.isOperatorNode(last) || last.op === '!')) ||
          (token === '(')) {
        // parse implicit multiplication
        //
        // symbol:      implicit multiplication like '2a', '(2+3)a', 'a b'
        // number:      implicit multiplication like '(2+3)2'
        // parenthesis: implicit multiplication like '2(3+4)', '(3+4)(1+2)'
        last = parseUnary();
        node = new OperatorNode('*', 'multiply', [node, last], true /*implicit*/);
      }
      else {
        break;
      }
    }

    return node;
  }

  /**
   * Unary plus and minus, and logical and bitwise not
   * @return {Node} node
   * @private
   */
  function parseUnary () {
    var name, params, fn;
    var operators = {
      '-': 'unaryMinus',
      '+': 'unaryPlus',
      '~': 'bitNot',
      'not': 'not'
    };

    if (operators.hasOwnProperty(token)) {
      fn = operators[token];
      name = token;

      getTokenSkipNewline();
      params = [parseUnary()];

      return new OperatorNode(name, fn, params);
    }

    return parsePow();
  }

  /**
   * power
   * Note: power operator is right associative
   * @return {Node} node
   * @private
   */
  function parsePow () {
    var node, name, fn, params;

    node = parseLeftHandOperators();

    if (token == '^' || token == '.^') {
      name = token;
      fn = (name == '^') ? 'pow' : 'dotPow';

      getTokenSkipNewline();
      params = [node, parseUnary()]; // Go back to unary, we can have '2^-3'
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * Left hand operators: factorial x!, transpose x'
   * @return {Node} node
   * @private
   */
  function parseLeftHandOperators ()  {
    var node, operators, name, fn, params;

    node = parseCustomNodes();

    operators = {
      '!': 'factorial',
      '\'': 'transpose'
    };

    while (operators.hasOwnProperty(token)) {
      name = token;
      fn = operators[name];

      getToken();
      params = [node];

      node = new OperatorNode(name, fn, params);
      node = parseAccessors(node);
    }

    return node;
  }

  /**
   * Parse a custom node handler. A node handler can be used to process
   * nodes in a custom way, for example for handling a plot.
   *
   * A handler must be passed as second argument of the parse function.
   * - must extend math.expression.node.Node
   * - must contain a function _compile(defs: Object) : string
   * - must contain a function find(filter: Object) : Node[]
   * - must contain a function toString() : string
   * - the constructor is called with a single argument containing all parameters
   *
   * For example:
   *
   *     nodes = {
   *       'plot': PlotHandler
   *     };
   *
   * The constructor of the handler is called as:
   *
   *     node = new PlotHandler(params);
   *
   * The handler will be invoked when evaluating an expression like:
   *
   *     node = math.parse('plot(sin(x), x)', nodes);
   *
   * @return {Node} node
   * @private
   */
  function parseCustomNodes () {
    var params = [];

    if (token_type == TOKENTYPE.SYMBOL && extra_nodes.hasOwnProperty(token)) {
      var CustomNode = extra_nodes[token];

      getToken();

      // parse parameters
      if (token == '(') {
        params = [];

        openParams();
        getToken();

        if (token != ')') {
          params.push(parseAssignment());

          // parse a list with parameters
          while (token == ',') {
            getToken();
            params.push(parseAssignment());
          }
        }

        if (token != ')') {
          throw createSyntaxError('Parenthesis ) expected');
        }
        closeParams();
        getToken();
      }

      // create a new custom node
      //noinspection JSValidateTypes
      return new CustomNode(params);
    }

    return parseSymbol();
  }

  /**
   * parse symbols: functions, variables, constants, units
   * @return {Node} node
   * @private
   */
  function parseSymbol () {
    var node, name;

    if (token_type == TOKENTYPE.SYMBOL ||
        (token_type == TOKENTYPE.DELIMITER && token in NAMED_DELIMITERS)) {
      name = token;

      getToken();

      // parse function parameters and matrix index
      node = new SymbolNode(name);
      node = parseAccessors(node);
      return node;
    }

    return parseString();
  }

  /**
   * parse accessors:
   * - function invocation in round brackets (...), for example sqrt(2)
   * - index enclosed in square brackets [...], for example A[2,3]
   * - dot notation for properties, like foo.bar
   * @param {Node} node    Node on which to apply the parameters. If there
   *                       are no parameters in the expression, the node
   *                       itself is returned
   * @param {string[]} [types]  Filter the types of notations
   *                            can be ['(', '[', '.']
   * @return {Node} node
   * @private
   */
  function parseAccessors (node, types) {
    var params;

    while ((token === '(' || token === '[' || token === '.') &&
        (!types || types.indexOf(token) !== -1)) {
      params = [];

      if (token === '(') {
        if (type.isSymbolNode(node) || type.isAccessorNode(node) || type.isFunctionNode(node)) {
          // function invocation like fn(2, 3)
          openParams();
          getToken();

          if (token !== ')') {
            params.push(parseAssignment());

            // parse a list with parameters
            while (token === ',') {
              getToken();
              params.push(parseAssignment());
            }
          }

          if (token !== ')') {
            throw createSyntaxError('Parenthesis ) expected');
          }
          closeParams();
          getToken();

          node = new FunctionNode(node, params);
        }
        else {
          // implicit multiplication like (2+3)(4+5)
          // don't parse it here but let it be handled by parseMultiplyDivide
          // with correct precedence
          return node;
        }
      }
      else if (token === '[') {
        // index notation like variable[2, 3]
        openParams();
        getToken();

        if (token !== ']') {
          params.push(parseAssignment());

          // parse a list with parameters
          while (token === ',') {
            getToken();
            params.push(parseAssignment());
          }
        }

        if (token !== ']') {
          throw createSyntaxError('Parenthesis ] expected');
        }
        closeParams();
        getToken();

        node = new AccessorNode(node, new IndexNode(params));
      }
      else {
        // dot notation like variable.prop
        getToken();

        if (token_type !== TOKENTYPE.SYMBOL) {
          throw createSyntaxError('Property name expected after dot');
        }
        params.push(new ConstantNode(token));
        getToken();

        var dotNotation = true;
        node = new AccessorNode(node, new IndexNode(params, dotNotation));
      }
    }

    return node;
  }

  /**
   * parse a string.
   * A string is enclosed by double quotes
   * @return {Node} node
   * @private
   */
  function parseString () {
    var node, str;

    if (token == '"') {
      str = parseStringToken();

      // create constant
      node = new ConstantNode(str, 'string');

      // parse index parameters
      node = parseAccessors(node);

      return node;
    }

    return parseMatrix();
  }

  /**
   * Parse a string surrounded by double quotes "..."
   * @return {string}
   */
  function parseStringToken () {
    var str = '';

    while (c != '' && c != '\"') {
      if (c == '\\') {
        // escape character
        str += c;
        next();
      }

      str += c;
      next();
    }

    getToken();
    if (token != '"') {
      throw createSyntaxError('End of string " expected');
    }
    getToken();

    return str;
  }

  /**
   * parse the matrix
   * @return {Node} node
   * @private
   */
  function parseMatrix () {
    var array, params, rows, cols;

    if (token == '[') {
      // matrix [...]
      openParams();
      getToken();

      if (token != ']') {
        // this is a non-empty matrix
        var row = parseRow();

        if (token == ';') {
          // 2 dimensional array
          rows = 1;
          params = [row];

          // the rows of the matrix are separated by dot-comma's
          while (token == ';') {
            getToken();

            params[rows] = parseRow();
            rows++;
          }

          if (token != ']') {
            throw createSyntaxError('End of matrix ] expected');
          }
          closeParams();
          getToken();

          // check if the number of columns matches in all rows
          cols = params[0].items.length;
          for (var r = 1; r < rows; r++) {
            if (params[r].items.length != cols) {
              throw createError('Column dimensions mismatch ' +
                  '(' + params[r].items.length + ' != ' + cols + ')');
            }
          }

          array = new ArrayNode(params);
        }
        else {
          // 1 dimensional vector
          if (token != ']') {
            throw createSyntaxError('End of matrix ] expected');
          }
          closeParams();
          getToken();

          array = row;
        }
      }
      else {
        // this is an empty matrix "[ ]"
        closeParams();
        getToken();
        array = new ArrayNode([]);
      }

      return parseAccessors(array);
    }

    return parseObject();
  }

  /**
   * Parse a single comma-separated row from a matrix, like 'a, b, c'
   * @return {ArrayNode} node
   */
  function parseRow () {
    var params = [parseAssignment()];
    var len = 1;

    while (token == ',') {
      getToken();

      // parse expression
      params[len] = parseAssignment();
      len++;
    }

    return new ArrayNode(params);
  }

  /**
   * parse an object, enclosed in angle brackets{...}, for example {value: 2}
   * @return {Node} node
   * @private
   */
  function parseObject () {
    if (token == '{') {
      var key;

      var properties = {};
      do {
        getToken();

        if (token != '}') {
          // parse key
          if (token == '"') {
            key = parseStringToken();
          }
          else if (token_type == TOKENTYPE.SYMBOL) {
            key = token;
            getToken();
          }
          else {
            throw createSyntaxError('Symbol or string expected as object key');
          }

          // parse key/value separator
          if (token != ':') {
            throw createSyntaxError('Colon : expected after object key');
          }
          getToken();

          // parse key
          properties[key] = parseAssignment();
        }
      }
      while (token == ',');

      if (token != '}') {
        throw createSyntaxError('Comma , or bracket } expected after object value');
      }
      getToken();

      var node = new ObjectNode(properties);

      // parse index parameters
      node = parseAccessors(node);

      return node;
    }

    return parseNumber();
  }

  /**
   * parse a number
   * @return {Node} node
   * @private
   */
  function parseNumber () {
    var number;

    if (token_type == TOKENTYPE.NUMBER) {
      // this is a number
      number = token;
      getToken();

      return new ConstantNode(number, 'number');
    }

    return parseParentheses();
  }

  /**
   * parentheses
   * @return {Node} node
   * @private
   */
  function parseParentheses () {
    var node;

    // check if it is a parenthesized expression
    if (token == '(') {
      // parentheses (...)
      openParams();
      getToken();

      node = parseAssignment(); // start again

      if (token != ')') {
        throw createSyntaxError('Parenthesis ) expected');
      }
      closeParams();
      getToken();

      node = new ParenthesisNode(node);
      node = parseAccessors(node);
      return node;
    }

    return parseEnd();
  }

  /**
   * Evaluated when the expression is not yet ended but expected to end
   * @return {Node} res
   * @private
   */
  function parseEnd () {
    if (token == '') {
      // syntax error or unexpected end of expression
      throw createSyntaxError('Unexpected end of expression');
    } else if (token === "'") {
      throw createSyntaxError('Value expected. Note: strings must be enclosed by double quotes');
    } else {
      throw createSyntaxError('Value expected');
    }
  }

  /**
   * Shortcut for getting the current row value (one based)
   * Returns the line of the currently handled expression
   * @private
   */
  /* TODO: implement keeping track on the row number
  function row () {
    return null;
  }
  */

  /**
   * Shortcut for getting the current col value (one based)
   * Returns the column (position) where the last token starts
   * @private
   */
  function col () {
    return index - token.length + 1;
  }

  /**
   * Create an error
   * @param {string} message
   * @return {SyntaxError} instantiated error
   * @private
   */
  function createSyntaxError (message) {
    var c = col();
    var error = new SyntaxError(message + ' (char ' + c + ')');
    error['char'] = c;

    return error;
  }

  /**
   * Create an error
   * @param {string} message
   * @return {Error} instantiated error
   * @private
   */
  function createError (message) {
    var c = col();
    var error = new SyntaxError(message + ' (char ' + c + ')');
    error['char'] = c;

    return error;
  }

  return parse;
}

exports.name = 'parse';
exports.path = 'expression';
exports.factory = factory;

},{"../error/ArgumentsError":6,"../utils/collection/deepMap":44,"./node/AccessorNode":10,"./node/ArrayNode":11,"./node/AssignmentNode":12,"./node/BlockNode":13,"./node/ConditionalNode":14,"./node/ConstantNode":15,"./node/FunctionAssignmentNode":16,"./node/FunctionNode":17,"./node/IndexNode":18,"./node/ObjectNode":20,"./node/OperatorNode":21,"./node/ParenthesisNode":22,"./node/RangeNode":23,"./node/SymbolNode":24}],31:[function(require,module,exports){
var IndexError = require('../../error/IndexError');

/**
 * Transform zero-based indices to one-based indices in errors
 * @param {Error} err
 * @returns {Error} Returns the transformed error
 */
exports.transform = function (err) {
  if (err && err.isIndexError) {
    return new IndexError(
        err.index + 1,
        err.min + 1,
        err.max !== undefined ? err.max + 1 : undefined);
  }

  return err;
};

},{"../../error/IndexError":8}],32:[function(require,module,exports){
'use strict';


function factory (type, config, load, typed, math) {
  var parse = load(require('../../expression/parse'));
  var ConstantNode = load(require('../../expression/node/ConstantNode'));
  var FunctionNode = load(require('../../expression/node/FunctionNode'));
  var OperatorNode = load(require('../../expression/node/OperatorNode'));
  var ParenthesisNode = load(require('../../expression/node/ParenthesisNode'));
  var SymbolNode = load(require('../../expression/node/SymbolNode'));
  var Node = load(require('../../expression/node/Node'));
  var simplifyConstant = load(require('./simplify/simplifyConstant'));
  var simplifyCore = load(require('./simplify/simplifyCore'));
  var resolve = load(require('./simplify/resolve'));

  var util = load(require('./simplify/util'));
  var isCommutative = util.isCommutative;
  var isAssociative = util.isAssociative;
  var flatten = util.flatten;
  var unflattenr = util.unflattenr;
  var unflattenl = util.unflattenl;
  var createMakeNodeFunction = util.createMakeNodeFunction;

  /**
   * Simplify an expression tree.
   *
   * A list of rules are applied to an expression, repeating over the list until
   * no further changes are made.
   * It's possible to pass a custom set of rules to the function as second
   * argument. A rule can be specified as an object, string, or function:
   *
   *     var rules = [
   *       { l: 'n1*n3 + n2*n3', r: '(n1+n2)*n3' },
   *       'n1*n3 + n2*n3 -> (n1+n2)*n3',
   *       function (node) {
   *         // ... return a new node or return the node unchanged
   *         return node
   *       }
   *     ]
   *
   * String and object rules consist of a left and right pattern. The left is
   * used to match against the expression and the right determines what matches
   * are replaced with. The main difference between a pattern and a normal
   * expression is that variables starting with the following characters are
   * interpreted as wildcards:
   *
   * - 'n' - matches any Node
   * - 'c' - matches any ConstantNode
   * - 'v' - matches any Node that is not a ConstantNode
   *
   * The default list of rules is exposed on the function as `simplify.rules`
   * and can be used as a basis to built a set of custom rules.
   *
   * For more details on the theory, see:
   *
   * - [Strategies for simplifying math expressions (Stackoverflow)](http://stackoverflow.com/questions/7540227/strategies-for-simplifying-math-expressions)
   * - [Symbolic computation - Simplification (Wikipedia)](https://en.wikipedia.org/wiki/Symbolic_computation#Simplification)
   *
   * Syntax:
   *
   *     simplify(expr)
   *     simplify(expr, rules)
   *     simplify(expr, rules, scope)
   *     simplify(expr, scope)
   *
   * Examples:
   *
   *     math.simplify('2 * 1 * x ^ (2 - 1)');      // Node {2 * x}
   *     math.simplify('2 * 3 * x', {x: 4});        // Node {24}
   *     var f = math.parse('2 * 1 * x ^ (2 - 1)');
   *     math.simplify(f);                          // Node {2 * x}
   *
   * See also:
   *
   *     derivative, parse, eval
   *
   * @param {Node | string} expr
   *            The expression to be simplified
   * @param {Array<{l:string, r: string} | string | function>} [rules]
   *            Optional list with custom rules
   * @return {Node} Returns the simplified form of `expr`
   */
  var simplify = typed('simplify', {
    'string': function (expr) {
      return simplify(parse(expr), simplify.rules, {});
    },

    'string, Object': function (expr, scope) {
      return simplify(parse(expr), simplify.rules, scope);
    },

    'string, Array': function (expr, rules) {
      return simplify(parse(expr), rules, {});
    },

    'string, Array, Object': function (expr, rules, scope) {
      return simplify(parse(expr), rules, scope);
    },

    'Node, Object': function (expr, scope) {
      return simplify(expr, simplify.rules, scope);
    },

    'Node': function (expr) {
      return simplify(expr, simplify.rules, {});
    },

    'Node, Array': function (expr, rules) {
      return simplify(expr, rules, {});
    },

    'Node, Array, Object': function (expr, rules, scope) {
      rules = _buildRules(rules);

      var res = resolve(expr, scope);
      var res = removeParens(res);
      var visited = {};

      var str = res.toString({parenthesis: 'all'});
      while(!visited[str]) {
        visited[str] = true;
        _lastsym = 0; // counter for placeholder symbols
        for (var i=0; i<rules.length; i++) {
          if (typeof rules[i] === 'function') {
            res = rules[i](res);
          }
          else {
            flatten(res);
            res = applyRule(res, rules[i]);
          }
          unflattenl(res); // using left-heavy binary tree here since custom rule functions may expect it
        }
        str = res.toString({parenthesis: 'all'});
      }

      return res;
    }
  });
  simplify.simplifyCore = simplifyCore;
  simplify.resolve = resolve;

  function removeParens(node) {
    return node.transform(function(node, path, parent) {
      return type.isParenthesisNode(node)
          ? node.content
          : node;
    });
  }

  // All constants that are allowed in rules
  var SUPPORTED_CONSTANTS = {
    true: true,
    false: true,
    e: true,
    i: true,
    Infinity: true,
    LN2: true,
    LN10: true,
    LOG2E: true,
    LOG10E: true,
    NaN: true,
    phi: true,
    pi: true,
    SQRT1_2: true,
    SQRT2: true,
    tau: true,
    // null: false,
    // uninitialized: false,
    // version: false,
  };

  // Array of strings, used to build the ruleSet.
  // Each l (left side) and r (right side) are parsed by
  // the expression parser into a node tree.
  // Left hand sides are matched to subtrees within the
  // expression to be parsed and replaced with the right
  // hand side.
  // TODO: Add support for constraints on constants (either in the form of a '=' expression or a callback [callback allows things like comparing symbols alphabetically])
  // To evaluate lhs constants for rhs constants, use: { l: 'c1+c2', r: 'c3', evaluate: 'c3 = c1 + c2' }. Multiple assignments are separated by ';' in block format.
  // It is possible to get into an infinite loop with conflicting rules
  simplify.rules = [
    simplifyCore,
    //{ l: 'n+0', r: 'n' },     // simplifyCore
    //{ l: 'n^0', r: '1' },     // simplifyCore
    //{ l: '0*n', r: '0' },     // simplifyCore
    //{ l: 'n/n', r: '1'},      // simplifyCore
    //{ l: 'n^1', r: 'n' },     // simplifyCore
    //{ l: '+n1', r:'n1' },     // simplifyCore
    //{ l: 'n--n1', r:'n+n1' }, // simplifyCore
    { l: 'log(e)', r:'1' },

    // temporary rules
    { l: 'n-n1', r:'n+-n1' }, // temporarily replace 'subtract' so we can further flatten the 'add' operator
    { l: '-(c*v)', r: '(-c) * v' }, // make non-constant terms positive
    { l: '-v', r: '(-1) * v' },
    { l: 'n/n1^n2', r:'n*n1^-n2' }, // temporarily replace 'divide' so we can further flatten the 'multiply' operator
    { l: 'n/n1', r:'n*n1^-1' },

    // expand nested exponentiation
    { l: '(n ^ n1) ^ n2', r: 'n ^ (n1 * n2)'},

    // collect like factors
    { l: 'n*n', r: 'n^2' },
    { l: 'n * n^n1', r: 'n^(n1+1)' },
    { l: 'n^n1 * n^n2', r: 'n^(n1+n2)' },

    // collect like terms
    { l: 'n+n', r: '2*n' },
    { l: 'n+-n', r: '0' },
    { l: 'n1*n2 + n2', r: '(n1+1)*n2' },
    { l: 'n1*n3 + n2*n3', r: '(n1+n2)*n3' },

    // remove parenthesis in the case of negating a quantitiy
    { l: 'n1 + -1 * (n2 + n3)', r:'n1 + -1 * n2 + -1 * n3' },

    simplifyConstant,

    { l: '(-n)*n1', r: '-(n*n1)' }, // make factors positive (and undo 'make non-constant terms positive')

    // ordering of constants
    { l: 'c+v', r: 'v+c', context: { 'add': { commutative:false } } },
    { l: 'v*c', r: 'c*v', context: { 'multiply': { commutative:false } } },

    // undo temporary rules
    //{ l: '(-1) * n', r: '-n' }, // #811 added test which proved this is redundant
    { l: 'n+-n1', r:'n-n1' },  // undo replace 'subtract'
    { l: 'n*(n1^-1)', r:'n/n1' },  // undo replace 'divide'
    { l: 'n*n1^-n2', r:'n/n1^n2' },
    { l: 'n1^-1', r:'1/n1' },

    { l: 'n*(n1/n2)', r:'(n*n1)/n2' }, // '*' before '/'
    { l: 'n-(n1+n2)', r:'n-n1-n2' }, // '-' before '+'
    // { l: '(n1/n2)/n3', r: 'n1/(n2*n3)' },
    // { l: '(n*n1)/(n*n2)', r: 'n1/n2' },

    { l: '1*n', r: 'n' } // this pattern can be produced by simplifyConstant

  ];

  /**
   * Parse the string array of rules into nodes
   *
   * Example syntax for rules:
   *
   * Position constants to the left in a product:
   * { l: 'n1 * c1', r: 'c1 * n1' }
   * n1 is any Node, and c1 is a ConstantNode.
   *
   * Apply difference of squares formula:
   * { l: '(n1 - n2) * (n1 + n2)', r: 'n1^2 - n2^2' }
   * n1, n2 mean any Node.
   *
   * Short hand notation:
   * 'n1 * c1 -> c1 * n1'
   */
  function _buildRules(rules) {
    // Array of rules to be used to simplify expressions
    var ruleSet = [];
    for(var i=0; i<rules.length; i++) {
      var rule = rules[i];
      var newRule;
      var ruleType = typeof rule;
      switch (ruleType) {
        case 'string':
          var lr = rule.split('->');
          if (lr.length !== 2) {
            throw SyntaxError('Could not parse rule: ' + rule);
          }
          rule = {l: lr[0], r: lr[1]};
          /* falls through */
        case 'object':
          newRule = {
            l: removeParens(parse(rule.l)),
            r: removeParens(parse(rule.r)),
          }
          if(rule.context) {
            newRule.evaluate = rule.context;
          }
          if(rule.evaluate) {
            newRule.evaluate = parse(rule.evaluate);
          }

          if (isAssociative(newRule.l)) {
            var makeNode = createMakeNodeFunction(newRule.l);
            var expandsym = _getExpandPlaceholderSymbol();
            newRule.expanded = {};
            newRule.expanded.l = makeNode([newRule.l.clone(), expandsym]);
            // Push the expandsym into the deepest possible branch.
            // This helps to match the newRule against nodes returned from getSplits() later on.
            flatten(newRule.expanded.l);
            unflattenr(newRule.expanded.l);
            newRule.expanded.r = makeNode([newRule.r, expandsym]);
          }
          break;
        case 'function':
          newRule = rule;
          break;
        default:
          throw TypeError('Unsupported type of rule: ' + ruleType);
      }
     // console.log('Adding rule: ' + rules[i]);
     // console.log(newRule);
      ruleSet.push(newRule);
    }
    return ruleSet;
  }

  var _lastsym = 0;
  function _getExpandPlaceholderSymbol() {
    return new SymbolNode('_p' + _lastsym++);
  }

  /**
   * Returns a simplfied form of node, or the original node if no simplification was possible.
   *
   * @param  {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} node
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} The simplified form of `expr`, or the original node if no simplification was possible.
   */
  var applyRule = typed('applyRule', {
    'Node, Object': function (node, rule) {

      //console.log('Entering applyRule(' + node.toString() + ')');

      // Do not clone node unless we find a match
      var res = node;

      // First replace our child nodes with their simplified versions
      // If a child could not be simplified, the assignments will have
      // no effect since the node is returned unchanged
      if (res instanceof OperatorNode || res instanceof FunctionNode) {
        if (res.args) {
          for(var i=0; i<res.args.length; i++) {
            res.args[i] = applyRule(res.args[i], rule);
          }
        }
      }
      else if(res instanceof ParenthesisNode) {
        if(res.content) {
          res.content = applyRule(res.content, rule);
        }
      }

      // Try to match a rule against this node
      var repl = rule.r;
      var matches = _ruleMatch(rule.l, res)[0];

      // If the rule is associative operator, we can try matching it while allowing additional terms.
      // This allows us to match rules like 'n+n' to the expression '(1+x)+x' or even 'x+1+x' if the operator is commutative.
      if (!matches && rule.expanded) {
        repl = rule.expanded.r;
        matches = _ruleMatch(rule.expanded.l, res)[0];
      }

      if (matches) {
        // var before = res.toString({parenthesis: 'all'});

        // Create a new node by cloning the rhs of the matched rule
        res = repl.clone();

        // Replace placeholders with their respective nodes without traversing deeper into the replaced nodes
        var _transform = function(node) {
          if(node.isSymbolNode && matches.placeholders.hasOwnProperty(node.name)) {
            return matches.placeholders[node.name].clone();
          }
          else {
            return node.map(_transform);
          }
        }

        res = _transform(res);

        // var after = res.toString({parenthesis: 'all'});
        // console.log('Simplified ' + before + ' to ' + after);
      }

      return res;
    }
  });

  /**
   * Get (binary) combinations of a flattened binary node
   * e.g. +(node1, node2, node3) -> [
   *        +(node1,  +(node2, node3)),
   *        +(node2,  +(node1, node3)),
   *        +(node3,  +(node1, node2))]
   *
   */
  function getSplits(node, context) {
    var res = [];
    var right, rightArgs;
    var makeNode = createMakeNodeFunction(node);
    if (isCommutative(node, context)) {
      for (var i=0; i<node.args.length; i++) {
        rightArgs = node.args.slice(0);
        rightArgs.splice(i, 1);
        right = (rightArgs.length === 1) ? rightArgs[0] : makeNode(rightArgs);
        res.push(makeNode([node.args[i], right]));
      }
    }
    else {
      rightArgs = node.args.slice(1);
      right = (rightArgs.length === 1) ? rightArgs[0] : makeNode(rightArgs);
      res.push(makeNode([node.args[0], right]));
    }
    return res;
  }

  /**
   * Returns the set union of two match-placeholders or null if there is a conflict.
   */
  function mergeMatch(match1, match2) {
    var res = {placeholders:{}};

    // Some matches may not have placeholders; this is OK
    if (!match1.placeholders && !match2.placeholders) {
      return res;
    }
    else if (!match1.placeholders) {
      return match2;
    }
    else if (!match2.placeholders) {
      return match1;
    }

    // Placeholders with the same key must match exactly
    for (var key in match1.placeholders) {
      res.placeholders[key] = match1.placeholders[key];
      if (match2.placeholders.hasOwnProperty(key)) {
        if (!_exactMatch(match1.placeholders[key], match2.placeholders[key] )) {
          return null;
        }
      }
    }

    for (var key in match2.placeholders) {
      res.placeholders[key] = match2.placeholders[key];
    }

    return res;
  }

  /**
   * Combine two lists of matches by applying mergeMatch to the cartesian product of two lists of matches.
   * Each list represents matches found in one child of a node.
   */
  function combineChildMatches(list1, list2) {
    var res = [];

    if (list1.length === 0 || list2.length === 0) {
      return res;
    }

    var merged;
    for (var i1 = 0; i1 < list1.length; i1++) {
      for (var i2 = 0; i2 < list2.length; i2++) {
        merged = mergeMatch(list1[i1], list2[i2]);
        if (merged) {
          res.push(merged);
        }
      }
    }
    return res;
  }

  /**
   * Combine multiple lists of matches by applying mergeMatch to the cartesian product of two lists of matches.
   * Each list represents matches found in one child of a node.
   * Returns a list of unique matches.
   */
  function mergeChildMatches(childMatches) {
    if (childMatches.length === 0) {
      return childMatches;
    }

    var sets = childMatches.reduce(combineChildMatches);
    var uniqueSets = [];
    var unique = {};
    for(var i = 0; i < sets.length; i++) {
      var s = JSON.stringify(sets[i]);
      if (!unique[s]) {
        unique[s] = true;
        uniqueSets.push(sets[i]);
      }
    }
    return uniqueSets;
  }

  /**
   * Determines whether node matches rule.
   *
   * @param {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} rule
   * @param {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} node
   * @return {Object} Information about the match, if it exists.
   */
  function _ruleMatch(rule, node, isSplit) {
//    console.log('Entering _ruleMatch(' + JSON.stringify(rule) + ', ' + JSON.stringify(node) + ')');
//    console.log('rule = ' + rule);
//    console.log('node = ' + node);

//    console.log('Entering _ruleMatch(' + rule.toString() + ', ' + node.toString() + ')');
    var res = [{placeholders:{}}];

    if (rule instanceof OperatorNode && node instanceof OperatorNode
     || rule instanceof FunctionNode && node instanceof FunctionNode) {

      // If the rule is an OperatorNode or a FunctionNode, then node must match exactly
      if (rule instanceof OperatorNode) {
        if (rule.op !== node.op || rule.fn !== node.fn) {
          return [];
        }
      }
      else if (rule instanceof FunctionNode) {
        if (rule.name !== node.name) {
          return [];
        }
      }

      // rule and node match. Search the children of rule and node.
      if (node.args.length === 1 && rule.args.length === 1 || !isAssociative(node) || isSplit) {
        // Expect non-associative operators to match exactly
        var childMatches = [];
        for (var i = 0; i < rule.args.length; i++) {
          var childMatch = _ruleMatch(rule.args[i], node.args[i]);
          if (childMatch.length === 0) {
            // Child did not match, so stop searching immediately
            return [];
          }
          // The child matched, so add the information returned from the child to our result
          childMatches.push(childMatch);
        }
        res = mergeChildMatches(childMatches);
      }
      else if (node.args.length >= 2 && rule.args.length === 2) { // node is flattened, rule is not
        // Associative operators/functions can be split in different ways so we check if the rule matches each
        // them and return their union.
        var splits = getSplits(node, rule.context);
        var splitMatches = [];
        for(var i = 0; i < splits.length; i++) {
          var matchSet = _ruleMatch(rule, splits[i], true); // recursing at the same tree depth here
          splitMatches = splitMatches.concat(matchSet);
        }
        return splitMatches;
      }
      else if (rule.args.length > 2) {
        throw Error('Unexpected non-binary associative function: ' + rule.toString());
      }
      else {
        // Incorrect number of arguments in rule and node, so no match
        return [];
      }
    }
    else if (rule instanceof SymbolNode) {
      // If the rule is a SymbolNode, then it carries a special meaning
      // according to the first character of the symbol node name.
      // c.* matches a ConstantNode
      // n.* matches any node
      if (rule.name.length === 0) {
        throw new Error('Symbol in rule has 0 length...!?');
      }
     if (math.hasOwnProperty(rule.name)) {
        if (!SUPPORTED_CONSTANTS[rule.name]) {
          throw new Error('Built in constant: ' + rule.name + ' is not supported by simplify.');
        }

        // built-in constant must match exactly
        if(rule.name !== node.name) {
          return [];
        }
      }
      else if (rule.name[0] === 'n' || rule.name.substring(0,2) === '_p') {
        // rule matches _anything_, so assign this node to the rule.name placeholder
        // Assign node to the rule.name placeholder.
        // Our parent will check for matches among placeholders.
        res[0].placeholders[rule.name] = node;
      }
      else if (rule.name[0] === 'v') {
        // rule matches any variable thing (not a ConstantNode)
        if(!type.isConstantNode(node)) {
          res[0].placeholders[rule.name] = node;
        }
        else {
          // Mis-match: rule was expecting something other than a ConstantNode
          return [];
        }
      }
      else if (rule.name[0] === 'c') {
        // rule matches any ConstantNode
        if(node instanceof ConstantNode) {
          res[0].placeholders[rule.name] = node;
        }
        else {
          // Mis-match: rule was expecting a ConstantNode
          return [];
        }
      }
      else {
        throw new Error('Invalid symbol in rule: ' + rule.name);
      }
    }
    else if (rule instanceof ConstantNode) {
      // Literal constant must match exactly
      if(rule.value !== node.value) {
        return [];
      }
    }
    else {
      // Some other node was encountered which we aren't prepared for, so no match
      return [];
    }

    // It's a match!

    // console.log('_ruleMatch(' + rule.toString() + ', ' + node.toString() + ') found a match');
    return res;
  }


  /**
   * Determines whether p and q (and all their children nodes) are identical.
   *
   * @param {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} p
   * @param {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} q
   * @return {Object} Information about the match, if it exists.
   */
  function _exactMatch(p, q) {
    if(p instanceof ConstantNode && q instanceof ConstantNode) {
      if(p.value !== q.value) {
        return false;
      }
    }
    else if(p instanceof SymbolNode && q instanceof SymbolNode) {
      if(p.name !== q.name) {
        return false;
      }
    }
    else if(p instanceof OperatorNode && q instanceof OperatorNode
         || p instanceof FunctionNode && q instanceof FunctionNode) {
      if (p instanceof OperatorNode) {
        if (p.op !== q.op || p.fn !== q.fn) {
          return false;
        }
      }
      else if (p instanceof FunctionNode) {
        if (p.name !== q.name) {
          return false;
        }
      }

      if(p.args.length !== q.args.length) {
        return false;
      }

      for(var i=0; i<p.args.length; i++) {
        if(!_exactMatch(p.args[i], q.args[i])) {
          return false;
        }
      }
    }
    else {
      return false;
    }

    return true;
  }

  return simplify;
}

exports.math = true;
exports.name = 'simplify';
exports.factory = factory;

},{"../../expression/node/ConstantNode":15,"../../expression/node/FunctionNode":17,"../../expression/node/Node":19,"../../expression/node/OperatorNode":21,"../../expression/node/ParenthesisNode":22,"../../expression/node/SymbolNode":24,"../../expression/parse":30,"./simplify/resolve":33,"./simplify/simplifyConstant":34,"./simplify/simplifyCore":35,"./simplify/util":36}],33:[function(require,module,exports){
'use strict';

function factory(type, config, load, typed, math) {
  var Node = math.expression.node.Node;
  var OperatorNode = math.expression.node.OperatorNode;
  var FunctionNode = math.expression.node.FunctionNode;
  var ParenthesisNode = math.expression.node.ParenthesisNode;

  /**
   * resolve(expr, scope) replaces variable nodes with their scoped values
   *
   * Syntax:
   *
   *     simplify.resolve(expr, scope)
   *
   * Examples:
   *
   *     math.simplify.resolve('x + y', {x:1, y:2}) // Node {1 + 2}
   *     math.simplify.resolve(math.parse('x+y'), {x:1, y:2}) // Node {1 + 2}
   *     math.simplify('x+y', {x:2, y:'x+x'}).toString(); // "6"
   *
   * @param {Node} node
   *     The expression tree to be simplified
   * @param {Object} scope with variables to be resolved
   */
  function resolve(node, scope) {
    if (!scope) {
        return node;
    }
    if (type.isSymbolNode(node)) {
        var value = scope[node.name];
        if (value instanceof Node) {
            return resolve(value, scope);
        } else if (typeof value === 'number') {
            return math.parse(String(value));
        }
    } else if (type.isOperatorNode(node)) {
        var args = node.args.map(function (arg) {
          return resolve(arg, scope)
        });
        return new OperatorNode(node.op, node.fn, args);
    } else if (type.isParenthesisNode(node)) {
        return new ParenthesisNode(resolve(node.content, scope));
    } else if (type.isFunctionNode(node)) {
        var args = node.args.map(function (arg) {
          return resolve(arg, scope)
        });
        return new FunctionNode(node.name, args);
    }
    return node;
  }

  return resolve;
}

exports.math = true;
exports.name = 'resolve';
exports.path = 'algebra.simplify';
exports.factory = factory;

},{}],34:[function(require,module,exports){
'use strict';

var digits = require('./../../../utils/number').digits;
// TODO this could be improved by simplifying seperated constants under associative and commutative operators
function factory(type, config, load, typed, math) {
  var util = load(require('./util'));
  var isCommutative = util.isCommutative;
  var isAssociative = util.isAssociative;
  var allChildren = util.allChildren;
  var createMakeNodeFunction = util.createMakeNodeFunction;
  var ConstantNode = math.expression.node.ConstantNode;
  var OperatorNode = math.expression.node.OperatorNode;
  var FunctionNode = math.expression.node.FunctionNode;

  function simplifyConstant(expr) {
    var res = foldFraction(expr);
    return type.isNode(res) ? res : _toNode(res);
  }

  function _eval(fnname, args) {
    try {
      return _toNumber(math[fnname].apply(null, args));
    }
    catch (ignore) {
      // sometimes the implicit type conversion causes the evaluation to fail, so we'll try again after removing Fractions
      args = args.map(function(x){
        if (type.isFraction(x)) {
          return x.valueOf();
        }
        return x;
      });
      return _toNumber(math[fnname].apply(null, args));
    }
  }

  var _toNode = typed({
    'Fraction': _fractionToNode,
    'number': function(n) {
      if (n < 0) {
        return unaryMinusNode(new ConstantNode(-n));
      }
      return new ConstantNode(n);
    },
    'BigNumber': function(n) {
      if (n < 0) {
        return unaryMinusNode(new ConstantNode(n.negated().toString(), 'number'));
      }
      return new ConstantNode(n.toString(), 'number');
    },
    'Complex': function(s) {
      throw 'Cannot convert Complex number to Node';
    }
  });

  // convert a number to a fraction only if it can be expressed exactly
  function _exactFraction(n) {
    if (isFinite(n)) {
      var f = math.fraction(n);
      if (f.valueOf() === n) {
        return f;
      }
    }
    return n;
  }

  // Convert numbers to a preferred number type in preference order: Fraction, number, Complex
  // BigNumbers are left alone
  var _toNumber = typed({
    'string': function(s) {
      if (config.number === 'BigNumber') {
        return math.bignumber(s);
      }
      else if (config.number === 'Fraction') {
        return math.fraction(s);
      }
      else {
        return _exactFraction(parseFloat(s));
      }
    },

    'Fraction': function(s) { return s; },

    'BigNumber': function(s) { return s; },

    'number': function(s) {
      return _exactFraction(s);
    },

    'Complex': function(s) {
      if (s.im !== 0) {
        return s;
      }
      return _exactFraction(s.re);
    },
  });

  function unaryMinusNode(n) {
    return new OperatorNode('-', 'unaryMinus', [n]);
  }

  function _fractionToNode(f) {
    var n;
    var vn = f.s*f.n;
    if (vn < 0) {
      n = new OperatorNode('-', 'unaryMinus', [new ConstantNode(-vn)])
    }
    else {
      n = new ConstantNode(vn);
    }

    if (f.d === 1) {
      return n;
    }
    return new OperatorNode('/', 'divide', [n, new ConstantNode(f.d)]);
  }

  /*
   * Create a binary tree from a list of Fractions and Nodes.
   * Tries to fold Fractions by evaluating them until the first Node in the list is hit, so
   * `args` should be sorted to have the Fractions at the start (if the operator is commutative).
   * @param args - list of Fractions and Nodes
   * @param fn - evaluator for the binary operation evaluator that accepts two Fractions
   * @param makeNode - creates a binary OperatorNode/FunctionNode from a list of child Nodes
   * if args.length is 1, returns args[0]
   * @return - Either a Node representing a binary expression or Fraction
   */
  function foldOp(fn, args, makeNode) {
    return args.reduce(function(a, b) {
      if (!type.isNode(a) && !type.isNode(b)) {
        try {
          return _eval(fn, [a,b]);
        }
        catch (ignoreandcontinue) {}
        a = _toNode(a);
        b = _toNode(b);
      }
      else if (!type.isNode(a)) {
        a = _toNode(a);
      }
      else if (!type.isNode(b)) {
        b = _toNode(b);
      }

      return makeNode([a, b]);
    });
  }

  // destroys the original node and returns a folded one
  function foldFraction(node) {
    switch(node.type) {
      case 'SymbolNode':
        return node;
      case 'ConstantNode':
        if (node.valueType === 'number') {
          return _toNumber(node.value);
        }
        return node;
      case 'FunctionNode':
        if (math[node.name] && math[node.name].rawArgs) {
          return node;
        }

        // Process operators as OperatorNode
        var operatorFunctions = [ 'add', 'multiply' ];
        if (operatorFunctions.indexOf(node.name) === -1) {
          var args = node.args.map(foldFraction);

          // If all args are numbers
          if (!args.some(type.isNode)) {
            try {
              return _eval(node.name, args);
            }
            catch (ignoreandcontine) {}
          }

          // Convert all args to nodes and construct a symbolic function call
          args = args.map(function(arg) {
            return type.isNode(arg) ? arg : _toNode(arg);
          });
          return new FunctionNode(node.name, args);
        }
        else {
          // treat as operator
        }
        /* falls through */
      case 'OperatorNode':
        var fn = node.fn.toString();
        var args;
        var res;
        var makeNode = createMakeNodeFunction(node);
        if (node.args.length === 1) {
          args = [foldFraction(node.args[0])];
          if (!type.isNode(args[0])) {
            res = _eval(fn, args);
          }
          else {
            res = makeNode(args);
          }
        }
        else if (isAssociative(node)) {
          args = allChildren(node);
          args = args.map(foldFraction);

          if (isCommutative(fn)) {
            // commutative binary operator
            var consts = [], vars = [];

            for (var i=0; i < args.length; i++) {
              if (!type.isNode(args[i])) {
                consts.push(args[i]);
              }
              else {
                vars.push(args[i]);
              }
            }

            if (consts.length > 1) {
              res = foldOp(fn, consts, makeNode);
              vars.unshift(res);
              res = foldOp(fn, vars, makeNode);
            }
            else {
              // we won't change the children order since it's not neccessary
              res = foldOp(fn, args, makeNode);
            }
          }
          else {
            // non-commutative binary operator
            res = foldOp(fn, args, makeNode);
          }
        }
        else {
          // non-associative binary operator
          args = node.args.map(foldFraction);
          res = foldOp(fn, args, makeNode);
        }
        return res;
      case 'ParenthesisNode':
        // remove the uneccessary parenthesis
        return foldFraction(node.content);
      case 'AccessorNode':
        /* falls through */
      case 'ArrayNode':
        /* falls through */
      case 'AssignmentNode':
        /* falls through */
      case 'BlockNode':
        /* falls through */
      case 'FunctionAssignmentNode':
        /* falls through */
      case 'IndexNode':
        /* falls through */
      case 'ObjectNode':
        /* falls through */
      case 'RangeNode':
        /* falls through */
      case 'UpdateNode':
        /* falls through */
      case 'ConditionalNode':
        /* falls through */
      default:
        throw 'Unimplemented node type in simplifyConstant: '+node.type;
    }
  }

  return simplifyConstant;
}

exports.math = true;
exports.name = 'simplifyConstant';
exports.path = 'algebra.simplify';
exports.factory = factory;

},{"./../../../utils/number":47,"./util":36}],35:[function(require,module,exports){
'use strict';

function factory(type, config, load, typed, math) {
  var ConstantNode = math.expression.node.ConstantNode;
  var OperatorNode = math.expression.node.OperatorNode;
  var FunctionNode = math.expression.node.FunctionNode;
  var ParenthesisNode = math.expression.node.ParenthesisNode;

  var node0 = new ConstantNode(0);
  var node1 = new ConstantNode(1);

  /**
   * simplifyCore() performs single pass simplification suitable for
   * applications requiring ultimate performance. In contrast, simplify()
   * extends simplifyCore() with additional passes to provide deeper
   * simplification.
   *
   * Syntax:
   *
   *     simplify.simplifyCore(expr)
   *
   * Examples:
   *
   *     var f = math.parse('2 * 1 * x ^ (2 - 1)');
   *     math.simplify.simpifyCore(f);                          // Node {2 * x}
   *     math.simplify('2 * 1 * x ^ (2 - 1)', [math.simplify.simpifyCore]); // Node {2 * x};
   *
   * See also:
   *
   *     derivative
   *
   * @param {Node} node
   *     The expression to be simplified
   */
  function simplifyCore(node) {
    if (type.isOperatorNode(node) && node.args.length <= 2) {
      var a0 = simplifyCore(node.args[0]);
      var a1 = node.args[1] && simplifyCore(node.args[1]);
      if (node.op === "+") {
          if (node.args.length === 1) {
            return node.args[0];
          }
          if (type.isConstantNode(a0)) {
              if (a0.value === "0") {
                  return a1;
              } else if (type.isConstantNode(a1) && a0.value && a0.value.length < 5 && a1.value && a1.value.length < 5) {
                  return new ConstantNode(Number(a0.value) + Number(a1.value));
              }
          }
          if (type.isConstantNode(a1) && a1.value === "0") {
              return a0;
          }
          if (node.args.length === 2 && type.isOperatorNode(a1) && a1.op === '-' && a1.fn === 'unaryMinus') {
              return new OperatorNode('-', 'subtract', [a0,a1.args[0]]);
          }
          return new OperatorNode(node.op, node.fn, a1 ? [a0,a1] : [a0]);
      } else if (node.op === "-") {
          if (type.isConstantNode(a0) && a1) {
              if (type.isConstantNode(a1) && a0.value && a0.value.length < 5 && a1.value && a1.value.length < 5) {
                  return new ConstantNode(Number(a0.value) - Number(a1.value));
              } else if (a0.value === "0") {
                  return new OperatorNode("-", "unaryMinus", [a1]);
              }
          }
          if (node.fn === "subtract" && node.args.length === 2) {
              if (type.isConstantNode(a1) && a1.value === "0") {
                  return a0;
              }
              if (type.isOperatorNode(a1) && a1.fn === "unaryMinus") {
                  return simplifyCore(new OperatorNode("+", "add", [a0, a1.args[0]]));
              }
              return new OperatorNode(node.op, node.fn, [a0,a1]);
          } else if (node.fn === "unaryMinus") {
              if (type.isOperatorNode(a0)) {
                  if (a0.fn === 'unaryMinus') {
                      return a0.args[0];
                  } else if (a0.fn === 'subtract') {
                      return new OperatorNode('-', 'subtract', [a0.args[1], a0.args[0]]);
                  }
              }
              return new OperatorNode(node.op, node.fn, [a0]);
          }
          throw new Error('never happens');
      } else if (node.op === "*") {
          if (type.isConstantNode(a0)) {
              if (a0.value === "0") {
                  return node0;
              } else if (a0.value === "1") {
                  return a1;
              } else if (type.isConstantNode(a1) && a0.value && a0.value.length < 5 && a1.value && a1.value.length < 5) {
                  return new ConstantNode(Number(a0.value) * Number(a1.value));
              }
          }
          if (type.isConstantNode(a1)) {
              if (a1.value === "0") {
                  return node0;
              } else if (a1.value === "1") {
                  return a0;
              } else if (type.isOperatorNode(a0) && a0.op === node.op) {
                  var a00 = a0.args[0];
                  if (type.isConstantNode(a00) && a1.value && a1.value.length < 5 && a00.value && a00.value.length < 5) {
                      var a00_a1 =  new ConstantNode(Number(a0.args[0].value) * Number(a1.value));
                      return new OperatorNode(node.op, node.fn, [a00_a1, a0.args[1]]); // constants on left
                  }
              }
              return new OperatorNode(node.op, node.fn, [a1, a0]); // constants on left
          }
          return new OperatorNode(node.op, node.fn, [a0, a1]);
      } else if (node.op === "/") {
          if (type.isConstantNode(a0)) {
              if (a0.value === "0") {
                  return node0;
              } else if (type.isConstantNode(a1) && a0.value && a0.value.length < 5 && (a1.value === "1" || a1.value==="2" || a1.value==="4")) {
                  return new ConstantNode(Number(a0.value) / Number(a1.value));
              }
          }
          return new OperatorNode(node.op, node.fn, [a0, a1]);
      } else if (node.op === "^") {
          if (type.isConstantNode(a1)) {
              if (a1.value === "0") {
                  return node1;
              } else if (a1.value === "1") {
                  return a0;
              } else {
                  if (type.isConstantNode(a0) && 
                      a0.value && a0.value.length < 5 && 
                      a1.value && a1.value.length < 2) { 
                      // fold constant
                      return new ConstantNode(
                          math.pow(Number(a0.value), Number(a1.value)));
                  } else if (type.isOperatorNode(a0) && a0.op === "^") {
                      var a01 = a0.args[1];
                      if (type.isConstantNode(a01)) {
                          return new OperatorNode(node.op, node.fn, [
                              a0.args[0], 
                              new ConstantNode(a01.value * a1.value)
                          ]);
                      }
                  }
              }
          }
          return new OperatorNode(node.op, node.fn, [a0, a1]);
      }
    } else if (type.isParenthesisNode(node)) {
        var c = simplifyCore(node.content);
        if (type.isParenthesisNode(c) || type.isSymbolNode(c) || type.isConstantNode(c)) {
            return c;
        }
        return new ParenthesisNode(c);
    } else if (type.isFunctionNode(node)) {
          var args = node.args.map(simplifyCore);
          if (args.length === 1) {
              if (type.isParenthesisNode(args[0])) {
                  args[0] = args[0].content;
              }
          }
          return new FunctionNode(simplifyCore(node.fn), args);
    } else {
        // cannot simplify
    }
    return node;
  }

  return simplifyCore;
}

exports.math = true;
exports.name = 'simplifyCore';
exports.path = 'algebra.simplify';
exports.factory = factory;

},{}],36:[function(require,module,exports){
'use strict';

function factory(type, config, load, typed, math) {
  var FunctionNode = math.expression.node.FunctionNode;
  var OperatorNode = math.expression.node.OperatorNode;
  var SymbolNode = math.expression.node.SymbolNode;

  // TODO commutative/associative properties rely on the arguments
  // e.g. multiply is not commutative for matrices
  // The properties should be calculated from an argument to simplify, or possibly something in math.config
  // the other option is for typed() to specify a return type so that we can evaluate the type of arguments
  var commutative = {
    'add': true,
    'multiply': true
  }
  var associative = {
    'add': true,
    'multiply': true
  }


  function isCommutative(node, context) {
    if (!type.isOperatorNode(node)) {
      return true;
    }
    var name = node.fn.toString();
    if (context && context.hasOwnProperty(name) && context[name].hasOwnProperty('commutative')) {
      return context[name].commutative;
    }
    return commutative[name] || false;
  }

  function isAssociative(node, context) {
    if (!type.isOperatorNode(node)) {
      return false;
    }
    var name = node.fn.toString();
    if (context && context.hasOwnProperty(name) && context[name].hasOwnProperty('associative')) {
      return context[name].associative;
    }
    return associative[name] || false;
  }

  /**
   * Flatten all associative operators in an expression tree.
   * Assumes parentheses have already been removed.
   */
  function flatten(node) {
    if (!node.args || node.args.length === 0) {
      return node;
    }
    node.args = allChildren(node);
    for (var i=0; i<node.args.length; i++) {
      flatten(node.args[i]);
    }
  }

  /**
   * Get the children of a node as if it has been flattened.
   * TODO implement for FunctionNodes
   */
  function allChildren(node) {
    var op;
    var children = [];
    var findChildren = function(node) {
      for (var i = 0; i < node.args.length; i++) {
        var child = node.args[i];
        if (type.isOperatorNode(child) && op === child.op) {
          findChildren(child);
        }
        else {
          children.push(child);
        }
      }
    };

    if (isAssociative(node)) {
      op = node.op;
      findChildren(node);
      return children;
    }
    else {
      return node.args;
    }
  }

  /**
   *  Unflatten all flattened operators to a right-heavy binary tree.
   */
  function unflattenr(node) {
    if (!node.args || node.args.length === 0) {
      return;
    }
    var makeNode = createMakeNodeFunction(node);
    var l = node.args.length;
    for (var i = 0; i < l; i++) {
      unflattenr(node.args[i])
    }
    if (l > 2 && isAssociative(node)) {
      var curnode = node.args.pop();
      while (node.args.length > 0) {
        curnode = makeNode([node.args.pop(), curnode]);
      }
      node.args = curnode.args;
    }
  }

  /**
   *  Unflatten all flattened operators to a left-heavy binary tree.
   */
  function unflattenl(node) {
    if (!node.args || node.args.length === 0) {
      return;
    }
    var makeNode = createMakeNodeFunction(node);
    var l = node.args.length;
    for (var i = 0; i < l; i++) {
      unflattenl(node.args[i])
    }
    if (l > 2 && isAssociative(node)) {
      var curnode = node.args.shift();
      while (node.args.length > 0) {
        curnode = makeNode([curnode, node.args.shift()]);
      }
      node.args = curnode.args;
    }
  }

  function createMakeNodeFunction(node) {
    if (type.isOperatorNode(node)) {
      return function(args){
        try{
          return new OperatorNode(node.op, node.fn, args);
        } catch(err){
          console.error(err);
          return [];
        }
      };
    }
    else {
      return function(args){
        return new FunctionNode(new SymbolNode(node.name), args);
      };
    }
  }
  return {
    createMakeNodeFunction: createMakeNodeFunction,
    isCommutative: isCommutative,
    isAssociative: isAssociative,
    flatten: flatten,
    allChildren: allChildren,
    unflattenr: unflattenr,
    unflattenl: unflattenl
  };
}

exports.factory = factory;
exports.math = true;
},{}],37:[function(require,module,exports){
'use strict';

var clone = require('../../utils/object').clone;
var validateIndex = require('../../utils/array').validateIndex;
var getSafeProperty = require('../../utils/customs').getSafeProperty;
var setSafeProperty = require('../../utils/customs').setSafeProperty;
var DimensionError = require('../../error/DimensionError');

function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));

  /**
   * Get or set a subset of a matrix or string.
   *
   * Syntax:
   *     math.subset(value, index)                                // retrieve a subset
   *     math.subset(value, index, replacement [, defaultValue])  // replace a subset
   *
   * Examples:
   *
   *     // get a subset
   *     var d = [[1, 2], [3, 4]];
   *     math.subset(d, math.index(1, 0));        // returns 3
   *     math.subset(d, math.index([0, 2], 1));   // returns [[2], [4]]
   *
   *     // replace a subset
   *     var e = [];
   *     var f = math.subset(e, math.index(0, [0, 2]), [5, 6]);  // f = [[5, 6]]
   *     var g = math.subset(f, math.index(1, 1), 7, 0);         // g = [[5, 6], [0, 7]]
   *
   * See also:
   *
   *     size, resize, squeeze, index
   *
   * @param {Array | Matrix | string} matrix  An array, matrix, or string
   * @param {Index} index                     An index containing ranges for each
   *                                          dimension
   * @param {*} [replacement]                 An array, matrix, or scalar.
   *                                          If provided, the subset is replaced with replacement.
   *                                          If not provided, the subset is returned
   * @param {*} [defaultValue=undefined]      Default value, filled in on new entries when
   *                                          the matrix is resized. If not provided,
   *                                          math.matrix elements will be left undefined.
   * @return {Array | Matrix | string} Either the retrieved subset or the updated matrix.
   */
  var subset = typed('subset', {
    // get subset
    'Array, Index': function (value, index) {
      var m = matrix(value);
      var subset = m.subset(index);       // returns a Matrix
      return index.isScalar()
          ? subset
          : subset.valueOf();  // return an Array (like the input)
    },

    'Matrix, Index': function (value, index) {
      return value.subset(index);
    },

    'Object, Index': _getObjectProperty,

    'string, Index': _getSubstring,

    // set subset
    'Array, Index, any': function (value, index, replacement) {
      return matrix(clone(value))
          .subset(index, replacement, undefined)
          .valueOf();
    },

    'Array, Index, any, any': function (value, index, replacement, defaultValue) {
      return matrix(clone(value))
          .subset(index, replacement, defaultValue)
          .valueOf();
    },

    'Matrix, Index, any': function (value, index, replacement) {
      return value.clone().subset(index, replacement);
    },

    'Matrix, Index, any, any': function (value, index, replacement, defaultValue) {
      return value.clone().subset(index, replacement, defaultValue);
    },

    'string, Index, string': _setSubstring,
    'string, Index, string, string': _setSubstring,
    'Object, Index, any': _setObjectProperty
  });

  subset.toTex = undefined; // use default template

  return subset;

  /**
   * Retrieve a subset of a string
   * @param {string} str            string from which to get a substring
   * @param {Index} index           An index containing ranges for each dimension
   * @returns {string} substring
   * @private
   */
  function _getSubstring(str, index) {
    if (!type.isIndex(index)) {
      // TODO: better error message
      throw new TypeError('Index expected');
    }
    if (index.size().length != 1) {
      throw new DimensionError(index.size().length, 1);
    }

    // validate whether the range is out of range
    var strLen = str.length;
    validateIndex(index.min()[0], strLen);
    validateIndex(index.max()[0], strLen);

    var range = index.dimension(0);

    var substr = '';
    range.forEach(function (v) {
      substr += str.charAt(v);
    });

    return substr;
  }

  /**
   * Replace a substring in a string
   * @param {string} str            string to be replaced
   * @param {Index} index           An index containing ranges for each dimension
   * @param {string} replacement    Replacement string
   * @param {string} [defaultValue] Default value to be uses when resizing
   *                                the string. is ' ' by default
   * @returns {string} result
   * @private
   */
  function _setSubstring(str, index, replacement, defaultValue) {
    if (!index || index.isIndex !== true) {
      // TODO: better error message
      throw new TypeError('Index expected');
    }
    if (index.size().length != 1) {
      throw new DimensionError(index.size().length, 1);
    }
    if (defaultValue !== undefined) {
      if (typeof defaultValue !== 'string' || defaultValue.length !== 1) {
        throw new TypeError('Single character expected as defaultValue');
      }
    }
    else {
      defaultValue = ' ';
    }

    var range = index.dimension(0);
    var len = range.size()[0];

    if (len != replacement.length) {
      throw new DimensionError(range.size()[0], replacement.length);
    }

    // validate whether the range is out of range
    var strLen = str.length;
    validateIndex(index.min()[0]);
    validateIndex(index.max()[0]);

    // copy the string into an array with characters
    var chars = [];
    for (var i = 0; i < strLen; i++) {
      chars[i] = str.charAt(i);
    }

    range.forEach(function (v, i) {
      chars[v] = replacement.charAt(i[0]);
    });

    // initialize undefined characters with a space
    if (chars.length > strLen) {
      for (i = strLen - 1, len = chars.length; i < len; i++) {
        if (!chars[i]) {
          chars[i] = defaultValue;
        }
      }
    }

    return chars.join('');
  }
}

/**
 * Retrieve a property from an object
 * @param {Object} object
 * @param {Index} index
 * @return {*} Returns the value of the property
 * @private
 */
function _getObjectProperty (object, index) {
  if (index.size().length !== 1) {
    throw new DimensionError(index.size(), 1);
  }

  var key = index.dimension(0);
  if (typeof key !== 'string') {
    throw new TypeError('String expected as index to retrieve an object property');
  }

  return getSafeProperty(object, key);
}

/**
 * Set a property on an object
 * @param {Object} object
 * @param {Index} index
 * @param {*} replacement
 * @return {*} Returns the updated object
 * @private
 */
function _setObjectProperty (object, index, replacement) {
  if (index.size().length !== 1) {
    throw new DimensionError(index.size(), 1);
  }

  var key = index.dimension(0);
  if (typeof key !== 'string') {
    throw new TypeError('String expected as index to retrieve an object property');
  }

  // clone the object, and apply the property to the clone
  var updated = clone(object);
  setSafeProperty(updated, key, replacement);

  return updated;
}

exports.name = 'subset';
exports.factory = factory;

},{"../../error/DimensionError":7,"../../type/matrix/function/matrix":39,"../../utils/array":41,"../../utils/customs":45,"../../utils/object":48}],38:[function(require,module,exports){
'use strict';

var number = require('../../utils/number');

function factory (type, config, load, typed) {
  /**
   * Create a range. A range has a start, step, and end, and contains functions
   * to iterate over the range.
   *
   * A range can be constructed as:
   *     var range = new Range(start, end);
   *     var range = new Range(start, end, step);
   *
   * To get the result of the range:
   *     range.forEach(function (x) {
   *         console.log(x);
   *     });
   *     range.map(function (x) {
   *         return math.sin(x);
   *     });
   *     range.toArray();
   *
   * Example usage:
   *     var c = new Range(2, 6);         // 2:1:5
   *     c.toArray();                     // [2, 3, 4, 5]
   *     var d = new Range(2, -3, -1);    // 2:-1:-2
   *     d.toArray();                     // [2, 1, 0, -1, -2]
   *
   * @class Range
   * @constructor Range
   * @param {number} start  included lower bound
   * @param {number} end    excluded upper bound
   * @param {number} [step] step size, default value is 1
   */
  function Range(start, end, step) {
    if (!(this instanceof Range)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    if (start != null) {
      if (type.isBigNumber(start))
        start = start.toNumber();
      else if (typeof start !== 'number')
        throw new TypeError('Parameter start must be a number');
    }
    if (end != null) {
      if (type.isBigNumber(end))
        end = end.toNumber();
      else if (typeof end !== 'number')
        throw new TypeError('Parameter end must be a number');
    }
    if (step != null) {
      if (type.isBigNumber(step))
        step = step.toNumber();
      else if (typeof step !== 'number')
        throw new TypeError('Parameter step must be a number');
    }

    this.start = (start != null) ? parseFloat(start) : 0;
    this.end   = (end != null)   ? parseFloat(end)   : 0;
    this.step  = (step != null)  ? parseFloat(step)  : 1;
  }

  /**
   * Attach type information
   */
  Range.prototype.type = 'Range';
  Range.prototype.isRange = true;

  /**
   * Parse a string into a range,
   * The string contains the start, optional step, and end, separated by a colon.
   * If the string does not contain a valid range, null is returned.
   * For example str='0:2:11'.
   * @memberof Range
   * @param {string} str
   * @return {Range | null} range
   */
  Range.parse = function (str) {
    if (typeof str !== 'string') {
      return null;
    }

    var args = str.split(':');
    var nums = args.map(function (arg) {
      return parseFloat(arg);
    });

    var invalid = nums.some(function (num) {
      return isNaN(num);
    });
    if (invalid) {
      return null;
    }

    switch (nums.length) {
      case 2:
        return new Range(nums[0], nums[1]);
      case 3:
        return new Range(nums[0], nums[2], nums[1]);
      default:
        return null;
    }
  };

  /**
   * Create a clone of the range
   * @return {Range} clone
   */
  Range.prototype.clone = function () {
    return new Range(this.start, this.end, this.step);
  };

  /**
   * Retrieve the size of the range.
   * Returns an array containing one number, the number of elements in the range.
   * @memberof Range
   * @returns {number[]} size
   */
  Range.prototype.size = function () {
    var len = 0,
        start = this.start,
        step = this.step,
        end = this.end,
        diff = end - start;

    if (number.sign(step) == number.sign(diff)) {
      len = Math.ceil((diff) / step);
    }
    else if (diff == 0) {
      len = 0;
    }

    if (isNaN(len)) {
      len = 0;
    }
    return [len];
  };

  /**
   * Calculate the minimum value in the range
   * @memberof Range
   * @return {number | undefined} min
   */
  Range.prototype.min = function () {
    var size = this.size()[0];

    if (size > 0) {
      if (this.step > 0) {
        // positive step
        return this.start;
      }
      else {
        // negative step
        return this.start + (size - 1) * this.step;
      }
    }
    else {
      return undefined;
    }
  };

  /**
   * Calculate the maximum value in the range
   * @memberof Range
   * @return {number | undefined} max
   */
  Range.prototype.max = function () {
    var size = this.size()[0];

    if (size > 0) {
      if (this.step > 0) {
        // positive step
        return this.start + (size - 1) * this.step;
      }
      else {
        // negative step
        return this.start;
      }
    }
    else {
      return undefined;
    }
  };


  /**
   * Execute a callback function for each value in the range.
   * @memberof Range
   * @param {function} callback   The callback method is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Range being traversed.
   */
  Range.prototype.forEach = function (callback) {
    var x = this.start;
    var step = this.step;
    var end = this.end;
    var i = 0;

    if (step > 0) {
      while (x < end) {
        callback(x, [i], this);
        x += step;
        i++;
      }
    }
    else if (step < 0) {
      while (x > end) {
        callback(x, [i], this);
        x += step;
        i++;
      }
    }
  };

  /**
   * Execute a callback function for each value in the Range, and return the
   * results as an array
   * @memberof Range
   * @param {function} callback   The callback method is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @returns {Array} array
   */
  Range.prototype.map = function (callback) {
    var array = [];
    this.forEach(function (value, index, obj) {
      array[index[0]] = callback(value, index, obj);
    });
    return array;
  };

  /**
   * Create an Array with a copy of the Ranges data
   * @memberof Range
   * @returns {Array} array
   */
  Range.prototype.toArray = function () {
    var array = [];
    this.forEach(function (value, index) {
      array[index[0]] = value;
    });
    return array;
  };

  /**
   * Get the primitive value of the Range, a one dimensional array
   * @memberof Range
   * @returns {Array} array
   */
  Range.prototype.valueOf = function () {
    // TODO: implement a caching mechanism for range.valueOf()
    return this.toArray();
  };

  /**
   * Get a string representation of the range, with optional formatting options.
   * Output is formatted as 'start:step:end', for example '2:6' or '0:0.2:11'
   * @memberof Range
   * @param {Object | number | function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @returns {string} str
   */
  Range.prototype.format = function (options) {
    var str = number.format(this.start, options);

    if (this.step != 1) {
      str += ':' + number.format(this.step, options);
    }
    str += ':' + number.format(this.end, options);
    return str;
  };

  /**
   * Get a string representation of the range.
   * @memberof Range
   * @returns {string}
   */
  Range.prototype.toString = function () {
    return this.format();
  };

  /**
   * Get a JSON representation of the range
   * @memberof Range
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "Range", "start": 2, "end": 4, "step": 1}`
   */
  Range.prototype.toJSON = function () {
    return {
      mathjs: 'Range',
      start: this.start,
      end: this.end,
      step: this.step
    };
  };

  /**
   * Instantiate a Range from a JSON object
   * @memberof Range
   * @param {Object} json A JSON object structured as:
   *                      `{"mathjs": "Range", "start": 2, "end": 4, "step": 1}`
   * @return {Range}
   */
  Range.fromJSON = function (json) {
    return new Range(json.start, json.end, json.step);
  };

  return Range;
}

exports.name = 'Range';
exports.path = 'type';
exports.factory = factory;

},{"../../utils/number":47}],39:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {
  /**
   * Create a Matrix. The function creates a new `math.type.Matrix` object from
   * an `Array`. A Matrix has utility functions to manipulate the data in the
   * matrix, like getting the size and getting or setting values in the matrix.
   * Supported storage formats are 'dense' and 'sparse'.
   *
   * Syntax:
   *
   *    math.matrix()                         // creates an empty matrix using default storage format (dense).
   *    math.matrix(data)                     // creates a matrix with initial data using default storage format (dense).
   *    math.matrix('dense')                  // creates an empty matrix using the given storage format.
   *    math.matrix(data, 'dense')            // creates a matrix with initial data using the given storage format.
   *    math.matrix(data, 'sparse')           // creates a sparse matrix with initial data.
   *    math.matrix(data, 'sparse', 'number') // creates a sparse matrix with initial data, number data type.
   *
   * Examples:
   *
   *    var m = math.matrix([[1, 2], [3, 4]]);
   *    m.size();                        // Array [2, 2]
   *    m.resize([3, 2], 5);
   *    m.valueOf();                     // Array [[1, 2], [3, 4], [5, 5]]
   *    m.get([1, 0])                    // number 3
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, number, string, unit, sparse
   *
   * @param {Array | Matrix} [data]    A multi dimensional array
   * @param {string} [format]          The Matrix storage format
   *
   * @return {Matrix} The created matrix
   */
  var matrix = typed('matrix', {
    '': function () {
      return _create([]);
    },

    'string': function (format) {
      return _create([], format);
    },
    
    'string, string': function (format, datatype) {
      return _create([], format, datatype);
    },

    'Array': function (data) {
      return _create(data);
    },
      
    'Matrix': function (data) {
      return _create(data, data.storage());
    },
    
    'Array | Matrix, string': _create,
    
    'Array | Matrix, string, string': _create
  });

  matrix.toTex = {
    0: '\\begin{bmatrix}\\end{bmatrix}',
    1: '\\left(${args[0]}\\right)',
    2: '\\left(${args[0]}\\right)'
  };

  return matrix;

  /**
   * Create a new Matrix with given storage format
   * @param {Array} data
   * @param {string} [format]
   * @param {string} [datatype]
   * @returns {Matrix} Returns a new Matrix
   * @private
   */
  function _create(data, format, datatype) {
    // get storage format constructor
    var M = type.Matrix.storage(format || 'default');

    // create instance
    return new M(data, datatype);
  }
}

exports.name = 'matrix';
exports.factory = factory;

},{}],40:[function(require,module,exports){
'use strict';

function factory (type, config, load, typed) {
  /**
   * A ResultSet contains a list or results
   * @class ResultSet
   * @param {Array} entries
   * @constructor ResultSet
   */
  function ResultSet(entries) {
    if (!(this instanceof ResultSet)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    this.entries = entries || [];
  }

  /**
   * Attach type information
   */
  ResultSet.prototype.type = 'ResultSet';
  ResultSet.prototype.isResultSet = true;

  /**
   * Returns the array with results hold by this ResultSet
   * @memberof ResultSet
   * @returns {Array} entries
   */
  ResultSet.prototype.valueOf = function () {
    return this.entries;
  };

  /**
   * Returns the stringified results of the ResultSet
   * @memberof ResultSet
   * @returns {string} string
   */
  ResultSet.prototype.toString = function () {
    return '[' + this.entries.join(', ') + ']';
  };

  /**
   * Get a JSON representation of the ResultSet
   * @memberof ResultSet
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "ResultSet", "entries": [...]}`
   */
  ResultSet.prototype.toJSON = function () {
    return {
      mathjs: 'ResultSet',
      entries: this.entries
    };
  };

  /**
   * Instantiate a ResultSet from a JSON object
   * @memberof ResultSet
   * @param {Object} json  A JSON object structured as:
   *                       `{"mathjs": "ResultSet", "entries": [...]}`
   * @return {ResultSet}
   */
  ResultSet.fromJSON = function (json) {
    return new ResultSet(json.entries);
  };

  return ResultSet;
}

exports.name = 'ResultSet';
exports.path = 'type';
exports.factory = factory;

},{}],41:[function(require,module,exports){
'use strict';

var number = require('./number');
var string = require('./string');
var object = require('./object');
var types = require('./types');

var DimensionError = require('../error/DimensionError');
var IndexError = require('../error/IndexError');

/**
 * Calculate the size of a multi dimensional array.
 * This function checks the size of the first entry, it does not validate
 * whether all dimensions match. (use function `validate` for that)
 * @param {Array} x
 * @Return {Number[]} size
 */
exports.size = function (x) {
  var s = [];

  while (Array.isArray(x)) {
    s.push(x.length);
    x = x[0];
  }

  return s;
};

/**
 * Recursively validate whether each element in a multi dimensional array
 * has a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {number[]} size  Array with the size of each dimension
 * @param {number} dim   Current dimension
 * @throws DimensionError
 * @private
 */
function _validate(array, size, dim) {
  var i;
  var len = array.length;

  if (len != size[dim]) {
    throw new DimensionError(len, size[dim]);
  }

  if (dim < size.length - 1) {
    // recursively validate each child array
    var dimNext = dim + 1;
    for (i = 0; i < len; i++) {
      var child = array[i];
      if (!Array.isArray(child)) {
        throw new DimensionError(size.length - 1, size.length, '<');
      }
      _validate(array[i], size, dimNext);
    }
  }
  else {
    // last dimension. none of the childs may be an array
    for (i = 0; i < len; i++) {
      if (Array.isArray(array[i])) {
        throw new DimensionError(size.length + 1, size.length, '>');
      }
    }
  }
}

/**
 * Validate whether each element in a multi dimensional array has
 * a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {number[]} size  Array with the size of each dimension
 * @throws DimensionError
 */
exports.validate = function(array, size) {
  var isScalar = (size.length == 0);
  if (isScalar) {
    // scalar
    if (Array.isArray(array)) {
      throw new DimensionError(array.length, 0);
    }
  }
  else {
    // array
    _validate(array, size, 0);
  }
};

/**
 * Test whether index is an integer number with index >= 0 and index < length
 * when length is provided
 * @param {number} index    Zero-based index
 * @param {number} [length] Length of the array
 */
exports.validateIndex = function(index, length) {
  if (!number.isNumber(index) || !number.isInteger(index)) {
    throw new TypeError('Index must be an integer (value: ' + index + ')');
  }
  if (index < 0 || (typeof length === 'number' && index >= length)) {
    throw new IndexError(index, length);
  }
};

// a constant used to specify an undefined defaultValue
exports.UNINITIALIZED = {};

/**
 * Resize a multi dimensional array. The resized array is returned.
 * @param {Array} array         Array to be resized
 * @param {Array.<number>} size Array with the size of each dimension
 * @param {*} [defaultValue=0]  Value to be filled in in new entries,
 *                              zero by default. To leave new entries undefined,
 *                              specify array.UNINITIALIZED as defaultValue
 * @return {Array} array         The resized array
 */
exports.resize = function(array, size, defaultValue) {
  // TODO: add support for scalars, having size=[] ?

  // check the type of the arguments
  if (!Array.isArray(array) || !Array.isArray(size)) {
    throw new TypeError('Array expected');
  }
  if (size.length === 0) {
    throw new Error('Resizing to scalar is not supported');
  }

  // check whether size contains positive integers
  size.forEach(function (value) {
    if (!number.isNumber(value) || !number.isInteger(value) || value < 0) {
      throw new TypeError('Invalid size, must contain positive integers ' +
          '(size: ' + string.format(size) + ')');
    }
  });

  // recursively resize the array
  var _defaultValue = (defaultValue !== undefined) ? defaultValue : 0;
  _resize(array, size, 0, _defaultValue);

  return array;
};

/**
 * Recursively resize a multi dimensional array
 * @param {Array} array         Array to be resized
 * @param {number[]} size       Array with the size of each dimension
 * @param {number} dim          Current dimension
 * @param {*} [defaultValue]    Value to be filled in in new entries,
 *                              undefined by default.
 * @private
 */
function _resize (array, size, dim, defaultValue) {
  var i;
  var elem;
  var oldLen = array.length;
  var newLen = size[dim];
  var minLen = Math.min(oldLen, newLen);

  // apply new length
  array.length = newLen;

  if (dim < size.length - 1) {
    // non-last dimension
    var dimNext = dim + 1;

    // resize existing child arrays
    for (i = 0; i < minLen; i++) {
      // resize child array
      elem = array[i];
      if (!Array.isArray(elem)) {
        elem = [elem]; // add a dimension
        array[i] = elem;
      }
      _resize(elem, size, dimNext, defaultValue);
    }

    // create new child arrays
    for (i = minLen; i < newLen; i++) {
      // get child array
      elem = [];
      array[i] = elem;

      // resize new child array
      _resize(elem, size, dimNext, defaultValue);
    }
  }
  else {
    // last dimension

    // remove dimensions of existing values
    for (i = 0; i < minLen; i++) {
      while (Array.isArray(array[i])) {
        array[i] = array[i][0];
      }
    }

    if(defaultValue !== exports.UNINITIALIZED) {
      // fill new elements with the default value
      for (i = minLen; i < newLen; i++) {
        array[i] = defaultValue;
      }
    }
  }
}

/**
 * Re-shape a multi dimensional array to fit the specified dimensions
 * @param {Array} array           Array to be reshaped
 * @param {Array.<number>} sizes  List of sizes for each dimension
 * @returns {Array}               Array whose data has been formatted to fit the
 *                                specified dimensions
 *
 * @throws {DimensionError}       If the product of the new dimension sizes does
 *                                not equal that of the old ones
 */
exports.reshape = function(array, sizes) {
  var flatArray = exports.flatten(array);
  var newArray;

  var product = function (arr) {
    return arr.reduce(function (prev, curr) {
      return prev * curr;
    });
  };

  if (!Array.isArray(array) || !Array.isArray(sizes)) {
    throw new TypeError('Array expected');
  }

  if (sizes.length === 0) {
    throw new DimensionError(0, product(exports.size(array)), '!=');
  }

  try {
    newArray  = _reshape(flatArray, sizes);
  } catch (e) {
    if (e instanceof DimensionError) {
      throw new DimensionError(
        product(sizes),
        product(exports.size(array)),
        '!='
      );
    }
    throw e;
  }

  if (flatArray.length > 0) {
    throw new DimensionError(
      product(sizes),
      product(exports.size(array)),
      '!='
    );
  }

  return newArray;
};

/**
 * Recursively re-shape a multi dimensional array to fit the specified dimensions
 * @param {Array} array           Array to be reshaped
 * @param {Array.<number>} sizes  List of sizes for each dimension
 * @returns {Array}               Array whose data has been formatted to fit the
 *                                specified dimensions
 *
 * @throws {DimensionError}       If the product of the new dimension sizes does
 *                                not equal that of the old ones
 */
function _reshape(array, sizes) {
  var accumulator = [];
  var i;

  if (sizes.length === 0) {
    if (array.length === 0) {
      throw new DimensionError(null, null, '!=');
    }
    return array.shift();
  }
  for (i = 0; i < sizes[0]; i += 1) {
    accumulator.push(_reshape(array, sizes.slice(1)));
  }
  return accumulator;
}


/**
 * Squeeze a multi dimensional array
 * @param {Array} array
 * @param {Array} [size]
 * @returns {Array} returns the array itself
 */
exports.squeeze = function(array, size) {
  var s = size || exports.size(array);

  // squeeze outer dimensions
  while (Array.isArray(array) && array.length === 1) {
    array = array[0];
    s.shift();
  }

  // find the first dimension to be squeezed
  var dims = s.length;
  while (s[dims - 1] === 1) {
    dims--;
  }

  // squeeze inner dimensions
  if (dims < s.length) {
    array = _squeeze(array, dims, 0);
    s.length = dims;
  }

  return array;
};

/**
 * Recursively squeeze a multi dimensional array
 * @param {Array} array
 * @param {number} dims Required number of dimensions
 * @param {number} dim  Current dimension
 * @returns {Array | *} Returns the squeezed array
 * @private
 */
function _squeeze (array, dims, dim) {
  var i, ii;

  if (dim < dims) {
    var next = dim + 1;
    for (i = 0, ii = array.length; i < ii; i++) {
      array[i] = _squeeze(array[i], dims, next);
    }
  }
  else {
    while (Array.isArray(array)) {
      array = array[0];
    }
  }

  return array;
}

/**
 * Unsqueeze a multi dimensional array: add dimensions when missing
 * 
 * Paramter `size` will be mutated to match the new, unqueezed matrix size.
 * 
 * @param {Array} array
 * @param {number} dims     Desired number of dimensions of the array
 * @param {number} [outer]  Number of outer dimensions to be added
 * @param {Array} [size]    Current size of array.
 * @returns {Array} returns the array itself
 * @private
 */
exports.unsqueeze = function(array, dims, outer, size) {
  var s = size || exports.size(array);

  // unsqueeze outer dimensions
  if (outer) {
    for (var i = 0; i < outer; i++) {
      array = [array];
      s.unshift(1);
    }
  }

  // unsqueeze inner dimensions
  array = _unsqueeze(array, dims, 0);
  while (s.length < dims) {
    s.push(1);
  }

  return array;
};

/**
 * Recursively unsqueeze a multi dimensional array
 * @param {Array} array
 * @param {number} dims Required number of dimensions
 * @param {number} dim  Current dimension
 * @returns {Array | *} Returns the squeezed array
 * @private
 */
function _unsqueeze (array, dims, dim) {
  var i, ii;

  if (Array.isArray(array)) {
    var next = dim + 1;
    for (i = 0, ii = array.length; i < ii; i++) {
      array[i] = _unsqueeze(array[i], dims, next);
    }
  }
  else {
    for (var d = dim; d < dims; d++) {
      array = [array];
    }
  }

  return array;
}
/**
 * Flatten a multi dimensional array, put all elements in a one dimensional
 * array
 * @param {Array} array   A multi dimensional array
 * @return {Array}        The flattened array (1 dimensional)
 */
exports.flatten = function(array) {
  if (!Array.isArray(array)) {
    //if not an array, return as is
    return array;
  }
  var flat = [];

  array.forEach(function callback(value) {
    if (Array.isArray(value)) {
      value.forEach(callback);  //traverse through sub-arrays recursively
    }
    else {
      flat.push(value);
    }
  });

  return flat;
};

/**
 * A safe map
 * @param {Array} array
 * @param {function} callback
 */
exports.map = function (array, callback) {
  return Array.prototype.map.call(array, callback);
}

/**
 * A safe forEach
 * @param {Array} array
 * @param {function} callback
 */
exports.forEach = function (array, callback) {
  Array.prototype.forEach.call(array, callback);
}

/**
 * A safe filter
 * @param {Array} array
 * @param {function} callback
 */
exports.filter = function (array, callback) {
  if (exports.size(array).length !== 1) {
    throw new Error('Only one dimensional matrices supported');
  }

  return Array.prototype.filter.call(array, callback);
}

/**
 * Filter values in a callback given a regular expression
 * @param {Array} array
 * @param {RegExp} regexp
 * @return {Array} Returns the filtered array
 * @private
 */
exports.filterRegExp = function (array, regexp) {
  if (exports.size(array).length !== 1) {
    throw new Error('Only one dimensional matrices supported');
  }

  return Array.prototype.filter.call(array, function (entry) {
    return regexp.test(entry);
  });
}

/**
 * A safe join
 * @param {Array} array
 * @param {string} separator
 */
exports.join = function (array, separator) {
  return Array.prototype.join.call(array, separator);
}

/**
 * Assign a numeric identifier to every element of a sorted array
 * @param {Array}	a  An array
 * @return {Array}	An array of objects containing the original value and its identifier
 */
exports.identify = function(a) {
  if (!Array.isArray(a)) {
	throw new TypeError('Array input expected');
  }
	
  if (a.length === 0) {
	return a;
  }
	
  var b = [];
  var count = 0;
  b[0] = {value: a[0], identifier: 0};
  for (var i=1; i<a.length; i++) {
    if (a[i] === a[i-1]) {
  	count++;
    }
    else {
      count = 0;
    }
    b.push({value: a[i], identifier: count});
  }
  return b;
}

/**
 * Remove the numeric identifier from the elements
 * @param	a  An array
 * @return	An array of values without identifiers
 */
exports.generalize = function(a) {
  if (!Array.isArray(a)) {
	throw new TypeError('Array input expected');
  }
	
  if (a.length === 0) {
	return a;
  }
	
  var b = [];
  for (var i=0; i<a.length; i++) {
    b.push(a[i].value);
  }
  return b;
}

/**
 * Test whether an object is an array
 * @param {*} value
 * @return {boolean} isArray
 */
exports.isArray = Array.isArray;

},{"../error/DimensionError":7,"../error/IndexError":8,"./number":47,"./object":48,"./string":49,"./types":50}],42:[function(require,module,exports){
/**
 * Convert a BigNumber to a formatted string representation.
 *
 * Syntax:
 *
 *    format(value)
 *    format(value, options)
 *    format(value, precision)
 *    format(value, fn)
 *
 * Where:
 *
 *    {number} value   The value to be formatted
 *    {Object} options An object with formatting options. Available options:
 *                     {string} notation
 *                         Number notation. Choose from:
 *                         'fixed'          Always use regular number notation.
 *                                          For example '123.40' and '14000000'
 *                         'exponential'    Always use exponential notation.
 *                                          For example '1.234e+2' and '1.4e+7'
 *                         'auto' (default) Regular number notation for numbers
 *                                          having an absolute value between
 *                                          `lower` and `upper` bounds, and uses
 *                                          exponential notation elsewhere.
 *                                          Lower bound is included, upper bound
 *                                          is excluded.
 *                                          For example '123.4' and '1.4e7'.
 *                     {number} precision   A number between 0 and 16 to round
 *                                          the digits of the number.
 *                                          In case of notations 'exponential' and
 *                                          'auto', `precision` defines the total
 *                                          number of significant digits returned
 *                                          and is undefined by default.
 *                                          In case of notation 'fixed',
 *                                          `precision` defines the number of
 *                                          significant digits after the decimal
 *                                          point, and is 0 by default.
 *                     {Object} exponential An object containing two parameters,
 *                                          {number} lower and {number} upper,
 *                                          used by notation 'auto' to determine
 *                                          when to return exponential notation.
 *                                          Default values are `lower=1e-3` and
 *                                          `upper=1e5`.
 *                                          Only applicable for notation `auto`.
 *    {Function} fn    A custom formatting function. Can be used to override the
 *                     built-in notations. Function `fn` is called with `value` as
 *                     parameter and must return a string. Is useful for example to
 *                     format all values inside a matrix in a particular way.
 *
 * Examples:
 *
 *    format(6.4);                                        // '6.4'
 *    format(1240000);                                    // '1.24e6'
 *    format(1/3);                                        // '0.3333333333333333'
 *    format(1/3, 3);                                     // '0.333'
 *    format(21385, 2);                                   // '21000'
 *    format(12.071, {notation: 'fixed'});                // '12'
 *    format(2.3,    {notation: 'fixed', precision: 2});  // '2.30'
 *    format(52.8,   {notation: 'exponential'});          // '5.28e+1'
 *
 * @param {BigNumber} value
 * @param {Object | Function | number} [options]
 * @return {string} str The formatted value
 */
exports.format = function (value, options) {
  if (typeof options === 'function') {
    // handle format(value, fn)
    return options(value);
  }

  // handle special cases
  if (!value.isFinite()) {
    return value.isNaN() ? 'NaN' : (value.gt(0) ? 'Infinity' : '-Infinity');
  }

  // default values for options
  var notation = 'auto';
  var precision = undefined;

  if (options !== undefined) {
    // determine notation from options
    if (options.notation) {
      notation = options.notation;
    }

    // determine precision from options
    if (typeof options === 'number') {
      precision = options;
    }
    else if (options.precision) {
      precision = options.precision;
    }
  }

  // handle the various notations
  switch (notation) {
    case 'fixed':
      return exports.toFixed(value, precision);

    case 'exponential':
      return exports.toExponential(value, precision);

    case 'auto':
      // determine lower and upper bound for exponential notation.
      // TODO: implement support for upper and lower to be BigNumbers themselves
      var lower = 1e-3;
      var upper = 1e5;
      if (options && options.exponential) {
        if (options.exponential.lower !== undefined) {
          lower = options.exponential.lower;
        }
        if (options.exponential.upper !== undefined) {
          upper = options.exponential.upper;
        }
      }

      // adjust the configuration of the BigNumber constructor (yeah, this is quite tricky...)
      var oldConfig = {
        toExpNeg: value.constructor.toExpNeg,
        toExpPos: value.constructor.toExpPos
      };

      value.constructor.config({
        toExpNeg: Math.round(Math.log(lower) / Math.LN10),
        toExpPos: Math.round(Math.log(upper) / Math.LN10)
      });

      // handle special case zero
      if (value.isZero()) return '0';

      // determine whether or not to output exponential notation
      var str;
      var abs = value.abs();
      if (abs.gte(lower) && abs.lt(upper)) {
        // normal number notation
        str = value.toSignificantDigits(precision).toFixed();
      }
      else {
        // exponential notation
        str = exports.toExponential(value, precision);
      }

      // remove trailing zeros after the decimal point
      return str.replace(/((\.\d*?)(0+))($|e)/, function () {
        var digits = arguments[2];
        var e = arguments[4];
        return (digits !== '.') ? digits + e : e;
      });

    default:
      throw new Error('Unknown notation "' + notation + '". ' +
          'Choose "auto", "exponential", or "fixed".');
  }
};

/**
 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
 * @param {BigNumber} value
 * @param {number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 * @returns {string} str
 */
exports.toExponential = function (value, precision) {
  if (precision !== undefined) {
    return value.toExponential(precision - 1); // Note the offset of one
  }
  else {
    return value.toExponential();
  }
};

/**
 * Format a number with fixed notation.
 * @param {BigNumber} value
 * @param {number} [precision=0]        Optional number of decimals after the
 *                                      decimal point. Zero by default.
 */
exports.toFixed = function (value, precision) {
  return value.toFixed(precision || 0);
  // Note: the (precision || 0) is needed as the toFixed of BigNumber has an
  // undefined default precision instead of 0.
};

},{}],43:[function(require,module,exports){
/**
 * Test whether a value is a BigNumber
 * @param {*} x
 * @return {boolean}
 */
module.exports = function isBigNumber(x) {
  return x && x.constructor.prototype.isBigNumber || false
}

},{}],44:[function(require,module,exports){
'use strict';

/**
 * Execute the callback function element wise for each element in array and any
 * nested array
 * Returns an array with the results
 * @param {Array | Matrix} array
 * @param {Function} callback   The callback is called with two parameters:
 *                              value1 and value2, which contain the current
 *                              element of both arrays.
 * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
 *
 * @return {Array | Matrix} res
 */
module.exports = function deepMap(array, callback, skipZeros) {
  if (array && (typeof array.map === 'function')) {
    // TODO: replace array.map with a for loop to improve performance
    return array.map(function (x) {
      return deepMap(x, callback, skipZeros);
    });
  }
  else {
    return callback(array);
  }
};

},{}],45:[function(require,module,exports){
'use strict';

var hasOwnProperty = require('./object').hasOwnProperty;

/**
 * Get a property of a plain object
 * Throws an error in case the object is not a plain object or the
 * property is not defined on the object itself
 * @param {Object} object
 * @param {string} prop
 * @return {*} Returns the property value when safe
 */
function getSafeProperty (object, prop) {
  // only allow getting safe properties of a plain object
  if (isPlainObject(object) && isSafeProperty(object, prop)) {
    return object[prop];
  }

  if (typeof object[prop] === 'function' && isSafeMethod(object, prop)) {
    throw new Error('Cannot access method "' + prop + '" as a property');
  }

  throw new Error('No access to property "' + prop + '"');
}

/**
 * Set a property on a plain object.
 * Throws an error in case the object is not a plain object or the
 * property would override an inherited property like .constructor or .toString
 * @param {Object} object
 * @param {string} prop
 * @param {*} value
 * @return {*} Returns the value
 */
// TODO: merge this function into access.js?
function setSafeProperty (object, prop, value) {
  // only allow setting safe properties of a plain object
  if (isPlainObject(object) && isSafeProperty(object, prop)) {
    return object[prop] = value;
  }

  throw new Error('No access to property "' + prop + '"');
}

/**
 * Test whether a property is safe to use for an object.
 * For example .toString and .constructor are not safe
 * @param {string} prop
 * @return {boolean} Returns true when safe
 */
function isSafeProperty (object, prop) {
  if (!object || typeof object !== 'object') {
    return false;
  }
  // SAFE: whitelisted
  // e.g length
  if (hasOwnProperty(safeNativeProperties, prop)) {
    return true;
  }
  // UNSAFE: inherited from Object prototype
  // e.g constructor
  if (prop in Object.prototype) {
    // 'in' is used instead of hasOwnProperty for nodejs v0.10
    // which is inconsistent on root prototypes. It is safe
    // here because Object.prototype is a root object
    return false;
  }
  // UNSAFE: inherited from Function prototype
  // e.g call, apply
  if (prop in Function.prototype) {
    // 'in' is used instead of hasOwnProperty for nodejs v0.10
    // which is inconsistent on root prototypes. It is safe
    // here because Function.prototype is a root object
    return false;
  }
  return true;
}

/**
 * Validate whether a method is safe.
 * Throws an error when that's not the case.
 * @param {Object} object
 * @param {string} method
 */
// TODO: merge this function into assign.js?
function validateSafeMethod (object, method) {
  if (!isSafeMethod(object, method)) {
    throw new Error('No access to method "' + method + '"');
  }
}

/**
 * Check whether a method is safe.
 * Throws an error when that's not the case (for example for `constructor`).
 * @param {Object} object
 * @param {string} method
 * @return {boolean} Returns true when safe, false otherwise
 */
function isSafeMethod (object, method) {
  if (!object || typeof object[method] !== 'function') {
    return false;
  }
  // UNSAFE: ghosted
  // e.g overridden toString
  // Note that IE10 doesn't support __proto__ and we can't do this check there.
  if (hasOwnProperty(object, method) &&
      (object.__proto__ && (method in object.__proto__))) {
    return false;
  }
  // SAFE: whitelisted
  // e.g toString
  if (hasOwnProperty(safeNativeMethods, method)) {
    return true;
  }
  // UNSAFE: inherited from Object prototype
  // e.g constructor
  if (method in Object.prototype) {
    // 'in' is used instead of hasOwnProperty for nodejs v0.10
    // which is inconsistent on root prototypes. It is safe
    // here because Object.prototype is a root object
    return false;
  }
  // UNSAFE: inherited from Function prototype
  // e.g call, apply
  if (method in Function.prototype) {
    // 'in' is used instead of hasOwnProperty for nodejs v0.10
    // which is inconsistent on root prototypes. It is safe
    // here because Function.prototype is a root object
    return false;
  }
  return true;
}

function isPlainObject (object) {
  return typeof object === 'object' && object && object.constructor === Object;
}

var safeNativeProperties = {
  length: true,
  name: true
};

var safeNativeMethods = {
  toString: true,
  valueOf: true,
  toLocaleString: true
};

exports.getSafeProperty = getSafeProperty;
exports.setSafeProperty = setSafeProperty;
exports.isSafeProperty = isSafeProperty;
exports.validateSafeMethod = validateSafeMethod;
exports.isSafeMethod = isSafeMethod;
exports.isPlainObject = isPlainObject;

},{"./object":48}],46:[function(require,module,exports){
'use strict';

var escape_latex = require('escape-latex')

exports.symbols = {
  // GREEK LETTERS
  Alpha: 'A',     alpha: '\\alpha',
  Beta: 'B',      beta: '\\beta',
  Gamma: '\\Gamma',    gamma: '\\gamma',
  Delta: '\\Delta',    delta: '\\delta',
  Epsilon: 'E',   epsilon: '\\epsilon',  varepsilon: '\\varepsilon',
  Zeta: 'Z',      zeta: '\\zeta',
  Eta: 'H',       eta: '\\eta',
  Theta: '\\Theta',    theta: '\\theta',    vartheta: '\\vartheta',
  Iota: 'I',      iota: '\\iota',
  Kappa: 'K',     kappa: '\\kappa',    varkappa: '\\varkappa',
  Lambda: '\\Lambda',   lambda: '\\lambda',
  Mu: 'M',        mu: '\\mu',
  Nu: 'N',        nu: '\\nu',
  Xi: '\\Xi',       xi: '\\xi',
  Omicron: 'O',   omicron: 'o',
  Pi: '\\Pi',       pi: '\\pi',       varpi: '\\varpi',
  Rho: 'P',       rho: '\\rho',      varrho: '\\varrho',
  Sigma: '\\Sigma',    sigma: '\\sigma',    varsigma: '\\varsigma',
  Tau: 'T',       tau: '\\tau',
  Upsilon: '\\Upsilon',  upsilon: '\\upsilon',
  Phi: '\\Phi',      phi: '\\phi',      varphi: '\\varphi',
  Chi: 'X',       chi: '\\chi',
  Psi: '\\Psi',      psi: '\\psi',
  Omega: '\\Omega',    omega: '\\omega',
  //logic
  'true': '\\mathrm{True}',
  'false': '\\mathrm{False}',
  //other
  i: 'i', //TODO use \i ??
  inf: '\\infty',
  Inf: '\\infty',
  infinity: '\\infty',
  Infinity: '\\infty',
  oo: '\\infty',
  lim: '\\lim',
  'undefined': '\\mathbf{?}'
};

exports.operators = {
  'transpose': '^\\top',
  'factorial': '!',
  'pow': '^',
  'dotPow': '.^\\wedge', //TODO find ideal solution
  'unaryPlus': '+',
  'unaryMinus': '-',
  'bitNot': '~', //TODO find ideal solution
  'not': '\\neg',
  'multiply': '\\cdot',
  'divide': '\\frac', //TODO how to handle that properly?
  'dotMultiply': '.\\cdot', //TODO find ideal solution
  'dotDivide': '.:', //TODO find ideal solution
  'mod': '\\mod',
  'add': '+',
  'subtract': '-',
  'to': '\\rightarrow',
  'leftShift': '<<',
  'rightArithShift': '>>',
  'rightLogShift': '>>>',
  'equal': '=',
  'unequal': '\\neq',
  'smaller': '<',
  'larger': '>',
  'smallerEq': '\\leq',
  'largerEq': '\\geq',
  'bitAnd': '\\&',
  'bitXor': '\\underline{|}',
  'bitOr': '|',
  'and': '\\wedge',
  'xor': '\\veebar',
  'or': '\\vee'
};

exports.defaultTemplate = '\\mathrm{${name}}\\left(${args}\\right)';

var units = {
  deg: '^\\circ'
};

exports.escape = function (string) {
  return escape_latex(string, {'preserveFormatting': true});
}

//@param {string} name
//@param {boolean} isUnit
exports.toSymbol = function (name, isUnit) {
  isUnit = typeof isUnit === 'undefined' ? false : isUnit;
  if (isUnit) {
    if (units.hasOwnProperty(name)) {
      return units[name];
    }

    return '\\mathrm{' + exports.escape(name) + '}';
  }

  if (exports.symbols.hasOwnProperty(name)) {
    return exports.symbols[name];
  }

  return exports.escape(name);
};

},{"escape-latex":2}],47:[function(require,module,exports){
'use strict';

/**
 * @typedef {{sign: '+' | '-' | '', coefficients: number[], exponent: number}} SplitValue
 */

/**
 * Test whether value is a number
 * @param {*} value
 * @return {boolean} isNumber
 */
exports.isNumber = function(value) {
  return typeof value === 'number';
};

/**
 * Check if a number is integer
 * @param {number | boolean} value
 * @return {boolean} isInteger
 */
exports.isInteger = function(value) {
  return isFinite(value)
      ? (value == Math.round(value))
      : false;
  // Note: we use ==, not ===, as we can have Booleans as well
};

/**
 * Calculate the sign of a number
 * @param {number} x
 * @returns {*}
 */
exports.sign = Math.sign || function(x) {
  if (x > 0) {
    return 1;
  }
  else if (x < 0) {
    return -1;
  }
  else {
    return 0;
  }
};

/**
 * Convert a number to a formatted string representation.
 *
 * Syntax:
 *
 *    format(value)
 *    format(value, options)
 *    format(value, precision)
 *    format(value, fn)
 *
 * Where:
 *
 *    {number} value   The value to be formatted
 *    {Object} options An object with formatting options. Available options:
 *                     {string} notation
 *                         Number notation. Choose from:
 *                         'fixed'          Always use regular number notation.
 *                                          For example '123.40' and '14000000'
 *                         'exponential'    Always use exponential notation.
 *                                          For example '1.234e+2' and '1.4e+7'
 *                         'engineering'    Always use engineering notation.
 *                                          For example '123.4e+0' and '14.0e+6'
 *                         'auto' (default) Regular number notation for numbers
 *                                          having an absolute value between
 *                                          `lower` and `upper` bounds, and uses
 *                                          exponential notation elsewhere.
 *                                          Lower bound is included, upper bound
 *                                          is excluded.
 *                                          For example '123.4' and '1.4e7'.
 *                     {number} precision   A number between 0 and 16 to round
 *                                          the digits of the number.
 *                                          In case of notations 'exponential' and
 *                                          'auto', `precision` defines the total
 *                                          number of significant digits returned
 *                                          and is undefined by default.
 *                                          In case of notation 'fixed',
 *                                          `precision` defines the number of
 *                                          significant digits after the decimal
 *                                          point, and is 0 by default.
 *                     {Object} exponential An object containing two parameters,
 *                                          {number} lower and {number} upper,
 *                                          used by notation 'auto' to determine
 *                                          when to return exponential notation.
 *                                          Default values are `lower=1e-3` and
 *                                          `upper=1e5`.
 *                                          Only applicable for notation `auto`.
 *    {Function} fn    A custom formatting function. Can be used to override the
 *                     built-in notations. Function `fn` is called with `value` as
 *                     parameter and must return a string. Is useful for example to
 *                     format all values inside a matrix in a particular way.
 *
 * Examples:
 *
 *    format(6.4);                                        // '6.4'
 *    format(1240000);                                    // '1.24e6'
 *    format(1/3);                                        // '0.3333333333333333'
 *    format(1/3, 3);                                     // '0.333'
 *    format(21385, 2);                                   // '21000'
 *    format(12.071, {notation: 'fixed'});                // '12'
 *    format(2.3,    {notation: 'fixed', precision: 2});  // '2.30'
 *    format(52.8,   {notation: 'exponential'});          // '5.28e+1'
 *    format(12345678, {notation: 'engineering'});        // '12.345678e+6'
 *
 * @param {number} value
 * @param {Object | Function | number} [options]
 * @return {string} str The formatted value
 */
exports.format = function(value, options) {
  if (typeof options === 'function') {
    // handle format(value, fn)
    return options(value);
  }

  // handle special cases
  if (value === Infinity) {
    return 'Infinity';
  }
  else if (value === -Infinity) {
    return '-Infinity';
  }
  else if (isNaN(value)) {
    return 'NaN';
  }

  // default values for options
  var notation = 'auto';
  var precision = undefined;

  if (options) {
    // determine notation from options
    if (options.notation) {
      notation = options.notation;
    }

    // determine precision from options
    if (exports.isNumber(options)) {
      precision = options;
    }
    else if (options.precision) {
      precision = options.precision;
    }
  }

  // handle the various notations
  switch (notation) {
    case 'fixed':
      return exports.toFixed(value, precision);

    case 'exponential':
      return exports.toExponential(value, precision);

    case 'engineering':
      return exports.toEngineering(value, precision);

    case 'auto':
      return exports
          .toPrecision(value, precision, options && options.exponential)

          // remove trailing zeros after the decimal point
          .replace(/((\.\d*?)(0+))($|e)/, function () {
            var digits = arguments[2];
            var e = arguments[4];
            return (digits !== '.') ? digits + e : e;
          });

    default:
      throw new Error('Unknown notation "' + notation + '". ' +
          'Choose "auto", "exponential", or "fixed".');
  }
};

/**
 * Split a number into sign, coefficients, and exponent
 * @param {number | string} value
 * @return {SplitValue}
 *              Returns an object containing sign, coefficients, and exponent
 */
exports.splitNumber = function (value) {
  // parse the input value
  var match = String(value).toLowerCase().match(/^0*?(-?)(\d+\.?\d*)(e([+-]?\d+))?$/);
  if (!match) {
    throw new SyntaxError('Invalid number ' + value);
  }

  var sign         = match[1];
  var digits       = match[2];
  var exponent     = parseFloat(match[4] || '0');

  var dot = digits.indexOf('.');
  exponent += (dot !== -1) ? (dot - 1) : (digits.length - 1);

  var coefficients = digits
      .replace('.', '')  // remove the dot (must be removed before removing leading zeros)
      .replace(/^0*/, function (zeros) {
        // remove leading zeros, add their count to the exponent
        exponent -= zeros.length;
        return '';
      })
      .replace(/0*$/, '') // remove trailing zeros
      .split('')
      .map(function (d) {
        return parseInt(d);
      });

  if (coefficients.length === 0) {
    coefficients.push(0);
    exponent++;
  }

  return {
    sign: sign,
    coefficients: coefficients,
    exponent: exponent
  };
};


/**
 * Format a number in engineering notation. Like '1.23e+6', '2.3e+0', '3.500e-3'
 * @param {number | string} value
 * @param {number} [precision=0]        Optional number of decimals after the
 *                                      decimal point. Zero by default.
 */
exports.toEngineering = function (value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }
  
  var rounded = exports.roundDigits(exports.splitNumber(value), precision);

  var e = rounded.exponent;
  var c = rounded.coefficients;

  // find nearest lower multiple of 3 for exponent
  var newExp = e % 3 === 0 ? e : (e < 0 ? (e - 3) - (e % 3) : e - (e % 3));

  // concatenate coefficients with necessary zeros
  var significandsDiff = e >= 0 ? e : Math.abs(newExp);

  // add zeros if necessary (for ex: 1e+8)
  if (c.length - 1 < significandsDiff) c = c.concat(zeros(significandsDiff - (c.length - 1)));

  // find difference in exponents
  var expDiff = Math.abs(e - newExp);

  var decimalIdx = 1;

  // push decimal index over by expDiff times
  while (--expDiff >= 0) decimalIdx++;

  // if all coefficient values are zero after the decimal point, don't add a decimal value.
  // otherwise concat with the rest of the coefficients
  var decimals = c.slice(decimalIdx).join('');
  var decimalVal = decimals.match(/[1-9]/) ? ('.' + decimals) : '';

  var str = c.slice(0, decimalIdx).join('') +
      decimalVal +
      'e' + (e >= 0 ? '+' : '') + newExp.toString();
  return rounded.sign + str;
};

/**
 * Format a number with fixed notation.
 * @param {number | string} value
 * @param {number} [precision=0]        Optional number of decimals after the
 *                                      decimal point. Zero by default.
 */
exports.toFixed = function (value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }

  var splitValue = exports.splitNumber(value)
  var rounded = exports.roundDigits(splitValue, splitValue.exponent + 1 + (precision || 0));
  var c = rounded.coefficients;
  var p = rounded.exponent + 1; // exponent may have changed

  // append zeros if needed
  var pp = p + (precision || 0);
  if (c.length < pp) {
    c = c.concat(zeros(pp - c.length));
  }

  // prepend zeros if needed
  if (p < 0) {
    c = zeros(-p + 1).concat(c);
    p = 1;
  }

  // insert a dot if needed
  if (precision) {
    c.splice(p, 0, (p === 0) ? '0.' : '.');
  }

  return rounded.sign + c.join('');
};

/**
 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
 * @param {number | string} value
 * @param {number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 */
exports.toExponential = function (value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }

  // round if needed, else create a clone
  var split = exports.splitNumber(value)
  var rounded = precision ? exports.roundDigits(split, precision) : split;
  var c = rounded.coefficients;
  var e = rounded.exponent;

  // append zeros if needed
  if (c.length < precision) {
    c = c.concat(zeros(precision - c.length));
  }

  // format as `C.CCCe+EEE` or `C.CCCe-EEE`
  var first = c.shift();
  return rounded.sign + first + (c.length > 0 ? ('.' + c.join('')) : '') +
      'e' + (e >= 0 ? '+' : '') + e;
}

/**
 * Format a number with a certain precision
 * @param {number | string} value
 * @param {number} [precision=undefined] Optional number of digits.
 * @param {{lower: number | undefined, upper: number | undefined}} [options]
 *                                       By default:
 *                                         lower = 1e-3 (excl)
 *                                         upper = 1e+5 (incl)
 * @return {string}
 */
exports.toPrecision = function (value, precision, options) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }

  // determine lower and upper bound for exponential notation.
  var lower = (options && options.lower !== undefined) ? options.lower : 1e-3;
  var upper = (options && options.upper !== undefined) ? options.upper : 1e+5;

  var split = exports.splitNumber(value)
  var abs = Math.abs(Math.pow(10, split.exponent));
  if (abs < lower || abs >= upper) {
    // exponential notation
    return exports.toExponential(value, precision);
  }
  else {
    var rounded = precision ? exports.roundDigits(split, precision) : split;
    var c = rounded.coefficients;
    var e = rounded.exponent;

    // append trailing zeros
    if (c.length < precision) {
      c = c.concat(zeros(precision - c.length));
    }

    // append trailing zeros
    // TODO: simplify the next statement
    c = c.concat(zeros(e - c.length + 1 +
        (c.length < precision ? precision - c.length : 0)));

    // prepend zeros
    c = zeros(-e).concat(c);

    var dot = e > 0 ? e : 0;
    if (dot < c.length - 1) {
      c.splice(dot + 1, 0, '.');
    }

    return rounded.sign + c.join('');
  }
}

/**
 * Round the number of digits of a number *
 * @param {SplitValue} split       A value split with .splitNumber(value)
 * @param {number} precision  A positive integer
 * @return {SplitValue}
 *              Returns an object containing sign, coefficients, and exponent
 *              with rounded digits
 */
exports.roundDigits = function (split, precision) {
  // create a clone
  var rounded = {
    sign: split.sign,
    coefficients: split.coefficients,
    exponent: split.exponent
  }
  var c = rounded.coefficients;

  // prepend zeros if needed
  while (precision <= 0) {
    c.unshift(0);
    rounded.exponent++;
    precision++;
  }

  if (c.length > precision) {
    var removed = c.splice(precision, c.length - precision);

    if (removed[0] >= 5) {
      var i = precision - 1;
      c[i]++;
      while (c[i] === 10) {
        c.pop();
        if (i === 0) {
          c.unshift(0);
          rounded.exponent++;
          i++;
        }
        i--;
        c[i]++;
      }
    }
  }

  return rounded;
};

/**
 * Create an array filled with zeros.
 * @param {number} length
 * @return {Array}
 */
function zeros(length) {
  var arr = [];
  for (var i = 0; i < length; i++) {
    arr.push(0);
  }
  return arr;
}

/**
 * Count the number of significant digits of a number.
 *
 * For example:
 *   2.34 returns 3
 *   0.0034 returns 2
 *   120.5e+30 returns 4
 *
 * @param {number} value
 * @return {number} digits   Number of significant digits
 */
exports.digits = function(value) {
  return value
      .toExponential()
      .replace(/e.*$/, '')          // remove exponential notation
      .replace( /^0\.?0*|\./, '')   // remove decimal point and leading zeros
      .length
};

/**
 * Minimum number added to one that makes the result different than one
 */
exports.DBL_EPSILON = Number.EPSILON || 2.2204460492503130808472633361816E-16;

/**
 * Compares two floating point numbers.
 * @param {number} x          First value to compare
 * @param {number} y          Second value to compare
 * @param {number} [epsilon]  The maximum relative difference between x and y
 *                            If epsilon is undefined or null, the function will
 *                            test whether x and y are exactly equal.
 * @return {boolean} whether the two numbers are nearly equal
*/
exports.nearlyEqual = function(x, y, epsilon) {
  // if epsilon is null or undefined, test whether x and y are exactly equal
  if (epsilon == null) {
    return x == y;
  }

  // use "==" operator, handles infinities
  if (x == y) {
    return true;
  }

  // NaN
  if (isNaN(x) || isNaN(y)) {
    return false;
  }

  // at this point x and y should be finite
  if(isFinite(x) && isFinite(y)) {
    // check numbers are very close, needed when comparing numbers near zero
    var diff = Math.abs(x - y);
    if (diff < exports.DBL_EPSILON) {
      return true;
    }
    else {
      // use relative error
      return diff <= Math.max(Math.abs(x), Math.abs(y)) * epsilon;
    }
  }

  // Infinite and Number or negative Infinite and positive Infinite cases
  return false;
};

},{}],48:[function(require,module,exports){
'use strict';

var isBigNumber = require('./bignumber/isBigNumber');

/**
 * Clone an object
 *
 *     clone(x)
 *
 * Can clone any primitive type, array, and object.
 * If x has a function clone, this function will be invoked to clone the object.
 *
 * @param {*} x
 * @return {*} clone
 */
exports.clone = function clone(x) {
  var type = typeof x;

  // immutable primitive types
  if (type === 'number' || type === 'string' || type === 'boolean' ||
      x === null || x === undefined) {
    return x;
  }

  // use clone function of the object when available
  if (typeof x.clone === 'function') {
    return x.clone();
  }

  // array
  if (Array.isArray(x)) {
    return x.map(function (value) {
      return clone(value);
    });
  }

  if (x instanceof Number)    return new Number(x.valueOf());
  if (x instanceof String)    return new String(x.valueOf());
  if (x instanceof Boolean)   return new Boolean(x.valueOf());
  if (x instanceof Date)      return new Date(x.valueOf());
  if (isBigNumber(x))         return x; // bignumbers are immutable
  if (x instanceof RegExp)  throw new TypeError('Cannot clone ' + x);  // TODO: clone a RegExp

  // object
  return exports.map(x, clone);
};

/**
 * Apply map to all properties of an object
 * @param {Object} object
 * @param {function} callback
 * @return {Object} Returns a copy of the object with mapped properties
 */
exports.map = function(object, callback) {
  var clone = {};

  for (var key in object) {
    if (exports.hasOwnProperty(object, key)) {
      clone[key] = callback(object[key]);
    }
  }

  return clone;
}

/**
 * Extend object a with the properties of object b
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 */
exports.extend = function(a, b) {
  for (var prop in b) {
    if (exports.hasOwnProperty(b, prop)) {
      a[prop] = b[prop];
    }
  }
  return a;
};

/**
 * Deep extend an object a with the properties of object b
 * @param {Object} a
 * @param {Object} b
 * @returns {Object}
 */
exports.deepExtend = function deepExtend (a, b) {
  // TODO: add support for Arrays to deepExtend
  if (Array.isArray(b)) {
    throw new TypeError('Arrays are not supported by deepExtend');
  }

  for (var prop in b) {
    if (exports.hasOwnProperty(b, prop)) {
      if (b[prop] && b[prop].constructor === Object) {
        if (a[prop] === undefined) {
          a[prop] = {};
        }
        if (a[prop].constructor === Object) {
          deepExtend(a[prop], b[prop]);
        }
        else {
          a[prop] = b[prop];
        }
      } else if (Array.isArray(b[prop])) {
        throw new TypeError('Arrays are not supported by deepExtend');
      } else {
        a[prop] = b[prop];
      }
    }
  }
  return a;
};

/**
 * Deep test equality of all fields in two pairs of arrays or objects.
 * @param {Array | Object} a
 * @param {Array | Object} b
 * @returns {boolean}
 */
exports.deepEqual = function deepEqual (a, b) {
  var prop, i, len;
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false;
    }

    if (a.length != b.length) {
      return false;
    }

    for (i = 0, len = a.length; i < len; i++) {
      if (!exports.deepEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  else if (a instanceof Object) {
    if (Array.isArray(b) || !(b instanceof Object)) {
      return false;
    }

    for (prop in a) {
      //noinspection JSUnfilteredForInLoop
      if (!exports.deepEqual(a[prop], b[prop])) {
        return false;
      }
    }
    for (prop in b) {
      //noinspection JSUnfilteredForInLoop
      if (!exports.deepEqual(a[prop], b[prop])) {
        return false;
      }
    }
    return true;
  }
  else {
    return (typeof a === typeof b) && (a == b);
  }
};

/**
 * Test whether the current JavaScript engine supports Object.defineProperty
 * @returns {boolean} returns true if supported
 */
exports.canDefineProperty = function () {
  // test needed for broken IE8 implementation
  try {
    if (Object.defineProperty) {
      Object.defineProperty({}, 'x', { get: function () {} });
      return true;
    }
  } catch (e) {}

  return false;
};

/**
 * Attach a lazy loading property to a constant.
 * The given function `fn` is called once when the property is first requested.
 * On older browsers (<IE8), the function will fall back to direct evaluation
 * of the properties value.
 * @param {Object} object   Object where to add the property
 * @param {string} prop     Property name
 * @param {Function} fn     Function returning the property value. Called
 *                          without arguments.
 */
exports.lazy = function (object, prop, fn) {
  if (exports.canDefineProperty()) {
    var _uninitialized = true;
    var _value;
    Object.defineProperty(object, prop, {
      get: function () {
        if (_uninitialized) {
          _value = fn();
          _uninitialized = false;
        }
        return _value;
      },

      set: function (value) {
        _value = value;
        _uninitialized = false;
      },

      configurable: true,
      enumerable: true
    });
  }
  else {
    // fall back to immediate evaluation
    object[prop] = fn();
  }
};

/**
 * Traverse a path into an object.
 * When a namespace is missing, it will be created
 * @param {Object} object
 * @param {string} path   A dot separated string like 'name.space'
 * @return {Object} Returns the object at the end of the path
 */
exports.traverse = function(object, path) {
  var obj = object;

  if (path) {
    var names = path.split('.');
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      if (!(name in obj)) {
        obj[name] = {};
      }
      obj = obj[name];
    }
  }

  return obj;
};

/**
 * A safe hasOwnProperty
 * @param {Object} object
 * @param {string} property
 */
exports.hasOwnProperty = function (object, property) {
  return object && Object.hasOwnProperty.call(object, property);
}

/**
 * Test whether an object is a factory. a factory has fields:
 *
 * - factory: function (type: Object, config: Object, load: function, typed: function [, math: Object])   (required)
 * - name: string (optional)
 * - path: string    A dot separated path (optional)
 * - math: boolean   If true (false by default), the math namespace is passed
 *                   as fifth argument of the factory function
 *
 * @param {*} object
 * @returns {boolean}
 */
exports.isFactory = function (object) {
  return object && typeof object.factory === 'function';
};

},{"./bignumber/isBigNumber":43}],49:[function(require,module,exports){
'use strict';

var formatNumber = require('./number').format;
var formatBigNumber = require('./bignumber/formatter').format;
var isBigNumber = require('./bignumber/isBigNumber');

/**
 * Test whether value is a string
 * @param {*} value
 * @return {boolean} isString
 */
exports.isString = function(value) {
  return typeof value === 'string';
};

/**
 * Check if a text ends with a certain string.
 * @param {string} text
 * @param {string} search
 */
exports.endsWith = function(text, search) {
  var start = text.length - search.length;
  var end = text.length;
  return (text.substring(start, end) === search);
};

/**
 * Format a value of any type into a string.
 *
 * Usage:
 *     math.format(value)
 *     math.format(value, precision)
 *
 * When value is a function:
 *
 * - When the function has a property `syntax`, it returns this
 *   syntax description.
 * - In other cases, a string `'function'` is returned.
 *
 * When `value` is an Object:
 *
 * - When the object contains a property `format` being a function, this
 *   function is invoked as `value.format(options)` and the result is returned.
 * - When the object has its own `toString` method, this method is invoked
 *   and the result is returned.
 * - In other cases the function will loop over all object properties and
 *   return JSON object notation like '{"a": 2, "b": 3}'.
 *
 * Example usage:
 *     math.format(2/7);                // '0.2857142857142857'
 *     math.format(math.pi, 3);         // '3.14'
 *     math.format(new Complex(2, 3));  // '2 + 3i'
 *     math.format('hello');            // '"hello"'
 *
 * @param {*} value             Value to be stringified
 * @param {Object | number | Function} [options]  Formatting options. See
 *                                                lib/utils/number:format for a
 *                                                description of the available
 *                                                options.
 * @return {string} str
 */
exports.format = function(value, options) {
  if (typeof value === 'number') {
    return formatNumber(value, options);
  }

  if (isBigNumber(value)) {
    return formatBigNumber(value, options);
  }

  // note: we use unsafe duck-typing here to check for Fractions, this is
  // ok here since we're only invoking toString or concatenating its values
  if (looksLikeFraction(value)) {
    if (!options || options.fraction !== 'decimal') {
      // output as ratio, like '1/3'
      return (value.s * value.n) + '/' + value.d;
    }
    else {
      // output as decimal, like '0.(3)'
      return value.toString();
    }
  }

  if (Array.isArray(value)) {
    return formatArray(value, options);
  }

  if (exports.isString(value)) {
    return '"' + value + '"';
  }

  if (typeof value === 'function') {
    return value.syntax ? String(value.syntax) : 'function';
  }

  if (value && typeof value === 'object') {
    if (typeof value.format === 'function') {
      return value.format(options);
    }
    else if (value && value.toString() !== {}.toString()) {
      // this object has a non-native toString method, use that one
      return value.toString();
    }
    else {
      var entries = [];

      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          entries.push('"' + key + '": ' + exports.format(value[key], options));
        }
      }

      return '{' + entries.join(', ') + '}';
    }
  }

  return String(value);
};

/**
 * Stringify a value into a string enclosed in double quotes.
 * Unescaped double quotes and backslashes inside the value are escaped.
 * @param {*} value
 * @return {string}
 */
exports.stringify = function (value) {
  var text = String(value);
  var escaped = '';
  var i = 0;
  while (i < text.length) {
    var c = text.charAt(i);

    if (c === '\\') {
      escaped += c;
      i++;

      c = text.charAt(i);
      if (c === '' || '"\\/bfnrtu'.indexOf(c) === -1) {
        escaped += '\\';  // no valid escape character -> escape it
      }
      escaped += c;
    }
    else if (c === '"') {
      escaped += '\\"';
    }
    else {
      escaped += c;
    }
    i++;
  }

  return '"' + escaped + '"';
}

/**
 * Escape special HTML characters
 * @param {*} value
 * @return {string}
 */
exports.escape = function (value) {
  var text = String(value);
  text = text.replace(/&/g, '&amp;')
			 .replace(/"/g, '&quot;')
			 .replace(/'/g, '&#39;')
			 .replace(/</g, '&lt;')
			 .replace(/>/g, '&gt;');
  
  return text;
}

/**
 * Recursively format an n-dimensional matrix
 * Example output: "[[1, 2], [3, 4]]"
 * @param {Array} array
 * @param {Object | number | Function} [options]  Formatting options. See
 *                                                lib/utils/number:format for a
 *                                                description of the available
 *                                                options.
 * @returns {string} str
 */
function formatArray (array, options) {
  if (Array.isArray(array)) {
    var str = '[';
    var len = array.length;
    for (var i = 0; i < len; i++) {
      if (i != 0) {
        str += ', ';
      }
      str += formatArray(array[i], options);
    }
    str += ']';
    return str;
  }
  else {
    return exports.format(array, options);
  }
}

/**
 * Check whether a value looks like a Fraction (unsafe duck-type check)
 * @param {*} value
 * @return {boolean}
 */
function looksLikeFraction (value) {
  return (value &&
      typeof value === 'object' &&
      typeof value.s === 'number' &&
      typeof value.n === 'number' &&
      typeof value.d === 'number') || false;
}

},{"./bignumber/formatter":42,"./bignumber/isBigNumber":43,"./number":47}],50:[function(require,module,exports){
'use strict';

/**
 * Determine the type of a variable
 *
 *     type(x)
 *
 * The following types are recognized:
 *
 *     'undefined'
 *     'null'
 *     'boolean'
 *     'number'
 *     'string'
 *     'Array'
 *     'Function'
 *     'Date'
 *     'RegExp'
 *     'Object'
 *
 * @param {*} x
 * @return {string} Returns the name of the type. Primitive types are lower case,
 *                  non-primitive types are upper-camel-case.
 *                  For example 'number', 'string', 'Array', 'Date'.
 */
exports.type = function(x) {
  var type = typeof x;

  if (type === 'object') {
    if (x === null)           return 'null';
    if (Array.isArray(x))     return 'Array';
    if (x instanceof Date)    return 'Date';
    if (x instanceof RegExp)  return 'RegExp';
    if (x instanceof Boolean) return 'boolean';
    if (x instanceof Number)  return 'number';
    if (x instanceof String)  return 'string';

    return 'Object';
  }

  if (type === 'function')    return 'Function';

  return type;
};

},{}]},{},[1]);
