FROM node:18.17.1-alpine AS dependencies
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install

FROM node:18.17.1-alpine as builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY .eslintrc.json ./
COPY jsconfig.json ./
COPY next.config.js ./
COPY package-lock.json ./
COPY package.json ./
COPY public ./public
COPY src ./src
COPY .env ./
RUN npm run build
RUN npm prune --production

FROM node:18.17.1-alpine as runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder --chown=10101 /app/public ./public
COPY .env ./
COPY package.json ./
RUN ls
RUN cat package.json

ENV PORT=80

EXPOSE 80

CMD [ "npm", "run", "start" ]
