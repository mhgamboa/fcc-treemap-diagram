const w = 1300;
const h = 700;
const legendHeight = 200;
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .attr("class", "svg");
const tooltip = d3.select("#tooltip");

fetch(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
)
  .then((response) => response.json())
  .then((parsedData) => {
    let coloredArray = parsedData.children.map((d, i, a) =>
      d3.interpolateRainbow(i / a.length)
    );
    const color = d3.scaleOrdinal(coloredArray);

    const hierarchy = d3
      .hierarchy(parsedData, (node) => node.children)
      .sum((node) => node.value)
      .sort((node1, node2) => node2.value - node1.value);

    const createTreeMap = d3.treemap().size([w, h]);
    createTreeMap(hierarchy);

    const block = svg
      .selectAll("g")
      .data(hierarchy.leaves())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`)
      .attr("style", "outline: thin solid white;");

    block
      .append("rect")
      .attr("class", "tile")
      .attr("fill", (d) => color(d.data.category))
      .attr("data-name", (d) => d.data.name)
      .attr("data-category", (d) => d.data.category)
      .attr("data-value", (d) => d.data.value)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      // Make Tooltip appear
      .on("mouseover", (e, d) => {
        tooltip
          .style("visibility", "visible")
          .style("left", e.pageX - 25 + "px")
          .style("top", e.pageY - 90 + "px")
          .attr("data-value", d.data.value)
          .html(`Value: $${d3.format(",.2r")(d.data.value)}`);
      })
      .on("mousemove", (e, d) => {
        console.log(d);
        tooltip
          .style("visibility", "visible")
          .style("left", e.pageX - 25 + "px")
          .style("top", e.pageY - 90 + "px")
          .attr("data-value", d.data.value)
          .html(`Value: $${d3.format(",.2r")(d.data.value)}`);
      })
      .on("mouseout", (e, d) => {
        tooltip.transition().style("visibility", "hidden");
      });

    block
      .append("text")
      .selectAll("tspan")
      .data(function (d) {
        return d.data.name.split(/(?=[A-Z][^A-Z])/g);
      })
      .enter()
      .append("tspan")
      .attr("class", "mainText")
      .attr("x", 4)
      .attr("y", function (d, i) {
        return 13 + i * 10;
      })
      .text(function (d) {
        return d;
      });

    const legend = d3
      .select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", legendHeight)
      .attr("id", "legend");

    //Append rectangles to legend
    legend
      .selectAll("rect")
      .data(parsedData.children)
      .enter()
      .append("rect")
      .attr("class", "legend-item")
      .attr("width", "30px")
      .attr("height", "30px")
      .attr("y", legendHeight / 2)
      .attr("fill", (d, i) => {
        return coloredArray[i];
      })
      .attr("x", (d, i) => 70 * i)
      .attr("title", "hi");
    // Append text to legend
    legend
      .selectAll("text")
      .data(parsedData.children)
      .enter()
      .append("text")
      .attr("width", "10px")
      .attr("height", "10px")
      .attr("x", (d, i) => 70 * i)
      .attr("y", legendHeight / 2 + 45)
      .attr("class", "legendText")
      .text((d) => {
        return d.name;
      });
  });
