# upload the gateway app
GWAPP_FOLDER="gwapp"

if [ ! -d $GWAPP_FOLDER ] ; then
    echo 'GWAPP: Folder not found. Running deploy.sh'
    bash deploy.sh
else
    echo 'GWAPP: Folder has been found. Pulling from the repo and restarting the gatewayapp'
    pm2 stop gatewayapp
    cd ~/$GWAPP_FOLDER/backend
    git pull && npm install && npm run be:build
    NODE_ENV=staging pm2 start dist/main.js --name "gatewayapp" && cd ~/ && pm2 startup > pm2_startup_output;
    tail -n 1 pm2_startup_output > pm2_startup.sh && chmod u+rwx pm2_startup.sh && ./pm2_startup.sh && pm2 save
    cd ~
fi

cp ~/$GWAPP_FOLDER/scripts/*.sh .
chmod 755 /home/pi/reboot.sh

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