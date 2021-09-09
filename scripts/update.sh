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

# upload the audio-receiver
AUDIO_RECEIVER_FOLDER="audio-receiver"

if [ ! -d ~/$AUDIO_RECEIVER_FOLDER ] ; then
    echo 'AUDIO_RECEIVER_FOLDER: Cloning the repo'
    git clone https://github.com/avionic-iot-aviot/audio-receiver.git ~/$AUDIO_RECEIVER_FOLDER
else
    echo 'AUDIO_RECEIVER_FOLDER: Pulling from the repo'
    cd ~/$AUDIO_RECEIVER_FOLDER
    git pull
    cd ~
fi

# upload the mlvpn smart bond
SMART_BONDING_FOLDER="smart-bonding"

if [ ! -d ~/$SMART_BONDING_FOLDER ] ; then
    echo 'SMART_BONDING_FOLDER: Cloning the repo'
    git clone https://github.com/avionic-iot-aviot/audio-receiver.git ~/$SMART_BONDING_FOLDER
else
    echo 'SMART_BONDING_FOLDER: Pulling from the repo'
    cd ~/$SMART_BONDING_FOLDER
    git pull
    cd ~
fi

# update crontab jobs
bash ~/add_crontab_jobs.sh

echo "Update completed!"