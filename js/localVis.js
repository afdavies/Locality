
var div;
var body;
var svg;
var g;
var circle;
var text;
var node;
var height;
var width;

$(document).ready(function(){

			//Width and height
			var w = 960;
			var h = 550;
			var SFLat = 37.7833;
			var SFLon = -122.4167;
			//Define map projection
			var projection = d3.geo.albersUsa()
								   .translate([w*84.58, h*14.49])
								   .scale(232000);

			//Define path 
			var path = d3.geo.path()
							 .projection(projection);
			//Create SVG element
			var svg = d3.select("#vis")
						.append("svg")
						.attr("width", w)
						.attr("height", h);
			
			//Load in GeoJSON data
			d3.json('json/SFEU.geojson', function(json) {
				console.log(json)
			//Bind data and create one path per GeoJSON feature
				svg.selectAll("path")
				   .data(json.features)
				   .enter()
				   .append("path")
				   .attr("d", path)
				   .attr("fill", "#EF0B51")
				   .attr("stroke", "#FDF172")
				   .attr("stroke-weight", "3px");

				 

			 //load in CSV, create groups and building circles
			d3.csv('csv/CommercialBuildingEnergy2.csv', function(data){
					console.log(data);
					div = d3.select("body")
							.append("div")
							.attr("class", "tooltip")
							.style("opacity", 0);

					g = svg.selectAll("g")
							.data(data)
							.enter()
							.append("g");
					circle = g.append("circle")
							.attr("r",5)
					.attr("class", function(d){
						return d.Neighborhood+" "+d.Status2010+" "+d.Status2011+" "+d.Status2012+" "+d.Status2013;
					})
					.attr("cx", function(d){
						return projection([d.Longitude, d.Latitude])[0];
					})
					.attr("cy", function(d){
						return projection([d.Longitude, d.Latitude])[1];
					})
					.style("fill", "#30223D")
					
					//hover changes

					.on("mouseenter", function(){
						d3.select(this)
								.style("fill", "white")
								.style("z-index", 1001);
						d3.select(this.parentNode)
							.append('text')
							.attr("x", function(d){
								return projection([d.Longitude, d.Latitude])[0]
							})
							.attr("y", function(d){
								return projection([d.Longitude, d.Latitude])[1]
							})
							.text(function(d){
								return d.BuildingAddress
							})
							.attr("fill", "#ffffff")
							.attr("text-transform", "capitalize")
							.attr("z-index", 10001)
							// .attr("class", function(d){
							// }) 

					})
					.on("mouseleave", function(){
						d3.select(this)
								.style("fill", "#30223D");
						d3.select(this.parentNode).selectAll("text")
							.remove();
					});
					$("#drop2>li>a").click(function(d){
						var id = $(this).id;
						var nodeLocation = d3.selectAll("circle")
											.attr("class");
						if(id != nodeLocation){
							console.log(nodeLocation);
							console.log("id different")
						}else{
							console.log("id same")
						}
					})
			}); 
		});
});