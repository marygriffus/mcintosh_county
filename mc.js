var button = document.querySelector("button")
button.onclick = function(){
  var newGraph = document.querySelector(".new")
  var originalGraph = document.querySelector(".original")
  if (newGraph.style.display !== "none") {
    newGraph.style.display = "none";
    originalGraph.style.display = "block";
    // document.querySelector(".farm-tenant").style.backgroundColor = "#EEECE8";
  } else {
    newGraph.style.display = "block";
    originalGraph.style.display = "none";
    // document.querySelector(".farm-tenant").style.backgroundColor = "#E0D3C7";
  }
}

// MAP
// Map details
L.mapbox.accessToken = 'pk.eyJ1IjoibWFyeWdyaWZmdXMiLCJhIjoiY2lveW1oZDIwMDF1bnU5bTR0YXVqMnhncyJ9.EZ2ZQzA058yoHJTvpWISig';
var mcmap = L.mapbox.map('mcmap', 'mapbox.streets')
  .setView([31.4607, -81.4739], 11)

var styleLayer = L.mapbox.styleLayer("mapbox://styles/marygriffus/cioymla89001qcim18697j8di")
  .addTo(mcmap)

//translating points from original map to latlng
var start_y = 31.1827;
var start_x = -81.6772;
var scaling = 0.00047;
var colors = ["red", "green", "blue", "black", "yellow"];

var data = [];
red_coords.forEach(function(d){
  var new_pair = [(start_y + scaling * (1000 - d[1])), start_x + scaling * d[0]];
  data.push({"coords" : new_pair, "color" : colors[0]});
})

green_coords.forEach(function(d){
  var new_pair = [(start_y + scaling * (1000 - d[1])), start_x + scaling * d[0]];
  data.push({"coords" : new_pair, "color" : colors[1]});
})

blue_coords.forEach(function(d){
  var new_pair = [(start_y + scaling * (1000 - d[1])), start_x + scaling * d[0]];
  data.push({"coords" : new_pair, "color" : colors[2]});
})

black_coords.forEach(function(d){
  var new_pair = [(start_y + scaling * (1000 - d[1])), start_x + scaling * d[0]];
  data.push({"coords" : new_pair, "color" : colors[3]});
})

yellow_coords.forEach(function(d){
  var new_pair = [(start_y + scaling * (1000 - d[1])), start_x + scaling * d[0]];
  data.push({"coords" : new_pair, "color" : colors[4]});
})

data.forEach(function(d){
  d.LatLng = new L.LatLng(d.coords[0], d.coords[1]);
})

data.forEach(function(d){
  var circle = L.circle([d.coords[0], d.coords[1]], 50, {
    color: d.color,
    fillColor: d.color,
    fillOpacity: 0.8
  }).addTo(mcmap)
})

// Append <svg>
var svg = d3.select(mcmap.getPanes().overlayPane).append("svg")
  .attr("class", "leaflet-zoom-animated");

// Append <g> to svg
var g = svg.append("g").attr("class", "leaflet-zoom-hide")

// Append <circle> to <g>
var circles = g.selectAll("circle")
  .data(data)
  .enter().append("circle")
  .style("fill", "rgba(255, 255, 255, .5)")
  .on("mouseenter", function (){
    return d3.select(this).style("opacity", "0");
  })
  .on("mouseleave", function (){
    return d3.select(this).style("opacity", "1");
  });

function update() {
    translateSVG();
    circles.attr("cx",function(d) { return mcmap.latLngToLayerPoint(d.LatLng).x })
    circles.attr("cy",function(d) { return mcmap.latLngToLayerPoint(d.LatLng).y })
    circles.attr("r",function(d) { return 0.008*Math.pow(2, mcmap.getZoom())});
}

function translateSVG() {
    var viewBoxLeft = document.querySelector("svg.leaflet-zoom-animated").viewBox.animVal.x;
    var viewBoxTop = document.querySelector("svg.leaflet-zoom-animated").viewBox.animVal.y;
    // Adding the style attribute to our SVG to translate it
    svg.attr("style", function () {
        return "transform: translate3d(" + viewBoxLeft + "px, " + viewBoxTop + "px, 0px);";
    });
}

// Add text and legend
var legend = L.control({position: 'bottomleft'});
legend.onAdd = function(map){

  var div = L.DomUtil.create('div', 'info legend');
  var labels = ["<h3><strong> McINTOSH COUNTY, GEORGIA </strong></h3>", "WHITE INHABITANTS, 1890 - 1,258", "NEGRO INHABITANTS, 1890 - 5,212", "DISTRIBUTION OF 3,000 NEGRO INHABITANTS", "OUTSIDE THE TOWN OF DARIEN", "TOTAL AREA OF COUNTY = 489 SQUARE MILES", "TOTAL LAND OWNED BY NEGROS, 1989,  13,760 ACRES"];
  var cats = ["WELL-TO-DO", "BETTER CLASS OF LABORERS<br>AND SMALL FARMERS", "POOR", "LOWEST CLASS", "APPROXIMATE DISTRIBUTION OF WHITES"];

  for (var i = 0; i < labels.length; i++) {
      div.innerHTML += '<p>' + labels[i] + '</p>'
  }

  for (var i = 0; i < cats.length; i++) {
    div.innerHTML += '<i style="background:' + colors[i] + '"></i> <p>' + cats[i] + '<p>'
  }

  return div;
};
legend.addTo(mcmap)

// Re-draw on reset, this keeps the markers where they should be on reset/zoom
mcmap.on("moveend", update);
update();
