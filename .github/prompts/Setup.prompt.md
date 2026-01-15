---
title: ComicWise - Complete Project Setup & Scaffolding Guide (v3.0.0)
version: 3.0.0
updated: 2026-01-15
platforms: Windows, Linux, macOS
packageManager: pnpm
framework: Next.js 16
database: PostgreSQL
caching: Redis
auth: NextAuth v5
runtime: Node.js 20+
---

# 🚀 ComicWise - Complete Project Setup & Scaffolding Guide

> **Comprehensive setup guide for ComicWise - a modern web comic platform built with Next.js 16, PostgreSQL, Redis, and AI-powered features.**

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Prerequisites & System Requirements](#prerequisites)
4. [Environment Setup](#environment-setup)
5. [Database Configuration](#database-configuration)
6. [Seeding System](#seeding-system)
7. [Development Workflow](#development-workflow)
8. [Testing & Validation](#testing--validation)
9. [Build & Deployment](#build--deployment)
10. [Common Tasks & Commands](#common-tasks--commands)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)
13. [Security Considerations](#security-considerations)

---

## 🎯 Project Overview

**ComicWise** is a full-featured web comic platform that combines modern web technologies with best practices in software engineering.

### Key Features
- ✅ Authentication with NextAuth v5 (Credentials, Google OAuth, GitHub OAuth)
- ✅ PostgreSQL database with Drizzle ORM for type-safe queries
- ✅ Redis caching layer for performance optimization
- ✅ Multi-provider image hosting (ImageKit, Cloudinary, AWS S3, Local)
- ✅ Comprehensive seeding system with image optimization
- ✅ Real-time features with WebSocket support
- ✅ Rate limiting and security features
- ✅ Admin dashboard for content management

---

## 🛠️ Technology Stack

### Core Framework
- **Next.js 16**: React framework with App Router
- **React 19.2.3**: UI library
- **TypeScript 5**: Type-safe JavaScript

### Database & ORM
- **PostgreSQL 12+**: Primary relational database
- **Drizzle ORM 0.45+**: Type-safe SQL query builder
- **Neon (Optional)**: Serverless PostgreSQL alternative

### Authentication & Security
- **NextAuth v5**: Modern authentication framework
- **bcryptjs**: Password hashing
- **JWT**: Token-based authentication
- **@simplewebauthn/server**: WebAuthn support

### Caching & Background Jobs
- **Redis / ioredis**: In-memory caching
- **Upstash Redis**: Serverless Redis alternative
- **BullMQ**: Queue system for background jobs
- **@upstash/qstash**: Serverless background jobs

### Image & File Management
- **Sharp**: Image optimization
- **ImageKit**: CDN and image optimization
- **Cloudinary**: Cloud-based image hosting
- **AWS SDK**: S3 integration

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework
- **Shadcn/ui**: High-quality React components
- **Radix UI**: Unstyled, accessible components
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

### Data Validation
- **Zod 4.2.1**: TypeScript-first schema validation
- **react-hook-form**: Efficient form management
- **drizzle-zod**: Schema generation from Drizzle

### Utilities
- **Slugify**: URL-safe slug generation
- **date-fns**: Date manipulation
- **Papaparse**: CSV parsing
- **Commander**: CLI applications
- **Chalk**: Terminal colors
- **Pino**: Structured logging

### Development Tools
- **Playwright**: End-to-end testing
- **Vitest**: Unit testing framework
- **ESLint 9**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Drizzle Kit**: ORM utilities

---

## 📋 Prerequisites & System Requirements

### Minimum Requirements
- **Node.js**: 20.0.0 or higher
- **pnpm**: 8.0.0 or higher
- **PostgreSQL**: 12.0 or higher
- **Redis**: 6.0 or higher (optional, for development)

### Recommended Setup
- **OS**: Windows 11, macOS 13+, or Ubuntu 22.04+
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 5GB free space for node_modules and database

### Tools to Install
```bash
# Windows (using winget or chocolatey)
winget install nodejs.nodejs
winget install pnpm
winget install PostgreSQL
winget install Redis

# macOS (using Homebrew)
brew install node
brew install pnpm
brew install postgresql
brew install redis

# Linux (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install nodejs npm postgresql postgresql-contrib redis-server
npm install -g pnpm
```

---

## 🔧 Environment Setup

### Step 1: Clone and Navigate
```bash
cd path/to/comicwise
```

### Step 2: Install Dependencies
```bash
pnpm install
```

### Step 3: Configure Environment Variables
Copy and configure `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/comicwise"

# Authentication
AUTH_SECRET="$(openssl rand -base64 32)"
AUTH_URL="http://localhost:3000/api/auth"

# Upload Provider (local|imagekit|cloudinary|aws)
UPLOAD_PROVIDER="local"

# Email (Optional)
EMAIL_FROM="noreply@comicwise.com"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"

# Redis (Optional)
REDIS_URL="redis://localhost:6379/0"

# Application
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 4: Validate Configuration
```bash
pnpm type-check
```

---

## 🗄️ Database Configuration

### Create Database
```bash
# Using psql
psql -U postgres
CREATE DATABASE comicwise;
\q

# Or using createdb command
createdb -U postgres comicwise
```

### Push Schema
```bash
# Generate migrations
pnpm db:generate

# Apply migrations
pnpm db:push

# View Drizzle Studio
pnpm db:studio
```

### Database Reset (Careful!)
```bash
# Drop and recreate schema
pnpm db:reset

# Full reset with seed data
pnpm db:reset:hard
```

---

## 🌱 Seeding System

### Seeding Architecture
The seeding system is built with:
- **Zod schemas** for data validation
- **Image caching** to prevent duplicate downloads
- **Batch processing** for performance
- **Upsert logic** for idempotent operations
- **Multi-source loading** from JSON files

### Data Sources
- `users.json` - User accounts
- `comics.json` - Comic metadata
- `comicsdata1.json`, `comicsdata2.json` - Extended comic data
- `chapters.json` - Chapter listings
- `chaptersdata1.json`, `chaptersdata2.json` - Extended chapter data

### Seeding Commands
```bash
# Dry run (validate without persisting)
pnpm db:seed:dry-run

# Full seed
pnpm db:seed

# Seed specific data
pnpm db:seed:users
pnpm db:seed:comics
pnpm db:seed:chapters

# Verbose output
pnpm db:seed:verbose
```

### Image Handling
- Images cached in: `/public/uploads`
- Default comic image: `/public/placeholder-comic.jpg`
- Default user image: `/public/shadcn.jpg`
- Supported providers: local, ImageKit, Cloudinary, AWS S3

---

## 💻 Development Workflow

### Start Development Server
```bash
# Clear cache and start
pnpm dev

# With HTTPS
pnpm dev:https

# Debug mode
pnpm dev:debug
```

### Code Quality
```bash
# Type checking
pnpm type-check

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format
pnpm format:check

# All validation
pnpm validate
```

### Database Development
```bash
# View data in studio
pnpm db:studio

# Check database health
pnpm health:db

# Clear cache
pnpm cache:clear

# Cache statistics
pnpm cache:stats
```

---

## 🧪 Testing & Validation

### Unit Tests
```bash
# Run all tests
pnpm test:unit

# Watch mode
pnpm test:unit:watch

# Coverage report
pnpm test:unit:coverage
```

### E2E Tests
```bash
# Run all Playwright tests
pnpm test

# Debug mode
pnpm test:debug

# UI mode
pnpm test:ui

# View report
pnpm test:report
```

### Validation
```bash
# Full validation (types + lint + format check)
pnpm validate

# Quick validation (types + lint)
pnpm validate:quick
```

---

## 🏗️ Build & Deployment

### Build for Production
```bash
# Standard build
pnpm build

# Analyze bundle
pnpm build:analyze

# Debug build
pnpm build:debug

# Standalone build (for Docker)
pnpm build:standalone
```

### Production Server
```bash
# Start production server
pnpm start

# With NODE_ENV=production
pnpm start:prod
```

### Docker
```bash
# Build Docker image
pnpm docker:build

# Start containers
pnpm docker:up

# View logs
pnpm docker:logs

# Stop containers
pnpm docker:down

# Clean up
pnpm docker:clean
```

### Deployment Platforms

#### Vercel
```bash
# Preview deployment
pnpm deploy:preview

# Production deployment
pnpm deploy:vercel
```

#### Docker Compose
```bash
# Production: docker-compose.yml
docker-compose up -d

# Development: docker-compose.dev.yml
docker-compose -f docker-compose.dev.yml up -d
```

---

## 📝 Common Tasks & Commands

### Project Cleanup
```bash
# Clean build artifacts
pnpm clean

# Clean all (including node_modules)
pnpm clean:all

# Run cleanup script
pnpm cleanup

# Dry run
pnpm cleanup:dry-run
```

### Project Optimization
```bash
# Comprehensive optimization
pnpm optimize:all

# Fix camelCase naming
pnpm optimize:camelcase

# Update any types
pnpm optimize:types

# Optimize imports
pnpm imports:optimize

# Check imports
pnpm imports:check
```

### Health Checks
```bash
# Check database
pnpm health:db

# Check Redis
pnpm health:redis

# Full health check
pnpm health:all
```

### Queue Management
```bash
# View queue stats
pnpm queue:stats

# Clean queue
pnpm queue:clean

# Run queue worker
pnpm queue:worker
```

### Image Upload
```bash
# Bulk upload (local)
pnpm upload:bulk

# Upload to ImageKit
pnpm upload:bulk:imagekit

# Upload to Cloudinary
pnpm upload:bulk:cloudinary

# Upload to AWS S3
pnpm upload:bulk:aws

# Dry run
pnpm upload:bulk:dry-run
```

### Code Scaffolding
```bash
# Scaffold new component
pnpm scaffold:component --name=MyComponent

# Scaffold new hook
pnpm scaffold:hook --name=useMyHook

# Scaffold new action
pnpm scaffold:action --name=myAction
```

---

## 🔍 Troubleshooting

### Database Connection Issues
```bash
# Check database
pnpm health:db

# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection manually
psql -c "SELECT 1" $DATABASE_URL
```

### Redis Connection Issues
```bash
# Check Redis
pnpm health:redis

# Test Redis connection
redis-cli ping

# If using Upstash
curl $UPSTASH_REDIS_REST_URL/ping
```

### Seed Errors
```bash
# Dry run to see errors
pnpm db:seed:dry-run

# Verbose output
pnpm db:seed:verbose

# Check logs
tail -f seed_output.log
```

### Build Errors
```bash
# Clear Next.js cache
pnpm clean:cache

# Rebuild types
pnpm typegen

# Full clean build
pnpm clean:all && pnpm install && pnpm build
```

### Port Already in Use
```bash
# Windows: Find process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

---

## ⚡ Best Practices

### Environment Variables
- Never commit `.env.local` to version control
- Use `.env.example` as template
- Rotate secrets regularly
- Use different credentials for prod/dev

### Database
- Always use migrations for schema changes
- Backup production database regularly
- Test migrations in staging first
- Use transactions for multi-table changes

### Images
- Use local provider for development
- Implement image optimization before upload
- Use CDN for production
- Cache image metadata

### Code Quality
- Run validation before committing
- Use pre-commit hooks (Husky)
- Write tests for critical features
- Document complex logic

### Performance
- Enable caching layer (Redis)
- Optimize database queries
- Use pagination for large datasets
- Implement rate limiting

### Security
- Validate all user input
- Use parameterized queries (Drizzle)
- Hash passwords (bcryptjs)
- Enable CORS properly
- Use HTTPS in production
- Implement rate limiting
- Regular security audits

---

## 🔐 Security Considerations

### Environment Security
```bash
# Generate secure AUTH_SECRET
openssl rand -base64 32

# Use environment variables for secrets
# Never hardcode credentials
```

### Database Security
- Use strong PostgreSQL passwords
- Enable connection encryption (SSL)
- Restrict database access by IP
- Regular backups with encryption
- Test restore procedures

### Authentication
- NextAuth v5 best practices
- Secure session management
- CSRF protection
- Rate limit login attempts
- Implement 2FA for admin accounts

### API Security
- CORS configuration
- Request validation (Zod)
- Rate limiting (Upstash)
- Input sanitization
- Output encoding

### Image Security
- Validate image file types
- Implement file size limits
- Scan for malware
- Use CDN with DDoS protection

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Guide](https://orm.drizzle.team)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [NextAuth.js v5](https://authjs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Testing Library](https://testing-library.com)

---

## 📞 Getting Help

For issues and questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review project documentation in `/docs`
3. Check existing GitHub issues
4. Create new issue with detailed reproduction steps

---

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

**Last Updated**: 2026-01-15
**Version**: 3.0.0
**Maintainers**: ComicWise Team
