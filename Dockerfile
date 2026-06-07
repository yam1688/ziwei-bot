FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY bot.mjs .

CMD ["node", "bot.mjs"]
