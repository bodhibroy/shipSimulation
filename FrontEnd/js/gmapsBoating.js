// Misc Things
var misc = {}
misc.componentToHex = function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
misc.rgbToHex = function(r, g, b) {
    return "#" + misc.componentToHex(r) + misc.componentToHex(g) + misc.componentToHex(b);
}

misc.reduceFunctionMinLng = function(previousValue, currentValue, index, array) {
	return Math.min(previousValue, currentValue.dlng)
}
misc.reduceFunctionMaxLng = function(previousValue, currentValue, index, array) {
	return Math.max(previousValue, currentValue.dlng)
}
misc.reduceFunctionMinLat = function(previousValue, currentValue, index, array) {
	return Math.min(previousValue, currentValue.dlat)
}
misc.reduceFunctionMaxLat = function(previousValue, currentValue, index, array) {
	return Math.max(previousValue, currentValue.dlat)
}

misc.reduceFunctionMinX = function(previousValue, currentValue, index, array) {
	return Math.min(previousValue, currentValue.dx)
}
misc.reduceFunctionMaxX = function(previousValue, currentValue, index, array) {
	return Math.max(previousValue, currentValue.dx)
}
misc.reduceFunctionMinY = function(previousValue, currentValue, index, array) {
	return Math.min(previousValue, currentValue.dy)
}
misc.reduceFunctionMaxY = function(previousValue, currentValue, index, array) {
	return Math.max(previousValue, currentValue.dy)
}

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------

// Testing Stuff
var tests = {}
tests.assertEqual = function(testName, v1, v2) {
	if (v1 !== v2) {
		console.log("(" + testName + ") [EqS] Assertion failed: " + v1 + " (expected: "+v2+")")
	}
}
tests.assertEqual = function(testName, v1, v2) {
	if (v1 != v2) {
		console.log("(" + testName + ") [Eq] Assertion failed: " + v1 + " (expected: "+v2+")")
	}
}
tests.assertGT = function(testName, v1, v2) {
	if (v1 <= v2) {
		console.log("(" + testName + ") [GT] Assertion failed: " + v1 + " (expected: "+v2+")")
	}
}
tests.assertGE = function(testName, v1, v2) {
	if (v1 < v2) {
		console.log("(" + testName + ") [GE] Assertion failed: " + v1 + " (expected: "+v2+")")
	}
}
tests.assertLT = function(testName, v1, v2) {
	if (v1 >= v2) {
		console.log("(" + testName + ") [LT] Assertion failed: " + v1 + " (expected: "+v2+")")
	}
}
tests.assertLE = function(testName, v1, v2) {
	if (v1 > v2) {
		console.log("(" + testName + ") [LE] Assertion failed: " + v1 + " (expected: "+v2+")")
	}
}


//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------

