// Misc Things
var misc = {}
misc.componentToHex = function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
misc.rgbToHex = function(r, g, b) {
    return "#" + misc.componentToHex(r) + misc.componentToHex(g) + misc.componentToHex(b);
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

}
coordThings.shiftLatLngMetric = function(ll, dv) {
	dll = coordThings.metresToDeg(dv)
	return new google.maps.LatLng(ll.lat() + dll.dlat, ll.lng() + dll.dlng)
}
coordThings.pathFromMetricDeltas = function(refLL, dv, verts, angle) {
	return verts.map(function(v) {
		var shift = coordThings.shiftMetric(coordThings.rotate(v, angle), dv)
		return coordThings.shiftLatLngMetric(refLL, shift)
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

{
	var vvvv = [coordThings.delta(0,0), coordThings.delta(2,0), coordThings.delta(0.5,0.5), coordThings.delta(0,2)]
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
}

// Make Ship
var shipFactory = {}
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

shipFactory.makeShipDomainVerts = function(dims, safety_radius, fwd_distance, fwd_angle) {
	dtc = 90.0 / 4.0
	dto = fwd_angle / 4.0

	return [	
				{dx: 0, dy: dims.breadth/2.0 + safety_radius},

				{dx: -dims.length/2.0 + safety_radius*coordThings.cosDeg(90), dy: dims.breadth/2.0 + safety_radius*coordThings.sinDeg(90)},
				{dx: -dims.length/2.0 + safety_radius*coordThings.cosDeg(112.5), dy: dims.breadth/2.0 + safety_radius*coordThings.sinDeg(112.5)},
				{dx: -dims.length/2.0 + safety_radius*coordThings.cosDeg(135), dy: dims.breadth/2.0 + safety_radius*coordThings.sinDeg(135)},
				{dx: -dims.length/2.0 + safety_radius*coordThings.cosDeg(157.5), dy: dims.breadth/2.0 + safety_radius*coordThings.sinDeg(157.5)},
				{dx: -dims.length/2.0 + safety_radius*coordThings.cosDeg(180), dy: dims.breadth/2.0 + safety_radius*coordThings.sinDeg(180)},

				{dx: -dims.length/2.0 + safety_radius*coordThings.cosDeg(180), dy: -dims.breadth/2.0 + safety_radius*coordThings.sinDeg(180)},
				{dx: -dims.length/2.0 + safety_radius*coordThings.cosDeg(202.5), dy: -dims.breadth/2.0 + safety_radius*coordThings.sinDeg(202.5)},
				{dx: -dims.length/2.0 + safety_radius*coordThings.cosDeg(225), dy: -dims.breadth/2.0 + safety_radius*coordThings.sinDeg(225)},
				{dx: -dims.length/2.0 + safety_radius*coordThings.cosDeg(247.5), dy: -dims.breadth/2.0 + safety_radius*coordThings.sinDeg(247.5)},
				{dx: -dims.length/2.0 + safety_radius*coordThings.cosDeg(270), dy: -dims.breadth/2.0 + safety_radius*coordThings.sinDeg(270)},

				{dx: 0, dy: -dims.breadth/2.0 - safety_radius},

				{	dx: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+0*dtc))*(coordThings.cosDeg(-fwd_angle+0*dto)) + (-dims.breadth/2+safety_radius*coordThings.sinDeg(-90+0*dtc))*(-coordThings.sinDeg(-fwd_angle+0*dto)),
					dy: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+0*dtc))*(coordThings.sinDeg(-fwd_angle+0*dto)) + (-dims.breadth/2+safety_radius*coordThings.sinDeg(-90+0*dtc))*(coordThings.cosDeg(-fwd_angle+0*dto))
				},
				{	dx: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+1*dtc))*(coordThings.cosDeg(-fwd_angle+1*dto)) + (-dims.breadth/2+safety_radius*coordThings.sinDeg(-90+1*dtc))*(-coordThings.sinDeg(-fwd_angle+1*dto)),
					dy: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+1*dtc))*(coordThings.sinDeg(-fwd_angle+1*dto)) + (-dims.breadth/2+safety_radius*coordThings.sinDeg(-90+1*dtc))*(coordThings.cosDeg(-fwd_angle+1*dto))
				},
				{	dx: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+2*dtc))*(coordThings.cosDeg(-fwd_angle+2*dto)) + (-dims.breadth/2+safety_radius*coordThings.sinDeg(-90+2*dtc))*(-coordThings.sinDeg(-fwd_angle+2*dto)),
					dy: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+2*dtc))*(coordThings.sinDeg(-fwd_angle+2*dto)) + (-dims.breadth/2+safety_radius*coordThings.sinDeg(-90+2*dtc))*(coordThings.cosDeg(-fwd_angle+2*dto))
				},
				{	dx: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+3*dtc))*(coordThings.cosDeg(-fwd_angle+3*dto)) + (-dims.breadth/2+safety_radius*coordThings.sinDeg(-90+3*dtc))*(-coordThings.sinDeg(-fwd_angle+3*dto)),
					dy: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+3*dtc))*(coordThings.sinDeg(-fwd_angle+3*dto)) + (-dims.breadth/2+safety_radius*coordThings.sinDeg(-90+3*dtc))*(coordThings.cosDeg(-fwd_angle+3*dto))
				},
				{	dx: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+4*dtc))*(coordThings.cosDeg(-fwd_angle+4*dto)) + (-dims.breadth/2+safety_radius*coordThings.sinDeg(-90+4*dtc))*(-coordThings.sinDeg(-fwd_angle+4*dto)),
					dy: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+4*dtc))*(coordThings.sinDeg(-fwd_angle+4*dto)) + (-dims.breadth/2+safety_radius*coordThings.sinDeg(-90+4*dtc))*(coordThings.cosDeg(-fwd_angle+4*dto))
				},

				{	dx: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+4*dtc))*(coordThings.cosDeg(-fwd_angle+4*dto)) + (dims.breadth/2+safety_radius*coordThings.sinDeg(-90+4*dtc))*(-coordThings.sinDeg(-fwd_angle+4*dto)),
					dy: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+4*dtc))*(coordThings.sinDeg(-fwd_angle+4*dto)) + (dims.breadth/2+safety_radius*coordThings.sinDeg(-90+4*dtc))*(coordThings.cosDeg(-fwd_angle+4*dto))
				},
				{	dx: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+5*dtc))*(coordThings.cosDeg(-fwd_angle+5*dto)) + (dims.breadth/2+safety_radius*coordThings.sinDeg(-90+5*dtc))*(-coordThings.sinDeg(-fwd_angle+5*dto)),
					dy: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+5*dtc))*(coordThings.sinDeg(-fwd_angle+5*dto)) + (dims.breadth/2+safety_radius*coordThings.sinDeg(-90+5*dtc))*(coordThings.cosDeg(-fwd_angle+5*dto))
				},
				{	dx: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+6*dtc))*(coordThings.cosDeg(-fwd_angle+6*dto)) + (dims.breadth/2+safety_radius*coordThings.sinDeg(-90+6*dtc))*(-coordThings.sinDeg(-fwd_angle+6*dto)),
					dy: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+6*dtc))*(coordThings.sinDeg(-fwd_angle+6*dto)) + (dims.breadth/2+safety_radius*coordThings.sinDeg(-90+6*dtc))*(coordThings.cosDeg(-fwd_angle+6*dto))
				},
				{	dx: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+7*dtc))*(coordThings.cosDeg(-fwd_angle+7*dto)) + (dims.breadth/2+safety_radius*coordThings.sinDeg(-90+7*dtc))*(-coordThings.sinDeg(-fwd_angle+7*dto)),
					dy: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+7*dtc))*(coordThings.sinDeg(-fwd_angle+7*dto)) + (dims.breadth/2+safety_radius*coordThings.sinDeg(-90+7*dtc))*(coordThings.cosDeg(-fwd_angle+7*dto))
				},
				{	dx: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+8*dtc))*(coordThings.cosDeg(-fwd_angle+8*dto)) + (dims.breadth/2+safety_radius*coordThings.sinDeg(-90+8*dtc))*(-coordThings.sinDeg(-fwd_angle+8*dto)),
					dy: (dims.length/2+fwd_distance+safety_radius*coordThings.cosDeg(-90+8*dtc))*(coordThings.sinDeg(-fwd_angle+8*dto)) + (dims.breadth/2+safety_radius*coordThings.sinDeg(-90+8*dtc))*(coordThings.cosDeg(-fwd_angle+8*dto))
				},
				// Not closed
				]
}

