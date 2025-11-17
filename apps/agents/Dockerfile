# syntax=docker/dockerfile:1.7

FROM oven/bun:1.1.34-slim AS base
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
ENV PORT=8080

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/.mastra ./.mastra
COPY package.json bun.lock tsconfig.json ./
COPY src src

EXPOSE 8080

CMD ["bun", "run", "start"]

