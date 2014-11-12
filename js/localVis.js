
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
var projection; 
var path;
var tooltip;

$(document).ready(function(){
			//Width and height
			var w = 1000;
			var h = 550;

			projection = d3.geo.albers()
						   .translate([960/2+75, 550/2+50])
						   .scale(240000)
						   .rotate([122.4167,0])
						   .center([0, 37.757]);

			//Define path 
			path = d3.geo.path()
					.projection(projection);
			//Create SVG element
			svg = d3.select("#vis")
						.append("svg")
						.attr("width", w)
						.attr("height", h);
			// Create tooltip
			tooltip = d3.select("#vis")
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
			d3.csv('csv/CommercialBuildingEnergy4.csv', function(data){
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
									   .text(d.BuildingAddress)
									   .style("top",(d3.event.pageY-245)+"px")
									   .style("left",(d3.event.pageX-250)+"px")
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
					})
					//Hover changes
					//Declare variables
					var locationCheck;
					var statusCheck;
					var yearCheck;
					
					//Initial View Reset
					$(".reset").click(function(){
						event.preventDefault()
						$("#year").html("2010");
						$("#neighborhood").html("All Neighborhoods");
						$("#status").html("All Results")
						$(".reset").html("View reset!").delay(1000).queue(function(){
							$(this).blur();
							$(this).html("Reset");
						});
						yearCheck = "2010"
						locationCheck = "AllNeighborhoods"
						statusCheck = "AllResults";
						//Reset scale and rotation on whole city
						projection.translate([960/2+75, 550/2+50])
						   .scale(240000)
						   .rotate([122.4167,0])
						   .center([0, 37.757]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						d3.selectAll("circle")
							.transition()
							.duration(1000)
							.attr("r", 5)
							 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
							})
							.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
							})
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
						//Scale map
						 // All the other stuff
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
						.duration(1000)
						.attr("stroke-width", "0px")
						.attr("r", function(d){
							if(yearCheck == "2010"){
								if(locationCheck == undefined || locationCheck == "AllNeighborhoods"){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
										console.log(yearCheck)
										console.log(locationCheck)
										console.log(statusCheck)
									}else if(statusCheck == d.Status2010 ){
										return 5
									}else{
										return 0
									}
								}else if(locationCheck == d.Neighborhood){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == d.Status2010 ){
										return 5
									}else{
										return 0
									}
								}else{
									return 0
								}
							}else if(yearCheck == "2011"){
								if(locationCheck == undefined || locationCheck == "AllNeighborhoods"){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == d.Status2011 ){
										return 5
									}else{
										return 0
									}
								}else if(locationCheck == d.Neighborhood){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == d.Status2011 ){
										return 5
									}else{
										return 0
									}
								}else{
									return 0
								}
							}else if(yearCheck == "2012"){
								if(locationCheck == undefined || locationCheck == "AllNeighborhoods"){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == d.Status2012 ){
										return 5
									}else{
										return 0
									}
								}else if(locationCheck == d.Neighborhood){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == d.Status2012 ){
										return 5
									}else{
										return 0
									}
								}else{
									return 0
								}
							}else if(yearCheck == "2013"){
								if(locationCheck == undefined || locationCheck == "AllNeighborhoods"){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == d.Status2013 ){
										return 5
									}else{
										return 0
									}
								}else if(locationCheck == d.Neighborhood){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == d.Status2013 ){
										return 5
									}else{
										return 0
									}
								}else{
									return 0
								}
							}else{
								return 0
							}
						})
						// 	if(locationCheck == undefined){
						// 		return 5;
						// 	}else if(locationCheck == "AllNeighborhoods"){
						// 		if(yearCheck == "2010"){
						// 				if(statusCheck == d.Status2010){
						// 					return 5;
						// 				}else{
						// 					return 0;
						// 				}
						// 			}else if(yearCheck == "2011"){
						// 				if(statusCheck == d.Status2011){
						// 					return 5
						// 				}else{
						// 					return 0
						// 				}
						// 			}else if(yearCheck == "2012"){
						// 				if(statusCheck == d.Status2012){
						// 					return 5
						// 				}else{
						// 					return 0
						// 				}
						// 			}else if(yearCheck == "2013"){
						// 				if(statusCheck == d.Status2013){
						// 					return 5
						// 				}else{
						// 					return 0
						// 				}
						// 			}
						// 	}else if(d.Neighborhood == locationCheck){
						// 		if(statusCheck == undefined || statusCheck == "AllResults"){
						// 			if(yearCheck == "2010"){
						// 				if(statusCheck == d.Status2010){
						// 					return 5;
						// 				}else{
						// 					return 0;
						// 				}
						// 			}
						// 			if(yearCheck == "2011"){
						// 				if(statusCheck == d.Status2011){
						// 					return 5
						// 				}else{
						// 					return 0
						// 				}
						// 			}
						// 			if(yearCheck == "2012"){
						// 				if(statusCheck == d.Status2012){
						// 					return 5
						// 				}else{
						// 					return 0
						// 				}
						// 			}
						// 			if(yearCheck == "2013"){
						// 				if(statusCheck == d.Status2013){
						// 					return 5
						// 				}else{
						// 					return 0
						// 				}
						// 			}else{
						// 				return 5;	
						// 			}
						// 	}
						// }
					// })
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
					})
					
					//Neighborhood Filter
					$("#drop2>li>a").on("mouseenter", function(d){
						event.preventDefault()
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
						.duration(1000)
						.attr("r", function(d) {
							if(locationCheck == undefined || locationCheck == "AllNeighborhoods"){
								if(yearCheck == undefined){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
										console.log(yearCheck)
										console.log(locationCheck)
										console.log(statusCheck)
									}
								}else if(yearCheck == "2010"){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == d.Status2010){
										return 5
									}else{
										return 0
									}
								}else if(yearCheck == "2011"){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == d.Status2012){
										return 5
									}else{
										return 0
									}
								}else if(yearCheck == "2013"){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == d.Status2013){
										return 5
									}else{
										return 0
									}
								}else if(yearCheck == "2011"){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == d.Status2013 ){
										return 5
									}else{
										return 0
									}
								}else{
									return 0
								}
							}else if(locationCheck == d.Neighborhood){
								if(yearCheck == undefined){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
										console.log(yearCheck)
										console.log(locationCheck)
										console.log(statusCheck)
									}
								}else if(yearCheck == "2010"){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == d.Status2010){
										return 5
									}else{
										return 0
									}
								}else if(yearCheck == "2011"){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == d.Status2012){
										return 5
									}else{
										return 0
									}
								}else if(yearCheck == "2013"){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == d.Status2013){
										return 5
									}else{
										return 0
									}
								}else if(yearCheck == "2011"){
									if(statusCheck == undefined || statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == d.Status2013 ){
										return 5
									}else{
										return 0
									}
								}else{
									return 0
								}
							}else{ 
								return 0
							}
						})
							// if(yearCheck == undefined){
							// 	if(d.Neighborhood == locationCheck){
							// 		return 5;
							// 	}else if(locationCheck == undefined || locationCheck == "AllNeighborhoods"){
							// 		return 5;
							// 	}
							// }else if(d.Neighborhood == locationCheck){
							// 	if(statusCheck == undefined){
							// 		return 5;
							// 	}else if(yearCheck == "2010" && d.Status2010 == statusCheck){
							// 		return 5;
							// 	}else if(yearCheck == "2011" && d.Status2011 == statusCheck){
							// 		return 5;
							// 	}else if(yearCheck == "2012" && d.Status2012 == statusCheck){
							// 		return 5;
							// 	}else if(yearCheck == "2013" && d.Status2013 == statusCheck){
							// 		return 5;
							// 	}else{
							// 		return 0
							// 	}
							// }else{
							// 	return 0; 
							// }
					// 	})
					})

					//Status Filter
					$("#drop3>li>a").click(function(d){
						event.preventDefault()
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
							if(yearCheck == "2010"){
								if(locationCheck == "AllNeighborhoods" || locationCheck == undefined){
									if(statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == "Complied"){
										if(d.Status2010 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "DidNotComply"){
										if(d.Status2010 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "NA"){
										if(d.Status2010 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "Complied"){
										if(d.Status2010 == statusCheck){
											return 5
										}else{
												return 0
											}
									}
								}else if(d.Neighborhood == locationCheck){
									if(statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == "Complied"){
										if(d.Status2010 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "DidNotComply"){
										if(d.Status2010 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "NA"){
										if(d.Status2010 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "Complied"){
										if(d.Status2010 == statusCheck){
											return 5
										}else{
											return 0
										}
									}
								}
								else{
									return 0
								}
							}else if(yearCheck == "2011"){
								if(locationCheck == "AllNeighborhoods" || locationCheck == undefined){
									if(statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == "Complied"){
										if(d.Status2011 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "DidNotComply"){
										if(d.Status2011 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "NA"){
										if(d.Status2011 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "Complied"){
										if(d.Status2011 == statusCheck){
											return 5
										}else{
												return 0
											}
									}
								}else if(d.Neighborhood == locationCheck){
									if(statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == "Complied"){
										if(d.Status2011 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "DidNotComply"){
										if(d.Status2011 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "NA"){
										if(d.Status2011 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "Complied"){
										if(d.Status2011 == statusCheck){
											return 5
										}else{
											return 0
										}
									}
								}
								else{
									return 0
								}
							}if(yearCheck == "2012"){
								if(locationCheck == "AllNeighborhoods" || locationCheck == undefined){
									if(statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == "Complied"){
										if(d.Status2012 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "DidNotComply"){
										if(d.Status2012 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "NA"){
										if(d.Status2012 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "Complied"){
										if(d.Status2012 == statusCheck){
											return 5
										}else{
												return 0
											}
									}
								}else if(d.Neighborhood == locationCheck){
									if(statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == "Complied"){
										if(d.Status2012 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "DidNotComply"){
										if(d.Status2012 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "NA"){
										if(d.Status2012 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "Complied"){
										if(d.Status2012 == statusCheck){
											return 5
										}else{
											return 0
										}
									}
								}
								else{
									return 0
								}
							}if(yearCheck == "2013"){
								if(locationCheck == "AllNeighborhoods" || locationCheck == undefined){
									if(statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == "Complied"){
										if(d.Status2013 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "DidNotComply"){
										if(d.Status2013 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "NA"){
										if(d.Status2013 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "Complied"){
										if(d.Status2013 == statusCheck){
											return 5
										}else{
												return 0
											}
									}
								}else if(d.Neighborhood == locationCheck){
									if(statusCheck == "AllResults"){
										return 5
									}else if(statusCheck == "Complied"){
										if(d.Status2013 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "DidNotComply"){
										if(d.Status2013 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "NA"){
										if(d.Status2013 == statusCheck){
											return 5
										}else{
											return 0
										}
									}else if(statusCheck == "Complied"){
										if(d.Status2013 == statusCheck){
											return 5
										}else{
											return 0
										}
									}
								}
								else{
									return 0
								}
							}
						})
						// 	if(statusCheck == "AllResults"){
						// 		if(d.Neighborhood == locationCheck || locationCheck == undefined){
						// 			return 5;
						// 			console.log("all")
						// 		}else{
						// 			return 0;
						// 		}
						// 	}else if(d.Neighborhood == locationCheck){
						// 		if(yearCheck = "2010"){
						// 			if(d.Status2010 == statusCheck){
						// 				return 5;
						// 			}else{
						// 				return 0;
						// 			}
						// 		}else if(yearCheck == "2011"){
						// 			if(d.Status2011 == statusCheck){
						// 				return 5;
						// 			}else{
						// 				return 0;
						// 			}
						// 		}else if(yearCheck == "2012"){
						// 			if(d.Status2012 == statusCheck){
						// 				return 5;
						// 			}else{
						// 				return 0;
						// 			}
						// 		}else if(yearCheck == "2013"){
						// 			if(d.Status2013 == statusCheck){
						// 				return 5;
						// 			}else{
						// 				return 0;
						// 			}
						// 		}else{
						// 			return 0;
						// 		}
						// 	}else if(locationCheck == undefined){
						// 		if(yearCheck = "2010"){
						// 			if(d.Status2010 == statusCheck){
						// 				return 5;
						// 			}else{
						// 				return 0
						// 			}
						// 		}
						// 		if(yearCheck = "2011"){
						// 			if(d.Status2011 == statusCheck){
						// 				return 5;
						// 			}else{
						// 				return 0
						// 			}
						// 		}
						// 		if(yearCheck = "2012"){
						// 			if(d.Status2012 == statusCheck){
						// 				return 5;
						// 			}else{
						// 				return 0
						// 			}
						// 		}
						// 		if(yearCheck = "2013"){
						// 			if(d.Status2013 == statusCheck){
						// 				return 5;
						// 			}else{
						// 				return 0
						// 			}
						// 		}else{
						// 			return 0;
						// 		}
						// 	}else if(locationCheck == "AllNeighborhoods"){
						// 				if(yearCheck = "2010"){
						// 			if(d.Status2010 == statusCheck){
						// 				return 5;
						// 			}else{
						// 				return 0;
						// 			}
						// 		}else if(yearCheck = "2011"){
						// 			if(d.Status2011 == statusCheck){
						// 				return 5;
						// 			}else{
						// 				return 0;
						// 			}
						// 		}else if(yearCheck = "2012"){
						// 			if(d.Status2012 == statusCheck){
						// 				return 5;
						// 			}else{
						// 				return 0;
						// 			}
						// 		}else if(yearCheck = "2013"){
						// 			if(d.Status2013 == statusCheck){
						// 				return 5;
						// 			}else{
						// 				return 0;
						// 			}
						// 		}else{
						// 			return 0;
						// 		}
						// 	}else if(locationCheck == undefined){
						// 		if(yearCheck = "2010"){
						// 			if(d.Status2010 == statusCheck){
						// 				return 5;
						// 			}else{
						// 				return 0
						// 			}
						// 		}
						// 		if(yearCheck = "2011"){
						// 			if(d.Status2011 == statusCheck){
						// 				return 5;
						// 			}else{
						// 				return 0
						// 			}
						// 		}
						// 		if(yearCheck = "2012"){
						// 			if(d.Status2012 == statusCheck){
						// 				return 5;
						// 			}else{
						// 				return 0
						// 			}
						// 		}
						// 		if(yearCheck = "2013"){
						// 			if(d.Status2013 == statusCheck){
						// 				return 5;
						// 			}else{
						// 				return 0
						// 			}
						// 		}else{
						// 			return 0;
						// 		}
						// 	}else{ 
						// 		return 0;
						// 	}
						// })
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
	$("#help").click(function(){
		event.preventDefault()
		// if(this).hasClass("noselect"){

		// }
	})
});

//map zooming - needs to be called AFTER document.ready()

$(window).load(function(){

	//function for each neighborhood
	function AllNeighborhoods(){
		event.preventDefault();
		projection.scale(250000)
					.rotate([122.4167,0])
					.center([0, 37.757]);
					d3.selectAll("path")
					 .transition()
					 .duration(1000)
					 .attr("d", path);
					 d3.selectAll("circle")
					 .transition()
					 .duration(1000)
					 .attr("cx", function(d){
						return projection([d.Longitude, d.Latitude])[0];
					})
					.attr("cy", function(d){
						return projection([d.Longitude, d.Latitude])[1];
					});
				}
	function Fidi(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4008052,0])
						.center([0, 37.79013461]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
	function Dwntwn(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4124281, 0])
 						.center([0, 37.78137991]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
	function Soma(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4077413, 0])
 						.center([0, 37.77382315]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
	function WesternSoma(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4115686, 0])
 						.center([0, 37.77338002]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
	function Mission(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.408263, 0])
 						.center([0, 37.75883878]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
	function OuterMission(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4520815, 0])
 						.center([0, 37.71664152]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
	function ProtreroHill(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.3883518, 0])
 						.center([0, 37.75374946]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
	function Bayview(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.3869746, 0])
 						.center([0, 37.7435904]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
	function Marina(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4293375, 0])
 						.center([0, 37.80091616]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
	function NorthBeach(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4021995, 0])
 						.center([0, 37.80011861]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
	function NobHill(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4175449, 0])
 						.center([0, 37.78935135]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
	function Chinatown(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4063268, 0])
 						.center([0, 37.79559382]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}

	function WesternAddition(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4218217, 0])
 						.center([0, 37.77791358]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
	function InnerRichmond(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4725904, 0])
 						.center([0, 37.78114476]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
	function OuterRichmond(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4942851, 0])
 						.center([0, 37.77564424]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
		function Seacliff(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4929523, 0])
 						.center([0, 37.78205312]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
		function PresidioHeights(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4482935, 0])
 						.center([0, 37.78260961]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
		function HaightAshbury(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4380397, 0])
 						.center([0, 37.773344]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
		function InnerSunset(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4711688, 0])
 						.center([0, 37.7591531]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
		function OuterSunset(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.48649, 0])
 						.center([0, 37.75903]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
		function BernalHeights(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4087299, 0])
 						.center([0, 37.74018474]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
		function OceanView(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4702383, 0])
 						.center([0, 37.71515607]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}

		function CrockerAmazon(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4509014, 0])
 						.center([0, 37.7091222]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
		function DiamondHeights(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4391709, 0])
 						.center([0, 37.74374505]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
		function Parkside(){
			event.preventDefault();
			projection.scale(1000000)
						.rotate([122.4742638, 0])
 						.center([0, 37.74336457]);
						d3.selectAll("path")
						 .transition()
						 .duration(1000)
						 .attr("d", path);
						 d3.selectAll("circle")
						 .transition()
						 .duration(1000)
						 .attr("cx", function(d){
							return projection([d.Longitude, d.Latitude])[0];
						})
						.attr("cy", function(d){
							return projection([d.Longitude, d.Latitude])[1];
						});
					}
	$(".AllNeighborhoods").on("click", AllNeighborhoods);
	$(".Fidi").on("click", Fidi);
	$(".Dwntwn").on("click", Dwntwn);
	$(".SOMA").on("click", Soma);
	$(".WesternSoma").on("click", WesternSoma);
	$(".Mission").on("click", Mission);
	$(".OuterMission").on("click", OuterMission);
	$(".PotreroHill").on("click", ProtreroHill);
	$(".Bayview").on("click", Bayview);
	$(".Marina").on("click", Marina);
	$(".NorthBeach").on("click", NorthBeach);
	$(".NobHill").on("click", NobHill);
	$(".Chinatown").on("click", Chinatown);
	$(".WesternAddition").on("click", WesternAddition);
	$(".InnerRichmond").on("click", InnerRichmond);
	$(".OuterRichmond").on("click", OuterRichmond);
	$(".Seacliff").on("click", Seacliff);
	$(".PresidioHeights").on("click", PresidioHeights);
	$(".HaightAshbury").on("click", HaightAshbury);
	$(".InnerSunset").on("click", InnerSunset);
	$(".OuterSunset").on("click", OuterSunset);
	$(".BernalHeights").on("click", BernalHeights);
	$(".OceanView").on("click", OceanView);
	$(".CrockerAmazon").on("click", CrockerAmazon);
	$(".DiamondHeights").on("click", DiamondHeights);
	$(".Parkside").on("click", Parkside);

})