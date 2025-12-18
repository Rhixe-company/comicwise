# ComicWise Configuration & Infrastructure Index

Complete reference for all configuration files and infrastructure setup.

## 📋 File Directory

### Environment Configuration Files

#### `.envs/` Directory

```
.envs/
├── .env.development      (4.6 KB)  Development environment template
├── .env.production       (6.0 KB)  Production environment template
└── README.md             (5.9 KB)  Comprehensive environment variables guide
```

**Purpose:** Centralized environment templates for different deployment
environments

**Key Contents:**

- Development: Local database (dev:dev123), local uploads, MailHog email
- Production: Cloud database (Neon), ImageKit uploads, SendGrid email
- Both: OAuth configuration, Redis settings, PgAdmin access

**Usage:**

```bash
cp .envs/.env.development .env.local    # For local development
cp .envs/.env.production .env.local     # For production setup
```

### Root Environment Files

#### `.env.local`

- **Location:** Project root (NOT in git - in .gitignore)
- **Purpose:** Your actual configuration for local development
- **Created by:** Copying from `.envs/.env.development`
- **Keep secret:** Never commit to git

#### `.env.example`

- **Location:** Project root
- **Purpose:** Reference for all available environment variables
- **Audience:** Developers setting up project
- **Contains:** Descriptions for each variable

### Docker & Deployment Files

#### `docker-compose.yml`

- **Purpose:** Production Docker Compose configuration
- **Services:**
  - PostgreSQL 17 (port 5432)
  - Redis 7 (port 6379)
  - PgAdmin 4 (port 5050)
  - Next.js App (port 3000)
- **Features:** Health checks, resource limits, optimized production settings

#### `docker-compose.dev.yml`

- **Purpose:** Development Docker Compose configuration
- **Features:**
  - Hot reload with volume mounts
  - Development credentials
  - Higher port numbers (5433, 6380, 5051, 3000)
  - Builder target (includes dev dependencies)

#### `compose/` Directory Scripts

| File                 | Purpose          | OS        | Description                   |
| -------------------- | ---------------- | --------- | ----------------------------- |
| `Dockerfile`         | App image        | All       | Multi-stage Next.js build     |
| `Dockerfile.pgadmin` | PgAdmin image    | All       | PostgreSQL management UI      |
| `setup.sh`           | Setup automation | Linux/Mac | Initialize Docker environment |
| `setup.ps1`          | Setup automation | Windows   | PowerShell setup script       |
| `seed.sh`            | Database setup   | Linux/Mac | Run database seeding          |
| `pgadmin-setup.sh`   | PgAdmin init     | Linux/Mac | Initialize PgAdmin servers    |
| `README.md`          | Docker guide     | All       | Comprehensive Docker guide    |

### Documentation Files

#### `DOCKER_ENV_SETUP_COMPLETE.md`

- **Size:** 6.6 KB
- **Purpose:** Summary of what was created
- **Audience:** New developers
- **Contains:** Quick start, services overview, troubleshooting

#### `DOCKER_ENV_SETUP.md`

- **Size:** 9.7 KB
- **Purpose:** Complete setup guide with examples
- **Audience:** All developers
- **Contains:** Quick start, services, database setup, troubleshooting

#### `.envs/README.md`

- **Size:** 5.9 KB
- **Purpose:** Environment variables reference
- **Audience:** All developers
- **Contains:** Variable descriptions, connection strings, setup instructions

#### `compose/README.md`

- **Size:** 9.2 KB
- **Purpose:** Docker and Docker Compose guide
- **Audience:** Developers and DevOps
- **Contains:** Docker commands, services, deployment, troubleshooting

#### `SETUP.md`

- **Purpose:** General project setup guide
- **Audience:** New developers
- **Contains:** Project overview, installation, local setup

#### `README.md`

- **Purpose:** Project overview and features
- **Audience:** All users
- **Contains:** Project description, features, architecture

## 🗂️ Configuration File Hierarchy

```
Configuration Levels (from most specific to least specific):
1. .env.local                           (Your local config, in .gitignore)
   └── Used by: Local dev and Docker

2. .envs/.env.development OR .envs/.env.production
   └── Template files for creating .env.local

3. .env.example
   └── Reference for all available variables

4. Environment detected from NODE_ENV
   └── development vs production
```

## 🔐 Secrets & Credentials

### Development Credentials

```env
Database:    postgresql://dev:dev123@localhost:5433/comicwise_dev
PgAdmin:     admin@example.com / admin
Redis:       localhost:6380 (no auth)
AUTH_SECRET: dev-secret-change-in-production-32-chars-minimum-here
```

### Production Credentials

```env
Database:    Use managed service (Neon) - set in .env
PgAdmin:     Set PGADMIN_DEFAULT_EMAIL and PGADMIN_DEFAULT_PASSWORD
Redis:       Use Upstash - credentials in .env
AUTH_SECRET: Generate strong secret: openssl rand -base64 32
```

## 📊 Services Configuration

### PostgreSQL Configuration

**Development:**

```yaml
Image: postgres:17-alpine
Port: 5433
Username: dev
Password: dev123
Database: comicwise_dev
Volume: comicwise_postgres_data
```

**Production:**

```yaml
Image: postgres:17-alpine
Port: 5432
Username: postgres (CHANGE THIS)
Password: postgres (CHANGE THIS)
Database: comicwise
Volume: comicwise_postgres_data
```

### Redis Configuration

**Development:**

```yaml
Image: redis:7-alpine
Port: 6380
Connection: redis://redis:6379
Persistence: AOF enabled
```

**Production:**

