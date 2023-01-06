FROM nginx:latest
EXPOSE 80
RUN rm /etc/nginx/conf.d/default.conf
RUN mkdir -p /etc/nginx/conf.d/utils/
COPY default.conf /etc/nginx/conf.d/default.conf
COPY headers.conf /etc/nginx/conf.d/utils/headers.conf
