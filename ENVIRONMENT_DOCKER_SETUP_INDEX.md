# ComicWise - Complete Environment & Docker Setup ✅

## 📌 Master Index & Quick Navigation

Welcome to ComicWise! This document serves as the master index for all
environment and Docker configuration.

---

## 🚀 **START HERE** - 5 Minute Quick Start

### Step 1: Copy Environment File

```bash
cp .envs/.env.development .env.local
```

### Step 2: Start Docker Services

```bash
docker-compose -f docker-compose.dev.yml up
```

### Step 3: Initialize Database (in another terminal)

```bash
docker-compose -f docker-compose.dev.yml exec app pnpm db:push
docker-compose -f docker-compose.dev.yml exec app pnpm db:seed
```

### Step 4: Access Services

- **App:** http://localhost:3000
- **PgAdmin:** http://localhost:5051 (admin@example.com / admin)
- **Database:** localhost:5433 (dev:dev123)

✅ **Done!** You're ready to develop.

---

## 📚 Documentation by Role

### 👨‍💻 **For Developers (New to Project)**

**Read in this order:**

1. **[DOCKER_ENV_SETUP_COMPLETE.md](DOCKER_ENV_SETUP_COMPLETE.md)** (5 min) -
   Overview & quick start
2. **[DOCKER_ENV_SETUP.md](DOCKER_ENV_SETUP.md)** (10 min) - Complete setup
   guide
3. **[.envs/README.md](.envs/README.md)** (5 min) - Environment variables
   reference

### 🛠️ **For DevOps/Deployment**

**Read in this order:**

1. **[CONFIG_FILE_INDEX.md](CONFIG_FILE_INDEX.md)** (5 min) - File structure &
   hierarchy
2. **[.envs/.env.production](.envs/.env.production)** (5 min) - Production
   template
3. **[compose/README.md](compose/README.md)** (15 min) - Docker detailed guide
4. **[docker-compose.yml](docker-compose.yml)** - Production config

### 🐳 **For Docker Users**

**Read:**

- **[compose/README.md](compose/README.md)** - Complete Docker guide
- **[docker-compose.yml](docker-compose.yml)** &
  **[docker-compose.dev.yml](docker-compose.dev.yml)** - Configs

### 📋 **For Configuration Reference**

**Look up:**

- **[.env.example](.env.example)** - All variables with descriptions
- **[.envs/README.md](.envs/README.md)** - Detailed variable guide
- **[CONFIG_FILE_INDEX.md](CONFIG_FILE_INDEX.md)** - File index

---

## 📁 Complete File Structure

```
comicwise/
│
├─ 📂 .envs/                          # Environment templates
│  ├─ .env.development               # Dev config template
│  ├─ .env.production                # Prod config template
│  └─ README.md                      # Variable guide
│
├─ 📂 compose/                       # Docker scripts
│  ├─ Dockerfile                     # App image
│  ├─ Dockerfile.pgadmin             # PgAdmin image
│  ├─ setup.sh                       # Linux/Mac setup
│  ├─ setup.ps1                      # Windows setup
│  ├─ seed.sh                        # Database seed
│  └─ README.md                      # Docker guide
│
├─ 📄 .env.local                     # Your config (NOT in git)
├─ 📄 .env.example                   # All variables reference
├─ 📄 docker-compose.yml             # Production services
├─ 📄 docker-compose.dev.yml         # Development services
│
├─ 📄 DOCKER_ENV_SETUP_COMPLETE.md   # ⭐ Summary (start here)
├─ 📄 DOCKER_ENV_SETUP.md            # Complete guide
├─ 📄 CONFIG_FILE_INDEX.md           # File index & hierarchy
├─ 📄 SETUP.md                       # General project setup
└─ 📄 README.md                      # Project overview
```

---

## 🔧 Configuration Files Quick Reference

### Environment Files (Templates)

