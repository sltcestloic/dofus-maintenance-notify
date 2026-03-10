FROM node:22-slim
WORKDIR /usr/app
COPY package.json .
COPY prisma/ ./prisma/
RUN npm i -g ts-node
RUN npm install --quiet
COPY . .
RUN npx prisma generate
