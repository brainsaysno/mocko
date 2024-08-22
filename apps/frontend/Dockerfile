FROM node:lts-alpine as build

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system frontend && \
          adduser --system -G frontend frontend

COPY . .

RUN npm --prefix frontend --omit=dev -f install

RUN npx nx



FROM build

COPY dist/apps/frontend frontend/
RUN chown -R frontend:frontend .

# You can remove this install step if you build with `--bundle` option.
# The bundled output will include external dependencies.
RUN npm --prefix frontend --omit=dev -f install

CMD [ "node", "frontend" ]
