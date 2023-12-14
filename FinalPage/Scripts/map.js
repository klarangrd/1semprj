const w = 1400;
const h = 500;
let zoom = 1400;
let bubbleData;
// Function for Zooming In/Out on the Map
function zoominout(zoomin) {
  //zoom in and out function on map
  if (zoomin === true) {
    zoom += 100;
    updateMap();
  } else if (zoomin === false && zoom > 1400) {
    zoom -= 100;
    updateMap();
  }
}
// Function to Update the Map with Filtered Data
function updateMap(filterData) {
  console.log(filterData);
  //define Map Projection
  const projection = d3
    .geoMercator()
    .center([-75, 18])
    .scale(zoom)
    .translate([w / 2, h / 2]);
  //create Path Generator
  const path = d3.geoPath().projection(projection);
  //update Geojson Paths
  d3.selectAll("path").attr("d", path);
  //update Circles with Filtered Data
  // check if filterData is provided
  if (filterData) {
    // update circles with filtered data
    // select all circles and bind data
    d3.selectAll("circle")
      .data(filterData)
      .join(
        // enter: append new circles for new data
        (enter) => enter.append("circle"),
        // update: keep existing circles for updated data
        (update) => update,
        // exit: remove excess circles for removed data
        (exit) => exit.remove()
      )
      // set the x-coo of circles based on longitude
      .attr("cx", (d) => projection([d.longitude, d.latitude])[0])
      // set the y-coo of circles based on latitude
      .attr("cy", (d) => projection([d.longitude, d.latitude])[1])
      // set the r of circles
      .attr("r", 4)
      // set the fill colour of circles
      .style("fill", "red")
      // set the opacity of circles
      .style("opacity", 0.5);
  } else {
    // remove all circles when no filter data is provided
    d3.selectAll("circle").remove();
  }
  //fetch and Generate Geojson Data
  d3.json("c2.json").then(function (data) {
    generate(filterData, data, false);
  });
}
//svg Container for the Map
const svg = d3
  .select("#maparea")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "lightblue");
//fetch Geojson and Database JSON
Promise.all([
  d3.json("c2.json"),
  d3.json("https://dragefiskerfarlige.onrender.com/kordinater"),
]).then(function (data) {
  const geojson = data[0];
  bubbleData = data[1].LionfishCloud; //collecting the LionfishCloud database
  //generate Map with Initial Data
  generate(bubbleData, geojson, true);
});
//function to Generate Map Elements
function generate(bubbleData, geojson, onload) {
  //parse Latitude and Longitude in Bubble Data
  const data = parseData(bubbleData);
  console.log(bubbleData);
  console.log(data);
  //define Map Projection
  const projection = d3
    .geoMercator()
    .center([-75, 18])
    .scale(zoom)
    .translate([w / 2, h / 2]);
  //create Path Generator
  const path = d3.geoPath().projection(projection);
  //draw Geojson Paths
  svg
    .selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", "grey");
  //draw Circles for Bubble Data
  if (!onload) {
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => projection([d.longitude, d.latitude])[0])
      .attr("cy", (d) => projection([d.longitude, d.latitude])[1])
      .attr("r", 4)
      .style("fill", "red")
      .style("opacity", 0.5);
  }
  //populate the dropdown with years
  if (onload) {
    populateDropdown(data);
  }
}
//function to Parse Latitude and Longitude in Bubble Data
function parseData(bubbleData) {
  for (let n in bubbleData) {
    bubbleData[n].latitude = parseFloat(bubbleData[n].latitude);
    bubbleData[n].longitude = parseFloat(bubbleData[n].longitude);
  }
  return bubbleData;
}
//function to Populate Dropdown with Unique Years
function populateDropdown(bubbleData) {
  bubbleData.sort(function (a, b) {
    //sorting the years by earliest to latest
    return a.year - b.year;
  });
  const dropdown = document.getElementById("chosenYear");
  //taking unique years from the dataset
  const years = [...new Set(bubbleData.map((item) => item.year))];
  //putting the year as the dropdown menu
  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.text = year;
    dropdown.add(option);
  });
}
//function to Handle Year Selection
function selectedYear() {
  const selectedYear = document.getElementById("chosenYear").value;
  const filteredBubbleData =
    selectedYear === "ALL"
      ? bubbleData
      : bubbleData.filter((d) => d.year == selectedYear);
  //update the Map with Filtered Data
  updateMap(filteredBubbleData);
}

svg //sources
  .append("text")
  .attr("x", 160)
  .attr("y", 480)
  .attr("text-anchor", "middle")
  .style("font-size", "10px")
  .style("fill", "grey")
  .text(
    "Ref: https://nas.er.usgs.gov/queries/collectioninfo.aspx?SpeciesID=963"
  );

svg
  .append("text")
  .attr("x", 106)
  .attr("y", 490)
  .attr("text-anchor", "middle")
  .style("font-size", "10px")
  .style("fill", "grey")
  .text("https://www.mediafire.com/?5faef9y5ct8mn");
