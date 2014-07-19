# -*- coding: utf-8 -*-
"""
Created on Fri Jul 18 15:13:18 2014

@author: Bodhisatta Barman Roy <bodhi@comp.nus.edu.sg>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
"""
from math import radians, cos, sin, asin, sqrt

def haversine(p1,p2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    lon1=p1[1]
    lat1=p1[0]
    lon2=p2[1]
    lat2=p2[0]
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    m = 6367 *1000 * c
    return m

def generateWayPoints(route):
    """
    Generates a bunch of waypoints, 
    given a particular set of startPoint and endPoint
    """
    startPoint=route[0]
    endPoint=route[1]
    wayPoints={}
    wayPoints[0]=startPoint
    steps=int(round(haversine(startPoint,endPoint)))+1
    wayPoints[steps]=endPoint
    diffLongSteps=(endPoint[1]-startPoint[1])/(steps)
    diffLatSteps=(endPoint[0]-startPoint[0])/(steps)
    
    for i in range(1,steps):
        temp=[0.0,0.0]
        temp[0]=startPoint[0]+(i*diffLatSteps)
        temp[1]=startPoint[1]+(i*diffLongSteps)
        wayPoints[i]=temp
        
    return wayPoints

if __name__ == "__main__":
    startPoint=[1.220290, 103.782423]
    endPoint=[1.268987, 103.795062]
    route=[startPoint,endPoint]
    print generateWayPoints(route)

