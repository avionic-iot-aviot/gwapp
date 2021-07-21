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
sudo apt -y install screen

# Install nvm v0.37.2 from their repo
git clone https://github.com/nvm-sh/nvm.git .nvm
cd .nvm
git checkout v0.37.2
cd ..
. ~/.nvm/nvm.sh

# Install node 8.11.1
nvm install 8.11.1
node -v

# Install global node packages
npm install typescript -g
npm install pm2 -g

# Install n2n
git clone --single-branch --branch 2.8-stable https://github.com/ntop/n2n.git
mv n2n ~/n2n
cd ~/n2n
./autogen.sh
./configure
make 
sudo make install

# NVM, NPM/NODE set on .bashrc
echo 'export NVM_DIR="${HOME}/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm' >> ~/.bashrc

# Global npm packages set on .bashrc. It depends on the running node --version and it reloads when opening a shell
echo 'PATH="$PATH:~/.nvm/versions/node/$(node --version)/bin"' >> ~/.bashrc

# Exports the ROS_MASTER_URI and the ROS_IP on .bashrc. The ROS_IP will automatically reload when opening a shell
echo 'export ROS_MASTER_URI="http://10.11.0.2:11311"' >> ~/.bashrc
echo $'export ROS_IP="$(ifconfig dhcpbr | grep \'inet \' | awk \'{ print $2}\')"' >> ~/.bashrc

# Return to home folder
cd ~

# create and configure the drone.cfg file needed for reboot.sh
# PS. IMPORTANT: You need to setup this file before moving on the reboot.sh script
touch drone.cfg
echo "community_aviot=xxxx" >> drone.cfg
echo "aviotkey=xxxx" >> drone.cfg
echo "supernode_ip='x.x.x.x'" >> drone.cfg
echo "supernode_port=xxxx" >> drone.cfg

# Make reboot.sh runnable and then set a crontab operation at reboot time
#chmod 755 ~/reboot.sh
#echo "$(echo '@reboot ~/reboot.sh' ; crontab -l)" | crontab -

# Install python dependencies
yes | pip3 install pyaml
yes | pip3 install rospkg