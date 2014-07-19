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