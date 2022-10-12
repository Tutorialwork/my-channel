FROM node:18-alpine

RUN apk add tzdata && cp /usr/share/zoneinfo/Europe/Berlin /etc/localtime

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install

ADD . /usr/src/app

RUN npm run build

CMD [ "npm", "run", "start" ]

EXPOSE 3000