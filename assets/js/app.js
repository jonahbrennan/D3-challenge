// @TODO: YOUR CODE HERE!
var svgWidth = 800;
var svgHeight = 700;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 70
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "grid");

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";
var chosenYAxis = "poverty";    // NEWYAX

// function used for updating x-scale var upon click on axis label
function xScale(demoData, chosenXAxis) {
  // create scales
  if (chosenXAxis === "age") {
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(demoData, d => d[chosenXAxis]) * .97,
      d3.max(demoData, d => d[chosenXAxis]) * 1
    ])
    .range([0, width]);

  return xLinearScale;
  }
  else {
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(demoData, d => d[chosenXAxis]) * .82,
      d3.max(demoData, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;
  }

}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}


// function used for updating y-scale var upon click on axis label //NEWYAX
function yScale(demoData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.max(demoData, d => d[chosenYAxis]) * 1.1,
        d3.min(demoData, d => d[chosenYAxis]) * .9
      ])
      .range([0, height]);

    console.log(chosenYAxis);
    return yLinearScale;
  }
  
  // function used for updating yAxis var upon click on axis label  //NEWYAX
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);

    console.log("NEWYAX");
    return yAxis;
  }

/////////////////////////

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderCirclesLabels(circlesLabels, newXScale, chosenXaxis) {

    circlesLabels.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));
  
    return circlesLabels;
  }
  function renderCirclesPics(circlesPicsGroup, newXScale, chosenXaxis) {

    circlesPicsGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));
  
    return circlesPicsGroup;
  }
// function used for updating Y circles group with a transition to
// new circles
  function renderYCircles(circlesGroup, newYScale, chosenYaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }
  
  function renderYCirclesLabels(circlesLabels, newYScale, chosenYaxis) {
  
      circlesLabels.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[chosenYaxis]));
    
      return circlesLabels;
    }

  function renderYCirclesPics(circlesPicsGroup, newYScale, chosenYaxis) {

      circlesPicsGroup.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[chosenYAxis]));
    
      return circlesPicsGroup;
    }

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "age") {
    var label = "Age:";
  }
  else {
    var label = "Lacks Healthcare (%):";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([0, -70])
    .html(function(d) {
      return (`${d.state}<br>${label}${d[chosenXAxis]}<br>${"Poverty Rate:"} ${d['poverty']}%<br>${"Average Income: $"}${d['income']}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })

    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv", function(err, demoData) {
  if (err) throw err;

  // parse data
  demoData.forEach(function(data) {
    data.age = +data.age;
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.smokes = +data.smokes;
    data.income = +data.income;
    data.party = data.party;
    // console.log(data.party);
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(demoData, chosenXAxis);
  var yLinearScale = yScale(demoData, chosenYAxis);

  // Create y scale function
//   var yLinearScale = d3.scaleLinear()
//     .domain([d3.min(demoData, d => d.poverty-1), d3.max(demoData, d => d.poverty)])
//     .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);


  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(demoData)
    .enter()
    .append("g").attr("id", "labl")
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r",  d => d.obesity)
    .style("stroke", d => d.error ? "red" : "white")
    .style("stroke-width", "1.5")
    .attr("fill", function(d) {
        if (d.smokes > 20) {
          return "red";
        } else if (d.smokes > 15) {
          return "orange";
        }
        return "green";
      })
    .attr("opacity",  d => (.01*d.smokes)*6);

    console.log(circlesGroup.attr("opacity"));

    var circlesPicsGroup = chartGroup.selectAll("image")
    .data(demoData)
    .enter()
    .append("g").attr("id", "labl")
    .append("image")
    .attr("pointer-events", "none")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("transform", "translate(-12, -28)")
    .attr("xlink:href", function(d) {
      if (d.party === "R") {
        return "https://i.imgur.com/pYSygdW.png";
      } else if (d.party === "D") {
        // return "https://upload.wikimedia.org/wikipedia/commons/0/02/DemocraticLogo.svg";
        return "https://i.imgur.com/vEYOV4k.png";
      }
      return "";
    })
    .attr("width", d => d.obesity*1.6)
    .attr("height", d => d.obesity*1.6);

  /* Create the text for each circle */
  var circlesLabels = chartGroup.selectAll("#labl").raise()
    .append("text")
    .text(function(d) {
      return d.abbr
    })
    .attr("font-size", d => d.obesity*.7)
    .style('fill', 'white')
    .attr("text-anchor", "middle") 
    .attr("pointer-events", "none")
    .attr("dx", function(d){return -10})
    .attr("dy", function(d){return   15})
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]));


    
  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener
    .classed("active", true)
    .text("Average Age");

  var healthcareLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Lacks HealthCare (%)");

  // Create group for  2 y- axis labels
  var labelsYGroup = chartGroup.append("g")
  .attr("transform", `translate(${0}, ${0})`);
  // append y axis
  var povertyLabel = labelsYGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty Rate");

var incomeLabel = labelsYGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y",22 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Average Income ($)");
  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

/////////////////////////////////
//// gridlines in x axis function
// function make_x_gridlines() {		
//   return d3.axisBottom(xLinearScale)
//       .ticks(5)
// }
// // gridlines in y axis function
// function make_y_gridlines() {		
//   return d3.axisLeft(yLinearScale)
//       .ticks(5)
// }

// // add the X gridlines
// svg.append("g")			
//     .attr("class", "grid")
//     // .attr("transform", "translate(0," + height + ")")
//     .attr("transform", `translate(0, ${height})`)
    
//     .call(make_x_gridlines()
//         .tickSize(-height)
//         .tickFormat("")
//     )
// // add the Y gridlines
// svg.append("g")			
//     .attr("class", "grid")
//     .call(make_y_gridlines()
//         .tickSize(-width)
//         .tickFormat("")
//     )

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        console.log(value)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(demoData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
        circlesLabels = renderCirclesLabels(circlesLabels, xLinearScale, chosenXAxis);
        circlesPicsGroup = renderCirclesPics(circlesPicsGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

      // y axis labels event listener    //NEWYAX
  labelsYGroup.selectAll("text")    
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenXAxis with value
      chosenYAxis = value;
      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates y scale for new data
      yLinearScale = yScale(demoData, chosenYAxis);

      // updates y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);   //NEWYAX

      // updates circles with new x values
      circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
      circlesLabels = renderYCirclesLabels(circlesLabels, yLinearScale, chosenYAxis);
      circlesPicsGroup = renderYCirclesPics(circlesPicsGroup, yLinearScale, chosenYAxis);

      // updates tooltips with new info
    //   circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === "poverty") {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });

});
