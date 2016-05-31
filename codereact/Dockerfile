ROM python:3.5

RUN pip install awscli

WORKDIR /hook
ENTRYPOINT ["./buildit.sh"]

COPY buildit.sh /hook
