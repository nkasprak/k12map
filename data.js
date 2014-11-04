// JavaScript Document

(function(m) {
	m.data = {
		theData : {
			"OK" : [-857.01,-0.2363],
			"AL" : [-1128.42,-0.1783],
			"AZ" : [-662.65,-0.1754],
			"ID" : [-964.28,-0.1615],
			"WI" : [-1014,-0.1463],
			"KS" : [-860.57,-0.1461],
			"NC" : [-854.91,-0.1453],
			"UT" : [-665.3,-0.1368],
			"ME" : [-736.25,-0.1331],
			"MS" : [-623.4,-0.1228],
			"KY" : [-561.34,-0.114],
			"GA" : [-535.34,-0.11],
			"VA" : [-679.3,-0.11],
			"SC" : [-317.1,-0.1016],
			"MI" : [-615.02,-0.0952],
			"TX" : [-390.25,-0.0943],
			"IL" : [-221.52,-0.0927],
			"SD" : [-276.83,-0.0813],
			"NM" : [-633.15,-0.0807],
			"FL" : [-267.76,-0.0645],
			"AR" : [-191.89,-0.0448],
			"NV" : [-95.87,-0.0378],
			"CA" : [-208.11,-0.0323],
			"LA" : [-167.46,-0.0319],
			"MT" : [-98.77,-0.022],
			"WV" : [-96.1,-0.0219],
			"TN" : [-34,-0.0083],
			"NJ" : [-19.66,-0.0033],
			"CO" : [-7.65,-0.0017],
			"VT" : [-7.2,-0.0013],
			"OH" : [13.24,0.0029],
			"NE" : [28.84,0.0096],
			"PA" : [32.97,0.0106],
			"NH" : [82.98,0.0164],
			"OR" : [130.75,0.0226],
			"NY" : [194.2,0.0239],
			"MO" : [126.99,0.036],
			"MN" : [383.33,0.038],
			"WY" : [290.45,0.0395],
			"MD" : [320.95,0.0544],
			"RI" : [295.71,0.0557],
			"WA" : [305.82,0.0588],
			"MA" : [276.98,0.063],
			"DE" : [475.43,0.0668],
			"CT" : [325.66,0.0905],
			"AK" : [1351.43,0.1642],
			"ND" : [1328.76,0.3164]
		},
		stateNames: {
			"AL":"Alabama",
			"AK":"Alaska",
			"AZ":"Arizona",
			"AR":"Arkansas",
			"CA":"California",
			"CO":"Colorado",
			"CT":"Connecticut",
			"DE":"Delaware",
			"DC":"Distr. of Col.",
			"FL":"Florida",
			"GA":"Georgia",
			"HI":"Hawaii",
			"ID":"Idaho",
			"IL":"Illinois",
			"IN":"Indiana",
			"IA":"Iowa",
			"KS":"Kansas",
			"KY":"Kentucky",
			"LA":"Louisiana",
			"ME":"Maine",
			"MD":"Maryland",
			"MA":"Massachusetts",
			"MI":"Michigan",
			"MN":"Minnesota",
			"MS":"Mississippi",
			"MO":"Missouri",
			"MT":"Montana",
			"NE":"Nebraska",
			"NV":"Nevada",
			"NH":"New Hampshire",
			"NJ":"New Jersey",
			"NM":"New Mexico",
			"NY":"New York",
			"NC":"North Carolina",
			"ND":"North Dakota",
			"OH":"Ohio",
			"OK":"Oklahoma",
			"OR":"Oregon",
			"PA":"Pennsylvania",
			"RI":"Rhode Island",
			"SC":"South Carolina",
			"SD":"South Dakota",
			"TN":"Tennessee",
			"TX":"Texas",
			"UT":"Utah",
			"VT":"Vermont",
			"VA":"Virginia",
			"WA":"Washington",
			"WV":"West Virginia",
			"WI":"Wisconsin",
			"WY":"Wyoming"
		},
		meta : {
			codes: ["dollar","percent"],
			shortNames: ["Dollar change","Percent change"],
			longNames: [	"Dollar Change in Real Per Pupil Spending Relative to Fiscal Year 2008",
							"Percent Change in Real Per Pupil Spending Relative to Fiscal Year 2008"],
			precisionOffsets : [-1,0] //this is arcane, but affects rounding of max/min colors/gradient. Negative numbers for more sigfigs,
										//positive numbers for fewer.
		},
		getMaxMin: function() {
			m.data.meta.dataMax = [];
			m.data.meta.dataMin = [];
			var tempArr = [];
			var allArr = [];
			var data = m.data.theData;
			for (var state in data) {
				for (var i=0;i<data[state].length;i++) {
					if (typeof(tempArr[i]) == "undefined") tempArr[i] = [];
					tempArr[i].push(data[state][i]);
					if (m.dataScale=="global") allArr.push(data[state][i]);
				}
			}
			function roundOff(val, direction, precOff) {
				var roundFs = {"up":function(x) {return Math.ceil(x);},"down":function(x) {return Math.floor(x);}};
				var theLog = Math.floor(Math.log(Math.abs(val))/Math.LN10)+precOff;
				return roundFs[direction](val/(0.5*Math.pow(10,theLog)))*Math.pow(10,theLog)*0.5;
			}
			for (i=0;i<tempArr.length;i++) {
				if (m.dataScale=="global") {
					m.data.meta.dataMax[i] = Math.max.apply(Math,allArr);
					m.data.meta.dataMin[i] = Math.min.apply(Math,allArr);
				} else {
					m.data.meta.dataMax[i] = Math.max.apply(Math,tempArr[i]);
					m.data.meta.dataMin[i] = Math.min.apply(Math,tempArr[i]);
				}
				m.data.meta.dataMax[i] = roundOff(m.data.meta.dataMax[i],"up",m.data.meta.precisionOffsets[i]);
				m.data.meta.dataMin[i] = roundOff(m.data.meta.dataMin[i],"down",m.data.meta.precisionOffsets[i]); 
			}
		},
		formatters: [
			function(val) {
				val = Math.round(val*100)/100;
				var returnString = "";
				if (val < 0) {
					val = Math.abs(val);
					returnString += "-";	
				} else {
					returnString += "+";	
				}
				returnString += "$";
				returnString += m.utilities.commaSeparateNumber(val);
				return returnString;
			},
			function (data) {
				data = Math.round(data*1000)/10;
				if (data > 0) data = "+" + data;
				data = data + "%";
				return data;
			}
		]
	};
	
	m.data.getMaxMin();

})(k12map);