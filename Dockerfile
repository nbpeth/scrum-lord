FROM alpine:3.14

WORKDIR /app
RUN apk add --update nodejs npm
COPY . .
RUN npm install

ENTRYPOINT PORT=8080 npm run start

