// JavaScript Document

var k12map = (function() {
	
	var m = (function() {
		
		var initialized = false;
		var initialWidth;
		var initialize = function() {
			
			function makeState(pathString) {
				m.stateObjs[state] = m.paper.path(pathString);
				m.stateObjs[state].transform(m.transformString);
				m.stateObjs[state].attr({
					cursor: "pointer",
					fill: "#999",
					"stroke-width":0.5
				});
				
				
				m.stateObjs[state].hover(function(e) {
					if (m.stateCodes) var state = m.stateCodes[this.id];
					stateEnter(state);
				},function(e) {
					stateLeave();
				});
				
				//store raphael IDs of each state
				m.stateIDs[state] = m.stateObjs[state].node.raphaelid;
				//and for reverse lookup
				m.stateCodes[m.stateObjs[state].node.raphaelid] = state;
			};
			
			function stateEnter(state) {
				if (initialized) {
					clearTimeout(m.fadeTimer);
					if (state != m.currentStatePopup) {
						m.currentStatePopup = state;
						m.popupTimer = setTimeout(function() {
							m.popupState(m.currentStatePopup);
						},50);
					}
				}
			};
			
			function stateLeave() {
				if (initialized) {
					clearTimeout(m.fadeTimer);
					m.fadeTimer = setTimeout(m.fadeoutPopups,100);
				}
			}
			
			function makeText(coords) {
				if (text_configs.offset[state]) {
					coords[0] += text_configs.offset[state][0];
					coords[1] += text_configs.offset[state][1];
				}
			
				m.stateLabelObjs[state] = m.paper.text(coords[0],coords[1],state);
				m.stateLabelObjs[state].attr({
					"font-size":18,
					"font-family":$("#" + m.mapDivID).css("font-family")
				});
				
				m.stateLabelObjs[state].hover(function(e) {
					var state = $(this[0]).children("tspan").html();
					stateEnter(state);
				},function(e) {
					stateLeave();
				});
				
				//store raphael IDs of each label
				m.stateTextIDs[state] = m.stateLabelObjs[state].node.raphaelid;
				
			}
			
			m.paper = Raphael(m.mapDivID,m.width,m.height);
			
			for (var state in map_paths) {
				makeState(map_paths[state].path);
				if (text_configs.hide[state]) {} else {
					makeText(m.utilities.pathCenter(m.stateObjs[state]));
				}
			}
			
			m.calcStateColors(0);
			m.applyStateColors();
		
			$("#map").on("mouseleave","div.popup",function() {
				stateLeave();
			});
			
			$("#map").on("mouseenter","div.popup",function() {
				clearTimeout(m.fadeTimer);
			});
			
			$("#map").on("mousemove",function(e) {
				
				if (initialized) {
					if ($(e.target).prop("tagName") == "path") {
						m.mousePos.x = e.offsetX;
						m.mousePos.y = e.offsetY;
					}
				}
				
			});
		
			initialized = true;
		}
		
		return {
			
			mapDivID: "map",
			
			resizeMap : function() {
				var width;
				width = $("#" + m.mapDivID).width();
				m.height = width*0.8;
				m.width = width;
				if (!initialized) initialWidth = m.width;
				$("#" + m.mapDivID).css("height",m.height);
				
				m.path_scale = Math.round(m.width * 100 / 940) / 100;
				m.text_scale = Math.round(m.width/initialWidth * 100)/100;
			
				m.transformString = "s" + m.path_scale + "," + m.path_scale + ",0,0";
				m.textTransformString = "s" + m.text_scale + "," + m.text_scale + ",0,0";
				
				if (initialized == true) m.applyNewTransform();
			},
			
			mousePos: {x: 0, y:0},
			
			applyNewTransform: function() {
				var state;
				for (state in map_paths) {
					m.stateObjs[state].transform(m.transformString);
					if (m.stateLabelObjs[state]) m.stateLabelObjs[state].transform(m.textTransformString);
				}
			},
			
			pageLoadFunction : function() {
				m.resizeMap();
				$(window).resize(m.resizeMap);
				initialize();
			},
			
			setFadeoutTimer: function() {
				clearTimeout(m.fadeTimer);
				m.fadeTimer = setTimeout(function() {
					m.fadeoutPopups();
				},3000);
			},
			
			fadeoutPopups : function() {
				$("#map .popup").fadeOut(200,null,function() {
					$(this).remove();	
				});
				m.currentStatePopup = "none";
			},
						
			currentStatePopup : "none",
			
			popupState: function(state) {
				if (state != "none") {
					var coords = [m.mousePos.x,m.mousePos.y];
					var popup = $("<div class=\"popup\" style=\"display:none\">");
					m.fadeoutPopups();
					popup.html(m.popupTemplate(state));
					if (coords[1] < m.height/2) {
						popup.css("top",coords[1]);
					} else {
						popup.css("bottom",m.height - coords[1]);
					}
					if (coords[0] < m.width/2) {
						popup.css("left",coords[0]);
					} else {
						popup.css("right",m.width - coords[0]);
					}
					$("#map").append(popup);
					popup.fadeIn(200);
					m.setFadeoutTimer();
				}
			},
			
			popupTemplate: function(state) {
				if (typeof(m.data.theData[state]) == "undefined") return "No data";
				var htmlString = "";
				htmlString += "<h4>" + m.data.stateNames[state] + "</h4>";
				htmlString += "<ul>";
				for (var dataSet = 0;dataSet<m.data.meta.codes.length;dataSet++) {
					htmlString += "<li>" + m.data.meta.shortNames[dataSet];
					htmlString += ": ";
					htmlString += m.data.theData[state][dataSet];
					htmlString += "</li>";	
				}
				htmlString += "</ul>";
				return htmlString;
			},
			
			stateObjs: {},
			
			stateLabelObjs: {},
			
			stateIDs: {},
			
			stateTextIDs: {},
			
			stateCodes: {},
			
			utilities: {
				pathCenter: function(p) {
					var box,x,y 
					box = p.getBBox(); 
					x = Math.floor(box.x + box.width/2.0); 
					y = Math.floor(box.y + box.height/2.0);
					return [x,y];
				}
			}
		}
	}());
	
	return m;
}());

$(document).ready(function() {
	k12_floader.documentReady = true;
	if (k12_floader.fontsLoaded && k12_floader.documentReady) {
		k12map.pageLoadFunction();		
	}	
});
