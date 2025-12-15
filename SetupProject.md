# ComicWise - Complete Setup Guide

**Next.js 16.0.7 + React 19 + PostgreSQL + Drizzle ORM**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Development Workflow](#development-workflow)
6. [Docker Setup](#docker-setup)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Software

- **Node.js**: v20.x or higher ([Download](https://nodejs.org/))
- **pnpm**: v9.x or higher
  ```bash
  npm install -g pnpm
  ```
- **PostgreSQL**: v15.x or higher
  ([Download](https://www.postgresql.org/download/))
- **Git**: Latest version ([Download](https://git-scm.com/))

### Optional (for Docker setup)

- **Docker**: Latest version ([Download](https://www.docker.com/))
- **Docker Compose**: v2.x or higher (included with Docker Desktop)

### Code Editor

- **VS Code**: Recommended with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Drizzle ORM
  - Playwright Test

---

## 🚀 Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/alexanderrhixe-debug/ComicWise.git
cd ComicWise
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all required dependencies including:

- Next.js 16.0.7
- React 19
- Drizzle ORM
- NextAuth v5
- shadcn/ui components
- And many more...

---

## 🔐 Environment Configuration

### 1. Create Environment File

```bash
cp .env.example .env.local
```

### 2. Configure Required Variables

#### Database (Required)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/comicwise"
```

**For Local PostgreSQL:**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/comicwise"
```

**For Neon (Cloud):**

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/comicwise?sslmode=require"
NEON_DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/comicwise?sslmode=require"
```

#### Authentication (Required)

```env
NEXTAUTH_SECRET="your-super-secret-key-min-32-characters"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate NEXTAUTH_SECRET:**

```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows (PowerShell)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### Image Upload Service (Choose One)

**Option 1: ImageKit (Recommended)**

```env
UPLOAD_PROVIDER="imagekit"
IMAGEKIT_PUBLIC_KEY="public_xxx"
IMAGEKIT_PRIVATE_KEY="private_xxx"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_imagekit_id"
```

**Option 2: Cloudinary**

```env
UPLOAD_PROVIDER="cloudinary"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="your_api_secret"
```

**Option 3: Local Storage**

```env
UPLOAD_PROVIDER="local"
```

#### Email Configuration (Required for Auth)

**Gmail:**

```env
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@comicwise.com"
```

**Other Providers:**

```env
# Outlook
EMAIL_SERVER_HOST="smtp-mail.outlook.com"
EMAIL_SERVER_PORT="587"

# SendGrid
EMAIL_SERVER_HOST="smtp.sendgrid.net"
EMAIL_SERVER_PORT="587"
```

#### Redis (Optional - for caching & rate limiting)

```env
# Local Redis
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""

# Upstash Redis (Serverless)
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_token"
```

#### OAuth Providers (Optional)

**Google OAuth:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add to `.env.local`:

```env
GOOGLE_CLIENT_ID="123456789012-xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"
```

**GitHub OAuth:**

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create OAuth App
3. Add to `.env.local`:

```env
GITHUB_CLIENT_ID="Iv1.xxx"
GITHUB_CLIENT_SECRET="xxx"
```

### 3. Application Configuration

```env
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🗄️ Database Setup

### Option 1: Local PostgreSQL

#### Install PostgreSQL

**macOS (Homebrew):**

```bash
brew install postgresql@15
brew services start postgresql@15
```

**Windows:** Download and install from
[postgresql.org](https://www.postgresql.org/download/windows/)

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE comicwise;

# Create user (optional)
CREATE USER comicwise_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE comicwise TO comicwise_user;

# Exit
\q
```

#### Update .env.local

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/comicwise"
# OR with custom user
DATABASE_URL="postgresql://comicwise_user:your_password@localhost:5432/comicwise"
```

### Option 2: Neon (Serverless PostgreSQL)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `.env.local`:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/comicwise?sslmode=require"
```

### Initialize Database

#### Push Schema to Database

```bash
pnpm db:push
```

This will:

- Create all tables defined in `src/db/schema/index.ts`
- Set up indexes
- Apply constraints

#### Seed Database with Sample Data

```bash
# Full seed (all data)
pnpm db:seed

# Seed only users
pnpm db:seed:users

# Seed only comics
pnpm db:seed:comics

# Seed only chapters
pnpm db:seed:chapters

# Dry run (preview without executing)
pnpm db:seed:dry-run

# Verbose output
pnpm db:seed:verbose
```

#### Database Management Commands

```bash
# Generate migration
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Open Drizzle Studio (GUI)
pnpm db:studio

# Reset database (⚠️ Deletes all data)
pnpm db:reset
```

---

## 💻 Development Workflow

### Start Development Server

```bash
# Standard development mode
pnpm dev

# With debug mode
pnpm dev:debug

# With HTTPS (for testing OAuth)
pnpm dev:https
```

Visit: `http://localhost:3000`

### Code Quality

#### Linting

```bash
# Check for errors
pnpm lint

# Auto-fix errors
pnpm lint:fix

# Strict mode (no warnings)
pnpm lint:strict
```

#### Formatting

```bash
# Format all files
pnpm format

# Check formatting
pnpm format:check
```

#### Type Checking

```bash
# Type check
pnpm type-check

# Watch mode
pnpm type-check:watch
```

#### Validate Everything

```bash
# Run all checks (type-check + lint + format)
pnpm validate
```

### Testing

#### E2E Tests (Playwright)

```bash
# Run all tests
pnpm test

# UI mode
pnpm test:ui

# Specific browser
pnpm test:chromium
pnpm test:firefox
pnpm test:webkit

# Debug mode
pnpm test:debug

# Update snapshots
pnpm test:update-snapshots
```

#### Unit Tests (Vitest)

```bash
# Run unit tests
pnpm test:unit

# Watch mode
pnpm test:unit:watch

# Coverage
pnpm test:unit:coverage

# UI mode
pnpm test:unit:ui
```

### Build

#### Development Build

```bash
pnpm build
```

#### Production Build

```bash
NODE_ENV=production pnpm build
```

#### Analyze Bundle

```bash
pnpm build:analyze
```

#### Start Production Server

```bash
pnpm start
# OR
pnpm start:prod
```

---

## 🐳 Docker Setup

### Quick Start with Docker

#### Development Mode

```bash
# Start all services
pnpm docker:dev

# Or manually
docker-compose -f docker-compose.dev.yml up
```

This starts:

- Next.js development server
- PostgreSQL database
- Redis cache
- Adminer (database UI)

Access:

- **App**: http://localhost:3000
- **Adminer**: http://localhost:8080
- **Redis**: localhost:6379

#### Production Mode

```bash
# Build and start
pnpm docker:prod

# Or manually
docker-compose up --build
```

### Docker Commands

```bash
# Build images
pnpm docker:build

# Start services
pnpm docker:up

# Stop services
pnpm docker:down

# View logs
pnpm docker:logs

# Restart services
pnpm docker:restart

# Clean up (⚠️ removes volumes)
pnpm docker:clean

# Prune system
pnpm docker:prune
```

### Docker Compose Services

**docker-compose.dev.yml:**

- `app`: Next.js development server
- `postgres`: PostgreSQL 15
- `redis`: Redis 7
- `adminer`: Database management UI

**docker-compose.yml (Production):**

- `app`: Next.js production build
- `postgres`: PostgreSQL with persistence
- `redis`: Redis with persistence
- `nginx`: Reverse proxy (if configured)

---

## 🚀 Deployment

### Vercel (Recommended)

#### Prerequisites

- Vercel account
- GitHub repository connected

#### Steps

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Environment Variables** Add all variables from `.env.local` to Vercel:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your Vercel URL)
   - Image upload credentials
   - Email credentials
   - etc.

4. **Deploy Commands**

   ```bash
   # Deploy to production
   pnpm deploy:vercel

   # Deploy preview
   pnpm deploy:preview
   ```

### Docker Deployment

#### Build Production Image

```bash
docker build -t comicwise:latest -f compose/Dockerfile .
```

#### Run Container

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  -e NEXTAUTH_SECRET="your_secret" \
  comicwise:latest
```

#### Docker Compose Deployment

```bash
# Update docker-compose.yml with production values
# Then deploy
docker-compose -f docker-compose.yml up -d
```

### Self-Hosted (VPS/Server)

#### Prerequisites

- Linux server (Ubuntu 22.04 recommended)
- Node.js 20+
- PostgreSQL 15+
- Nginx (for reverse proxy)
- PM2 (for process management)

#### Setup Steps

```bash
# Clone repository
git clone https://github.com/yourusername/comicwise.git
cd comicwise

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
nano .env.local  # Edit variables

# Build
pnpm build

# Start with PM2
pm2 start npm --name "comicwise" -- start
pm2 save
pm2 startup
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Error

```
Error: getaddrinfo ENOTFOUND
```

**Solution:**

- Check `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Verify credentials

#### NextAuth Configuration Error

```
Error: NEXTAUTH_SECRET is required
```

**Solution:**

```bash
# Generate new secret
openssl rand -base64 32

# Add to .env.local
NEXTAUTH_SECRET="generated_secret_here"
```

#### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

```bash
# Find process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

#### Module Not Found

```
Error: Cannot find module 'xyz'
```

**Solution:**

```bash
# Clear cache and reinstall
pnpm clean
rm -rf node_modules
pnpm install
```

#### Build Errors

```bash
# Clear Next.js cache
pnpm clean

# Rebuild
pnpm build
```

#### TypeScript Errors

```bash
# Regenerate types
pnpm db:generate

# Check types
pnpm type-check
```

### Getting Help

- 📖 **Documentation**: Check `README.md` and `docs/` folder
- 🐛 **Issues**:
  [GitHub Issues](https://github.com/alexanderrhixe-debug/ComicWise/issues)
- 💬 **Discussions**:
  [GitHub Discussions](https://github.com/alexanderrhixe-debug/ComicWise/discussions)

---

## 📚 Additional Resources

### Project Structure

```
comicwise/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/             # Utilities & helpers
│   ├── db/              # Database (Drizzle ORM)
│   ├── types/           # TypeScript types
│   ├── app-config/      # Configuration
│   └── styles/          # Global styles
├── public/              # Static assets
├── docs/                # Documentation
├── tests/               # Test files
└── compose/             # Docker files
```

### Key Files

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.ts` - ESLint configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `drizzle.config.ts` - Drizzle ORM configuration
- `playwright.config.ts` - Playwright test configuration

### Scripts Reference

See `package.json` for all available scripts

### Technology Stack

- **Framework**: Next.js 16.0.7
- **UI**: React 19, shadcn/ui, Tailwind CSS 4
- **Database**: PostgreSQL, Drizzle ORM
- **Auth**: NextAuth v5
- **Testing**: Playwright, Vitest
- **Deployment**: Vercel, Docker

---

## ✅ Setup Checklist

- [ ] Install prerequisites (Node.js, pnpm, PostgreSQL)
- [ ] Clone repository
- [ ] Install dependencies (`pnpm install`)
- [ ] Create `.env.local` from `.env.example`
- [ ] Configure database URL
- [ ] Generate NextAuth secret
- [ ] Setup image upload service
- [ ] Configure email service
- [ ] Push database schema (`pnpm db:push`)
- [ ] Seed database (`pnpm db:seed`)
- [ ] Start development server (`pnpm dev`)
- [ ] Verify app at http://localhost:3000
- [ ] Run tests (`pnpm test`)
- [ ] Build for production (`pnpm build`)

---

**Setup Complete! 🎉**

For questions or issues, please refer to the troubleshooting section or create
an issue on GitHub.
