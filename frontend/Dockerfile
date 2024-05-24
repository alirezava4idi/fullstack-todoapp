FROM node:lts-alpine3.19 AS build

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:stable-alpine3.17

COPY --from=build /app/dist/todoapp/browser /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80


