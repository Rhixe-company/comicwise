# ComicWise - Complete Setup & Scaffolding Guide

> **GitHub Copilot CLI Prompt for Complete Project Setup**
> 
> This comprehensive prompt will guide you through setting up the entire ComicWise platform from scratch, including all necessary configurations, database setup, authentication, and deployment.

---

## 🎯 Project Overview

**ComicWise** is a modern, full-stack comic reading platform built with:

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui, Radix UI
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL 17 with Drizzle ORM
- **Authentication**: NextAuth.js v5 (Beta)
- **Caching**: Redis (Upstash), React Query
- **Queue**: BullMQ with Redis
- **Email**: React Email, Nodemailer
- **Image Upload**: ImageKit, Cloudinary, AWS S3
- **Testing**: Playwright (E2E), Vitest (Unit)
- **Deployment**: Docker, Vercel

---

## 📋 Prerequisites

Before starting, ensure you have:

```bash
# Required
- Node.js 22+ (with Corepack enabled)
- pnpm 9+ (via `corepack enable`)
- PostgreSQL 17+ (local or Docker)
- Git

# Optional but Recommended
- Docker & Docker Compose
- Redis (or use Upstash)
- ImageKit/Cloudinary account
- Google OAuth credentials
- GitHub OAuth credentials
```

---

## 🚀 Complete Setup Workflow

### Step 1: Installation

```bash
git clone <repository-url>
cd comicwise
corepack enable
pnpm install
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Step 2: Database Setup

```bash
# Start PostgreSQL (Docker)
docker-compose -f docker-compose.dev.yml up -d postgres

# Push schema
pnpm db:push

# Seed database
pnpm db:seed
```

### Step 3: Development

```bash
# Start development server
pnpm dev

# Visit http://localhost:3000
```

---

## 📚 Full Documentation

See main documentation sections for detailed guides on:
- Environment Configuration
- Database Operations
- Authentication Setup
- Image Upload
- Testing
- Deployment
- And more...

---

**Built with ❤️ by the ComicWise Team**
