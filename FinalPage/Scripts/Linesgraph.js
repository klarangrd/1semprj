Linegraph();

function Linegraph() {
  //put everything inside a function due to errors with having the same names like margin, width, height etc
  //setting up the area of the svg
  const margin = { top: 30, right: 30, bottom: 50, left: 70 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  //setting up the svg
  const svg = d3
    .select("#lineGraph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .style("color", "white");

  // inserting the data from our database
  d3.json("https://dragefiskerfarlige.onrender.com/population")
    .then(function (data) {
      const lineData = data.LionfishCloud; //specifying the name on our database

      // x axis scale
      const xScale = d3
        .scaleLinear()
        .domain(d3.extent(lineData, (d) => d.year)) //setting the x scale to be the years
        .range([0, width]);

      // y axis scale
      const yScale = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(lineData, (d) => Math.max(d.lionfish_pop, d.shark_pop)),
        ]) //setting the y scale to be the max of the data
        .range([height, 0]);

      // line for lionfish and reef sharks
      const lionfishLine = d3
        .line()
        .curve(d3.curveMonotoneX) // smoothing the line
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.lionfish_pop));

      const reefSharkLine = d3
        .line()
        .curve(d3.curveMonotoneX) // smoothing the line
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.shark_pop));

      // here we create a tooltip for the graph
      const tooltip = d3
        .select("#lineGraph")
        .append("div")
        .attr("class", "tooltip");

      // Add a transparent overlay to capture mouse events
      svg
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all") //makes it react to all mouse events
        .on("mouseover", function () {
          tooltip.style("display", null); //when mouse enters, the tooltip is displayed
        })
        .on("mouseout", function () {
          tooltip.style("display", "none"); //when mouse leaves, the tooltip is hidden
        });

      function updateTooltip() {
        const xValue = xScale.invert(d3.mouse(this)[0]); //this gets the x values from the mouse's position
        const bisect = d3.bisector((d) => d.year).left;
        const index = bisect(lineData, xValue, 1); //bisect + index finds the x value on the line graph that the mouse is closest to
        const dataPoint = lineData[index - 1]; //retrieves the data when the data matches the line above
        let id = d3.event.target.id; //

        let value =
          id == "shark" ? dataPoint.shark_pop : dataPoint.lionfish_pop; //value should be shark if sharkpop otherwise lionfish

        tooltip
          .html(
            `<strong>Year:</strong> ${dataPoint.year}<br><strong>${
              id == "shark" ? "Shark" : "Lionfish"
            } Population:</strong>${value}`
          ) //value
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      }

      // lionfish line
      svg
        .append("path")
        .data([lineData])
        .attr("class", "line lionfish-line")
        .attr("id", "lionfish")
        .attr("d", lionfishLine)
        .attr("stroke-width", 3.5)
        .style("fill", "none")
        .on("mouseover", function () {
          tooltip.style("display", "block");
        })
        .on("mouseout", function () {
          tooltip.style("display", "none");
        })
        .on("mousemove", updateTooltip); //updates the content and position of it based on mouse

      // Add lionfish label
      svg
        .append("text")
        .attr("class", "line-label lionfish-label")
        .attr("x", width - 250)
        .attr("y", yScale(lineData[lineData.length - 1].lionfish_pop))
        .text("Lionfish")
        .style("display", "none");

      // reef shark line
      svg
        .append("path")
        .data([lineData])
        .attr("class", "line reefshark-line")
        .attr("id", "shark")
        .attr("d", reefSharkLine)
        .attr("stroke-width", 3.5)
        .style("fill", "none")
        .on("mouseover", function () {
          tooltip.style("display", "block");
        })
        .on("mouseout", function () {
          tooltip.style("display", "none");
        })
        .on("mousemove", updateTooltip); //updates the content and position of it based on mouse

      // Add reef shark label
      svg
        .append("text")
        .attr("class", "line-label reefshark-label")
        .attr("x", width - 200)
        .attr("y", yScale(lineData[lineData.length - 5].shark_pop))
        .text("Reef Shark")
        .style("display", "none");

      // x-axis
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .style("stroke", "#f1e4a0");

      // y-axis
      svg.append("g").call(d3.axisLeft(yScale)).style("stroke", "#f1e4a0");

      // x-axis label
      svg
        .append("text")
        .attr(
          "transform",
          "translate(" + width / 2 + " ," + (height + margin.top + 10) + ")"
        )
        .style("text-anchor", "middle")
        .text("Year")
        .style("font-size", "20px")
        .style("fill", "#f1e4a0");

      // y-axis label
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Population")
        .style("font-size", "20px")
        .style("fill", "#f1e4a0");

      // Title
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("text-decoration", "underline")
        .style("fill", "#f1e4a0")
        .text("Lionfish vs Reef Shark Population (2010-2018)");

      // Data reference
      svg
        .append("text")
        .attr("x", 120)
        .attr("y", height + 30)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "#f1e4a0")
        .text(
          "Ref: https://nas.er.usgs.gov/queries/collectioninfo.aspx?SpeciesID=963"
        );

      svg
        .append("text")
        .attr("x", 40)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "#f1e4a0")
        .text("github.com/mamacneil/FinPrint");

      // Box 1 (Lionfish)
      https: svg
        .append("rect")
        .attr("x", width - 90)
        .attr("y", 10)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", "#d94d16");

      svg
        .append("text")
        .attr("x", width - 65)
        .attr("y", 25)
        .text("Lionfish")
        .style("font-size", "15px")
        .style("fill", "white");

      // Box 2 (Reef Shark)
      svg
        .append("rect")
        .attr("x", width - 90)
        .attr("y", 40)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", "#13cbd1");

      svg
        .append("text")
        .attr("x", width - 65)
        .attr("y", 55)
        .text("Reef Shark")
        .style("font-size", "15px")
        .style("fill", "white");

      // hiding the stroke before the button is clicked
      d3.selectAll(".line").style("stroke", "none");

      // showing the
      window.showStrokes = function () {
        d3.select(".lionfish-line").style("stroke", "#d94d16");
        d3.select(".reefshark-line").style("stroke", "#13cbd1");
      };
    })
    .catch((error) => console.error("Error loading data:", error));
}
