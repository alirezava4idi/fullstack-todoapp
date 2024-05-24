FROM node:lts-alpine3.19


WORKDIR /app

COPY package.json .

ARG NODE_ENV

RUN if [ "${NODE_ENV}" = "development" ] ; \
        then npm install ; \
        else npm install --omit=development ; \
        fi

COPY . .

ENV PORT 3000
ENV TZ="Asia/Tehran"

EXPOSE ${PORT}

CMD [ "node" , "index.js" ]

