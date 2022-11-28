FROM node:16

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install --only=prod

EXPOSE 3000

CMD ["npm", "run", "start"]