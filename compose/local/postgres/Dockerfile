# ============================================
# PostgreSQL Development Dockerfile
# Features: Query logging, enhanced debugging, relaxed settings
# ============================================

FROM postgres:17-alpine

LABEL maintainer="ComicWise Team"
LABEL description="PostgreSQL 17 for development with enhanced logging and debugging"

# Development: Install useful debugging tools
RUN apk add --no-cache \
    bash \
    curl \
    postgresql-client \
    && rm -rf /var/cache/apk/*

# Set development environment
ENV POSTGRES_INITDB_ARGS="-E UTF8 --locale=C"

# Create entrypoint script for development setup
RUN mkdir -p /docker-entrypoint-initdb.d

# Copy custom initialization scripts if they exist
COPY ./compose/local/postgres/init-scripts/* /docker-entrypoint-initdb.d/ 2>/dev/null || true

# Health check for development (relaxed)
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
    CMD ["pg_isready", "-U", "dev", "-d", "comicwise_dev"]

EXPOSE 5432

# Default command (can be overridden in compose)
CMD ["postgres", \
    "-c", "max_connections=50", \
    "-c", "shared_buffers=256MB", \
    "-c", "effective_cache_size=1GB", \
    "-c", "maintenance_work_mem=128MB", \
    "-c", "checkpoint_completion_target=0.9", \
    "-c", "wal_buffers=16MB", \
    "-c", "default_statistics_target=100", \
    "-c", "random_page_cost=1.1", \
    "-c", "effective_io_concurrency=200", \
    "-c", "work_mem=5242kB", \
    "-c", "log_statement=all", \
    "-c", "log_duration=on", \
    "-c", "log_lock_waits=on"]
