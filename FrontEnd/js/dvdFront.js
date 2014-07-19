var jumboEastCoast = new google.maps.LatLng(1.305189, 103.930657);
var ships = []

function initialize() {
	mapDiv = document.getElementById('map-canvas');

	map = new google.maps.Map(mapDiv, {
		center: jumboEastCoast,
		zoom: 15,
		//mapTypeID: google.maps.MapTypeId.TERRAIN
		//mapTypeID: google.maps.MapTypeId.SATELLITE
		// mapTypeId: google.maps.MapTypeId.ROADMAP
		//mapTypeId: google.maps.MapTypeId.HYBRID
		/*
		MapTypeId.ROADMAP displays the default road map view. This is the default map type.
		MapTypeId.SATELLITE displays Google Earth satellite images
		MapTypeId.HYBRID displays a mixture of normal and satellite views
		MapTypeId.TERRAIN displays a physical map based on terrain information.
		*/
	});
	//map.setTilt(45);
}

google.maps.event.addDomListener(window, 'load', initialize);


function checkForViolations(){
	pairs = domainViolationService.check(ships);
	for (var i = 0; i < pairs.length; i++) {
		console.log(pairs[i]);
		console.log(pairs[i][0]._shipId, pairs[i][1]._shipId);
		// pairs[i][0].setShipPolyOptions('#000000', '#ff0000', 1, 0.7);
// 		pairs[i][1].setShipPolyOptions('#000000', '#ff0000', 1, 0.7);
		pairs[i][0].setShipDomainPolyOptions('#000000', '#ff0000', 1, 0.7);
		pairs[i][1].setShipDomainPolyOptions('#000000', '#ff0000', 1, 0.7);
		var li=document.createElement('li');
		li.innerHTML=violatingPairs[i][0]._shipId + " " + violatingPairs[i][1]._shipId.toString();
		document.getElementById('10min').appendChild(li);
	}
	console.log(pairs);
}