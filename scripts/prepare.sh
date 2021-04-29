sudo apt -y update
sudo apt -y upgrade
sudo apt -y install bridge-utils
sudo apt -y install autoconf
sudo apt -y install build-essential libssl-dev
sudo apt -y install net-tools
sudo apt -y install xz-utils
sudo apt -y install tcpdump
sudo apt -y install unzip
sudo apt -y install ebtables
sudo apt -y install git

# Install nvm v0.37.2 from their repo
git clone https://github.com/nvm-sh/nvm.git .nvm
cd .nvm
git checkout v0.37.2
cd ..
. /home/pi/.nvm/nvm.sh

# Install node 8.11.1
nvm install 8.11.1
node -v

# Install global node packages
npm install typescript -g
npm install pm2 -g

# Install n2n
git clone --single-branch --branch 2.6-stable https://github.com/ntop/n2n.git
mv n2n ~/n2n
cd ~/n2n
./autogen.sh
./configure
make 
sudo make install

# NVM, NPM/NODE set on .bashrc
echo 'export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"' >> /home/pi/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm' >> /home/pi/.bashrc

# Global npm packages set on .bashrc. It depends on the running node --version and it reloads when opening a shell
echo 'PATH="$PATH:/home/pi/.nvm/versions/node/$(node --version)/bin"' >> /home/pi/.bashrc

# Exports the ROS_MASTER_URI and the ROS_IP on .bashrc. The ROS_IP will automatically reload when opening a shell
echo 'export ROS_MASTER_URI="http://10.11.0.2:11311"' >> /home/pi/.bashrc
echo $'export ROS_IP="$(ifconfig dhcpbr | grep \'inet \' | awk \'{ print $2}\')"' >> /home/pi/.bashrc

# Return to home folder
cd /home/pi

# create and configure the drone.cfg file needed for reboot.sh
# PS. IMPORTANT: You need to setup this file before moving on the reboot.sh script
touch drone.cfg
echo "community_aviot=" >> drone.cfg
echo "aviotkey=" >> drone.cfg
echo "supernode_ip=" >> drone.cfg
echo "supernode_port=" >> drone.cfg

# Make reboot.sh runnable and then set a crontab operation at reboot time
chmod 755 /home/pi/reboot.sh
echo "$(echo '@reboot /home/pi/reboot.sh' ; crontab -l)" | crontab -