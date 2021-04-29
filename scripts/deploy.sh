PROJECT_FOLDER="$gwapp"

if [ ! -d $PROJECT_FOLDER ] ; then
echo 'NOT Exists'
else
echo 'Already Exists'
pm2 stop gatewayapp
sudo rm -rf ~/gwapp
fi
git clone -b resolv --single-branch  git://github.com/avionic-iot-aviot/gwapp.git
cd ~/gwapp/backend;
npm install
npm run be:build
cd ~/gwapp/backend
NODE_ENV=staging pm2 start dist/main.js --name "gatewayapp" && cd ~/ && pm2 startup > pm2_startup_output;
tail -n 1 pm2_startup_output > pm2_startup.sh && chmod u+rwx pm2_startup.sh && ./pm2_startup.sh && pm2 save