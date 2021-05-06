# Social Login Server
## What is used?
- Node.js 14
- TypeScript 4.2.4
- MySQL 8.0.24
- Prisma 2.22.0

## Auth Provider Setting
### Google
1. Create GCP OAuth 2.0 Client with scopes [email, profile, openid] allowing `http://localhost:8080`
2. Export the Client ID as SOCIAL_LOGIN_GOOGLE_CLIENT_ID

### Facebook
1. Create App in `https://developers.facebook.com/`
2. Export the ID as SOCIAL_LOGIN_FACEBOOK_APP_ID
3. Export the Secret as SOCIAL_LOGIN_FACEBOOK_APP_SECRET

## Prepare to Develop
- Install Node.js 14
- Install Yarn
- Run `yarn install`

## How to Run
You must set environment variables before building docker image
```
$ . build-docker.sh
$ docker compose up
```
It runs mysql locally for easy testing
