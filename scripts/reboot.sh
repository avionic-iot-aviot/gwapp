#!/bin/bash
source /home/pi/drone.cfg

#script_on_startup.
sudo /etc/init.d/dhcpcd stop
sudo brctl addbr dhcpbr

if [ ! -s /home/pi/mac_edge0 ] 
then
	echo "Creating file mac_edge0"
	touch /home/pi/mac_edge0
fi

file_content=$(cat /home/pi/mac_edge0)

if [ ${#file_content} -eq 0 ]
then
	echo "Updating file /home/pi/mac_edge0"
	sudo edge -r -a dhcp:0.0.0.0 -s 255.255.255.0 -c $community_aviot -k $aviotkey -l 18.188.136.98:7654
	export MAC_ADDRESS="$(cat /sys/class/net/edge0/address)"
	sudo echo $MAC_ADDRESS  > /home/pi/mac_edge0
else
	echo "Reading file /home/pi/mac_edge0"
	export MAC_ADDRESS="$(cat /home/pi/mac_edge0)"
	sudo edge -r -a dhcp:0.0.0.0 -m $MAC_ADDRESS  -s 255.255.255.0 -c $community_aviot -k $aviotkey -l 18.188.136.98:7654
fi

sudo ifconfig dhcpbr hw ether $MAC_ADDRESS up
sudo brctl addif dhcpbr edge0
sudo brctl addif dhcpbr eth0
sudo ebtables -t nat -A POSTROUTING -o edge0 -j snat --to-src $MAC_ADDRESS --snat-arp --snat-target ACCEPT
sudo /etc/init.d/dhcpcd start
