// @TODO: YOUR CODE HERE!
var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";

// function used for updating x-scale var upon click on axis label
function xScale(demoData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(demoData, d => d[chosenXAxis]) * .9,
      d3.max(demoData, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

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
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
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
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(demoData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(demoData, d => d.poverty-1), d3.max(demoData, d => d.poverty)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(demoData)
    .enter()
    .append("g").attr("id", "labl")
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", 12)
    .style("stroke", d => d.error ? "red" : "white")
    .style("stroke-width", "1.5")
    .attr("fill", "orange")
    .attr("opacity", ".4");
    // .append("text", d => demoData.abbr );

    // .style("stroke", "white")
    // .style("stroke-width", "1");
    
  /* Create the text for each block */
  var circlesLabels = chartGroup.selectAll("#labl")
    .append("text")
    .text(function(d) {
      return d.abbr
    })
    .attr("dx", function(d){return -15})
    .attr("dy", function(d){return   5})
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.poverty));
    // .attr({
    //   "text-anchor": "middle",
    //   "color": "black",
    //   "font-size": "10"
    // //   "font-size": function(d) {
    // //     return d.r / ((d.r * 10) / 100);
    // //   },
    // //   "dy": function(d) {
    // //     return d.r / ((d.r * 25) / 100);
    // //   }
    // });

  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener
    .classed("active", true)
    .text("Age of Sample");

  var healthcareLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Lacks HealthCare (%)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Poverty Rate");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(demoData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
        circlesLabels = renderCirclesLabels(circlesLabels, xLinearScale, chosenXAxis);

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
});
