FROM node:6.1.0

ENTRYPOINT ["docker-do"]
WORKDIR /work
VOLUME /work

COPY . /docker-do
RUN npm install -g --production /docker-do
