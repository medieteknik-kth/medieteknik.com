FROM python:3

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

COPY requirements.txt /usr/src/api

RUN pip3 install -r requirements.txt

ENTRYPOINT ["flask"]
CMD ["run", "--host=0.0.0.0"]
