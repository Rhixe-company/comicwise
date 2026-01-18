# 🚀 ComicWise - Modern Web Comic Platform

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7+-red?logo=redis)](https://redis.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

**A feature-rich, production-ready web comic reading platform built with modern
web technologies**

</div>

---

## ✨ Features

### 🎨 **User Experience**

- Modern UI/UX with Tailwind CSS & shadcn/ui
- Dark/Light mode theme support
- Reading progress tracking
- Bookmarks & favorites system
- Advanced full-text search
- Community comment system

### 🔐 **Authentication**

- NextAuth v5 with multiple providers
- OAuth (Google, GitHub)
- Role-based access control (User, Moderator, Admin)
- Email verification
- Secure password reset

### 📚 **Content Management**

- Full CRUD operations for comics & chapters
- Genre categorization
- Multi-provider image storage (ImageKit, Cloudinary, AWS S3, Local)
- Efficient bulk data seeding
- Admin dashboard

### ⚡ **Performance**

- Server-side rendering with Next.js 16
- Redis caching layer
- Optimized image delivery via CDN
- Database query optimization
- Background job processing with QStash

---

## 📋 Prerequisites

- **Node.js** 20+
- **pnpm** 9+
- **PostgreSQL** 15+
- **Redis** 7+ (optional)

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/comicwise.git
cd comicwise
pnpm install
```

### 2. Environment Configuration

```bash
cp .env.example .env.local
```

**Minimum required variables:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/comicwise"
AUTH_SECRET="your-secret-here"  # Generate: openssl rand -base64 32
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
pnpm db:push    # Push schema
pnpm db:seed    # Optional: seed sample data
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit **http://localhost:3000** 🎉

---

## 📦 Key Scripts

```bash
pnpm dev              # Development server
pnpm build            # Production build
pnpm start            # Production server
pnpm lint            # Run ESLint
pnpm format          # Format with Prettier
pnpm type-check      # TypeScript check
pnpm test:unit       # Unit tests (Vitest)
pnpm test            # E2E tests (Playwright)
pnpm db:studio       # Drizzle Studio GUI
```

---

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Database**: PostgreSQL + Drizzle ORM
- **Cache**: Redis / Upstash
- **Auth**: NextAuth v5
- **UI**: Tailwind CSS + shadcn/ui
- **Validation**: Zod
- **Testing**: Vitest + Playwright
- **CI/CD**: GitHub Actions

---

## 📂 Project Structure

```
comicwise/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── database/         # DB layer (schema, queries, mutations)
│   ├── lib/              # Utilities & server actions
│   ├── services/         # Business logic
│   └── types/            # TypeScript definitions
├── public/               # Static assets
├── .github/workflows/    # CI/CD pipelines
└── scripts/              # Utility scripts
```

---

## 🔧 Configuration

### Image Storage Providers

```env
# Choose one:
UPLOAD_PROVIDER="local"      # Development
UPLOAD_PROVIDER="imagekit"   # Production (Recommended)
UPLOAD_PROVIDER="cloudinary"
UPLOAD_PROVIDER="aws"
```

### Caching

```env
CACHE_ENABLED="true"
REDIS_URL="redis://localhost:6379"
```

---

## 🧪 Testing

```bash
# Unit tests
pnpm test:unit:run
pnpm test:unit:coverage

# E2E tests
pnpm test
pnpm test:headed
pnpm test:ui
```

---

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Docker

```bash
pnpm docker:build
pnpm docker:up
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 Credits

Built with [Next.js](https://nextjs.org/),
[Drizzle ORM](https://orm.drizzle.team/), [shadcn/ui](https://ui.shadcn.com/),
and ❤️

---

<div align="center">

**[⬆ back to top](#-comicwise---modern-web-comic-platform)**

</div>
