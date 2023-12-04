// Sætter dimensioner for grafen
let margin = { top: 30, right: 30, bottom: 70, left: 60 },
  width = 650 - margin.left - margin.right,
  height = 650 - margin.top - margin.bottom;

// SVGen bliver appended til siden
let svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Tooltip objekt appendes til siden. Skal bruges senere til at vise absolutte tal på grafen
let Tooltip = d3
  .select("#Tooltip")
  .append("div")
  .style("opacity", 0)
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")
  .style("position", "absolute");

// Loader data og gemmer det i fishdata
d3.json("http://localhost:3000/population").then(function (data) {
  const fishdata = data.LionfishCloud;

  // X-akse
  let x = d3
    .scaleBand()
    .range([0, width])
    .domain(
      fishdata.map(function (fishdata) {
        return fishdata.year;
      })
    )
    .padding(0.2);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Y-akse
  let y = d3.scaleLinear().domain([0, 13000]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Barchartet laves, med mouseover/move/leave for hver bar
  svg
    .selectAll("mybar")
    .data(fishdata)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.year);
    })
    // Højde er 0 til at starte med for senere at animere til den rigtige højde
    .attr("y", function (d) {
      return y(0);
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
      return height - y(0);
    })
    .attr("fill", "#69b3a2")
    .attr("id", function (d) {
      return d.lionfish_pop;
    })
    //
    .on("mouseover", function (d) {
      Tooltip.style("opacity", 1).html("Population: " + this.id);
      d3.select(this).style("stroke", "black").style("opacity", 0.8);
    })
    .on("mousemove", (event) => {
      let pos = d3.pointer(event);
      Tooltip.style("left", pos[0] + 90 + "px").style("top", pos[1] + "px");
    })
    .on("mouseleave", function (d) {
      Tooltip.style("opacity", 0);
      d3.select(this).style("stroke", "none").style("opacity", 1);
    });

  // Animation for bars
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
});