```yaml
Image: redis:7-alpine
Port: 6379
Connection: redis://redis:6379
Persistence: AOF enabled
Memory limit: 1GB
```

### PgAdmin Configuration

**Development:**

```yaml
Image: dpage/pgadmin4:latest
Port: 5051
Email: admin@example.com
Password: admin
Auto-add Server: Yes
```

**Production:**

```yaml
Image: dpage/pgadmin4:latest
Port: 5050
Email: ${PGADMIN_DEFAULT_EMAIL}
Password: ${PGADMIN_DEFAULT_PASSWORD}
HTTPS: Yes (recommended)
```

## 🔄 Configuration Flow

### Development Setup

```
.envs/.env.development
        ↓
    Copy to
        ↓
    .env.local (your config)
        ↓
    docker-compose.dev.yml loads .env.local
        ↓
    Services start with dev credentials
```

### Production Setup

```
.envs/.env.production
        ↓
    Copy and customize
        ↓
    .env (for deployment platform)
        ↓
    docker-compose.yml loads .env
        ↓
    Services start with production credentials
```

## 📖 How to Use Each File

### `.envs/.env.development`

Use this when:

- Setting up local development
- Creating `.env.local` for first time
- Resetting to defaults

```bash
cp .envs/.env.development .env.local
```

### `.envs/.env.production`

Use this when:

- Preparing production deployment
- Setting up staging environment
- Creating production `.env` file

```bash
cp .envs/.env.production .env  # Then update with real values
```

### `.env.local`

Use this when:

- Running locally
- Docker Compose dev reads this
- Override any template value

Edit with your actual values:

```bash
code .env.local
```

### `.env.example`

Use this when:

- Understanding available variables
- Looking up variable descriptions
- Checking format/examples

Reference only - don't edit

### `docker-compose.yml`

Use this when:

- Production deployment
- Docker Swarm/orchestration
- Understanding production setup

Run with:

```bash
docker-compose up -d
```

### `docker-compose.dev.yml`

Use this when:

- Local development with Docker
- Hot reload is needed
- Testing Docker setup

Run with:

```bash
docker-compose -f docker-compose.dev.yml up
```

## 🎯 Common Workflows

### Setup for First Time

1. Read: `DOCKER_ENV_SETUP_COMPLETE.md`
2. Copy: `cp .envs/.env.development .env.local`
3. Start: `docker-compose -f docker-compose.dev.yml up`
4. Initialize: `pnpm db:push && pnpm db:seed`

### Add New Environment Variable

1. Update: `.env.example` (add description)
2. Update: `.envs/.env.development` (add default)
3. Update: `.envs/.env.production` (add placeholder)
4. Update: `.env.local` (add your value)
5. Update: Code to use new variable

### Deploy to Production

1. Copy: `cp .envs/.env.production .env`
2. Edit: `.env` with real credentials
3. Push: To deployment platform via secrets
4. Deploy: `docker-compose up -d`

### Change Database Connection

1. Edit: `.env.local`
2. Update: `DATABASE_URL`
3. Restart: `docker-compose down && docker-compose up`

## 🔗 Related Files

### Application Configuration

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `drizzle.config.ts` - Database ORM configuration
- `prettier.config.ts` - Code formatting
- `eslint.config.ts` - Code linting

### Deployment Configuration

- `.github/workflows/ci.yml` - CI/CD pipeline
- `Dockerfile` - App container
- `docker-compose.yml` - Production services
- `docker-compose.dev.yml` - Dev services

### Development Configuration

- `.husky/` - Git hooks
- `.prettierignore` - Prettier excludes
- `.dockerignore` - Docker build excludes
- `.gitignore` - Git excludes (includes .env.local)

## 📝 Documentation Map

```
Setup & Configuration:
├── DOCKER_ENV_SETUP_COMPLETE.md    ← START HERE (Summary)
├── DOCKER_ENV_SETUP.md             ← Complete guide
├── .envs/README.md                 ← Environment variables
├── compose/README.md               ← Docker details
└── SETUP.md                        ← General project setup

Reference:
├── .env.example                    ← All variables
├── docker-compose.yml              ← Production config
└── docker-compose.dev.yml          ← Dev config
```

## ✅ Configuration Checklist

### Development Setup

- [ ] Copy `.envs/.env.development` to `.env.local`
- [ ] Edit `.env.local` with your values (optional - defaults work)
- [ ] Run `docker-compose -f docker-compose.dev.yml up`
- [ ] Verify all services healthy: `docker-compose ps`
- [ ] Run migrations: `pnpm db:push`
- [ ] Access app: http://localhost:3000

### Production Setup

- [ ] Copy `.envs/.env.production` to production platform
- [ ] Update all required variables (see comments in .env.production)
- [ ] Set strong AUTH_SECRET
- [ ] Configure email service
- [ ] Configure OAuth (Google, GitHub)
- [ ] Set image upload provider
- [ ] Test all features
- [ ] Enable monitoring/logging

## 🆘 Quick Reference

| Need             | File                   | Section                         |
| ---------------- | ---------------------- | ------------------------------- |
| Setup guide      | DOCKER_ENV_SETUP.md    | Quick Start                     |
| Variable help    | .envs/README.md        | Environment Variables Reference |
| Docker commands  | compose/README.md      | Docker Compose Commands         |
| Troubleshoot     | DOCKER_ENV_SETUP.md    | Troubleshooting                 |
| Environment vars | .env.example           | All variables                   |
| Dev config       | .envs/.env.development | Complete dev setup              |
| Prod config      | .envs/.env.production  | Complete prod setup             |

---

**Last Updated:** December 15, 2024  
**Version:** 1.0  
**Status:** ✅ Complete
