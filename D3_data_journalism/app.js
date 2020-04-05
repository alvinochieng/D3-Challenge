// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Loading data into a csv.
d3.csv("data.csv").then(function(error, newsdata){

  if (error) throw (error);
  console.log(newsdata)

  // parsing data as numbers
    newsdata.forEach(function(data){
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Creating scale functions
    var xLinearScale = d3.scaleLinear()
    .domain([20, d3.max(newsdata, d => d.poverty)])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(newsdata, d => d.healthcare)])
    .range([height, 0]);

    // creating axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // appending axes to chart
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    // creating circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(newsdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    // adding labels to the circles
    var labels = chartGroup.selectAll(null)
    .data(newsdata)
    .enter()
    .append("text");

    labels.attr("x", function(d){
      return  xLinearScale(d.poverty);
    })

    .attr("y", function(d){
      return  yLinearScale(d.healthcare);
    })
    .text(function(d){
      return d.abbr;
    })
    .attr("font-family", "Algerian")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white")

     // Initialize toolTip
     var toolTip = d3.tip()
     .attr("class", "tooltip")
     .offset([80, -60])
     .html(function(d) {
       return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
     });

     // create toolTip in the chart
     chartGroup.call(toolTip);

     // create event listeners 
     circlesGroup.on("click", function(data) {
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
  .attr("class", "axisText")
  .text("Lacks Healthcare (%)");

  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  .attr("class", "axisText")
  .text("In Poverty (%)");

}).catch(function(error) {
  console.log(error);
});
