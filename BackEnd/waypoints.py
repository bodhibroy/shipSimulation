# -*- coding: utf-8 -*-
"""
Created on Fri Jul 18 15:13:18 2014

@author: combbr
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

def generateWayPoints(startPoint, endPoint):
    """
    Generates a bunch of waypoints, given a particular set of startPoint and endPoint
    """
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
    print generateWayPoints(startPoint,endPoint)

