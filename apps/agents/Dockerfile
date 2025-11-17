# syntax=docker/dockerfile:1.7

FROM oven/bun:1.1.34-slim AS base

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl ca-certificates gnupg \
  && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y --no-install-recommends nodejs \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

FROM base AS deps
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile

FROM deps AS build
COPY tsconfig.json tsconfig.json
COPY src src
RUN bun run build

FROM base AS prod-deps
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile --production

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV NOTION_API_KEY=${NOTION_API_KEY}
ENV NOTION_VERSION=${NOTION_VERSION}
ENV EXA_API_KEY=${EXA_API_KEY}
ENV MASTRA_JWT_SECRET=${MASTRA_JWT_SECRET}
ENV PORT=8080

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/.mastra ./.mastra
COPY package.json bun.lock tsconfig.json ./
COPY src src

EXPOSE 8080

CMD ["bun", "run", "start"]

