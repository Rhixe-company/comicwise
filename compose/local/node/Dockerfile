# syntax=docker/dockerfile:1.7

# ============================================
# Development Dockerfile - Hot Reload & Debugging
# Features: Fast rebuilds, source maps, debugging support
# ============================================

FROM node:22-alpine

LABEL maintainer="ComicWise Team"
LABEL description="Next.js 16 development image with hot reload"

# Install system dependencies
RUN apk add --no-cache \
    libc6-compat \
    bash \
    git && \
    rm -rf /var/cache/apk/*

# Enable Corepack for pnpm
RUN corepack enable && \
    corepack prepare pnpm@latest --activate

WORKDIR /app

# Configure pnpm
ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH" \
    PNPM_STORE_DIR="/pnpm/store"

# Development-specific environment variables
ENV NODE_ENV=development \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0" \
    CHOKIDAR_USEPOLLING=true \
    WATCHPACK_POLLING=true

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./

# Install all dependencies (including devDeps for development)
RUN --mount=type=cache,id=pnpm-store-dev,target=/pnpm/store \
    --mount=type=cache,id=pnpm-metadata-dev,target=/root/.local/share/pnpm \
    pnpm install --frozen-lockfile --prefer-frozen-lockfile

# Copy source code (will be overridden by volume mount in compose)
COPY . .

# Create non-root user for development
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Health check (relaxed for dev - slower startup is OK)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=2 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start with watch mode and polling for file changes
CMD ["pnpm", "dev"]
