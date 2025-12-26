import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: false,
    typedEnv: true,
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    staticGenerationRetryCount: 2,
    staticGenerationMaxConcurrency: 16,
    staticGenerationMinPagesPerWorker: 25,
    optimizePackageImports: [
      "radix-ui/react-icons",
      "radix-ui/react-avatar",
      "radix-ui/react-dialog",
      "radix-ui/react-dropdown-menu",
      "radix-ui/react-select",
      "radix-ui/react-tabs",
      "radix-ui/react-accordion",
      "radix-ui/react-popover",
      "radix-ui/react-tooltip",
      "lucide-react",
      "tabler/icons-react",
      "framer-motion",
      "recharts",
    ],
    serverActions: {
      bodySizeLimit: "5mb",
      allowedOrigins: ["localhost:3000"],
    },
  },
  serverExternalPackages: ["postgres", "server-only", "libsql/client"],
  cacheComponents: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "gg.asuracomic.net" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "localhost" },
      { protocol: "http", hostname: "localhost" },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  typedRoutes: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  devIndicators: {
    position: "bottom-right",
  },
  bundlePagesRouterDependencies: true,
  poweredByHeader: false,
  compress: true,
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "X-DNS-Prefetch-Control",
          value: "on",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        {
          key: "X-Frame-Options",
          value: "SAMEORIGIN",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "origin-when-cross-origin",
        },
        {
          key: "X-UA-Compatible",
          value: "IE=edge",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
