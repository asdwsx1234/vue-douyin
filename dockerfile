FROM ubuntu:latest
COPY . /vue-douyin
RUN apt-get update && apt-get install -y vim mysql-server nodejs npm redis-server && npm install && chmod 777 /vue-douyin/shell/startup && /vue-douyin/shell/startup 
WORKDIR /vue-douyin
EXPOSE 3000
CMD /etc/init.d/mysql restart && /etc/init.d/redis-server restart && node /vue-douyin/server/app.js