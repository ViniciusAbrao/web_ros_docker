#! /usr/bin/env python3
import os
import rosbag
from std_msgs.msg import Int32, String
import rospy
from nav_msgs.msg import Odometry
from geometry_msgs.msg import Twist

class store:

    def __init__(self):
        self.bag= rosbag.Bag('test.bag', 'w')
        self.msg_odom=Odometry()
        self.msg_vel=Twist()  
        self.pub_status = rospy.Publisher('/parameter_status', Int32, queue_size=1)
        self.ros_status = Int32()
        self.db_status_publisher = rospy.Publisher('/db_communication', Int32, queue_size=1)
        self.db_status = Int32()

    def callback_odom(self, msg): 
       self.msg_odom=msg

    def callback_cmd_vel(self, msg): 
       self.msg_vel=msg

    def end_connection(self):
        print("my_node closed")
        self.ros_status.data = 99
        self.pub_status.publish(self.ros_status)

    def bag_open(self):
        self.bag_close()
        if os.path.exists("/home/abrao/.ros/test.bag"):
            print("file deleted")
            os.remove("test.bag")
        self.bag= rosbag.Bag('test.bag', 'w')

    def bag_close(self):
        self.bag.close()

    def close_node(self):
        self.end_connection()
        self.bag.close()

    def pub_db_status(self, value):
        for i in range(5): 
            self.db_status.data = value
            self.db_status_publisher.publish(self.db_status)

    def callback_db_status(self, msg): 
       self.db_status=msg


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
        
        self.cont = 0
        self.length = 0
        
    def read_db(self):
        
        self.linear_x = [] 
        self.angular_z = []
        self.bag = rosbag.Bag('test.bag')
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
    sub_db_status = rospy.Subscriber('/db_connection', Int32, callback = rest.callback_db_status)

    #General initialization
    rate = rospy.Rate(2)
    rospy.on_shutdown(rest.close_node)

    #Replay initialization
    rep = replay()
    sub_ros_status = rospy.Subscriber('/parameter_status', Int32, callback = rep.callback_ros_status)
    while rep.ros_status.data != 4: #and rep.ros_status.data != 0:
        print("Waiting to connect")
        #print(rep.ros_status)
        rep.pub_status_value(4)
        rate.sleep() 
    rep.pub_status_value(4)

    #Store data based on local simulation
    #sim = simulate()
    #rest.bag_open()
    #for i in range(10):   
    #    if(rospy.is_shutdown()):
    #        break
    #    sim.pub(0.2,0.5)
    #    rest.bag.write('/odom', rest.msg_odom)
    #    rest.bag.write('/cmd_vel', rest.msg_vel)
    #    rate.sleep() 
    #for i in range(5):   
    #    if(rospy.is_shutdown()):
    #        break
    #    sim.pub(0.0,0.0)
    #    rest.bag.write('/odom', rest.msg_odom)
    #    rest.bag.write('/cmd_vel', rest.msg_vel)
    #    rate.sleep()      
    #rest.bag_close()
       
    #Start node
    print("Start node")
    while not rospy.is_shutdown():

        #Store data based on web simulation
        #print('restore_status:',rest.db_status)
        if(rest.db_status.data==1):
            rest.bag_open()
            print("Start Record")
            while(rest.db_status.data==1):
                rest.bag.write('/odom', rest.msg_odom)
                rest.bag.write('/cmd_vel', rest.msg_vel)
                rate.sleep()
            rest.bag_close()
            #rest.pub_db_status(0)
            print("Stop Record")
                     
        #Replay data loaded from DB
        #print('replay_status:',rep.ros_status)
        if(rep.ros_status.data==1):
            print("Start Move")
            rep.read_db()
            rep.cont = 0
            for i in range(rep.length):   
                if(rospy.is_shutdown() or rep.ros_status.data==2):
                    break
                rep.pub_vel()
                rate.sleep()
            rep.pub_status_value(2)
            print("Stop Move")

        rate.sleep()


    





    

