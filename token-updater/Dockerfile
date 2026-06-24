FROM node:18-alpine
WORKDIR /app

COPY token-updater/package.json ./
COPY prisma/schema.prisma ./prisma/

RUN apk add --no-cache openssl
RUN npm install
RUN npx prisma generate --schema ./prisma/schema.prisma

COPY token-updater/index.js ./

CMD ["node", "index.js"]
