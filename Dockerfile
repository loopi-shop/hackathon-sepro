FROM node:18.13-alpine AS front-buyer
WORKDIR /app/front-buyer
COPY src ./src
COPY public ./public
COPY package.json ./
COPY package-lock.json ./
COPY jsconfig.json ./
COPY next.config.js ./
COPY .eslintrc.json ./
COPY .editorconfig ./
RUN npm install
RUN npm run build

FROM nginx:1.25.3-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY front.conf /etc/nginx/conf.d

COPY index.html /usr/share/nginx/html/index.html
COPY front-buyer /app/front-buyer
COPY front-issuer /app/front-issuer

ENV PORT=80

EXPOSE 80
