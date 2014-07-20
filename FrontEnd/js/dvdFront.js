var jumboEastCoast = new google.maps.LatLng(1.305189, 103.930657);
var ships = [];
var shipIdToIdx=[]
var idxToShipId=[]

var shipTypes = ['Cargo', 'Tanker', 'Passenger', 'High Speed Craft', 'Tugs/Pilots', 'Yacht']

function randomShipType() {
	return shipTypes[Math.floor(Math.random()*shipTypes.length)]
}

var typeColors = []
typeColors['Cargo'] = {fill: '#01DF3A', stroke: '#000000'}
typeColors['Tanker'] = {fill: '#FF0000', stroke: '#000000'}
typeColors['Passenger'] = {fill: '#0101DF', stroke: '#000000'}
typeColors['High Speed Craft'] = {fill: '#FFFF00', stroke: '#000000'}
typeColors['Tugs/Pilots'] = {fill: '#00BFFF', stroke: '#000000'}
typeColors['Yacht'] = {fill: '#A4A4A4', stroke: '#000000'}

var shipData = []
shipData['Cargo'] = {length: 180, breadth: Math.pow(180.0, 2.0/3) + 1, GT: 100000, cargoType: function() {var items=['Gas','Chemical','Container Cargo', 'Passengers', 'Vehicles'];return items[Math.floor(Math.random()*items.length)];}, max_speed: 25}
shipData['Tanker'] = {length: 250, breadth: Math.pow(250.0, 2.0/3) + 1, GT: 200000,cargoType: function() {return 'Petrochemicals'}, max_speed: 25}
shipData['Passenger'] = {length: 80, breadth: Math.pow(80.0, 2.0/3) + 1, GT: 50000,cargoType: function() {return 'Passengers'}, max_speed: 30}
shipData['High Speed Craft'] = {length: 40, breadth: Math.pow(40.0, 2.0/3) + 1, GT: 40000, cargoType: function() {return 'Passengers'}, max_speed: 50}
shipData['Tugs/Pilots'] = {length: 35, breadth: Math.pow(35.0, 2.0/3) + 1, GT: 35000, cargoType: function() {return 'Passengers'},max_speed: 15}
shipData['Yacht'] = {length: 30, breadth: Math.pow(30.0, 2.0/3) + 1, GT: 30000, cargoType: function() {return 'Passengers'}, max_speed: 40}

function zoomTo(lat, lng) {
	map.setCenter(new google.maps.LatLng(lat, lng))
	map.setZoom(14)
}

function checkForViolations() {
	for (var i = 0; i < ships.length; i++) {
		ships[i].setShipDomainPolyOptions('#000000', '#ff0000', 0.4, 0.2);
	}

	pairs = domainViolationService.check(ships)

	document.getElementById('10min').innerHTML = ''
	for (var i = 0; i < pairs.length; i++) {
		// pairs[i][0].setShipPolyOptions('#000000', '#ff0000', 1, 0.7);
		// pairs[i][1].setShipPolyOptions('#000000', '#ff0000', 1, 0.7);
		pairs[i][0].setShipDomainPolyOptions('#000000', '#ff0000', 1, 0.7);
		pairs[i][1].setShipDomainPolyOptions('#000000', '#ff0000', 1, 0.7);
		var li=document.createElement('li');

		var pos1 = coordThings.shiftLatLngMetric(pairs[i][0].basePosition, pairs[i][0].v)
		var pos2 = coordThings.shiftLatLngMetric(pairs[i][1].basePosition, pairs[i][1].v)
		map.setZoom(16)
		li.innerHTML="<A HREF='javascript:zoomTo("+((pos1.dlat+pos2.dlat)/2)+","+((pos1.dlng+pos2.dlng)/2)+")'>" + pairs[i][0].shipName + '('+pairs[i][0].cargoType+')' + " and " + pairs[i][1].shipName + '('+pairs[i][1].cargoType+')' + "</A> <br ><br>";
		document.getElementById('10min').appendChild(li);
	}
}

