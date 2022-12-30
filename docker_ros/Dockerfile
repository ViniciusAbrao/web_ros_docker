FROM nvidia/cudagl:11.1.1-base-ubuntu20.04
# Minimal setup
RUN apt-get update \
&& apt-get install -y locales lsb-release
ARG DEBIAN_FRONTEND=noninteractive
RUN dpkg-reconfigure locales
# Install ROS Noetic
RUN sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
RUN apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
RUN apt-get update \
&& apt-get install -y --no-install-recommends ros-noetic-desktop-full
RUN apt-get install -y --no-install-recommends python3-rosdep
RUN rosdep init \
&& rosdep fix-permissions \
&& rosdep update

# Install Git
RUN apt-get install -y git && apt-get install -y build-essential
# Install Servers
RUN apt-get install -y ros-noetic-rosbridge-server
RUN apt-get install -y ros-noetic-web-video-server

# Create a Catkin workspace and clone TurtleBot3 repos

RUN mkdir -p /turtlebot3_ws/src \
&& cd /turtlebot3_ws/src \
&& git clone -b noetic-devel https://github.com/ROBOTIS-GIT/turtlebot3.git \
&& git clone -b noetic-devel https://github.com/ROBOTIS-GIT/turtlebot3_msgs.git \
&& git clone -b noetic-devel https://github.com/ROBOTIS-GIT/turtlebot3_simulations.git

# Copying the local my_package to turtlebot3_ws in the docker image
COPY ./my_backend/catkin_ws/src/my_package /turtlebot3_ws/src

# /bin/bash is the command we want to execute when running a docker container
#ENTRYPOINT ["/bin/bash"]
SHELL ["/bin/bash", "-c"] 
RUN echo "source /opt/ros/noetic/setup.bash" >> ~/.bashrc
RUN echo "export TURTLEBOT3_MODEL=waffle_pi" >> ~/.bashrc
RUN echo "source /turtlebot3_ws/devel/setup.bash" >> ~/.bashrc

# Build the Catkin workspace and ensure it's sourced
RUN source /opt/ros/noetic/setup.bash \
&& cd turtlebot3_ws \
&& catkin_make

WORKDIR /turtlebot3_ws
