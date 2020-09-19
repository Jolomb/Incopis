FROM nginx:1.19.0-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY incopis_nginx.conf
MKDIR /wsgi

COPY uwsgi_params /wsgi/