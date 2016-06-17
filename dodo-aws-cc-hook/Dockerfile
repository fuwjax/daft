FROM node:6.1.0

ENTRYPOINT ["hook"]
WORKDIR /work
VOLUME /work

COPY . /dodo-aws-cc-hook
RUN npm install -g --production /dodo-aws-cc-hook
