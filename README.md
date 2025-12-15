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

### 🐳 Docker & Deployment

- Production-ready Docker setup
- Multi-stage builds for optimal image size
- Health checks and monitoring
- Redis caching support
- Development and production configurations

### Compose helper scripts

The `compose/` folder contains convenient helper scripts for local development
and CI usage.

- `compose/build.sh` / `compose/build.ps1` — build production or development
  images.
- `compose/deploy.sh` / `compose/deploy.ps1` — run docker-compose to deploy
  services.
- `compose/dev.sh` — convenience script to bring up DB/Redis for local
  development.
- `compose/lint.sh` — run `pnpm lint`.
- `compose/format.sh` — run code formatter (`pnpm format`).
- `compose/test.sh` — run the test suite (`pnpm test`).
- `compose/clean.sh` — tear down compose resources and prune Docker cache.
- `compose/health-check.sh` — poll the app health endpoint during
  CI/deployments.

Usage examples:

```bash
# Build (production):
./compose/build.sh production

# Start development DB/Redis services:
./compose/dev.sh

# Run lint/format/tests locally via the helper scripts:
./compose/lint.sh
./compose/format.sh
./compose/test.sh

# Clean up Docker artifacts:
./compose/clean.sh
```

### ⚡ Performance & Security

- Server-side rendering and static generation
- API route protection with middleware
- Rate limiting for sensitive operations
- SQL injection prevention
- XSS and CSRF protection
- Environment variable validation with Zod

## 📋 Prerequisites

- **Node.js** 22+ (with Corepack enabled)
- **pnpm** 9+ (or enable with `corepack enable`)
- **PostgreSQL** 17+ (or use Docker)
- **Docker** & **Docker Compose** (optional, for containerized setup)

## 🚀 Quick Start

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd comicwise
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or use make
   make install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:
   - Database credentials
   - NextAuth secret (generate with `openssl rand -base64 32`)
   - Email server settings
   - OAuth provider keys (optional)

4. **Start Docker services (optional)**

   ```bash
   make docker-dev
   # or
   docker compose -f docker-compose.dev.yml up -d
   ```

5. **Set up database**

   ```bash
   make db-push    # Push schema
   make db-seed    # Seed sample data
   # or combined
   make db-reset
   ```

6. **Start development server**

   ```bash
   make dev
   # or
   pnpm dev
   ```

