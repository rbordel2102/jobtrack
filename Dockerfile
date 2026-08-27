FROM node:24-bookworm-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

FROM node:24-bookworm-slim AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY prisma ./prisma
COPY public ./public
COPY types ./types
COPY next.config.ts eslint.config.mjs postcss.config.mjs prisma.config.ts proxy.ts tsconfig.json ./

# Generation only needs a valid-looking URL; the build does not connect to a database.
RUN DATABASE_URL=postgresql://ci:ci@localhost:5432/jobtrack \
  DIRECT_URL=postgresql://ci:ci@localhost:5432/jobtrack \
  BETTER_AUTH_SECRET=ci-build-only-secret \
  BETTER_AUTH_URL=http://localhost:3000 \
  npm run build \
  && find .next/standalone -type f -name '.env*' -delete

FROM node:24-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
