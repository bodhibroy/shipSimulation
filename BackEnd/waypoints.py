# -*- coding: utf-8 -*-
"""
Created on Fri Jul 18 15:13:18 2014

@author: combbr
"""

startPoint=[1.220290, 103.782423]
endPoint=[1.268987, 103.795062]

wayPointfreq=2 # no. of points to be generated between startPoint and endPoint
wayPoints={}
wayPoints[0]=startPoint
wayPoints[wayPointfreq+1]=endPoint

diffLatSteps=(endPoint[0]-startPoint[0])/(wayPointfreq+1)
diffLongSteps=(endPoint[1]-startPoint[1])/(wayPointfreq+1)

print diffLatSteps,diffLongSteps

for i in range(1,wayPointfreq+1):
    temp=[0.0,0.0]
    temp[0]=startPoint[0]+(i*diffLatSteps)
    temp[1]=startPoint[1]+(i*diffLongSteps)
    wayPoints[i]=temp
    print wayPoints[i]   

print wayPoints
