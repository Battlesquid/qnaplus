FROM node:20.11.0-alpine3.19 as base

WORKDIR /app

# We only copy the dependencies we need
COPY packages packages

COPY services/updater services/updater

# The global package.json only contains build dependencies
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY tsconfig.base.json .
COPY .env.vault .

RUN yarn install \
&& yarn workspace @qnaplus/updater run build \
&& rm -rf node_modules \
&& yarn install --production

CMD yarn updater:start