FROM python:3.6-alpine

ENV PYTHONBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN mkdir /code
WORKDIR /code
RUN pip install --upgrade pip

# Install postgres client dependencies
RUN apk update
RUN apk add gcc python3-dev musl-dev postgresql-dev linux-headers
RUN pip install wheel

COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000
