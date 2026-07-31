FROM node:22-slim
WORKDIR /usr/app
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm i -g ts-node
RUN npm ci --quiet
COPY --chown=node:node . .

USER node

RUN DATABASE_URL=postgresql://unused:unused@localhost:5432/unused npx prisma generate

CMD ["npm", "start"]