7. **Open your browser** Navigate to
   [http://localhost:3000](http://localhost:3000)

### Docker Production Setup

1. **Configure environment**

   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Build and start containers**

   ```bash
   make docker-up
   # or
   docker compose up -d
   ```

3. **Test deployment**
   ```bash
   make test-docker
   # or
   bash test-docker.sh
   ```

## 📂 Project Structure

```
comicwise/
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── (auth)/           # Authentication pages
│   │   │   ├── sign-in/
│   │   │   ├── sign-out/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   ├── verify-email/
│   │   │   ├── verify-request/
│   │   │   ├── resend-verification/
│   │   │   └── new-user/
│   │   ├── (root)/           # Main application routes
│   │   ├── admin/            # Admin dashboard
│   │   └── api/              # API routes
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── blocks/          # Compound components
│   │   └── emails/          # Email templates
│   ├── lib/                  # Utilities and helpers
│   │   ├── actions/         # Server actions
│   │   │   ├── auth.ts
│   │   │   ├── workflow.ts
│   │   │   └── ratelimit.ts
│   │   ├── mutations.ts     # Database mutations
│   │   ├── queries.ts       # Database queries
│   │   ├── validator.ts     # Zod schemas
│   │   ├── nodemailer.ts    # Email service
│   │   ├── auth.ts          # NextAuth config
│   │   └── seedHelpers.ts   # Database seeding
│   ├── db/                   # Database layer
│   │   ├── schema/          # Drizzle schemas
│   │   └── client.ts        # Database client
│   ├── app-config/          # App configuration
│   │   ├── env.ts           # Environment validation
│   │   └── index.ts         # App config
│   ├── types/               # TypeScript types
│   └── hooks/               # Custom React hooks
├── compose/
│   └── Dockerfile           # Production Dockerfile
├── drizzle/                 # Database migrations
├── public/                  # Static assets
├── docker-compose.yml       # Production Docker setup
├── docker-compose.dev.yml   # Development Docker setup
├── Makefile                 # Development commands
├── test-docker.sh          # Docker test script
└── package.json            # Dependencies

```

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
make docker-rebuild   # Rebuild everything
make docker-dev       # Start dev containers
make docker-clean     # Clean all Docker resources
```

### Workflows

```bash
make setup            # Complete initial setup
make dev-setup        # Setup with Docker
make fresh-start      # Clean slate setup
make ci               # Run CI pipeline
make pre-commit       # Pre-commit checks
```

For a complete list of commands, run:

```bash
make help
```

## 🗃️ Database Schema

The application uses a comprehensive database schema with the following
entities:

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

## 📧 Email Templates

The application includes professionally designed email templates:

- **Verification Email** - Account email verification
- **Password Reset Email** - Password reset requests
- **Welcome Email** - New user onboarding

All templates are built with `@react-email/components` and support:

- Responsive design
- Dark mode compatibility
- Accessible markup
- Cross-client compatibility

## 🔒 Security Features

- **Environment Validation** - Zod-based env variable validation
- **Rate Limiting** - Configurable rate limits for sensitive operations
- **Password Hashing** - bcrypt with salt rounds
- **SQL Injection Prevention** - Parameterized queries with Drizzle ORM
- **CSRF Protection** - Built-in Next.js protection
- **Secure Headers** - Custom security headers
- **JWT Sessions** - Secure session management
- **Input Validation** - Zod schemas for all user inputs

## 🖼️ Image Upload & Optimization

ComicWise supports flexible, production-grade image upload and optimization with
a unified API and pluggable providers:

- **Cloudinary** (cloud)
- **ImageKit** (cloud)
- **Local** (filesystem, for development/testing)

### Provider Configuration

Set the provider in your environment:

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

# Local (no extra config needed)
```

### Usage Example

```typescript
import { uploadImage, deleteImage, getImageUrl } from "@/services/upload";

// Upload an image (Buffer or File)
const result = await uploadImage(fileBuffer, {
  folder: "comic-covers",
  filename: "my-comic-cover",
  tags: ["cover", "comicwise"],
  transformation: {
    width: 800,
    height: 1200,
    quality: 85,
    format: "webp",
  },
});

if (result.success) {
  console.log("Image URL:", result.url);
  console.log("Thumbnail:", result.thumbnail);
} else {
  console.error("Upload failed:", result.error);
}

// Get optimized URL for display
const optimizedUrl = await getImageUrl(result.publicId, {
  width: 400,
  quality: 80,
});

// Delete an image
await deleteImage(result.publicId);
```

### Provider Features

| Feature          | Cloudinary | ImageKit | Local (dev) |
| ---------------- | :--------: | :------: | :---------: |
| Upload           |     ✅     |    ✅    |     ✅      |
| Transform/Resize |     ✅     |    ✅    |     ✅      |
| Format Convert   |     ✅     |    ✅    |     ✅      |
| Thumbnail        |     ✅     |    ✅    |    ⚠️\*     |
| Batch Upload     |     ✅     |    ✅    |     ✅      |
| Delete           |     ✅     |    ✅    |     ✅      |
| Responsive URLs  |     ✅     |    ✅    |     ✅      |

\*Local provider does not generate separate thumbnails, but you can request
resized images via transformation options.

---

## 🔧 Configuration

### App Configuration

All app-wide settings are managed in `src/app-config/`:

```typescript
{
  name: "ComicWise",
  url: env.NEXT_PUBLIC_APP_URL,
  pagination: {
    defaultLimit: 12,
    maxLimit: 100,
  },
  rateLimit: {
    default: { requests: 10, window: 10 },
    auth: { requests: 5, window: 900 },
    email: { requests: 3, window: 3600 },
  },
  email: {
    host: env.EMAIL_SERVER_HOST,
    port: env.EMAIL_SERVER_PORT,
    // ...
  }
}
```

### Environment Variables

Key environment variables:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/comicwise

# Auth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Email
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@comicwise.com

# Optional: OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

## 🧪 Testing

### Docker Testing

```bash
make test-docker
```

This runs a comprehensive test suite including:

- Container health checks
- Database connectivity
- Redis functionality
- Application endpoints
- Resource usage monitoring

### Manual Testing

```bash
# Type checking
make type-check

# Linting
make lint

# All quality checks
make check-all
```

## 📚 Additional Documentation

- [Quick Start Guide](./QUICKSTART.md) - Fast setup guide
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md) - Detailed implementation
  notes
- [Seed Data Guide](./SEED_README.md) - Database seeding instructions
- [Project Audit](./PROJECT_AUDIT.md) - Architecture and decisions
- [Task Completion](./TASK_COMPLETION.md) - Feature completion status

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow the existing code style
- Run `make pre-commit` before committing
- Write clear commit messages
- Update documentation as needed
- Add tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Zod](https://zod.dev/) - Schema validation
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [React Email](https://react.email/) - Email templates

## 📞 Support

For support, please:

- Open an issue on GitHub
- Check existing documentation
- Review closed issues for solutions

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
