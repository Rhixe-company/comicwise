# 🎨 ComicWise

> **A modern, full-stack web comic reading and management platform built with
> Next.js 16, PostgreSQL, and cutting-edge web technologies.**
>
> **Version 2.0.0** | **Last Updated: 2025-12-29** | **Production Ready** ✨

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-0.45.1-green)](https://orm.drizzle.team/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Scripts Reference](#-scripts-reference)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 👥 For Users

- 📚 **Comic Library**: Browse thousands of comics with advanced search and
  filtering
- 🔖 **Bookmarks**: Save your favorite comics and track reading progress
- 📖 **Seamless Reading**: Optimized chapter navigation with image preloading
- 💬 **Comments**: Engage with the community through chapter discussions
- ⭐ **Ratings**: Rate comics and see community ratings
- 🔍 **Full-Text Search**: Find comics, authors, and artists instantly
- 🌓 **Dark Mode**: Comfortable reading in any lighting condition
- 📱 **Responsive Design**: Perfect experience on desktop, tablet, and mobile

### 👨‍💼 For Administrators

- 📊 **Admin Dashboard**: Comprehensive analytics and management interface
- ✏️ **Content Management**: Full CRUD operations for comics, chapters, authors,
  artists
- 👥 **User Management**: Role-based access control (user, admin, moderator)
- 📤 **Bulk Upload**: Efficient batch operations for multiple comics
- 🖼️ **Image Management**: Multi-provider support (ImageKit, Cloudinary, AWS S3,
  Local)
- 📈 **Analytics**: Track views, engagement, and user statistics
- 🔐 **Security**: Rate limiting, input validation, and secure authentication

### ⚡ Technical Highlights

- 🚀 **Next.js 16**: App Router with React Server Components and Turbopack
- 🗄️ **PostgreSQL**: Powerful relational database with full-text search
- 🔄 **Redis Caching**: Lightning-fast response times with intelligent caching
- 🔐 **NextAuth v5**: Secure authentication with OAuth and credentials
- 📦 **Drizzle ORM**: Type-safe database queries with zero runtime overhead
- 🎨 **Tailwind CSS**: Utility-first styling with shadcn/ui components
- 📧 **Email System**: Automated notifications with React Email templates
- 🐳 **Docker Ready**: Containerized deployment for easy scaling
- ✅ **Comprehensive Testing**: Vitest for units, Playwright for E2E
- 🔧 **CI/CD Pipeline**: Automated testing, building, and deployment

---

## 🛠️ Tech Stack

### Core

| Technology                                    | Version | Purpose                           |
| --------------------------------------------- | ------- | --------------------------------- |
| [Next.js](https://nextjs.org/)                | 16.1.1  | React framework with App Router   |
| [React](https://react.dev/)                   | 19.2.3  | UI library with Server Components |
| [TypeScript](https://www.typescriptlang.org/) | 5.x     | Type-safe development             |
| [PostgreSQL](https://www.postgresql.org/)     | 15+     | Primary database                  |
| [Drizzle ORM](https://orm.drizzle.team/)      | 0.45.1  | Type-safe database toolkit        |
| [Redis](https://redis.io/)                    | Latest  | Caching and queue management      |

### Authentication & Security

- **NextAuth.js v5** - Authentication with OAuth (Google, GitHub) and
  credentials
- **Zod** - Runtime validation and type inference
- **bcryptjs** - Password hashing
- **Rate Limiting** - API protection with Upstash

### UI & Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Beautiful icon library
- **Framer Motion** - Smooth animations

### Image Management

- **ImageKit** - CDN and image optimization (recommended)
- **Cloudinary** - Alternative cloud storage
- **AWS S3** - Enterprise cloud storage
- **Sharp** - Server-side image processing

### Development Tools

- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting with strict rules
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality control
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing

### DevOps

- **Docker** - Containerization
- **GitHub Actions** - CI/CD automation
- **BullMQ** - Background job processing

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/comicwise.git
cd comicwise

# 2. Install dependencies (requires Node.js 20+ and pnpm 9+)
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# 4. Set up database
pnpm db:push

# 5. (Optional) Seed with sample data
pnpm db:seed

# 6. Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

### Required

- **Node.js** ≥ 20.0.0 ([Download](https://nodejs.org/))
- **pnpm** ≥ 9.0.0 (`npm install -g pnpm`)
- **PostgreSQL** ≥ 15 ([Download](https://www.postgresql.org/download/))

### Recommended

- **Redis** ≥ 7.0 for caching ([Download](https://redis.io/download))
- **Docker** for containerized development ([Download](https://www.docker.com/))
- **Git** for version control ([Download](https://git-scm.com/))

### Development Tools

- **VS Code** with recommended extensions (see `.vscode/extensions.json`)
- **PostgreSQL Client** (pgAdmin, DBeaver, or Drizzle Studio)

---

## 📥 Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/comicwise.git
cd comicwise
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### 3. Verify Installation

```bash
# Check Node.js version
node --version  # Should be v20.x.x or higher

# Check pnpm version
pnpm --version  # Should be 9.x.x or higher

# Check TypeScript compilation
pnpm type-check  # Should complete without errors
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# Quick setup (Windows PowerShell)
.\scripts\setup-env.ps1 -Create

# Or manually copy template
cp .env.example .env.local
```

#### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/comicwise"

# Authentication
AUTH_SECRET="generate-a-secure-32-character-or-longer-secret"
AUTH_URL="http://localhost:3000"

# Application
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### Optional Variables

```env
# Image Upload Provider (local, imagekit, cloudinary, aws)
UPLOAD_PROVIDER="local"

# ImageKit (if using)
IMAGEKIT_PUBLIC_KEY="your_public_key"
IMAGEKIT_PRIVATE_KEY="your_private_key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_id"

# Email (for notifications)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@comicwise.com"

# Redis (for caching)
REDIS_HOST="localhost"
REDIS_PORT="6379"

# OAuth Providers
AUTH_GOOGLE_CLIENT_ID="your-client-id"
AUTH_GOOGLE_CLIENT_SECRET="your-client-secret"
AUTH_GITHUB_CLIENT_ID="your-client-id"
AUTH_GITHUB_CLIENT_SECRET="your-client-secret"
```

### Database Setup

```bash
# Generate Drizzle schema and types
pnpm db:generate

# Push schema to database
pnpm db:push

# (Optional) Open Drizzle Studio GUI
pnpm db:studio  # Opens at http://localhost:4983
```

### Seeding Data

```bash
# Seed all data (users, comics, chapters)
pnpm db:seed

# Seed specific entities
pnpm db:seed:users
pnpm db:seed:comics
pnpm db:seed:chapters

# Validate data before seeding (dry run)
pnpm seed:validate

# Verbose output for debugging
pnpm db:seed:verbose
```

Place your JSON data files in the project root:

- `users.json` - User accounts
- `comics.json` - Comic metadata
- `chapters.json` - Chapter content

---

## 🔨 Development

### Start Development Server

```bash
# Standard mode
pnpm dev

# Debug mode (with Node.js inspector)
pnpm dev:debug

# HTTPS mode (experimental)
pnpm dev:https
```

The application will be available at:

- **HTTP**: http://localhost:3000
- **Debug**: http://localhost:3000 (inspector on port 9229)

### Code Quality

```bash
# Type checking
pnpm type-check          # Single run
pnpm type-check:watch    # Watch mode

# Linting
pnpm lint                # Check for errors
pnpm lint:fix            # Auto-fix errors
pnpm lint:strict         # Zero warnings allowed

# Formatting
pnpm format              # Format all files
pnpm format:check        # Check formatting

# All checks
pnpm validate            # type-check + lint + format
```

### Database Commands

```bash
# Schema management
pnpm db:generate         # Generate migrations
pnpm db:push             # Push schema changes
pnpm db:migrate          # Run migrations
pnpm db:studio           # Open GUI (port 4983)

# Data management
pnpm db:seed             # Seed database
pnpm db:reset            # Drop + push + seed

# Health checks
pnpm health:db           # Test database connection
pnpm health:redis        # Test Redis connection
pnpm health:all          # All health checks
```

### Cache Management

```bash
# Clear application caches
pnpm cache:clear         # Clear Redis cache
pnpm cache:stats         # View cache statistics

# Clear build caches
pnpm clean               # Remove .next, dist, etc.
pnpm clean:all           # Clean + remove node_modules
```

---

## ✅ Testing

### Unit Tests (Vitest)

```bash
# Watch mode (interactive)
pnpm test:unit

# Single run
pnpm test:unit:run

# Coverage report
pnpm test:unit:coverage
```

### E2E Tests (Playwright)

```bash
# Headless mode
pnpm test

# Interactive UI mode
pnpm test:ui

# Headed mode (visible browser)
pnpm test:headed

# Debug mode
pnpm test:debug

# Generate test code
pnpm test:codegen
```

### Run All Tests

```bash
pnpm test:all            # Unit + E2E tests
```

---

## 🚀 Deployment

### Production Build

```bash
# Build application
pnpm build

# Build with bundle analysis
pnpm build:analyze

# Start production server
pnpm start
```

### Docker Deployment

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up -d

# View logs
pnpm docker:logs

# Stop services
pnpm docker:down

# Clean everything
pnpm docker:clean
```

### Environment Variables (Production)

Ensure all required environment variables are set in your production
environment:

```env
NODE_ENV="production"
DATABASE_URL="your-production-database-url"
AUTH_SECRET="your-production-secret"
AUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Deployment Checklist

- ✅ Set `NODE_ENV=production`
- ✅ Use production database URL
- ✅ Generate new `AUTH_SECRET`
- ✅ Configure image upload provider
- ✅ Set up Redis for caching
- ✅ Enable HTTPS
- ✅ Configure CORS settings
- ✅ Set up monitoring and logging
- ✅ Run database migrations
- ✅ Test all critical paths

---

## 📁 Project Structure

```
comicwise/
├── .github/                 # GitHub configuration
│   ├── prompts/            # GitHub Copilot prompts
│   └── workflows/          # CI/CD workflows
├── .vscode/                # VS Code configuration
├── compose/                # Docker compose files
├── docs/                   # Documentation
├── public/                 # Static assets
├── scripts/               # Utility scripts
├── src/                   # Source code
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── database/         # Database configuration
│   ├── lib/              # Utility libraries
│   └── services/         # External services
├── tests/                 # Test files
└── package.json          # Dependencies
```

For detailed structure, see
[Project Structure Documentation](./docs/PROJECT_STRUCTURE.md).

---

## 📜 Scripts Reference

### Development

| Command          | Description                 |
| ---------------- | --------------------------- |
| `pnpm dev`       | Start development server    |
| `pnpm dev:debug` | Start with Node.js debugger |
| `pnpm build`     | Build for production        |
| `pnpm start`     | Start production server     |
| `pnpm clean`     | Clean build artifacts       |

### Database

| Command            | Description             |
| ------------------ | ----------------------- |
| `pnpm db:generate` | Generate migrations     |
| `pnpm db:push`     | Push schema to database |
| `pnpm db:migrate`  | Run migrations          |
| `pnpm db:studio`   | Open Drizzle Studio     |
| `pnpm db:seed`     | Seed database           |
| `pnpm db:reset`    | Reset database          |

### Code Quality

| Command           | Description               |
| ----------------- | ------------------------- |
| `pnpm type-check` | TypeScript type checking  |
| `pnpm lint`       | Run ESLint                |
| `pnpm lint:fix`   | Fix linting errors        |
| `pnpm format`     | Format code with Prettier |
| `pnpm validate`   | Run all quality checks    |

### Testing

| Command              | Description              |
| -------------------- | ------------------------ |
| `pnpm test:unit`     | Run unit tests           |
| `pnpm test`          | Run E2E tests            |
| `pnpm test:ui`       | E2E tests with UI        |
| `pnpm test:all`      | Run all tests            |
| `pnpm test:coverage` | Generate coverage report |

For a complete list, see [Scripts Reference](./docs/SCRIPTS_REFERENCE.md).

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   `git clone https://github.com/yourusername/comicwise.git`
3. **Create** a branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes
5. **Test** your changes: `pnpm validate && pnpm test:all`
6. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
7. **Push** to your fork: `git push origin feature/amazing-feature`
8. **Open** a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, no code change
refactor: code restructuring
perf: performance improvements
test: adding tests
chore: maintenance tasks
```

For more details, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE)
file for details.

---

## 🙏 Acknowledgments

Built with amazing open-source projects:

- [Next.js](https://nextjs.org/) - The React Framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [NextAuth.js](https://authjs.dev/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [shadcn/ui](https://ui.shadcn.com/) - Component Library
- [Radix UI](https://www.radix-ui.com/) - UI Primitives

---

## 📞 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/comicwise/issues)
- **Discussions**:
  [GitHub Discussions](https://github.com/yourusername/comicwise/discussions)

---

<div align="center">

**[Website](https://comicwise.com)** • **[Documentation](./docs/)** •
**[Changelog](CHANGELOG.md)**

Made with ❤️ by the ComicWise team

</div>