shipFactory.makeShipPath = function(dims, angle, basePosition, dv) {
	var verts = shipFactory.makeShipVerts(dims)
	var path = coordThings.pathFromMetricDeltas(basePosition, dv, verts, angle)
	return path
}
	
shipFactory.makeShip = function(dims, basePosition, v, theta) {
	var ship = {}

	ship._dims = dims
	ship.basePosition = basePosition
	ship.v = v
	ship.theta = theta
	ship.shipVerts = shipFactory.makeShipVerts(dims)

	ship.safetyRadius = 0
	ship.fwdDistance = 0
	ship.fwdAngle = 0
	ship.domainVerts = null

	ship._shipPoly = null
	ship._shipDomainPoly = null
	ship._map = null

	ship.getDims = function() {
		return shipFactory.makeShipDims(ship._dims.length, ship._dims.breadth, ship._dims.fwd)
	}
	ship.updatePosition = function(_v, _theta) {
		ship.v = _v
		ship.theta = _theta
		ship.updateShipPoly()
	}
	ship.updateDomainParams = function(_safety_radius, _fwd_distance, _fwd_angle) {
		ship.safetyRadius = _safety_radius
		ship.fwdDistance = _fwd_distance
		ship.fwdAngle = _fwd_angle
		ship.updateDomainPoly()
	}
	ship.makeShipPath = function() {
		var path = coordThings.pathFromMetricDeltas(ship.basePosition, ship.v, ship.shipVerts, ship.theta)
		return path
	}
	ship.updateDomainVerts = function() {
		ship.domainVerts = shipFactory.makeShipDomainVerts(dims, ship.safetyRadius, ship.fwdDistance, ship.fwdAngle)
	}
	ship.updateDomainVerts()	
	ship.makeDomainPath = function() {
		ship.updateDomainVerts()
		var path = coordThings.pathFromMetricDeltas(ship.basePosition, ship.v, ship.domainVerts, ship.theta)
		return path
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
			ship._shipDomainPoly.setMap(map);
			ship._shipPoly.setMap(map);

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
	_shipPoly = ship.makeShipPoly()
	_shipDomainPoly = ship.makeDomainPoly()

	ship.getDomainBoundingBox = function() {
		return coordThings.boundingBox(
			ship.shipVerts.map(function(vv){return coordThings.shiftMetric(vv, ship.v)})
			)
	}

	return ship
}

shipFactory.makeEZShip = function(dims, basePosition) {
	return shipFactory.makeShip(dims, basePosition, coordThings.delta(0,0), 0) 
}
