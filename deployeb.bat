#!/bin/bash
# My first script

cp /var/www/index.php /home/chris/ship/index.php
cp /var/www/email.html /home/chris/ship/email.html
cp /var/www/favicon.ico /home/chris/ship/favicon.ico
cp /var/www/composer.json /home/chris/ship/composer.json
cp -r /var/www/templates /home/chris/ship/templates
cp -r /var/www/code /home/chris/ship/code
cp -r /var/www/dist /home/chris/ship/dist
cp -r /var/www/.ebextensions /home/chris/ship/.ebextensions

sed -i 's/dist\/bundle.js/https:\/\/s3-us-west-2.amazonaws.com\/notello.com\/bundle.js/g' /home/chris/ship/templates/index.html
#sed -i 's/dist\/styles.css/https:\/\/s3-us-west-2.amazonaws.com\/notello.com\/styles.css/g' /home/chris/ship/templates/index.html
sed -i 's/$dev = true;/$dev = false;/g' /home/chris/ship/index.php

cd /home/chris/ship
zip -r deploy.zip ./

rm /home/chris/ship/index.php
rm /home/chris/ship/email.html
rm /home/chris/ship/favicon.ico
rm /home/chris/ship/composer.json
rm -rf /home/chris/ship/templates
rm -rf /home/chris/ship/code
rm -rf /home/chris/ship/dist
rm -rf /home/chris/ship/.ebextensions

cd /var/www
gulp publish