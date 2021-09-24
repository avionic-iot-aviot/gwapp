#!/bin/bash
source ~/drone.cfg

#script_on_startup.
sudo /etc/init.d/dhcpcd stop
sudo brctl addbr dhcpbr

if [ ! -s ~/mac_edge0 ] 
then
	echo "Creating file mac_edge0"
	touch ~/mac_edge0
fi

file_content=$(cat ~/mac_edge0)

if [ ${#file_content} -eq 0 ]
then
	echo "Updating file ~/mac_edge0"
	sudo edge -r -a dhcp:0.0.0.0 -s 255.255.255.0 -c $community_aviot -k $aviotkey -l $supernode_ip:$supernode_port
	export MAC_ADDRESS="$(cat /sys/class/net/edge0/address)"
	sudo echo $MAC_ADDRESS  > ~/mac_edge0
else
	echo "Reading file ~/mac_edge0"
	export MAC_ADDRESS="$(cat ~/mac_edge0)"
	sudo edge -r -a dhcp:0.0.0.0 -m $MAC_ADDRESS  -s 255.255.255.0 -c $community_aviot -k $aviotkey -l $supernode_ip:$supernode_port
fi

sudo ifconfig dhcpbr hw ether $MAC_ADDRESS up
sudo brctl addif dhcpbr edge0
sudo brctl addif dhcpbr eth0
sudo ebtables -t nat -A POSTROUTING -o edge0 -j snat --to-src $MAC_ADDRESS --snat-arp --snat-target ACCEPT
sudo /etc/init.d/dhcpcd start

sleep 60
export ROS_IP="$(/usr/sbin/ifconfig dhcpbr | grep 'inet ' | awk '{ print $2}')"
sudo sed -i "s/ROS_IP.*/ROS_IP=${ROS_IP}/" /etc/environment

#run audio-receiver
echo "Start audio-receiver/main.py"
cd /home/pi/audio-receiver
screen -S 'audio-receiver' -d -m python3 main.py

#run ros device streamer
echo "Start ros_stream.py"
cd /home/pi/ros_catkin_ws/src/ros-device-streamer/src
screen -S 'ros-device-streamer' -d -m python3 ros_stream.py -c configs.json


#run handler for gstreamer
cd /home/pi/audio-receiver/aviot-streamer-handler
screen -S 'handler-3.2' -m -d python3 handler.py --audio-raw /dev/shm/192.168.3.2.bin --janus-port 60002 --janus-ip $janus_ip --time-interval-start-stream 6 --time-interval-stop-stream 10 --check-period 1
screen -S 'handler-3.3' -m -d python3 handler.py --audio-raw /dev/shm/192.168.3.3.bin --janus-port 60003 --janus-ip $janus_ip --time-interval-start-stream 6 --time-interval-stop-stream 10 --check-period 1
screen -S 'handler-3.4' -m -d python3 handler.py --audio-raw /dev/shm/192.168.3.4.bin --janus-port 60004 --janus-ip $janus_ip --time-interval-start-stream 6 --time-interval-stop-stream 10 --check-period 1