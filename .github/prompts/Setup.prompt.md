# ComicWise Project Setup Prompt

## Project Overview
ComicWise is a modern web comic platform built with Next.js 15, featuring advanced comic management, user authentication, and real-time interactions.

## Technology Stack

### Core Framework
- **Next.js 15.1.3** with App Router
- **React 19** with Server Components
- **TypeScript 5.7.2** with strict mode

### Database & ORM
- **PostgreSQL** as primary database
- **Drizzle ORM** for type-safe database access
- **Redis** (Upstash) for caching and rate limiting

### Authentication
- **NextAuth.js v5** (Auth.js)
- **Providers**: Credentials, Google, GitHub
- **JWT** strategy with session management

### UI & Styling
- **Tailwind CSS 3.4.17** with custom configuration
- **shadcn/ui** components
- **Radix UI** primitives
- **Recharts** for data visualization
- **Framer Motion** for animations

### Image Management
- **ImageKit.io** for CDN and transformations
- **Sharp** for local image processing

### Email & Notifications
- **Nodemailer** for email delivery
- **React Email** for email templates
- **Resend** as email provider

### Development Tools
- **ESLint** with custom configuration
- **Prettier** for code formatting
- **Husky** for git hooks
- **pnpm** as package manager
- **Docker** for containerization

## Project Structure

```
comicwise/
├── .github/
│   └── prompts/           # GitHub Copilot prompts
├── .vscode/              # VSCode configuration
│   ├── extensions.json
│   ├── launch.json
│   ├── mcp.json
│   ├── settings.json
│   └── tasks.json
├── public/               # Static assets
├── scripts/              # Utility scripts
│   ├── cli/             # CLI commands
│   ├── seed/            # Database seeding
│   └── utils/           # Helper functions
├── src/
│   ├── app/             # Next.js app router
│   │   ├── (root)/      # Public pages
│   │   ├── admin/       # Admin dashboard
│   │   ├── api/         # API routes
│   │   └── dashboard/   # User dashboard
│   ├── components/      # React components
│   │   ├── admin/       # Admin components
│   │   ├── auth/        # Authentication components
│   │   ├── layout/      # Layout components
│   │   ├── profile/     # Profile components
│   │   └── ui/          # shadcn/ui components
│   ├── dal/             # Data Access Layer
│   ├── database/        # Database configuration
│   │   ├── mutations/   # Database mutations
│   │   ├── queries/     # Database queries
│   │   ├── seed/        # Seeding system
│   │   └── schema.ts    # Drizzle schema
│   ├── dto/             # Data Transfer Objects
│   ├── hooks/           # React hooks
│   ├── lib/             # Utility libraries
│   │   ├── actions/     # Server actions
│   │   ├── validations/ # Zod schemas
│   │   └── utils.ts     # Helper functions
│   ├── services/        # External services
│   │   └── upload/      # Upload providers
│   ├── stores/          # State management
│   ├── styles/          # Global styles
│   └── types/           # TypeScript definitions
└── compose/             # Docker compose files
```

## Initial Setup Instructions

### Prerequisites
```bash
# Install required tools
node >= 20.0.0
pnpm >= 9.0.0
postgresql >= 15
redis (optional, use Upstash)
```

### Environment Variables
Create `.env` file with:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/comicwise"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
AUTH_GOOGLE_CLIENT_ID=""
AUTH_GOOGLE_CLIENT_SECRET=""
AUTH_GITHUB_CLIENT_ID=""
AUTH_GITHUB_CLIENT_SECRET=""

# Email
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_SERVER_HOST="smtp.resend.com"
EMAIL_SERVER_PORT="587"
EMAIL_FROM="noreply@comicwise.com"
RESEND_API_KEY=""

# ImageKit
IMAGEKIT_PUBLIC_KEY=""
IMAGEKIT_PRIVATE_KEY=""
IMAGEKIT_URL_ENDPOINT=""

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Installation Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd comicwise

# 2. Install dependencies
pnpm install

# 3. Setup database
pnpm db:generate
pnpm db:push

# 4. Seed database (optional)
pnpm seed:all

# 5. Start development server
pnpm dev
```

## Database Schema

### Core Tables
- **user** - User accounts with NextAuth integration
- **account** - OAuth provider accounts
- **session** - User sessions
- **comic** - Comic entries
- **chapter** - Comic chapters
- **author** - Comic authors
- **artist** - Comic artists
- **genre** - Comic genres
- **type** - Comic types
- **bookmark** - User bookmarks
- **comment** - User comments

### Key Features
- Full-text search on comics, chapters, authors, artists
- Automatic slug generation
- Cascade deletes for referential integrity
- Optimized indexes for performance

## Development Workflow

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate migrations
pnpm db:push          # Push schema changes
pnpm db:studio        # Open Drizzle Studio
pnpm db:migrate       # Run migrations

# Seeding
pnpm seed:all         # Seed all data
pnpm seed:users       # Seed users only
pnpm seed:comics      # Seed comics only
pnpm seed:validate    # Validate seed data

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm format           # Format with Prettier
pnpm type-check       # TypeScript check

# Testing
pnpm test             # Run tests
pnpm test:watch       # Watch mode
pnpm test:e2e         # E2E tests
```

