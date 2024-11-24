FROM ubuntu:24.04
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
RUN apt-get update && apt-get install -y \
      zsh git make \
      npm

# chromium dependencies
RUN apt-get install -y fonts-noto-color-emoji libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon0 libxdamage1 libpango-1.0-0 libcairo2 libasound2t64

ENV LC_ALL="en_US.UTF-8"
USER ubuntu
