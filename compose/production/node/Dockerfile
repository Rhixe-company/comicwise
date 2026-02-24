# syntax=docker/dockerfile:1.7

# ============================================
# Production Dockerfile - Optimized & Hardened
# Features: Multi-stage, minimal size, non-root, health checks
# ============================================

FROM node:22-alpine AS base

LABEL maintainer="ComicWise Team"
LABEL description="Next.js 16 production image - minimal & hardened"

# Install system dependencies and security updates in single layer
RUN apk add --no-cache \
    libc6-compat \
    dumb-init \
    tini && \
    apk upgrade --no-cache && \
    rm -rf /var/cache/apk/*

# Enable Corepack for pnpm
RUN corepack enable && \
    corepack prepare pnpm@latest --activate

WORKDIR /app

# Configure pnpm with optimized settings
ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH" \
    PNPM_STORE_DIR="/pnpm/store"

# ============================================
# Dependencies stage - Install & prune prod deps
# ============================================
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./

# Install all dependencies, then prune to production only
RUN --mount=type=cache,id=pnpm-store-prod,target=/pnpm/store \
    --mount=type=cache,id=pnpm-metadata-prod,target=/root/.local/share/pnpm \
    pnpm install --frozen-lockfile --prefer-frozen-lockfile && \
    pnpm prune --prod

# ============================================
# Builder stage - Compile Next.js application
# ============================================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    SKIP_ENV_VALIDATION=1 \
    CI=true

# Generate Drizzle ORM types if configured
RUN --mount=type=cache,id=drizzle-prod,target=/app/.drizzle \
    pnpm db:generate 2>/dev/null || echo "✓ Database types skipped"

# Build Next.js with standalone output and persistent cache
RUN --mount=type=cache,id=next-build-prod,target=/app/.next/cache \
    pnpm build

# ============================================
# Runtime stage - Minimal production image
# ============================================
FROM base AS runtime

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0" \
    NODE_OPTIONS="--max-old-space-size=2048"

# Security: Create non-root user with specific UID/GID
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs && \
    mkdir -p /app/.next/static && \
    chown -R nextjs:nodejs /app

# Copy only production dependencies
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy only necessary build artifacts
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Optimization: Remove unnecessary files
RUN rm -rf /tmp/* /var/tmp/* /var/cache/apk/* && \
    find . -name '*.map' -type f -delete && \
    find . -name '*.ts' -not -path './node_modules/*' -type f -delete

USER nextjs
EXPOSE 3000

# Health check with fast timeout for production
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Use tini as PID 1 for proper signal handling and zombie cleanup
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
