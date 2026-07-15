# build stage
FROM node:20-bullseye-slim AS build-stage
WORKDIR /app

COPY package*.json ./
# Needed before npm install so postinstall (patch-package) can apply patches.
COPY patches ./patches
RUN npm install --legacy-peer-deps
COPY . .
# Runtime env is still supplied at container start; Nuxt reads process.env in Nitro.
RUN npm run build

# production stage — Nuxt Nitro server
FROM node:20-alpine AS production-stage
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80
ENV NITRO_PORT=80
ENV HOST=0.0.0.0

COPY --from=build-stage /app/.output ./.output
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]
CMD ["node", ".output/server/index.mjs"]
