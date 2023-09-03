FROM node:18

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

EXPOSE 8080

CMD [ "node", "app.js"]