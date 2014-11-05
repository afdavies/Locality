
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
			d3.csv('csv/CommercialBuildingEnergy3.csv', function(data){
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
					.attr("fill", "white")
					.attr("stroke", "#222222")
					.attr("stroke-width", "2px")
					
					//Hover changes

					.on("mouseenter", function(){
						d3.select(this)
								.style("z-index", 1001)
								// .attr("stroke-width", "4px")
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
							.attr("fill", "#222222")
							.attr("font-family", "Montserrat")
							.style("text-transform", "uppercase")
							.attr("z-index", 10001)
					})
					.on("mouseleave", function(){
						d3.select(this)
								.attr("fill", "white")
								// .attr("stroke-width", "2px")

						d3.select(this.parentNode).selectAll("text")
							.remove();
					});

					//Year Filter
					var locationCheck;
					var statusCheck;
					var yearCheck;

					$("#drop1>li>a").click(function(d){
						event.preventDefault();
						var checkClass = $(this).parent().siblings().children("a").hasClass("selected");
						var siblings = $(this).parent().siblings().children("a");
						var myClass = $(this).attr("class");
						yearCheck = myClass;
						var buttonText = $(this).text();
						console.log(locationCheck);
						if($("button.noselect").hasClass("noselect")){
							$("button.noselect").removeClass("noselect");
						}
						if(checkClass = true){
							siblings.removeClass("selected");
							$(this).addClass("selected");
						}else{
							$(this).addClass("selected");
						}
						$(this).parents("ul").siblings("button").html(buttonText)
						console.log(yearCheck)
						d3.selectAll("circle")
						.transition()
						.attr("stroke-width", "0px")
						.attr("r", function(d){
							if(statusCheck == "AllResults" || statusCheck == undefined){
								return 5;
							}else if(d.Neighborhood == locationCheck && yearCheck == "2010" && statusCheck == d.Status2010 && statusCheck != d.Status2011 && statusCheck != d.Status2012 && statusCheck != d.Status2013){
								return 5;
							}else if(d.Neighborhood == locationCheck && yearCheck == "2011" && statusCheck != d.Status2010 && statusCheck == d.Status2011 && statusCheck != d.Status2012 && statusCheck != d.Status2013){
								return 5
							}else if(d.Neighborhood == locationCheck && yearCheck == "2012" && statusCheck != d.Status2010 && statusCheck != d.Status2011 && statusCheck == d.Status2012 && statusCheck != d.Status2013){
								return 5
							}else if(d.Neighborhood == locationCheck && yearCheck == "2013" && statusCheck != d.Status2010 && statusCheck != d.Status2011 && statusCheck != d.Status2012 && statusCheck == d.Status2013){
								return 5
							}else{
								return 0
							}
						})
						.style("fill", function(d) {
							if ($("#drop1>li>a.2010").hasClass("selected")){
								if(d.Status2010 == "Complied"){
									return "#4FF2FF";
								}else if (d.Status2010 == "DidNotComply"){
									return "#FF6074";
								} else if(d.Status2010 == "NA") {
									return "#CCCCCC"; 						
								}
							}else if ($("#drop1>li>a.2011").hasClass("selected")){
								if(d.Status2011 == "Complied"){
									return "#4FF2FF";
								}else if (d.Status2011 == "DidNotComply"){
									return "#FF6074";
								} else if(d.Status2011 == "NA") {
									return "#CCCCCC"; 						
								}
							}else if ($("#drop1>li>a.2012").hasClass("selected")){
								if(d.Status2012 == "Complied"){
									return "#4FF2FF";
								}else if (d.Status2012 == "DidNotComply"){
									return "#FF6074";
								} else if(d.Status2012 == "NA") {
									return "#CCCCCC"; 						
								}
							}else if ($("#drop1>li>a.2013").hasClass("selected")){
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
						console.log(locationCheck);
						$(this).parents("ul").siblings("button").html(buttonText);
						if(checkClass = true){
							$siblings.removeClass("selected");
							$(this).addClass("selected");
						}else{
							$(this).addClass("selected");
						}
						d3.selectAll("circle")
						.transition()
						.attr("r", function(d) {
							if(myClass == "AllNeighborhoods"){
								return 5;
							}
							else if (d.Neighborhood == myClass){
							return 5; 
							} else {
							return 0; 
							}
						})
						.duration(500);
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
						if(checkClass = true){
							$siblings.removeClass("selected");
							$(this).addClass("selected");
						}else{
							$(this).addClass("selected");
						}
						$(this).parents("ul").siblings("button").html(buttonText);
						d3.selectAll("circle")
						.transition()
						.attr("r", function(d){
							if($(".2010").hasClass("selected") && d.Status2010 == myClass && d.Neighborhood == locationCheck){
								return 5;
							}else if($(".2011").hasClass("selected") && d.Status2011 == myClass && d.Neighborhood == locationCheck){
								return 5;
							}else if($(".2012").hasClass("selected") && d.Status2012 == myClass && d.Neighborhood == locationCheck){
								return 5; 
							}else if($(".2013").hasClass("selected") && d.Status2013 == myClass && d.Neighborhood == locationCheck){
								return 5;
							}else if($("#AllResults").hasClass("selected") || $("#drop3>li>a").hasClass("selected") == false && d.Neighborhood == locationCheck){
								return 5;
							}else{
								return 0;
							}
						})
						//Check selected year selected to confirm pass status
					
						.duration(500);

					})
			}); 
		});
});