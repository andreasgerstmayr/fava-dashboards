FROM ubuntu:24.04
RUN apt-get update && apt-get install -y \
      zsh git make curl \
      npm

# chromium dependencies
RUN apt-get install -y fonts-noto-color-emoji libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon0 libxdamage1 libpango-1.0-0 libcairo2 libasound2t64

USER ubuntu
RUN curl -sSf https://rye.astral.sh/get | RYE_INSTALL_OPTION=--yes bash

ENV LC_ALL="en_US.UTF-8"
