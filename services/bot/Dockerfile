FROM node:20.11.0-alpine3.19 as base

WORKDIR /app

# We only copy the dependencies we need
COPY packages/config packages/config
COPY packages/qnaplus packages/qnaplus
COPY packages/store packages/store

COPY services/bot services/bot

# The global package.json only contains build dependencies
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY tsconfig.base.json .
COPY .env.vault .

RUN yarn install \
&& yarn workspace @qnaplus/bot run build \
&& rm -rf node_modules \
&& yarn install --production

CMD yarn bot:start