// Coordinate Things
var coordThings = {
	delta : function(dx, dy) {
		return {dx: dx, dy: dy}
	},
	
	sinDeg : function(angle) {
		theta = Math.PI * angle / 180.0
		return Math.sin(theta)
	},
	
	cosDeg : function(angle) {
		theta = Math.PI * angle / 180.0
		return Math.cos(theta)
	},
	
	makeVector : function(angle, M) {
		theta = Math.PI * angle / 180.0
		return {dx: M * Math.cos(theta), dy: M * Math.sin(theta)}
	},	

	rotate : function(pt, angle) {
		theta = Math.PI * angle / 180.0
		ct = Math.cos(theta)
		st = Math.sin(theta)
		pt2 = {dx: pt.dx * ct - pt.dy * st, dy: pt.dy * ct + pt.dx * st}
		return pt2
	},
	
	metresToDeg : function(pt) {
		var degPerMetre = 1.0 / 111319.9
		return {dlng: degPerMetre * pt.dx, dlat: degPerMetre * pt.dy}
	},

	degToMetres : function(ll) {
		var metresPerDeg = 111319.9
		return {dx: metresPerDeg * ll.dlat, dy: metresPerDeg * ll.dlng}
	},

	shiftMetric : function(v, dv) {
		return {dx: v.dx + dv.dx, dy: v.dy + dv.dy}
	},

	shiftLatLng : function(ll, dll) {
		return new google.maps.LatLng(ll.lat() + dll.dlat, ll.lng() + dll.dlng)
	},

	boundingBox : function(verts) {
		bb = {}
		bb.x_min = verts.reduce(misc.reduceFunctionMinX, Infinity)
		bb.x_max = verts.reduce(misc.reduceFunctionMaxX, -Infinity)
		bb.y_min = verts.reduce(misc.reduceFunctionMinY, Infinity)
		bb.y_max = verts.reduce(misc.reduceFunctionMaxY, -Infinity)

		return bb
	},

	/*
	boundingBoxLL : function(verts) {
		bb = {}
		bb.lng_min = verts.reduce(misc.reduceFunctionMinLng, Infinity)
		bb.lng_max = verts.reduce(misc.reduceFunctionMaxLng, -Infinity)
		bb.lat_min = verts.reduce(misc.reduceFunctionMinLat, Infinity)
		bb.lat_max = verts.reduce(misc.reduceFunctionMaxLat, -Infinity)

		return bb
	},
	*/

	flatEarthConversionLLtoMetric: function(ll) {
		var metresPerDeg = 111319.9
		return {dx: metresPerDeg * ll.dlng, dy: metresPerDeg * ll.dlat}
	}

}
coordThings.shiftLatLngMetric = function(ll, dv) {
	dll = coordThings.metresToDeg(dv)
	return {dlat: ll.lat() + dll.dlat, dlng: ll.lng() + dll.dlng}
}
coordThings.shiftLatLngMetricGoogle = function(ll, dv) {
	dll = coordThings.metresToDeg(dv)
	return new google.maps.LatLng(ll.lat() + dll.dlat, ll.lng() + dll.dlng)
}
coordThings.pathFromMetricDeltas = function(refLL, dv, verts, angle) {
	return verts.map(function(v) {
		var shift = coordThings.shiftMetric(coordThings.rotate(v, angle), dv)
		return coordThings.shiftLatLngMetric(refLL, shift)
	})
}
coordThings.pathFromMetricDeltasGoogle = function(refLL, dv, verts, angle) {
	return verts.map(function(v) {
		var shift = coordThings.shiftMetric(coordThings.rotate(v, angle), dv)
		return coordThings.shiftLatLngMetricGoogle(refLL, shift)
	})
}
coordThings.isPointInPoly = function(pt, verts) {
	var theta = 0

	var v1 = coordThings.delta(verts[verts.length - 1].dx - pt.dx, verts[verts.length - 1].dy - pt.dy)
	var v2 = coordThings.delta(verts[0].dx - pt.dx, verts[0].dy - pt.dy)
	var sgn = (v1.dx * v2.dy - v1.dy * v2.dx > 0 ? 1 : -1)
	var lenLen = (v1.dx * v1.dx + v1.dy * v1.dy) * (v2.dx * v2.dx + v2.dy * v2.dy)

	if (lenLen == 0) {
		return true
	}

	var dot = (lenLen > 0 ? (v1.dx * v2.dx + v1.dy * v2.dy) / Math.sqrt(lenLen) : 0)

	if (dot < 1e-13 - 1) {
		return true
	}

	theta += Math.acos(dot) * sgn

	for (var i = 1; i < verts.length; i++) {
		v1 = coordThings.delta(verts[i-1].dx - pt.dx, verts[i-1].dy - pt.dy)
		v2 = coordThings.delta(verts[i].dx - pt.dx, verts[i].dy - pt.dy)
		sgn = (v1.dx * v2.dy - v1.dy * v2.dx > 0 ? 1 : -1)
		lenLen = (v1.dx * v1.dx + v1.dy * v1.dy) * (v2.dx * v2.dx + v2.dy * v2.dy)

		if (lenLen == 0) {
			return true
		}

		dot = (lenLen > 0 ? (v1.dx * v2.dx + v1.dy * v2.dy) / Math.sqrt(lenLen) : 0)

		if (dot < 1e-12 - 1) {
			return true
		}

		theta += Math.acos(dot) * sgn 
	}

	return (theta > 1e-10 ? true : false)
}
coordThings.approxPolyMembership = function(vertsBase, verts) {
	for (var i = 0; i < verts.length; i++) {
		if(coordThings.isPointInPoly(verts[i], vertsBase)) {
			return true
		}
	}
	return false
}
coordThings.approxPolyIntersection = function(verts1, verts2) {
	return coordThings.approxPolyMembership(verts1, verts2) || coordThings.approxPolyMembership(verts2, verts1)
}

