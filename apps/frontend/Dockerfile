FROM node:lts-alpine as build

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system frontend && \
          adduser --system -G frontend frontend

COPY . .

RUN pnpm --prefix frontend --omit=dev -f install

RUN npx nx build frontend


FROM build

COPY /app/dist/apps/frontend frontend/
RUN chown -R frontend:frontend .

CMD [ "node", "frontend" ]