| File                     | Purpose              | Size   | For Who          |
| ------------------------ | -------------------- | ------ | ---------------- |
| `.envs/.env.development` | Dev config template  | 4.6 KB | Developers       |
| `.envs/.env.production`  | Prod config template | 6.0 KB | DevOps           |
| `.env.local`             | Your actual config   | -      | You (NOT in git) |
| `.env.example`           | All variables ref    | -      | Reference        |

### Docker Files

| File                         | Purpose              | Size      |
| ---------------------------- | -------------------- | --------- |
| `docker-compose.yml`         | Production services  | 174 lines |
| `docker-compose.dev.yml`     | Development services | 73 lines  |
| `compose/Dockerfile`         | App container        | -         |
| `compose/Dockerfile.pgadmin` | PgAdmin container    | -         |

### Documentation

| File                           | Purpose        | Size    | Time   |
| ------------------------------ | -------------- | ------- | ------ |
| `DOCKER_ENV_SETUP_COMPLETE.md` | Setup summary  | 6.6 KB  | 5 min  |
| `DOCKER_ENV_SETUP.md`          | Complete guide | 9.7 KB  | 15 min |
| `CONFIG_FILE_INDEX.md`         | File index     | 10.9 KB | 10 min |
| `compose/README.md`            | Docker guide   | 9.2 KB  | 15 min |
| `.envs/README.md`              | Variable guide | 5.9 KB  | 10 min |

---

## 🎯 Common Tasks

### Setup Development Environment

```bash
# 1. Copy dev environment
cp .envs/.env.development .env.local

# 2. Start services (all in Docker)
docker-compose -f docker-compose.dev.yml up

# 3. Run migrations
docker-compose -f docker-compose.dev.yml exec app pnpm db:push

# 4. Seed database
docker-compose -f docker-compose.dev.yml exec app pnpm db:seed
```

### Access PostgreSQL

```bash
# Via Docker
docker-compose -f docker-compose.dev.yml exec postgres psql -U dev -d comicwise_dev

# Via PgAdmin
# Open http://localhost:5051
# Login: admin@example.com / admin
```

### View Service Logs

```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f app
docker-compose -f docker-compose.dev.yml logs -f postgres
```

### Deploy to Production

```bash
# 1. Copy production template
cp .envs/.env.production .env

# 2. Update .env with real credentials

# 3. Start services
docker-compose up -d
```

---

## 🔐 Important Security Notes

### ✅ Always Do This