if (false)
{
	// Intersection Tests
	var vvvv = [coordThings.delta(0,0), coordThings.delta(2,0), coordThings.delta(0.5,0.5), coordThings.delta(0,2)]
	var vvvv2 = [coordThings.delta(-0.5,-0.5), coordThings.delta(2,0), coordThings.delta(0.25,0.25), coordThings.delta(0,2)]
	var vvvv3 = [coordThings.delta(0.1,0.1), coordThings.delta(0.2,0.1), coordThings.delta(0.2,0.2), coordThings.delta(0.1,0.2)]
	var pt_in = coordThings.delta(0.25, 0.25)
	var pt_out1 = coordThings.delta(1, 1);
	var pt_out2 = coordThings.delta(1, -1);
	var pt_just_in = coordThings.delta(0, 0);
	var pt_just_out = coordThings.delta(-1e-10, -1e-10);
	tests.assertEqual("In", coordThings.isPointInPoly(pt_in, vvvv), true)
	tests.assertEqual("Out 1", coordThings.isPointInPoly(pt_out1, vvvv), false)
	tests.assertEqual("Out 2", coordThings.isPointInPoly(pt_out2, vvvv), false)
	tests.assertEqual("Just In", coordThings.isPointInPoly(pt_just_in, vvvv), true)
	tests.assertEqual("Just Out", coordThings.isPointInPoly(pt_just_out, vvvv), false)
	tests.assertEqual("Small Square in Poly", coordThings.approxPolyMembership(vvvv, vvvv3), true)
	tests.assertEqual("Poly in Small Square", coordThings.approxPolyMembership(vvvv3, vvvv), false)
	tests.assertEqual("Poly Check", coordThings.approxPolyIntersection(vvvv, vvvv2), true)
}

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------

// Make Ship
var shipFactory = {}
shipFactory.numShips = 0
shipFactory.makeShipDims = function(length, breadth, fwd) {
	return {length: length, breadth: breadth, fwd: fwd}
}

shipFactory.makeShipVerts = function(dims) {
	return [
				{dx:dims.length/2.0 + dims.fwd, dy:0},
				{dx:dims.length/2.0, dy:dims.breadth/2.0},
				{dx:-dims.length/2.0, dy:dims.breadth/2.0},
				{dx:dims.fwd-dims.length/2.0, dy:0},
				{dx:-dims.length/2.0, dy:-dims.breadth/2.0},
				{dx:dims.length/2.0, dy:-dims.breadth/2.0},
				// Not Closed
				]
}

shipFactory.makeShipVertsStopped = function(dims) {
	return [
				{dx:dims.length/2.0 + dims.fwd, dy:0},
				{dx:dims.length/2.0, dy:dims.breadth/2.0},
				{dx:-dims.length/2.0, dy:dims.breadth/2.0},
				{dx:-dims.fwd-dims.length/2.0, dy:0},
				{dx:-dims.length/2.0, dy:-dims.breadth/2.0},
				{dx:dims.length/2.0, dy:-dims.breadth/2.0},
				// Not Closed
				]
}

