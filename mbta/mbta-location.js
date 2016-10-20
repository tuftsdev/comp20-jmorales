var map;
var marker;
var myLat = 0;
var myLng = 0;
var myLocation;
var myOptions;
var tStops = [
	['Alewife', 42.395428, -71.142483],	
	['Davis', 42.39674, -71.121815],	
	['Porter Square', 42.3884, -71.11914899999999],	
	['Harvard Square', 42.373362, -71.118956],	
	['Central Square', 42.365486, -71.103802],	
	['Kendall/MIT', 42.36249079, -71.08617653],
	['Charles/MGH', 42.361166, -71.070628],	
	['Park Street', 42.35639457, -71.0624242],	
	['Downtown Crossing', 42.355518, -71.060225],	
	['South Station', 42.352271, -71.05524200000001],
	['Broadway', 42.342622, -71.056967],	
	['Andrew', 42.330154, -71.057655],
	['JFK/UMass', 42.320685, -71.052391],
	['North Quincy', 42.275275, -71.029583],	
	['Wollaston', 42.2665139, -71.0203369],	
	['Quincy Center', 42.251809, -71.005409],
	['Quincy Adams', 42.233391, -71.007153],	
	['Braintree', 42.2078543, -71.0011385],	
	['Savin Hill', 42.31129, -71.053331],
	['Fields Corner', 42.300093, -71.061667],
	['Shawmut', 42.29312583, -71.06573796000001],
	['Ashmont', 42.284652, -71.06448899999999]
];

var redLine1 = [];

var redLine2 = [{lat: tStops[12][1], lng: tStops[12][2]}]
		

function init() {
	myLocation = new google.maps.LatLng(myLat, myLng);
	myOptions = {
		zoom: 12,
		center:{lat: 42.39674, lng: -71.121815},
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };
	map = new google.maps.Map(document.getElementById('map'), myOptions);
	getLocation();
	displayTStops();
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			displayLocation();
		});
	} else {
		alert("Browser does not support geolocation");
	}	
}

function displayLocation() {
	myLocation = new google.maps.LatLng(myLat, myLng);
	map.panTo(myLocation);
	marker = new google.maps.Marker({
		position: myLocation,
		title: "My Location",
		icon: {
			url: "pin.png",
			scaledSize: new google.maps.Size(25,25)
		}
	});
	marker.setMap(map);
	haversineForm();
}

// code used from 
//http://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
function haversineForm() {
	Number.prototype.toRad = function() {
		return (this * Math.PI / 180);
	}
	var minDist = null;
	var temp;
	var loc;
	var R; // miles
	R = 3958.756;
	for (var i = 0; i < tStops.length; i++) {
		var x1 = tStops[i][1] - myLat;
		var dLat = x1.toRad();
		var x2 = tStops[i][2] - myLng;
		var dLon = x2.toRad();
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(myLat.toRad()) * Math.cos(tStops[i][1].toRad()) *
				Math.sin(dLon/2) * Math.sin(dLon/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		temp = R * c;
		if (temp <= minDist || minDist == null) {
			minDist = temp;
			loc = i;
		}		
	}
	var closestLine = new google.maps.Polyline({
		path: [{lat: myLat, lng: myLng}, 
				{lat: tStops[loc][1], lng: tStops[loc][2]}],
		geodesic: true,
		strokeColor: '#0033CC',
		strokeCapacity: 1.0,
		strokeWeight: 2		
	});
	closestLine.setMap(map);
}

function displayTStops() {
	for (var i = 0; i < tStops.length; i++) {
		var stop = tStops[i];
		var stopLocation = new google.maps.LatLng(stop[1], stop[2]);
		var tMarker = new google.maps.Marker({
			position: stopLocation,
			title: stop[0],
			icon: {
				url: "mbta.png",
				scaledSize: new google.maps.Size(25,25)
			}
		});
		tMarker.setMap(map);
	}
	setPolyline();
}

function setPolyline() {
	var j = 1;
	for (var i = 0; i <= 17; i++) {
		redLine1[i] = {lat: tStops[i][1], lng: tStops[i][2]};
	}
	for (var i = 18; i <= 21; i++) {
		redLine2[j] = {lat: tStops[i][1], lng: tStops[i][2]};
		j++;
	}
	var redBraintree = new google.maps.Polyline({
		path: redLine1,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeCapacity: 1.0,
		strokeWeight: 2
	});
	var redAshmont = new google.maps.Polyline({
		path: redLine2,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeCapacity: 1.0,
		strokeWeight: 2
	});	
	redBraintree.setMap(map);
	redAshmont.setMap(map);
}