- Keep `.env.local` in `.gitignore` (don't commit)
- Use strong AUTH_SECRET (32+ characters)
- Change PgAdmin password in production
- Use managed database services (Neon, Upstash)
- Set environment variables securely

### ❌ Never Do This

- Commit `.env.local` to git
- Push secrets in code
- Use default passwords in production
- Store credentials in Docker images
- Expose database to public internet

---

## 📊 Services Available

### Development Setup (docker-compose.dev.yml)

| Service        | Port | Username          | Password | Purpose       |
| -------------- | ---- | ----------------- | -------- | ------------- |
| **PostgreSQL** | 5433 | dev               | dev123   | Database      |
| **Redis**      | 6380 | -                 | -        | Cache         |
| **PgAdmin**    | 5051 | admin@example.com | admin    | DB Management |
| **App**        | 3000 | -                 | -        | Next.js App   |

### Production Setup (docker-compose.yml)

| Service        | Port | Username  | Password  | Purpose       |
| -------------- | ---- | --------- | --------- | ------------- |
| **PostgreSQL** | 5432 | postgres  | postgres  | Database      |
| **Redis**      | 6379 | -         | -         | Cache         |
| **PgAdmin**    | 5050 | (env var) | (env var) | DB Management |
| **App**        | 3000 | -         | -         | Next.js App   |

---

## 🆘 Troubleshooting Quick Links

| Problem                     | Solution                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------- |
| Cannot connect to database  | See [DOCKER_ENV_SETUP.md#troubleshooting](DOCKER_ENV_SETUP.md#troubleshooting)     |
| Port already in use         | See [compose/README.md#port-already-in-use](compose/README.md#port-already-in-use) |
| Docker not found            | See [compose/README.md#troubleshooting](compose/README.md#troubleshooting)         |
| Environment variable issues | See [.envs/README.md#troubleshooting](.envs/README.md#troubleshooting)             |
| PgAdmin cannot connect      | See [DOCKER_ENV_SETUP.md#pgadmin-access](DOCKER_ENV_SETUP.md#pgadmin-access)       |

---

## 📖 Reading Guide by Experience Level

### 🟢 Beginner

1. Read: **DOCKER_ENV_SETUP_COMPLETE.md** (5 min)
2. Do: Copy `.env.local` and start Docker
3. Reference: `.env.example` for variables

### 🟡 Intermediate

1. Read: **DOCKER_ENV_SETUP.md** (15 min)
2. Read: **compose/README.md** (15 min)
3. Understand: Database setup and backups

### 🔴 Advanced

1. Review: **docker-compose.yml** & **docker-compose.dev.yml**
2. Study: **compose/Dockerfile** & **Dockerfile.pgadmin**
3. Reference: `.envs/.env.production` for all options

---

## ✨ What's Included

✅ **Environment Configuration**

- Development template with defaults
- Production template with best practices
- Detailed variable documentation
- Security guidelines

✅ **Docker Infrastructure**

- Multi-stage Dockerfile (optimized)
- PgAdmin for database management
- Health checks on all services
- Docker Compose for dev and prod

✅ **Setup Scripts**

- Bash scripts for Linux/Mac
- PowerShell scripts for Windows
- Database initialization scripts
- Health check scripts

✅ **Documentation**

- 5 comprehensive guides
- Quick start instructions
- Troubleshooting sections
- Security best practices

---

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Specification](https://compose-spec.io/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [NextAuth.js Documentation](https://next-auth.js.org/)

---

## 📞 Need Help?

1. **For setup issues:** Check
   [DOCKER_ENV_SETUP.md](DOCKER_ENV_SETUP.md#troubleshooting)
2. **For Docker issues:** See
   [compose/README.md](compose/README.md#troubleshooting)
3. **For configuration:** Reference [.envs/README.md](.envs/README.md)
4. **For file structure:** View [CONFIG_FILE_INDEX.md](CONFIG_FILE_INDEX.md)
5. **For variables:** Lookup in [.env.example](.env.example)

---

## 🚀 Next Steps

```bash
# 1. Copy environment file
cp .envs/.env.development .env.local

# 2. Start Docker services
docker-compose -f docker-compose.dev.yml up

# 3. Run migrations (in another terminal)
docker-compose -f docker-compose.dev.yml exec app pnpm db:push

# 4. Seed database
docker-compose -f docker-compose.dev.yml exec app pnpm db:seed

# 5. Open http://localhost:3000
```

---

## 📝 File Checklist

Files created:

- ✅ `.envs/.env.development`
- ✅ `.envs/.env.production`
- ✅ `.envs/README.md`
- ✅ `compose/Dockerfile.pgadmin`
- ✅ `compose/pgadmin-setup.sh`
- ✅ `compose/setup.ps1`
- ✅ `compose/README.md`
- ✅ `DOCKER_ENV_SETUP.md`
- ✅ `DOCKER_ENV_SETUP_COMPLETE.md`
- ✅ `CONFIG_FILE_INDEX.md`

Files modified:

- ✅ `docker-compose.yml` (added PgAdmin)
- ✅ `docker-compose.dev.yml` (added PgAdmin)

---

**Status:** ✅ Complete and ready for use  
**Last Updated:** December 15, 2024  
**Version:** 1.0

---

## 🎉 You're All Set!

Everything is configured and ready to go. Start with the Quick Start section
above or read `DOCKER_ENV_SETUP_COMPLETE.md` for a complete overview.

**Happy coding! 🚀**
