# Multi-stage build for the TutorsHub Expo app.
#
#   --target dev   Metro dev server with live reload (Expo Go / browser)
#   --target web   production web export served by nginx
#
# Native iOS/Android binaries are not built here — those go through EAS
# (see eas.json).

FROM node:22-bookworm-slim AS base
ENV EXPO_NO_TELEMETRY=1
RUN mkdir /app && chown node:node /app
WORKDIR /app
USER node

# Dependencies only, so source edits don't invalidate the npm cache layer.
FROM base AS deps
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

# --- Development server ------------------------------------------------------
FROM deps AS dev
COPY --chown=node:node . .
# Created here so compose's anonymous volume inherits the node owner.
RUN mkdir -p .expo
EXPOSE 8081
CMD ["npx", "expo", "start", "--host", "lan", "--port", "8081"]

# --- Static web export -------------------------------------------------------
FROM deps AS web-build
# Inlined into the JS bundle at export time, so changing it requires a rebuild.
ARG EXPO_PUBLIC_API_URL=http://localhost:4000
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL
COPY --chown=node:node . .
RUN npx expo export --platform web --output-dir dist

FROM nginxinc/nginx-unprivileged:1.27-alpine AS web
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=web-build /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/healthz || exit 1
