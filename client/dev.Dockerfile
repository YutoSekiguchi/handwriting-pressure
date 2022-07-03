FROM --platform=linux/x86_64 node:15.8

WORKDIR /app

EXPOSE 3000

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start" ]