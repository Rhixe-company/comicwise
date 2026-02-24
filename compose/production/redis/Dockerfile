# ============================================
# Redis Production Dockerfile
# Features: Optimized, hardened, monitoring-ready
# ============================================

FROM redis:7-alpine

LABEL maintainer="ComicWise Team"
LABEL description="Redis 7 for production - hardened and optimized"

# Production: Minimal dependencies
RUN apk add --no-cache \
    curl \
    && rm -rf /var/cache/apk/*

# Create data directory with restricted permissions
RUN mkdir -p /data && chmod 700 /data

# Production: Strict health check
HEALTHCHECK --interval=15s --timeout=3s --start-period=20s --retries=5 \
    CMD ["redis-cli", "--raw", "incr", "ping"]

EXPOSE 6379

# Production: Optimized Redis configuration
CMD ["redis-server", \
    "--port", "6379", \
    "--bind", "0.0.0.0", \
    "--appendonly", "yes", \
    "--appendfsync", "everysec", \
    "--maxmemory", "2gb", \
    "--maxmemory-policy", "allkeys-lru", \
    "--save", "900", "1", \
    "--save", "300", "10", \
    "--save", "60", "10000", \
    "--loglevel", "warning", \
    "--tcp-backlog", "511", \
    "--timeout", "300", \
    "--tcp-keepalive", "300", \
    "--databases", "16", \
    "--no-appendfsync-on-rewrite", "yes", \
    "--slowlog-log-slower-than", "10000", \
    "--slowlog-max-len", "128"]
