// ═══════════════════════════════════════════════════
// POSTCSS CONFIGURATION (Next.js 16 TypeScript Config)
// ═══════════════════════════════════════════════════

import { isProduction } from "./src/app-config";
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // ═══════════════════════════════════════════════════
    // Import Resolution
    // ═══════════════════════════════════════════════════
    "postcss-import": {},

    // ═══════════════════════════════════════════════════
    // Tailwind CSS v4 (Native PostCSS Support)
    // ═══════════════════════════════════════════════════
    "@tailwindcss/postcss": {},

    // ═══════════════════════════════════════════════════
    // Nesting Support (CSS Nesting Module)
    // ═══════════════════════════════════════════════════
    "postcss-nested": {},

    // ═══════════════════════════════════════════════════
    // Autoprefixer (Production Only)
    // ═══════════════════════════════════════════════════
    ...(isProduction
      ? {
          autoprefixer: {
            flexbox: "no-2009",
            grid: "autoplace",
          },
        }
      : {}),

    // ═══════════════════════════════════════════════════
    // CSSnano (Production Optimization)
    // ═══════════════════════════════════════════════════
    ...(isProduction
      ? {
          cssnano: {
            preset: [
              "advanced",
              {
                discardComments: {
                  removeAll: true,
                },
                reduceIdents: false,
                zindex: false,
                autoprefixer: false, // Already handled above
              },
            ],
          },
        }
      : {}),
  },
};

export default config;
