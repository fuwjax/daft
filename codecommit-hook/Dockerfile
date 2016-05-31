FROM python:3.5

RUN pip install awscli

CMD ["clone.exec.sh"]
WORKDIR /work

COPY clone.exec.sh /usr/local/bin
