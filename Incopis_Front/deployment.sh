python manage.py collectstatic
sudo /etc/init.d/nginx restart
uwsgi --socket /tmp/incopis_front.sock --module Incopis_Front.wsgi --chmod-socket=666