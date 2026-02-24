# ============================================
# Redis Development Dockerfile
# Features: Debugging, verbose logging, persistence
# ============================================

FROM redis:7-alpine

LABEL maintainer="ComicWise Team"
LABEL description="Redis 7 for development with persistence and verbose logging"

# Development: Install debugging tools
RUN apk add --no-cache \
    bash \
    curl \
    && rm -rf /var/cache/apk/*

# Create data directory
RUN mkdir -p /data && chmod 755 /data

# Relaxed health check for development
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
    CMD ["redis-cli", "--raw", "incr", "ping"]

EXPOSE 6379

# Development: Redis configuration with persistence and debug logging
CMD ["redis-server", \
    "--port", "6379", \
    "--bind", "0.0.0.0", \
    "--appendonly", "yes", \
    "--appendfsync", "everysec", \
    "--maxmemory", "512mb", \
    "--maxmemory-policy", "allkeys-lru", \
    "--save", "900", "1", \
    "--save", "300", "10", \
    "--save", "60", "10000", \
    "--loglevel", "debug", \
    "--tcp-backlog", "511", \
    "--timeout", "0", \
    "--tcp-keepalive", "300", \
    "--databases", "16", \
    "--no-appendfsync-on-rewrite", "no"]
