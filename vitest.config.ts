import path from "path";
import react from "vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/playwright-report/**",
      "**/test-results/**",
      "tests/**/*.spec.ts", // Exclude Playwright E2E tests
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData/",
        "**/*.spec.ts",
        "**/*.test.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "": path.resolve(__dirname, "./src"),
      actions: path.resolve(__dirname, ".lib/actions"),
      admin: path.resolve(__dirname, ".components/admin"),
      appConfig: path.resolve(__dirname, "./app-config"),
      assets: path.resolve(__dirname, "./assets"),
      auth: path.resolve(__dirname, ".lib/auth"),
      authAdapter: path.resolve(__dirname, ".lib/authAdapter"),
      authConfig: path.resolve(__dirname, ".lib/authConfig"),
      dal: path.resolve(__dirname, "./dal"),
      database: path.resolve(__dirname, ".database"),
      db: path.resolve(__dirname, ".database/db"),
      dto: path.resolve(__dirname, "./dto"),
      emails: path.resolve(__dirname, ".components/emails"),
      env: path.resolve(__dirname, ".lib/env"),
      hooks: path.resolve(__dirname, "./hooks"),
      layout: path.resolve(__dirname, ".components/layout"),
      lib: path.resolve(__dirname, ".lib"),
      mutations: path.resolve(__dirname, ".database/mutations"),
      public: path.resolve(__dirname, "./public"),
      queries: path.resolve(__dirname, ".database/queries"),
      redis: path.resolve(__dirname, "./redis"),
      schema: path.resolve(__dirname, ".database/schema"),
      services: path.resolve(__dirname, "./services"),
      src: path.resolve(__dirname, "./src"),
      stores: path.resolve(__dirname, "./stores"),
      styles: path.resolve(__dirname, "./styles"),
      tests: path.resolve(__dirname, "./tests"),
      types: path.resolve(__dirname, "./types"),
      ui: path.resolve(__dirname, ".ui"),
      utils: path.resolve(__dirname, ".lib/utils"),
      validations: path.resolve(__dirname, ".lib/validations"),
    },
  },
});
