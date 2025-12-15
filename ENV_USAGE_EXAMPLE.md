# Environment Configuration Usage Examples

## Overview

The ComicWise project uses a robust environment configuration system with:

- **Zod validation** for type-safe environment variables
- **Fallback values** for development
- **Helper functions** for checking and accessing env vars
- **Feature flags** based on env configuration
- **Helpful error messages** for missing required variables

## Files

- `.env.example` - Template with all available variables
- `.env.local` - Your local configuration (never committed)
- `src/app-config/env.ts` - Zod schema & validation logic
- `src/app-config/index.ts` - Typed configuration object

## Basic Setup

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in required variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `AUTH_SECRET` - Min 32 characters (generate with:
     `openssl rand -base64 32`)
   - `AUTH_URL` - Application URL
   - `NEXT_PUBLIC_APP_URL` - Public app URL

3. Start development:

```bash
pnpm dev
```

## Usage in Components

### Server Components (Next.js 16)

```typescript
// src/app/admin/dashboard/page.tsx
import { appConfig, isDevelopment } from "@/app-config";

export default function DashboardPage() {
  // Access configuration
  const databaseEnabled = !!appConfig.database.url;
  const emailEnabled = appConfig.features.email;
  const isDevMode = isDevelopment;

  return (
    <div>
      <h1>{appConfig.name}</h1>
      <p>App URL: {appConfig.url}</p>
      <p>Environment: {appConfig.env.current}</p>
      {emailEnabled && <p>Email notifications enabled</p>}
      {isDevMode && <p className="text-red-500">Development mode</p>}
    </div>
  );
}
```

### Server Actions

```typescript
// src/app/auth/actions.ts
"use server";

import { appConfig } from "@/app-config";
import { sendEmail } from "@/lib/email";

export async function registerUser(email: string) {
  // Check if email feature is enabled
  if (!appConfig.features.email) {
    throw new Error("Email verification is not enabled");
  }

  // Use configuration in business logic
  const tokenExpiry = appConfig.security.tokenExpiry.emailVerification;

  // Generate verification token (expires in 24h)
  const token = generateToken({ expiresIn: tokenExpiry });

  await sendEmail({
    to: email,
    subject: `Verify your ${appConfig.name} account`,
    text: `Click here to verify: ${appConfig.url}/verify?token=${token}`,
  });
}
```

### API Routes

```typescript
// src/app/api/upload/route.ts
import { appConfig } from "@/app-config";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Check if upload feature is enabled
  if (!appConfig.features.imageUpload) {
    return NextResponse.json(
      { error: "Upload not configured" },
      { status: 503 }
    );
  }

  const file = await request.formData().then((data) => data.get("file"));

  // Use provider from config
  const provider = appConfig.upload.provider;

  if (provider === "imagekit" && appConfig.upload.imageKit.enabled) {
    // Use ImageKit
    const url = await uploadToImageKit(file);
    return NextResponse.json({ url });
  }

  if (provider === "cloudinary" && appConfig.upload.cloudinary.enabled) {
    // Use Cloudinary
    const url = await uploadToCloudinary(file);
    return NextResponse.json({ url });
  }

  // Fallback to local
  const url = await uploadLocal(file);
  return NextResponse.json({ url });
}
```

### Middleware

```typescript
// src/middleware.ts
import { appConfig, isDevelopment } from "@/app-config";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Check auth URL matches
  const origin = request.nextUrl.origin;
  if (appConfig.auth.url && !origin.includes(appConfig.auth.url)) {
    return NextResponse.redirect(appConfig.auth.url);
  }

  // Skip rate limiting in development
  if (!isDevelopment && appConfig.features.rateLimiting) {
    // Apply rate limiting logic
  }

  return NextResponse.next();
}
```

### Database Operations

```typescript
// src/database/seed/index.ts
import { appConfig } from "@/app-config";

async function seedDatabase() {
  // Access database config
  const dbUrl = appConfig.database.url;

  if (!dbUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  // Enable connection pooling in production
  const poolEnabled = appConfig.database.pooling;

  console.log(`Seeding ${appConfig.name} database...`);
  console.log(`Pooling: ${poolEnabled ? "enabled" : "disabled"}`);

  // Your seeding logic here
}
```

### Email Service

```typescript
// src/lib/email.ts
import { appConfig } from "@/app-config";
import nodemailer from "nodemailer";

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  // Check if email is configured
  if (!appConfig.email.enabled) {
    console.warn("Email not configured. Skipping...");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: appConfig.email.host,
    port: appConfig.email.port,
    secure: appConfig.email.secure,
    auth: appConfig.email.user
      ? {
          user: appConfig.email.user,
          pass: appConfig.email.password,
        }
      : undefined,
  });

  await transporter.sendMail({
    from: appConfig.email.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}
```

