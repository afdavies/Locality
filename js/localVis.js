
var div;
var body;
var svg;
var g;
var circle;
var text;
var node;
var height;
var width;
var latLong = [122.4167, -37.7833];
var projection = d3.geo.albers()
					
				   // .translate([w*84.58, h*14.49])
				   // .scale(232000)
				   .translate([960/2, 550/2])
				   .scale(232000)
				   .rotate([122.4167,0])
				   .center([0, 37.757]);
				   // .rotate();



$(document).ready(function(){

			//Width and height
			var w = 960;
			var h = 550;
			// var SFLat = 37.7833;
			// var SFLon = -122.4167;
			//Define map projection
			// var projection = d3.geo.albers()
									
			// 					   // .translate([w*84.58, h*14.49])
			// 					   // .scale(232000)
			// 					   .center([0,0]);

			//Define path 
			var path = d3.geo.path()
							 .projection(projection);
			//Create SVG element
			var svg = d3.select("#vis")
						.append("svg")
						.attr("width", w)
						.attr("height", h);
			// Create tooltip
			var tooltip = d3.select("#vis")
						    .append("div")
						    .style("background", "white")
						    .style("position", "absolute")
						    .style("z-index", "10")
						    .style("visibility", "hidden")
						    .style("font-family", "Source Sans Pro")
						    .style("font-size", "0.75rem")
						    .style("padding-left", "3px")
						    .style("padding-right", "3px")
						    .text("a simple tooltip");

			//Load in GeoJSON data
			d3.json('./json/SFEU.geojson', function(json) {
				console.log(json)
			//Bind data and create one path per GeoJSON feature
				svg.selectAll("path")
				   .data(json.features)
				   .enter()
				   .append("path")
				   .attr("d", path)
				   .attr("fill", "#FFFFFF")
				   .attr("stroke", "#74E896")
				   .attr("stroke-width", "1px");
				   console.log(path);

				 

			 //load in CSV, create groups and building circles
			d3.csv('csv/CommercialBuildingEnergy3.csv', function(data){
					console.log(data);
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
					.attr("fill", "#222222")
					.attr("stroke", "#AAAAAA")
					.attr("stroke-width", "1px")
					.on("mouseover", function(d){
						d3.select(this)
							.transition()
							.duration(200)
							.attr("stroke", "#ffffff")
							.attr("stroke-width", "2px")
						return tooltip.style("visibility", "visible")
									   .text(d.Buildingaddress)
									   .style("top",(d3.event.pageY-245)+"px")
									   .style("left",(d3.event.pageX-190)+"px")


					})
					.on("mouseout", function(){
						d3.select(this)
							.transition()
							.duration(200)
							.attr("stroke", "#AAAAAA")
							.attr("stroke-width", function(d){
								if(yearCheck == undefined){
									return "1px"
								}else{
									return "0px";
								}
							})
						return tooltip.style("visibility", "hidden");
					});
					//Hover changes
					//Declare variables
					var locationCheck;
					var statusCheck;
					var yearCheck;
					
					//Initial View Reset
					$(".reset").click(function(){
						$("#year").html("2010");
						$("#neighborhood").html("All Neighborhoods");
						yearCheck = "2010"
						locationCheck = "AllNeighborhoods"
						statusCheck = undefined;
						d3.selectAll("circle")
							.transition()
							.duration(500)
							.attr("r", 5)
							.attr("stroke", "none")
							.style("fill", function(d){
								if(d.Status2010 == "Complied"){
									return "#4FF2FF";
								}else if (d.Status2010 == "DidNotComply"){
									return "#FF6074";
								}else if(d.Status2010 == "NA") {
									return "#CCCCCC"; 						
								}
							})
					})

					//Year Filter
					$("#drop1>li>a").click(function(d){
						event.preventDefault();
						var checkClass = $(this).parent().siblings().children("a").hasClass("selected");
						var $siblings = $(this).parent().siblings().children("a");
						var myClass = $(this).attr("class");
						yearCheck = myClass;
						var buttonText = $(this).text();
						console.log(locationCheck);
						if($("button.noselect").hasClass("noselect")){
							$("button.noselect").removeClass("noselect");
						}
						if(checkClass == true){
							$siblings.removeClass("selected");
							$(this).addClass("selected");
						}else if($(this).hasClass("selected") == true){
						}else{
							$(this).addClass("selected");
						}
						$(this).parents("ul").siblings("button").html(buttonText)
						console.log(yearCheck)
						d3.selectAll("circle")
						.transition()
						.attr("stroke-width", "0px")
						.attr("r", function(d){
							if(locationCheck == undefined){
								return 5;
							}else if(locationCheck == "AllNeighborhoods"){
								if(yearCheck == "2010"){
										if(statusCheck == d.Status2010){
											return 5;
										}else{
											return 0;
										}
									}else if(yearCheck == "2011"){
										if(statusCheck == d.Status2011){
											return 5
										}else{
											return 0
										}
									}else if(yearCheck == "2012"){
										if(statusCheck == d.Status2012){
											return 5
										}else{
											return 0
										}
									}else if(yearCheck == "2013"){
										if(statusCheck == d.Status2013){
											return 5
										}else{
											return 0
										}
									}
							}else if(d.Neighborhood == locationCheck){
								if(statusCheck == undefined || statusCheck == "AllResults"){
									if(yearCheck == "2010"){
										if(statusCheck == d.Status2010){
											return 5;
										}else{
											return 0;
										}
									}
									if(yearCheck == "2011"){
										if(statusCheck == d.Status2011){
											return 5
										}else{
											return 0
										}
									}
									if(yearCheck == "2012"){
										if(statusCheck == d.Status2012){
											return 5
										}else{
											return 0
										}
									}
									if(yearCheck == "2013"){
										if(statusCheck == d.Status2013){
											return 5
										}else{
											return 0
										}
									}else{
										return 5;	
									}
							}
						}
					})
						.style("fill", function(d) {
							if (yearCheck == "2010"){
								if(d.Status2010 == "Complied"){
									return "#4FF2FF";
								}else if (d.Status2010 == "DidNotComply"){
									return "#FF6074";
								}else if(d.Status2010 == "NA") {
									return "#CCCCCC"; 						
								}
							}else if(yearCheck == "2011"){
								if(d.Status2011 == "Complied"){
									return "#4FF2FF";
								}else if (d.Status2011 == "DidNotComply"){
									return "#FF6074";
								}else if (d.Status2011 == "NA") {
									return "#CCCCCC"; 						
								}
							}else if(yearCheck == "2012"){
								if(d.Status2012 == "Complied"){
									return "#4FF2FF";
								}else if (d.Status2012 == "DidNotComply"){
									return "#FF6074";
								} else if(d.Status2012 == "NA") {
									return "#CCCCCC"; 						
								}
							}else if(yearCheck == "2013"){
								if(d.Status2013 == "Complied"){
									return "#4FF2FF";
								}else if (d.Status2013 == "DidNotComply"){
									return "#FF6074";
								} else if(d.Status2013 == "NA") {
									return "#CCCCCC"; 						
								}
							}
						})
						.duration(1000);
					})
					
					//Neighborhood Filter
					$("#drop2>li>a").click(function(d){
						event.preventDefault();
						var myClass = $(this).attr("class");
						locationCheck = myClass;
						var buttonText = $(this).text();
						var checkClass = $(this).parent().siblings().children("a").hasClass("selected");
						var $siblings = $(this).parent().siblings().children("a");
						$(this).parents("ul").siblings("button").html(buttonText);
						if(checkClass == true){
							$siblings.removeClass("selected");
							$(this).addClass("selected");
						}else if($(this).hasClass("selected") == true){
						}else{
							$(this).addClass("selected");
						}
						d3.selectAll("circle")
						.transition()
						.attr("r", function(d) {
							if(yearCheck == undefined){
								if(d.Neighborhood == locationCheck){
									return 5;
								}else if(locationCheck == undefined || locationCheck == "AllNeighborhoods"){
									return 5;
								}
							}else if(d.Neighborhood == locationCheck){
								if(statusCheck == undefined){
									return 5;
								}else if(yearCheck == "2010" && d.Status2010 == statusCheck){
									return 5;
								}else if(yearCheck == "2011" && d.Status2011 == statusCheck){
									return 5;
								}else if(yearCheck == "2012" && d.Status2012 == statusCheck){
									return 5;
								}else if(yearCheck == "2013" && d.Status2013 == statusCheck){
									return 5;
								}else{
									return 0
								}
							}else{
								return 0; 
							}
						})
						.duration(1000);
					})

					//Status Filter
					$("#drop3>li>a").click(function(d){
						var checkClass = $(this).parent().siblings().children("a").hasClass("selected");
						var $siblings = $(this).parent().siblings().children("a");
						event.preventDefault();
						var myClass = $(this).attr("class");
						var buttonText = $(this).text();
						console.log(locationCheck);
						statusCheck = myClass;
						if(checkClass == true){
							$siblings.removeClass("selected");
							$(this).addClass("selected");
						}else if($(this).hasClass("selected") == true){
						}else{
							$(this).addClass("selected");
						}
						$(this).parents("ul").siblings("button").html(buttonText);
						d3.selectAll("circle")
						.transition()
						.attr("r", function(d){
							if(statusCheck == "AllResults"){
								if(d.Neighborhood == locationCheck || locationCheck == undefined){
									return 5;
									console.log("all")
								}else{
									return 0;
								}
							}else if(d.Neighborhood == locationCheck){
								if(yearCheck = "2010"){
									if(d.Status2010 == statusCheck){
										return 5;
									}else{
										return 0;
									}
								}else if(yearCheck == "2011"){
									if(d.Status2011 == statusCheck){
										return 5;
									}else{
										return 0;
									}
								}else if(yearCheck == "2012"){
									if(d.Status2012 == statusCheck){
										return 5;
									}else{
										return 0;
									}
								}else if(yearCheck == "2013"){
									if(d.Status2013 == statusCheck){
										return 5;
									}else{
										return 0;
									}
								}else{
									return 0;
								}
							}else if(locationCheck == undefined){
								if(yearCheck = "2010"){
									if(d.Status2010 == statusCheck){
										return 5;
									}else{
										return 0
									}
								}
								if(yearCheck = "2011"){
									if(d.Status2011 == statusCheck){
										return 5;
									}else{
										return 0
									}
								}
								if(yearCheck = "2012"){
									if(d.Status2012 == statusCheck){
										return 5;
									}else{
										return 0
									}
								}
								if(yearCheck = "2013"){
									if(d.Status2013 == statusCheck){
										return 5;
									}else{
										return 0
									}
								}else{
									return 0;
								}
							}else if(locationCheck == "AllNeighborhoods"){
										if(yearCheck = "2010"){
									if(d.Status2010 == statusCheck){
										return 5;
									}else{
										return 0;
									}
								}else if(yearCheck = "2011"){
									if(d.Status2011 == statusCheck){
										return 5;
									}else{
										return 0;
									}
								}else if(yearCheck = "2012"){
									if(d.Status2012 == statusCheck){
										return 5;
									}else{
										return 0;
									}
								}else if(yearCheck = "2013"){
									if(d.Status2013 == statusCheck){
										return 5;
									}else{
										return 0;
									}
								}else{
									return 0;
								}
							}else if(locationCheck == undefined){
								if(yearCheck = "2010"){
									if(d.Status2010 == statusCheck){
										return 5;
									}else{
										return 0
									}
								}
								if(yearCheck = "2011"){
									if(d.Status2011 == statusCheck){
										return 5;
									}else{
										return 0
									}
								}
								if(yearCheck = "2012"){
									if(d.Status2012 == statusCheck){
										return 5;
									}else{
										return 0
									}
								}
								if(yearCheck = "2013"){
									if(d.Status2013 == statusCheck){
										return 5;
									}else{
										return 0
									}
								}else{
									return 0;
								}
							}else{ 
								return 0;
							}
						})
						.style("fill", function(d) {
							if (yearCheck == "2010"){
								if(d.Status2010 == "Complied"){
									return "#4FF2FF";
								}else if (d.Status2010 == "DidNotComply"){
									return "#FF6074";
								}else if(d.Status2010 == "NA") {
									return "#CCCCCC"; 						
								}
							}else if(yearCheck == "2011"){
								if(d.Status2011 == "Complied"){
									return "#4FF2FF";
								}else if (d.Status2011 == "DidNotComply"){
									return "#FF6074";
								}else if (d.Status2011 == "NA") {
									return "#CCCCCC"; 						
								}
							}else if(yearCheck == "2012"){
								if(d.Status2012 == "Complied"){
									return "#4FF2FF";
								}else if (d.Status2012 == "DidNotComply"){
									return "#FF6074";
								} else if(d.Status2012 == "NA") {
									return "#CCCCCC"; 						
								}
							}else if(yearCheck == "2013"){
								if(d.Status2013 == "Complied"){
									return "#4FF2FF";
								}else if (d.Status2013 == "DidNotComply"){
									return "#FF6074";
								} else if(d.Status2013 == "NA") {
									return "#CCCCCC"; 						
								}
							}
						})
						.duration(1000);
					})
			}); 
		});
	setTimeout(function(){
		$(".loader").addClass("loaded")
		setTimeout(function(){
			$(".loader").addClass("fade")
		}, 1750)
	}, 1000);
});