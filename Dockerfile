FROM node:lts-alpine as build

ARG VITE_POSTHOG_KEY
ARG VITE_POSTHOG_HOST
ARG VITE_API_BASE_URL

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /build

RUN addgroup --system frontend && \
          adduser --system -G frontend frontend

COPY . .

RUN corepack enable

RUN pnpm install

RUN pnpm frontend build


FROM caddy

COPY --from=build /build/apps/frontend/Caddyfile /etc/caddy/Caddyfile

COPY --from=build /build/dist/apps/frontend /srv
COPY --from=build /build/dist/apps/frontend /var/www/html

RUN caddy fmt --overwrite /etc/caddy/Caddyfile
