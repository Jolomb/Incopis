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

# Build the docker compose images
docker-compose build

# Set up the containers and the networks
docker-compose up -d

# Initialize the DB (In the future we will have data the persists between runs)
docker-compose exec web python manage.py migrate --noinput