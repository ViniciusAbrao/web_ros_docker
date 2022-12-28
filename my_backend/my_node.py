#! /usr/bin/env python3

import rosbag
from std_msgs.msg import Int32, String
import rospy
from nav_msgs.msg import Odometry
from geometry_msgs.msg import Twist

class store:

    def __init__(self):
        self.msg_odom=Odometry()
        self.msg_vel=Twist()  
        self.bag= rosbag.Bag('test.bag', 'w')
        
    def callback_odom(self, msg): 
       self.msg_odom=msg

    def callback_cmd_vel(self, msg): 
       self.msg_vel=msg

    def bag_close(self):
        self.bag.close()

class simulate:

    def __init__(self):
        self.publisher = rospy.Publisher('/cmd_vel', Twist, queue_size=1)
        self.move = Twist()
        
    def pub(self,xx,yy):
        self.move.linear.x = xx #Move the robot with a linear velocity in the x axis
        self.move.angular.z = yy #Move the with an angular velocity in the z axis
        self.publisher.publish(self.move)

class replay:

    def __init__(self):
        self.publisher = rospy.Publisher('/cmd_vel', Twist, queue_size=1)
        self.move = Twist()
        # Create a list with n placeholder elements
        self.linear_x = [] 
        self.angular_z = []
        self.bag = rosbag.Bag('test.bag')
        self.cont = 0
        self.length = 0
        self.read_db()
        
    def read_db(self):
        
        for topic, msg, t in self.bag.read_messages(topics=['/cmd_vel']):
           self.linear_x.append(msg.linear.x)
           self.angular_z.append(msg.angular.z)
        self.bag.close()
        self.length = len(self.linear_x)     
        #print(self.linear_x)
        #print(self.angular_z)
        
    def pub(self):
        self.move.linear.x = self.linear_x[self.cont] #Move the robot with a linear velocity in the x axis
        self.move.angular.z = self.angular_z[self.cont] #Move the with an angular velocity in the z axis
        self.publisher.publish(self.move)
        self.cont=self.cont+1


if __name__ == "__main__":

    rospy.init_node('backend_node')

    #Store data initialization
    rest = store()
    sub_odom = rospy.Subscriber('/odom', Odometry, callback = rest.callback_odom)
    sub_cmd_vel = rospy.Subscriber('/cmd_vel', Twist, callback = rest.callback_cmd_vel)
    rate = rospy.Rate(2)
    rospy.on_shutdown(rest.bag_close)
  
    #Store data based on local simulation
    sim = simulate()
    for i in range(10):   
        if(rospy.is_shutdown()):
            break
        sim.pub(0.2,0.5)
        rest.bag.write('/odom', rest.msg_odom)
        rest.bag.write('/cmd_vel', rest.msg_vel)
        rate.sleep() 
    for i in range(5):   
        if(rospy.is_shutdown()):
            break
        sim.pub(0.0,0.0)
        rest.bag.write('/odom', rest.msg_odom)
        rest.bag.write('/cmd_vel', rest.msg_vel)
        rate.sleep()      

    #Store data based on web simulation
    '''while not rospy.is_shutdown(): 
        rest.bag.write('/odom', rest.msg_odom)
        rest.bag.write('/cmd_vel', rest.msg_vel)
        rate.sleep()''' 
    
    #End of data storage    
    rest.bag_close()
    
    #Start replay
    rep = replay()
    print(rep.length)
    for i in range(rep.length):   
        if(rospy.is_shutdown()):
            break
        rep.pub()
        rate.sleep() 
    





    

