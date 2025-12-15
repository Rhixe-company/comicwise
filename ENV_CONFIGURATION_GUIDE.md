# Environment Configuration Usage Examples

This file demonstrates how to use the environment configuration in your
ComicWise components.

## Basic Usage in Components

### Server Components (RSC - React Server Components)

```typescript
// src/components/Dashboard.tsx
import { appConfig, env, isDevelopment } from "@/app-config";

export default function Dashboard() {
  // Access configuration with type safety
  const appName = appConfig.name; // "ComicWise"
  const appUrl = appConfig.url; // "http://localhost:3000"

  // Check environment
  if (isDevelopment) {
    console.log("Running in development mode");
  }

  // Access feature flags
  const emailEnabled = appConfig.features.email;
  const uploadsEnabled = appConfig.features.imageUpload;

  return (
    <div>
      <h1>{appName}</h1>
      <p>App URL: {appUrl}</p>
      {emailEnabled && <p>Email features are enabled</p>}
      {uploadsEnabled && <p>Image uploads are enabled</p>}
    </div>
  );
}
```

### Client Components

```typescript
// src/components/ClientComponent.tsx
"use client";

import { appConfig } from "@/app-config";

export default function ClientComponent() {
  // Public environment variables only (NEXT_PUBLIC_*)
  const appUrl = appConfig.url;

  // This is safe because only NEXT_PUBLIC_* variables are exposed to the client
  const handleUpload = async (file: File) => {
    const response = await fetch(`${appUrl}/api/upload`, {
      method: "POST",
      body: file,
    });
    return response.json();
  };

  return <button onClick={() => handleUpload(null)}>Upload Image</button>;
}
```

## Advanced Usage Examples

### Database Connection

```typescript
// src/lib/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import { appConfig } from "@/app-config";

// Use environment-configured database URL
const client = postgres(appConfig.database.url);
export const db = drizzle(client, { schema });
```

### Authentication Setup

```typescript
// src/lib/auth.ts
import { appConfig, env } from "@/app-config";

export const authConfig = {
  secret: appConfig.auth.secret,
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/register",
    signOut: "/auth/signout",
  },
  providers: [
    // Conditionally add OAuth providers based on env vars
    ...(appConfig.auth.providers.google ? [GoogleProvider(...)] : []),
    ...(appConfig.auth.providers.github ? [GithubProvider(...)] : []),
    // Credentials provider always available
    CredentialsProvider(...),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      // Use type-safe session configuration
      return {
        ...session,
        maxAge: appConfig.session.maxAge,
      };
    },
  },
};
```

### Email Service

```typescript
// src/lib/email.ts
import nodemailer from "nodemailer";
import { appConfig } from "@/app-config";

const transporter = nodemailer.createTransport({
  host: appConfig.email.host,
  port: appConfig.email.port,
  secure: appConfig.email.secure,
  auth: {
    user: appConfig.email.user,
    pass: appConfig.email.password,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  // Check if email is enabled before sending
  if (!appConfig.email.enabled) {
    console.warn("Email service is not configured");
    return null;
  }

  try {
    return await transporter.sendMail({
      from: appConfig.email.from,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}
```

### File Upload Handler

```typescript
// src/lib/upload.ts
import { appConfig } from "@/app-config";

export async function handleUpload(file: File) {
  const { provider } = appConfig.upload;

  // Validate file size
  if (file.size > appConfig.upload.maxFileSize) {
    throw new Error(`File size exceeds ${appConfig.upload.maxFileSize} bytes`);
  }

  // Validate file type
  if (!appConfig.upload.allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed`);
  }

  // Route to appropriate provider
  switch (provider) {
    case "imagekit":
      if (!appConfig.upload.imageKit.enabled) {
        throw new Error("ImageKit is not configured");
      }
      return uploadToImageKit(file);

    case "cloudinary":
      if (!appConfig.upload.cloudinary.enabled) {
        throw new Error("Cloudinary is not configured");
      }
      return uploadToCloudinary(file);

    case "local":
    default:
      return uploadLocally(file);
  }
}
```

### Rate Limiting

```typescript
// src/lib/ratelimit.ts
import { appConfig } from "@/app-config";

export async function checkRateLimit(
  key: string,
  limit: "auth" | "api" | "email"
) {
  const config = appConfig.rateLimit[limit];

  // Use Redis if available, otherwise use in-memory store
  if (appConfig.redis.enabled) {
    // Use Upstash Redis
    const remaining = await redis.decr(key);
    return remaining > 0;
  } else {
    // Fallback to in-memory (dev only)
    return checkMemoryRateLimit(key, config);
  }
}
```

### API Endpoint

```typescript
// src/app/api/upload/route.ts
import { appConfig, isProduction } from "@/app-config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Check if uploads are enabled
  if (!appConfig.features.imageUpload) {
    return NextResponse.json(
      { error: "Image uploads are not enabled" },
      { status: 403 }
    );
  }

  // In production, enforce authentication
  if (isProduction) {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const file = await request.formData();
    const result = await handleUpload(file);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
```

## Type Safety & IDE Support

```typescript
// All configuration is fully typed via TypeScript/Zod

import { appConfig, env, type Env } from "@/app-config";

// AppConfig type
const config: typeof appConfig = appConfig;

// Env type for direct environment access
const environment: Env = env;

// IDE will provide autocomplete for all properties:
// appConfig.auth.secret
// appConfig.database.url
// appConfig.upload.provider
// appConfig.email.enabled
// appConfig.features.comments
// etc.
```

## Environment Detection Utilities

```typescript
import { isDevelopment, isProduction, isTest, appConfig } from "@/app-config";

// Check environment
if (isDevelopment) {
  // Dev-only code
}

if (isProduction) {
  // Production-only code
}

if (isTest) {
  // Test-only code
}

// Check features
if (appConfig.features.comments) {
  // Comments are enabled
}

if (appConfig.features.oauth) {
  // OAuth is configured
}

// Check services
if (appConfig.features.backgroundJobs) {
  // QStash is available for background jobs
}

if (appConfig.features.rateLimiting) {
  // Upstash Redis is configured
}
```

## Environment Validation Errors

The configuration automatically validates on startup:

```typescript
// Missing required variable error example:
// ⚠️  Environment validation warnings:
//   DATABASE_URL: Required (invalid_type)
//   AUTH_SECRET: String must contain at least 32 character(s) (too_small)

// Fix: Ensure all required variables are set in .env.local:
// DATABASE_URL=postgresql://...
// AUTH_SECRET=very-long-secret-at-least-32-characters
```

## Best Practices

1. **Never commit .env.local**: It's in .gitignore for a reason
2. **Use type safety**: Let TypeScript catch configuration errors
3. **Check feature flags**: Before using optional features
4. **Validate on startup**: Configuration validates automatically when imported
5. **Use fallback values**: Development mode has sensible defaults
6. **Document secrets**: Add comments in .env.example for what each variable
   does
7. **Production first**: Always test with production configuration locally

## Debugging Configuration

```typescript
// Debug environment setup:
import { appConfig, env } from "@/app-config";

// Log configuration (safe in dev, avoid in production)
if (process.env.NODE_ENV === "development") {
  console.log({
    name: appConfig.name,
    url: appConfig.url,
    database: appConfig.database.url,
    uploadProvider: appConfig.upload.provider,
    features: appConfig.features,
  });
}
```
