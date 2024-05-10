#!/bin/sh

yarn dotenv-vault push
yarn dotenv-vault push production

yarn dotenv-vault pull
yarn dotenv-vault pull production

rm .env.previous .env.production.previous
