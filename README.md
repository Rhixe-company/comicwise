# ComicWise 📚

> A modern, full-stack comic reading and management platform built with Next.js
> 15, PostgreSQL, and cutting-edge web technologies.

[![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## ✨ Features

### 🎨 User Features

- **Comic Reading**: Seamless comic reading experience with chapter navigation
- **Bookmarks**: Save your favorite comics and track reading progress
- **Comments**: Engage with the community through chapter comments
- **Search**: Advanced full-text search for comics, authors, and artists
- **User Authentication**: Secure authentication with email, Google, and GitHub
- **Profile Management**: Manage your account and reading preferences
- **Responsive Design**: Optimized for all devices and screen sizes

### 👨‍💼 Admin Features

- **Content Management**: Full CRUD operations for comics, chapters, authors,
  and artists
- **User Management**: Manage users with role-based access control
- **Analytics Dashboard**: Track engagement, views, and user statistics
- **Bulk Operations**: Efficient bulk upload and management tools
- **Image Management**: Integrated ImageKit CDN for optimized image delivery

### ⚡ Technical Features

- **Server Components**: Leverage React 19 Server Components for optimal
  performance
- **Caching**: Redis-based caching for lightning-fast response times
- **Rate Limiting**: Protect your API with built-in rate limiting
- **Type Safety**: Full TypeScript coverage with strict mode
- **Database Migrations**: Version-controlled schema with Drizzle ORM
- **Email Integration**: Automated emails with React Email templates
- **Docker Support**: Containerized deployment ready

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Setup database
pnpm db:generate
pnpm db:push

# Seed database (optional)
pnpm seed:all

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0
- **PostgreSQL** >= 15
- **Redis** (optional, can use Upstash)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd comicwise
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/comicwise"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (Optional)
AUTH_GOOGLE_CLIENT_ID="your-google-client-id"
AUTH_GOOGLE_CLIENT_SECRET="your-google-client-secret"
AUTH_GITHUB_CLIENT_ID="your-github-client-id"
AUTH_GITHUB_CLIENT_SECRET="your-github-client-secret"

# Email (Required for email verification)
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_SERVER_HOST="smtp.resend.com"
EMAIL_SERVER_PORT="587"
EMAIL_FROM="noreply@comicwise.com"
RESEND_API_KEY="your-resend-api-key"

# ImageKit (Required for image uploads)
IMAGEKIT_PUBLIC_KEY="your-imagekit-public-key"
IMAGEKIT_PRIVATE_KEY="your-imagekit-private-key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-id"

# Redis (Optional, can use Upstash)
UPSTASH_REDIS_REST_URL="your-upstash-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Setup Database

```bash
# Generate Drizzle schema
pnpm db:generate

# Push schema to database
pnpm db:push

# (Optional) Seed with sample data
pnpm seed:all
```

### 5. Start Development Server

```bash
pnpm dev
```

## 📚 Documentation

- [Setup Guide](.github/prompts/Setup.prompt.md) - Complete setup instructions
- [API Documentation](docs/API.md) - API routes and usage
- [Database Schema](docs/DATABASE.md) - Database structure and relations
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute

## 🏗️ Project Structure

```
comicwise/
├── .github/                 # GitHub configuration
│   └── prompts/            # GitHub Copilot prompts
├── .vscode/                # VSCode configuration
├── public/                 # Static assets
├── scripts/                # Utility scripts
│   ├── cli/               # CLI commands
│   └── seed/              # Database seeding
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (root)/       # Public pages
│   │   ├── admin/        # Admin dashboard
│   │   ├── api/          # API routes
│   │   └── dashboard/    # User dashboard
│   ├── components/        # React components
│   │   ├── admin/        # Admin components
│   │   ├── auth/         # Authentication
│   │   ├── layout/       # Layout components
│   │   ├── profile/      # Profile components
│   │   └── ui/           # shadcn/ui components
│   ├── dal/              # Data Access Layer
│   ├── database/         # Database configuration
│   │   ├── mutations/    # Database mutations
│   │   ├── queries/      # Database queries
│   │   ├── seed/         # Seeding system
│   │   └── schema.ts     # Drizzle schema
│   ├── dto/              # Data Transfer Objects
│   ├── hooks/            # React hooks
│   ├── lib/              # Utilities
│   │   ├── actions/      # Server actions
│   │   ├── validations/  # Zod schemas
│   │   └── utils.ts      # Helper functions
│   ├── services/         # External services
│   │   └── upload/       # Upload providers
│   ├── stores/           # State management
│   ├── styles/           # Global styles
│   └── types/            # TypeScript definitions
├── compose/              # Docker compose files
└── ...config files
```

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev                 # Start dev server (localhost:3000)
pnpm build              # Build for production
pnpm start              # Start production server

# Database
pnpm db:generate        # Generate migrations
pnpm db:push            # Push schema changes
pnpm db:studio          # Open Drizzle Studio
pnpm db:migrate         # Run migrations

# Seeding
pnpm seed:all           # Seed all data
pnpm seed:users         # Seed users only
pnpm seed:comics        # Seed comics only
pnpm seed:chapters      # Seed chapters only
pnpm seed:validate      # Validate seed data

# Code Quality
pnpm lint               # Run ESLint
pnpm lint:fix           # Fix ESLint errors
pnpm format             # Format with Prettier
pnpm type-check         # TypeScript type checking

# Testing
pnpm test               # Run tests
pnpm test:watch         # Watch mode
pnpm test:e2e           # End-to-end tests

# Docker
docker-compose up -d    # Start in production mode
docker-compose -f docker-compose.dev.yml up  # Development mode
```

### Technology Stack

#### Frontend

- **Next.js 15.1.3** - React framework with App Router
- **React 19** - UI library with Server Components
- **TypeScript 5.7.2** - Type-safe JavaScript
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Framer Motion** - Animation library
- **Recharts** - Data visualization

#### Backend

- **Next.js API Routes** - Serverless API
- **NextAuth.js v5** - Authentication
- **Drizzle ORM** - Type-safe database ORM
- **PostgreSQL** - Relational database
- **Redis** (Upstash) - Caching and rate limiting

#### DevOps

- **Docker** - Containerization
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks

#### Services

- **ImageKit** - Image CDN and optimization
- **Resend** - Email delivery
- **Upstash Redis** - Serverless Redis

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e

# Generate coverage report
pnpm test:coverage
```

## 🚢 Deployment

### Production Build

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Build application
pnpm build

# Start production server
pnpm start
```

### Docker Deployment

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Environment Variables (Production)

Ensure all required environment variables are set:

- `DATABASE_URL` - Production database connection string
- `NEXTAUTH_SECRET` - Secure random string for JWT signing
- `NEXTAUTH_URL` - Production URL
- All API keys for third-party services

## 🔒 Security

- **Authentication**: JWT-based with NextAuth.js
- **Authorization**: Role-based access control (RBAC)
- **Rate Limiting**: API route protection
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Parameterized queries via Drizzle ORM
- **CSRF Protection**: Built-in Next.js protection
- **XSS Protection**: React automatic escaping
- **HTTPS**: Required in production

## 🎨 Code Style

This project follows:

- **ESLint** configuration for code quality
- **Prettier** for consistent formatting
- **TypeScript strict mode** for type safety
- **CamelCase** naming for files and components
- **DRY principles** throughout the codebase

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 🤝 Contributing

We welcome contributions! Please see our
[Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Run tests and linting (`pnpm test && pnpm lint`)
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/comicwise/issues)
- **Discussions**:
  [GitHub Discussions](https://github.com/yourusername/comicwise/discussions)
- **Email**: support@comicwise.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment platform
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- All our amazing contributors!

## 📊 Project Status

- ✅ Core functionality complete
- ✅ Authentication system
- ✅ Admin dashboard
- ✅ Comic reading interface
- ✅ Search and filtering
- 🚧 Mobile app (planned)
- 🚧 Social features (planned)
- 🚧 Reading analytics (planned)

## 🗺️ Roadmap

### Q1 2025

- [ ] Enhanced search with filters
- [ ] Reading lists and collections
- [ ] User notifications system
- [ ] Mobile-responsive improvements

### Q2 2025

- [ ] Social features (following, sharing)
- [ ] Reading analytics and statistics
- [ ] Recommendation system
- [ ] API rate limiting enhancements

### Q3 2025

- [ ] Mobile application (React Native)
- [ ] Offline reading support
- [ ] Advanced admin analytics
- [ ] Multi-language support

---

**Made with ❤️ by the ComicWise Team**

Last Updated: 2025-12-26 Version: 1.0.0