function getStatusFunction(ship) {
	return function() { 
			document.getElementById('sname').innerHTML = ship.shipName
			document.getElementById('ctype').innerHTML = ship.cargoType
			var dll = coordThings.shiftLatLngMetric(ship.basePosition, ship.v)
			document.getElementById('location').innerHTML = (Math.floor(dll.dlat*100)/100) + ' &#x00B0;N<br>' + (Math.floor(dll.dlng*100)/100) + ' &#x00B0;E'
			document.getElementById('heading').innerHTML = Math.round(ship.theta*100)/100 + '&deg;'
			console.log(ship._shipId + ' ' + ship.theta)
		}
}

function initShipSimulation() {
	for (var i = 0; i < 50; i++) {
		var thisShipType = randomShipType()
		var ship_dimensions = shipFactory.makeShipDims(shipData[thisShipType].length, shipData[thisShipType].breadth, shipData[thisShipType].length/20.0)

		var pt = chuckPointsAtJeremy()
		var ship_location = new google.maps.LatLng(pt[0], pt[1])

		var ship = shipFactory.makeEZShip(ship_dimensions, ship_location)
		ship.theta = (Math.random() * -45) - 15
		ship.setShipType(thisShipType)
		ship.velocity_in_metres = 1.8 * (shipData[thisShipType].max_speed / 4.0) * (1 + 3 * Math.random())

		ship.GT = shipData[thisShipType].GT
		ship.setShipName(randomShipName())
		ship.cargoType = shipData[thisShipType].cargoType()

		ship.setMouseOverListener(getStatusFunction(ship))
		ship.setMouseOutListener(function() { 
			document.getElementById('sname').innerHTML = '-'
			document.getElementById('ctype').innerHTML = '-'
			document.getElementById('location').innerHTML = '-'
		})

		ships.push(ship)
		// shipIdToIdx[shipID] = ships.length
		// idxToShipId.push(shipID)
	}


	for (var i = 0; i < ships.length; i++) {
		var myTypeColor = typeColors[ships[i].shipType]
		ships[i].setShipPolyOptions(myTypeColor.stroke, myTypeColor.fill, 0.8, 0.6);
		ships[i].setShipDomainPolyOptions('#000000', '#ff0000', 0.4, 0.2);

		ships[i].placeOnMap(map)
	}
}

var TIME_STEP_IN_MS = 50
var MOVEMENT_MUL = 2
function takeASimulationStep() {

	for (var i = 0; i < ships.length; i++) {

		var new_position = coordThings.shiftLatLngMetricGoogle(ships[i].basePosition,
						coordThings.shiftMetric(ships[i].v,
							coordThings.delta((TIME_STEP_IN_MS/1000) * ships[i].velocity_in_metres*coordThings.cosDeg(ships[i].theta),
								(TIME_STEP_IN_MS/1000) * ships[i].velocity_in_metres*coordThings.sinDeg(ships[i].theta))
							)
						)
		var new_theta = ships[i].theta + MOVEMENT_MUL*(2*Math.random() - 1)*TIME_STEP_IN_MS/1000.0
		var new_velocity = Math.max(0, ships[i].velocity_in_metres + MOVEMENT_MUL*(2*Math.random()-1) * TIME_STEP_IN_MS / 1000.0 )

		ships[i].updatePosition(coordThings.delta(0,0), new_theta, new_position)
		ships[i].velocity_in_metres = new_velocity

		ships[i].updateDomainParams(2 * ships[i]._dims.breadth,
									ships[i]._dims.length * (2 - Math.exp(- (ships[i].velocity_in_metres / 20.0) * (ships[i].GT / 50000.0))),
									15 * Math.exp(- ships[i].velocity_in_metres / 20.0),
									0.25 * ships[i]._dims.length)
	}

	// Test for domain violations
	checkForViolations()

	window.setTimeout(takeASimulationStep, TIME_STEP_IN_MS)
}

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


	var infoWindow = new google.maps.InfoWindow({
		position: jumboEastCoast,
		content: 'Click to Start...'
	});
	infoWindow.open(map);

	var startClickListener = null
	startClickListener = google.maps.event.addListener(map, 'click', function(event) {
		infoWindow.close();
		google.maps.event.removeListener(startClickListener)

		takeASimulationStep()
		// map.setCenter(new google.maps.LatLng(1.207953, 103.385195))
	});

	initShipSimulation()
}

google.maps.event.addDomListener(window, 'load', initialize);
