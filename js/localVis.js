
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
				   .attr("fill", "#FFFFFF")
				   .attr("stroke", "#74E896")
				   .attr("stroke-width", "2px");
				   console.log(path);

				 

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
					.style("border", "1px")
					
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
					//Year Filter
					$("#drop1>li>a").click(function(d){
						var myClass = $(this).attr("class");
						var buttonText = $(this).text();
						if($(this).siblings('li').hasClass("selected")){
							$(this).siblings().removeClass("selected")
							$(this).addClass("selected");
						}else{
							$(this).addClass("selected");
						}
						$(this).parents("ul").siblings("button").html(buttonText)
						// d3.selectAll("circle")
						// .attr("opacity", function(d) {
						// 	if (d.Neighborhood == myClass) {
						// 	return 1.0; //Set to opaque
						// 	} else {
						// 	return 0.0; //Set to transparent
						// 	}
						// });	
					})
					//Neighborhood Filter
					$("#drop2>li>a").click(function(d){
						var myClass = $(this).attr("class");
						var buttonText = $(this).text();
						$(this).parents("ul").siblings("button").html(buttonText);
						d3.selectAll("circle")
						.attr("opacity", function(d) {
							if (d.Neighborhood == myClass) {
							return 1.0; //Set to opaque
							} else {
							return 0.0; //Set to transparent
							}
						});
					})
					//Status Filter
					$("#drop3>li>a").click(function(d){
						var myClass = $(this).attr("class");
						var buttonText = $(this).text();
						$(this).parents("ul").siblings("button").html(buttonText);
						d3.selectAll("circle")
						.transition()
						.attr("r", function(d) {
							if (d.Status2010 == myClass) {
							return 5; //Set to opaque
							} else {
							return 0; //Set to transparent
							}
						})
						.style("fill", function(d) {
							if (d.Status2010 == "DidNotComply"){
							return "#000000"
							} else if(d.Status2011 == "DidNotComply") {
							return "#FF6074"; 						
							}
						})
						.duration(500);

					})
			}); 
		});
});