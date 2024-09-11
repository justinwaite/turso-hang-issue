# base node image
FROM node:22.8.0-bullseye-slim as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install pnpm
RUN corepack enable

COPY . /app
WORKDIR /app
RUN mkdir /tmp/libsql_bundle

FROM base as installer

RUN pnpm i --force @libsql/linux-arm64-gnu --prefix /tmp/libsql_bundle
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod

FROM base
ENV NODE_ENV=production

COPY --from=installer /app/node_modules /app/node_modules
COPY --from=installer --chown=root:nodejs /tmp/libsql_bundle/node_modules/@libsql/linux-arm64-gnu /app/node_modules/@libsql/linux-arm64-gnu
CMD [ "pnpm", "start" ]