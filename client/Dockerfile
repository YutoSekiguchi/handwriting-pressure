FROM node:18.9

WORKDIR /app

EXPOSE 3000

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start" ]