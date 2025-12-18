# Environment & Docker Setup Guide

Complete guide for setting up ComicWise with environment files and Docker.

## 🚀 Quick Start (5 minutes)

### Option 1: Local Development (No Docker)

```bash
# 1. Setup environment
cp .envs/.env.development .env.local

# 2. Install dependencies
pnpm install

# 3. Setup database (requires PostgreSQL running locally)
pnpm db:push
pnpm db:seed

# 4. Start dev server
pnpm dev
```

Open http://localhost:3000

### Option 2: Docker Development (Recommended)

```bash
# 1. Setup environment
cp .envs/.env.development .env.local

# 2. Start all services
docker-compose -f docker-compose.dev.yml up

# 3. In another terminal, run migrations
docker-compose -f docker-compose.dev.yml exec app pnpm db:push

# 4. Seed database
docker-compose -f docker-compose.dev.yml exec app pnpm db:seed
```

Access:

- App: http://localhost:3000
- PgAdmin: http://localhost:5051
- Database: localhost:5433 (dev:dev123)

## 📁 Environment Files Structure

```
.envs/
├── .env.development    # Development configuration template
├── .env.production     # Production configuration template
└── README.md          # Detailed environment variable reference

.env.local            # Your local config (NOT committed to git)
.env.example          # All available variables with descriptions
```

### Setup Flow

1. **Copy template** to `.env.local`:

   ```bash
   cp .envs/.env.development .env.local  # For development
   cp .envs/.env.production .env.local    # For production
   ```

2. **Customize** `.env.local` with your values:
   - Database credentials
   - Auth secrets
   - API keys
   - Email configuration

