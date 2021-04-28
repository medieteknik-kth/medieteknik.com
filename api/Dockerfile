FROM python:3

RUN apt-get update
RUN apt-get install poppler-utils -y

EXPOSE 80

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

COPY . /usr/src/api

RUN pip3 install -r requirements.txt

RUN pip3 install psycopg2

CMD gunicorn --workers 3 --bind=0.0.0.0:80 --chdir /usr/src/api api:app
