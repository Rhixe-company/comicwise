# ============================================
# PostgreSQL Production Dockerfile
# Features: Optimized for performance, hardened, monitoring-ready
# ============================================

FROM postgres:17-alpine

LABEL maintainer="ComicWise Team"
LABEL description="PostgreSQL 17 for production - hardened and optimized"

# Production: Install only essential tools
RUN apk add --no-cache \
    postgresql-client \
    && rm -rf /var/cache/apk/*

# Set production environment
ENV POSTGRES_INITDB_ARGS="-E UTF8 --locale=C"

# Create entrypoint script directory
RUN mkdir -p /docker-entrypoint-initdb.d

# Copy production initialization scripts if they exist
COPY ./compose/production/postgres/init-scripts/* /docker-entrypoint-initdb.d/ 2>/dev/null || true

# Production: Strict health check
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=5 \
    CMD ["pg_isready", "-U", "postgres", "-d", "comicwise"]

EXPOSE 5432

# Production: Optimized PostgreSQL settings
CMD ["postgres", \
    "-c", "max_connections=150", \
    "-c", "shared_buffers=1GB", \
    "-c", "effective_cache_size=4GB", \
    "-c", "maintenance_work_mem=256MB", \
    "-c", "checkpoint_completion_target=0.9", \
    "-c", "wal_buffers=32MB", \
    "-c", "default_statistics_target=100", \
    "-c", "random_page_cost=1.1", \
    "-c", "effective_io_concurrency=200", \
    "-c", "work_mem=6553kB", \
    "-c", "huge_pages=off", \
    "-c", "min_wal_size=2GB", \
    "-c", "max_wal_size=8GB", \
    "-c", "log_statement=mod", \
    "-c", "log_min_duration_statement=5000", \
    "-c", "log_lock_waits=on", \
    "-c", "log_connections=on", \
    "-c", "log_disconnections=on"]
