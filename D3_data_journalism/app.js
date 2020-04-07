var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 10,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("class", "chart")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



// Import Data
d3.csv("data.csv").then(function(newsdata) {

    console.log(newsdata)

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    newsdata.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(newsdata, d => d.poverty) * 0.8,
            d3.max(newsdata, d => d.poverty) * 1.2])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(newsdata, d => d.healthcare) * 0.8,
        d3.max(newsdata, d => d.healthcare) * 1.2])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(newsdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("class", "stateCircle")
    .attr("r", "15");

    var circleLabels = chartGroup.selectAll(null)
    .data(newsdata)
    .enter()
    .append("text");

    circleLabels.attr("x", function(d){
        return xLinearScale(d.poverty);
    })
    .attr("y", function(d){
        return yLinearScale(d.healthcare);
    })
    .text(function(d){
        return d.abbr;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .text("In Poverty (%)");
      
  }).catch(function(error) {
    console.log(error);
  });
