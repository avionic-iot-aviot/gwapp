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


#run audio-receiver
sleep 60
echo "Start audio-receiver/main.py"
cd /home/pi/audio-receiver
screen -S 'audio-receiver' -d -m python3 main.py

#run ros device streamer
echo "Start ros_stream.py"
cd /home/pi/ros_catkin_ws/src/ros-device-streamer/src
screen -S 'ros-device-streamer' -d -m python3 ros_stream.py -c configs.json