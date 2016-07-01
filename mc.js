// Map details
L.mapbox.accessToken = 'pk.eyJ1IjoibWFyeWdyaWZmdXMiLCJhIjoiY2lveW1oZDIwMDF1bnU5bTR0YXVqMnhncyJ9.EZ2ZQzA058yoHJTvpWISig';
var mcmap = L.mapbox.map('mcmap', 'mapbox.streets')
  .setView([31.4627, -81.4839], 11)

var styleLayer = L.mapbox.styleLayer("mapbox://styles/marygriffus/cioymla89001qcim18697j8di")
  .addTo(mcmap)

// Sample Data
var data = [
  { "coords" : [ 31.4817 , -81.6002 ]}
];

// Loop through data and create d.LatLng
data.forEach(function(d) {
  d.LatLng = new L.LatLng(d.coords[0], d.coords[1]);
});
data.forEach(function(d) {
  mcmap.addLayer(L.circle([d.coords[0], d.coords[1]], 800));
});

// Append <svg>
var svg = d3.select(mcmap.getPanes().overlayPane).append("svg")
  .attr("class", "leaflet-zoom-animated")
  .attr("width", window.innerWidth)
  .attr("height", window.innerHeight);

// Append <g> to svg
var g = svg.append("g").attr("class", "leaflet-zoom-hide");

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
    // Reszing width and height incase of window resize
    svg.attr("width", window.innerWidth)
    svg.attr("height", window.innerHeight)
    // Adding the ViewBox attribute to our SVG to contain it
    svg.attr("viewBox", function () {
        return "" + viewBoxLeft + " " + viewBoxTop + " "  + window.innerWidth + " " + window.innerHeight;
    });
    // Adding the style attribute to our SVG to transkate it
    svg.attr("style", function () {
        return "transform: translate3d(" + viewBoxLeft + "px, " + viewBoxTop + "px, 0px);";
    });
}

// Re-draw on reset, this keeps the markers where they should be on reset/zoom
mcmap.on("moveend", update);
update();
