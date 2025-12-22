# ComicWise 📚

> A modern, full-stack comic reading platform built with Next.js 16, PostgreSQL,
> and cutting-edge web technologies.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📖 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [CLI & Scripts](#-cli--scripts)
- [Database](#-database-schema)
- [Security](#-security-features)
- [Image Upload](#-image-upload--optimization)
- [Email Templates](#-email-templates)
- [Configuration](#-configuration)
- [Testing](#-testing)
- [Theming](#-theming-system)
- [Contributing](#-contributing)

---

## 🌟 Features

### Core Functionality

- 📖 **Comic Library** - Browse thousands of comics with advanced filtering
- 📑 **Chapter Reader** - Smooth, responsive reading experience
- 🔖 **Bookmarks** - Track reading progress across devices
- 💬 **Comments** - Engage with community discussions
- 🔍 **Advanced Search** - Find comics by title, author, artist, genre
- ⭐ **Ratings & Reviews** - Rate and review your favorite comics

### User Features

- 🔐 **Authentication** - Email/password + OAuth (Google, GitHub)
- 👤 **User Profiles** - Personalized dashboards
- 📊 **Reading Statistics** - Track your reading habits
- 🌓 **Theme Toggle** - Light/dark mode support
- 📱 **Mobile Responsive** - Optimized for all devices

### Admin Features

- 👨‍💼 **Admin Dashboard** - Comprehensive content management
- ✍️ **Content Creation** - Easy comic and chapter uploads
- 📈 **Analytics** - User engagement metrics
- 🔒 **Role Management** - Admin, moderator, user roles
- 📧 **Email Notifications** - Automated user communications

### Technical Highlights

- ⚡ **Next.js 16 App Router** - Server components & streaming
- 🗄️ **PostgreSQL + Drizzle ORM** - Type-safe database operations
- 🎨 **Tailwind CSS 4** - Modern, utility-first styling
- 📧 **React Email** - Beautiful email templates
- 🔄 **QStash** - Background job processing
- ☁️ **Image Upload** - ImageKit/Cloudinary integration
- 🛡️ **Rate Limiting** - Upstash Redis protection
- 🧪 **Playwright** - E2E testing suite
- 🐳 **Docker Ready** - Production-ready containerization

---

## 📋 Prerequisites

- **Node.js** 22+ (with Corepack enabled)
- **pnpm** 9+ (or enable with `corepack enable`)
- **PostgreSQL** 17+ (or use Docker)
- **Docker** & **Docker Compose** (optional, for containerized setup)

---

## 🚀 Quick Start

### Option 1: Docker Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd comicwise

# Copy environment file
cp .envs/.env.development .env.local

# Start services
docker-compose -f docker-compose.dev.yml up

# In another terminal: initialize database
docker-compose -f docker-compose.dev.yml exec app pnpm db:push
docker-compose -f docker-compose.dev.yml exec app pnpm db:seed

# Open http://localhost:3000
```

**Service URLs:**

- 🌐 App: http://localhost:3000
- 🗄️ PgAdmin: http://localhost:5051 (admin@example.com / admin)
- 📊 PostgreSQL: localhost:5433 (user: dev / pass: dev123)
- 🔴 Redis: localhost:6380

### Option 2: Local Development

```bash
# Clone and install
git clone <repository-url>
cd comicwise
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up database
pnpm db:push
pnpm db:seed

# Start development server
pnpm dev

# Open http://localhost:3000
```

---

## 📂 Project Structure

```
comicwise/
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── (auth)/           # Authentication pages
│   │   ├── (root)/           # Main application routes
│   │   ├── admin/            # Admin dashboard
│   │   └── api/              # API routes
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── blocks/          # Compound components
│   │   └── emails/          # Email templates
│   ├── lib/                  # Utilities & helpers
│   │   ├── actions/         # Server actions
│   │   ├── mutations.ts     # Database mutations
│   │   ├── queries.ts       # Database queries
│   │   ├── validator.ts     # Zod schemas
│   │   ├── auth.ts          # NextAuth config
│   │   └── seedHelpers.ts   # Database seeding
│   ├── db/                   # Database layer
│   │   ├── schema/          # Drizzle schemas
│   │   └── client.ts        # Database client
│   ├── app-config/          # App configuration
│   ├── types/               # TypeScript types
│   └── hooks/               # Custom React hooks
├── compose/                 # Docker helpers & scripts
├── drizzle/                 # Database migrations
├── public/                  # Static assets
├── docker-compose.yml       # Production setup
├── docker-compose.dev.yml   # Development setup
├── Makefile                 # Development commands
└── package.json            # Dependencies
```

---

## 🛠️ CLI & Scripts

### 🎯 Quick Access CLI

ComicWise includes a powerful CLI system with 100+ organized scripts:

```bash
# Main CLI entry point
pnpm cli

# Or use the bin shortcut
./bin/comicwise

# Windows users
node bin/comicwise.mjs
```

**CLI Features:**

- 📂 Categorized scripts (Development, Database, Testing, etc.)
- 🔍 Interactive search and filtering
- 📖 Built-in documentation for every command
- ⚡ Tab completion support
- 🔗 Workflow chaining capabilities

### 📋 Script Categories

#### Development

```bash
pnpm dev              # Start dev server (Turbopack)
pnpm dev:debug        # Start with Node.js inspector
pnpm dev:https        # Start with HTTPS
pnpm build            # Production build
pnpm start            # Start production server
pnpm preview          # Build and preview
```

#### Code Quality

```bash
pnpm validate         # Run all checks (type, lint, format)
pnpm type-check       # TypeScript validation
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix lint issues
pnpm format           # Format with Prettier
pnpm check-all        # Complete validation suite
```

#### Database

```bash
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Drizzle Studio
pnpm db:seed          # Seed database with test data
pnpm db:seed:verbose  # Seed with detailed logs
pnpm db:reset         # Drop, recreate, and seed
pnpm db:backup        # Create database backup
```

#### Image Upload & Management

```bash
pnpm upload:bulk              # Bulk upload images
pnpm upload:bulk:cloudinary   # Upload to Cloudinary
pnpm upload:bulk:imagekit     # Upload to ImageKit
pnpm upload:bulk:aws          # Upload to AWS S3
pnpm upload:bulk:dry-run      # Test without uploading
pnpm upload:comics            # Upload comic images
pnpm upload:test              # Test upload service
```

#### Cache & Redis

```bash
pnpm cache:clear      # Clear all cache
pnpm cache:stats      # View cache statistics
pnpm redis:cli        # Open Redis CLI
pnpm redis:flush      # Flush Redis database
pnpm redis:start      # Start Redis container
pnpm redis:stop       # Stop Redis container
```

#### Queue & Background Jobs

```bash
pnpm queue:worker     # Start queue worker
pnpm queue:stats      # View queue statistics
pnpm queue:clean      # Clean completed jobs
pnpm queue:dashboard  # Open Bull Board UI
pnpm qstash:test      # Test QStash workflow
```

#### System Health & Monitoring

```bash
pnpm health:check     # Complete health check
pnpm health:db        # Check database connection
pnpm health:redis     # Check Redis connection
pnpm health:all       # Run all health checks
```

#### Testing

```bash
pnpm test             # Run Playwright E2E tests
pnpm test:unit        # Run Vitest unit tests
pnpm test:unit:ui     # Open Vitest UI
pnpm test:ui          # Open Playwright UI
pnpm test:debug       # Debug tests
pnpm test:all         # Run all test suites
```

#### Docker

```bash
pnpm docker:dev       # Start dev containers
pnpm docker:prod      # Start production containers
pnpm docker:build     # Build images
pnpm docker:down      # Stop all containers
pnpm docker:clean     # Remove all containers/volumes
pnpm docker:logs      # View all logs
pnpm docker:shell     # Open shell in app container
pnpm docker:test      # Run Docker health tests
```

#### Project Utilities

```bash
pnpm setup            # Initial project setup
pnpm setup:docker     # Setup with Docker
pnpm clean            # Clean build artifacts
pnpm clean:all        # Clean everything (including node_modules)
pnpm update-deps      # Update dependencies
```

### 🔧 Custom Script System

#### Priority-Based Task Execution

```bash
pnpm priority:list      # List all tasks by priority
pnpm priority:run:p0    # Run critical (P0) tasks
pnpm priority:run:p1    # Run high priority (P1) tasks
pnpm priority:status    # View task status
pnpm priority:complete  # Mark tasks as complete
```

#### Workflow Management

```bash
pnpm workflow:test      # Test workflow execution
```

#### Import Optimization

```bash
pnpm imports:optimize   # Optimize all imports
pnpm imports:check      # Check import paths (dry-run)
```

### 🎨 Shell Aliases (Optional)

Add to your `.bashrc`, `.zshrc`, or PowerShell profile:

```bash
# Quick aliases
alias cw='pnpm cli'
alias cwd='pnpm dev'
alias cwb='pnpm build'
alias cwt='pnpm test'
alias cwdb='pnpm db:studio'
alias cws='pnpm db:seed'
```

### 📚 CLI Documentation

Every script includes:

- Description of what it does
- Required environment variables
- Usage examples
- Related commands
- Troubleshooting tips

Access documentation:

```bash
pnpm cli --help          # General help
pnpm cli search <term>   # Search for commands
pnpm cli docs <script>   # Detailed script docs
```

---

## 🗃️ Database Schema

### Authentication

- **users** - User accounts with role-based permissions
- **accounts** - OAuth provider accounts
- **sessions** - User sessions
- **verificationToken** - Email verification tokens
- **passwordResetToken** - Password reset tokens
- **authenticator** - WebAuthn authenticators

### Content Management

- **comics** - Comic series with metadata
- **chapters** - Individual comic chapters
- **chapterImages** - Chapter page images
- **comicImages** - Comic cover and promotional images
- **genres** - Genre categorization
- **types** - Comic types (Manga, Manhwa, etc.)
- **authors** - Content creators
- **artists** - Illustrators

### User Interaction

- **bookmarks** - User's saved comics with reading progress
- **comments** - Chapter comments and discussions

---

## 🔒 Security Features

- **Environment Validation** - Zod-based env variable validation
- **Rate Limiting** - Configurable limits for sensitive operations
- **Password Hashing** - bcrypt with salt rounds
- **SQL Injection Prevention** - Parameterized queries with Drizzle ORM
- **CSRF Protection** - Built-in Next.js protection
- **Secure Headers** - Custom security headers
- **JWT Sessions** - Secure session management
- **Input Validation** - Zod schemas for all user inputs

---

## 🖼️ Image Upload & Optimization

ComicWise supports production-grade image handling with pluggable providers:

**Supported Providers:**

- **Cloudinary** (cloud)
- **ImageKit** (cloud)
- **Local** (filesystem, for development)

**Configuration:**

```env
UPLOAD_PROVIDER=cloudinary   # or imagekit or local

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ImageKit
IMAGEKIT_PUBLIC_KEY=your-public-key
IMAGEKIT_PRIVATE_KEY=your-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
```

**Usage:**

```typescript
import { uploadImage, deleteImage, getImageUrl } from "@/services/upload";

// Upload an image
const result = await uploadImage(fileBuffer, {
  folder: "comic-covers",
  filename: "my-comic-cover",
  transformation: { width: 800, height: 1200, quality: 85 },
});

if (result.success) {
  console.log("Image URL:", result.url);
}

// Get optimized URL
const optimizedUrl = await getImageUrl(result.publicId, {
  width: 400,
  quality: 80,
});

// Delete image
await deleteImage(result.publicId);
```

---

## 📧 Email Templates

Professionally designed email templates using `@react-email/components`:

- **Verification Email** - Account email verification
- **Password Reset Email** - Password reset requests
- **Welcome Email** - New user onboarding

Features:

- Responsive design
- Dark mode support
- Accessible markup
- Cross-client compatibility

---

## 🔧 Configuration

### Environment Variables

**Database:**

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/comicwise
```

**Authentication:**

```env
NEXTAUTH_SECRET=your-secret-key  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

**Email:**

```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@comicwise.com
```

**OAuth (Optional):**

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
```

### App Configuration

All app-wide settings are in `src/app-config/`:

```typescript
{
  name: "ComicWise",
  url: env.NEXT_PUBLIC_APP_URL,
  pagination: { defaultLimit: 12, maxLimit: 100 },
  rateLimit: {
    default: { requests: 10, window: 10 },
    auth: { requests: 5, window: 900 },
    email: { requests: 3, window: 3600 },
  },
}
```

---

## 🧪 Testing

### Docker Testing

```bash
make test-docker
```

Includes:

- Container health checks
- Database connectivity tests
- Redis functionality tests
- Application endpoint tests
- Resource usage monitoring

### Manual Testing

```bash
make type-check    # TypeScript validation
make lint          # Code linting
make check-all     # All quality checks
```

---

## 📚 Additional Documentation

- [ENVIRONMENT_DOCKER_SETUP_INDEX.md](ENVIRONMENT_DOCKER_SETUP_INDEX.md) -
  Complete Docker & environment setup
- [DOCKER_ENV_SETUP.md](DOCKER_ENV_SETUP.md) - Detailed environment
  configuration
- [CONFIG_FILE_INDEX.md](CONFIG_FILE_INDEX.md) - Configuration file reference
- [.envs/README.md](.envs/README.md) - Environment variables guide

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run checks: `make pre-commit`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

**Code Standards:**

- Follow the existing code style
- Run `make pre-commit` before committing
- Write clear commit messages
- Update documentation as needed
- Add tests for new features

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Zod](https://zod.dev/) - Schema validation
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [React Email](https://react.email/) - Email templates
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Docker](https://www.docker.com/) - Containerization

---

## 📞 Support

- Open an issue on GitHub
- Check existing documentation
- Review closed issues for solutions

---

## 🎨 Theming System

ComicWise includes a comprehensive theming system with:

### Features

- 🌓 **Dark/Light Mode** - Seamless theme switching
- 🎨 **Custom Themes** - Create and apply custom color schemes
- 💾 **Theme Persistence** - Saves user preferences
- 🔧 **CSS Variables** - Easy customization
- 📱 **Responsive** - Works across all devices

### Usage

```tsx
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle Theme
    </button>
  );
}
```

### Creating Custom Themes

Edit `src/app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  /* ... more variables */
}
```

### Theme Configuration

Configure themes in `tailwind.config.ts`:

```typescript
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
    },
  },
};
```

---

## 🔄 CI/CD Integration

### GitHub Actions Workflows

ComicWise includes pre-configured CI/CD workflows:

#### Continuous Integration

```yaml
# .github/workflows/ci.yml
- Type checking
- Linting
- Unit tests
- E2E tests
- Build verification
```

#### Deployment

```yaml
# .github/workflows/deploy.yml
- Docker image building
- Container registry push
- Production deployment
- Health checks
```

### Pre-commit Hooks

Automatic code quality checks:

```bash
# Configured via Husky
- ESLint
- Prettier
- Type checking
- Spell checking
```

### CI Health Tracking

```bash
pnpm ci              # Run CI checks locally
pnpm ci:full         # Complete CI suite
pnpm ci:test         # Run CI tests
```

---

## 📘 Complete Documentation

### Getting Started

- [Quick Start Guide](docs/SETUP.md)
- [Docker Setup](docs/DOCKER_ENV_SETUP.md)
- [Environment Configuration](docs/CONFIG_FILE_INDEX.md)

### Development

- [CLI Reference](docs/CLI_REFERENCE.md)
- [Workflow Chaining](docs/WORKFLOW_CHAINING.md)
- [Error Troubleshooting](docs/TROUBLESHOOTING.md)
- [Pro Tips & Shortcuts](docs/PRO_TIPS.md)

### Deployment

- [Production Deployment](docs/DEPLOYMENT.md)
- [CI/CD Templates](docs/CICD_TEMPLATES.md)
- [Environment Variables](.envs/README.md)

### Architecture

- [Project Structure](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE.md)
- [API Reference](docs/API.md)

---

## 🚀 Project Scaffolding

### Quick Templates

```bash
# Create new component
pnpm cli scaffold component <name>

# Create new API route
pnpm cli scaffold api <route>

# Create new page
pnpm cli scaffold page <path>

# Create new email template
pnpm cli scaffold email <name>

# Create full CRUD module
pnpm cli scaffold crud <resource>
```

### Template Features

- Pre-configured TypeScript types
- Built-in error handling
- Validation schemas
- Test files
- Documentation

---

## 🗺️ Roadmap

### In Progress

- [ ] Advanced analytics dashboard
- [ ] Real-time notifications with WebSockets
- [ ] AI-powered comic recommendations

### Planned

- [ ] Mobile app (React Native)
- [ ] Advanced search with Elasticsearch
- [ ] Social features (follow, activity feed)
- [ ] Reading lists and collections
- [ ] Multi-language support (i18n)
- [ ] PWA support
- [ ] GraphQL API
- [ ] Micro-frontends architecture

### Completed ✅

- [x] Docker containerization
- [x] CLI system with 100+ scripts
- [x] Bulk image upload
- [x] Redis caching
- [x] Queue workers
- [x] Health monitoring
- [x] Comprehensive theming
- [x] CI/CD pipelines

---

## 🎯 Performance

### Optimizations

- ⚡ **Next.js 16 Turbopack** - Lightning-fast builds
- 🗜️ **Image Optimization** - Automatic WebP conversion
- 📦 **Code Splitting** - Route-based chunking
- 💾 **Redis Caching** - Reduced database queries
- 🔄 **ISR** - Incremental Static Regeneration
- 🎨 **CSS-in-JS** - Zero runtime overhead with Tailwind

### Benchmarks

- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Build Time: ~45s (with Turbopack)

---

## 🔒 Security Best Practices

- ✅ Environment variable validation
- ✅ Rate limiting on all API routes
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF tokens
- ✅ Secure headers
- ✅ Input sanitization
- ✅ Password hashing (bcrypt)
- ✅ JWT session management
- ✅ OAuth 2.0 support

---

**Built with ❤️ using Next.js 16 | Powered by PostgreSQL & Redis**
