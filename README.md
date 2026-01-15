# 🎨 ComicWise - Web Comic Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org)
[![React 19](https://img.shields.io/badge/React-19.2-61dafb)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-336791)](https://www.postgresql.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> A modern, full-featured web comic reading and management platform built with Next.js 16, PostgreSQL, Redis, and cutting-edge web technologies.

## 🌟 Features

### 📖 Reader Features
- **Chapter Navigation**: Seamless reading experience with chapter progress tracking
- **Bookmarking**: Save comics and chapters for later reading
- **History Tracking**: View reading history and resume from last read position
- **Search & Discovery**: Full-text search and genre-based filtering
- **Ratings & Reviews**: Rate and comment on comics and chapters

### ✍️ Creator Features
- **Content Management**: Intuitive admin dashboard for uploading and managing comics
- **Bulk Upload**: Upload multiple chapters with image optimization
- **Analytics**: Track views, ratings, and engagement metrics
- **Metadata Management**: Manage genres, authors, artists, and types

### 🔐 Authentication
- **Credentials Auth**: Email and password authentication
- **OAuth Providers**: Google and GitHub OAuth integration
- **WebAuthn**: Support for biometric authentication
- **Session Management**: Secure JWT-based session handling

### ⚡ Performance & Optimization
- **Image Optimization**: Automatic compression and CDN delivery
- **Caching Layer**: Redis-powered caching for fast responses
- **Database Optimization**: Indexed queries with Drizzle ORM
- **Progressive Enhancement**: Works without JavaScript

### 🔄 Advanced Features
- **Real-time Updates**: WebSocket support for live notifications
- **Background Jobs**: QStash for serverless background processing
- **Rate Limiting**: Upstash-powered rate limiting
- **Seeding System**: Automated data population with image optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 20.0+ 
- pnpm 8.0+
- PostgreSQL 12.0+
- Redis 6.0+ (optional, for caching)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/comicwise/comicwise.git
cd comicwise
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Setup database**
```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

5. **Start development server**
```bash
pnpm dev
```

Visit `http://localhost:3000` in your browser.

## 📚 Project Structure

```
comicwise/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   │   ├── admin/       # Admin dashboard
│   │   ├── ui/          # Shadcn UI components
│   │   └── layout/      # Layout components
│   ├── database/        # Database layer
│   │   ├── schema/      # Drizzle schema
│   │   ├── seed/        # Seeding system
│   │   └── queries/     # Database queries
│   ├── lib/             # Utilities
│   │   ├── auth/        # NextAuth configuration
│   │   ├── validations/ # Zod schemas
│   │   └── utils/       # Helper functions
│   ├── services/        # Business logic
│   │   └── imageService.ts  # Image handling
│   ├── styles/          # Global styles
│   └── types/           # TypeScript types
├── public/              # Static assets
│   ├── uploads/         # User uploads
│   └── placeholder-comic.jpg
├── scripts/             # Build & utility scripts
├── .github/             # GitHub config
│   └── prompts/         # Copilot prompts
├── .vscode/             # VS Code settings
├── docker-compose.yml   # Docker configuration
├── drizzle.config.ts    # Drizzle ORM config
├── next.config.ts       # Next.js config
└── tsconfig.json        # TypeScript config
```

## 🛠️ Development Guide

### Available Commands

#### Development
```bash
pnpm dev              # Start development server
pnpm dev:https        # With HTTPS
pnpm dev:debug        # With Node debugger
```

#### Database
```bash
pnpm db:push          # Push schema changes
pnpm db:generate      # Generate migrations
pnpm db:seed          # Seed database
pnpm db:seed:dry-run  # Validate seed data
pnpm db:studio        # Open Drizzle Studio
pnpm db:reset         # Drop and recreate schema
```

#### Code Quality
```bash
pnpm type-check       # Check TypeScript
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix linting issues
pnpm format           # Format with Prettier
pnpm validate         # Full validation
```

#### Testing
```bash
pnpm test             # Run E2E tests (Playwright)
pnpm test:ui          # Interactive test UI
pnpm test:unit        # Run unit tests (Vitest)
pnpm test:unit:watch  # Watch mode
```

#### Build & Deploy
```bash
pnpm build            # Build for production
pnpm start            # Start production server
pnpm build:analyze    # Analyze bundle size
pnpm docker:build     # Build Docker image
```

#### Maintenance
```bash
pnpm clean            # Clean build artifacts
pnpm cleanup          # Run project cleanup
pnpm health:all       # Check system health
```

### Environment Configuration

Create `.env.local` with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/comicwise"

# Authentication
AUTH_SECRET="<generate with: openssl rand -base64 32>"
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

# OAuth Providers (Optional)
AUTH_GOOGLE_CLIENT_ID=""
AUTH_GOOGLE_CLIENT_SECRET=""
AUTH_GITHUB_CLIENT_ID=""
AUTH_GITHUB_CLIENT_SECRET=""

# Application
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
PORT="3000"
```

### Database Schema

Key tables include:
- **user**: User accounts and profiles
- **comic**: Comic metadata and information
- **chapter**: Individual chapters with content
- **genre**: Content categories
- **comicImage**: Comic cover images
- **chapterImage**: Chapter page images
- **bookmark**: User bookmarks
- **readingProgress**: Reading history tracking
- **comment**: User comments and discussions

### Seeding Data

The seeding system supports multiple JSON data sources:
- `users.json` - User accounts
- `comics.json` - Comic metadata
- `chapters.json` - Chapter listings
- Images are automatically downloaded and cached

Run seeding with:
```bash
pnpm db:seed              # Full seed
pnpm db:seed:dry-run      # Validate without persisting
pnpm db:seed:verbose      # With detailed output
```

## 🏗️ Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19.2** - UI library
- **Tailwind CSS 4** - Styling
- **Shadcn/ui** - Component library
- **Framer Motion** - Animations
- **React Hook Form** - Form management

### Backend
- **Node.js 20+** - JavaScript runtime
- **TypeScript 5** - Type safety
- **Drizzle ORM** - Database access
- **Zod** - Schema validation
- **NextAuth v5** - Authentication

### Database & Caching
- **PostgreSQL 12+** - Relational database
- **Redis** - In-memory cache
- **Drizzle Studio** - Database visualization

### DevOps & Deployment
- **Docker** - Containerization
- **Docker Compose** - Service orchestration
- **Vercel** - Hosting platform
- **GitHub Actions** - CI/CD

### Testing
- **Playwright** - E2E testing
- **Vitest** - Unit testing
- **Testing Library** - Component testing

## 📖 Usage Examples

### Creating a Comic
```typescript
// src/app/admin/comics/new/page.tsx
import { createComic } from "@/database/mutations/comics";

export default function NewComicPage() {
  const handleCreate = async (data: CreateComicInput) => {
    await createComic(data);
    // Handle success
  };

  return <ComicForm onSubmit={handleCreate} />;
}
```

### Reading Chapter Progress
```typescript
// src/app/comics/[slug]/[chapterNumber]/page.tsx
import { getChapterWithProgress } from "@/database/queries/chapters";
import { useSession } from "next-auth/react";

export default async function ChapterPage({ params }) {
  const session = await getSession();
  const chapter = await getChapterWithProgress(
    params.slug,
    params.chapterNumber,
    session?.user?.id
  );

  return <ChapterViewer chapter={chapter} />;
}
```

### Uploading Images
```typescript
// Using imageService
import { ImageService } from "@/services/imageService";

const imageService = new ImageService();
const result = await imageService.downloadAndStore(imageUrl);

if (result.success) {
  console.log(`Image saved to: ${result.localPath}`);
}
```

## 🔐 Security

### Authentication
- Implements NextAuth v5 best practices
- Uses secure session management
- Supports multi-factor authentication via WebAuthn
- CSRF protection enabled

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention via Drizzle ORM
- CORS properly configured
- Rate limiting on API endpoints
- Password hashing with bcryptjs

### Production Deployment
- Environment variables for secrets
- HTTPS enforced
- Database backups automated
- Security headers configured
- Regular dependency updates

## 📝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Code Standards
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Tests required for new features
- Documentation for complex logic
- Follow Next.js best practices

### Pre-commit Checks
```bash
pnpm validate   # Runs type-check, lint, and format
pnpm test       # Runs E2E tests
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
psql -c "SELECT 1" $DATABASE_URL

# Check Drizzle health
pnpm health:db
```

### Redis Connection Issues
```bash
# Test connection
redis-cli ping

# Check Upstash (if using)
curl $UPSTASH_REDIS_REST_URL/ping
```

### Seed Data Errors
```bash
# Run with verbose output
pnpm db:seed:verbose

# Check seed logs
cat seed_output.log
```

### Build Errors
```bash
# Clear cache
pnpm clean:cache

# Rebuild
pnpm build --debug
```

## 📚 Documentation

- **[Setup Guide](.github/prompts/Setup.prompt.md)** - Complete setup instructions
- **[API Reference](docs/API.md)** - API endpoints documentation
- **[Database Schema](docs/DATABASE.md)** - Database structure
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment
- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core comic reading platform
- ✅ User authentication
- ✅ Image optimization and CDN support

### Phase 2 (Planned)
- 🔄 Advanced search and filtering
- 🔄 Social features (following, discussions)
- 🔄 Recommendation engine

### Phase 3 (Future)
- 📅 Mobile app (React Native)
- 📅 Creator marketplace
- 📅 Advanced analytics dashboard

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 📞 Support

For questions and support:
- **Issues**: [GitHub Issues](https://github.com/comicwise/comicwise/issues)
- **Discussions**: [GitHub Discussions](https://github.com/comicwise/comicwise/discussions)
- **Email**: support@comicwise.com

## 🙏 Acknowledgments

Built with ❤️ using:
- [Next.js](https://nextjs.org)
- [Drizzle ORM](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [NextAuth.js](https://next-auth.js.org)
- [PostgreSQL](https://www.postgresql.org)

---

**ComicWise** © 2026 | Made with ❤️ for comic enthusiasts and creators
