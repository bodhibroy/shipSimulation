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
shipData['Cargo'] = {length: 300, breadth: 30, GT: 1000000, cargoType: function() {var items=['Gas','Chemical','Container Cargo', 'Passenger', 'Vehicles'];return items[Math.floor(Math.random()*items.length)];}, max_speed: 25}
shipData['Tanker'] = {length: 400, breadth: 30, GT: 2300000,cargoType: 'Oil (Crude/Refined)', max_speed: 25}
shipData['Passenger'] = {length: 200, breadth: 30, GT: 100000,cargoType: 'Passenger', max_speed: 30}
shipData['High Speed Craft'] = {length: 100, breadth: 30, GT: 2300000, cargoType:'Passenger', max_speed: 40}
shipData['Tugs/Pilots'] = {length: 50, breadth: 30, GT: 2300000, cargoType:'Crew',max_speed: 15}
shipData['Yacht'] = {length: 35, breadth: 30, GT: 2300000, cargoType:'Passenger', max_speed: 50}


function checkForViolations() {
	for (var i = 0; i < ships.length; i++) {
		ships[i].setShipDomainPolyOptions('#000000', '#ff0000', 0.4, 0.2);
	}

	pairs = domainViolationService.check(ships)

	document.getElementById('10min').innerHTML = ''
	for (var i = 0; i < pairs.length; i++) {
		console.log(pairs[i]);
		console.log(pairs[i][0]._shipId, pairs[i][1]._shipId);
		// pairs[i][0].setShipPolyOptions('#000000', '#ff0000', 1, 0.7);
		// pairs[i][1].setShipPolyOptions('#000000', '#ff0000', 1, 0.7);
		pairs[i][0].setShipDomainPolyOptions('#000000', '#ff0000', 1, 0.7);
		pairs[i][1].setShipDomainPolyOptions('#000000', '#ff0000', 1, 0.7);
		var li=document.createElement('li');
		li.innerHTML=violatingPairs[i][0]._shipId + " " + violatingPairs[i][1]._shipId.toString();
		li.onclick = function() {
				map.panTo(coordThings.shiftLatLngMetricGoogle(pairs[i][0].basePosition, pairs[i][0].v))
			}
		document.getElementById('10min').appendChild(li);
	}
	console.log(pairs);
}

function initShipSimulation() {
	for (var i = 0; i < 50; i++) {
		var thisShipType = randomShipType()
		var ship_dimensions = shipFactory.makeShipDims(shipData[thisShipType].length, shipData[thisShipType].breadth, shipData[thisShipType].length/20.0)

		var pt = chuckPointsAtJeremy()
		var ship_location = new google.maps.LatLng(pt[0], pt[1])

		var ship = shipFactory.makeEZShip(ship_dimensions, ship_location)
		ship.theta = Math.random() * -5 - 15
		ship.setShipType(thisShipType)
		ship.velocity_in_metres = (shipData[thisShipType].max_speed / 4.0) * (1 + 2 * Math.random())
		ship.GT = shipData[thisShipType].GT

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
function takeASimulationStep() {

	for (var i = 0; i < ships.length; i++) {

		var new_v = coordThings.shiftMetric(ships[i].v,
				coordThings.delta((TIME_STEP_IN_MS/1000) * ships[i].velocity_in_metres*coordThings.cosDeg(ships[i].theta),
							(TIME_STEP_IN_MS/1000) * ships[i].velocity_in_metres*coordThings.sinDeg(ships[i].theta))
				)

		ships[i].updatePosition(new_v, ships[i].theta + Math.random()*TIME_STEP_IN_MS/1000.0)
		ships[i].velocity_in_metres = Math.max(0, ships[i].velocity_in_metres + Math.random() * TIME_STEP_IN_MS / 1000.0 )

		ships[i].updateDomainParams(2 * ships[i]._dims.breadth,
									ships[i]._dims.length * (2.5 - Math.exp(- (ships[i].velocity_in_metres / 20.0) * (ships[i].GT / 50000.0))),
									15 * Math.exp(- ships[i].velocity_in_metres / 20.0),
									0.25 * ships[i]._dims.length)
	}

	// Test for domain violations


	window.setTimeout(takeASimulationStep, 20)
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
	});

	initShipSimulation()
}

google.maps.event.addDomListener(window, 'load', initialize);