3. **Never commit** `.env.local` to git (it's in `.gitignore`)

## 🐳 Docker Services

### Available Services

| Service     | Port (Dev) | Port (Prod) | Purpose          |
| ----------- | ---------- | ----------- | ---------------- |
| PostgreSQL  | 5433       | 5432        | Main database    |
| Redis       | 6380       | 6379        | Caching/sessions |
| PgAdmin     | 5051       | 5050        | DB management UI |
| Next.js App | 3000       | 3000        | Application      |

### Start Services

```bash
# Development (with hot reload)
docker-compose -f docker-compose.dev.yml up

# Production (optimized)
docker-compose up

# Detached (background)
docker-compose -f docker-compose.dev.yml up -d

# With rebuild
docker-compose -f docker-compose.dev.yml up --build
```

### Stop Services

```bash
# Stop but keep data
docker-compose -f docker-compose.dev.yml down

# Stop and remove all data (WARNING!)
docker-compose -f docker-compose.dev.yml down -v
```

### View Logs

```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f app
docker-compose -f docker-compose.dev.yml logs -f postgres
```

## 📋 Required Environment Variables

| Variable              | Example                 | Required | Notes                 |
| --------------------- | ----------------------- | -------- | --------------------- |
| `NODE_ENV`            | `development`           | ✓        | App mode              |
| `DATABASE_URL`        | `postgresql://...`      | ✓        | PostgreSQL connection |
| `AUTH_SECRET`         | (32+ chars)             | ✓        | NextAuth secret       |
| `AUTH_URL`            | `http://localhost:3000` | ✓        | Auth callback URL     |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | ✓        | Public app URL        |
| `UPLOAD_PROVIDER`     | `local`                 | ✓        | File upload service   |

## 🔧 Database Setup

### Initialize Database

```bash
# Apply migrations
pnpm db:push

# OR with Docker
docker-compose -f docker-compose.dev.yml exec app pnpm db:push
```

### Seed Database

```bash
# Seed with sample data
pnpm db:seed

# OR with Docker
docker-compose -f docker-compose.dev.yml exec app pnpm db:seed

# Dry run (show SQL without executing)
pnpm db:seed -- --dry-run
```

### Access PostgreSQL CLI

```bash
# Development (Docker)
docker-compose -f docker-compose.dev.yml exec postgres psql -U dev -d comicwise_dev

# Local
psql postgresql://postgres:postgres@localhost:5432/comicwise_dev
```

### Backup & Restore

```bash
# Backup
docker-compose -f docker-compose.dev.yml exec postgres pg_dump \
  -U dev comicwise_dev > backup.sql

# Restore
docker-compose -f docker-compose.dev.yml exec -T postgres psql \
  -U dev comicwise_dev < backup.sql
```

## 🎯 PgAdmin Access

**Development:**

- URL: http://localhost:5051
- Email: admin@example.com
- Password: admin

**Production:**

- URL: http://localhost:5050
- Email: Check `PGADMIN_DEFAULT_EMAIL` in .env
- Password: Check `PGADMIN_DEFAULT_PASSWORD` in .env

### Add PostgreSQL Server in PgAdmin

1. Open http://localhost:5051
2. Right-click "Servers" → "Register" → "Server"
3. Fill in:
   - **Name:** ComicWise PostgreSQL
   - **Host:** postgres (or localhost)
   - **Port:** 5432
   - **Database:** comicwise_dev
   - **Username:** dev
   - **Password:** dev123
4. Click Save

## 🔐 Generate Secrets

### AUTH_SECRET (32+ characters)

**Linux/Mac:**

```bash
openssl rand -base64 32
```

**Windows PowerShell:**

```powershell
$bytes = 1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }
[Convert]::ToBase64String($bytes)
```

## 📧 Email Configuration

### Local Development (MailHog)

```bash
# Start MailHog
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

Environment variables:

```env
EMAIL_SERVER_HOST=localhost
EMAIL_SERVER_PORT=1025
EMAIL_FROM=noreply@comicwise.local
EMAIL_SECURE=false
```

Access web UI: http://localhost:8025

### Production (SendGrid)

```env
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=YOUR_SENDGRID_API_KEY
EMAIL_FROM=noreply@comicwise.com
EMAIL_SECURE=true
```

## 🎨 Image Upload Providers

### Local (Development)

```env
UPLOAD_PROVIDER=local
# Files stored in public/uploads/
```

### ImageKit (Recommended)

```env
UPLOAD_PROVIDER=imagekit
IMAGEKIT_PUBLIC_KEY=your-key
IMAGEKIT_PRIVATE_KEY=your-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
```

### Cloudinary

```env
UPLOAD_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

## 🔗 OAuth Setup (Optional)

### Google OAuth

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy credentials to `.env.local`:

```env
AUTH_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
AUTH_GOOGLE_CLIENT_SECRET=your-client-secret
```

### GitHub OAuth

1. Go to https://github.com/settings/developers
2. Create a new OAuth App
3. Add Authorization callback URL:
   `http://localhost:3000/api/auth/callback/github`
4. Copy credentials to `.env.local`:

```env
AUTH_GITHUB_CLIENT_ID=your-client-id
AUTH_GITHUB_CLIENT_SECRET=your-client-secret
```

## 🐛 Troubleshooting

### "Cannot connect to PostgreSQL"

```bash
# Check if postgres is running
docker-compose -f docker-compose.dev.yml ps

# Check logs
docker-compose -f docker-compose.dev.yml logs postgres

# Test connection manually
docker-compose -f docker-compose.dev.yml exec postgres psql -U dev -c "SELECT 1"
```

### "Port already in use"

```bash
# Change port in .env.local
POSTGRES_PORT=5434
REDIS_PORT=6380
APP_PORT=3001

# Or stop the conflicting service
docker-compose -f docker-compose.dev.yml down
```

### "Redis connection refused"

```bash
# Check if redis is running
docker-compose -f docker-compose.dev.yml exec redis redis-cli ping

# Expected response: PONG
```

### "Docker Compose not found"

- Update Docker Desktop (includes Docker Compose)
- Or install standalone: https://docs.docker.com/compose/install/

### ".env.local not recognized"

```bash
# Make sure .env.local is in project root
ls -la .env.local

# Clear Next.js cache
rm -rf .next
pnpm dev
```

## 📚 Related Documentation

- [.envs/README.md](.envs/README.md) - Detailed environment variables reference
- [compose/README.md](compose/README.md) - Docker Compose detailed guide
- [.env.example](.env.example) - All available variables
- [package.json](package.json) - Available pnpm scripts

## ✅ Development Checklist

- [ ] Clone repository
- [ ] Copy `.envs/.env.development` to `.env.local`
- [ ] Update `.env.local` with your settings
- [ ] Start Docker: `docker-compose -f docker-compose.dev.yml up`
- [ ] Run migrations: `pnpm db:push`
- [ ] Seed database: `pnpm db:seed`
- [ ] Open http://localhost:3000
- [ ] Test login functionality
- [ ] Access PgAdmin: http://localhost:5051

## 📦 Production Deployment

See [.envs/.env.production](.envs/.env.production) for production configuration.

### Deployment checklist:

- [ ] Use `.envs/.env.production` as template
- [ ] Set all required environment variables
- [ ] Use strong passwords and secrets
- [ ] Enable SSL/TLS for database
- [ ] Configure production email service
- [ ] Set up OAuth credentials
- [ ] Configure CDN for images
- [ ] Run security audit: `npm audit`
- [ ] Test all features
- [ ] Set up monitoring and logging

## 🆘 Getting Help

1. Check logs: `docker-compose logs -f`
2. Review [.envs/README.md](.envs/README.md)
3. Check [compose/README.md](compose/README.md)
4. See [SETUP.md](SETUP.md) for general setup

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
