FROM nginx:1.19.0-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY incopis_nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir /wsgi

RUN mkdir /code
RUN mkdir /code/static_root/


COPY uwsgi_params /wsgi/