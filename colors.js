// JavaScript Document

(function(m) {

	m.colorConfig = {
		highColor : "#0081a4",
		zeroColor : "#ffffff",
		lowColor  : "#b9292f",
		hoverColor:	"#f8c55b"
	};
	
	m.hexToRGB = function (hexString) {
		var r = parseInt(hexString.substr(1, 2), 16);
		var g = parseInt(hexString.substr(3, 2), 16);
		var b = parseInt(hexString.substr(5, 2), 16);
		return [r, g, b];
	};

	m.RGBToHex = function (rgbArray) {
		function pad(num, size) {
			var s = "0" + num;
			return s.substr(s.length - size);
		}
		return "#" + pad(rgbArray[0].toString(16), 2) + pad(rgbArray[1].toString(16), 2) + pad(rgbArray[2].toString(16), 2);
	};
	
	m.stateColors = {};
	
	m.calcStateColors = function(dataIndex) {
		var scale, state, dataPoint, dMax, dMin, calcColor, highRGB, lowRGB, zeroRGB, spansZero;
		
		highRGB = m.hexToRGB(m.colorConfig.highColor);
		zeroRGB = m.hexToRGB(m.colorConfig.zeroColor);
		lowRGB = m.hexToRGB(m.colorConfig.lowColor);
		
		calcColor = function(cScale) {
			var rgb = [];
			var rgbVal;
			for (var i=0;i<3;i++) {
				if (spansZero) {
					if (cScale < 0) {
						rgbVal = (0-cScale)*(zeroRGB[i] - lowRGB[i]) + lowRGB[i];
					} else {
						rgbVal = cScale*(highRGB[i] - zeroRGB[i]) + zeroRGB[i];
					}
				} else {
					rgbVal = cScale*(highRGB[i] - lowRGB[i]) + lowRGB[i];
				}
				rgb[i] = Math.round(rgbVal);
			}
			return m.RGBToHex(rgb);
		};
		
		dMax = m.data.meta.dataMax[dataIndex];
		dMin = m.data.meta.dataMin[dataIndex];
		
		spansZero = (dMax > 0 && dMin < 0);
		
		for (state in m.data.theData) {
			dataPoint = m.data.theData[state][dataIndex];
			
			if (spansZero) {
				//Data has positive and negative values - use a zero color
				if (dataPoint < 0) scale = 0-(dataPoint - dMin)/(0 - dMin);
				else scale = (dataPoint - 0)/(dMax - 0);
			} else {
				//Data is entirely positive or negative - don't use special zero color
				scale = (dataPoint - dMin)/(dMax - dMin); 
			}
			
			m.stateColors[state] = calcColor(scale); 
		}
	};
})(k12map);
