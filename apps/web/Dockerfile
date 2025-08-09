# ---- Build stage ----
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- Static export and serve ----
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/out ./out
EXPOSE 3000
ENV SENTRY_DSN=${SENTRY_DSN}
ENV NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN}
CMD ["serve", "-s", "out", "-l", "3000"]