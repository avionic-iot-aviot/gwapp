PROJECT_FOLDER="gwapp"

if [ ! -d $PROJECT_FOLDER ] ; then
echo 'Folder not found'
else
echo 'Folder found. Deleting the folder and the pm2 instance of the gatewayapp.'
pm2 stop gatewayapp
sudo rm -rf ~/$PROJECT_FOLDER
fi
git clone -b master --single-branch  git://github.com/avionic-iot-aviot/gwapp.git
cd ~/$PROJECT_FOLDER/backend;
npm install
npm run be:build
NODE_ENV=staging pm2 start dist/main.js --name "gatewayapp" && cd ~/ && pm2 startup > pm2_startup_output;
tail -n 1 pm2_startup_output > pm2_startup.sh && chmod u+rwx pm2_startup.sh && ./pm2_startup.sh && pm2 save
cd ~