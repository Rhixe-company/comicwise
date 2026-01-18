# 🚀 ComicWise - Modern Web Comic Platform

![Next.js](https://img.shields.io/badge/Next.js-16.1.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-red?style=for-the-badge&logo=redis)

> A cutting-edge web comic reading platform built with Next.js 16, PostgreSQL, Redis, and AI-powered features.

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

---

## ✨ Features

- 📚 **Modern Stack** - Next.js 16, React 19, TypeScript 5
- 🔐 **Authentication** - NextAuth v5 with multiple providers
- 💾 **Database** - PostgreSQL with Drizzle ORM
- ⚡ **Caching** - Redis for high performance
- 🎨 **UI Components** - Shadcn/ui with Tailwind CSS 4
- 🖼️ **CDN Integration** - ImageKit/Cloudinary support
- 🧪 **Testing** - Vitest + Playwright
- 🐳 **Docker Ready** - Full containerization support

---

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/yourusername/comicwise.git
cd comicwise

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your configuration

# 4. Setup database
pnpm db:push && pnpm db:seed

# 5. Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 📋 Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL 16+
- Redis 7+ (optional)

---

## ⚙️ Environment Setup

Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/comicwise"

# Auth
AUTH_SECRET="<generate-with-openssl-rand-base64-32>"
AUTH_TRUST_HOST="true"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Seed
CUSTOM_PASSWORD="<your-secure-password>"
```

---

## 💻 Development Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | TypeScript validation |
| `pnpm test` | Run E2E tests |
| `pnpm test:unit` | Run unit tests |
| `pnpm db:push` | Push database schema |
| `pnpm db:seed` | Seed database |
| `pnpm db:studio` | Open Drizzle Studio |

---

## 📁 Project Structure

```
comicwise/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── database/         # Drizzle ORM & queries
│   ├── lib/              # Utilities & configurations
│   └── services/         # Business logic
├── public/               # Static assets
├── scripts/              # Build & utility scripts
└── .vscode/              # VS Code configuration
```

---

## 🧪 Testing

```bash
# Unit tests
pnpm test:unit

# E2E tests
pnpm test

# Watch mode
pnpm test:unit:watch

# Coverage
pnpm test:unit:coverage
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
pnpm deploy:vercel
```

### Docker

```bash
pnpm docker:build
pnpm docker:up
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

<div align="center">

**Built with ❤️ by the ComicWise Team**

</div>
