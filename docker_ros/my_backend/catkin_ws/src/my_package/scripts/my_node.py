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
        self.pub_status = rospy.Publisher('/parameter_status', Int32, queue_size=1)
        self.ros_status = Int32()
        
    def callback_odom(self, msg): 
       self.msg_odom=msg

    def callback_cmd_vel(self, msg): 
       self.msg_vel=msg

    def end_connection(self):
        print("my_node closed")
        self.ros_status.data = 100
        self.pub_status.publish(self.ros_status)

    def bag_close(self):
        self.bag.close()

    def close_node(self):
        self.end_connection()
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
        self.pub_status = rospy.Publisher('/parameter_status', Int32, queue_size=1)
        self.move = Twist()
        self.ros_status = Int32()
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
        
    def pub_vel(self):
        self.move.linear.x = self.linear_x[self.cont] #Move the robot with a linear velocity in the x axis
        self.move.angular.z = self.angular_z[self.cont] #Move the with an angular velocity in the z axis
        self.publisher.publish(self.move)

        self.cont=self.cont+1
    
    def pub_status_value(self, value):
        for i in range(5): 
            self.ros_status.data = value
            self.pub_status.publish(self.ros_status)
    
    def callback_ros_status(self, msg): 
       self.ros_status=msg


if __name__ == "__main__":

    rospy.init_node('backend_node')

    #Store data initialization
    rest = store()
    rest.end_connection() #force the web interface reconnect case is already connected
    print("my_node opened")
    sub_odom = rospy.Subscriber('/odom', Odometry, callback = rest.callback_odom)
    sub_cmd_vel = rospy.Subscriber('/cmd_vel', Twist, callback = rest.callback_cmd_vel)

    #General initialization
    rate = rospy.Rate(2)
    rospy.on_shutdown(rest.close_node)

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
    
    #Replay initialization
    rep = replay()
    sub_ros_status = rospy.Subscriber('/parameter_status', Int32, callback = rep.callback_ros_status)

    #Start replay
    print(rep.ros_status)
    while not rospy.is_shutdown():
        print(rep.ros_status)
        if(rep.ros_status.data==1):
            print("Mandou entrar")
            rep.cont = 0
            for i in range(rep.length):   
                if(rospy.is_shutdown() or rep.ros_status.data==0):
                    break
                rep.pub_vel()
                rate.sleep()
            rep.pub_status_value(2)
            print("Mandou zero")
        rate.sleep() 
    





    

