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
				//store raphael IDs of each state
				m.stateIDs[state] = m.stateObjs[state].node.raphaelid;
				//and for reverse lookup
				m.stateCodes[m.stateObjs[state].node.raphaelid] = state;
			};
			
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
			
			applyColors: function() {
				for (var state in m.stateObjs) {
					
				}
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
