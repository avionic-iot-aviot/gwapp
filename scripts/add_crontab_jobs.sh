crontab -r
echo "$(echo '@reboot /home/pi/reboot.sh >> /home/pi/reboot-sh.log 2>&1' ; crontab -l)" | crontab -
echo "$(echo '0 * * * * bash /home/pi/delete_logs.sh' ; crontab -l)" | crontab -
