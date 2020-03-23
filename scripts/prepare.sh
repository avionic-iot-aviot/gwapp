sudo apt-get -y update
sudo apt-get -y upgrade
sudo apt-get -y install bridge-utils
sudo apt install autoconf
sudo apt-get -y install build-essential libssl-dev
sudo apt-get -y install net-tools
sudo apt-get -y install xz-utils
sudo apt-get -y install tcpdump
sudo apt-get -y install unzip
sudo apt-get -y install ebtables
#curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
#. ~/.nvm/nvm.sh
#nvm install 8.11.1
sudo npm install npm@latest -g
node -v
sudo npm install -g typescript
sudo apt-get -y install git
git clone https://github.com/ntop/n2n.git
mv n2n ~/n2n
cd ~/n2n
./autogen.sh
./configure
make 
sudo make install
npm install pm2 -g