### Authentication

```typescript
// src/lib/auth.ts
import { appConfig } from "@/app-config";
import { unstable_cache } from "next/cache";
import type { Session } from "next-auth";

export const getSession = unstable_cache(
  async (): Promise<Session | null> => {
    // Use session config
    const { sessionMaxAge } = appConfig.auth;

    // Your auth logic here
    return null;
  },
  ["session"],
  { revalidate: appConfig.session.updateAge }
);
```

### Rate Limiting

```typescript
// src/lib/ratelimit.ts
import { appConfig } from "@/app-config";

export async function checkRateLimit(
  key: string,
  type: "auth" | "email" | "api"
) {
  const config = appConfig.rateLimit[type];

  // Apply rate limiting based on config
  // { requests: 5, window: 15 * 60 } means 5 requests per 15 minutes

  const isLimited = (await redis.incr(key)) > config.requests;

  if (isLimited) {
    return { limited: true, resetIn: config.window };
  }

  return { limited: false };
}
```

## Type Safety

All configuration is fully typed:

```typescript
import { appConfig } from "@/app-config";
import type { Env } from "@/app-config/env";

// Full autocomplete support
appConfig.database.url; // ✅ string
appConfig.auth.secret; // ✅ string
appConfig.email.enabled; // ✅ boolean
appConfig.features.comments; // ✅ boolean
appConfig.rateLimit.auth; // ✅ { requests: number; window: number }

// Type from env schema
function handleEnv(env: Env) {
  // Fully typed environment object
  console.log(env.DATABASE_URL); // ✅ string
  console.log(env.AUTH_SECRET); // ✅ string
  console.log(env.NODE_ENV); // ✅ "development" | "production" | "test"
}
```

## Helper Functions

```typescript
import { appConfig, env, hasEnv, getEnv, isDevelopment } from "@/app-config";

// Check if env var is set
if (hasEnv("AUTH_GOOGLE_CLIENT_ID")) {
  // OAuth enabled
}

// Get with type safety
const dbUrl = getEnv("DATABASE_URL", "postgresql://localhost/fallback");

// Environment checks
if (isDevelopment) {
  console.log("Running in development mode");
}

// Feature checks
if (appConfig.features.oauth) {
  // Show OAuth buttons
}

if (appConfig.features.backgroundJobs) {
  // Enable job queue
}
```

## Development Setup

### Docker Services

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up

# Or individually:

# PostgreSQL
docker run --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -d -p 5432:5432 \
  postgres:latest

# Redis
docker run -d -p 6379:6379 redis:latest

# MailHog (email testing)
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
# View emails at http://localhost:8025
```

### Database Setup

```bash
# Apply migrations
pnpm db:push

# Seed sample data
pnpm db:seed
```

## Production Deployment

Ensure these are set:

```bash
# Required
DATABASE_URL=<production-postgres-url>
AUTH_SECRET=<strong-32+-char-secret>
AUTH_URL=<your-domain.com>
NEXT_PUBLIC_APP_URL=<https://your-domain.com>

# Email (if enabled)
EMAIL_SERVER_HOST=<smtp.provider.com>
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=<your-email@provider.com>
EMAIL_SERVER_PASSWORD=<app-password>

# OAuth (if enabled)
AUTH_GOOGLE_CLIENT_ID=<from-google-cloud>
AUTH_GOOGLE_CLIENT_SECRET=<from-google-cloud>

# Optional but recommended
REDIS_URL=<upstash-redis-url>
QSTASH_TOKEN=<upstash-qstash-token>
```

## Troubleshooting

### Connection Errors

```typescript
// Check database connection
import { appConfig } from "@/app-config";

console.log("Database URL:", appConfig.database.url);
console.log("Auth URL:", appConfig.auth.url);
console.log("Email enabled:", appConfig.features.email);
```

### Missing Variables

The system will warn about missing required variables:

```
⚠️  Environment validation warnings:
  DATABASE_URL: String must be a valid URL
  AUTH_SECRET: String must contain at least 32 character(s)
```

### Feature Disabled

```typescript
if (!appConfig.features.email) {
  throw new Error(
    "Email is not configured. " +
      "Set EMAIL_SERVER_USER and EMAIL_SERVER_PASSWORD in .env.local"
  );
}
```

## Configuration Reference

See `src/app-config/index.ts` for complete typed configuration object with all
available properties and defaults.
