FROM node:20-alpine

# Install OpenSSL — required by Prisma on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src

EXPOSE 5000

CMD ["npx", "tsx", "src/index.ts"]
