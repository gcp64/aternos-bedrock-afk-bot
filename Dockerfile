FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY patch.js ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "bot.js"]