shipFactory.makeShipDomainVerts = function(dims, _safety_radius, _fwd_distance, _fwd_angle, _bwd_distance, refinement_level) {

	safety_radius = _safety_radius ? _safety_radius : dims.length / 3.0
	fwd_distance = _fwd_distance ? _fwd_distance : 4 * dims.length / 3.0
	fwd_angle = _fwd_angle ? _fwd_angle : 5
	bwd_distance = _bwd_distance ? _bwd_distance : dims.length / 6.0

	var DEFAULT_RESOLUTION = 5
	var R = (refinement_level ? refinement_level : DEFAULT_RESOLUTION)

	var verts = []

	// Top Mid
	verts.push({dx: 0, dy: dims.breadth/2.0 + safety_radius})

	// Top Left Mid
	// R = 5
	for (var i = 1; i < R; i++) {
		verts.push({dx: i*(1.0/R) * -dims.length/2.0, dy: dims.breadth/2.0 + safety_radius})
	}

	// Top Back
	// R = 5
	for (var i = 0; i <= R; i++) {
		verts.push({dx: -dims.length/2.0 + (safety_radius+bwd_distance)*coordThings.cosDeg(90 + i*(90.0/R)), dy: dims.breadth/2.0 + safety_radius*coordThings.sinDeg(90 + i*(90.0/R))})
	}

	// Back
	// R = 5
	for (var i = 1; i < R; i++) {
		verts.push({dx: -dims.length/2.0 - (safety_radius+bwd_distance), dy: dims.breadth/2.0 - i*(1.0*dims.breadth/R)})
	}

	// Bottom Back
	// R = 5
	for (var i = 0; i <= R; i++) {
		verts.push({dx: -dims.length/2.0 + (safety_radius+bwd_distance)*coordThings.cosDeg(180 + i*(90.0/R)), dy: -dims.breadth/2.0 + safety_radius*coordThings.sinDeg(180 + i*(90.0/R))})
	}

	// Bottom Left Mid
	// R = 5
	for (var i = 1; i < R; i++) {
		verts.push({dx: (R-i)*(1.0/R) * -dims.length/2.0, dy: -dims.breadth/2.0 - safety_radius})
	}

	// Bottom Mid
	verts.push({dx: 0, dy: -dims.breadth/2.0 - safety_radius})


	// Bottom Mid to Lower Front Arc
	// R = 5
	for (var i = 1; i < R; i++) {
		verts.push({
					dx: i * ((dims.length/2+fwd_distance)*(coordThings.cosDeg(-fwd_angle)) + (-dims.breadth/2-safety_radius)*(-coordThings.sinDeg(-fwd_angle))) / R,
					dy: -dims.breadth/2.0 - safety_radius + 
						i * (1.0/R)*(((dims.length/2+fwd_distance)*(coordThings.sinDeg(-fwd_angle)) + (-dims.breadth/2-safety_radius)*(coordThings.cosDeg(-fwd_angle))) - (-dims.breadth/2.0 - safety_radius))
					})
	}


	// Lower Front Arc
	// R = 5
	var dtc = 90.0 / R
	var dto = 1.0 * fwd_angle / R
	for (var i = 0; i <= R; i++) {
		verts.push({	dx: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+i*dtc))*(coordThings.cosDeg(-fwd_angle+i*dto)) + (-dims.breadth/2+safety_radius*coordThings.sinDeg(-90+i*dtc))*(-coordThings.sinDeg(-fwd_angle+i*dto))
							,//+ fwd_distance * coordThings.sinDeg(i * (90.0 / R)) * coordThings.sinDeg(i * (90.0 / R)),
						dy: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+i*dtc))*(coordThings.sinDeg(-fwd_angle+i*dto)) + (-dims.breadth/2+safety_radius*coordThings.sinDeg(-90+i*dtc))*(coordThings.cosDeg(-fwd_angle+i*dto))
					})
	}

	// Front
	// R = 5
	for (var i = 1; i < R; i++) {
		verts.push({	dx: dims.length/2 + fwd_distance + safety_radius,
						dy: (-dims.breadth/2) + i * (1.0 * dims.breadth / R)
					})
	}

	// Top Front Arc
	// R = 5
	var dtc = 90.0 / R
	var dto = 1.0 * fwd_angle / R
	for (var i = R; i <= 2*R; i++) {
		verts.push({	dx: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+i*dtc))*(coordThings.cosDeg(-fwd_angle+i*dto)) + (dims.breadth/2+safety_radius*coordThings.sinDeg(-90+i*dtc))*(-coordThings.sinDeg(-fwd_angle+i*dto))
							,//+ fwd_distance * coordThings.sinDeg(i * (90.0 / R)) * coordThings.sinDeg(i * (90.0 / R)),
						dy: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+i*dtc))*(coordThings.sinDeg(-fwd_angle+i*dto)) + (dims.breadth/2+safety_radius*coordThings.sinDeg(-90+i*dtc))*(coordThings.cosDeg(-fwd_angle+i*dto))
					})
	}


	// Top Front Arc to Top Mid
	// R = 5
	for (var i = 1; i < R; i++) {
		verts.push({
					dx: (R-i) * ((dims.length/2+fwd_distance)*(coordThings.cosDeg(fwd_angle)) + (dims.breadth/2+safety_radius)*(-coordThings.sinDeg(fwd_angle))) / R,
					dy: (dims.length/2+fwd_distance)*(coordThings.sinDeg(fwd_angle)) + (dims.breadth/2+safety_radius)*(coordThings.cosDeg(fwd_angle)) +
						i * (1.0/R) * ((dims.breadth/2.0 + safety_radius) - ((dims.length/2+fwd_distance)*(coordThings.sinDeg(fwd_angle)) + (dims.breadth/2+safety_radius)*(coordThings.cosDeg(fwd_angle))))
					})
	}

	// Top Mid
	verts.push({dx: 0, dy: dims.breadth/2.0 + safety_radius})

	return verts
}

