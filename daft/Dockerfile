FROM node:6.1.0

ENTRYPOINT ["daft"]
WORKDIR /work
VOLUME /work

COPY . /daft
RUN npm install -g --production /daft \
  && npm link --production /daft
