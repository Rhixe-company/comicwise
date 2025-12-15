# Complete Working Example: Authentication Component

This is a real-world example of how to use the environment configuration in a
complete feature.

## Full Example: Sign-In Component with Environment Configuration

### Step 1: Create the Sign-In Page

```typescript
// src/app/(auth)/sign-in/page.tsx
import { appConfig, env } from "@/app-config";
import { SignInForm } from "./SignInForm";

export const metadata = {
  title: "Sign In to " + appConfig.name,
  description: "Sign in to your account",
};

export default function SignInPage() {
  // Check if credentials auth is available
  if (!appConfig.auth.providers.credentials) {
    return (
      <div className="error">
        <h1>Sign In Disabled</h1>
        <p>Credentials authentication is not enabled.</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h1>Welcome to {appConfig.name}</h1>
      <SignInForm />

      {appConfig.auth.providers.google && (
        <button>Sign in with Google</button>
      )}

      {appConfig.auth.providers.github && (
        <button>Sign in with GitHub</button>
      )}
    </div>
  );
}
```

### Step 2: Create the Sign-In Form Component

```typescript
// src/app/(auth)/sign-in/SignInForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { appConfig } from "@/app-config";
import { signInSchema } from "@/lib/validations/schemas";
import type { SignInInput } from "@/lib/validations/schemas";

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        email: formData.get("email"),
        password: formData.get("password"),
      };

      // Validate using the same schema as the backend
      const validated = signInSchema.parse(data);

      // Call the sign-in API (uses appConfig internally)
      const response = await fetch(`${appConfig.url}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Sign in failed");
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          disabled={isLoading}
        />
      </div>

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-small">
        {appConfig.features.emailVerification && (
          <>Don't have an account? <a href="/register">Register here</a></>
        )}
      </p>

      <p className="text-small">
        Session will expire after {appConfig.auth.sessionMaxAge / (24 * 60 * 60)} days of inactivity.
      </p>
    </form>
  );
}
```

### Step 3: Create the Sign-In API Route

```typescript
// src/app/api/auth/signin/route.ts
import { appConfig, isProduction } from "@/app-config";
import { signInSchema } from "@/lib/validations/schemas";
import { checkRateLimit } from "@/lib/ratelimit";
import { verifyPassword } from "@/lib/auth";
import { getUserByEmail } from "@/database/queries/users";
import { createSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting configuration
    const rateConfig = appConfig.rateLimit.auth;
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const isLimited = await checkRateLimit(`signin:${ip}`, rateConfig);

    if (!isLimited) {
      return NextResponse.json(
        { error: "Too many sign-in attempts. Try again later." },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const validated = signInSchema.parse(body);

    // Find user
    const user = await getUserByEmail(validated.email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password with configured bcrypt rounds
    const passwordValid = await verifyPassword(
      validated.password,
      user.password,
      appConfig.security.bcryptRounds
    );

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if email verification is required and user is verified
    if (appConfig.features.emailVerification && !user.emailVerified) {
      // Send verification email if email is enabled
      if (appConfig.email.enabled) {
        // Send verification email logic...
      }

      return NextResponse.json(
        { error: "Please verify your email first", code: "UNVERIFIED_EMAIL" },
        { status: 401 }
      );
    }

    // Create session with configured expiry
    const sessionToken = await createSession({
      userId: user.id,
      expiresAt: new Date(Date.now() + appConfig.session.maxAge * 1000),
    });

    // Create response with session cookie
    const response = NextResponse.json(
      { success: true, user: { id: user.id, email: user.email } },
      { status: 200 }
    );

    response.cookies.set("session", sessionToken, {
      maxAge: appConfig.session.maxAge,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Sign-in error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Sign-in failed. Please try again." },
      { status: 500 }
    );
  }
}
```

### Step 4: Create the Auth Context

```typescript
// src/lib/auth-context.tsx
"use client";

import React, { createContext, useContext, useCallback } from "react";
import { appConfig } from "@/app-config";

interface AuthContextType {
  appName: string;
  isOAuthAvailable: boolean;
  sessionMaxAge: number;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const handleSignOut = useCallback(async () => {
    const response = await fetch(`${appConfig.url}/api/auth/signout`, {
      method: "POST",
    });

    if (response.ok) {
      window.location.href = "/";
    }
  }, []);

  const value: AuthContextType = {
    appName: appConfig.name,
    isOAuthAvailable: appConfig.auth.providers.google || appConfig.auth.providers.github,
    sessionMaxAge: appConfig.auth.sessionMaxAge,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

### Step 5: Use in the Root Layout

```typescript
// src/app/layout.tsx
import { AuthProvider } from "@/lib/auth-context";
import { appConfig } from "@/app-config";

export const metadata = {
  title: {
    default: appConfig.name,
    template: `%s | ${appConfig.name}`,
  },
  description: appConfig.description,
  applicationName: appConfig.name,
  keywords: ["comics", "reading", "platform"],
  openGraph: {
    title: appConfig.name,
    description: appConfig.description,
    url: appConfig.url,
    siteName: appConfig.name,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

### Step 6: Use the Auth Context in Components

```typescript
// src/components/UserMenu.tsx
"use client";

import { useAuth } from "@/lib/auth-context";

export function UserMenu() {
  const { appName, signOut } = useAuth();

  const handleLogout = async () => {
    if (
      confirm(
        `Are you sure you want to sign out from ${appName}?`
      )
    ) {
      await signOut();
    }
  };

  return (
    <div className="user-menu">
      <button onClick={handleLogout}>Sign Out</button>
    </div>
  );
}
```

## Key Points from This Example

1. **Configuration-Driven**: All settings come from `appConfig`
2. **Type-Safe**: Full TypeScript support from schema to usage
3. **Feature Flags**: Conditionally render based on configuration
4. **Rate Limiting**: Uses appConfig rate limit settings
5. **Security**: Uses appConfig security settings (bcrypt rounds)
6. **Sessions**: Uses appConfig session configuration
7. **Email**: Checks if email service is enabled
8. **OAuth**: Conditionally shows OAuth buttons based on config
9. **Validation**: Uses Zod schema from config
10. **Environment Aware**: Different behavior in production vs development

## Environment Variables Used

```bash
# Required
DATABASE_URL=postgresql://...
AUTH_SECRET=...
AUTH_URL=http://localhost:3000

# Optional (conditionally used)
AUTH_GOOGLE_CLIENT_ID=...
AUTH_GITHUB_CLIENT_ID=...
EMAIL_SERVER_HOST=...
EMAIL_SERVER_USER=...
EMAIL_SERVER_PASSWORD=...
UPSTASH_REDIS_REST_URL=...

# Development defaults
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing This Example

```bash
# 1. Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# 2. Start services
docker-compose -f docker-compose.dev.yml up

# 3. Run migrations
pnpm db:push

# 4. Start dev server
pnpm dev

# 5. Visit http://localhost:3000/auth/signin
```

This example demonstrates: ✅ Using appConfig in server components ✅ Using
appConfig in client components ✅ API routes with environment configuration ✅
Rate limiting with configured limits ✅ Security with configured bcrypt rounds
✅ Conditional features based on environment ✅ Session management with
configured expiry ✅ Type-safe validation with Zod schema ✅ Environment-aware
redirects ✅ Production vs development handling
