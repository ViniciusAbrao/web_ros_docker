# ROS - WEB - Docker
My Final Project of Specialization Course at PUC Minas - Software Engineering

<img src="media/diagram.jpg" width="700" height="400" />

Image - https://www.theconstructsim.com/

In this project I implement a web page to move and monitor the turtlebot (running in the Gazebo Simulation), by publishing and subscribing ROS topics.

The deployment is done by docker containers.

rosbridge_server is used to provide the websocket interface to the JavaScript.

web_video_server is used to provide the interface to the camera images.

The main program can be built and ran by doing the following from the project top directory:

## Steps



$ cd docker_ros 
$ docker build -t ros_nginx:v0 .

$ cd web_vue
$ docker build -t my_nginx:v0 . 

$ cd ..
$ ./my_compose.sh

Open in browser:
http://0.0.0.0:9000/

ROSBridge address: 
ws://0.0.0.0:9090

To close (ctrl+c):
docker-compose down 

Stop containers:
docker kill $(docker ps -aq); 

Clear containers:
docker container prune -f 

Delete Images:
docker rmi --force 'image_id'
