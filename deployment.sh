#!/bin/bash

# Build the frontend
echo "Build frontend using NPM"
cd ./personal_wardrobe_frontend
npm run build

cd ../
cd ./Incopis_Front
pipenv lock -r > ./requirements.txt
pipenv shell


python manage.py collectstatic
cp ./uwsgi/incopis_nginx.conf /etc/nginx/sites-available/incopis_nginx.conf
sudo /etc/init.d/nginx restart
uwsgi --socket /tmp/incopis_front.sock --module Incopis_Front.wsgi --chmod-socket=666