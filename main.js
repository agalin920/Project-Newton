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