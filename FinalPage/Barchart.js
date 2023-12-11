barChart();

function barChart() {
  // Sætter dimensioner for grafen
  let margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  let chartColor = "#f1e4a0";
  // SVGen bliver appended til siden
  let svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .style("color", "white");

  // Tooltip objekt appendes til siden. Skal bruges senere til at vise absolutte tal på grafen
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

  // Loader data og gemmer det i fishdata
  d3.json("https://dragefiskerfarlige.onrender.com/population").then(function (
    data
  ) {
    const fishdata = data.LionfishCloud;

    // Giver knappen en funktion der kalder barchart animationen
    document.getElementById("barKnap").onclick = function () {
      barAnimation();
    };

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
      .style("text-anchor", "end")
      .style("fill", chartColor);

    // Y-akse
    let y = d3.scaleLinear().domain([0, 13000]).range([height, 0]);
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", chartColor);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "36px")
      .style("fill", chartColor)
      .text("Antal Dragefisk i Caribien");
    // Barchartet laves, med mouseover/move/leave for hver bar
    svg
      .selectAll("mybar")
      .data(fishdata)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.year);
      })
      .attr("y", function (d) {
        return y(0); // Højde er 0 til at starte med for senere at animere til den rigtige højde
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
      .on("mouseover", function (d) {
        Tooltip.style("opacity", 1).html("Population: " + this.id);
        d3.select(this).style("stroke", "black").style("opacity", 0.8);
      })
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
