FROM node:6.1.0

ENTRYPOINT ["punk"]
WORKDIR /work
VOLUME /work

COPY . /punk
RUN npm install -g --production /punk \
  && npm link --production /punk
