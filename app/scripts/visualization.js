
var diameter = window.innerHeight - 148;

var tree = d3.layout.tree()
    .size([360, diameter / 2 - 60])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
var width = $(".data-tree").width();
var svg = d3.select(".data-tree").append("svg")
    .attr("width", width)
    .attr("height", diameter - 48)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + diameter / 2 + ")");


function updateVis(JSON){
  console.log("updatevis")
//d3.json("../scripts/flare.json", function(error, root) {
  var source = jQuery.extend(true, {},JSON);
  console.log(source)
  var nodes = tree.nodes(source),
      links = tree.links(nodes);

  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);

  var node = svg.selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

  node.append("circle")
      .attr("r", 14.5);

  node.append("text")
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.x < 180 ? "end" : "start"; })
      .attr("transform", function(d) { return d.x < 180 ? "rotate("+(360-d.x+90)+")translate("+(width/2 - d.x - 180)+")" : "rotate("+(180-d.x-90)+")translate(-"+(width/2 - d.x)+")"; })
      .text(function(d) { return d.name.replace(requestedurl,'') });
//});


}

d3.select(self.frameElement).style("height", diameter - 150 + "px");