FROM node:14.16-stretch-slim

RUN apt-get -qy update && apt-get -qy install openssl

WORKDIR /opt/service

ARG SOCIAL_LOGIN_GOOGLE_CLIENT_ID
ARG SOCIAL_LOGIN_FACEBOOK_APP_ID
ARG SOCIAL_LOGIN_FACEBOOK_APP_SECRET

ENV SOCIAL_LOGIN_GOOGLE_CLIENT_ID $SOCIAL_LOGIN_GOOGLE_CLIENT_ID
ENV SOCIAL_LOGIN_FACEBOOK_APP_ID $SOCIAL_LOGIN_FACEBOOK_APP_ID
ENV SOCIAL_LOGIN_FACEBOOK_APP_SECRET $SOCIAL_LOGIN_FACEBOOK_APP_SECRET

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY prisma  .
RUN ./node_modules/.bin/prisma generate

COPY . .
RUN npx -p typescript@4.2.4 tsc > /dev/null || true

ENV DATABASE_URL mysql://root:luanpass@mysql:3306/main?serverTimezone=UTC
EXPOSE 9000
CMD node dist/index.js
