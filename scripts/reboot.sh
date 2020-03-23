#!/bin/bash
#script_on_startup.
sudo /etc/init.d/dhcpcd stop
sudo brctl addbr dhcpbr

if [  -f '/home/pi/mac_edge0' ] ; then

export MAC_ADDRESS="$(cat /home/pi/mac_edge0)"
sudo edge -r -a dhcp:0.0.0.0 -m $MAC_ADDRESS  -s 255.255.255.0 -c community_aviot -k aviotkey -l 18.188.136.98:7654
fi
if [ ! -f '/home/pi/mac_edge0' ] ; then
echo "NOT EXISTS"
sudo edge -r -a dhcp:0.0.0.0 -s 255.255.255.0 -c community_aviot -k aviotkey -l 18.188.136.98:7654
export MAC_ADDRESS="$(cat /sys/class/net/edge0/address)"
sudo echo $MAC_ADDRESS  > mac_edge0
fi

#export MAC_ADDRESS="$(cat /sys/class/net/eth0/address)"
sudo ifconfig dhcpbr hw ether $MAC_ADDRESS up
#sudo edge -r -a dhcp:0.0.0.0 -m $MAC_ADDRESS  -s 255.255.255.0 -c community_aviot -k aviotkey -l 18.188.136.98:7654
sudo brctl addif dhcpbr edge0
sudo brctl addif dhcpbr eth0
sudo ebtables -t nat -A POSTROUTING -o edge0 -j snat --to-src $MAC_ADDRESS --snat-arp --snat-target ACCEPT
sudo /etc/init.d/dhcpcd start
#cd /home/pi/gwapp/backend
#NODE_ENV=staging pm2 start dist/main.js --name "gatewayapp"