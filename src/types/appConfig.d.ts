declare module "@/appConfig" {
  export const env: {
    AUTH_URL: string;
    AWS_ACCESS_KEY_ID?: string;
    AWS_REGION?: string;
    AWS_S3_BUCKET?: string;
    AWS_S3_BUCKET_NAME?: string;
    AWS_SECRET_ACCESS_KEY?: string;
    CI: any;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
    CLOUDINARY_CLOUD_NAME?: string;
    DATABASE_URL: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    IMAGEKIT_PRIVATE_KEY?: string;
    IMAGEKIT_PUBLIC_KEY?: string;
    IMAGEKIT_URL_ENDPOINT?: string;
    NEXT_PUBLIC_APP_URL: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    NODE_ENV: "development" | "production" | "test";
    PORT: string;
    REDIS_DB: number;
    REDIS_HOST?: string;
    REDIS_PASSWORD?: string;
    REDIS_PORT?: string;
    REDIS_TLS_ENABLED: boolean;
    RESEND_API_KEY?: string;
    UPLOAD_PROVIDER: string;
    UPSTASH_REDIS_REST_TOKEN: string;
    UPSTASH_REDIS_REST_URL: string;
  };

  export const isDevelopment: boolean;
  export const isProduction: boolean;
  export const isTest: boolean;

  export function checkRateLimit(
    identifier: string,
    options?: { limit?: number; window?: string }
  ): Promise<{
    allowed: boolean;
    limit: number;
    remaining: number;
    reset: number;
    success: boolean;
  }>;

  export function clearRateLimit(identifier: string): Promise<void>;

  export function getRateLimitStatus(identifier: string): Promise<{
    limit: number;
    remaining: number;
    reset: number;
  }>;

  const appConfig: {
    auth: any;
    customPassword?: string;
    description: string;
    email: {
      auth: {
        pass: string;
        user: string;
      };
      defaultTemplate: string;
      enabled: boolean;
      from: string;
      fromName: string;
      host: string;
      port: number;
      provider: string;
      secure: boolean;
      templates: Record<string, string>;
    };
    features: {
      email: boolean;
      emailVerification: boolean;
      twoFactor: boolean;
    };
    name: string;
    pagination?: {
      chaptersPerPage?: number;
      comicsPerPage?: number;
      defaultLimit?: number;
    };
    rateLimit: {
      auth: number;
      default: number;
      defaultLimit: number;
      defaultWindow: string;
      email: number;
      enabled: boolean;
    };
    security: {
      bcryptRounds?: number;
      maxLoginAttempts: number;
      tokenExpiry?: {
        emailVerification?: number;
        passwordReset?: number;
      };
    };
    session: {
      maxAge: number;
      updateAge: number;
    };
    upload: {
      allowedTypes: string[];
      enabled?: boolean;
      imageKit?: {
        privateKey: string;
        publicKey: string;
        urlEndpoint: string;
      };
      maxSize: number;
    };
    url: string;
  };

  export default appConfig;
}
