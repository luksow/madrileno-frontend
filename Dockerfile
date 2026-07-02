# SSR-mode image. Only needed if you deploy the opt-in SSR server; the default
# SPA build (`npm run build`) is static files for any web server / CDN.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build:ssr

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY server.js ./
EXPOSE 5173
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:5173/healthz || exit 1
USER node
CMD ["node", "server.js"]