shipFactory.makeShipPath = function(dims, angle, basePosition, dv, isStopped) {
	var verts
	if(isStopped) {
		verts = shipFactory.makeShipVertsStopped(dims)
	}
	else {
		verts = shipFactory.makeShipVerts(dims)
	}
	var path = coordThings.pathFromMetricDeltas(basePosition, dv, verts, angle)
	return path
}

shipFactory.makeShip = function(dims, basePosition, v, theta) {
	var ship = {}

	ship._shipId = shipFactory.numShips
	shipFactory.numShips += 1

	ship._dims = dims
	ship.basePosition = basePosition
	ship.v = v
	ship.theta = theta
	ship.shipVerts = shipFactory.makeShipVerts(dims)

	ship.safetyRadius = 0
	ship.fwdDistance = 0
	ship.fwdAngle = 0
	ship.bwdDistance = 0
	ship.domainVerts = null

	ship._shipPoly = null
	ship._shipDomainPoly = null
	ship._map = null

	ship._mouseoverListener = null

	ship.getDims = function() {
		return shipFactory.makeShipDims(ship._dims.length, ship._dims.breadth, ship._dims.fwd)
	}
	ship.updatePosition = function(_v, _theta, _basePosition, _isStopped) {
		if (_isStopped) {
			ship.shipVerts = shipFactory.makeShipVertsStopped(dims)
		} else {
			ship.shipVerts = shipFactory.makeShipVerts(dims)
		}

		ship.v = _v ? _v : ship.v
		ship.theta = _theta ? _theta : ship.theta
		ship.basePosition = _basePosition ? _basePosition : ship.basePosition
		ship.updateShipPoly()
		ship.updateDomainPoly()
	}
	ship.updateDomainParams = function(_safety_radius, _fwd_distance, _fwd_angle, _bwd_distance) {
		ship.safetyRadius = _safety_radius ? _safety_radius : ship.safetyRadius
		ship.fwdDistance = _fwd_distance ? _fwd_distance : ship.fwdDistance
		ship.fwdAngle = _fwd_angle ? _fwd_angle : ship.fwdAngle
		ship.bwdDistance = _bwd_distance ? _bwd_distance : ship.bwdDistance
		ship.updateDomainPoly()
	}
	ship.makeShipPath = function() {
		var path = coordThings.pathFromMetricDeltasGoogle(ship.basePosition, ship.v, ship.shipVerts, ship.theta)
		return path
	}
	ship.updateDomainVerts = function() {
		ship.domainVerts = shipFactory.makeShipDomainVerts(dims, ship.safetyRadius, ship.fwdDistance, ship.fwdAngle, ship.bwdDistance)
	}
	ship.updateDomainVerts()	

	ship.makeDomainPath = function() {
		ship.updateDomainVerts()
		var path = coordThings.pathFromMetricDeltasGoogle(ship.basePosition, ship.v, ship.domainVerts, ship.theta)
		return path
	}

	ship.clearMouseOverListener = function() {
		if (ship._mouseoverListener) {
			google.maps.event.removeListener(ship._mouseoverListener)
			ship._mouseoverListener = null
		}
	}
	ship.setMouseOverListener = function(cbFunction) {
		ship.clearMouseOverListener()
		if (ship._shipPoly) {
			if (cbFunction) {
				ship._mouseoverListenerCallback = cbFunction
				ship._mouseoverListener = google.maps.event.addListener(ship._shipPoly, 'mouseover', ship._mouseoverListenerCallback)
			}
		}
	}

	ship.centre = function() {
		return coordThings.shiftLatLngMetricGoogle(ship.basePosition, ship.v)
	}

	ship.makeShipPoly = function() {
		var path = ship.makeShipPath()
		poly = new google.maps.Polygon({
			path: path,
			strokeColor: '#00ff00',
			strokeOpacity: 0.8,
			fillColor: '#00ff00',
			fillOpacity: 0.4,
			strokeWeight: 2
		})
		ship._shipPoly = poly

		ship.clearMouseOverListener()
		if (ship._mouseoverListenerCallback) {
			ship._mouseoverListener = google.maps.event.addListener(poly, 'mouseover', ship._mouseoverListenerCallback)
		}

		return poly
	}

	ship.setShipPolyOptions = function(strokeColor, fillColor, strokeOpacity, fillOpacity) {
		if (ship._shipPoly) {
			ship._shipPoly.setOptions({
				strokeColor: strokeColor, 
				fillColor: fillColor, 
				strokeOpacity: strokeOpacity, 
				fillOpacity: fillOpacity
			});
		}
	}
	ship.setShipDomainPolyOptions = function(strokeColor, fillColor, strokeOpacity, fillOpacity) {
		if (ship._shipDomainPoly) {
			ship._shipDomainPoly.setOptions({
				strokeColor: strokeColor, 
				fillColor: fillColor, 
				strokeOpacity: strokeOpacity, 
				fillOpacity: fillOpacity
			});
		}
	}
	ship.updateShipPoly = function() {
		if (ship._shipPoly) {
			var path = ship.makeShipPath()
			vertices = ship._shipPoly.getPath()
			for (var i = 0; i < vertices.getLength(); i++) {
		    	vertices.setAt(i, path[i])
			}
		}
	}
	ship.makeDomainPoly = function() {
		var path = ship.makeDomainPath()
		poly = new google.maps.Polygon({
			path: path,
			strokeColor: '#ff0000',
			strokeOpacity: 0.1,
			fillColor: '#ff0000',
			fillOpacity: 0.1,
			strokeWeight: 2
		})
		ship._shipDomainPoly = poly
		return poly
	}
	ship.updateDomainPoly = function() {
		if (ship._shipDomainPoly) {
			var path = ship.makeDomainPath()
			vertices = ship._shipDomainPoly.getPath()
			for (var i = 0; i < vertices.getLength(); i++) {
			    vertices.setAt(i, path[i])
			}
		}
	}
	ship.placeOnMap = function(map) {
		if (!ship._map) {
			ship._shipPoly.setMap(map)
			ship._shipDomainPoly.setMap(map)

			ship._map = map
		}
	}
	ship.removeFromMap = function(map) {
		if (ship._map) {
			ship._shipDomainPoly.setMap(null);
			ship._shipPoly.setMap(null);

			ship._map = null
		}
	}
	_shipDomainPoly = ship.makeDomainPoly()
	_shipPoly = ship.makeShipPoly()

	ship.latLonOfDomainVerticesAndBoundingBox = function() {
		ret = {}
		ret.verts = ship.domainVerts.map(function(vv){
						return coordThings.flatEarthConversionLLtoMetric(
							coordThings.shiftLatLngMetric(
								ship.basePosition, coordThings.shiftMetric(vv, ship.v))
							)
						})
		ret.flatEarthBB = coordThings.boundingBox(ret.verts)

		return ret
	}

	ship.checkForDomainIntersection = function(otherShip) {
		ship1Stuff = ship.latLonOfDomainVerticesAndBoundingBox()
		ship2Stuff = otherShip.latLonOfDomainVerticesAndBoundingBox()

		if (ship1Stuff.flatEarthBB.x_min > ship2Stuff.flatEarthBB.x_max) {
			return false
		}
		if (ship2Stuff.flatEarthBB.x_min > ship1Stuff.flatEarthBB.x_max) {
			return false
		}
		if (ship1Stuff.flatEarthBB.y_min > ship2Stuff.flatEarthBB.y_max) {
			return false
		}
		if (ship2Stuff.flatEarthBB.y_min > ship1Stuff.flatEarthBB.y_max) {
			return false
		}

		return coordThings.approxPolyIntersection(ship1Stuff.verts, ship2Stuff.verts)
	}

	return ship
}

shipFactory.makeEZShip = function(dims, basePosition) {
	return shipFactory.makeShip(dims, basePosition, coordThings.delta(0,0), 0) 
}

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------

// Space
var domainViolationService = {}

domainViolationService.check = function(allShips) {
	var violatingPairs = []
	for (var i = 0; i < allShips.length; i++) {
		if (allShips[i]._map != null) {
			for (var j = i+1; j < allShips.length; j++) {
				if (allShips[j]._map != null) {
					if (allShips[i].checkForDomainIntersection(allShips[j])) {
						violatingPairs.push([allShips[i], allShips[j]])
					}
				}
			}
		}
	}
	return violatingPairs
}
//*/