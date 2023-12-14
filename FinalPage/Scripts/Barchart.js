barChart();

function barChart() {
  // Set dimensions for the graph
  let margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // Color for the chart text
  let chartColor = "#f1e4a0";

  // SVG gets appended to the page
  let svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .style("color", "white");

  // Tooltip object gets appended to the visualisation. It will be used to display total value of each bar, by the mouse
  let Tooltip = d3
    .select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

  // Loads data from our database and saves it in the fishdata variable
  d3.json("https://dragefiskerfarlige.onrender.com/population").then(function (
    data
  ) {
    const fishdata = data.LionfishCloud;

    // Gives the animation function to the button by the chart
    document.getElementById("barKnap").onclick = function () {
      barAnimation();
    };

    // X-axis
    let x = d3
      .scaleBand()
      .range([0, width])
      .domain(
        fishdata.map(function (fishdata) {
          return fishdata.year;
        })
      )
      .padding(0.2);

    // Gives the chart text on the x-axis a slight tilt
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("fill", chartColor);

    // Y-axis
    let y = d3.scaleLinear().domain([0, 13000]).range([height, 0]);
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", chartColor);

    // Chart title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "36px")
      .style("fill", chartColor)
      .text("Antal Dragefisk i Caribien");

    // Data source link
    svg
      .append("text")
      .attr("x", 120)
      .attr("y", height + 50)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("fill", chartColor)
      .text(
        "Ref: https://nas.er.usgs.gov/queries/collectioninfo.aspx?SpeciesID=963"
      );

    // Barchart gets created with mouseover/leave/move
    svg
      .selectAll("mybar")
      .data(fishdata)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.year);
      })
      .attr("y", function (d) {
        return y(0); // Height of bars are 0 at the moment, but will be animated to their real height afterwards
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return height - y(0);
      })
      .attr("fill", "#69b3a2")
      .attr("style", "outline: thin solid white")
      .attr("id", function (d) {
        return d.lionfish_pop;
      })
      // Bars changes color on mouseover
      .on("mouseover", function (d) {
        Tooltip.style("opacity", 1).html("Population: " + this.id);
        d3.select(this).style("stroke", "black").style("opacity", 0.8);
      })
      // Tooltip gets attached to the mouse when moving over the bar
      .on("mousemove", function (d) {
        let pos = d3.mouse(this);
        Tooltip.style("left", pos[0] + 180 + "px").style(
          "top",
          pos[1] + 750 + "px"
        );
      })
      .on("mouseleave", function (d) {
        Tooltip.style("opacity", 0);
        d3.select(this).style("stroke", "none").style("opacity", 1);
      });

    // Animation for bars
    function barAnimation() {
      svg
        .selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", function (d) {
          return y(d.lionfish_pop);
        })
        .attr("height", function (d) {
          return height - y(d.lionfish_pop);
        })
        .delay(function (d, i) {
          return i * 100;
        });
    }
  });
}
