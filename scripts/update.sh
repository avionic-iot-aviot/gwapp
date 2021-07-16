# upload the gateway app
bash deploy.sh

if grep "PYTHONPATH" /etc/environment
then 
   echo "Environment already set.";
else
   echo "I'm setting the environment.";
   sudo chmod 666 /etc/environment
   env >> /etc/environment
   sudo chmod 644 /etc/environment
fi

# upload the ros_device_streamer
ROS_DEVICE_STREAMER_FOLDER="ros_catkin_ws/src/ros-device-streamer"

if [ ! -d ~/$ROS_DEVICE_STREAMER_FOLDER ] ; then
    echo 'ROS_DEVICE_STREAMER_FOLDER: Cloning the repo'
    git clone https://github.com/avionic-iot-aviot/ros-device-streamer.git ~/$ROS_DEVICE_STREAMER_FOLDER
else
    echo 'ROS_DEVICE_STREAMER_FOLDER: Pulling from the repo'
    cd ~/$ROS_DEVICE_STREAMER_FOLDER
    git pull
    cd ~
fi

echo "Update completed!"