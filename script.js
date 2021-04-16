const w = 900;
const h = 700;
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .attr("class", "svg");

fetch(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
)
  .then((response) => response.json())
  .then((parsedData) => {
    console.log(parsedData);
    const hierarchy = d3
      .hierarchy(parsedData, (node) => node.children)
      .sum((node) => node.value)
      .sort((node1, node2) => node2.value - node1.value);

    const createTreeMap = d3.treemap().size([h, w]);
    createTreeMap(hierarchy);
    const block = svg
      .selectAll("g")
      .data(hierarchy.leaves())
      .enter()
      .append("g")
      .append("rect")
      .attr("class", "tile");
  });
