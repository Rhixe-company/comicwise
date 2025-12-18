# ComicWise 📚

> A modern, full-stack comic reading platform built with Next.js 16, PostgreSQL,
> and cutting-edge web technologies.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

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

## 🛠️ Available Commands

### Development

```bash
make dev              # Start development server
make build            # Build for production
make start            # Start production server
make preview          # Build and preview
```

### Code Quality

```bash
make lint             # Run ESLint
make lint-fix         # Fix linting issues
make format           # Format with Prettier
make type-check       # TypeScript type checking
make check-all        # Run all checks
```

### Database

```bash
make db-generate      # Generate migrations
make db-push          # Push schema changes
make db-studio        # Open Drizzle Studio
make db-seed          # Seed database
make db-reset         # Reset and reseed
```

### Docker

```bash
make docker-up        # Start containers
make docker-down      # Stop containers
make docker-build     # Build images
make docker-dev       # Start dev containers
make docker-clean     # Clean all Docker resources
```

For all commands:

```bash
make help
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

## 🗺️ Roadmap

- [ ] Mobile app development
- [ ] Advanced search with Elasticsearch
- [ ] Real-time notifications with WebSockets
- [ ] Social features (follow users, activity feed)
- [ ] Reading lists and collections
- [ ] Comic recommendations AI
- [ ] Multi-language support
- [ ] PWA support
- [ ] Analytics dashboard
- [ ] API rate limiting with Upstash

---

**Built with ❤️ using Next.js 16**
