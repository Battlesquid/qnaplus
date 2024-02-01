#!/bin/sh
docker build --rm -t qnaplus/bot -f ./services/bot/Dockerfile .
docker build --rm -t qnaplus/updater -f ./services/updater/Dockerfile .