### Path Aliases

The project uses custom path aliases for cleaner imports:

```typescript
import { db } from "@/database/db"
import { Button } from "ui/button"
import { getComics } from "queries/comics"
import { createComic } from "mutations/comics"
import { UserRole } from "types/database"
```

## Key Components

### Authentication System
- JWT-based session management
- Multiple OAuth providers
- Email verification
- Password hashing with bcrypt
- Role-based access control (user, admin, moderator)

### Comic Management
- CRUD operations for comics, chapters, authors, artists
- Image upload with ImageKit integration
- Full-text search capabilities
- Bookmark system
- Comment system with threading

### Admin Dashboard
- User management
- Content moderation
- Analytics and charts
- Bulk operations

### Caching Strategy
- Redis caching for frequent queries
- Automatic cache invalidation
- Rate limiting for API routes

## Seeding System

### Dynamic Data Loading
The seeding system supports multiple JSON data sources:

```bash
# Place your data files in project root:
users.json
comics.json
chapters.json
comicsdata1.json
comicsdata2.json
chaptersdata1.json
chaptersdata2.json
```

### Seed Features
- Automatic duplicate detection
- Image downloading and upload
- Relationship mapping
- Transaction support
- Progress tracking
- Error recovery

### Custom Seeding

```bash
# Validate data before seeding
pnpm seed:validate

# Seed with custom data
pnpm seed:custom --file=mydata.json
```

## Configuration Files

### TypeScript Config
- Strict type checking enabled
- Path aliases configured
- Next.js plugin integration
- Custom type roots

### ESLint Config
- Next.js best practices
- React hooks rules
- Tailwind CSS class sorting
- Import ordering

### Prettier Config
- 2-space indentation
- 100 character line width
- Semicolons enforced
- Tailwind CSS plugin integration

## Common Tasks

### Adding a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Generate types if needed
pnpm db:generate

# 3. Add components/routes
# Follow existing patterns in src/

# 4. Add tests
# Create test files alongside components

# 5. Run checks
pnpm lint && pnpm type-check

# 6. Commit changes
git commit -m "feat: add my feature"
```

### Database Schema Changes

```bash
# 1. Update schema.ts
# Edit src/database/schema.ts

# 2. Generate migration
pnpm db:generate

# 3. Apply changes
pnpm db:push

# 4. Update seed data if needed
# Edit seed files in src/database/seed/
```

### Adding New API Route

```typescript
// src/app/api/my-route/route.ts
import { NextResponse } from "next/server"
import { auth } from "auth"

export async function GET() {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // Your logic here
  return NextResponse.json({ data: "result" })
}
```

## Deployment

### Build for Production

```bash
# 1. Install dependencies
pnpm install --frozen-lockfile

# 2. Generate Prisma client
pnpm db:generate

# 3. Build application
pnpm build

# 4. Run migrations
pnpm db:migrate

# 5. Start server
pnpm start
```

### Docker Deployment

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up -d
```

### Environment Variables (Production)
- Set all required environment variables
- Use production database URLs
- Configure proper CORS settings
- Enable security headers
- Set up monitoring and logging

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify PostgreSQL is running
   - Ensure database exists

2. **Type Errors**
   - Run `pnpm type-check`
   - Regenerate types with `pnpm db:generate`
   - Clear Next.js cache: `rm -rf .next`

3. **Module Resolution Errors**
   - Check tsconfig.json path aliases
   - Restart TypeScript server in VSCode
   - Clear node_modules and reinstall

4. **Build Errors**
   - Clear build cache: `pnpm clean`
   - Check for circular dependencies
   - Verify all imports are correct

## Best Practices

### Code Style
- Use TypeScript strict mode
- Follow DRY principles
- Use CamelCase for file names
- Prefer server components
- Use server actions for mutations

### Performance
- Implement proper caching
- Use React.memo for expensive components
- Optimize images with next/image
- Enable gzip compression
- Use dynamic imports for code splitting

### Security
- Validate all user inputs
- Use parameterized queries
- Implement rate limiting
- Sanitize data before display
- Use HTTPS in production

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [NextAuth.js](https://authjs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and type checks
6. Submit a pull request

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review the code comments

---

**Last Updated**: 2025-12-26
**Version**: 1.0.0
